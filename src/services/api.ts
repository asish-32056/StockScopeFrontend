import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { toast } from 'react-hot-toast';
import { 
  UserCredentials, 
  AuthResponse, 
  User, 
  DashboardStats, 
  AdminResponse 
} from '../types';

// Create custom error class for API errors
class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

const api: AxiosInstance = axios.create({
  baseURL: 'https://stockscope-production.up.railway.app/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        headers: config.headers,
        data: config.data
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(new APIError(error.message));
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('API Response:', {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  (error: AxiosError) => {
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    let errorMessage = 'An unexpected error occurred';
    let errorStatus = error.response?.status;

    if (error.response?.data && typeof error.response.data === 'object') {
      const errorData = error.response.data as any;
      errorMessage = errorData.message || errorMessage;
    } else if (error.message === 'Network Error') {
      errorMessage = 'Unable to connect to server';
    }

    // Handle specific status codes
    switch (errorStatus) {
      case 401:
        localStorage.clear();
        window.location.href = '/login';
        errorMessage = 'Session expired. Please login again.';
        break;
      case 403:
        errorMessage = 'Access denied';
        break;
      case 404:
        errorMessage = 'Resource not found';
        break;
      case 422:
        errorMessage = 'Invalid data provided';
        break;
      case 429:
        errorMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        errorMessage = 'Server error. Please try again later.';
        break;
    }

    toast.error(errorMessage);
    return Promise.reject(new APIError(errorMessage, errorStatus));
  }
);

// Auth API endpoints
export const authApi = {
  login: async (credentials: UserCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Login failed');
    }
  },

  signup: async (userData: UserCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post<AuthResponse>('/auth/signup', userData);
      return response.data;
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError('Signup failed');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with logout even if API call fails
    }
  },

  verifyToken: async (): Promise<{ valid: boolean; user?: User }> => {
    try {
      const response = await api.get<AdminResponse<User>>('/auth/verify');
      return { valid: true, user: response.data.data };
    } catch (error) {
      return { valid: false };
    }
  }
};

// Admin API endpoints
export const adminApi = {
  getDashboardStats: async (): Promise<AdminResponse<DashboardStats>> => {
    const response = await api.get<AdminResponse<DashboardStats>>('/admin/dashboard/stats');
    return response.data;
  },

  getUsers: async (
    page = 1, 
    limit = 10, 
    search = ''
  ): Promise<AdminResponse<User[]>> => {
    const response = await api.get<AdminResponse<User[]>>('/admin/users', {
      params: { page, limit, search }
    });
    return response.data;
  },

  updateUser: async (
    userId: string, 
    userData: Partial<User>
  ): Promise<AdminResponse<User>> => {
    const response = await api.put<AdminResponse<User>>(
      `/admin/users/${userId}`, 
      userData
    );
    return response.data;
  },

  deleteUser: async (userId: string): Promise<AdminResponse<void>> => {
    const response = await api.delete<AdminResponse<void>>(`/admin/users/${userId}`);
    return response.data;
  }
};

export default api;