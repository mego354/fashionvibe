import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loginUser } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // @ts-ignore
  const { loading, error, isAuthenticated, user } = useSelector((state: any) => state.auth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      // Redirect based on user role
      if (user?.role === 'super_admin') {
        navigate('/super-admin');
      } else if (user?.role === 'store_admin') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    }
  }, [isAuthenticated, user, navigate]);
  
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      // @ts-ignore
      await dispatch(loginUser(formData)).unwrap();
      // Navigation will happen in the useEffect above
    } catch (err) {
      // Error is handled by the reducer
      console.error('Login failed:', err);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('auth.login')}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {typeof error === 'string' ? error : t('auth.loginFailed')}
          </div>
        )}
        
        <div className="bg-card rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                {t('auth.email')}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-md"
                placeholder={t('auth.emailPlaceholder')}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                {t('auth.password')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-md"
                placeholder={t('auth.passwordPlaceholder')}
              />
              <div className="mt-1 text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              {loading ? t('common.loading') : t('auth.loginButton')}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p>
              {t('auth.noAccount')}{' '}
              <Link to="/register" className="text-primary hover:underline">
                {t('auth.registerNow')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
