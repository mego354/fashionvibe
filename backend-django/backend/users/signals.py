"""
User signals for the Fashion Hub project.
"""

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal to handle additional actions when a user is created.
    """
    if created:
        # Additional setup for new users can be added here
        pass
