from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Product, Category, Store
from .serializers import ProductSerializer
from rest_framework_simplejwt.tokens import RefreshToken
import pytest

User = get_user_model()

class ProductBulkOperationTests(APITestCase):
    def setUp(self):
        self.owner = User.objects.create_user(email='owner@example.com', password='pass', is_store_owner=True)
        self.category = Category.objects.create(name_en='Shirts', name_ar='قمصان', slug='shirts')
        self.client = APIClient()
        refresh = RefreshToken.for_user(self.owner)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

    def test_bulk_create_products(self):
        url = reverse('product-bulk-create')
        data = [
            {"category": self.category.id, "name_en": "P1", "name_ar": "P1", "description_en": "Desc1", "description_ar": "Desc1", "sku": "SKU1", "price": 100},
            {"category": self.category.id, "name_en": "P2", "name_ar": "P2", "description_en": "Desc2", "description_ar": "Desc2", "sku": "SKU2", "price": 200}
        ]
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Product.objects.count(), 2)

    def test_bulk_update_products(self):
        p1 = Product.objects.create(category=self.category, name_en="P1", name_ar="P1", description_en="D1", description_ar="D1", sku="SKU1", price=100)
        p2 = Product.objects.create(category=self.category, name_en="P2", name_ar="P2", description_en="D2", description_ar="D2", sku="SKU2", price=200)
        url = reverse('product-bulk-update')
        data = [
            {"id": p1.id, "price": 150},
            {"id": p2.id, "price": 250}
        ]
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        p1.refresh_from_db()
        p2.refresh_from_db()
        self.assertEqual(p1.price, 150)
        self.assertEqual(p2.price, 250)

    def test_bulk_delete_products(self):
        p1 = Product.objects.create(category=self.category, name_en="P1", name_ar="P1", description_en="D1", description_ar="D1", sku="SKU1", price=100)
        p2 = Product.objects.create(category=self.category, name_en="P2", name_ar="P2", description_en="D2", description_ar="D2", sku="SKU2", price=200)
        url = reverse('product-bulk-delete')
        data = {"ids": [p1.id, p2.id]}
        response = self.client.delete(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Product.objects.count(), 0)

    def test_filter_products_by_category(self):
        c2 = Category.objects.create(name_en='Pants', name_ar='بنطلونات', slug='pants')
        Product.objects.create(category=self.category, name_en="P1", name_ar="P1", description_en="D1", description_ar="D1", sku="SKU1", price=100)
        Product.objects.create(category=c2, name_en="P2", name_ar="P2", description_en="D2", description_ar="D2", sku="SKU2", price=200)
        url = reverse('product-list')
        response = self.client.get(url, {'category': self.category.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_filter_products_by_price(self):
        Product.objects.create(category=self.category, name_en="P1", name_ar="P1", description_en="D1", description_ar="D1", sku="SKU1", price=100)
        Product.objects.create(category=self.category, name_en="P2", name_ar="P2", description_en="D2", description_ar="D2", sku="SKU2", price=200)
        url = reverse('product-list')
        response = self.client.get(url, {'price__gte': 150})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_filter_products_by_availability(self):
        Product.objects.create(category=self.category, name_en="P1", name_ar="P1", description_en="D1", description_ar="D1", sku="SKU1", price=100, is_active=True)
        Product.objects.create(category=self.category, name_en="P2", name_ar="P2", description_en="D2", description_ar="D2", sku="SKU2", price=200, is_active=False)
        url = reverse('product-list')
        response = self.client.get(url, {'is_active': True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_pagination_and_ordering(self):
        for i in range(10):
            Product.objects.create(category=self.category, name_en=f"P{i}", name_ar=f"P{i}", description_en="D", description_ar="D", sku=f"SKU{i}", price=100+i)
        url = reverse('product-list')
        response = self.client.get(url, {'page': 1, 'page_size': 5, 'ordering': '-price'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 5)
        self.assertTrue(response.data['results'][0]['price'] > response.data['results'][1]['price'])

    def test_search_products(self):
        Product.objects.create(category=self.category, name_en="Red Shirt", name_ar="قميص أحمر", description_en="Red", description_ar="أحمر", sku="SKU1", price=100)
        Product.objects.create(category=self.category, name_en="Blue Shirt", name_ar="قميص أزرق", description_en="Blue", description_ar="أزرق", sku="SKU2", price=200)
        url = reverse('product-list')
        response = self.client.get(url, {'search': 'Red'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

@pytest.mark.django_db
class TestProductPermissions:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.owner = User.objects.create_user(email='owner@example.com', password='pass', is_store_owner=True)
        self.admin = User.objects.create_user(email='admin@example.com', password='pass', role='admin', is_superuser=True)
        self.other = User.objects.create_user(email='other@example.com', password='pass')
        self.category = Category.objects.create(name_en='Shirts', name_ar='قمصان', slug='shirts')
        self.product = Product.objects.create(category=self.category, name_en="P1", name_ar="P1", description_en="D1", description_ar="D1", sku="SKU1", price=100)
        self.product.owner = self.owner
        self.product.save()
        self.client = APIClient()

    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_owner_can_update(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.owner)}')
        url = reverse('product-detail', args=[self.product.id])
        response = self.client.patch(url, {'price': 200}, format='json')
        assert response.status_code in (200, 202)

    def test_admin_can_update(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.admin)}')
        url = reverse('product-detail', args=[self.product.id])
        response = self.client.patch(url, {'price': 300}, format='json')
        assert response.status_code in (200, 202)

    def test_other_cannot_update(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.other)}')
        url = reverse('product-detail', args=[self.product.id])
        response = self.client.patch(url, {'price': 400}, format='json')
        assert response.status_code == 403

    def test_unauthenticated_cannot_update(self):
        self.client.credentials()
        url = reverse('product-detail', args=[self.product.id])
        response = self.client.patch(url, {'price': 500}, format='json')
        assert response.status_code == 401

    def test_anyone_can_read(self):
        url = reverse('product-detail', args=[self.product.id])
        response = self.client.get(url)
        assert response.status_code == 200 

@pytest.mark.django_db
class TestProductTenantIsolation:
    @pytest.fixture(autouse=True)
    def setup(self):
        self.store1 = Store.objects.create(name_en='Store1', schema_name='store1', slug='store1')
        self.store2 = Store.objects.create(name_en='Store2', schema_name='store2', slug='store2')
        self.owner1 = User.objects.create_user(email='owner1@example.com', password='pass', is_store_owner=True)
        self.owner1.store = self.store1
        self.owner1.save()
        self.owner2 = User.objects.create_user(email='owner2@example.com', password='pass', is_store_owner=True)
        self.owner2.store = self.store2
        self.owner2.save()
        self.category1 = Category.objects.create(name_en='Shirts', name_ar='قمصان', slug='shirts', store=self.store1)
        self.category2 = Category.objects.create(name_en='Pants', name_ar='بنطلونات', slug='pants', store=self.store2)
        self.product1 = Product.objects.create(category=self.category1, name_en="P1", name_ar="P1", description_en="D1", description_ar="D1", sku="SKU1", price=100, store=self.store1)
        self.product2 = Product.objects.create(category=self.category2, name_en="P2", name_ar="P2", description_en="D2", description_ar="D2", sku="SKU2", price=200, store=self.store2)
        self.client = APIClient()

    def get_token(self, user):
        refresh = RefreshToken.for_user(user)
        return str(refresh.access_token)

    def test_store1_owner_sees_only_store1_products(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.owner1)}')
        url = reverse('product-list')
        response = self.client.get(url)
        assert response.status_code == 200
        ids = [p['id'] for p in response.data['results']]
        assert self.product1.id in ids
        assert self.product2.id not in ids

    def test_store2_owner_cannot_modify_store1_product(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.owner2)}')
        url = reverse('product-detail', args=[self.product1.id])
        response = self.client.patch(url, {'price': 999}, format='json')
        assert response.status_code in (403, 404)

    def test_store1_owner_cannot_see_store2_category(self):
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.get_token(self.owner1)}')
        url = reverse('category-list')
        response = self.client.get(url)
        assert response.status_code == 200
        ids = [c['id'] for c in response.data['results']]
        assert self.category1.id in ids
        assert self.category2.id not in ids 