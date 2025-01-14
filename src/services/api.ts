  import axios from 'axios';
  import { UserCredentials, AuthResponse } from '../types';

  const api = axios.create({
    baseURL: 'https://stockscope-production.up.railway.app/api', // Updated to use proxy
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor for JWT token
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Add response interceptor for error handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  export const authApi = {
    login: async (credentials: UserCredentials): Promise<AuthResponse> => {
      try {
        
        
        const response = await api.post('/auth/login', credentials);
        return response.data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    signup: async (credentials: UserCredentials): Promise<AuthResponse> => {
      try {
        const response = await api.post('/auth/signup', credentials);
        return response.data;
      } catch (error) {
        console.error('Signup error:', error);
        throw error;
      }
    },

    logout: async (): Promise<void> => {
      try {
        await api.post('/auth/logout');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (error) {
        console.error('Logout error:', error);
        throw error;
      }
    },
  };