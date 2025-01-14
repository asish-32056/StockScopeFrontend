import React from 'react';
import { Users, UserPlus, Activity } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: string;
  icon: React.ElementType;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, change, icon: Icon }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="h-5 w-5 text-blue-500" />
    </div>
    <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    {change && <p className="mt-2 text-sm text-green-600">↑ {change}</p>}
  </div>
);

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: string;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Users"
        value={stats.totalUsers}
        icon={Users}
      />
      <StatsCard
        title="Active Users"
        value={stats.activeUsers}
        icon={Activity}
      />
      <StatsCard
        title="New Users"
        value={stats.newUsers}
        change={stats.userGrowth}
        icon={UserPlus}
      />
    </div>
  );
};