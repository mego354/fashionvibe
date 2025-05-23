"""
Product views for the Fashion Hub project.
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.translation import gettext_lazy as _
from rest_framework.parsers import JSONParser

from common.permissions import IsStoreOwnerOrManager, IsStoreStaff, IsOwnerOrAdminOrReadOnly
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
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active', 'parent']
    search_fields = ['name_en', 'name_ar', 'description_en', 'description_ar']
    ordering_fields = ['name_en', 'order', 'created_at']
    
    def get_queryset(self):
        store = getattr(self.request, 'tenant', None) or getattr(self.request.user, 'store', None)
        qs = Category.objects.all()
        if store:
            qs = qs.filter(store=store)
        return qs
    
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
    Supports:
    - List (GET): Filtering, searching, ordering, pagination
    - Create (POST): Single or bulk (via /bulk-create/)
    - Retrieve (GET): Single product
    - Update (PUT/PATCH): Single or bulk (via /bulk-update/)
    - Destroy (DELETE): Single or bulk (via /bulk-delete/)
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_active', 'is_featured', 'is_new', 'is_on_sale']
    search_fields = ['name_en', 'name_ar', 'description_en', 'description_ar', 'sku', 'search_tags']
    ordering_fields = ['name_en', 'price', 'created_at']
    
    def get_queryset(self):
        store = getattr(self.request, 'tenant', None) or getattr(self.request.user, 'store', None)
        qs = Product.objects.all()
        if store:
            qs = qs.filter(store=store)
        return qs
    
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

    @action(detail=False, methods=['post'], url_path='bulk-create', parser_classes=[JSONParser])
    def bulk_create(self, request):
        """
        Bulk create products.
        """
        serializer = ProductCreateUpdateSerializer(data=request.data, many=True)
        serializer.is_valid(raise_exception=True)
        self.perform_bulk_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_bulk_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['put'], url_path='bulk-update', parser_classes=[JSONParser])
    def bulk_update(self, request):
        """
        Bulk update products. Expects a list of objects with 'id'.
        """
        items = request.data
        if not isinstance(items, list):
            return Response({'detail': 'Expected a list of objects.'}, status=status.HTTP_400_BAD_REQUEST)
        updated = []
        for item in items:
            try:
                instance = Product.objects.get(id=item['id'])
            except Product.DoesNotExist:
                continue
            serializer = ProductCreateUpdateSerializer(instance, data=item, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            updated.append(serializer.data)
        return Response(updated, status=status.HTTP_200_OK)

    @action(detail=False, methods=['delete'], url_path='bulk-delete', parser_classes=[JSONParser])
    def bulk_delete(self, request):
        """
        Bulk delete products. Expects a list of IDs.
        """
        ids = request.data.get('ids', [])
        if not isinstance(ids, list):
            return Response({'detail': 'Expected a list of IDs.'}, status=status.HTTP_400_BAD_REQUEST)
        products = Product.objects.filter(id__in=ids)
        count = products.count()
        products.delete()
        return Response({'deleted': count}, status=status.HTTP_200_OK)


class ProductImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint for product images.
    """
    serializer_class = ProductImageSerializer
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager, IsOwnerOrAdminOrReadOnly]
    
    def get_queryset(self):
        store = getattr(self.request, 'tenant', None) or getattr(self.request.user, 'store', None)
        product_id = self.kwargs.get('product_pk')
        qs = ProductImage.objects.all()
        if product_id:
            qs = qs.filter(product_id=product_id)
        if store:
            qs = qs.filter(product__store=store)
        return qs
    
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
    permission_classes = [IsAuthenticated, IsStoreOwnerOrManager, IsOwnerOrAdminOrReadOnly]
    
    def get_queryset(self):
        store = getattr(self.request, 'tenant', None) or getattr(self.request.user, 'store', None)
        product_id = self.kwargs.get('product_pk')
        qs = Variant.objects.all()
        if product_id:
            qs = qs.filter(product_id=product_id)
        if store:
            qs = qs.filter(store=store)
        return qs
    
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
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrAdminOrReadOnly]
    
    def get_queryset(self):
        store = getattr(self.request, 'tenant', None) or getattr(self.request.user, 'store', None)
        product_id = self.kwargs.get('product_pk')
        qs = ProductReview.objects.all()
        if product_id:
            qs = qs.filter(product_id=product_id)
        if store:
            qs = qs.filter(store=store)
        if product_id:
            if self.request.user.is_authenticated and (self.request.user.is_store_owner or self.request.user.is_store_manager):
                return qs
            return qs.filter(is_approved=True)
        return qs.none()
    
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
