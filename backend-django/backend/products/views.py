"""
Product views for the Fashion Hub project.
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.translation import gettext_lazy as _

from common.permissions import IsStoreOwnerOrManager, IsStoreStaff
from .models import Category, Product, ProductImage, Variant, ProductReview
from .serializers import (
    CategorySerializer, ProductSerializer, ProductImageSerializer,
    VariantSerializer, ProductReviewSerializer, ProductCreateUpdateSerializer
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for product categories.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'parent']
    search_fields = ['name_en', 'name_ar', 'description_en', 'description_ar']
    ordering_fields = ['name_en', 'order', 'created_at']
    
    def get_permissions(self):
        """
        Return appropriate permissions based on action.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsStoreOwnerOrManager()]
        return super().get_permissions()
    
    @action(detail=False, methods=['get'])
    def root(self, request):
        """
        Get only root categories (no parent).
        """
        categories = Category.objects.filter(parent=None)
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for products.
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'is_featured', 'is_new', 'is_on_sale']
    search_fields = ['name_en', 'name_ar', 'description_en', 'description_ar', 'sku', 'search_tags']
    ordering_fields = ['name_en', 'price', 'created_at']
    
    def get_serializer_class(self):
        """
        Return appropriate serializer class based on action.
        """
        if self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return self.serializer_class
    
    def get_permissions(self):
        """
        Return appropriate permissions based on action.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsStoreOwnerOrManager()]
        return super().get_permissions()
    
    @action(detail=True, methods=['get'])
    def variants(self, request, pk=None):
        """
        Get variants for a specific product.
        """
        product = self.get_object()
        variants = product.variants.all()
        serializer = VariantSerializer(variants, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def reviews(self, request, pk=None):
        """
        Get reviews for a specific product.
        """
        product = self.get_object()
        reviews = product.reviews.filter(is_approved=True)
        serializer = ProductReviewSerializer(reviews, many=True)
        return Response(serializer.data)


class ProductImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for product images.
    """
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter images based on product.
        """
        product_id = self.kwargs.get('product_pk')
        if product_id:
            return ProductImage.objects.filter(product_id=product_id)
        return ProductImage.objects.none()
    
    def perform_create(self, serializer):
        """
        Create a new image for the specified product.
        """
        product_id = self.kwargs.get('product_pk')
        product = Product.objects.get(id=product_id)
        serializer.save(product=product)
    
    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None, product_pk=None):
        """
        Set an image as the primary image.
        """
        image = self.get_object()
        
        # Set all other images of this product to non-primary
        ProductImage.objects.filter(product_id=product_pk, is_primary=True).update(is_primary=False)
        
        # Set this image as primary
        image.is_primary = True
        image.save()
        
        return Response({'detail': _('Image set as primary.')}, status=status.HTTP_200_OK)


class VariantViewSet(viewsets.ModelViewSet):
    """
    API endpoint for product variants.
    """
    serializer_class = VariantSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager]
    
    def get_queryset(self):
        """
        Filter variants based on product.
        """
        product_id = self.kwargs.get('product_pk')
        if product_id:
            return Variant.objects.filter(product_id=product_id)
        return Variant.objects.none()
    
    def perform_create(self, serializer):
        """
        Create a new variant for the specified product.
        """
        product_id = self.kwargs.get('product_pk')
        product = Product.objects.get(id=product_id)
        serializer.save(product=product)


class ProductReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint for product reviews.
    """
    serializer_class = ProductReviewSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """
        Filter reviews based on product and approval status.
        """
        product_id = self.kwargs.get('product_pk')
        if product_id:
            # Regular users can only see approved reviews
            if self.request.user.is_authenticated and (self.request.user.is_store_owner or self.request.user.is_store_manager):
                return ProductReview.objects.filter(product_id=product_id)
            return ProductReview.objects.filter(product_id=product_id, is_approved=True)
        return ProductReview.objects.none()
    
    def perform_create(self, serializer):
        """
        Create a new review for the specified product.
        """
        product_id = self.kwargs.get('product_pk')
        product = Product.objects.get(id=product_id)
        serializer.save(product=product, user=self.request.user)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsStoreStaff])
    def approve(self, request, pk=None, product_pk=None):
        """
        Approve a review.
        """
        review = self.get_object()
        review.is_approved = True
        review.save()
        
        return Response({'detail': _('Review approved.')}, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated, IsStoreStaff])
    def reject(self, request, pk=None, product_pk=None):
        """
        Reject a review.
        """
        review = self.get_object()
        review.is_approved = False
        review.save()
        
        return Response({'detail': _('Review rejected.')}, status=status.HTTP_200_OK)
