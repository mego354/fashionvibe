"""
Warehouse models for the Fashion Hub project.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _

from common.models import TimeStampedModel, TranslatedField


class Warehouse(TimeStampedModel, TranslatedField):
    """
    Warehouse model for inventory management.
    """
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='warehouses')
    
    # Location details
    address_line1 = models.CharField(_("Address line 1"), max_length=255)
    address_line2 = models.CharField(_("Address line 2"), max_length=255, blank=True)
    city = models.CharField(_("City"), max_length=100)
    state = models.CharField(_("State/Province"), max_length=100)
    postal_code = models.CharField(_("Postal code"), max_length=20)
    country = models.CharField(_("Country"), max_length=100)
    
    # Contact information
    phone = models.CharField(_("Phone"), max_length=20, blank=True)
    email = models.EmailField(_("Email"), blank=True)
    
    # Warehouse details
    is_active = models.BooleanField(_("Is active"), default=True)
    is_default = models.BooleanField(_("Is default"), default=False)
    
    # Geolocation
    latitude = models.DecimalField(_("Latitude"), max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(_("Longitude"), max_digits=9, decimal_places=6, null=True, blank=True)
    
    class Meta:
        verbose_name = _("Warehouse")
        verbose_name_plural = _("Warehouses")
        ordering = ['-is_default', 'name_en']
        indexes = [
            models.Index(fields=['store']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_default']),
        ]
    
    def __str__(self):
        return f"{self.name_en} - {self.store.name_en}"
    
    def save(self, *args, **kwargs):
        """
        Override save method to ensure only one default warehouse per store.
        """
        if self.is_default:
            # Set all other warehouses of this store to non-default
            Warehouse.objects.filter(store=self.store, is_default=True).update(is_default=False)
        
        super().save(*args, **kwargs)


class Inventory(TimeStampedModel):
    """
    Inventory model for tracking product stock in warehouses.
    """
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='inventory')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='inventory')
    variant = models.ForeignKey('products.Variant', on_delete=models.CASCADE, related_name='inventory', null=True, blank=True)
    
    # Stock details
    quantity = models.PositiveIntegerField(_("Quantity"), default=0)
    reserved_quantity = models.PositiveIntegerField(_("Reserved quantity"), default=0)
    
    # Stock thresholds
    low_stock_threshold = models.PositiveIntegerField(_("Low stock threshold"), default=5)
    
    # Location in warehouse
    location = models.CharField(_("Location"), max_length=100, blank=True)
    
    class Meta:
        verbose_name = _("Inventory")
        verbose_name_plural = _("Inventory")
        unique_together = ('warehouse', 'product', 'variant')
        indexes = [
            models.Index(fields=['warehouse', 'product']),
            models.Index(fields=['quantity']),
        ]
    
    def __str__(self):
        variant_name = f" - {self.variant.name_en}" if self.variant else ""
        return f"{self.product.name_en}{variant_name} at {self.warehouse.name_en}"
    
    @property
    def available_quantity(self):
        """
        Get the available quantity (total - reserved).
        """
        return max(0, self.quantity - self.reserved_quantity)
    
    @property
    def is_low_stock(self):
        """
        Check if the inventory is low on stock.
        """
        return self.available_quantity <= self.low_stock_threshold


class StockTransfer(TimeStampedModel):
    """
    Stock transfer model for tracking inventory movement between warehouses.
    """
    # Transfer reference
    reference_number = models.CharField(_("Reference number"), max_length=50, unique=True)
    
    # Source and destination
    source_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='outgoing_transfers')
    destination_warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='incoming_transfers')
    
    # Transfer status
    status = models.CharField(
        _("Status"),
        max_length=20,
        choices=[
            ('pending', _('Pending')),
            ('in_transit', _('In Transit')),
            ('completed', _('Completed')),
            ('cancelled', _('Cancelled')),
        ],
        default='pending'
    )
    
    # Transfer dates
    requested_date = models.DateTimeField(_("Requested date"), auto_now_add=True)
    shipped_date = models.DateTimeField(_("Shipped date"), null=True, blank=True)
    received_date = models.DateTimeField(_("Received date"), null=True, blank=True)
    
    # Staff
    requested_by = models.ForeignKey('staff.Staff', on_delete=models.SET_NULL, null=True, blank=True, related_name='requested_transfers')
    approved_by = models.ForeignKey('staff.Staff', on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_transfers')
    
    # Notes
    notes = models.TextField(_("Notes"), blank=True)
    
    class Meta:
        verbose_name = _("Stock transfer")
        verbose_name_plural = _("Stock transfers")
        ordering = ['-requested_date']
        indexes = [
            models.Index(fields=['reference_number']),
            models.Index(fields=['status']),
            models.Index(fields=['requested_date']),
        ]
    
    def __str__(self):
        return self.reference_number


class StockTransferItem(TimeStampedModel):
    """
    Stock transfer item model for products in a transfer.
    """
    transfer = models.ForeignKey(StockTransfer, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='transfer_items')
    variant = models.ForeignKey('products.Variant', on_delete=models.CASCADE, related_name='transfer_items', null=True, blank=True)
    
    # Item details
    quantity = models.PositiveIntegerField(_("Quantity"))
    
    # Product details at time of transfer
    product_name_en = models.CharField(_("Product name (English)"), max_length=255)
    product_name_ar = models.CharField(_("Product name (Arabic)"), max_length=255)
    variant_name_en = models.CharField(_("Variant name (English)"), max_length=100, blank=True)
    variant_name_ar = models.CharField(_("Variant name (Arabic)"), max_length=100, blank=True)
    
    class Meta:
        verbose_name = _("Stock transfer item")
        verbose_name_plural = _("Stock transfer items")
        ordering = ['id']
    
    def __str__(self):
        return f"{self.product_name_en} ({self.quantity})"
