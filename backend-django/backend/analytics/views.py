"""
Analytics views for the Fashion Hub project.
"""

from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.translation import gettext_lazy as _
from django.db.models import Sum, Count, Avg
from django.utils import timezone
from datetime import timedelta

from common.permissions import IsStoreOwnerOrManager
from .models import AnalyticsEvent, DailyAnalytics, ProductPerformance
from .serializers import (
    AnalyticsEventSerializer, AnalyticsEventCreateSerializer,
    DailyAnalyticsSerializer, ProductPerformanceSerializer
)


class AnalyticsEventViewSet(viewsets.ModelViewSet):
    """
    API endpoint for analytics events.
    """
    serializer_class = AnalyticsEventSerializer
    
    def get_queryset(self):
        """
        Filter analytics events based on user permissions.
        """
        user = self.request.user
        
        # Store owners can see all analytics events in their store
        if user.is_authenticated and user.is_store_owner:
            return AnalyticsEvent.objects.filter(store__owner=user)
        
        # Store managers can see all analytics events in their store
        if user.is_authenticated and user.is_store_manager:
            return AnalyticsEvent.objects.filter(store__managers=user)
        
        return AnalyticsEvent.objects.none()
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action == 'create':
            return AnalyticsEventCreateSerializer
        return self.serializer_class
    
    def get_permissions(self):
        """
        Return appropriate permissions based on action.
        """
        if self.action == 'create':
            return []  # No permissions required for creating events
        return [IsAuthenticated(), IsStoreOwnerOrManager()]


class DailyAnalyticsViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for daily analytics.
    """
    serializer_class = DailyAnalyticsSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter daily analytics based on user permissions.
        """
        user = self.request.user
        
        # Store owners can see all daily analytics in their store
        if user.is_store_owner:
            return DailyAnalytics.objects.filter(store__owner=user)
        
        # Store managers can see all daily analytics in their store
        if user.is_store_manager:
            return DailyAnalytics.objects.filter(store__managers=user)
        
        return DailyAnalytics.objects.none()
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """
        Get dashboard analytics data.
        """
        # Get query parameters
        days = int(request.query_params.get('days', 30))
        store_id = request.query_params.get('store_id')
        
        # Validate parameters
        if days <= 0 or days > 365:
            return Response({'detail': _('Days must be between 1 and 365.')}, status=status.HTTP_400_BAD_REQUEST)
        
        if not store_id:
            return Response({'detail': _('Store ID is required.')}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate date range
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        # Get analytics data
        queryset = self.get_queryset().filter(
            store_id=store_id,
            date__gte=start_date,
            date__lte=end_date
        )
        
        # Calculate totals
        totals = {
            'page_views': queryset.aggregate(Sum('page_views'))['page_views__sum'] or 0,
            'unique_visitors': queryset.aggregate(Sum('unique_visitors'))['unique_visitors__sum'] or 0,
            'orders_count': queryset.aggregate(Sum('orders_count'))['orders_count__sum'] or 0,
            'revenue': queryset.aggregate(Sum('revenue'))['revenue__sum'] or 0,
            'new_users': queryset.aggregate(Sum('new_users'))['new_users__sum'] or 0,
        }
        
        # Get daily data
        daily_data = DailyAnalyticsSerializer(queryset, many=True).data
        
        # Get device distribution
        device_distribution = {
            'desktop': queryset.aggregate(Sum('desktop_users'))['desktop_users__sum'] or 0,
            'tablet': queryset.aggregate(Sum('tablet_users'))['tablet_users__sum'] or 0,
            'mobile': queryset.aggregate(Sum('mobile_users'))['mobile_users__sum'] or 0,
        }
        
        return Response({
            'totals': totals,
            'daily_data': daily_data,
            'device_distribution': device_distribution,
        })


class ProductPerformanceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for product performance.
    """
    serializer_class = ProductPerformanceSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter product performance based on user permissions.
        """
        user = self.request.user
        
        # Store owners can see all product performance in their store
        if user.is_store_owner:
            return ProductPerformance.objects.filter(store__owner=user)
        
        # Store managers can see all product performance in their store
        if user.is_store_manager:
            return ProductPerformance.objects.filter(store__managers=user)
        
        return ProductPerformance.objects.none()
    
    @action(detail=False, methods=['get'])
    def top_products(self, request):
        """
        Get top performing products.
        """
        # Get query parameters
        days = int(request.query_params.get('days', 30))
        store_id = request.query_params.get('store_id')
        metric = request.query_params.get('metric', 'revenue')
        limit = int(request.query_params.get('limit', 10))
        
        # Validate parameters
        if days <= 0 or days > 365:
            return Response({'detail': _('Days must be between 1 and 365.')}, status=status.HTTP_400_BAD_REQUEST)
        
        if not store_id:
            return Response({'detail': _('Store ID is required.')}, status=status.HTTP_400_BAD_REQUEST)
        
        if metric not in ['revenue', 'views', 'purchase_count', 'add_to_cart_count']:
            return Response({'detail': _('Invalid metric.')}, status=status.HTTP_400_BAD_REQUEST)
        
        if limit <= 0 or limit > 100:
            return Response({'detail': _('Limit must be between 1 and 100.')}, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate date range
        end_date = timezone.now().date()
        start_date = end_date - timedelta(days=days)
        
        # Get product performance data
        queryset = self.get_queryset().filter(
            store_id=store_id,
            date__gte=start_date,
            date__lte=end_date
        )
        
        # Group by product and order by metric
        products = queryset.values('product').annotate(
            total_revenue=Sum('revenue'),
            total_views=Sum('views'),
            total_purchases=Sum('purchase_count'),
            total_add_to_cart=Sum('add_to_cart_count')
        ).order_by(f'-total_{metric}' if metric == 'revenue' else f'-total_{metric}s')[:limit]
        
        # Get product details
        from products.models import Product
        
        result = []
        for product_data in products:
            product_id = product_data['product']
            try:
                product = Product.objects.get(id=product_id)
                result.append({
                    'product_id': product_id,
                    'product_name': product.name_en,
                    'revenue': product_data['total_revenue'],
                    'views': product_data['total_views'],
                    'purchases': product_data['total_purchases'],
                    'add_to_cart': product_data['total_add_to_cart'],
                    'conversion_rate': (product_data['total_purchases'] / product_data['total_views'] * 100) if product_data['total_views'] > 0 else 0
                })
            except Product.DoesNotExist:
                pass
        
        return Response(result)
