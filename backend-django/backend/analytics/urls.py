"""
Analytics URLs for the Fashion Hub project.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    AnalyticsEventViewSet, DailyAnalyticsViewSet, ProductPerformanceViewSet
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'events', AnalyticsEventViewSet, basename='analytics-event')
router.register(r'daily', DailyAnalyticsViewSet, basename='daily-analytics')
router.register(r'products', ProductPerformanceViewSet, basename='product-performance')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]
