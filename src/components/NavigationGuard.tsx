import React, { useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

interface NavigationGuardProps {
  children: React.ReactNode;
}

const NavigationGuard: React.FC<NavigationGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // List of public routes that don't require authentication
  const publicRoutes = ['/login', '/signup', '/'];

  useEffect(() => {
    const checkSession = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          if (tokenData.exp * 1000 < Date.now()) {
            localStorage.clear();
            toast.error('Session expired. Please login again.');
            navigate('/login');
          }
        } catch (error) {
          localStorage.clear();
          toast.error('Invalid session. Please login again.');
          navigate('/login');
        }
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [navigate]);

  // Prevent back navigation to auth pages when logged in
  useEffect(() => {
    const handlePopState = () => {
      if (user && publicRoutes.includes(location.pathname)) {
        navigate(user.role === 'ADMIN' ? '/admin' : '/dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [user, location, navigate]);

  // If user is authenticated and tries to access public routes
  if (user && publicRoutes.includes(location.pathname)) {
    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
  }

  // If user is not authenticated and tries to access protected routes
  if (!user && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default NavigationGuard;