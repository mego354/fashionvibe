"""
Staff URLs for the Fashion Hub project.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import StaffViewSet, StaffPerformanceViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'', StaffViewSet, basename='staff')
router.register(r'performance', StaffPerformanceViewSet, basename='staff-performance')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]
