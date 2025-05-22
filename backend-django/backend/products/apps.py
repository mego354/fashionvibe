"""
Product app configuration for the Fashion Hub project.
"""

from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'products'
    
    def ready(self):
        # Import signals
        import products.signals
