"""
Subscription URLs for the Fashion Hub project.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import SubscriptionViewSet, SubscriptionLimitViewSet

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'', SubscriptionViewSet, basename='subscription')
router.register(r'limits', SubscriptionLimitViewSet, basename='subscription-limit')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
]
