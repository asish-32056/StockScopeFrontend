import React, { useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
    const handlePopState = (event: PopStateEvent) => {
      if (['/login', '/signup'].includes(location.pathname)) {
        navigate('/');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate, location]);

  // If user is authenticated and tries to access public routes
  if (user && publicRoutes.includes(location.pathname)) {
    return <Navigate to="/user-dashboard" replace />;
  }

  // If user is not authenticated and tries to access protected routes
  if (!user && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default NavigationGuard;