import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  addToCart, 
  removeFromCart, 
  updateCartItemQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal
} from '../store/cartSlice';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Separator } from '../components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Trash, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // @ts-ignore
  const cartItems = useSelector(selectCartItems);
  // @ts-ignore
  const cartTotal = useSelector(selectCartTotal);
  const [couponCode, setCouponCode] = React.useState('');
  
  const handleRemoveItem = (itemId: any) => {
    // @ts-ignore
    dispatch(removeFromCart(itemId));
  };
  
  const handleUpdateQuantity = (itemId: any, quantity: any) => {
    if (quantity < 1) return;
    // @ts-ignore
    dispatch(updateCartItemQuantity({ id: itemId, quantity }));
  };
  
  const handleClearCart = () => {
    // @ts-ignore
    dispatch(clearCart());
  };
  
  const handleApplyCoupon = (e: any) => {
    e.preventDefault();
    // Implement coupon logic
    console.log('Apply coupon:', couponCode);
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="container py-12">
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('cart.emptyCart')}</h2>
          <p className="text-muted-foreground mb-6">{t('cart.emptyCartMessage')}</p>
          <Button asChild>
            <Link to="/categories">
              {t('cart.continueShopping')}
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">{t('cart.shoppingCart')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('cart.cartItems')}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('cart.product')}</TableHead>
                    <TableHead>{t('cart.price')}</TableHead>
                    <TableHead>{t('cart.quantity')}</TableHead>
                    <TableHead>{t('cart.total')}</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="h-16 w-16 object-cover rounded"
                          />
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.size && <div className="text-sm text-muted-foreground">{t('cart.size')}: {item.size}</div>}
                            {item.color && <div className="text-sm text-muted-foreground">{t('cart.color')}: {item.color}</div>}
                            <div className="text-sm text-muted-foreground">{t('cart.sku')}: {item.sku}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.sale_price ? (
                          <>
                            <div className="font-medium">{item.sale_price.toLocaleString()} EGP</div>
                            <div className="text-sm line-through text-muted-foreground">{item.price.toLocaleString()} EGP</div>
                          </>
                        ) : (
                          <div className="font-medium">{item.price.toLocaleString()} EGP</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <Input 
                            type="number" 
                            value={item.quantity} 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
                            className="h-8 w-16 text-center"
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {((item.sale_price || item.price) * item.quantity).toLocaleString()} EGP
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleRemoveItem(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleClearCart}>
                {t('cart.clearCart')}
              </Button>
              {/* @ts-ignore */}
              <Button asChild>
                <Link to="/categories">
                  {t('cart.continueShopping')}
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t('cart.orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                <span>{cartTotal.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.shipping')}</span>
                <span>{t('cart.calculatedAtCheckout')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.tax')}</span>
                <span>{t('cart.calculatedAtCheckout')}</span>
              </div>
              
              <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                <Input
                  placeholder={t('cart.couponCode')}
                  value={couponCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" variant="outline">
                  {t('cart.apply')}
                </Button>
              </form>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>{t('cart.total')}</span>
                <span>{cartTotal.toLocaleString()} EGP</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/checkout">
                  {t('cart.proceedToCheckout')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
