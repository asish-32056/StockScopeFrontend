import axios, { AxiosError } from 'axios';
import { toast } from 'react-hot-toast';
import { 
  UserCredentials, 
  AuthResponse, 
  User, 
  DashboardStats, 
  AdminResponse 
} from '../types';

const api = axios.create({
  baseURL: 'https://stockscope-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (!error.response) {
      toast.error('Network error - please check your connection');
    } else {
      toast.error(
        (error.response?.data as { message?: string })?.message || 'An unexpected error occurred'
      );
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authApi = {
  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  signup: async (userData: UserCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      throw error;
    }
  }
};

// Admin API endpoints
export const adminApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUsers: async (page = 1, limit = 10, search = ''): Promise<AdminResponse<User[]>> => {
    try {
      const response = await api.get('/admin/users', {
        params: { page, limit, search }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userId: string, userData: Partial<User>): Promise<AdminResponse<User>> => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId: string): Promise<AdminResponse> => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;