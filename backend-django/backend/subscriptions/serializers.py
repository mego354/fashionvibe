"""
Subscription serializers for the Fashion Hub project.
"""

from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from .models import Subscription, SubscriptionLimit


class SubscriptionLimitSerializer(serializers.ModelSerializer):
    """
    Serializer for the SubscriptionLimit model.
    """
    
    class Meta:
        model = SubscriptionLimit
        fields = [
            'id', 'subscription', 'product_limit', 'product_count',
            'staff_limit', 'staff_count', 'warehouse_limit', 'warehouse_count',
            'analytics_days', 'theme_limit', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Subscription model.
    """
    limits = SubscriptionLimitSerializer(read_only=True)
    
    class Meta:
        model = Subscription
        fields = [
            'id', 'store', 'plan', 'is_active', 'price', 'billing_cycle',
            'start_date', 'end_date', 'current_period_start', 'current_period_end',
            'next_billing_date', 'cancelled_at', 'cancellation_reason',
            'has_custom_domain', 'limits', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'price', 'current_period_start', 'current_period_end',
                           'next_billing_date', 'created_at', 'updated_at']


class SubscriptionCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new subscription.
    """
    
    class Meta:
        model = Subscription
        fields = ['store', 'plan', 'billing_cycle', 'has_custom_domain']
    
    def create(self, validated_data):
        """
        Create a new subscription and its limits.
        """
        subscription = Subscription.objects.create(**validated_data)
        
        # Create subscription limits
        SubscriptionLimit.objects.create(subscription=subscription)
        
        return subscription


class SubscriptionUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating a subscription.
    """
    
    class Meta:
        model = Subscription
        fields = ['plan', 'billing_cycle', 'has_custom_domain']
    
    def update(self, instance, validated_data):
        """
        Update the subscription and its limits.
        """
        # Update subscription
        instance = super().update(instance, validated_data)
        
        # Update subscription limits
        if hasattr(instance, 'limits'):
            instance.limits.save()
        
        return instance


class SubscriptionCancelSerializer(serializers.Serializer):
    """
    Serializer for cancelling a subscription.
    """
    reason = serializers.CharField(required=False, allow_blank=True)
