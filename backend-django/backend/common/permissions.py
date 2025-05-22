"""
Common permissions for the Fashion Hub project.
"""

from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.owner == request.user


class IsStoreOwnerOrManager(permissions.BasePermission):
    """
    Custom permission to only allow store owners or managers to access a view.
    """

    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is a store owner or manager
        return request.user.is_store_owner or request.user.is_store_manager


class IsStoreStaff(permissions.BasePermission):
    """
    Custom permission to only allow store staff to access a view.
    """

    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user.is_authenticated:
            return False
        
        # Check if user is store staff
        return request.user.is_store_staff
