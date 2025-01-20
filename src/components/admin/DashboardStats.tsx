import React from 'react';
import { Users, UserPlus, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StatsCardProps {
  title: string;
  value: number | string;
  change?: string;
  icon: React.ElementType;
  isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  isLoading = false 
}) => (
  <div className={cn(
    "bg-white rounded-lg p-6 shadow-sm transition-opacity",
    isLoading && "animate-pulse opacity-70"
  )}>
    <div className="flex items-center justify-between">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="h-5 w-5 text-blue-500" />
    </div>
    <p className="mt-2 text-3xl font-semibold text-gray-900">
      {isLoading ? '-' : value}
    </p>
    {change && !isLoading && (
      <p className={cn(
        "mt-2 text-sm",
        parseFloat(change) >= 0 ? "text-green-600" : "text-red-600"
      )}>
        {parseFloat(change) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(change))}%
      </p>
    )}
  </div>
);

interface DashboardStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
    userGrowth: string;
  };
  isLoading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  stats, 
  isLoading = false 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        title="Total Users"
        value={stats.totalUsers}
        icon={Users}
        isLoading={isLoading}
      />
      <StatsCard
        title="Active Users"
        value={stats.activeUsers}
        icon={Activity}
        isLoading={isLoading}
      />
      <StatsCard
        title="New Users"
        value={stats.newUsers}
        change={stats.userGrowth}
        icon={UserPlus}
        isLoading={isLoading}
      />
    </div>
  );
};