import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/api';
import Loading from './ui/loading';
import { toast } from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requireAdmin?: boolean;
  requireVerified?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles = [],
  requireAdmin = false,
  requireVerified = false
}) => {
  const { user, isLoading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Skip verification if no user
        if (!user) {
          setIsVerifying(false);
          return;
        }

        // Verify token with backend
        const { valid } = await authApi.verifyToken();
        
        if (!valid) {
          toast.error('Session invalid. Please login again.');
          await logout();
          navigate('/login', { state: { from: location }, replace: true });
          return;
        }

        // Check token expiration
        const token = localStorage.getItem('token');
        if (token) {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          const expirationTime = tokenData.exp * 1000;
          const currentTime = Date.now();
          
          // Warning for expiring soon (5 minutes)
          if (expirationTime - currentTime < 300000) {
           // Instead of toast.warning, use:
toast('Session expiring soon. Please save your work.', {
  icon: '⚠️',
  duration: 4000
});
          }
          
          // Expired
          if (expirationTime < currentTime) {
            toast.error('Session expired. Please login again.');
            await logout();
            navigate('/login', { state: { from: location }, replace: true });
            return;
          }
        }

      } catch (error) {
        console.error('Session verification error:', error);
        toast.error('Error verifying session');
        await logout();
      } finally {
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [user, logout, navigate, location]);

  // Show loading state while checking auth
  if (isLoading || isVerifying) {
    return <Loading />;
  }

  // Redirect to login if not authenticated
  if (!user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location, message: 'Please login to continue' }} 
        replace 
      />
    );
  }

  // Check for required admin role
  if (requireAdmin && user.role !== 'ADMIN') {
    toast.error('Access denied: Admin privileges required');
    return <Navigate to="/dashboard" replace />;
  }

  // Check for allowed roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    toast.error('Access denied: Insufficient privileges');
    return <Navigate 
      to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} 
      replace 
    />;
  }

  // Check for verified requirement
  if (requireVerified && user.status !== 'active') {
    toast.error('Please verify your account to access this page');
    return <Navigate to="/verify" replace />;
  }

  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;