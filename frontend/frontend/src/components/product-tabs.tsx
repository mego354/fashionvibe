import React from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ProductCard from './product-card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  salePrice?: number | null;
  image: string;
  category: string;
  isNew?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  storeId: number;
  storeName: string;
  sku: string;
}

interface ProductTabsProps {
  featuredProducts: Product[];
  newArrivals: Product[];
  onSaleProducts: Product[];
}

const ProductTabs: React.FC<ProductTabsProps> = ({
  featuredProducts,
  newArrivals,
  onSaleProducts,
}) => {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="featured" className="w-full">
      <div className="flex justify-between items-center mb-6">
        <TabsList>
          <TabsTrigger value="featured">{t('storefront.featuredProducts')}</TabsTrigger>
          <TabsTrigger value="new">{t('storefront.newArrivals')}</TabsTrigger>
          <TabsTrigger value="sale">{t('storefront.onSale')}</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="featured" className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              image={product.image}
              category={product.category}
              isNew={product.isNew}
              isFeatured={true}
              isOnSale={product.isOnSale}
              storeId={product.storeId}
              storeName={product.storeName}
              sku={product.sku}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link to="/categories/featured">
              {t('common.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="new" className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              image={product.image}
              category={product.category}
              isNew={true}
              isFeatured={product.isFeatured}
              isOnSale={product.isOnSale}
              storeId={product.storeId}
              storeName={product.storeName}
              sku={product.sku}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link to="/new-arrivals">
              {t('common.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TabsContent>
      
      <TabsContent value="sale" className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {onSaleProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              salePrice={product.salePrice}
              image={product.image}
              category={product.category}
              isNew={product.isNew}
              isFeatured={product.isFeatured}
              isOnSale={true}
              storeId={product.storeId}
              storeName={product.storeName}
              sku={product.sku}
            />
          ))}
        </div>
        <div className="flex justify-center">
          <Button asChild variant="outline">
            <Link to="/sale">
              {t('common.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default ProductTabs;
