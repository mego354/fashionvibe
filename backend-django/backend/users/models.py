"""
User models for the Fashion Hub project.
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from common.models import TimeStampedModel


class User(AbstractUser, TimeStampedModel):
    """
    Custom user model for Fashion Hub.
    Extends the Django AbstractUser to add additional fields and functionality.
    """
    email = models.EmailField(_("Email address"), unique=True)
    phone_number = models.CharField(_("Phone number"), max_length=20, blank=True)
    is_verified = models.BooleanField(_("Is verified"), default=False)
    
    # User type flags
    is_store_owner = models.BooleanField(_("Is store owner"), default=False)
    is_store_manager = models.BooleanField(_("Is store manager"), default=False)
    is_store_staff = models.BooleanField(_("Is store staff"), default=False)
    is_customer = models.BooleanField(_("Is customer"), default=True)
    
    # Profile fields
    profile_picture = models.ImageField(_("Profile picture"), upload_to='profile_pictures', blank=True, null=True)
    
    # Address fields
    address_line1 = models.CharField(_("Address line 1"), max_length=255, blank=True)
    address_line2 = models.CharField(_("Address line 2"), max_length=255, blank=True)
    city = models.CharField(_("City"), max_length=100, blank=True)
    state = models.CharField(_("State/Province"), max_length=100, blank=True)
    postal_code = models.CharField(_("Postal code"), max_length=20, blank=True)
    country = models.CharField(_("Country"), max_length=100, blank=True)
    
    # Preferences
    language_preference = models.CharField(
        _("Language preference"),
        max_length=2,
        choices=[('en', _('English')), ('ar', _('Arabic'))],
        default='en'
    )
    
    # Required for authentication
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']
    
    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users")
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['phone_number']),
        ]
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        """
        Returns the user's full name.
        """
        return f"{self.first_name} {self.last_name}"


class Address(TimeStampedModel):
    """
    Model for storing multiple addresses for users.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    name = models.CharField(_("Address name"), max_length=100)  # e.g., "Home", "Work"
    is_default = models.BooleanField(_("Is default address"), default=False)
    
    # Address details
    recipient_name = models.CharField(_("Recipient name"), max_length=255)
    phone_number = models.CharField(_("Phone number"), max_length=20)
    address_line1 = models.CharField(_("Address line 1"), max_length=255)
    address_line2 = models.CharField(_("Address line 2"), max_length=255, blank=True)
    city = models.CharField(_("City"), max_length=100)
    state = models.CharField(_("State/Province"), max_length=100)
    postal_code = models.CharField(_("Postal code"), max_length=20)
    country = models.CharField(_("Country"), max_length=100)
    
    # Additional information
    delivery_instructions = models.TextField(_("Delivery instructions"), blank=True)
    
    class Meta:
        verbose_name = _("Address")
        verbose_name_plural = _("Addresses")
        ordering = ['-is_default', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.user.email}"
    
    def save(self, *args, **kwargs):
        """
        Override save method to ensure only one default address per user.
        """
        if self.is_default:
            # Set all other addresses of this user to non-default
            Address.objects.filter(user=self.user, is_default=True).update(is_default=False)
        super().save(*args, **kwargs)
