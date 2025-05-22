"""
Payment serializers for the Fashion Hub project.
"""

from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from .models import Payment, SubscriptionPayment


class PaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Payment model.
    """
    
    class Meta:
        model = Payment
        fields = [
            'id', 'payment_id', 'order', 'amount', 'currency', 'status',
            'payment_method', 'paymob_transaction_id', 'paymob_order_id',
            'response_data', 'error_message', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'payment_id', 'created_at', 'updated_at']


class SubscriptionPaymentSerializer(serializers.ModelSerializer):
    """
    Serializer for the SubscriptionPayment model.
    """
    
    class Meta:
        model = SubscriptionPayment
        fields = [
            'id', 'payment_id', 'subscription', 'amount', 'currency', 'status',
            'payment_method', 'paymob_transaction_id', 'paymob_order_id',
            'response_data', 'error_message', 'billing_period_start',
            'billing_period_end', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'payment_id', 'created_at', 'updated_at']


class PaymentInitiateSerializer(serializers.Serializer):
    """
    Serializer for initiating a payment.
    """
    order_id = serializers.IntegerField()
    payment_method = serializers.CharField(max_length=50)
    
    def validate_order_id(self, value):
        """
        Validate that the order exists and belongs to the current user.
        """
        from orders.models import Order
        
        user = self.context['request'].user
        
        try:
            order = Order.objects.get(id=value)
        except Order.DoesNotExist:
            raise serializers.ValidationError(_("Order not found."))
        
        if order.user != user and not (user.is_store_owner or user.is_store_manager):
            raise serializers.ValidationError(_("You don't have permission to pay for this order."))
        
        if order.is_paid:
            raise serializers.ValidationError(_("This order has already been paid."))
        
        return value


class SubscriptionPaymentInitiateSerializer(serializers.Serializer):
    """
    Serializer for initiating a subscription payment.
    """
    subscription_id = serializers.IntegerField()
    payment_method = serializers.CharField(max_length=50)
    
    def validate_subscription_id(self, value):
        """
        Validate that the subscription exists and belongs to the current user's store.
        """
        from subscriptions.models import Subscription
        
        user = self.context['request'].user
        
        try:
            subscription = Subscription.objects.get(id=value)
        except Subscription.DoesNotExist:
            raise serializers.ValidationError(_("Subscription not found."))
        
        # Check if user has permission to pay for this subscription
        if not user.is_store_owner:
            raise serializers.ValidationError(_("Only store owners can pay for subscriptions."))
        
        return value
