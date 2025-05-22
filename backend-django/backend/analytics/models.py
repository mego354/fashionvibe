"""
Analytics models for the Fashion Hub project.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from common.models import TimeStampedModel


class AnalyticsEvent(TimeStampedModel):
    """
    Analytics event model for tracking user interactions.
    """
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='analytics_events')
    user = models.ForeignKey('users.User', on_delete=models.SET_NULL, null=True, blank=True, related_name='analytics_events')
    
    # Event details
    event_type = models.CharField(
        _("Event type"),
        max_length=50,
        choices=[
            ('page_view', _('Page View')),
            ('product_view', _('Product View')),
            ('add_to_cart', _('Add to Cart')),
            ('remove_from_cart', _('Remove from Cart')),
            ('checkout_start', _('Checkout Start')),
            ('checkout_complete', _('Checkout Complete')),
            ('search', _('Search')),
            ('filter', _('Filter')),
            ('sort', _('Sort')),
            ('login', _('Login')),
            ('signup', _('Signup')),
            ('wishlist_add', _('Wishlist Add')),
            ('wishlist_remove', _('Wishlist Remove')),
        ]
    )
    
    # Event data
    event_data = models.JSONField(_("Event data"), default=dict)
    
    # Session information
    session_id = models.CharField(_("Session ID"), max_length=100, blank=True)
    ip_address = models.GenericIPAddressField(_("IP address"), blank=True, null=True)
    user_agent = models.TextField(_("User agent"), blank=True)
    
    # Referrer information
    referrer = models.URLField(_("Referrer"), blank=True)
    
    # Device information
    device_type = models.CharField(
        _("Device type"),
        max_length=20,
        choices=[
            ('desktop', _('Desktop')),
            ('tablet', _('Tablet')),
            ('mobile', _('Mobile')),
            ('other', _('Other')),
        ],
        default='other'
    )
    
    class Meta:
        verbose_name = _("Analytics event")
        verbose_name_plural = _("Analytics events")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['store']),
            models.Index(fields=['user']),
            models.Index(fields=['event_type']),
            models.Index(fields=['created_at']),
            models.Index(fields=['device_type']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - {self.created_at}"


class DailyAnalytics(TimeStampedModel):
    """
    Daily analytics model for aggregated metrics.
    """
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='daily_analytics')
    date = models.DateField(_("Date"))
    
    # Page views
    page_views = models.PositiveIntegerField(_("Page views"), default=0)
    unique_visitors = models.PositiveIntegerField(_("Unique visitors"), default=0)
    
    # Product metrics
    product_views = models.PositiveIntegerField(_("Product views"), default=0)
    add_to_cart_count = models.PositiveIntegerField(_("Add to cart count"), default=0)
    
    # Order metrics
    orders_count = models.PositiveIntegerField(_("Orders count"), default=0)
    revenue = models.DecimalField(_("Revenue"), max_digits=10, decimal_places=2, default=0)
    
    # User metrics
    new_users = models.PositiveIntegerField(_("New users"), default=0)
    
    # Search metrics
    search_count = models.PositiveIntegerField(_("Search count"), default=0)
    
    # Device metrics
    desktop_users = models.PositiveIntegerField(_("Desktop users"), default=0)
    tablet_users = models.PositiveIntegerField(_("Tablet users"), default=0)
    mobile_users = models.PositiveIntegerField(_("Mobile users"), default=0)
    
    class Meta:
        verbose_name = _("Daily analytics")
        verbose_name_plural = _("Daily analytics")
        ordering = ['-date']
        unique_together = ('store', 'date')
        indexes = [
            models.Index(fields=['store']),
            models.Index(fields=['date']),
        ]
    
    def __str__(self):
        return f"{self.store.name_en} - {self.date}"


class ProductPerformance(TimeStampedModel):
    """
    Product performance model for tracking product metrics.
    """
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='product_performance')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='performance')
    
    # Time period
    date = models.DateField(_("Date"))
    
    # Views
    views = models.PositiveIntegerField(_("Views"), default=0)
    
    # Cart actions
    add_to_cart_count = models.PositiveIntegerField(_("Add to cart count"), default=0)
    
    # Purchase metrics
    purchase_count = models.PositiveIntegerField(_("Purchase count"), default=0)
    revenue = models.DecimalField(_("Revenue"), max_digits=10, decimal_places=2, default=0)
    
    # Conversion rate (calculated)
    
    class Meta:
        verbose_name = _("Product performance")
        verbose_name_plural = _("Product performance")
        ordering = ['-date']
        unique_together = ('store', 'product', 'date')
        indexes = [
            models.Index(fields=['store']),
            models.Index(fields=['product']),
            models.Index(fields=['date']),
        ]
    
    def __str__(self):
        return f"{self.product.name_en} - {self.date}"
    
    @property
    def conversion_rate(self):
        """
        Calculate the conversion rate (purchases / views).
        """
        if self.views == 0:
            return 0
        return (self.purchase_count / self.views) * 100
