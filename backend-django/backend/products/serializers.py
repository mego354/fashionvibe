"""
Product serializers for the Fashion Hub project.
"""

from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from common.serializers import DynamicFieldsModelSerializer
from .models import Category, Product, ProductImage, Variant, ProductReview


class CategorySerializer(DynamicFieldsModelSerializer):
    """
    Serializer for the Category model.
    """
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id', 'parent', 'name_en', 'name_ar', 'description_en', 'description_ar',
            'slug', 'image', 'is_active', 'order', 'children', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']
    
    def get_children(self, obj):
        """
        Get serialized children categories.
        """
        children = Category.objects.filter(parent=obj)
        serializer = CategorySerializer(children, many=True, context=self.context)
        return serializer.data


class ProductImageSerializer(serializers.ModelSerializer):
    """
    Serializer for the ProductImage model.
    """
    
    class Meta:
        model = ProductImage
        fields = [
            'id', 'product', 'image', 'alt_text_en', 'alt_text_ar',
            'is_primary', 'order', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class VariantSerializer(serializers.ModelSerializer):
    """
    Serializer for the Variant model.
    """
    
    class Meta:
        model = Variant
        fields = [
            'id', 'product', 'name_en', 'name_ar', 'sku', 'price_adjustment',
            'stock_quantity', 'is_active', 'attributes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for the ProductReview model.
    """
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductReview
        fields = [
            'id', 'product', 'user', 'user_name', 'rating', 'title',
            'comment', 'is_approved', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_approved', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        """
        Get the user's full name.
        """
        return obj.user.full_name
    
    def create(self, validated_data):
        """
        Create a new review, associating it with the current user.
        """
        # Get the current user from the context
        user = self.context['request'].user
        validated_data['user'] = user
        
        return super().create(validated_data)


class ProductSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for the Product model.
    """
    images = ProductImageSerializer(many=True, read_only=True)
    variants = VariantSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_name', 'name_en', 'name_ar', 'description_en', 'description_ar',
            'slug', 'sku', 'price', 'sale_price', 'cost_price', 'is_active', 'is_featured',
            'is_new', 'is_on_sale', 'weight', 'width', 'height', 'depth', 'meta_title_en',
            'meta_title_ar', 'meta_description_en', 'meta_description_ar', 'search_tags',
            'images', 'variants', 'reviews', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'is_on_sale', 'created_at', 'updated_at']
    
    def get_category_name(self, obj):
        """
        Get the category name.
        """
        return obj.category.name_en
    
    def get_reviews(self, obj):
        """
        Get approved reviews only.
        """
        reviews = obj.reviews.filter(is_approved=True)
        serializer = ProductReviewSerializer(reviews, many=True, context=self.context)
        return serializer.data


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating products.
    """
    
    class Meta:
        model = Product
        fields = [
            'category', 'name_en', 'name_ar', 'description_en', 'description_ar',
            'sku', 'price', 'sale_price', 'cost_price', 'is_active', 'is_featured',
            'is_new', 'weight', 'width', 'height', 'depth', 'meta_title_en',
            'meta_title_ar', 'meta_description_en', 'meta_description_ar', 'search_tags'
        ]
    
    def validate_sku(self, value):
        """
        Validate that the SKU is unique.
        """
        instance = self.instance
        if Product.objects.filter(sku=value).exclude(id=instance.id if instance else None).exists():
            raise serializers.ValidationError(_("A product with this SKU already exists."))
        return value
