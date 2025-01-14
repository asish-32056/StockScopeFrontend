import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title, icon }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {icon}
              <div>
                <h1 className="text-xl font-bold text-white">{title}</h1>
                <p className="text-sm text-gray-400">Welcome, {user?.name}</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2 text-red-500 hover:text-red-400 hover:border-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;