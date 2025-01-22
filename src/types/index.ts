export interface UserCredentials {
  email: string;
  password: string;
  name?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt?: string;
  updatedAt?: string;
  enabled: boolean;
  emailVerified: boolean;
}

export interface DashboardStats {
  userStats: UserStats;
  systemStats: SystemStats;
  recentActivities: RecentActivity[];
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: string;
}

export interface SystemStats {
  cpuUsage: string;
  memoryUsage: string;
  diskSpace: string;
  healthy: boolean;
}

export interface RecentActivity {
  userId: string;
  action: string;
  description: string;
  timestamp: string;
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