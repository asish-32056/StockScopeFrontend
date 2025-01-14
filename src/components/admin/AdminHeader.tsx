import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  Settings, 
  LogOut, 
  User,
  ChevronDown 
} from 'lucide-react';
import { Button } from '../ui/button';

export const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
            </Button>

            <div className="relative">
              <Button
                variant="ghost"
                className="flex items-center gap-2"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <User className="h-5 w-5" />
                <span>{user?.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start px-4 py-2 text-sm text-red-600"
                    onClick={logout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};