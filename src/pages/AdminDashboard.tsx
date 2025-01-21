import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { User, DashboardStats, AdminResponse } from '../types';
import { UserTable } from '../components/admin/UserTable';
import { useErrorHandler } from '../components/hooks/userErrorHandler';
import { toast } from 'react-hot-toast';
import { Loader2, Users, TrendingUp, Activity } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

interface DashboardData {
  users: User[];
  stats: DashboardStats;
}

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const handleError = useErrorHandler();

  const fetchDashboardData = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const [usersResponse, statsResponse] = await Promise.all([
        adminApi.getUsers(),
        adminApi.getDashboardStats()
      ]);

      if (usersResponse.success && statsResponse.success) {
        setData({
          users: usersResponse.data,
          stats: statsResponse.data
        });

        if (!showLoadingState) {
          toast.success('Dashboard data refreshed');
        }
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(() => {
      fetchDashboardData(false);
    }, 5 * 60 * 1000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const handleEditUser = async (user: User) => {
    try {
      const response = await adminApi.updateUser(user.id, user);
      if (response.success) {
        await fetchDashboardData(false);
        toast.success('User updated successfully');
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    try {
      const response = await adminApi.deleteUser(userId);
      if (response.success) {
        await fetchDashboardData(false);
        toast.success('User deleted successfully');
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button
            onClick={() => fetchDashboardData(false)}
            disabled={isRefreshing}
            className="inline-flex items-center"
          >
            {isRefreshing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Refreshing...
              </>
            ) : (
              'Refresh Data'
            )}
          </Button>
        </div>

        {data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {data.stats.totalUsers}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-indigo-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Users</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {data.stats.activeUsers}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">New Users</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {data.stats.newUsers}
                    </p>
                    <p className={`text-sm ${
                      parseFloat(data.stats.userGrowth) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(data.stats.userGrowth) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(data.stats.userGrowth))}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </Card>
            </div>

            <Card>
              <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">User Management</h2>
                <UserTable
                  users={data.users}
                  onEdit={handleEditUser}
                  onDelete={handleDeleteUser}
                />
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;