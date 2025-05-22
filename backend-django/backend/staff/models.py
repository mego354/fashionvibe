"""
Staff models for the Fashion Hub project.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _

from common.models import TimeStampedModel


class Staff(TimeStampedModel):
    """
    Staff model for store employees.
    """
    user = models.OneToOneField('users.User', on_delete=models.CASCADE, related_name='staff_profile')
    store = models.ForeignKey('stores.Store', on_delete=models.CASCADE, related_name='staff')
    
    # Staff role
    role = models.CharField(
        _("Role"),
        max_length=20,
        choices=[
            ('owner', _('Owner')),
            ('manager', _('Manager')),
            ('sales', _('Sales Staff')),
        ],
        default='sales'
    )
    
    # Staff details
    job_title = models.CharField(_("Job title"), max_length=100, blank=True)
    department = models.CharField(_("Department"), max_length=100, blank=True)
    
    # Contact information
    work_phone = models.CharField(_("Work phone"), max_length=20, blank=True)
    work_email = models.EmailField(_("Work email"), blank=True)
    
    # Permissions
    is_active = models.BooleanField(_("Is active"), default=True)
    
    # Access control
    can_manage_products = models.BooleanField(_("Can manage products"), default=False)
    can_manage_orders = models.BooleanField(_("Can manage orders"), default=False)
    can_manage_staff = models.BooleanField(_("Can manage staff"), default=False)
    can_view_analytics = models.BooleanField(_("Can view analytics"), default=False)
    can_manage_settings = models.BooleanField(_("Can manage settings"), default=False)
    
    # Performance tracking
    hire_date = models.DateField(_("Hire date"), auto_now_add=True)
    
    class Meta:
        verbose_name = _("Staff")
        verbose_name_plural = _("Staff")
        ordering = ['role', 'user__first_name']
        indexes = [
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.user.full_name} - {self.get_role_display()}"
    
    def save(self, *args, **kwargs):
        """
        Override save method to set user flags based on role.
        """
        # Set user flags based on role
        if self.role == 'owner':
            self.user.is_store_owner = True
            self.user.is_store_manager = False
            self.user.is_store_staff = False
            
            # Set all permissions to True for owners
            self.can_manage_products = True
            self.can_manage_orders = True
            self.can_manage_staff = True
            self.can_view_analytics = True
            self.can_manage_settings = True
            
        elif self.role == 'manager':
            self.user.is_store_owner = False
            self.user.is_store_manager = True
            self.user.is_store_staff = False
            
            # Set default permissions for managers
            self.can_manage_products = True
            self.can_manage_orders = True
            self.can_manage_staff = False
            self.can_view_analytics = True
            self.can_manage_settings = False
            
        else:  # sales
            self.user.is_store_owner = False
            self.user.is_store_manager = False
            self.user.is_store_staff = True
            
            # Set default permissions for sales staff
            self.can_manage_products = False
            self.can_manage_orders = True
            self.can_manage_staff = False
            self.can_view_analytics = False
            self.can_manage_settings = False
        
        # Save the user
        self.user.save()
        
        super().save(*args, **kwargs)


class StaffPerformance(TimeStampedModel):
    """
    Staff performance model for tracking sales and metrics.
    """
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE, related_name='performance')
    
    # Time period
    period_start = models.DateField(_("Period start"))
    period_end = models.DateField(_("Period end"))
    
    # Sales metrics
    orders_processed = models.PositiveIntegerField(_("Orders processed"), default=0)
    sales_amount = models.DecimalField(_("Sales amount"), max_digits=10, decimal_places=2, default=0)
    
    # Customer metrics
    customer_satisfaction = models.DecimalField(_("Customer satisfaction"), max_digits=3, decimal_places=2, null=True, blank=True)
    
    # Additional metrics
    returns_processed = models.PositiveIntegerField(_("Returns processed"), default=0)
    
    # Notes
    notes = models.TextField(_("Notes"), blank=True)
    
    class Meta:
        verbose_name = _("Staff performance")
        verbose_name_plural = _("Staff performance")
        ordering = ['-period_end']
        indexes = [
            models.Index(fields=['staff']),
            models.Index(fields=['period_start']),
            models.Index(fields=['period_end']),
        ]
    
    def __str__(self):
        return f"{self.staff.user.full_name} - {self.period_start} to {self.period_end}"
