import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { registerUser, resetRegistrationSuccess } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // @ts-ignore
  const { loading, error, registrationSuccess } = useSelector((state: any) => state.auth);
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    accept_terms: false,
  });
  
  const [passwordError, setPasswordError] = useState('');
  
  // Redirect if registration successful
  React.useEffect(() => {
    if (registrationSuccess) {
      // Reset the registration success flag
      dispatch(resetRegistrationSuccess());
      // Redirect to login with success message
      navigate('/login', { state: { message: t('auth.registrationSuccess') } });
    }
  }, [registrationSuccess, navigate, dispatch, t]);
  
  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    // Clear password error when user types
    if (name === 'password' || name === 'confirm_password') {
      setPasswordError('');
    }
  };
  
  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirm_password) {
      setPasswordError(t('auth.passwordsDoNotMatch'));
      return false;
    }
    
    // Check password strength
    if (formData.password.length < 8) {
      setPasswordError(t('auth.passwordTooShort'));
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Remove confirm_password from data sent to API
    const { confirm_password, ...registrationData } = formData;
    
    try {
      // @ts-ignore
      await dispatch(registerUser(registrationData)).unwrap();
      // Redirect will happen in the useEffect above
    } catch (err) {
      // Error is handled by the reducer
      console.error('Registration failed:', err);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('auth.register')}</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {typeof error === 'string' ? error : t('auth.registrationFailed')}
          </div>
        )}
        
        <div className="bg-card rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium mb-1">
                  {t('auth.firstName')}
                </label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder={t('auth.firstNamePlaceholder')}
                />
              </div>
              
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium mb-1">
                  {t('auth.lastName')}
                </label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-border rounded-md"
                  placeholder={t('auth.lastNamePlaceholder')}
                />
              </div>
            </div>
            
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
            
            <div className="mb-4">
              <label htmlFor="phone_number" className="block text-sm font-medium mb-1">
                {t('auth.phoneNumber')}
              </label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-md"
                placeholder={t('auth.phoneNumberPlaceholder')}
              />
            </div>
            
            <div className="mb-4">
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
            </div>
            
            <div className="mb-4">
              <label htmlFor="confirm_password" className="block text-sm font-medium mb-1">
                {t('auth.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirm_password"
                name="confirm_password"
                value={formData.confirm_password}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-border rounded-md"
                placeholder={t('auth.confirmPasswordPlaceholder')}
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600">{passwordError}</p>
              )}
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="accept_terms"
                  name="accept_terms"
                  checked={formData.accept_terms}
                  onChange={handleChange}
                  required
                  className="h-4 w-4 text-primary border-border rounded"
                />
                <label htmlFor="accept_terms" className="ml-2 block text-sm">
                  {t('auth.acceptTerms')}{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    {t('auth.termsAndConditions')}
                  </Link>
                </label>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              {loading ? t('common.loading') : t('auth.registerButton')}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p>
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline">
                {t('auth.loginHere')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
