import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';
import Header from '../components/header';
import Footer from '../components/footer';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { 
  User, 
  Package, 
  Heart, 
  CreditCard, 
  LogOut, 
  Settings, 
  Home, 
  Mail, 
  Phone, 
  MapPin,
  Edit,
  Trash,
  Star
} from 'lucide-react';
import ProductCard from '../components/product-card';

// Mock data for the account page
const mockUser = {
  id: 1,
  first_name: 'Ahmed',
  last_name: 'Hassan',
  email: 'ahmed.hassan@example.com',
  phone: '+20 123 456 7890',
  avatar: null,
  addresses: [
    {
      id: 1,
      name: 'Home',
      address_line1: '123 Main Street',
      address_line2: 'Apartment 4B',
      city: 'Cairo',
      state: 'Cairo Governorate',
      postal_code: '12345',
      country: 'Egypt',
      is_default: true,
      phone: '+20 123 456 7890'
    },
    {
      id: 2,
      name: 'Work',
      address_line1: '456 Business Avenue',
      address_line2: 'Floor 7',
      city: 'Cairo',
      state: 'Cairo Governorate',
      postal_code: '54321',
      country: 'Egypt',
      is_default: false,
      phone: '+20 987 654 3210'
    }
  ]
};

const mockOrders = [
  {
    id: 'ORD-12345',
    date: '2025-05-15',
    status: 'delivered',
    total: 2150,
    items: [
      {
        id: 1,
        name: 'Summer Floral Dress',
        price: 1200,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80'
      },
      {
        id: 5,
        name: 'Summer Sandals',
        price: 750,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      }
    ]
  },
  {
    id: 'ORD-12346',
    date: '2025-04-28',
    status: 'delivered',
    total: 1850,
    items: [
      {
        id: 2,
        name: 'Casual Linen Shirt',
        price: 850,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
      },
      {
        id: 6,
        name: 'Cotton T-Shirt',
        price: 350,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=880&q=80'
      },
      {
        id: 8,
        name: 'Aviator Sunglasses',
        price: 300,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80'
      }
    ]
  },
  {
    id: 'ORD-12347',
    date: '2025-03-10',
    status: 'delivered',
    total: 2450,
    items: [
      {
        id: 4,
        name: 'Leather Crossbody Bag',
        price: 1500,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80'
      },
      {
        id: 3,
        name: 'Classic Denim Jeans',
        price: 950,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
      }
    ]
  }
];

const mockWishlist = [
  {
    id: 9,
    name: 'Printed Maxi Dress',
    price: 1350,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=873&q=80',
    category: 'Women',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'WD-9009'
  },
  {
    id: 10,
    name: 'Slim Fit Blazer',
    price: 1800,
    salePrice: null,
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Men',
    isNew: true,
    isFeatured: false,
    isOnSale: false,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'MB-1010'
  },
  {
    id: 17,
    name: 'Embroidered Blouse',
    price: 950,
    salePrice: 750,
    image: 'https://images.unsplash.com/photo-1604945234568-86eda11263b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: 'Women',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 1,
    storeName: 'Fashion Elite',
    sku: 'WB-1717'
  },
  {
    id: 21,
    name: 'Slip-On Loafers',
    price: 850,
    salePrice: 650,
    image: 'https://images.unsplash.com/photo-1531310197839-ccf54634509e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=765&q=80',
    category: 'Footwear',
    isNew: false,
    isFeatured: false,
    isOnSale: true,
    storeId: 2,
    storeName: 'Cairo Threads',
    sku: 'FL-2121'
  }
];

const AccountPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // In a real implementation, these would come from Redux
  const user = mockUser;
  const orders = mockOrders;
  const wishlist = mockWishlist;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-8">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={user.avatar || undefined} alt={`${user.first_name} ${user.last_name}`} />
                    <AvatarFallback>{user.first_name.charAt(0)}{user.last_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <Link to="/account/profile" className="flex items-center px-6 py-3 hover:bg-accent">
                    <User className="mr-2 h-4 w-4" />
                    {t('account.profile')}
                  </Link>
                  <Link to="/account/orders" className="flex items-center px-6 py-3 hover:bg-accent">
                    <Package className="mr-2 h-4 w-4" />
                    {t('account.orders')}
                  </Link>
                  <Link to="/wishlist" className="flex items-center px-6 py-3 hover:bg-accent">
                    <Heart className="mr-2 h-4 w-4" />
                    {t('account.wishlist')}
                  </Link>
                  <Link to="/account/addresses" className="flex items-center px-6 py-3 hover:bg-accent">
                    <MapPin className="mr-2 h-4 w-4" />
                    {t('account.addresses')}
                  </Link>
                  <Link to="/account/payment-methods" className="flex items-center px-6 py-3 hover:bg-accent">
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t('account.paymentMethods')}
                  </Link>
                  <Link to="/account/settings" className="flex items-center px-6 py-3 hover:bg-accent">
                    <Settings className="mr-2 h-4 w-4" />
                    {t('account.accountSettings')}
                  </Link>
                  <button className="flex items-center px-6 py-3 hover:bg-accent text-left">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('common.logout')}
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div>
            <Tabs defaultValue="profile">
              <TabsList className="mb-6">
                <TabsTrigger value="profile">{t('account.profile')}</TabsTrigger>
                <TabsTrigger value="orders">{t('account.orders')}</TabsTrigger>
                <TabsTrigger value="wishlist">{t('account.wishlist')}</TabsTrigger>
                <TabsTrigger value="addresses">{t('account.addresses')}</TabsTrigger>
              </TabsList>
              
              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('account.personalInformation')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first_name">{t('account.firstName')}</Label>
                          <Input id="first_name" defaultValue={user.first_name} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last_name">{t('account.lastName')}</Label>
                          <Input id="last_name" defaultValue={user.last_name} />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">{t('account.email')}</Label>
                        <Input id="email" type="email" defaultValue={user.email} />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('account.phone')}</Label>
                        <Input id="phone" defaultValue={user.phone} />
                      </div>
                      
                      <Button type="submit">{t('common.save')}</Button>
                    </form>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">{t('account.changePassword')}</h3>
                      <form className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current_password">{t('account.currentPassword')}</Label>
                          <Input id="current_password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new_password">{t('account.newPassword')}</Label>
                          <Input id="new_password" type="password" />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">{t('account.confirmPassword')}</Label>
                          <Input id="confirm_password" type="password" />
                        </div>
                        
                        <Button type="submit">{t('account.updatePassword')}</Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Orders Tab */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('account.orderHistory')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-6">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">{t('account.noOrders')}</h3>
                        <p className="text-muted-foreground mb-4">{t('account.noOrdersMessage')}</p>
                        <Button asChild>
                          <Link to="/categories">{t('account.startShopping')}</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order: any) => (
                          <Card key={order.id}>
                            <CardContent className="p-6">
                              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                <div>
                                  <h3 className="font-medium">{t('account.orderNumber')}: {order.id}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="mt-2 md:mt-0 flex items-center">
                                  <Badge 
                                    variant="secondary" 
                                    className={
                                      order.status === 'delivered' 
                                        ? 'bg-green-500 text-white hover:bg-green-600' 
                                        : order.status === 'processing'
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : order.status === 'shipped'
                                        ? 'bg-purple-500 text-white hover:bg-purple-600'
                                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                                    }
                                  >
                                    {t(`account.${order.status}`)}
                                  </Badge>
                                  <span className="mx-2 text-muted-foreground">|</span>
                                  <span className="font-medium">{order.total.toLocaleString()} EGP</span>
                                </div>
                              </div>
                              
                              <div className="space-y-4">
                                {order.items.map((item: any) => (
                                  <div key={item.id} className="flex items-center">
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="h-16 w-16 object-cover rounded mr-4"
                                    />
                                    <div className="flex-1">
                                      <h4 className="font-medium">{item.name}</h4>
                                      <p className="text-sm text-muted-foreground">
                                        {t('account.quantity')}: {item.quantity} × {item.price.toLocaleString()} EGP
                                      </p>
                                    </div>
                                    <Button asChild variant="ghost" size="sm">
                                      <Link to={`/products/${item.id}`}>
                                        {t('account.viewProduct')}
                                      </Link>
                                    </Button>
                                  </div>
                                ))}
                              </div>
                              
                              <div className="flex justify-between mt-4 pt-4 border-t">
                                <Button asChild variant="outline" size="sm">
                                  <Link to={`/account/orders/${order.id}`}>
                                    {t('account.viewOrderDetails')}
                                  </Link>
                                </Button>
                                {order.status === 'delivered' && (
                                  <Button size="sm">
                                    {t('account.writeReview')}
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Wishlist Tab */}
              <TabsContent value="wishlist">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('account.myWishlist')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {wishlist.length === 0 ? (
                      <div className="text-center py-6">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">{t('account.emptyWishlist')}</h3>
                        <p className="text-muted-foreground mb-4">{t('account.emptyWishlistMessage')}</p>
                        <Button asChild>
                          <Link to="/categories">{t('account.startShopping')}</Link>
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlist.map((product: any) => (
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
                            isOnSale={product.isOnSale}
                            storeId={product.storeId}
                            storeName={product.storeName}
                            sku={product.sku}
                          />
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Addresses Tab */}
              <TabsContent value="addresses">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t('account.shippingAddresses')}</CardTitle>
                    <Button size="sm">
                      {t('account.addNewAddress')}
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {user.addresses.length === 0 ? (
                      <div className="text-center py-6">
                        <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">{t('account.noAddresses')}</h3>
                        <p className="text-muted-foreground mb-4">{t('account.noAddressesMessage')}</p>
                        <Button>{t('account.addNewAddress')}</Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {user.addresses.map((address: any) => (
                          <Card key={address.id}>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center">
                                  <h3 className="font-medium">{address.name}</h3>
                                  {address.is_default && (
                                    <Badge variant="secondary" className="ml-2">
                                      {t('account.default')}
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex space-x-2">
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon">
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="space-y-1 text-sm">
                                <p>{address.address_line1}</p>
                                {address.address_line2 && <p>{address.address_line2}</p>}
                                <p>{address.city}, {address.state} {address.postal_code}</p>
                                <p>{address.country}</p>
                                <p className="flex items-center mt-2">
                                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                  {address.phone}
                                </p>
                              </div>
                              
                              {!address.is_default && (
                                <Button variant="outline" size="sm" className="mt-4">
                                  {t('account.setAsDefault')}
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountPage;
