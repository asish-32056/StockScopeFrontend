import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './ui/loading';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  requireAdmin = false
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has required role
    if (user && requireAdmin && user.role !== 'ADMIN') {
      toast.error('Access denied: Admin privileges required');
      navigate('/dashboard');
    }
  }, [user, requireAdmin, navigate]);

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Handle unauthorized access
    toast.error('Access denied: Insufficient privileges');
    return <Navigate 
      to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} 
      replace 
    />;
  }

  // Check for session expiration
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (tokenData.exp * 1000 < Date.now()) {
        localStorage.clear();
        toast.error('Session expired. Please login again.');
        return <Navigate to="/login" state={{ from: location }} replace />;
      }
    } catch (error) {
      localStorage.clear();
      toast.error('Invalid session. Please login again.');
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;