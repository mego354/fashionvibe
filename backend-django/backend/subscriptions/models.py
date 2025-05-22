"""
Subscription models for the Fashion Hub project.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from dateutil.relativedelta import relativedelta

from common.models import TimeStampedModel


class Subscription(TimeStampedModel):
    """
    Subscription model for store subscription plans.
    """
    store = models.OneToOneField('stores.Store', on_delete=models.CASCADE, related_name='subscription')
    
    # Plan details
    plan = models.CharField(
        _("Plan"),
        max_length=20,
        choices=[
            ('pay_as_you_go', _('Pay as you go')),
            ('basic', _('Basic')),
            ('standard', _('Standard')),
            ('gold', _('Gold')),
            ('platinum', _('Platinum')),
        ],
        default='basic'
    )
    
    # Subscription status
    is_active = models.BooleanField(_("Is active"), default=True)
    
    # Billing details
    price = models.DecimalField(_("Price"), max_digits=10, decimal_places=2)
    billing_cycle = models.CharField(
        _("Billing cycle"),
        max_length=20,
        choices=[
            ('monthly', _('Monthly')),
            ('yearly', _('Yearly')),
        ],
        default='monthly'
    )
    
    # Subscription dates
    start_date = models.DateTimeField(_("Start date"), default=timezone.now)
    end_date = models.DateTimeField(_("End date"), null=True, blank=True)
    
    # Current billing period
    current_period_start = models.DateTimeField(_("Current period start"), default=timezone.now)
    current_period_end = models.DateTimeField(_("Current period end"), null=True, blank=True)
    
    # Next billing date
    next_billing_date = models.DateTimeField(_("Next billing date"), null=True, blank=True)
    
    # Cancellation
    cancelled_at = models.DateTimeField(_("Cancelled at"), null=True, blank=True)
    cancellation_reason = models.TextField(_("Cancellation reason"), blank=True)
    
    # Custom domain
    has_custom_domain = models.BooleanField(_("Has custom domain"), default=False)
    
    class Meta:
        verbose_name = _("Subscription")
        verbose_name_plural = _("Subscriptions")
        indexes = [
            models.Index(fields=['plan']),
            models.Index(fields=['is_active']),
            models.Index(fields=['next_billing_date']),
        ]
    
    def __str__(self):
        return f"{self.store.name_en} - {self.get_plan_display()}"
    
    def save(self, *args, **kwargs):
        """
        Override save method to set end date and next billing date.
        """
        # Set price based on plan
        if self.plan == 'basic':
            self.price = 500
        elif self.plan == 'standard':
            self.price = 1000
        elif self.plan == 'gold':
            self.price = 1500
        elif self.plan == 'platinum':
            self.price = 3500
        elif self.plan == 'pay_as_you_go':
            self.price = 0
        
        # Set current period end and next billing date
        if not self.current_period_end:
            if self.billing_cycle == 'monthly':
                self.current_period_end = self.current_period_start + relativedelta(months=1)
            else:  # yearly
                self.current_period_end = self.current_period_start + relativedelta(years=1)
            
            self.next_billing_date = self.current_period_end
        
        super().save(*args, **kwargs)
    
    def renew(self):
        """
        Renew the subscription for another period.
        """
        self.current_period_start = self.current_period_end
        
        if self.billing_cycle == 'monthly':
            self.current_period_end = self.current_period_start + relativedelta(months=1)
        else:  # yearly
            self.current_period_end = self.current_period_start + relativedelta(years=1)
        
        self.next_billing_date = self.current_period_end
        self.save()
    
    def cancel(self, reason=''):
        """
        Cancel the subscription.
        """
        self.is_active = False
        self.cancelled_at = timezone.now()
        self.cancellation_reason = reason
        self.save()


class SubscriptionLimit(TimeStampedModel):
    """
    Subscription limit model for tracking usage limits.
    """
    subscription = models.OneToOneField(Subscription, on_delete=models.CASCADE, related_name='limits')
    
    # Product limits
    product_limit = models.IntegerField(_("Product limit"), default=-1)  # -1 means unlimited
    product_count = models.IntegerField(_("Product count"), default=0)
    
    # Staff limits
    staff_limit = models.IntegerField(_("Staff limit"), default=-1)
    staff_count = models.IntegerField(_("Staff count"), default=0)
    
    # Warehouse limits
    warehouse_limit = models.IntegerField(_("Warehouse limit"), default=-1)
    warehouse_count = models.IntegerField(_("Warehouse count"), default=0)
    
    # Analytics limits
    analytics_days = models.IntegerField(_("Analytics days"), default=7)
    
    # Theme limits
    theme_limit = models.IntegerField(_("Theme limit"), default=5)
    
    class Meta:
        verbose_name = _("Subscription limit")
        verbose_name_plural = _("Subscription limits")
    
    def __str__(self):
        return f"Limits for {self.subscription}"
    
    def save(self, *args, **kwargs):
        """
        Override save method to set limits based on plan.
        """
        # Set limits based on plan
        plan = self.subscription.plan
        
        if plan == 'basic':
            self.product_limit = 60
            self.staff_limit = 3
            self.warehouse_limit = 1
            self.analytics_days = 7
            self.theme_limit = 5
        elif plan == 'standard':
            self.product_limit = 200
            self.staff_limit = 7
            self.warehouse_limit = 2
            self.analytics_days = 14
            self.theme_limit = 10
        elif plan == 'gold':
            self.product_limit = -1  # Unlimited
            self.staff_limit = 13
            self.warehouse_limit = 3
            self.analytics_days = 30
            self.theme_limit = 20
        elif plan == 'platinum':
            self.product_limit = -1  # Unlimited
            self.staff_limit = -1  # Unlimited
            self.warehouse_limit = -1  # Unlimited
            self.analytics_days = 90
            self.theme_limit = -1  # All themes
        
        super().save(*args, **kwargs)
    
    def check_product_limit(self):
        """
        Check if the product limit has been reached.
        """
        if self.product_limit == -1:
            return False
        
        return self.product_count >= self.product_limit
    
    def check_staff_limit(self):
        """
        Check if the staff limit has been reached.
        """
        if self.staff_limit == -1:
            return False
        
        return self.staff_count >= self.staff_limit
    
    def check_warehouse_limit(self):
        """
        Check if the warehouse limit has been reached.
        """
        if self.warehouse_limit == -1:
            return False
        
        return self.warehouse_count >= self.warehouse_limit
