import React from 'react';

interface StatsCardProps {
    title: string;
    value: number;
    growth?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, growth }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {title}
            </h3>
            <p className="mt-2 text-3xl font-semibold">
                {value.toLocaleString()}
            </p>
            {growth && (
                <p className={`mt-2 text-sm ${
                    parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                    {parseFloat(growth) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(growth))}%
                </p>
            )}
        </div>
    );
}; 