"""
Store views for the Fashion Hub project.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils.translation import gettext_lazy as _

from common.permissions import IsStoreOwnerOrManager
from .models import Store, Domain, StoreLocation
from .serializers import (
    StoreSerializer, DomainSerializer, StoreLocationSerializer,
    StoreCreateSerializer, StoreSettingsSerializer
)


class StoreViewSet(viewsets.ModelViewSet):
    """
    API endpoint for stores.
    """
    queryset = Store.objects.all()
    serializer_class = StoreSerializer
    permission_classes = [permissions.IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action == 'create':
            return StoreCreateSerializer
        elif self.action == 'update_settings':
            return StoreSettingsSerializer
        return self.serializer_class
    
    def get_queryset(self):
        """
        Filter stores based on user permissions.
        """
        user = self.request.user
        
        # In a real implementation, this would filter by user's stores
        # For now, return all stores for simplicity
        return Store.objects.all()
    
    @action(detail=True, methods=['patch'])
    def update_settings(self, request, pk=None):
        """
        Update store settings.
        """
        store = self.get_object()
        serializer = self.get_serializer(store, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def subscription(self, request, pk=None):
        """
        Get store subscription details.
        """
        store = self.get_object()
        
        subscription_data = {
            'plan': store.subscription_plan,
            'active': store.subscription_active,
            'start_date': store.subscription_start_date,
            'end_date': store.subscription_end_date,
        }
        
        return Response(subscription_data)


class DomainViewSet(viewsets.ModelViewSet):
    """
    API endpoint for domains.
    """
    serializer_class = DomainSerializer
    permission_classes = [permissions.IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter domains based on store.
        """
        store_id = self.kwargs.get('store_pk')
        if store_id:
            return Domain.objects.filter(tenant_id=store_id)
        return Domain.objects.none()
    
    def perform_create(self, serializer):
        """
        Create a new domain for the specified store.
        """
        store_id = self.kwargs.get('store_pk')
        store = Store.objects.get(id=store_id)
        serializer.save(tenant=store)
    
    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None, store_pk=None):
        """
        Set a domain as the primary domain.
        """
        domain = self.get_object()
        
        # Set all other domains of this store to non-primary
        Domain.objects.filter(tenant_id=store_pk, is_primary=True).update(is_primary=False)
        
        # Set this domain as primary
        domain.is_primary = True
        domain.save()
        
        return Response({'detail': _('Domain set as primary.')}, status=status.HTTP_200_OK)


class StoreLocationViewSet(viewsets.ModelViewSet):
    """
    API endpoint for store locations.
    """
    serializer_class = StoreLocationSerializer
    permission_classes = [permissions.IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter locations based on store.
        """
        store_id = self.kwargs.get('store_pk')
        if store_id:
            return StoreLocation.objects.filter(store_id=store_id)
        return StoreLocation.objects.none()
    
    def perform_create(self, serializer):
        """
        Create a new location for the specified store.
        """
        store_id = self.kwargs.get('store_pk')
        store = Store.objects.get(id=store_id)
        serializer.save(store=store)
