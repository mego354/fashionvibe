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
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  CreditCard, 
  Calendar, 
  Lock,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  Building,
  Globe,
  ChevronRight
} from 'lucide-react';

// Mock data for checkout
const mockCartItems = [
  {
    id: 1,
    product_id: 1,
    name: 'Summer Floral Dress',
    price: 1200,
    sale_price: null,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80',
    size: 'M',
    color: 'Blue',
    sku: 'WD-1001',
    store_id: 1,
    store_name: 'Fashion Elite'
  },
  {
    id: 2,
    product_id: 5,
    name: 'Summer Sandals',
    price: 750,
    sale_price: null,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80',
    size: '39',
    color: 'Beige',
    sku: 'FS-5005',
    store_id: 2,
    store_name: 'Cairo Threads'
  }
];

const mockAddresses = [
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
];

const mockShippingMethods = [
  {
    id: 1,
    name: 'Standard Shipping',
    description: 'Delivery in 3-5 business days',
    price: 50,
    estimated_days: 5
  },
  {
    id: 2,
    name: 'Express Shipping',
    description: 'Delivery in 1-2 business days',
    price: 100,
    estimated_days: 2
  },
  {
    id: 3,
    name: 'Same Day Delivery',
    description: 'Delivery today (order before 2 PM)',
    price: 150,
    estimated_days: 0
  }
];

const mockPaymentMethods = [
  {
    id: 1,
    type: 'credit_card',
    name: 'Credit/Debit Card'
  },
  {
    id: 2,
    type: 'cash_on_delivery',
    name: 'Cash on Delivery'
  },
  {
    id: 3,
    type: 'wallet',
    name: 'Digital Wallet'
  }
];

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  
  // In a real implementation, these would come from Redux
  const cartItems = mockCartItems;
  const addresses = mockAddresses;
  const shippingMethods = mockShippingMethods;
  const paymentMethods = mockPaymentMethods;
  
  const [activeStep, setActiveStep] = React.useState(1);
  const [selectedAddress, setSelectedAddress] = React.useState<number | null>(addresses[0]?.id || null);
  const [selectedShipping, setSelectedShipping] = React.useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = React.useState<number | null>(null);
  const [couponCode, setCouponCode] = React.useState('');
  const [orderNotes, setOrderNotes] = React.useState('');
  
  // Calculate totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.sale_price || item.price) * item.quantity;
  }, 0);
  
  const shippingCost = selectedShipping 
    ? shippingMethods.find(method => method.id === selectedShipping)?.price || 0 
    : 0;
  
  const tax = Math.round(subtotal * 0.14); // 14% VAT in Egypt
  const total = subtotal + shippingCost + tax;
  
  const handleContinue = () => {
    if (activeStep === 1 && !selectedAddress) {
      alert(t('checkout.selectAddressError'));
      return;
    }
    
    if (activeStep === 2 && !selectedShipping) {
      alert(t('checkout.selectShippingError'));
      return;
    }
    
    if (activeStep === 3 && !selectedPayment) {
      alert(t('checkout.selectPaymentError'));
      return;
    }
    
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    } else {
      // Place order
      alert(t('checkout.orderPlacedSuccess'));
      // Redirect to order confirmation page
      // history.push('/order-confirmation');
    }
  };
  
  const handleBack = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement coupon logic
    console.log('Apply coupon:', couponCode);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">{t('checkout.checkout')}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Checkout Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div 
                    key={step} 
                    className={`flex flex-col items-center ${step < activeStep ? 'text-primary' : step === activeStep ? 'text-foreground' : 'text-muted-foreground'}`}
                  >
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full mb-2 ${
                        step < activeStep 
                          ? 'bg-primary text-primary-foreground' 
                          : step === activeStep 
                          ? 'border-2 border-primary' 
                          : 'border-2 border-muted'
                      }`}
                    >
                      {step < activeStep ? '✓' : step}
                    </div>
                    <span className="text-sm hidden md:block">
                      {step === 1 && t('checkout.shipping')}
                      {step === 2 && t('checkout.delivery')}
                      {step === 3 && t('checkout.payment')}
                      {step === 4 && t('checkout.review')}
                    </span>
                  </div>
                ))}
                <div className="absolute left-0 right-0 h-0.5 bg-muted -z-10"></div>
              </div>
            </div>
            
            {/* Step 1: Shipping Address */}
            {activeStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.shippingAddress')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div 
                        key={address.id} 
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedAddress === address.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div 
                              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                                selectedAddress === address.id ? 'border-primary' : 'border-muted-foreground'
                              }`}
                            >
                              {selectedAddress === address.id && (
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{address.name}</h3>
                              {address.is_default && (
                                <span className="text-xs text-muted-foreground">{t('checkout.defaultAddress')}</span>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            {t('checkout.edit')}
                          </Button>
                        </div>
                        
                        <div className="mt-2 pl-8 space-y-1 text-sm">
                          <p>{address.address_line1}</p>
                          {address.address_line2 && <p>{address.address_line2}</p>}
                          <p>{address.city}, {address.state} {address.postal_code}</p>
                          <p>{address.country}</p>
                          <p className="flex items-center mt-1">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            {address.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    <Button variant="outline" className="w-full">
                      {t('checkout.addNewAddress')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 2: Delivery Method */}
            {activeStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.deliveryMethod')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {shippingMethods.map((method) => (
                      <div 
                        key={method.id} 
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedShipping === method.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        onClick={() => setSelectedShipping(method.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div 
                              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                                selectedShipping === method.id ? 'border-primary' : 'border-muted-foreground'
                              }`}
                            >
                              {selectedShipping === method.id && (
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-medium">{method.name}</h3>
                              <p className="text-sm text-muted-foreground">{method.description}</p>
                            </div>
                          </div>
                          <div className="font-medium">
                            {method.price.toLocaleString()} EGP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Label htmlFor="order-notes" className="mb-2 block">{t('checkout.orderNotes')}</Label>
                    <Textarea 
                      id="order-notes" 
                      placeholder={t('checkout.orderNotesPlaceholder')}
                      value={orderNotes}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setOrderNotes(e.target.value)}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 3: Payment Method */}
            {activeStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.paymentMethod')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div 
                        key={method.id} 
                        className={`p-4 border rounded-lg cursor-pointer ${
                          selectedPayment === method.id ? 'border-primary bg-primary/5' : 'border-border'
                        }`}
                        onClick={() => setSelectedPayment(method.id)}
                      >
                        <div className="flex items-center">
                          <div 
                            className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                              selectedPayment === method.id ? 'border-primary' : 'border-muted-foreground'
                            }`}
                          >
                            {selectedPayment === method.id && (
                              <div className="w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium">{method.name}</h3>
                          </div>
                        </div>
                        
                        {selectedPayment === method.id && method.type === 'credit_card' && (
                          <div className="mt-4 pl-8 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="card-number">{t('checkout.cardNumber')}</Label>
                              <div className="relative">
                                <Input 
                                  id="card-number" 
                                  placeholder="1234 5678 9012 3456" 
                                />
                                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiry-date">{t('checkout.expiryDate')}</Label>
                                <div className="relative">
                                  <Input 
                                    id="expiry-date" 
                                    placeholder="MM/YY" 
                                  />
                                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="cvv">{t('checkout.cvv')}</Label>
                                <div className="relative">
                                  <Input 
                                    id="cvv" 
                                    placeholder="123" 
                                  />
                                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="name-on-card">{t('checkout.nameOnCard')}</Label>
                              <Input 
                                id="name-on-card" 
                                placeholder="John Doe" 
                              />
                            </div>
                          </div>
                        )}
                        
                        {selectedPayment === method.id && method.type === 'cash_on_delivery' && (
                          <div className="mt-4 pl-8">
                            <p className="text-sm text-muted-foreground">
                              {t('checkout.cashOnDeliveryDescription')}
                            </p>
                          </div>
                        )}
                        
                        {selectedPayment === method.id && method.type === 'wallet' && (
                          <div className="mt-4 pl-8 space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="wallet-type">{t('checkout.walletType')}</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder={t('checkout.selectWallet')} />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="paymob">Paymob</SelectItem>
                                  <SelectItem value="fawry">Fawry</SelectItem>
                                  <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="wallet-number">{t('checkout.walletNumber')}</Label>
                              <Input 
                                id="wallet-number" 
                                placeholder="01XXXXXXXXX" 
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Step 4: Review Order */}
            {activeStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.reviewOrder')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Items */}
                    <div>
                      <h3 className="font-medium mb-4">{t('checkout.items')}</h3>
                      <div className="space-y-4">
                        {cartItems.map((item) => (
                          <div key={item.id} className="flex items-center">
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="h-16 w-16 object-cover rounded mr-4"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <div className="text-sm text-muted-foreground">
                                {item.size && <span className="mr-2">{t('checkout.size')}: {item.size}</span>}
                                {item.color && <span className="mr-2">{t('checkout.color')}: {item.color}</span>}
                                <span>{t('checkout.quantity')}: {item.quantity}</span>
                              </div>
                            </div>
                            <div className="font-medium">
                              {((item.sale_price || item.price) * item.quantity).toLocaleString()} EGP
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Shipping Address */}
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{t('checkout.shippingAddress')}</h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveStep(1)}>
                          {t('checkout.change')}
                        </Button>
                      </div>
                      
                      {selectedAddress && (
                        <div className="text-sm">
                          <p className="font-medium">
                            {addresses.find(a => a.id === selectedAddress)?.name}
                          </p>
                          <p>{addresses.find(a => a.id === selectedAddress)?.address_line1}</p>
                          {addresses.find(a => a.id === selectedAddress)?.address_line2 && (
                            <p>{addresses.find(a => a.id === selectedAddress)?.address_line2}</p>
                          )}
                          <p>
                            {addresses.find(a => a.id === selectedAddress)?.city}, 
                            {addresses.find(a => a.id === selectedAddress)?.state} 
                            {addresses.find(a => a.id === selectedAddress)?.postal_code}
                          </p>
                          <p>{addresses.find(a => a.id === selectedAddress)?.country}</p>
                          <p className="flex items-center mt-1">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            {addresses.find(a => a.id === selectedAddress)?.phone}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Delivery Method */}
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{t('checkout.deliveryMethod')}</h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveStep(2)}>
                          {t('checkout.change')}
                        </Button>
                      </div>
                      
                      {selectedShipping && (
                        <div className="text-sm">
                          <p className="font-medium">
                            {shippingMethods.find(m => m.id === selectedShipping)?.name}
                          </p>
                          <p className="text-muted-foreground">
                            {shippingMethods.find(m => m.id === selectedShipping)?.description}
                          </p>
                          <p className="mt-1">
                            {shippingMethods.find(m => m.id === selectedShipping)?.price.toLocaleString()} EGP
                          </p>
                        </div>
                      )}
                      
                      {orderNotes && (
                        <div className="mt-2">
                          <p className="font-medium text-sm">{t('checkout.orderNotes')}:</p>
                          <p className="text-sm text-muted-foreground">{orderNotes}</p>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    {/* Payment Method */}
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{t('checkout.paymentMethod')}</h3>
                        <Button variant="ghost" size="sm" onClick={() => setActiveStep(3)}>
                          {t('checkout.change')}
                        </Button>
                      </div>
                      
                      {selectedPayment && (
                        <div className="text-sm">
                          <p className="font-medium">
                            {paymentMethods.find(m => m.id === selectedPayment)?.name}
                          </p>
                          {selectedPayment === 1 && (
                            <p className="text-muted-foreground">
                              **** **** **** 3456
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Navigation Buttons */}
            <div className="mt-6 flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                disabled={activeStep === 1}
              >
                {t('checkout.back')}
              </Button>
              
              <Button onClick={handleContinue}>
                {activeStep < 4 ? t('checkout.continue') : t('checkout.placeOrder')}
              </Button>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t('checkout.orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        {((item.sale_price || item.price) * item.quantity).toLocaleString()} EGP
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('checkout.subtotal')}</span>
                    <span>{subtotal.toLocaleString()} EGP</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('checkout.shipping')}</span>
                    <span>
                      {selectedShipping 
                        ? `${shippingCost.toLocaleString()} EGP` 
                        : t('checkout.calculatedNext')
                      }
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('checkout.tax')}</span>
                    <span>{tax.toLocaleString()} EGP</span>
                  </div>
                </div>
                
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <Input
                    placeholder={t('checkout.couponCode')}
                    value={couponCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" variant="outline">
                    {t('checkout.apply')}
                  </Button>
                </form>
                
                <Separator />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>{t('checkout.total')}</span>
                  <span>{total.toLocaleString()} EGP</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
