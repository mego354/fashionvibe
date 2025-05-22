"""
Warehouse serializers for the Fashion Hub project.
"""

from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from .models import Warehouse, Inventory, StockTransfer, StockTransferItem


class InventorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Inventory model.
    """
    product_name = serializers.SerializerMethodField()
    variant_name = serializers.SerializerMethodField()
    available_quantity = serializers.SerializerMethodField()
    is_low_stock = serializers.SerializerMethodField()
    
    class Meta:
        model = Inventory
        fields = [
            'id', 'warehouse', 'product', 'variant', 'quantity', 'reserved_quantity',
            'low_stock_threshold', 'location', 'product_name', 'variant_name',
            'available_quantity', 'is_low_stock', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
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
    
    def get_available_quantity(self, obj):
        """
        Get the available quantity.
        """
        return obj.available_quantity
    
    def get_is_low_stock(self, obj):
        """
        Check if the inventory is low on stock.
        """
        return obj.is_low_stock


class WarehouseSerializer(serializers.ModelSerializer):
    """
    Serializer for the Warehouse model.
    """
    inventory_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Warehouse
        fields = [
            'id', 'store', 'name_en', 'name_ar', 'description_en', 'description_ar',
            'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country',
            'phone', 'email', 'is_active', 'is_default', 'latitude', 'longitude',
            'inventory_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_inventory_count(self, obj):
        """
        Get the count of inventory items in the warehouse.
        """
        return obj.inventory.count()


class StockTransferItemSerializer(serializers.ModelSerializer):
    """
    Serializer for the StockTransferItem model.
    """
    
    class Meta:
        model = StockTransferItem
        fields = [
            'id', 'transfer', 'product', 'variant', 'quantity',
            'product_name_en', 'product_name_ar', 'variant_name_en', 'variant_name_ar',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StockTransferSerializer(serializers.ModelSerializer):
    """
    Serializer for the StockTransfer model.
    """
    items = StockTransferItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = StockTransfer
        fields = [
            'id', 'reference_number', 'source_warehouse', 'destination_warehouse',
            'status', 'requested_date', 'shipped_date', 'received_date',
            'requested_by', 'approved_by', 'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'reference_number', 'requested_date', 'created_at', 'updated_at']


class StockTransferCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new stock transfer.
    """
    items = serializers.ListField(
        child=serializers.DictField(
            child=serializers.CharField(),
            allow_empty=False
        ),
        min_length=1
    )
    
    class Meta:
        model = StockTransfer
        fields = [
            'source_warehouse', 'destination_warehouse', 'notes', 'items'
        ]
    
    def validate(self, attrs):
        """
        Validate the stock transfer.
        """
        source_warehouse = attrs.get('source_warehouse')
        destination_warehouse = attrs.get('destination_warehouse')
        items = attrs.pop('items')
        
        # Check if source and destination warehouses are different
        if source_warehouse == destination_warehouse:
            raise serializers.ValidationError(_("Source and destination warehouses must be different."))
        
        # Check if source and destination warehouses belong to the same store
        if source_warehouse.store != destination_warehouse.store:
            raise serializers.ValidationError(_("Source and destination warehouses must belong to the same store."))
        
        # Validate items
        validated_items = []
        for item in items:
            product_id = item.get('product_id')
            variant_id = item.get('variant_id')
            quantity = int(item.get('quantity', 0))
            
            if not product_id or quantity <= 0:
                raise serializers.ValidationError(_("Invalid item data."))
            
            # Check if product exists
            from products.models import Product, Variant
            
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                raise serializers.ValidationError(_("Product not found."))
            
            # Check if variant exists
            variant = None
            if variant_id:
                try:
                    variant = Variant.objects.get(id=variant_id, product=product)
                except Variant.DoesNotExist:
                    raise serializers.ValidationError(_("Variant not found."))
            
            # Check if inventory exists in source warehouse
            try:
                inventory = Inventory.objects.get(
                    warehouse=source_warehouse,
                    product=product,
                    variant=variant
                )
            except Inventory.DoesNotExist:
                raise serializers.ValidationError(_("Product not available in source warehouse."))
            
            # Check if there's enough stock
            if inventory.available_quantity < quantity:
                raise serializers.ValidationError(_("Not enough stock available."))
            
            validated_items.append({
                'product': product,
                'variant': variant,
                'quantity': quantity
            })
        
        attrs['validated_items'] = validated_items
        
        return attrs
    
    def create(self, validated_data):
        """
        Create a new stock transfer.
        """
        validated_items = validated_data.pop('validated_items')
        
        # Generate reference number
        import uuid
        reference_number = f"TRF-{uuid.uuid4().hex[:8].upper()}"
        
        # Create stock transfer
        stock_transfer = StockTransfer.objects.create(
            reference_number=reference_number,
            **validated_data
        )
        
        # Create stock transfer items
        for item in validated_items:
            product = item['product']
            variant = item['variant']
            quantity = item['quantity']
            
            StockTransferItem.objects.create(
                transfer=stock_transfer,
                product=product,
                variant=variant,
                quantity=quantity,
                product_name_en=product.name_en,
                product_name_ar=product.name_ar,
                variant_name_en=variant.name_en if variant else '',
                variant_name_ar=variant.name_ar if variant else ''
            )
            
            # Update source inventory
            source_inventory = Inventory.objects.get(
                warehouse=stock_transfer.source_warehouse,
                product=product,
                variant=variant
            )
            source_inventory.reserved_quantity += quantity
            source_inventory.save()
        
        return stock_transfer


class InventoryUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating inventory.
    """
    
    class Meta:
        model = Inventory
        fields = ['quantity', 'low_stock_threshold', 'location']
