"""
Order models for the Fashion Hub project.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _

from common.models import TimeStampedModel


class Order(TimeStampedModel):
    """
    Order model for customer purchases.
    """
    # Order reference
    order_number = models.CharField(_("Order number"), max_length=50, unique=True)
    
    # Customer information
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='orders')
    
    # Shipping information
    shipping_address = models.ForeignKey('users.Address', on_delete=models.PROTECT, related_name='shipping_orders')
    shipping_method = models.CharField(_("Shipping method"), max_length=100)
    shipping_cost = models.DecimalField(_("Shipping cost"), max_digits=10, decimal_places=2)
    
    # Payment information
    payment_method = models.CharField(_("Payment method"), max_length=100)
    payment_id = models.CharField(_("Payment ID"), max_length=100, blank=True)
    is_paid = models.BooleanField(_("Is paid"), default=False)
    paid_at = models.DateTimeField(_("Paid at"), null=True, blank=True)
    
    # Order status
    status = models.CharField(
        _("Status"),
        max_length=20,
        choices=[
            ('pending', _('Pending')),
            ('processing', _('Processing')),
            ('shipped', _('Shipped')),
            ('delivered', _('Delivered')),
            ('cancelled', _('Cancelled')),
            ('refunded', _('Refunded')),
        ],
        default='pending'
    )
    
    # Order totals
    subtotal = models.DecimalField(_("Subtotal"), max_digits=10, decimal_places=2)
    tax = models.DecimalField(_("Tax"), max_digits=10, decimal_places=2)
    discount = models.DecimalField(_("Discount"), max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(_("Total"), max_digits=10, decimal_places=2)
    
    # Tracking information
    tracking_number = models.CharField(_("Tracking number"), max_length=100, blank=True)
    tracking_url = models.URLField(_("Tracking URL"), blank=True)
    
    # Notes
    customer_notes = models.TextField(_("Customer notes"), blank=True)
    staff_notes = models.TextField(_("Staff notes"), blank=True)
    
    # Warehouse/branch
    warehouse = models.ForeignKey('warehouses.Warehouse', on_delete=models.PROTECT, related_name='orders')
    
    # Staff assignment
    assigned_to = models.ForeignKey('staff.Staff', on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_orders')
    
    class Meta:
        verbose_name = _("Order")
        verbose_name_plural = _("Orders")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['order_number']),
            models.Index(fields=['user']),
            models.Index(fields=['status']),
            models.Index(fields=['is_paid']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return self.order_number
    
    @property
    def calculate_total(self):
        """
        Calculate the order total.
        """
        return self.subtotal + self.tax + self.shipping_cost - self.discount


class OrderItem(TimeStampedModel):
    """
    Order item model for products in an order.
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.PROTECT, related_name='order_items')
    variant = models.ForeignKey('products.Variant', on_delete=models.PROTECT, related_name='order_items', null=True, blank=True)
    
    # Item details
    quantity = models.PositiveIntegerField(_("Quantity"))
    unit_price = models.DecimalField(_("Unit price"), max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(_("Subtotal"), max_digits=10, decimal_places=2)
    
    # Product details at time of order
    product_name_en = models.CharField(_("Product name (English)"), max_length=255)
    product_name_ar = models.CharField(_("Product name (Arabic)"), max_length=255)
    variant_name_en = models.CharField(_("Variant name (English)"), max_length=100, blank=True)
    variant_name_ar = models.CharField(_("Variant name (Arabic)"), max_length=100, blank=True)
    
    class Meta:
        verbose_name = _("Order item")
        verbose_name_plural = _("Order items")
        ordering = ['id']
    
    def __str__(self):
        return f"{self.product_name_en} ({self.quantity})"
    
    def save(self, *args, **kwargs):
        """
        Override save method to calculate subtotal.
        """
        self.subtotal = self.quantity * self.unit_price
        super().save(*args, **kwargs)


class Cart(TimeStampedModel):
    """
    Shopping cart model.
    """
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='cart')
    
    class Meta:
        verbose_name = _("Cart")
        verbose_name_plural = _("Carts")
    
    def __str__(self):
        return f"Cart for {self.user.email}"
    
    @property
    def total_items(self):
        """
        Get the total number of items in the cart.
        """
        return self.items.count()
    
    @property
    def subtotal(self):
        """
        Calculate the cart subtotal.
        """
        return sum(item.subtotal for item in self.items.all())


class CartItem(TimeStampedModel):
    """
    Shopping cart item model.
    """
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE, related_name='cart_items')
    variant = models.ForeignKey('products.Variant', on_delete=models.CASCADE, related_name='cart_items', null=True, blank=True)
    quantity = models.PositiveIntegerField(_("Quantity"), default=1)
    
    class Meta:
        verbose_name = _("Cart item")
        verbose_name_plural = _("Cart items")
        unique_together = ('cart', 'product', 'variant')
    
    def __str__(self):
        return f"{self.product.name_en} ({self.quantity})"
    
    @property
    def unit_price(self):
        """
        Get the unit price of the item.
        """
        base_price = self.product.sale_price if self.product.is_on_sale and self.product.sale_price else self.product.price
        
        if self.variant:
            return base_price + self.variant.price_adjustment
        
        return base_price
    
    @property
    def subtotal(self):
        """
        Calculate the item subtotal.
        """
        return self.quantity * self.unit_price
