"""
Staff views for the Fashion Hub project.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext_lazy as _

from common.permissions import IsStoreOwnerOrManager
from .models import Staff, StaffPerformance
from .serializers import (
    StaffSerializer, StaffPerformanceSerializer,
    StaffCreateSerializer, StaffUpdateSerializer,
    StaffPerformanceCreateSerializer
)


class StaffViewSet(viewsets.ModelViewSet):
    """
    API endpoint for staff members.
    """
    serializer_class = StaffSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter staff based on user permissions.
        """
        user = self.request.user
        
        # Store owners can see all staff in their store
        if user.is_store_owner:
            return Staff.objects.filter(store__owner=user)
        
        # Store managers can see all staff in their store except owners
        if user.is_store_manager:
            return Staff.objects.filter(store__managers=user).exclude(role='owner')
        
        return Staff.objects.none()
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action == 'create':
            return StaffCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return StaffUpdateSerializer
        return self.serializer_class
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """
        Activate a staff member.
        """
        staff = self.get_object()
        staff.is_active = True
        staff.save()
        
        return Response({'detail': _('Staff member activated.')}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """
        Deactivate a staff member.
        """
        staff = self.get_object()
        
        # Prevent deactivating store owners
        if staff.role == 'owner':
            return Response({'detail': _('Cannot deactivate store owner.')}, status=status.HTTP_400_BAD_REQUEST)
        
        staff.is_active = False
        staff.save()
        
        return Response({'detail': _('Staff member deactivated.')}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['get'])
    def performance(self, request, pk=None):
        """
        Get performance records for a staff member.
        """
        staff = self.get_object()
        performance = staff.performance.all()
        serializer = StaffPerformanceSerializer(performance, many=True)
        
        return Response(serializer.data)


class StaffPerformanceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for staff performance records.
    """
    serializer_class = StaffPerformanceSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter performance records based on user permissions.
        """
        user = self.request.user
        
        # Store owners can see all performance records in their store
        if user.is_store_owner:
            return StaffPerformance.objects.filter(staff__store__owner=user)
        
        # Store managers can see all performance records in their store except owners
        if user.is_store_manager:
            return StaffPerformance.objects.filter(staff__store__managers=user).exclude(staff__role='owner')
        
        return StaffPerformance.objects.none()
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action == 'create':
            return StaffPerformanceCreateSerializer
        return self.serializer_class
