"""
Payment URLs for the Fashion Hub project.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PaymentViewSet, SubscriptionPaymentViewSet, PaymentWebhookView

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'', PaymentViewSet, basename='payment')
router.register(r'subscription', SubscriptionPaymentViewSet, basename='subscription-payment')

# URL patterns
urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # Webhook URL
    path('webhook/', PaymentWebhookView.as_view(), name='payment-webhook'),
]
