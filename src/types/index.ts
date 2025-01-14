export interface UserCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AdminResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}