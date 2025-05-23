"""
Store models for the Fashion Hub project.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
# from django_tenant_schemas.models import TenantMixin

from common.models import TimeStampedModel, TranslatedField
from common.utils import generate_unique_slug, get_file_path


# class Store(TenantMixin, TimeStampedModel, TranslatedField):
class Store(TimeStampedModel, TranslatedField):
    """
    Store model that serves as the tenant in the multi-tenant architecture.
    Each store has its own schema in the database.
    """
    # Tenant fields
    schema_name = models.CharField(max_length=63, unique=True)
    
    # Store details
    slug = models.SlugField(_("Slug"), max_length=100, unique=True)
    logo = models.ImageField(_("Logo"), upload_to=get_file_path, blank=True, null=True)
    favicon = models.ImageField(_("Favicon"), upload_to=get_file_path, blank=True, null=True)
    
    # Contact information
    email = models.EmailField(_("Email"), blank=True)
    phone = models.CharField(_("Phone"), max_length=20, blank=True)
    
    # Social media
    facebook = models.URLField(_("Facebook"), blank=True)
    instagram = models.URLField(_("Instagram"), blank=True)
    twitter = models.URLField(_("Twitter"), blank=True)
    
    # Subscription details
    subscription_plan = models.CharField(
        _("Subscription plan"),
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
    subscription_active = models.BooleanField(_("Subscription active"), default=True)
    subscription_start_date = models.DateTimeField(_("Subscription start date"), auto_now_add=True)
    subscription_end_date = models.DateTimeField(_("Subscription end date"), null=True, blank=True)
    
    # Theme settings
    theme = models.CharField(_("Theme"), max_length=50, default='default')
    primary_color = models.CharField(_("Primary color"), max_length=7, default='#000000')
    secondary_color = models.CharField(_("Secondary color"), max_length=7, default='#ffffff')
    
    # Store settings
    default_language = models.CharField(
        _("Default language"),
        max_length=2,
        choices=[('en', _('English')), ('ar', _('Arabic'))],
        default='en'
    )
    currency = models.CharField(_("Currency"), max_length=3, default='EGP')
    
    # Store policies
    return_policy_en = models.TextField(_("Return policy (English)"), blank=True)
    return_policy_ar = models.TextField(_("Return policy (Arabic)"), blank=True)
    shipping_policy_en = models.TextField(_("Shipping policy (English)"), blank=True)
    shipping_policy_ar = models.TextField(_("Shipping policy (Arabic)"), blank=True)
    privacy_policy_en = models.TextField(_("Privacy policy (English)"), blank=True)
    privacy_policy_ar = models.TextField(_("Privacy policy (Arabic)"), blank=True)
    terms_of_service_en = models.TextField(_("Terms of service (English)"), blank=True)
    terms_of_service_ar = models.TextField(_("Terms of service (Arabic)"), blank=True)
    
    # Auto-create schema
    auto_create_schema = True
    
    # New fields
    latitude = models.DecimalField(_('Latitude'), max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=9, decimal_places=6, null=True, blank=True)
    
    class Meta:
        verbose_name = _("Store")
        verbose_name_plural = _("Stores")
    
    def __str__(self):
        return self.name_en
    
    def save(self, *args, **kwargs):
        """
        Override save method to generate a unique slug.
        """
        if not self.slug:
            self.slug = generate_unique_slug(self, 'name_en')
        
        # Set schema name based on slug
        if not self.schema_name:
            self.schema_name = self.slug
        
        super().save(*args, **kwargs)


class Domain(TimeStampedModel):
    """
    Domain model for the multi-tenant architecture.
    Each store can have multiple domains.
    """
    domain = models.CharField(_("Domain"), max_length=253, unique=True)
    tenant = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='domains')
    is_primary = models.BooleanField(_("Is primary"), default=False)
    
    class Meta:
        verbose_name = _("Domain")
        verbose_name_plural = _("Domains")
    
    def __str__(self):
        return self.domain


class StoreLocation(TimeStampedModel, TranslatedField):
    """
    Physical store location model.
    Each store can have multiple physical locations.
    """
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='locations')
    
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
    
    # Geolocation
    latitude = models.DecimalField(_("Latitude"), max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(_("Longitude"), max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Operating hours
    opening_hours = models.JSONField(_("Opening hours"), default=dict, blank=True)
    
    class Meta:
        verbose_name = _("Store location")
        verbose_name_plural = _("Store locations")
    
    def __str__(self):
        return f"{self.name_en} - {self.store.name_en}"
