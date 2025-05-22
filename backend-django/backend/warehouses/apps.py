"""
Warehouse app configuration for the Fashion Hub project.
"""

from django.apps import AppConfig


class WarehousesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'warehouses'
    
    def ready(self):
        # Import signals
        import warehouses.signals
