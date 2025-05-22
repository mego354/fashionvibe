"""
Subscription views for the Fashion Hub project.
"""

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext_lazy as _

from common.permissions import IsStoreOwnerOrManager
from .models import Subscription, SubscriptionLimit
from .serializers import (
    SubscriptionSerializer, SubscriptionLimitSerializer,
    SubscriptionCreateSerializer, SubscriptionUpdateSerializer,
    SubscriptionCancelSerializer
)


class SubscriptionViewSet(viewsets.ModelViewSet):
    """
    API endpoint for subscriptions.
    """
    serializer_class = SubscriptionSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter subscriptions based on user permissions.
        """
        user = self.request.user
        
        # Store owners can see their store's subscription
        if user.is_store_owner:
            return Subscription.objects.filter(store__owner=user)
        
        # Store managers can see their store's subscription
        if user.is_store_manager:
            return Subscription.objects.filter(store__managers=user)
        
        return Subscription.objects.none()
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action == 'create':
            return SubscriptionCreateSerializer
        elif self.action in ['update', 'partial_update']:
            return SubscriptionUpdateSerializer
        return self.serializer_class
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancel a subscription.
        """
        subscription = self.get_object()
        serializer = SubscriptionCancelSerializer(data=request.data)
        
        if serializer.is_valid():
            reason = serializer.validated_data.get('reason', '')
            subscription.cancel(reason=reason)
            
            return Response({'detail': _('Subscription cancelled.')}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['post'])
    def renew(self, request, pk=None):
        """
        Renew a subscription.
        """
        subscription = self.get_object()
        subscription.renew()
        
        return Response({'detail': _('Subscription renewed.')}, status=status.HTTP_200_OK)


class SubscriptionLimitViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for subscription limits.
    """
    serializer_class = SubscriptionLimitSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter subscription limits based on user permissions.
        """
        user = self.request.user
        
        # Store owners can see their store's subscription limits
        if user.is_store_owner:
            return SubscriptionLimit.objects.filter(subscription__store__owner=user)
        
        # Store managers can see their store's subscription limits
        if user.is_store_manager:
            return SubscriptionLimit.objects.filter(subscription__store__managers=user)
        
        return SubscriptionLimit.objects.none()
    
    @action(detail=True, methods=['get'])
    def check_limits(self, request, pk=None):
        """
        Check if any limits have been reached.
        """
        limit = self.get_object()
        
        return Response({
            'product_limit_reached': limit.check_product_limit(),
            'staff_limit_reached': limit.check_staff_limit(),
            'warehouse_limit_reached': limit.check_warehouse_limit(),
        }, status=status.HTTP_200_OK)
