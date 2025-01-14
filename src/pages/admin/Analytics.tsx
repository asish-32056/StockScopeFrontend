import React, { useEffect, useState } from 'react';
import { adminApi } from '../../services/api';
import { BarChart2, TrendingUp, Users, Activity } from 'lucide-react';

interface AnalyticsData {
  userGrowth: number;
  activeUsers: number;
  totalUsers: number;
  userActivity: {
    date: string;
    count: number;
  }[];
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await adminApi.getAnalytics();
        setData(response);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">User Growth</h3>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{data.userGrowth}%</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Active Users</h3>
            <Users className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{data.activeUsers}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Total Users</h3>
            <Activity className="h-5 w-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold mt-2">{data.totalUsers}</p>
        </div>
      </div>

      {/* Activity Chart would go here */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">User Activity</h2>
        <div className="h-64">
          {/* Implement your preferred chart library here */}
          {/* Example: Chart.js, Recharts, or any other */}
        </div>
      </div>
    </div>
  );
};

export default Analytics;