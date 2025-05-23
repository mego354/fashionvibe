"""
Store URLs for the Fashion Hub project.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedSimpleRouter

from .views import StoreViewSet, DomainViewSet, StoreLocationViewSet, nearby_stores

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'', StoreViewSet, basename='store')

# Create nested routers
domains_router = NestedSimpleRouter(router, r'', lookup='store')
domains_router.register(r'domains', DomainViewSet, basename='store-domain')

locations_router = NestedSimpleRouter(router, r'', lookup='store')
locations_router.register(r'locations', StoreLocationViewSet, basename='store-location')

# URL patterns
urlpatterns = [
    path('nearby/', nearby_stores, name='store-nearby'),
    # Include router URLs
    path('', include(router.urls)),
    path('', include(domains_router.urls)),
    path('', include(locations_router.urls)),
]
