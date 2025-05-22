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

// Auth
import { authAPI } from './services/api';
import { setUser, clearUser } from './store/authSlice';
import ProtectedRoute from './components/protected-route';

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

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col">
        {/* <Header /> */}
        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {/* Protected routes */}
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account/*" 
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AccountPage />
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
                  <AdminDashboard />
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
                  <SuperAdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* 404 route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </ThemeProvider>
  );
};

export default App;
