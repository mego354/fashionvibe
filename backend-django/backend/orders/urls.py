"""
Order URLs for the Fashion Hub project.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter

from .views import OrderViewSet, OrderItemViewSet, CartViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'', OrderViewSet, basename='order')

# Create nested routers
items_router = NestedSimpleRouter(router, r'', lookup='order')
items_router.register(r'items', OrderItemViewSet, basename='order-item')

# Cart router
cart_router = DefaultRouter()
cart_router.register(r'cart', CartViewSet, basename='cart')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    path('', include(items_router.urls)),
    path('', include(cart_router.urls)),
]
