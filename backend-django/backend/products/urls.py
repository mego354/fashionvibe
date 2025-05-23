"""
Product URLs for the Fashion Hub project.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter

from .views import (
    CategoryViewSet, ProductViewSet, ProductImageViewSet,
    VariantViewSet, ProductReviewViewSet
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'', ProductViewSet, basename='product')

# Create nested routers
images_router = NestedSimpleRouter(router, r'', lookup='product')
images_router.register(r'images', ProductImageViewSet, basename='product-image')

variants_router = NestedSimpleRouter(router, r'', lookup='product')
variants_router.register(r'variants', VariantViewSet, basename='product-variant')

reviews_router = NestedSimpleRouter(router, r'', lookup='product')
reviews_router.register(r'reviews', ProductReviewViewSet, basename='product-review')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    path('', include(images_router.urls)),
    path('', include(variants_router.urls)),
    path('', include(reviews_router.urls)),
]

# Bulk operations are available at /products/bulk-create/, /products/bulk-update/, /products/bulk-delete/
