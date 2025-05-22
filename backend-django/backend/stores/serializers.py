"""
Store serializers for the Fashion Hub project.
"""

from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from common.serializers import DynamicFieldsModelSerializer, TranslatedFieldSerializer
from .models import Store, Domain, StoreLocation


class DomainSerializer(serializers.ModelSerializer):
    """
    Serializer for the Domain model.
    """
    
    class Meta:
        model = Domain
        fields = ['id', 'domain', 'is_primary', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class StoreLocationSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for the StoreLocation model.
    """
    
    class Meta:
        model = StoreLocation
        fields = [
            'id', 'store', 'name_en', 'name_ar', 'description_en', 'description_ar',
            'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country',
            'phone', 'email', 'latitude', 'longitude', 'opening_hours',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'store', 'created_at', 'updated_at']


class StoreSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for the Store model.
    """
    domains = DomainSerializer(many=True, read_only=True)
    locations = StoreLocationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Store
        fields = [
            'id', 'schema_name', 'slug', 'name_en', 'name_ar', 'description_en', 'description_ar',
            'logo', 'favicon', 'email', 'phone', 'facebook', 'instagram', 'twitter',
            'subscription_plan', 'subscription_active', 'subscription_start_date', 'subscription_end_date',
            'theme', 'primary_color', 'secondary_color', 'default_language', 'currency',
            'return_policy_en', 'return_policy_ar', 'shipping_policy_en', 'shipping_policy_ar',
            'privacy_policy_en', 'privacy_policy_ar', 'terms_of_service_en', 'terms_of_service_ar',
            'domains', 'locations', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'schema_name', 'slug', 'created_at', 'updated_at']


class StoreCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new store.
    """
    domain = serializers.CharField(max_length=253, write_only=True)
    
    class Meta:
        model = Store
        fields = [
            'name_en', 'name_ar', 'description_en', 'description_ar',
            'email', 'phone', 'subscription_plan', 'default_language', 'domain'
        ]
    
    def create(self, validated_data):
        """
        Create a new store and its primary domain.
        """
        domain_name = validated_data.pop('domain')
        
        # Create the store
        store = Store.objects.create(**validated_data)
        
        # Create the domain
        Domain.objects.create(
            domain=domain_name,
            tenant=store,
            is_primary=True
        )
        
        return store


class StoreSettingsSerializer(serializers.ModelSerializer):
    """
    Serializer for updating store settings.
    """
    
    class Meta:
        model = Store
        fields = [
            'name_en', 'name_ar', 'description_en', 'description_ar',
            'logo', 'favicon', 'email', 'phone', 'facebook', 'instagram', 'twitter',
            'theme', 'primary_color', 'secondary_color', 'default_language', 'currency',
            'return_policy_en', 'return_policy_ar', 'shipping_policy_en', 'shipping_policy_ar',
            'privacy_policy_en', 'privacy_policy_ar', 'terms_of_service_en', 'terms_of_service_ar',
        ]
