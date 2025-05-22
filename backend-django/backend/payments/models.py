"""
Payment models for the Fashion Hub project.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _

from common.models import TimeStampedModel


class Payment(TimeStampedModel):
    """
    Payment model for tracking payments.
    """
    # Payment reference
    payment_id = models.CharField(_("Payment ID"), max_length=100, unique=True)
    order = models.ForeignKey('orders.Order', on_delete=models.CASCADE, related_name='payments')
    
    # Payment details
    amount = models.DecimalField(_("Amount"), max_digits=10, decimal_places=2)
    currency = models.CharField(_("Currency"), max_length=3, default='EGP')
    
    # Payment status
    status = models.CharField(
        _("Status"),
        max_length=20,
        choices=[
            ('pending', _('Pending')),
            ('success', _('Success')),
            ('failed', _('Failed')),
            ('refunded', _('Refunded')),
        ],
        default='pending'
    )
    
    # Payment method
    payment_method = models.CharField(_("Payment method"), max_length=50)
    
    # Paymob specific fields
    paymob_transaction_id = models.CharField(_("Paymob transaction ID"), max_length=100, blank=True)
    paymob_order_id = models.CharField(_("Paymob order ID"), max_length=100, blank=True)
    
    # Response data
    response_data = models.JSONField(_("Response data"), default=dict, blank=True)
    
    # Error information
    error_message = models.TextField(_("Error message"), blank=True)
    
    class Meta:
        verbose_name = _("Payment")
        verbose_name_plural = _("Payments")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payment_id']),
            models.Index(fields=['order']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return self.payment_id


class SubscriptionPayment(TimeStampedModel):
    """
    Subscription payment model for tracking store subscription payments.
    """
    # Payment reference
    payment_id = models.CharField(_("Payment ID"), max_length=100, unique=True)
    subscription = models.ForeignKey('subscriptions.Subscription', on_delete=models.CASCADE, related_name='payments')
    
    # Payment details
    amount = models.DecimalField(_("Amount"), max_digits=10, decimal_places=2)
    currency = models.CharField(_("Currency"), max_length=3, default='EGP')
    
    # Payment status
    status = models.CharField(
        _("Status"),
        max_length=20,
        choices=[
            ('pending', _('Pending')),
            ('success', _('Success')),
            ('failed', _('Failed')),
            ('refunded', _('Refunded')),
        ],
        default='pending'
    )
    
    # Payment method
    payment_method = models.CharField(_("Payment method"), max_length=50)
    
    # Paymob specific fields
    paymob_transaction_id = models.CharField(_("Paymob transaction ID"), max_length=100, blank=True)
    paymob_order_id = models.CharField(_("Paymob order ID"), max_length=100, blank=True)
    
    # Response data
    response_data = models.JSONField(_("Response data"), default=dict, blank=True)
    
    # Error information
    error_message = models.TextField(_("Error message"), blank=True)
    
    # Billing period
    billing_period_start = models.DateTimeField(_("Billing period start"))
    billing_period_end = models.DateTimeField(_("Billing period end"))
    
    class Meta:
        verbose_name = _("Subscription payment")
        verbose_name_plural = _("Subscription payments")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['payment_id']),
            models.Index(fields=['subscription']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return self.payment_id
