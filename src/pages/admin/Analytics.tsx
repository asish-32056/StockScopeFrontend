import React, { useState, useEffect } from 'react';
import { adminApi } from '../../services/api';
import { useErrorHandler } from '../../components/hooks/userErrorHandler';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/button';
import { Loader2, Users, Activity, TrendingUp, BarChart2 } from 'lucide-react';

interface AnalyticsData {
  userStats: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  activityStats: {
    date: string;
    logins: number;
    actions: number;
  }[];
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const handleError = useErrorHandler();

  const fetchAnalytics = async (showLoadingState = true) => {
    try {
      if (showLoadingState) {
        setIsLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const response = await adminApi.getAnalytics();
      setData(response);

      if (!showLoadingState) {
        toast.success('Analytics data refreshed');
      }
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

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
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <div className="flex items-center space-x-4">
            <div className="flex rounded-md shadow-sm">
              {(['day', 'week', 'month'] as const).map((range) => (
                <Button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  variant={timeRange === range ? 'default' : 'outline'}
                  className="capitalize"
                >
                  {range}
                </Button>
              ))}
            </div>
            <Button
              onClick={() => fetchAnalytics(false)}
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
        </div>

        {data && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {data.userStats.total}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-indigo-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Users</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {data.userStats.active}
                    </p>
                  </div>
                  <Activity className="h-8 w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">New Users</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                      {data.userStats.new}
                    </p>
                    <p className={`text-sm ${
                      data.userStats.growth >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {data.userStats.growth >= 0 ? '↑' : '↓'} {Math.abs(data.userStats.growth)}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Activity Overview</h2>
              <div className="space-y-4">
                {data.activityStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{stat.date}</span>
                    <div className="flex items-center space-x-6">
                      <span className="text-sm">
                        {stat.logins} logins
                      </span>
                      <span className="text-sm">
                        {stat.actions} actions
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;