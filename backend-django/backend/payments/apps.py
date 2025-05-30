"""
Payment app configuration for the Fashion Hub project.
"""

from django.apps import AppConfig


class PaymentsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'payments'
    
    def ready(self):
        # Import signals
        import payments.signals
