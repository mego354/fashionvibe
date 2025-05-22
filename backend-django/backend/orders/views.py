"""
Order views for the Fashion Hub project.
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.translation import gettext_lazy as _

from common.permissions import IsStoreOwnerOrManager, IsStoreStaff
from .models import Order, OrderItem, Cart, CartItem
from .serializers import (
    OrderSerializer, OrderItemSerializer, OrderCreateSerializer,
    CartSerializer, CartItemSerializer, AddToCartSerializer, UpdateCartItemSerializer
)


class OrderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for orders.
    """
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'is_paid', 'warehouse', 'assigned_to']
    search_fields = ['order_number', 'user__email', 'user__first_name', 'user__last_name']
    ordering_fields = ['created_at', 'total', 'status']
    
    def get_queryset(self):
        """
        Filter orders based on user permissions.
        """
        user = self.request.user
        
        # Store owners and managers can see all orders
        if user.is_store_owner or user.is_store_manager:
            return Order.objects.all()
        
        # Store staff can see orders assigned to them
        if user.is_store_staff:
            return Order.objects.filter(assigned_to__user=user)
        
        # Regular users can only see their own orders
        return Order.objects.filter(user=user)
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action == 'create':
            return OrderCreateSerializer
        return self.serializer_class
    
    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """
        Update the order status.
        """
        order = self.get_object()
        status = request.data.get('status')
        
        if not status:
            return Response({'detail': _('Status is required.')}, status=status.HTTP_400_BAD_REQUEST)
        
        if status not in dict(Order._meta.get_field('status').choices).keys():
            return Response({'detail': _('Invalid status.')}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = status
        order.save()
        
        return Response({'detail': _('Order status updated.')}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def assign_staff(self, request, pk=None):
        """
        Assign a staff member to the order.
        """
        order = self.get_object()
        staff_id = request.data.get('staff_id')
        
        if not staff_id:
            return Response({'detail': _('Staff ID is required.')}, status=status.HTTP_400_BAD_REQUEST)
        
        from staff.models import Staff
        
        try:
            staff = Staff.objects.get(id=staff_id)
        except Staff.DoesNotExist:
            return Response({'detail': _('Staff not found.')}, status=status.HTTP_404_NOT_FOUND)
        
        order.assigned_to = staff
        order.save()
        
        return Response({'detail': _('Staff assigned to order.')}, status=status.HTTP_200_OK)


class OrderItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for order items.
    """
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Filter order items based on order.
        """
        order_id = self.kwargs.get('order_pk')
        if order_id:
            # Check if user has permission to view this order
            order = Order.objects.get(id=order_id)
            user = self.request.user
            
            if user.is_store_owner or user.is_store_manager:
                return OrderItem.objects.filter(order_id=order_id)
            
            if user.is_store_staff and order.assigned_to and order.assigned_to.user == user:
                return OrderItem.objects.filter(order_id=order_id)
            
            if order.user == user:
                return OrderItem.objects.filter(order_id=order_id)
            
            return OrderItem.objects.none()
        
        return OrderItem.objects.none()


class CartViewSet(viewsets.GenericViewSet):
    """
    API endpoint for the user's cart.
    """
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Get the user's cart.
        """
        return Cart.objects.filter(user=self.request.user)
    
    def get_object(self):
        """
        Get or create the user's cart.
        """
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        return cart
    
    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        """
        Get the current user's cart.
        """
        cart = self.get_object()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """
        Add an item to the cart.
        """
        serializer = AddToCartSerializer(data=request.data)
        if serializer.is_valid():
            cart = self.get_object()
            product_id = serializer.validated_data['product_id']
            variant_id = serializer.validated_data.get('variant_id')
            quantity = serializer.validated_data['quantity']
            
            from products.models import Product, Variant
            
            product = Product.objects.get(id=product_id)
            variant = Variant.objects.get(id=variant_id) if variant_id else None
            
            # Check if item already exists in cart
            try:
                cart_item = CartItem.objects.get(cart=cart, product=product, variant=variant)
                cart_item.quantity += quantity
                cart_item.save()
            except CartItem.DoesNotExist:
                CartItem.objects.create(
                    cart=cart,
                    product=product,
                    variant=variant,
                    quantity=quantity
                )
            
            return Response({'detail': _('Item added to cart.')}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def update_item(self, request):
        """
        Update a cart item.
        """
        item_id = request.data.get('item_id')
        
        if not item_id:
            return Response({'detail': _('Item ID is required.')}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'detail': _('Cart item not found.')}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UpdateCartItemSerializer(data=request.data, context={'cart_item': cart_item})
        
        if serializer.is_valid():
            cart_item.quantity = serializer.validated_data['quantity']
            cart_item.save()
            
            return Response({'detail': _('Cart item updated.')}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def remove_item(self, request):
        """
        Remove an item from the cart.
        """
        item_id = request.data.get('item_id')
        
        if not item_id:
            return Response({'detail': _('Item ID is required.')}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            cart_item = CartItem.objects.get(id=item_id, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'detail': _('Cart item not found.')}, status=status.HTTP_404_NOT_FOUND)
        
        cart_item.delete()
        
        return Response({'detail': _('Item removed from cart.')}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """
        Clear the cart.
        """
        cart = self.get_object()
        cart.items.all().delete()
        
        return Response({'detail': _('Cart cleared.')}, status=status.HTTP_200_OK)
