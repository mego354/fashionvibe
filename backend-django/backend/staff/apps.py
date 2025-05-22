"""
Staff app configuration for the Fashion Hub project.
"""

from django.apps import AppConfig


class StaffConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'staff'
    
    def ready(self):
        # Import signals
        import staff.signals
