import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';

// Protected route component for role-based access control
const ProtectedRoute = ({ 
  children, 
  isAuthenticated, 
  requiredRole = null, 
  userRole = null 
}) => {
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // If role check is required and user doesn't have the required role
  if (requiredRole && userRole !== requiredRole) {
    // Redirect based on user role
    if (userRole === 'super_admin') {
      return <Navigate to="/super-admin" replace />;
    } else if (userRole === 'store_admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/account" replace />;
    }
  }
  
  // If all checks pass, render the protected component
  return children;
};

export default ProtectedRoute;
