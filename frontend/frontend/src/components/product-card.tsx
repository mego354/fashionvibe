import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';

interface ProductCardProps {
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

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  salePrice,
  image,
  category,
  isNew = false,
  isFeatured = false,
  isOnSale = false,
  storeId,
  storeName,
  sku
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  const handleAddToCart = () => {
    // @ts-ignore
    dispatch(addToCart({
      id: Math.random(), // This would be replaced with a proper cart item ID from the backend
      product_id: id,
      name,
      price,
      sale_price: salePrice,
      quantity: 1,
      image,
      size: null,
      color: null,
      sku,
      store_id: storeId,
      store_name: storeName
    }));
  };

  return (
    <Card className="overflow-hidden group">
      <div className="relative">
        <Link to={`/products/${id}`}>
          <img 
            src={image} 
            alt={name} 
            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm">
            <Heart className="h-5 w-5" />
            <span className="sr-only">{t('storefront.addToWishlist')}</span>
          </Button>
        </div>
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {isNew && (
            <Badge variant="secondary" className="bg-blue-500 text-white hover:bg-blue-600">
              {t('storefront.new')}
            </Badge>
          )}
          {isFeatured && (
            <Badge variant="secondary" className="bg-purple-500 text-white hover:bg-purple-600">
              {t('storefront.featured')}
            </Badge>
          )}
          {isOnSale && (
            <Badge variant="secondary" className="bg-red-500 text-white hover:bg-red-600">
              {t('storefront.sale')}
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="p-4 pb-0">
        <CardDescription className="text-xs uppercase">{category}</CardDescription>
        <CardTitle className="text-base mt-1 line-clamp-1">
          <Link to={`/products/${id}`} className="hover:underline">
            {name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex items-center">
          {salePrice ? (
            <>
              <span className="text-lg font-bold text-primary">{salePrice.toLocaleString()} EGP</span>
              <span className="ml-2 text-sm line-through text-muted-foreground">{price.toLocaleString()} EGP</span>
            </>
          ) : (
            <span className="text-lg font-bold">{price.toLocaleString()} EGP</span>
          )}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">
          {t('storefront.soldBy')} <Link to={`/stores/${storeId}`} className="hover:underline">{storeName}</Link>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full" 
          onClick={handleAddToCart}
        >
          {t('storefront.addToCart')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
