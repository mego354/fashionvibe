"""
Warehouse signals for the Fashion Hub project.
"""

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import Warehouse, Inventory, StockTransfer, StockTransferItem
