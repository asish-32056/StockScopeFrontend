import axios from 'axios';
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
});

// Request interceptor for JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add export for authApi
export const authApi = {
  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (credentials: UserCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/signup', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const adminApi = {
  // Dashboard Stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },

  // Users
  getUsers: async (): Promise<User[]> => {
    const response = await api.get('/admin/users');
    return response.data;
  },

  getUserById: async (userId: string): Promise<User> => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  createUser: async (userData: Omit<User, 'id'>): Promise<AdminResponse<User>> => {
    const response = await api.post('/admin/users', userData);
    return response.data;
  },

  updateUser: async (userId: string, userData: Partial<User>): Promise<AdminResponse<User>> => {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  deleteUser: async (userId: string): Promise<AdminResponse> => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  // Analytics
  getAnalytics: async () => {
    const response = await api.get('/admin/analytics');
    return response.data;
  }
};

export default api;