import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// Mock data - would be replaced with actual API calls
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

const productData = [
  { name: 'T-shirts', value: 400 },
  { name: 'Jeans', value: 300 },
  { name: 'Dresses', value: 300 },
  { name: 'Accessories', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const theme = useSelector((state: any) => state.theme);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setOrders([
        { id: 1, customer: 'Ahmed Mohamed', total: 1250, status: 'Processing', date: '2025-05-20' },
        { id: 2, customer: 'Sara Ahmed', total: 890, status: 'Shipped', date: '2025-05-19' },
        { id: 3, customer: 'Mohamed Ali', total: 2100, status: 'Delivered', date: '2025-05-18' },
        { id: 4, customer: 'Fatma Hussein', total: 750, status: 'Processing', date: '2025-05-17' },
      ]);
      
      setProducts([
        { id: 1, name: 'Summer T-shirt', sku: 'TS-001', stock: 45, price: 250 },
        { id: 2, name: 'Slim Fit Jeans', sku: 'JN-002', stock: 32, price: 450 },
        { id: 3, name: 'Floral Dress', sku: 'DR-003', stock: 18, price: 650 },
        { id: 4, name: 'Leather Belt', sku: 'AC-004', stock: 56, price: 150 },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <h2 className="text-2xl font-bold mb-4">{t('admin.dashboard.salesOverview')}</h2>
        <div className="bg-card rounded-lg shadow-md p-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke={theme.mode === 'dark' ? '#8884d8' : '#8884d8'} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-md p-4">
        <h3 className="text-xl font-bold mb-4">{t('admin.dashboard.productCategories')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={productData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {productData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-md p-4">
        <h3 className="text-xl font-bold mb-4">{t('admin.dashboard.recentOrders')}</h3>
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">{t('admin.orders.id')}</th>
                  <th className="px-4 py-2">{t('admin.orders.customer')}</th>
                  <th className="px-4 py-2">{t('admin.orders.total')}</th>
                  <th className="px-4 py-2">{t('admin.orders.status')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 3).map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2">#{order.id}</td>
                    <td className="px-4 py-2">{order.customer}</td>
                    <td className="px-4 py-2">EGP {order.total}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg shadow-md p-4">
        <h3 className="text-xl font-bold mb-4">{t('admin.dashboard.lowStock')}</h3>
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">{t('admin.products.name')}</th>
                  <th className="px-4 py-2">{t('admin.products.sku')}</th>
                  <th className="px-4 py-2">{t('admin.products.stock')}</th>
                </tr>
              </thead>
              <tbody>
                {products.filter(p => p.stock < 20).map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.sku}</td>
                    <td className="px-4 py-2">
                      <span className="text-red-500 font-medium">{product.stock}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('admin.products.title')}</h2>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
          {t('admin.products.addNew')}
        </button>
      </div>
      
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">{t('admin.products.name')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.products.sku')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.products.stock')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.products.price')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.products.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-t border-border">
                    <td className="px-4 py-3">{product.name}</td>
                    <td className="px-4 py-3">{product.sku}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3">EGP {product.price}</td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700">
                          {t('common.edit')}
                        </button>
                        <button className="text-red-500 hover:text-red-700">
                          {t('common.delete')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('admin.orders.title')}</h2>
      
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">{t('admin.orders.id')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.orders.customer')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.orders.date')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.orders.total')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.orders.status')}</th>
                  <th className="px-4 py-3 text-left">{t('admin.orders.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-border">
                    <td className="px-4 py-3">#{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3">{order.date}</td>
                    <td className="px-4 py-3">EGP {order.total}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                        order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700">
                          {t('common.view')}
                        </button>
                        <button className="text-green-500 hover:text-green-700">
                          {t('admin.orders.process')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettings = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('admin.settings.title')}</h2>
      
      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-4">{t('admin.settings.storeDetails')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.settings.storeName')}</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-border rounded-md" 
                  defaultValue="Fashion Store"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.settings.storeEmail')}</label>
                <input 
                  type="email" 
                  className="w-full px-3 py-2 border border-border rounded-md" 
                  defaultValue="contact@fashionstore.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.settings.storePhone')}</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-border rounded-md" 
                  defaultValue="+20 123 456 7890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.settings.storeAddress')}</label>
                <textarea 
                  className="w-full px-3 py-2 border border-border rounded-md" 
                  rows={3}
                  defaultValue="123 Main Street, Cairo, Egypt"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">{t('admin.settings.appearance')}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.settings.theme')}</label>
                <select className="w-full px-3 py-2 border border-border rounded-md">
                  <option value="default">Default</option>
                  <option value="modern">Modern</option>
                  <option value="classic">Classic</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.settings.primaryColor')}</label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="color" 
                    className="w-10 h-10 border border-border rounded-md" 
                    defaultValue="#3B82F6"
                  />
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 border border-border rounded-md" 
                    defaultValue="#3B82F6"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t('admin.settings.logo')}</label>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center">
                    <span className="text-2xl">F</span>
                  </div>
                  <button className="px-3 py-2 border border-border rounded-md">
                    {t('admin.settings.changeLogo')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-border">
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            {t('admin.settings.saveChanges')}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <nav className="flex flex-col">
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                {t('admin.nav.dashboard')}
              </button>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'products' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('products')}
              >
                {t('admin.nav.products')}
              </button>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'orders' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('orders')}
              >
                {t('admin.nav.orders')}
              </button>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'customers' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('customers')}
              >
                {t('admin.nav.customers')}
              </button>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'marketing' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('marketing')}
              >
                {t('admin.nav.marketing')}
              </button>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'staff' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('staff')}
              >
                {t('admin.nav.staff')}
              </button>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('settings')}
              >
                {t('admin.nav.settings')}
              </button>
            </nav>
          </div>
        </div>
        
        <div className="flex-1">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'settings' && renderSettings()}
          {(activeTab === 'customers' || activeTab === 'marketing' || activeTab === 'staff') && (
            <div className="bg-card rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">{t(`admin.nav.${activeTab}`)}</h2>
              <p>{t('admin.comingSoon')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
