"""
Payment signals for the Fashion Hub project.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Payment, SubscriptionPayment
