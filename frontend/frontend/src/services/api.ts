import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Request interceptor for JWT and language
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  const lang = localStorage.getItem('lang') || 'en';
  config.headers['Accept-Language'] = lang;
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally handle global errors, e.g. token expiry
    if (error.response && error.response.status === 401) {
      // Handle unauthorized (logout, redirect, etc.)
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  login: (email: string, password: string) => 
    api.post('/users/token/', { email, password }),
  
  register: (userData: any) => 
    api.post('/users/register/', userData),
  
  verifyEmail: (token: string) => 
    api.post('/users/verify-email/', { token }),
  
  resetPassword: (email: string) => 
    api.post('/users/reset-password/', { email }),
  
  setNewPassword: (token: string, password: string) => 
    api.post('/users/set-password/', { token, password }),
  
  getProfile: () => 
    api.get('/users/me/'),
  
  updateProfile: (userData: any) => 
    api.patch('/users/me/', userData),
  
  changePassword: (data: any) =>
    api.post('/users/change_password/', data),
  
  getAddresses: () =>
    api.get('/users/addresses/'),
  
  addAddress: (address: any) =>
    api.post('/users/addresses/', address),
  
  updateAddress: (id: number, address: any) =>
    api.patch(`/users/addresses/${id}/`, address),
  
  deleteAddress: (id: number) =>
    api.delete(`/users/addresses/${id}/`),
};

// Products API
export const productsAPI = {
  getProducts: (params?: any) => 
    api.get('/products/', { params }),
  
  getProduct: (id: number) => 
    api.get(`/products/${id}/`),
  
  getCategories: () => 
    api.get('/products/categories/'),
};

// Cart API
export const cartAPI = {
  getCart: () => 
    api.get('/orders/cart/'),
  
  addToCart: (productId: number, quantity: number, variantId?: number) => 
    api.post('/orders/cart/items/', { product_id: productId, quantity, variant_id: variantId }),
  
  updateCartItem: (itemId: number, quantity: number) => 
    api.patch(`/orders/cart/items/${itemId}/`, { quantity }),
  
  removeCartItem: (itemId: number) => 
    api.delete(`/orders/cart/items/${itemId}/`),
  
  clearCart: () => 
    api.delete('/orders/cart/items/'),
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData: any) => 
    api.post('/orders/', orderData),
  
  getOrders: () => 
    api.get('/orders/'),
  
  getOrder: (id: number) => 
    api.get(`/orders/${id}/`),
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: (orderId: number) => 
    api.post(`/payments/create-intent/${orderId}/`),
  
  confirmPayment: (paymentIntentId: string, orderId: number) => 
    api.post('/payments/confirm/', { payment_intent_id: paymentIntentId, order_id: orderId }),
  
  getPaymentMethods: () => 
    api.get('/payments/methods/'),
  
  savePaymentMethod: (paymentMethodData: any) => 
    api.post('/payments/methods/', paymentMethodData),
};

// Store API
export const storeAPI = {
  getStoreDetails: (storeId: number) => 
    api.get(`/stores/${storeId}/`),
  
  getStoreProducts: (storeId: number, params?: any) => 
    api.get(`/stores/${storeId}/products/`, { params }),
  
  getStoreCategories: (storeId: number) => 
    api.get(`/stores/${storeId}/categories/`),
  
  getStoreLocations: (storeId: number) => 
    api.get(`/stores/${storeId}/locations/`),
};

// Store Admin API
export const storeAdminAPI = {
  getDashboard: () => 
    api.get('/stores/admin/dashboard/'),
  
  getProducts: (params?: any) => 
    api.get('/stores/admin/products/', { params }),
  
  createProduct: (productData: any) => 
    api.post('/stores/admin/products/', productData),
  
  updateProduct: (id: number, productData: any) => 
    api.patch(`/stores/admin/products/${id}/`, productData),
  
  deleteProduct: (id: number) => 
    api.delete(`/stores/admin/products/${id}/`),
  
  getOrders: (params?: any) => 
    api.get('/stores/admin/orders/', { params }),
  
  updateOrder: (id: number, orderData: any) => 
    api.patch(`/stores/admin/orders/${id}/`, orderData),
  
  getCustomers: (params?: any) => 
    api.get('/stores/admin/customers/', { params }),
  
  getStoreSettings: () => 
    api.get('/stores/admin/settings/'),
  
  updateStoreSettings: (settingsData: any) => 
    api.patch('/stores/admin/settings/', settingsData),
  
  getStaff: () => 
    api.get('/stores/admin/staff/'),
  
  addStaffMember: (staffData: any) => 
    api.post('/stores/admin/staff/', staffData),
  
  updateStaffMember: (id: number, staffData: any) => 
    api.patch(`/stores/admin/staff/${id}/`, staffData),
  
  removeStaffMember: (id: number) => 
    api.delete(`/stores/admin/staff/${id}/`),
  
  getInventory: (params?: any) => 
    api.get('/stores/admin/inventory/', { params }),
  
  updateInventory: (id: number, inventoryData: any) => 
    api.patch(`/stores/admin/inventory/${id}/`, inventoryData),
};

// Super Admin API
export const superAdminAPI = {
  getDashboard: () => 
    api.get('/admin/dashboard/'),
  
  getStores: (params?: any) => 
    api.get('/admin/stores/', { params }),
  
  getStore: (id: number) => 
    api.get(`/admin/stores/${id}/`),
  
  updateStore: (id: number, storeData: any) => 
    api.patch(`/admin/stores/${id}/`, storeData),
  
  getSettlements: (params?: any) => 
    api.get('/admin/settlements/', { params }),
  
  createSettlement: (settlementData: any) => 
    api.post('/admin/settlements/', settlementData),
  
  getSettlement: (id: number) => 
    api.get(`/admin/settlements/${id}/`),
  
  updateSettlement: (id: number, settlementData: any) => 
    api.patch(`/admin/settlements/${id}/`, settlementData),
  
  getAnalytics: (params?: any) => 
    api.get('/admin/analytics/', { params }),
  
  getPlatformSettings: () => 
    api.get('/admin/settings/'),
  
  updatePlatformSettings: (settingsData: any) => 
    api.patch('/admin/settings/', settingsData),
};

export default api;
