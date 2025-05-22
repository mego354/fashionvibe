import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// Mock data - would be replaced with actual API calls
const platformData = [
  { name: 'Jan', revenue: 120000, stores: 45 },
  { name: 'Feb', revenue: 135000, stores: 48 },
  { name: 'Mar', revenue: 162000, stores: 52 },
  { name: 'Apr', revenue: 180000, stores: 55 },
  { name: 'May', revenue: 195000, stores: 58 },
  { name: 'Jun', revenue: 210000, stores: 62 },
  { name: 'Jul', revenue: 225000, stores: 65 },
];

const subscriptionData = [
  { name: 'Basic', value: 35 },
  { name: 'Standard', value: 45 },
  { name: 'Premium', value: 20 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const SuperAdminDashboard = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard');
  const theme = useSelector((state: any) => state.theme);
  const [stores, setStores] = useState<any[]>([]);
  const [settlements, setSettlements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API calls
    setTimeout(() => {
      setStores([
        { id: 1, name: 'Fashion Elite', owner: 'Ahmed Mohamed', subscription: 'Premium', revenue: 45000, status: 'Active' },
        { id: 2, name: 'Cairo Styles', owner: 'Sara Ahmed', subscription: 'Standard', revenue: 28000, status: 'Active' },
        { id: 3, name: 'Alexandria Trends', owner: 'Mohamed Ali', subscription: 'Basic', revenue: 12000, status: 'Active' },
        { id: 4, name: 'Nile Fashion', owner: 'Fatma Hussein', subscription: 'Standard', revenue: 32000, status: 'Active' },
        { id: 5, name: 'Egyptian Couture', owner: 'Khaled Mahmoud', subscription: 'Premium', revenue: 52000, status: 'Active' },
      ]);
      
      setSettlements([
        { id: 1, store: 'Fashion Elite', amount: 38250, fee: 6750, date: '2025-05-15', status: 'Completed' },
        { id: 2, name: 'Cairo Styles', amount: 23800, fee: 4200, date: '2025-05-15', status: 'Completed' },
        { id: 3, name: 'Alexandria Trends', amount: 10200, fee: 1800, date: '2025-05-15', status: 'Pending' },
        { id: 4, name: 'Nile Fashion', amount: 27200, fee: 4800, date: '2025-05-15', status: 'Processing' },
      ]);
      
      setLoading(false);
    }, 1000);
  }, []);

  const renderDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <h2 className="text-2xl font-bold mb-4">{t('superAdmin.dashboard.platformOverview')}</h2>
        <div className="bg-card rounded-lg shadow-md p-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="revenue" 
                stroke={theme.mode === 'dark' ? '#8884d8' : '#8884d8'} 
                activeDot={{ r: 8 }} 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="stores" 
                stroke={theme.mode === 'dark' ? '#82ca9d' : '#82ca9d'} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-md p-4">
        <h3 className="text-xl font-bold mb-4">{t('superAdmin.dashboard.subscriptionDistribution')}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={subscriptionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {subscriptionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-md p-4">
        <h3 className="text-xl font-bold mb-4">{t('superAdmin.dashboard.topPerformingStores')}</h3>
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">{t('superAdmin.stores.name')}</th>
                  <th className="px-4 py-2">{t('superAdmin.stores.subscription')}</th>
                  <th className="px-4 py-2">{t('superAdmin.stores.revenue')}</th>
                </tr>
              </thead>
              <tbody>
                {stores.sort((a, b) => b.revenue - a.revenue).slice(0, 3).map((store) => (
                  <tr key={store.id}>
                    <td className="px-4 py-2">{store.name}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        store.subscription === 'Premium' ? 'bg-purple-100 text-purple-800' :
                        store.subscription === 'Standard' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {store.subscription}
                      </span>
                    </td>
                    <td className="px-4 py-2">EGP {store.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-card rounded-lg shadow-md p-4">
        <h3 className="text-xl font-bold mb-4">{t('superAdmin.dashboard.recentSettlements')}</h3>
        {loading ? (
          <p>{t('common.loading')}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">{t('superAdmin.settlements.id')}</th>
                  <th className="px-4 py-2">{t('superAdmin.settlements.amount')}</th>
                  <th className="px-4 py-2">{t('superAdmin.settlements.status')}</th>
                </tr>
              </thead>
              <tbody>
                {settlements.slice(0, 3).map((settlement) => (
                  <tr key={settlement.id}>
                    <td className="px-4 py-2">#{settlement.id}</td>
                    <td className="px-4 py-2">EGP {settlement.amount.toLocaleString()}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        settlement.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        settlement.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {settlement.status}
                      </span>
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

  const renderStores = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('superAdmin.stores.title')}</h2>
        <div className="flex space-x-2">
          <input 
            type="text" 
            placeholder={t('superAdmin.stores.search')}
            className="px-3 py-2 border border-border rounded-md"
          />
          <select className="px-3 py-2 border border-border rounded-md">
            <option value="all">{t('superAdmin.stores.allSubscriptions')}</option>
            <option value="basic">{t('superAdmin.stores.basic')}</option>
            <option value="standard">{t('superAdmin.stores.standard')}</option>
            <option value="premium">{t('superAdmin.stores.premium')}</option>
          </select>
        </div>
      </div>
      
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">{t('superAdmin.stores.name')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.stores.owner')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.stores.subscription')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.stores.revenue')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.stores.status')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.stores.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr key={store.id} className="border-t border-border">
                    <td className="px-4 py-3">{store.name}</td>
                    <td className="px-4 py-3">{store.owner}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        store.subscription === 'Premium' ? 'bg-purple-100 text-purple-800' :
                        store.subscription === 'Standard' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {store.subscription}
                      </span>
                    </td>
                    <td className="px-4 py-3">EGP {store.revenue.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        store.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {store.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700">
                          {t('common.view')}
                        </button>
                        <button className="text-yellow-500 hover:text-yellow-700">
                          {t('superAdmin.stores.manage')}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-4 py-3 bg-muted flex items-center justify-between">
            <div>
              <p className="text-sm">
                {t('superAdmin.pagination.showing', { from: 1, to: stores.length, total: stores.length })}
              </p>
            </div>
            <div className="flex space-x-1">
              <button className="px-3 py-1 border border-border rounded-md bg-background">
                {t('superAdmin.pagination.previous')}
              </button>
              <button className="px-3 py-1 border border-border rounded-md bg-primary text-primary-foreground">
                1
              </button>
              <button className="px-3 py-1 border border-border rounded-md bg-background">
                {t('superAdmin.pagination.next')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSettlements = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('superAdmin.settlements.title')}</h2>
      
      <div className="bg-card rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">{t('superAdmin.settlements.generateNew')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('superAdmin.settlements.period')}</label>
            <select className="w-full px-3 py-2 border border-border rounded-md">
              <option value="may2025">{t('superAdmin.settlements.may2025')}</option>
              <option value="apr2025">{t('superAdmin.settlements.apr2025')}</option>
              <option value="mar2025">{t('superAdmin.settlements.mar2025')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t('superAdmin.settlements.storeFilter')}</label>
            <select className="w-full px-3 py-2 border border-border rounded-md">
              <option value="all">{t('superAdmin.settlements.allStores')}</option>
              {stores.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
              {t('superAdmin.settlements.generate')}
            </button>
          </div>
        </div>
      </div>
      
      {loading ? (
        <p>{t('common.loading')}</p>
      ) : (
        <div className="bg-card rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left">{t('superAdmin.settlements.id')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.settlements.store')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.settlements.date')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.settlements.amount')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.settlements.fee')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.settlements.status')}</th>
                  <th className="px-4 py-3 text-left">{t('superAdmin.settlements.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {settlements.map((settlement) => (
                  <tr key={settlement.id} className="border-t border-border">
                    <td className="px-4 py-3">#{settlement.id}</td>
                    <td className="px-4 py-3">{settlement.store}</td>
                    <td className="px-4 py-3">{settlement.date}</td>
                    <td className="px-4 py-3">EGP {settlement.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">EGP {settlement.fee.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        settlement.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        settlement.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {settlement.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700">
                          {t('common.view')}
                        </button>
                        <button className="text-green-500 hover:text-green-700">
                          {t('superAdmin.settlements.process')}
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

  const renderAnalytics = () => (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('superAdmin.analytics.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-muted-foreground">{t('superAdmin.analytics.totalRevenue')}</h3>
          <p className="text-3xl font-bold mt-2">EGP 1,250,000</p>
          <p className="text-sm text-green-500 mt-1">+12.5% {t('superAdmin.analytics.fromLastMonth')}</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-muted-foreground">{t('superAdmin.analytics.activeStores')}</h3>
          <p className="text-3xl font-bold mt-2">65</p>
          <p className="text-sm text-green-500 mt-1">+5 {t('superAdmin.analytics.fromLastMonth')}</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-muted-foreground">{t('superAdmin.analytics.platformFees')}</h3>
          <p className="text-3xl font-bold mt-2">EGP 187,500</p>
          <p className="text-sm text-green-500 mt-1">+12.5% {t('superAdmin.analytics.fromLastMonth')}</p>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">{t('superAdmin.analytics.revenueBySubscription')}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { name: 'Basic', value: 125000 },
              { name: 'Standard', value: 450000 },
              { name: 'Premium', value: 675000 },
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name={t('superAdmin.analytics.revenue')} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-card rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">{t('superAdmin.analytics.storeGrowth')}</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="stores" 
                name={t('superAdmin.analytics.storeCount')}
                stroke="#82ca9d" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('superAdmin.title')}</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-card rounded-lg shadow-md overflow-hidden">
            <nav className="flex flex-col">
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'dashboard' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('dashboard')}
              >
                {t('superAdmin.nav.dashboard')}
              </button>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'stores' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('stores')}
              >
                {t('superAdmin.nav.stores')}
              </button>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'settlements' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('settlements')}
              >
                {t('superAdmin.nav.settlements')}
              </button>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'analytics' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('analytics')}
              >
                {t('superAdmin.nav.analytics')}
              </button>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'settings' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                onClick={() => setActiveTab('settings')}
              >
                {t('superAdmin.nav.settings')}
              </button>
            </nav>
          </div>
        </div>
        
        <div className="flex-1">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'stores' && renderStores()}
          {activeTab === 'settlements' && renderSettlements()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'settings' && (
            <div className="bg-card rounded-lg shadow-md p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">{t('superAdmin.nav.settings')}</h2>
              <p>{t('superAdmin.comingSoon')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
