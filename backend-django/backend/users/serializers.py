"""
User serializers for the Fashion Hub project.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from common.serializers import DynamicFieldsModelSerializer
from .models import Address

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer that adds user data to the token response.
    """
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Add user data to response
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'username': self.user.username,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'is_store_owner': self.user.is_store_owner,
            'is_store_manager': self.user.is_store_manager,
            'is_store_staff': self.user.is_store_staff,
            'is_customer': self.user.is_customer,
            'language_preference': self.user.language_preference,
        }
        
        return data


class UserSerializer(DynamicFieldsModelSerializer):
    """
    Serializer for the User model.
    """
    password = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'username', 'password', 'first_name', 'last_name',
            'phone_number', 'is_verified', 'is_store_owner', 'is_store_manager',
            'is_store_staff', 'is_customer', 'profile_picture', 'language_preference',
            'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'country',
            'date_joined', 'last_login', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'is_verified', 'date_joined', 'last_login', 'created_at', 'updated_at']
    
    def validate_password(self, value):
        """
        Validate password using Django's password validation.
        """
        validate_password(value)
        return value
    
    def create(self, validated_data):
        """
        Create a new user with encrypted password.
        """
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        return user
    
    def update(self, instance, validated_data):
        """
        Update user, handling password separately.
        """
        password = validated_data.pop('password', None)
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Update password if provided
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class AddressSerializer(serializers.ModelSerializer):
    """
    Serializer for the Address model.
    """
    
    class Meta:
        model = Address
        fields = [
            'id', 'user', 'name', 'is_default', 'recipient_name', 'phone_number',
            'address_line1', 'address_line2', 'city', 'state', 'postal_code',
            'country', 'delivery_instructions', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        """
        Create a new address, associating it with the current user.
        """
        # Get the current user from the context
        user = self.context['request'].user
        validated_data['user'] = user
        
        return super().create(validated_data)


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    """
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'email', 'username', 'password', 'password_confirm', 'first_name', 'last_name',
            'phone_number', 'language_preference'
        ]
    
    def validate(self, attrs):
        """
        Validate that the passwords match.
        """
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        
        return attrs
    
    def create(self, validated_data):
        """
        Create a new user with encrypted password.
        """
        # Remove password_confirm from the data
        validated_data.pop('password_confirm', None)
        
        # Create the user
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        
        return user


class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password change.
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        """
        Validate that the new passwords match and the old password is correct.
        """
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})
        
        return attrs
    
    def validate_old_password(self, value):
        """
        Validate that the old password is correct.
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is not correct")
        return value
