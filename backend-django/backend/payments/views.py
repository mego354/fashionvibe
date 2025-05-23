"""
Payment views for the Fashion Hub project.
"""

from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext_lazy as _
from django.conf import settings
import requests
import json
import hmac
import hashlib
import uuid
from django.views.decorators.csrf import csrf_exempt
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle

from common.permissions import IsStoreOwnerOrManager
from .models import Payment, SubscriptionPayment, WebhookLog
from .serializers import (
    PaymentSerializer, SubscriptionPaymentSerializer,
    PaymentInitiateSerializer, SubscriptionPaymentInitiateSerializer
)


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for payments.
    """
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter payments based on user permissions.
        """
        user = self.request.user
        
        # Store owners and managers can see all payments
        if user.is_store_owner or user.is_store_manager:
            return Payment.objects.all()
        
        # Regular users can only see their own payments
        return Payment.objects.filter(order__user=user)
    
    @action(detail=False, methods=['post'])
    def initiate(self, request):
        """
        Initiate a payment with Paymob.
        """
        serializer = PaymentInitiateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            from orders.models import Order
            
            order_id = serializer.validated_data['order_id']
            payment_method = serializer.validated_data['payment_method']
            
            order = Order.objects.get(id=order_id)
            
            # Generate a unique payment ID
            payment_id = f"PAY-{uuid.uuid4().hex[:8]}"
            
            # Create a payment record
            payment = Payment.objects.create(
                payment_id=payment_id,
                order=order,
                amount=order.total,
                currency=order.user.cart.store.currency if hasattr(order.user, 'cart') and hasattr(order.user.cart, 'store') else 'EGP',
                payment_method=payment_method
            )
            
            # Integrate with Paymob API
            try:
                # Step 1: Authentication request
                auth_response = requests.post(
                    'https://accept.paymob.com/api/auth/tokens',
                    json={'api_key': settings.PAYMOB_API_KEY}
                )
                auth_data = auth_response.json()
                auth_token = auth_data.get('token')
                
                if not auth_token:
                    payment.status = 'failed'
                    payment.error_message = 'Failed to authenticate with Paymob'
                    payment.save()
                    return Response({'detail': _('Payment initiation failed.')}, status=status.HTTP_400_BAD_REQUEST)
                
                # Step 2: Order registration
                order_data = {
                    'auth_token': auth_token,
                    'delivery_needed': 'false',
                    'amount_cents': int(order.total * 100),
                    'currency': payment.currency,
                    'items': []
                }
                
                # Add order items
                for item in order.items.all():
                    order_data['items'].append({
                        'name': item.product_name_en,
                        'amount_cents': int(item.subtotal * 100),
                        'description': item.product.description_en[:100] if hasattr(item.product, 'description_en') else '',
                        'quantity': item.quantity
                    })
                
                order_response = requests.post(
                    'https://accept.paymob.com/api/ecommerce/orders',
                    json=order_data
                )
                order_response_data = order_response.json()
                paymob_order_id = order_response_data.get('id')
                
                if not paymob_order_id:
                    payment.status = 'failed'
                    payment.error_message = 'Failed to register order with Paymob'
                    payment.save()
                    return Response({'detail': _('Payment initiation failed.')}, status=status.HTTP_400_BAD_REQUEST)
                
                # Step 3: Payment key request
                payment_key_data = {
                    'auth_token': auth_token,
                    'amount_cents': int(order.total * 100),
                    'expiration': 3600,
                    'order_id': paymob_order_id,
                    'billing_data': {
                        'apartment': 'NA',
                        'email': order.user.email,
                        'floor': 'NA',
                        'first_name': order.user.first_name,
                        'street': order.shipping_address.address_line1,
                        'building': 'NA',
                        'phone_number': order.user.phone_number,
                        'shipping_method': order.shipping_method,
                        'postal_code': order.shipping_address.postal_code,
                        'city': order.shipping_address.city,
                        'country': order.shipping_address.country,
                        'last_name': order.user.last_name,
                        'state': order.shipping_address.state
                    },
                    'currency': payment.currency,
                    'integration_id': settings.PAYMOB_INTEGRATION_ID
                }
                
                payment_key_response = requests.post(
                    'https://accept.paymob.com/api/acceptance/payment_keys',
                    json=payment_key_data
                )
                payment_key_data = payment_key_response.json()
                payment_key = payment_key_data.get('token')
                
                if not payment_key:
                    payment.status = 'failed'
                    payment.error_message = 'Failed to generate payment key with Paymob'
                    payment.save()
                    return Response({'detail': _('Payment initiation failed.')}, status=status.HTTP_400_BAD_REQUEST)
                
                # Update payment record
                payment.paymob_order_id = str(paymob_order_id)
                payment.response_data = {
                    'auth_token': auth_token,
                    'order_id': paymob_order_id,
                    'payment_key': payment_key
                }
                payment.save()
                
                # Return payment information
                payment_url = f"https://accept.paymob.com/api/acceptance/iframes/{settings.PAYMOB_IFRAME_ID}?payment_token={payment_key}"
                
                return Response({
                    'payment_id': payment.payment_id,
                    'payment_url': payment_url
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                payment.status = 'failed'
                payment.error_message = str(e)
                payment.save()
                return Response({'detail': _('Payment initiation failed.')}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SubscriptionPaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for subscription payments.
    """
    serializer_class = SubscriptionPaymentSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter subscription payments based on user permissions.
        """
        user = self.request.user
        
        # Only store owners can see subscription payments
        if user.is_store_owner:
            return SubscriptionPayment.objects.filter(subscription__store__owner=user)
        
        return SubscriptionPayment.objects.none()
    
    @action(detail=False, methods=['post'])
    def initiate(self, request):
        """
        Initiate a subscription payment with Paymob.
        """
        serializer = SubscriptionPaymentInitiateSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            from subscriptions.models import Subscription
            
            subscription_id = serializer.validated_data['subscription_id']
            payment_method = serializer.validated_data['payment_method']
            
            subscription = Subscription.objects.get(id=subscription_id)
            
            # Generate a unique payment ID
            payment_id = f"SUB-{uuid.uuid4().hex[:8]}"
            
            # Create a subscription payment record
            payment = SubscriptionPayment.objects.create(
                payment_id=payment_id,
                subscription=subscription,
                amount=subscription.price,
                currency=subscription.store.currency,
                payment_method=payment_method,
                billing_period_start=subscription.current_period_start,
                billing_period_end=subscription.current_period_end
            )
            
            # Integrate with Paymob API (similar to regular payment)
            try:
                # Step 1: Authentication request
                auth_response = requests.post(
                    'https://accept.paymob.com/api/auth/tokens',
                    json={'api_key': settings.PAYMOB_API_KEY}
                )
                auth_data = auth_response.json()
                auth_token = auth_data.get('token')
                
                if not auth_token:
                    payment.status = 'failed'
                    payment.error_message = 'Failed to authenticate with Paymob'
                    payment.save()
                    return Response({'detail': _('Payment initiation failed.')}, status=status.HTTP_400_BAD_REQUEST)
                
                # Step 2: Order registration
                order_data = {
                    'auth_token': auth_token,
                    'delivery_needed': 'false',
                    'amount_cents': int(subscription.price * 100),
                    'currency': payment.currency,
                    'items': [{
                        'name': f"{subscription.plan} Subscription",
                        'amount_cents': int(subscription.price * 100),
                        'description': f"Subscription for {subscription.store.name_en}",
                        'quantity': 1
                    }]
                }
                
                order_response = requests.post(
                    'https://accept.paymob.com/api/ecommerce/orders',
                    json=order_data
                )
                order_response_data = order_response.json()
                paymob_order_id = order_response_data.get('id')
                
                if not paymob_order_id:
                    payment.status = 'failed'
                    payment.error_message = 'Failed to register order with Paymob'
                    payment.save()
                    return Response({'detail': _('Payment initiation failed.')}, status=status.HTTP_400_BAD_REQUEST)
                
                # Step 3: Payment key request
                payment_key_data = {
                    'auth_token': auth_token,
                    'amount_cents': int(subscription.price * 100),
                    'expiration': 3600,
                    'order_id': paymob_order_id,
                    'billing_data': {
                        'apartment': 'NA',
                        'email': request.user.email,
                        'floor': 'NA',
                        'first_name': request.user.first_name,
                        'street': 'NA',
                        'building': 'NA',
                        'phone_number': request.user.phone_number,
                        'shipping_method': 'NA',
                        'postal_code': 'NA',
                        'city': 'NA',
                        'country': 'EG',
                        'last_name': request.user.last_name,
                        'state': 'NA'
                    },
                    'currency': payment.currency,
                    'integration_id': settings.PAYMOB_INTEGRATION_ID
                }
                
                payment_key_response = requests.post(
                    'https://accept.paymob.com/api/acceptance/payment_keys',
                    json=payment_key_data
                )
                payment_key_data = payment_key_response.json()
                payment_key = payment_key_data.get('token')
                
                if not payment_key:
                    payment.status = 'failed'
                    payment.error_message = 'Failed to generate payment key with Paymob'
                    payment.save()
                    return Response({'detail': _('Payment initiation failed.')}, status=status.HTTP_400_BAD_REQUEST)
                
                # Update payment record
                payment.paymob_order_id = str(paymob_order_id)
                payment.response_data = {
                    'auth_token': auth_token,
                    'order_id': paymob_order_id,
                    'payment_key': payment_key
                }
                payment.save()
                
                # Return payment information
                payment_url = f"https://accept.paymob.com/api/acceptance/iframes/{settings.PAYMOB_IFRAME_ID}?payment_token={payment_key}"
                
                return Response({
                    'payment_id': payment.payment_id,
                    'payment_url': payment_url
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                payment.status = 'failed'
                payment.error_message = str(e)
                payment.save()
                return Response({'detail': _('Payment initiation failed.')}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class WebhookAnonThrottle(AnonRateThrottle):
    rate = '10/min'

@method_decorator(csrf_exempt, name='dispatch')
class PaymentWebhookView(generics.GenericAPIView):
    """
    Webhook for Paymob payment callbacks.
    """
    permission_classes = []  # No authentication required for webhooks
    throttle_classes = [WebhookAnonThrottle]
    
    def post(self, request, *args, **kwargs):
        """
        Handle Paymob payment webhook.
        """
        # Log the incoming payload
        WebhookLog.objects.create(
            event_type='paymob',
            payload=request.data,
            headers=dict(request.headers),
            status_code=0
        )
        # Verify HMAC signature
        hmac_secret = settings.PAYMOB_HMAC_SECRET
        data = request.data
        
        # Extract transaction data
        transaction_data = data.get('obj')
        if not transaction_data:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # Verify HMAC if provided
        if hmac_secret:
            # Construct the string to be hashed
            secure_hash = request.headers.get('HMAC')
            if not secure_hash:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
            # Verify HMAC
            calculated_hash = hmac.new(
                hmac_secret.encode('utf-8'),
                json.dumps(data, sort_keys=True).encode('utf-8'),
                hashlib.sha512
            ).hexdigest()
            
            if calculated_hash != secure_hash:
                return Response(status=status.HTTP_403_FORBIDDEN)
        
        # Process the payment
        order_id = transaction_data.get('order', {}).get('id')
        success = transaction_data.get('success')
        transaction_id = transaction_data.get('id')
        
        if not order_id or not transaction_id:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        # Find the payment
        try:
            payment = Payment.objects.get(paymob_order_id=str(order_id))
        except Payment.DoesNotExist:
            try:
                payment = SubscriptionPayment.objects.get(paymob_order_id=str(order_id))
            except SubscriptionPayment.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
        
        # Update payment status
        payment.paymob_transaction_id = str(transaction_id)
        payment.status = 'success' if success else 'failed'
        payment.response_data.update(transaction_data)
        payment.save()
        
        # If payment is successful, update the order or subscription
        if success:
            if isinstance(payment, Payment):
                # Update order
                order = payment.order
                order.is_paid = True
                order.payment_id = payment.payment_id
                order.save()
            elif isinstance(payment, SubscriptionPayment):
                # Update subscription
                subscription = payment.subscription
                subscription.is_active = True
                subscription.save()
        
        # Idempotency: check if already processed
        if hasattr(payment, 'webhook_processed') and payment.webhook_processed:
            return Response(status=status.HTTP_200_OK)
        payment.webhook_processed = True
        payment.save()
        
        # Log the response
        WebhookLog.objects.create(
            event_type='paymob',
            payload=request.data,
            headers=dict(request.headers),
            status_code=200 if success else 400
        )
        return Response(status=status.HTTP_200_OK)
