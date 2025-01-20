import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import Loading from '../components/ui/loading';
import { toast } from 'react-hot-toast';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Verify token expiration
          const tokenData = JSON.parse(atob(token.split('.')[1]));
          if (tokenData.exp * 1000 < Date.now()) {
            throw new Error('Session expired');
          }
          
          // Verify token with backend
          const { valid, user: verifiedUser } = await authApi.verifyToken();
          if (!valid) {
            throw new Error('Invalid session');
          }
          
          setUser(verifiedUser || JSON.parse(storedUser));
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        localStorage.clear();
        setError(error.message || 'Session expired. Please login again.');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Add loading timeout
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError('Loading timeout - please refresh');
      }
    }, 10000);

    return () => clearTimeout(loadingTimeout);
  }, [navigate]);

  const login = async (token: string, userData: User) => {
    try {
      // Validate token format
      if (!token || typeof token !== 'string' || !token.includes('.')) {
        throw new Error('Invalid token format');
      }

      // Validate user data
      if (!userData || !userData.id || !userData.email || !userData.role) {
        throw new Error('Invalid user data');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setError(null);

      // Navigate based on role
      const targetPath = userData.role === 'ADMIN' ? '/admin' : '/dashboard';
      navigate(targetPath, { replace: true });
      
      toast.success('Successfully logged in!');
    } catch (error: any) {
      console.error('Login error:', error);
      setError('Failed to process login');
      localStorage.clear();
      toast.error(error.message || 'Login failed');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      localStorage.clear();
      setUser(null);
      setError(null);
      navigate('/login');
      toast.success('Successfully logged out');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};