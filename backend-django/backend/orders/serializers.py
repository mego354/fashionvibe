"""
Order serializers for the Fashion Hub project.
"""

from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from common.serializers import DynamicFieldsModelSerializer
from .models import Order, OrderItem, Cart, CartItem


class OrderItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the OrderItem model.
    """
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'order', 'product', 'variant', 'quantity', 'unit_price', 'subtotal',
            'product_name_en', 'product_name_ar', 'variant_name_en', 'variant_name_ar',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'subtotal', 'created_at', 'updated_at']


class OrderSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for the Order model.
    """
    items = OrderItemSerializer(many=True, read_only=True)
    user_email = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'user_email', 'shipping_address', 'shipping_method',
            'shipping_cost', 'payment_method', 'payment_id', 'is_paid', 'paid_at',
            'status', 'subtotal', 'tax', 'discount', 'total', 'tracking_number',
            'tracking_url', 'customer_notes', 'staff_notes', 'warehouse', 'assigned_to',
            'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'created_at', 'updated_at']
    
    def get_user_email(self, obj):
        """
        Get the user's email.
        """
        return obj.user.email


class OrderCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new order.
    """
    
    class Meta:
        model = Order
        fields = [
            'shipping_address', 'shipping_method', 'payment_method',
            'customer_notes', 'warehouse'
        ]
    
    def create(self, validated_data):
        """
        Create a new order from the user's cart.
        """
        user = self.context['request'].user
        
        # Get the user's cart
        try:
            cart = Cart.objects.get(user=user)
        except Cart.DoesNotExist:
            raise serializers.ValidationError(_("You don't have any items in your cart."))
        
        # Check if cart has items
        if cart.items.count() == 0:
            raise serializers.ValidationError(_("Your cart is empty."))
        
        # Calculate order totals
        subtotal = cart.subtotal
        tax = subtotal * 0.14  # 14% VAT in Egypt
        shipping_cost = validated_data.get('shipping_cost', 0)
        total = subtotal + tax + shipping_cost
        
        # Create the order
        order = Order.objects.create(
            user=user,
            order_number=f"ORD-{user.id}-{Order.objects.filter(user=user).count() + 1}",
            subtotal=subtotal,
            tax=tax,
            shipping_cost=shipping_cost,
            total=total,
            **validated_data
        )
        
        # Create order items from cart items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                variant=cart_item.variant,
                quantity=cart_item.quantity,
                unit_price=cart_item.unit_price,
                subtotal=cart_item.subtotal,
                product_name_en=cart_item.product.name_en,
                product_name_ar=cart_item.product.name_ar,
                variant_name_en=cart_item.variant.name_en if cart_item.variant else '',
                variant_name_ar=cart_item.variant.name_ar if cart_item.variant else ''
            )
        
        # Clear the cart
        cart.items.all().delete()
        
        return order


class CartItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the CartItem model.
    """
    product_name = serializers.SerializerMethodField()
    variant_name = serializers.SerializerMethodField()
    unit_price = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = CartItem
        fields = [
            'id', 'cart', 'product', 'variant', 'quantity',
            'product_name', 'variant_name', 'unit_price', 'subtotal',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'cart', 'created_at', 'updated_at']
    
    def get_product_name(self, obj):
        """
        Get the product name.
        """
        return obj.product.name_en
    
    def get_variant_name(self, obj):
        """
        Get the variant name.
        """
        return obj.variant.name_en if obj.variant else None
    
    def get_unit_price(self, obj):
        """
        Get the unit price.
        """
        return obj.unit_price
    
    def get_subtotal(self, obj):
        """
        Get the subtotal.
        """
        return obj.subtotal


class CartSerializer(serializers.ModelSerializer):
    """
    Serializer for the Cart model.
    """
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.SerializerMethodField()
    subtotal = serializers.SerializerMethodField()
    
    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'subtotal', 'created_at', 'updated_at']
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def get_total_items(self, obj):
        """
        Get the total number of items in the cart.
        """
        return obj.total_items
    
    def get_subtotal(self, obj):
        """
        Get the cart subtotal.
        """
        return obj.subtotal


class AddToCartSerializer(serializers.Serializer):
    """
    Serializer for adding items to the cart.
    """
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, default=1)
    
    def validate(self, attrs):
        """
        Validate that the product and variant exist and are active.
        """
        from products.models import Product, Variant
        
        product_id = attrs.get('product_id')
        variant_id = attrs.get('variant_id')
        
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            raise serializers.ValidationError(_("Product not found or inactive."))
        
        if variant_id:
            try:
                variant = Variant.objects.get(id=variant_id, product=product, is_active=True)
            except Variant.DoesNotExist:
                raise serializers.ValidationError(_("Variant not found or inactive."))
            
            # Check if variant has enough stock
            if variant.stock_quantity < attrs.get('quantity'):
                raise serializers.ValidationError(_("Not enough stock available."))
        
        return attrs


class UpdateCartItemSerializer(serializers.Serializer):
    """
    Serializer for updating cart items.
    """
    quantity = serializers.IntegerField(min_value=1)
    
    def validate(self, attrs):
        """
        Validate that the quantity is valid.
        """
        cart_item = self.context.get('cart_item')
        quantity = attrs.get('quantity')
        
        if cart_item.variant and cart_item.variant.stock_quantity < quantity:
            raise serializers.ValidationError(_("Not enough stock available."))
        
        return attrs
