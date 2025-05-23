"""
Product models for the Fashion Hub project.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.fields import ArrayField
from django.contrib.postgres.indexes import GinIndex

from common.models import TimeStampedModel, TranslatedField
from common.utils import generate_unique_slug, get_file_path
from stores.models import Store


class Category(TimeStampedModel, TranslatedField):
    """
    Product category model.
    """
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='children')
    slug = models.SlugField(_("Slug"), max_length=100, unique=True)
    image = models.ImageField(_("Image"), upload_to=get_file_path, blank=True, null=True)
    is_active = models.BooleanField(_("Is active"), default=True)
    order = models.PositiveIntegerField(_("Order"), default=0)
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='categories')
    
    class Meta:
        verbose_name = _("Category")
        verbose_name_plural = _("Categories")
        ordering = ['order', 'name_en']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name_en
    
    def save(self, *args, **kwargs):
        """
        Override save method to generate a unique slug.
        """
        if not self.slug:
            self.slug = generate_unique_slug(self, 'name_en')
        super().save(*args, **kwargs)


class Product(TimeStampedModel, TranslatedField):
    """
    Product model.
    """
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='products')
    slug = models.SlugField(_("Slug"), max_length=100, unique=True)
    sku = models.CharField(_("SKU"), max_length=50, unique=True)
    price = models.DecimalField(_("Price"), max_digits=10, decimal_places=2)
    sale_price = models.DecimalField(_("Sale price"), max_digits=10, decimal_places=2, null=True, blank=True)
    cost_price = models.DecimalField(_("Cost price"), max_digits=10, decimal_places=2, null=True, blank=True)
    
    # Product status
    is_active = models.BooleanField(_("Is active"), default=True)
    is_featured = models.BooleanField(_("Is featured"), default=False)
    is_new = models.BooleanField(_("Is new"), default=False)
    is_on_sale = models.BooleanField(_("Is on sale"), default=False)
    
    # Product details
    weight = models.DecimalField(_("Weight (kg)"), max_digits=6, decimal_places=2, null=True, blank=True)
    width = models.DecimalField(_("Width (cm)"), max_digits=6, decimal_places=2, null=True, blank=True)
    height = models.DecimalField(_("Height (cm)"), max_digits=6, decimal_places=2, null=True, blank=True)
    depth = models.DecimalField(_("Depth (cm)"), max_digits=6, decimal_places=2, null=True, blank=True)
    
    # SEO fields
    meta_title_en = models.CharField(_("Meta title (English)"), max_length=100, blank=True)
    meta_title_ar = models.CharField(_("Meta title (Arabic)"), max_length=100, blank=True)
    meta_description_en = models.TextField(_("Meta description (English)"), blank=True)
    meta_description_ar = models.TextField(_("Meta description (Arabic)"), blank=True)
    
    # Search fields
    search_tags = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        null=True,
        verbose_name=_("Search tags")
    )
    
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='products')
    
    class Meta:
        verbose_name = _("Product")
        verbose_name_plural = _("Products")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['sku']),
            models.Index(fields=['is_active']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['is_new']),
            models.Index(fields=['is_on_sale']),
            GinIndex(fields=['search_tags']),
        ]
    
    def __str__(self):
        return self.name_en
    
    def save(self, *args, **kwargs):
        """
        Override save method to generate a unique slug.
        """
        if not self.slug:
            self.slug = generate_unique_slug(self, 'name_en')
        
        # Set is_on_sale flag if sale_price is set
        if self.sale_price is not None and self.sale_price < self.price:
            self.is_on_sale = True
        else:
            self.is_on_sale = False
        
        super().save(*args, **kwargs)


class ProductImage(TimeStampedModel):
    """
    Product image model.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(_("Image"), upload_to=get_file_path)
    alt_text_en = models.CharField(_("Alt text (English)"), max_length=100, blank=True)
    alt_text_ar = models.CharField(_("Alt text (Arabic)"), max_length=100, blank=True)
    is_primary = models.BooleanField(_("Is primary"), default=False)
    order = models.PositiveIntegerField(_("Order"), default=0)
    
    class Meta:
        verbose_name = _("Product image")
        verbose_name_plural = _("Product images")
        ordering = ['order']
    
    def __str__(self):
        return f"Image for {self.product.name_en}"
    
    def save(self, *args, **kwargs):
        """
        Override save method to ensure only one primary image per product.
        """
        if self.is_primary:
            # Set all other images of this product to non-primary
            ProductImage.objects.filter(product=self.product, is_primary=True).update(is_primary=False)
        super().save(*args, **kwargs)


class Variant(TimeStampedModel):
    """
    Product variant model (e.g., size, color).
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name_en = models.CharField(_("Name (English)"), max_length=100)
    name_ar = models.CharField(_("Name (Arabic)"), max_length=100)
    sku = models.CharField(_("SKU"), max_length=50, unique=True)
    price_adjustment = models.DecimalField(_("Price adjustment"), max_digits=10, decimal_places=2, default=0)
    stock_quantity = models.PositiveIntegerField(_("Stock quantity"), default=0)
    is_active = models.BooleanField(_("Is active"), default=True)
    
    # Variant attributes (e.g., color, size)
    attributes = models.JSONField(_("Attributes"), default=dict)
    
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='variants')
    
    class Meta:
        verbose_name = _("Variant")
        verbose_name_plural = _("Variants")
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return f"{self.product.name_en} - {self.name_en}"


class ProductReview(TimeStampedModel):
    """
    Product review model.
    """
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey('users.User', on_delete=models.CASCADE, related_name='product_reviews')
    rating = models.PositiveSmallIntegerField(_("Rating"), choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(_("Title"), max_length=100)
    comment = models.TextField(_("Comment"))
    is_approved = models.BooleanField(_("Is approved"), default=False)
    
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='product_reviews')
    
    class Meta:
        verbose_name = _("Product review")
        verbose_name_plural = _("Product reviews")
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['rating']),
            models.Index(fields=['is_approved']),
        ]
    
    def __str__(self):
        return f"Review for {self.product.name_en} by {self.user.email}"
