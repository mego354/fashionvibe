import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Link, useParams } from 'react-router-dom';
import { 
  fetchProductDetails, 
  addToWishlist, 
  removeFromWishlist,
  selectProductDetails,
  selectProductLoading,
  selectIsInWishlist
} from '../store/productSlice';
import { addToCart } from '../store/cartSlice';
import Header from '../components/header';
import Footer from '../components/footer';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Separator } from '../components/ui/separator';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { 
  Heart, 
  Share, 
  ShoppingCart, 
  Truck, 
  RefreshCw, 
  Shield, 
  Star, 
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import ProductCard from '../components/product-card';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Label } from '../components/ui/label';

// Mock data for product details
const mockProductDetails = {
  id: 1,
  name: 'Summer Floral Dress',
  description: 'A beautiful summer dress with floral pattern, perfect for warm days. Made from lightweight cotton fabric that\'s breathable and comfortable to wear all day long.',
  price: 1200,
  sale_price: null,
  images: [
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
  ],
  category: {
    id: 1,
    name: 'Women\'s Dresses',
    slug: 'womens-dresses'
  },
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: [
    { name: 'Blue', code: '#1e40af' },
    { name: 'Pink', code: '#be185d' },
    { name: 'Green', code: '#15803d' }
  ],
  in_stock: true,
  sku: 'WD-1001',
  brand: 'Fashion Elite',
  rating: 4.5,
  review_count: 24,
  is_new: false,
  is_featured: true,
  is_on_sale: false,
  store: {
    id: 1,
    name: 'Fashion Elite',
    logo: 'https://placehold.co/200x100',
    rating: 4.8
  },
  specifications: [
    { name: 'Material', value: '100% Cotton' },
    { name: 'Pattern', value: 'Floral' },
    { name: 'Fit', value: 'Regular' },
    { name: 'Care', value: 'Machine wash cold' }
  ],
  related_products: [
    {
      id: 2,
      name: 'Casual Linen Shirt',
      price: 850,
      salePrice: null,
      image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
      category: 'Men',
      isNew: true,
      isFeatured: true,
      isOnSale: false,
      storeId: 2,
      storeName: 'Cairo Threads',
      sku: 'MS-2002'
    },
    {
      id: 3,
      name: 'Classic Denim Jeans',
      price: 950,
      salePrice: null,
      image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      category: 'Men',
      isNew: false,
      isFeatured: true,
      isOnSale: false,
      storeId: 1,
      storeName: 'Fashion Elite',
      sku: 'MJ-3003'
    },
    {
      id: 4,
      name: 'Leather Crossbody Bag',
      price: 1500,
      salePrice: 1200,
      image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      category: 'Accessories',
      isNew: false,
      isFeatured: true,
      isOnSale: true,
      storeId: 3,
      storeName: 'Luxe Leather',
      sku: 'AB-4004'
    },
    {
      id: 5,
      name: 'Summer Sandals',
      price: 750,
      salePrice: null,
      image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
      category: 'Footwear',
      isNew: true,
      isFeatured: true,
      isOnSale: false,
      storeId: 2,
      storeName: 'Cairo Threads',
      sku: 'FS-5005'
    }
  ]
};

const ProductDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const productId = parseInt(id || '0');
  
  // In a real implementation, these would come from Redux
  const product = mockProductDetails;
  const isLoading = false;
  const isInWishlist = false;
  
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [selectedSize, setSelectedSize] = React.useState('');
  const [selectedColor, setSelectedColor] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  
  React.useEffect(() => {
    // In a real implementation, this would fetch product details
    // dispatch(fetchProductDetails(productId));
  }, [dispatch, productId]);
  
  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      alert(t('product.selectSize'));
      return;
    }
    
    if (!selectedColor && product.colors.length > 0) {
      alert(t('product.selectColor'));
      return;
    }
    
    dispatch(addToCart({
      id: Math.random(), // This would be replaced with a proper cart item ID from the backend
      product_id: product.id,
      name: product.name,
      price: product.price,
      sale_price: product.sale_price,
      quantity,
      image: product.images[0],
      size: selectedSize,
      color: selectedColor,
      sku: product.sku,
      store_id: product.store.id,
      store_name: product.store.name
    }));
  };
  
  const handleToggleWishlist = () => {
    if (isInWishlist) {
      // dispatch(removeFromWishlist(product.id));
    } else {
      // dispatch(addToWishlist(product.id));
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert(t('product.linkCopied'));
    }
  };
  
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-96 w-full rounded-lg" />
              <div className="flex mt-4 space-x-2">
                <Skeleton className="h-20 w-20 rounded-md" />
                <Skeleton className="h-20 w-20 rounded-md" />
                <Skeleton className="h-20 w-20 rounded-md" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="container py-8">
          {/* Breadcrumbs */}
          <nav className="flex mb-6 text-sm">
            <ol className="flex items-center space-x-1">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground">
                  {t('common.home')}
                </Link>
              </li>
              <li className="flex items-center space-x-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <Link to={`/categories/${product.category.slug}`} className="text-muted-foreground hover:text-foreground">
                  {product.category.name}
                </Link>
              </li>
              <li className="flex items-center space-x-1">
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{product.name}</span>
              </li>
            </ol>
          </nav>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
                {product.is_new && (
                  <Badge variant="secondary" className="absolute top-2 left-2 bg-blue-500 text-white hover:bg-blue-600">
                    {t('storefront.new')}
                  </Badge>
                )}
                {product.is_on_sale && (
                  <Badge variant="secondary" className="absolute top-2 left-2 bg-red-500 text-white hover:bg-red-600">
                    {t('storefront.sale')}
                  </Badge>
                )}
              </div>
              <div className="mt-4 flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative h-20 w-20 cursor-pointer rounded-md bg-muted ${
                      selectedImage === index ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="h-full w-full object-cover rounded-md"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              
              <div className="mt-2 flex items-center space-x-2">
                <div className="flex">
                  {renderRatingStars(product.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.review_count} {t('product.reviews')})
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-muted-foreground">
                  {t('product.sku')}: {product.sku}
                </span>
              </div>
              
              <div className="mt-4">
                {product.sale_price ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-primary">{product.sale_price.toLocaleString()} EGP</span>
                    <span className="text-lg line-through text-muted-foreground">{product.price.toLocaleString()} EGP</span>
                    <Badge variant="secondary" className="bg-red-500 text-white hover:bg-red-600">
                      {Math.round(((product.price - product.sale_price) / product.price) * 100)}% {t('product.off')}
                    </Badge>
                  </div>
                ) : (
                  <span className="text-2xl font-bold">{product.price.toLocaleString()} EGP</span>
                )}
              </div>
              
              <p className="mt-4 text-muted-foreground">{product.description}</p>
              
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{t('product.soldBy')}</span>
                  <Link to={`/stores/${product.store.id}`} className="text-primary hover:underline flex items-center">
                    {product.store.name}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
              
              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">{t('product.selectSize')}</h3>
                  <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <div key={size}>
                        <RadioGroupItem
                          value={size}
                          id={`size-${size}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`size-${size}`}
                          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border ${
                            selectedSize === size
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          {size}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              
              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">{t('product.selectColor')}</h3>
                  <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <div key={color.name}>
                        <RadioGroupItem
                          value={color.name}
                          id={`color-${color.name}`}
                          className="sr-only"
                        />
                        <Label
                          htmlFor={`color-${color.name}`}
                          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 ${
                            selectedColor === color.name ? 'ring-2 ring-primary ring-offset-2' : ''
                          }`}
                          style={{ backgroundColor: color.code, borderColor: selectedColor === color.name ? color.code : 'transparent' }}
                        >
                          <span className="sr-only">{color.name}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
              
              {/* Quantity */}
              <div className="mt-6">
                <h3 className="font-medium mb-2">{t('product.quantity')}</h3>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {/* Stock Status */}
              <div className="mt-6">
                {product.in_stock ? (
                  <Badge variant="secondary" className="bg-green-500 text-white hover:bg-green-600">
                    {t('product.inStock')}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-red-500 text-white hover:bg-red-600">
                    {t('product.outOfStock')}
                  </Badge>
                )}
              </div>
              
              {/* Actions */}
              <div className="mt-6 flex flex-col space-y-2">
                <Button 
                  size="lg" 
                  onClick={handleAddToCart}
                  disabled={!product.in_stock}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {t('product.addToCart')}
                </Button>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={handleToggleWishlist}>
                    <Heart className={`mr-2 h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
                    {isInWishlist ? t('product.removeFromWishlist') : t('product.addToWishlist')}
                  </Button>
                  
                  <Button variant="outline" onClick={handleShare}>
                    <Share className="mr-2 h-5 w-5" />
                    {t('product.share')}
                  </Button>
                </div>
              </div>
              
              {/* Shipping & Returns */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center text-sm">
                  <Truck className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{t('product.freeShipping')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <RefreshCw className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{t('product.easyReturns')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{t('product.secureCheckout')}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="mt-12">
            <Tabs defaultValue="description">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="description">{t('product.description')}</TabsTrigger>
                <TabsTrigger value="specifications">{t('product.specifications')}</TabsTrigger>
                <TabsTrigger value="reviews">{t('product.reviews')}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p>{product.description}</p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, 
                    nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, 
                    nisl nisl aliquam nisl, eget aliquam nisl nisl eget nisl.
                  </p>
                  <ul>
                    <li>High-quality fabric for comfort and durability</li>
                    <li>Stylish design suitable for various occasions</li>
                    <li>Easy to care for and maintain</li>
                    <li>Available in multiple sizes and colors</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="specifications" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{spec.name}</span>
                      <span className="text-muted-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">{t('product.customerReviews')}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex mr-2">
                          {renderRatingStars(product.rating)}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {product.rating} out of 5 ({product.review_count} {t('product.reviews')})
                        </span>
                      </div>
                    </div>
                    <Button>{t('product.writeReview')}</Button>
                  </div>
                  
                  <div className="space-y-4">
                    {/* This would be populated with actual reviews */}
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Ahmed Hassan</h4>
                            <div className="flex mt-1">
                              {renderRatingStars(5)}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">May 15, 2025</span>
                        </div>
                        <p className="mt-4">
                          Great product! The quality is excellent and it fits perfectly. I would definitely recommend it.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-medium">Fatima Ali</h4>
                            <div className="flex mt-1">
                              {renderRatingStars(4)}
                            </div>
                          </div>
                          <span className="text-sm text-muted-foreground">April 28, 2025</span>
                        </div>
                        <p className="mt-4">
                          I like the product overall, but the color is slightly different from what I expected. Still, the quality is good.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Related Products */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">{t('product.relatedProducts')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {product.related_products.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.name}
                  price={relatedProduct.price}
                  salePrice={relatedProduct.salePrice}
                  image={relatedProduct.image}
                  category={relatedProduct.category}
                  isNew={relatedProduct.isNew}
                  isFeatured={relatedProduct.isFeatured}
                  isOnSale={relatedProduct.isOnSale}
                  storeId={relatedProduct.storeId}
                  storeName={relatedProduct.storeName}
                  sku={relatedProduct.sku}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
