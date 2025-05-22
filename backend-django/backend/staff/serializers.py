"""
Staff serializers for the Fashion Hub project.
"""

from rest_framework import serializers
from django.utils.translation import gettext_lazy as _

from .models import Staff, StaffPerformance


class StaffPerformanceSerializer(serializers.ModelSerializer):
    """
    Serializer for the StaffPerformance model.
    """
    
    class Meta:
        model = StaffPerformance
        fields = [
            'id', 'staff', 'period_start', 'period_end', 'orders_processed',
            'sales_amount', 'customer_satisfaction', 'returns_processed',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StaffSerializer(serializers.ModelSerializer):
    """
    Serializer for the Staff model.
    """
    user_name = serializers.SerializerMethodField()
    user_email = serializers.SerializerMethodField()
    performance = serializers.SerializerMethodField()
    
    class Meta:
        model = Staff
        fields = [
            'id', 'user', 'user_name', 'user_email', 'store', 'role', 'job_title',
            'department', 'work_phone', 'work_email', 'is_active',
            'can_manage_products', 'can_manage_orders', 'can_manage_staff',
            'can_view_analytics', 'can_manage_settings', 'hire_date',
            'performance', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'hire_date', 'created_at', 'updated_at']
    
    def get_user_name(self, obj):
        """
        Get the user's full name.
        """
        return obj.user.full_name
    
    def get_user_email(self, obj):
        """
        Get the user's email.
        """
        return obj.user.email
    
    def get_performance(self, obj):
        """
        Get the latest performance record.
        """
        performance = obj.performance.first()
        if performance:
            return StaffPerformanceSerializer(performance).data
        return None


class StaffCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new staff member.
    """
    user_id = serializers.IntegerField()
    
    class Meta:
        model = Staff
        fields = [
            'user_id', 'store', 'role', 'job_title', 'department',
            'work_phone', 'work_email', 'can_manage_products',
            'can_manage_orders', 'can_manage_staff', 'can_view_analytics',
            'can_manage_settings'
        ]
    
    def validate_user_id(self, value):
        """
        Validate that the user exists and is not already a staff member.
        """
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            user = User.objects.get(id=value)
        except User.DoesNotExist:
            raise serializers.ValidationError(_("User not found."))
        
        if hasattr(user, 'staff_profile'):
            raise serializers.ValidationError(_("User is already a staff member."))
        
        return value
    
    def create(self, validated_data):
        """
        Create a new staff member.
        """
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        user_id = validated_data.pop('user_id')
        user = User.objects.get(id=user_id)
        
        return Staff.objects.create(user=user, **validated_data)


class StaffUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating a staff member.
    """
    
    class Meta:
        model = Staff
        fields = [
            'role', 'job_title', 'department', 'work_phone', 'work_email',
            'is_active', 'can_manage_products', 'can_manage_orders',
            'can_manage_staff', 'can_view_analytics', 'can_manage_settings'
        ]


class StaffPerformanceCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new staff performance record.
    """
    
    class Meta:
        model = StaffPerformance
        fields = [
            'staff', 'period_start', 'period_end', 'orders_processed',
            'sales_amount', 'customer_satisfaction', 'returns_processed', 'notes'
        ]
    
    def validate(self, attrs):
        """
        Validate that the period end is after the period start.
        """
        if attrs['period_end'] < attrs['period_start']:
            raise serializers.ValidationError(_("Period end must be after period start."))
        
        return attrs
