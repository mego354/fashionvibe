"""
Elasticsearch integration for the Fashion Hub project.
"""

from django.conf import settings
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import NotFoundError
import logging

logger = logging.getLogger(__name__)


class ElasticsearchClient:
    """
    Elasticsearch client for product search and indexing.
    """
    
    def __init__(self):
        """
        Initialize the Elasticsearch client.
        """
        self.es = Elasticsearch(
            hosts=[settings.ELASTICSEARCH_HOST],
            http_auth=(settings.ELASTICSEARCH_USERNAME, settings.ELASTICSEARCH_PASSWORD),
            use_ssl=settings.ELASTICSEARCH_USE_SSL,
            verify_certs=settings.ELASTICSEARCH_VERIFY_CERTS,
            timeout=30
        )
        self.index_name = settings.ELASTICSEARCH_INDEX
    
    def create_index(self):
        """
        Create the product index if it doesn't exist.
        """
        if not self.es.indices.exists(index=self.index_name):
            # Define index mapping
            mapping = {
                "mappings": {
                    "properties": {
                        "id": {"type": "integer"},
                        "name_en": {"type": "text", "analyzer": "english"},
                        "name_ar": {"type": "text", "analyzer": "arabic"},
                        "description_en": {"type": "text", "analyzer": "english"},
                        "description_ar": {"type": "text", "analyzer": "arabic"},
                        "price": {"type": "float"},
                        "sale_price": {"type": "float"},
                        "is_on_sale": {"type": "boolean"},
                        "is_active": {"type": "boolean"},
                        "is_featured": {"type": "boolean"},
                        "is_new": {"type": "boolean"},
                        "category_id": {"type": "integer"},
                        "category_name_en": {"type": "text", "analyzer": "english"},
                        "category_name_ar": {"type": "text", "analyzer": "arabic"},
                        "store_id": {"type": "integer"},
                        "store_name_en": {"type": "text", "analyzer": "english"},
                        "store_name_ar": {"type": "text", "analyzer": "arabic"},
                        "search_tags": {"type": "text", "analyzer": "standard"},
                        "created_at": {"type": "date"},
                        "updated_at": {"type": "date"}
                    }
                },
                "settings": {
                    "analysis": {
                        "analyzer": {
                            "arabic": {
                                "type": "custom",
                                "tokenizer": "standard",
                                "filter": ["lowercase", "arabic_normalization", "arabic_stemmer"]
                            }
                        },
                        "filter": {
                            "arabic_stemmer": {
                                "type": "stemmer",
                                "language": "arabic"
                            }
                        }
                    }
                }
            }
            
            # Create the index
            self.es.indices.create(index=self.index_name, body=mapping)
            logger.info(f"Created Elasticsearch index: {self.index_name}")
    
    def index_product(self, product):
        """
        Index a product in Elasticsearch.
        """
        # Prepare product data for indexing
        product_data = {
            "id": product.id,
            "name_en": product.name_en,
            "name_ar": product.name_ar,
            "description_en": product.description_en,
            "description_ar": product.description_ar,
            "price": float(product.price),
            "sale_price": float(product.sale_price) if product.sale_price else None,
            "is_on_sale": product.is_on_sale,
            "is_active": product.is_active,
            "is_featured": product.is_featured,
            "is_new": product.is_new,
            "category_id": product.category.id if product.category else None,
            "category_name_en": product.category.name_en if product.category else None,
            "category_name_ar": product.category.name_ar if product.category else None,
            "store_id": product.store.id,
            "store_name_en": product.store.name_en,
            "store_name_ar": product.store.name_ar,
            "search_tags": product.search_tags,
            "created_at": product.created_at.isoformat(),
            "updated_at": product.updated_at.isoformat()
        }
        
        # Index the product
        self.es.index(index=self.index_name, id=product.id, body=product_data)
        logger.info(f"Indexed product {product.id} in Elasticsearch")
    
    def update_product(self, product):
        """
        Update a product in Elasticsearch.
        """
        # Check if product exists
        try:
            self.es.get(index=self.index_name, id=product.id)
            # Product exists, update it
            self.index_product(product)
        except NotFoundError:
            # Product doesn't exist, index it
            self.index_product(product)
    
    def delete_product(self, product_id):
        """
        Delete a product from Elasticsearch.
        """
        try:
            self.es.delete(index=self.index_name, id=product_id)
            logger.info(f"Deleted product {product_id} from Elasticsearch")
        except NotFoundError:
            logger.warning(f"Product {product_id} not found in Elasticsearch")
    
    def search_products(self, query, store_id=None, category_id=None, filters=None, sort=None, page=1, size=20):
        """
        Search for products in Elasticsearch.
        """
        # Build search query
        search_query = {
            "bool": {
                "must": [
                    {
                        "bool": {
                            "should": [
                                {"match": {"name_en": {"query": query, "boost": 3}}},
                                {"match": {"name_ar": {"query": query, "boost": 3}}},
                                {"match": {"description_en": {"query": query, "boost": 1}}},
                                {"match": {"description_ar": {"query": query, "boost": 1}}},
                                {"match": {"search_tags": {"query": query, "boost": 2}}}
                            ]
                        }
                    },
                    {"term": {"is_active": True}}
                ],
                "filter": []
            }
        }
        
        # Add store filter
        if store_id:
            search_query["bool"]["filter"].append({"term": {"store_id": store_id}})
        
        # Add category filter
        if category_id:
            search_query["bool"]["filter"].append({"term": {"category_id": category_id}})
        
        # Add additional filters
        if filters:
            if "is_featured" in filters:
                search_query["bool"]["filter"].append({"term": {"is_featured": filters["is_featured"]}})
            if "is_new" in filters:
                search_query["bool"]["filter"].append({"term": {"is_new": filters["is_new"]}})
            if "is_on_sale" in filters:
                search_query["bool"]["filter"].append({"term": {"is_on_sale": filters["is_on_sale"]}})
            if "price_min" in filters:
                search_query["bool"]["filter"].append({"range": {"price": {"gte": filters["price_min"]}}})
            if "price_max" in filters:
                search_query["bool"]["filter"].append({"range": {"price": {"lte": filters["price_max"]}}})
        
        # Build sort options
        sort_options = []
        if sort:
            if sort == "price_asc":
                sort_options.append({"price": {"order": "asc"}})
            elif sort == "price_desc":
                sort_options.append({"price": {"order": "desc"}})
            elif sort == "newest":
                sort_options.append({"created_at": {"order": "desc"}})
            elif sort == "oldest":
                sort_options.append({"created_at": {"order": "asc"}})
            elif sort == "name_asc":
                sort_options.append({"name_en.keyword": {"order": "asc"}})
            elif sort == "name_desc":
                sort_options.append({"name_en.keyword": {"order": "desc"}})
        else:
            # Default sort by relevance
            sort_options.append("_score")
        
        # Calculate pagination
        from_value = (page - 1) * size
        
        # Execute search
        search_body = {
            "query": search_query,
            "sort": sort_options,
            "from": from_value,
            "size": size
        }
        
        result = self.es.search(index=self.index_name, body=search_body)
        
        # Process results
        hits = result["hits"]["hits"]
        total = result["hits"]["total"]["value"]
        
        products = []
        for hit in hits:
            product_data = hit["_source"]
            product_data["score"] = hit["_score"]
            products.append(product_data)
        
        return {
            "products": products,
            "total": total,
            "page": page,
            "size": size,
            "pages": (total + size - 1) // size
        }
    
    def reindex_all_products(self):
        """
        Reindex all products in Elasticsearch.
        """
        from products.models import Product
        
        # Delete the index if it exists
        if self.es.indices.exists(index=self.index_name):
            self.es.indices.delete(index=self.index_name)
            logger.info(f"Deleted Elasticsearch index: {self.index_name}")
        
        # Create the index
        self.create_index()
        
        # Get all active products
        products = Product.objects.filter(is_active=True)
        
        # Index each product
        for product in products:
            self.index_product(product)
        
        logger.info(f"Reindexed {products.count()} products in Elasticsearch")
