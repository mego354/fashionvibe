"""
Warehouse views for the Fashion Hub project.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from common.permissions import IsStoreOwnerOrManager, IsStoreStaff
from .models import Warehouse, Inventory, StockTransfer, StockTransferItem
from .serializers import (
    WarehouseSerializer, InventorySerializer, StockTransferSerializer,
    StockTransferItemSerializer, StockTransferCreateSerializer,
    InventoryUpdateSerializer
)


class WarehouseViewSet(viewsets.ModelViewSet):
    """
    API endpoint for warehouses.
    """
    serializer_class = WarehouseSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter warehouses based on user permissions.
        """
        user = self.request.user
        
        # Store owners can see all warehouses in their store
        if user.is_store_owner:
            return Warehouse.objects.filter(store__owner=user)
        
        # Store managers can see all warehouses in their store
        if user.is_store_manager:
            return Warehouse.objects.filter(store__managers=user)
        
        return Warehouse.objects.none()
    
    @action(detail=True, methods=['post'])
    def set_default(self, request, pk=None):
        """
        Set a warehouse as the default.
        """
        warehouse = self.get_object()
        warehouse.is_default = True
        warehouse.save()
        
        return Response({'detail': _('Warehouse set as default.')}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'])
    def inventory(self, request, pk=None):
        """
        Get inventory for a warehouse.
        """
        warehouse = self.get_object()
        inventory = warehouse.inventory.all()
        
        # Apply filters
        product_id = request.query_params.get('product_id')
        if product_id:
            inventory = inventory.filter(product_id=product_id)
        
        low_stock = request.query_params.get('low_stock')
        if low_stock and low_stock.lower() == 'true':
            inventory = [item for item in inventory if item.is_low_stock]
        
        serializer = InventorySerializer(inventory, many=True)
        return Response(serializer.data)


class InventoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for inventory.
    """
    serializer_class = InventorySerializer
    permission_classes = [IsAuthenticated, IsStoreStaff]
    
    def get_queryset(self):
        """
        Filter inventory based on user permissions.
        """
        user = self.request.user
        
        # Store owners can see all inventory in their store
        if user.is_store_owner:
            return Inventory.objects.filter(warehouse__store__owner=user)
        
        # Store managers can see all inventory in their store
        if user.is_store_manager:
            return Inventory.objects.filter(warehouse__store__managers=user)
        
        # Store staff can see all inventory in their store
        if user.is_store_staff:
            return Inventory.objects.filter(warehouse__store__staff__user=user)
        
        return Inventory.objects.none()
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action in ['update', 'partial_update']:
            return InventoryUpdateSerializer
        return self.serializer_class
    
    @action(detail=True, methods=['post'])
    def adjust_stock(self, request, pk=None):
        """
        Adjust stock quantity.
        """
        inventory = self.get_object()
        quantity = request.data.get('quantity')
        reason = request.data.get('reason', '')
        
        if quantity is None:
            return Response({'detail': _('Quantity is required.')}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            quantity = int(quantity)
        except ValueError:
            return Response({'detail': _('Quantity must be an integer.')}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update inventory
        inventory.quantity = max(0, inventory.quantity + quantity)
        inventory.save()
        
        return Response({
            'detail': _('Stock adjusted.'),
            'new_quantity': inventory.quantity
        }, status=status.HTTP_200_OK)


class StockTransferViewSet(viewsets.ModelViewSet):
    """
    API endpoint for stock transfers.
    """
    serializer_class = StockTransferSerializer
    permission_classes = [IsAuthenticated, IsStoreStaff]
    
    def get_queryset(self):
        """
        Filter stock transfers based on user permissions.
        """
        user = self.request.user
        
        # Store owners can see all stock transfers in their store
        if user.is_store_owner:
            return StockTransfer.objects.filter(
                source_warehouse__store__owner=user
            )
        
        # Store managers can see all stock transfers in their store
        if user.is_store_manager:
            return StockTransfer.objects.filter(
                source_warehouse__store__managers=user
            )
        
        # Store staff can see all stock transfers in their store
        if user.is_store_staff:
            return StockTransfer.objects.filter(
                source_warehouse__store__staff__user=user
            )
        
        return StockTransfer.objects.none()
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action == 'create':
            return StockTransferCreateSerializer
        return self.serializer_class
    
    @action(detail=True, methods=['post'])
    def ship(self, request, pk=None):
        """
        Mark a stock transfer as shipped.
        """
        transfer = self.get_object()
        
        if transfer.status != 'pending':
            return Response({'detail': _('Transfer must be pending to be shipped.')}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update transfer status
        transfer.status = 'in_transit'
        transfer.shipped_date = timezone.now()
        transfer.save()
        
        # Update inventory
        for item in transfer.items.all():
            # Reduce quantity from source warehouse
            source_inventory = Inventory.objects.get(
                warehouse=transfer.source_warehouse,
                product=item.product,
                variant=item.variant
            )
            source_inventory.quantity -= item.quantity
            source_inventory.reserved_quantity -= item.quantity
            source_inventory.save()
        
        return Response({'detail': _('Transfer marked as shipped.')}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def receive(self, request, pk=None):
        """
        Mark a stock transfer as received.
        """
        transfer = self.get_object()
        
        if transfer.status != 'in_transit':
            return Response({'detail': _('Transfer must be in transit to be received.')}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update transfer status
        transfer.status = 'completed'
        transfer.received_date = timezone.now()
        transfer.save()
        
        # Update inventory
        for item in transfer.items.all():
            # Add quantity to destination warehouse
            try:
                dest_inventory = Inventory.objects.get(
                    warehouse=transfer.destination_warehouse,
                    product=item.product,
                    variant=item.variant
                )
                dest_inventory.quantity += item.quantity
                dest_inventory.save()
            except Inventory.DoesNotExist:
                # Create new inventory record if it doesn't exist
                Inventory.objects.create(
                    warehouse=transfer.destination_warehouse,
                    product=item.product,
                    variant=item.variant,
                    quantity=item.quantity
                )
        
        return Response({'detail': _('Transfer marked as received.')}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancel a stock transfer.
        """
        transfer = self.get_object()
        
        if transfer.status not in ['pending', 'in_transit']:
            return Response({'detail': _('Only pending or in-transit transfers can be cancelled.')}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update transfer status
        transfer.status = 'cancelled'
        transfer.save()
        
        # Update inventory if transfer was pending
        if transfer.status == 'pending':
            for item in transfer.items.all():
                # Release reserved quantity
                source_inventory = Inventory.objects.get(
                    warehouse=transfer.source_warehouse,
                    product=item.product,
                    variant=item.variant
                )
                source_inventory.reserved_quantity -= item.quantity
                source_inventory.save()
        
        return Response({'detail': _('Transfer cancelled.')}, status=status.HTTP_200_OK)


class StockTransferItemViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for stock transfer items.
    """
    serializer_class = StockTransferItemSerializer
    permission_classes = [IsAuthenticated, IsStoreStaff]
    
    def get_queryset(self):
        """
        Filter stock transfer items based on transfer.
        """
        transfer_id = self.kwargs.get('transfer_pk')
        if transfer_id:
            return StockTransferItem.objects.filter(transfer_id=transfer_id)
        return StockTransferItem.objects.none()
