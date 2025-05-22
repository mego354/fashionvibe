"""
Analytics serializers for the Fashion Hub project.
"""

from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from .models import AnalyticsEvent, DailyAnalytics, ProductPerformance


class AnalyticsEventSerializer(serializers.ModelSerializer):
    """
    Serializer for the AnalyticsEvent model.
    """
    
    class Meta:
        model = AnalyticsEvent
        fields = [
            'id', 'store', 'user', 'event_type', 'event_data', 'session_id',
            'ip_address', 'user_agent', 'referrer', 'device_type', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class AnalyticsEventCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new analytics event.
    """
    
    class Meta:
        model = AnalyticsEvent
        fields = [
            'store', 'event_type', 'event_data', 'session_id',
            'ip_address', 'user_agent', 'referrer', 'device_type'
        ]
    
    def create(self, validated_data):
        """
        Create a new analytics event.
        """
        request = self.context.get('request')
        
        # Set user if authenticated
        if request and request.user.is_authenticated:
            validated_data['user'] = request.user
        
        return super().create(validated_data)


class DailyAnalyticsSerializer(serializers.ModelSerializer):
    """
    Serializer for the DailyAnalytics model.
    """
    
    class Meta:
        model = DailyAnalytics
        fields = [
            'id', 'store', 'date', 'page_views', 'unique_visitors',
            'product_views', 'add_to_cart_count', 'orders_count', 'revenue',
            'new_users', 'search_count', 'desktop_users', 'tablet_users',
            'mobile_users', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProductPerformanceSerializer(serializers.ModelSerializer):
    """
    Serializer for the ProductPerformance model.
    """
    conversion_rate = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductPerformance
        fields = [
            'id', 'store', 'product', 'product_name', 'date', 'views',
            'add_to_cart_count', 'purchase_count', 'revenue',
            'conversion_rate', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_conversion_rate(self, obj):
        """
        Get the conversion rate.
        """
        return obj.conversion_rate
    
    def get_product_name(self, obj):
        """
        Get the product name.
        """
        return obj.product.name_en
