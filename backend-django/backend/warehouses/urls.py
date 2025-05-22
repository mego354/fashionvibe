"""
Warehouse URLs for the Fashion Hub project.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter

from .views import (
    WarehouseViewSet, InventoryViewSet, StockTransferViewSet,
    StockTransferItemViewSet
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'', WarehouseViewSet, basename='warehouse')
router.register(r'inventory', InventoryViewSet, basename='inventory')
router.register(r'transfers', StockTransferViewSet, basename='stock-transfer')

# Create nested routers
transfer_items_router = NestedSimpleRouter(router, r'transfers', lookup='transfer')
transfer_items_router.register(r'items', StockTransferItemViewSet, basename='stock-transfer-item')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    path('', include(transfer_items_router.urls)),
]
