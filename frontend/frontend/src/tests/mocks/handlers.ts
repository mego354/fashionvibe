import { rest } from 'msw';

// Base API URL
const baseUrl = 'http://localhost:8000/api';

// Mock user data
const mockUser = {
  id: 1,
  email: 'test@example.com',
  first_name: 'Test',
  last_name: 'User',
  role: 'customer',
  phone_number: '+201234567890',
  is_active: true,
};

// Mock store admin user
const mockStoreAdmin = {
  id: 2,
  email: 'admin@store.com',
  first_name: 'Store',
  last_name: 'Admin',
  role: 'store_admin',
  phone_number: '+201234567891',
  is_active: true,
  store_id: 1,
};

// Mock super admin user
const mockSuperAdmin = {
  id: 3,
  email: 'admin@fashionhub.com',
  first_name: 'Super',
  last_name: 'Admin',
  role: 'super_admin',
  phone_number: '+201234567892',
  is_active: true,
};

// Mock products
const mockProducts = [
  {
    id: 1,
    name: 'Summer T-shirt',
    description: 'Comfortable cotton t-shirt for summer',
    price: 250,
    sale_price: null,
    image: '/images/products/tshirt.jpg',
    category: 'Men',
    store_id: 1,
    store_name: 'Fashion Elite',
    rating: 4.5,
    stock: 45,
    is_featured: true,
  },
  {
    id: 2,
    name: 'Slim Fit Jeans',
    description: 'Modern slim fit jeans for men',
    price: 450,
    sale_price: 399,
    image: '/images/products/jeans.jpg',
    category: 'Men',
    store_id: 1,
    store_name: 'Fashion Elite',
    rating: 4.2,
    stock: 32,
    is_featured: true,
  },
  {
    id: 3,
    name: 'Floral Dress',
    description: 'Beautiful floral summer dress',
    price: 650,
    sale_price: null,
    image: '/images/products/dress.jpg',
    category: 'Women',
    store_id: 2,
    store_name: 'Cairo Styles',
    rating: 4.8,
    stock: 18,
    is_featured: true,
  },
  {
    id: 4,
    name: 'Leather Belt',
    description: 'Premium quality leather belt',
    price: 150,
    sale_price: null,
    image: '/images/products/belt.jpg',
    category: 'Accessories',
    store_id: 1,
    store_name: 'Fashion Elite',
    rating: 4.0,
    stock: 56,
    is_featured: false,
  },
];

// Mock categories
const mockCategories = [
  { id: 1, name: 'Men', image: '/images/categories/men.jpg', product_count: 120 },
  { id: 2, name: 'Women', image: '/images/categories/women.jpg', product_count: 150 },
  { id: 3, name: 'Accessories', image: '/images/categories/accessories.jpg', product_count: 80 },
  { id: 4, name: 'Footwear', image: '/images/categories/footwear.jpg', product_count: 65 },
];

// Mock cart
const mockCart = {
  id: 1,
  items: [
    {
      id: 1,
      product_id: 1,
      product_name: 'Summer T-shirt',
      price: 250,
      quantity: 2,
      image: '/images/products/tshirt.jpg',
      store_id: 1,
      store_name: 'Fashion Elite',
    },
    {
      id: 2,
      product_id: 4,
      product_name: 'Leather Belt',
      price: 150,
      quantity: 1,
      image: '/images/products/belt.jpg',
      store_id: 1,
      store_name: 'Fashion Elite',
    },
  ],
  subtotal: 650,
  tax: 65,
  shipping: 30,
  discount: 0,
  total: 745,
};

// Define handlers
export const handlers = [
  // Auth endpoints
  rest.post(`${baseUrl}/users/login/`, (req, res, ctx) => {
    const { email, password } = req.body;
    
    // Simple mock authentication
    if (email === 'test@example.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          token: 'mock-jwt-token',
          user: mockUser,
        })
      );
    } else if (email === 'admin@store.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          token: 'mock-jwt-token-admin',
          user: mockStoreAdmin,
        })
      );
    } else if (email === 'admin@fashionhub.com' && password === 'password') {
      return res(
        ctx.status(200),
        ctx.json({
          token: 'mock-jwt-token-super',
          user: mockSuperAdmin,
        })
      );
    } else {
      return res(
        ctx.status(401),
        ctx.json({ detail: 'Invalid credentials' })
      );
    }
  }),
  
  rest.post(`${baseUrl}/users/register/`, (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        message: 'User registered successfully. Please check your email for verification.',
      })
    );
  }),
  
  rest.get(`${baseUrl}/users/profile/`, (req, res, ctx) => {
    // Check authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({ detail: 'Authentication credentials were not provided.' })
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    if (token === 'mock-jwt-token') {
      return res(ctx.status(200), ctx.json(mockUser));
    } else if (token === 'mock-jwt-token-admin') {
      return res(ctx.status(200), ctx.json(mockStoreAdmin));
    } else if (token === 'mock-jwt-token-super') {
      return res(ctx.status(200), ctx.json(mockSuperAdmin));
    } else {
      return res(
        ctx.status(401),
        ctx.json({ detail: 'Invalid token' })
      );
    }
  }),
  
  // Products endpoints
  rest.get(`${baseUrl}/products/`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        count: mockProducts.length,
        next: null,
        previous: null,
        results: mockProducts,
      })
    );
  }),
  
  rest.get(`${baseUrl}/products/:id/`, (req, res, ctx) => {
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === parseInt(id));
    
    if (product) {
      return res(ctx.status(200), ctx.json(product));
    } else {
      return res(
        ctx.status(404),
        ctx.json({ detail: 'Product not found' })
      );
    }
  }),
  
  rest.get(`${baseUrl}/products/categories/`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockCategories));
  }),
  
  rest.get(`${baseUrl}/products/featured/`, (req, res, ctx) => {
    const featured = mockProducts.filter(p => p.is_featured);
    return res(ctx.status(200), ctx.json(featured));
  }),
  
  rest.get(`${baseUrl}/products/:id/related/`, (req, res, ctx) => {
    const { id } = req.params;
    const product = mockProducts.find(p => p.id === parseInt(id));
    
    if (product) {
      // Return products in the same category
      const related = mockProducts.filter(p => p.category === product.category && p.id !== product.id);
      return res(ctx.status(200), ctx.json(related));
    } else {
      return res(
        ctx.status(404),
        ctx.json({ detail: 'Product not found' })
      );
    }
  }),
  
  // Cart endpoints
  rest.get(`${baseUrl}/orders/cart/`, (req, res, ctx) => {
    // Check authorization
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({ detail: 'Authentication credentials were not provided.' })
      );
    }
    
    return res(ctx.status(200), ctx.json(mockCart));
  }),
  
  rest.post(`${baseUrl}/orders/cart/items/`, (req, res, ctx) => {
    // Check authorization
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({ detail: 'Authentication credentials were not provided.' })
      );
    }
    
    const { product_id, quantity } = req.body;
    const product = mockProducts.find(p => p.id === product_id);
    
    if (!product) {
      return res(
        ctx.status(404),
        ctx.json({ detail: 'Product not found' })
      );
    }
    
    // Add item to cart (in a real app, this would update the cart)
    const updatedCart = { ...mockCart };
    
    // Check if product already in cart
    const existingItem = updatedCart.items.find(item => item.product_id === product_id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      updatedCart.items.push({
        id: updatedCart.items.length + 1,
        product_id,
        product_name: product.name,
        price: product.sale_price || product.price,
        quantity,
        image: product.image,
        store_id: product.store_id,
        store_name: product.store_name,
      });
    }
    
    // Recalculate totals
    updatedCart.subtotal = updatedCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    updatedCart.tax = Math.round(updatedCart.subtotal * 0.1);
    updatedCart.total = updatedCart.subtotal + updatedCart.tax + updatedCart.shipping - updatedCart.discount;
    
    return res(ctx.status(200), ctx.json(updatedCart));
  }),
  
  // Store admin endpoints
  rest.get(`${baseUrl}/stores/admin/dashboard/`, (req, res, ctx) => {
    // Check authorization and role
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({ detail: 'Authentication credentials were not provided.' })
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    if (token !== 'mock-jwt-token-admin' && token !== 'mock-jwt-token-super') {
      return res(
        ctx.status(403),
        ctx.json({ detail: 'You do not have permission to perform this action.' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        sales_overview: [
          { name: 'Jan', sales: 4000 },
          { name: 'Feb', sales: 3000 },
          { name: 'Mar', sales: 5000 },
          { name: 'Apr', sales: 2780 },
          { name: 'May', sales: 1890 },
          { name: 'Jun', sales: 2390 },
          { name: 'Jul', sales: 3490 },
        ],
        product_categories: [
          { name: 'T-shirts', value: 400 },
          { name: 'Jeans', value: 300 },
          { name: 'Dresses', value: 300 },
          { name: 'Accessories', value: 200 },
        ],
        recent_orders: [
          { id: 1, customer: 'Ahmed Mohamed', total: 1250, status: 'Processing', date: '2025-05-20' },
          { id: 2, customer: 'Sara Ahmed', total: 890, status: 'Shipped', date: '2025-05-19' },
          { id: 3, customer: 'Mohamed Ali', total: 2100, status: 'Delivered', date: '2025-05-18' },
          { id: 4, customer: 'Fatma Hussein', total: 750, status: 'Processing', date: '2025-05-17' },
        ],
        low_stock_products: [
          { id: 3, name: 'Floral Dress', sku: 'DR-003', stock: 18 },
        ],
      })
    );
  }),
  
  // Super admin endpoints
  rest.get(`${baseUrl}/admin/dashboard/`, (req, res, ctx) => {
    // Check authorization and role
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(
        ctx.status(401),
        ctx.json({ detail: 'Authentication credentials were not provided.' })
      );
    }
    
    const token = authHeader.split(' ')[1];
    
    if (token !== 'mock-jwt-token-super') {
      return res(
        ctx.status(403),
        ctx.json({ detail: 'You do not have permission to perform this action.' })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        platform_overview: [
          { name: 'Jan', revenue: 120000, stores: 45 },
          { name: 'Feb', revenue: 135000, stores: 48 },
          { name: 'Mar', revenue: 162000, stores: 52 },
          { name: 'Apr', revenue: 180000, stores: 55 },
          { name: 'May', revenue: 195000, stores: 58 },
          { name: 'Jun', revenue: 210000, stores: 62 },
          { name: 'Jul', revenue: 225000, stores: 65 },
        ],
        subscription_distribution: [
          { name: 'Basic', value: 35 },
          { name: 'Standard', value: 45 },
          { name: 'Premium', value: 20 },
        ],
        top_stores: [
          { id: 1, name: 'Fashion Elite', owner: 'Ahmed Mohamed', subscription: 'Premium', revenue: 45000, status: 'Active' },
          { id: 2, name: 'Cairo Styles', owner: 'Sara Ahmed', subscription: 'Standard', revenue: 28000, status: 'Active' },
          { id: 5, name: 'Egyptian Couture', owner: 'Khaled Mahmoud', subscription: 'Premium', revenue: 52000, status: 'Active' },
        ],
        recent_settlements: [
          { id: 1, store: 'Fashion Elite', amount: 38250, fee: 6750, date: '2025-05-15', status: 'Completed' },
          { id: 2, name: 'Cairo Styles', amount: 23800, fee: 4200, date: '2025-05-15', status: 'Completed' },
          { id: 3, name: 'Alexandria Trends', amount: 10200, fee: 1800, date: '2025-05-15', status: 'Pending' },
        ],
      })
    );
  }),
];
