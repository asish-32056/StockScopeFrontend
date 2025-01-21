import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { adminApi } from '../../services/api';
import { DashboardStats } from '../../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const response = await adminApi.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        toast.error('Failed to load analytics data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6">
        <Card className="p-6">
          <p className="text-gray-500">No analytics data available</p>
        </Card>
      </div>
    );
  }

  const chartData = [
    {
      name: 'Current Period',
      total: stats.totalUsers,
      active: stats.activeUsers,
      new: stats.newUsers,
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Overview</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">User Statistics</h2>
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#8884d8" 
                  name="Total Users"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="active" 
                  stroke="#82ca9d" 
                  name="Active Users"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="new" 
                  stroke="#ffc658" 
                  name="New Users"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-medium mb-4">Growth Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">User Growth Rate</p>
              <p className={`text-2xl font-bold ${
                parseFloat(stats.userGrowth) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(stats.userGrowth) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(stats.userGrowth))}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Active User Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;