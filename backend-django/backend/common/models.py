"""
Common models, utilities, and base classes for the Fashion Hub project.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _


class TimeStampedModel(models.Model):
    """
    An abstract base class model that provides self-updating
    created and modified fields.
    """
    created_at = models.DateTimeField(_("Created at"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated at"), auto_now=True)

    class Meta:
        abstract = True


class TranslatedField(models.Model):
    """
    An abstract base class model that provides fields for
    bilingual content (English and Arabic).
    """
    name_en = models.CharField(_("Name (English)"), max_length=255)
    name_ar = models.CharField(_("Name (Arabic)"), max_length=255)
    description_en = models.TextField(_("Description (English)"), blank=True)
    description_ar = models.TextField(_("Description (Arabic)"), blank=True)

    class Meta:
        abstract = True

    @property
    def name(self):
        """
        Returns the name in the current language.
        This is a placeholder and should be implemented with proper
        language detection in a real application.
        """
        return self.name_en

    @property
    def description(self):
        """
        Returns the description in the current language.
        This is a placeholder and should be implemented with proper
        language detection in a real application.
        """
        return self.description_en
