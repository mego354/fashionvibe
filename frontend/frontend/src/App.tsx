import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Components
import Header from './components/header';
import Footer from './components/footer';
import ThemeProvider from './components/theme-provider';

// Pages
import HomePage from './pages/home-page';
import ProductDetailPage from './pages/product-detail-page';
import CategoryPage from './pages/category-page';
import CartPage from './pages/cart-page';
import CheckoutPage from './pages/checkout-page';
import AccountPage from './pages/account-page';
import AdminDashboard from './pages/admin-dashboard';
import SuperAdminDashboard from './pages/super-admin-dashboard';
import LoginPage from './pages/login-page';
import RegisterPage from './pages/register-page';
import NotFoundPage from './pages/not-found-page';
import AboutPage from './pages/about-page';
import ContactPage from './pages/contact-page';
import PlansPage from './pages/plans-page';
import HowToUsePage from './pages/how-to-use-page';
import HowToSubscribePage from './pages/how-to-subscribe-page';
import StorefrontPage from './pages/storefront-page';

// Auth
import { authAPI } from './services/api';
import { setUser, clearUser } from './store/authSlice';
import ProtectedRoute from './components/protected-route';

// Create a PageLayout component to wrap the pages - using a different name to avoid conflicts
const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

const App = () => {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  // @ts-ignore
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  // @ts-ignore
  const { direction } = useSelector((state: any) => state.theme);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getProfile()
        .then(response => {
          dispatch(setUser(response.data));
        })
        .catch(error => {
          console.error('Authentication error:', error);
          localStorage.removeItem('token');
          dispatch(clearUser());
        });
    }
  }, [dispatch]);

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = direction;
  }, [direction]);

  // Wrapper for applying layout to routes
  const withLayout = (Component) => (
    <PageLayout>
      <Component />
    </PageLayout>
  );

  return (
    <ThemeProvider userRole={user?.role}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:productId" element={withLayout(ProductDetailPage)} />
        <Route path="/category/:categoryId" element={withLayout(CategoryPage)} />
        <Route path="/cart" element={withLayout(CartPage)} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/about" element={withLayout(AboutPage)} />
        <Route path="/contact" element={withLayout(ContactPage)} />
        <Route path="/plans" element={withLayout(PlansPage)} />
        <Route path="/how-to-use" element={withLayout(HowToUsePage)} />
        <Route path="/how-to-subscribe" element={withLayout(HowToSubscribePage)} />
        <Route path="/store/:storeId" element={<StorefrontPage />} />
        
        {/* Protected routes */}
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {withLayout(CheckoutPage)}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/account/*" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              {withLayout(AccountPage)}
            </ProtectedRoute>
          } 
        />
        {/* Store admin routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              requiredRole="store_admin"
              userRole={user?.role}
            >
              {withLayout(AdminDashboard)}
            </ProtectedRoute>
          } 
        />
        {/* Super admin routes */}
        <Route 
          path="/super-admin/*" 
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              requiredRole="super_admin"
              userRole={user?.role}
            >
              {withLayout(SuperAdminDashboard)}
            </ProtectedRoute>
          } 
        />
        {/* 404 route */}
        <Route path="*" element={withLayout(NotFoundPage)} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
