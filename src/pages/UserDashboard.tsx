import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import {
  BarChart,
  PieChart,
  TrendingUp,
  DollarSign,
  Settings,
  Bell,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  LogOut
} from 'lucide-react';

const UserDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const portfolioStats = [
    { label: 'Total Value', value: '$125,000', change: '+2.5%', isPositive: true },
    { label: 'Day Change', value: '$1,250', change: '+1.2%', isPositive: true },
    { label: 'Total Gain', value: '$25,000', change: '+25%', isPositive: true },
    { label: 'Cash Balance', value: '$10,000', change: '8% of portfolio', isPositive: true }
  ];

  const recentTransactions = [
    { symbol: 'AAPL', type: 'BUY', amount: 10, price: 150.25, date: '2024-01-15' },
    { symbol: 'GOOGL', type: 'SELL', amount: 5, price: 2750.50, date: '2024-01-14' },
    { symbol: 'MSFT', type: 'BUY', amount: 15, price: 310.75, date: '2024-01-13' }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo and Mobile Menu Button */}
            <div className="flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-500" />
                <span className="ml-2 text-xl font-bold text-white">StockScope</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex lg:space-x-8">
              <Button variant="ghost" className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Portfolio
              </Button>
              <Button variant="ghost" className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Analytics
              </Button>
              <Button variant="ghost" className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Transactions
              </Button>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
              </Button>
              
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  <span className="hidden md:block">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-sm"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Button>
                      <Button
                        variant="ghost"
                        className="w-full justify-start px-4 py-2 text-sm text-red-400 hover:text-red-300"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <BarChart className="h-5 w-5 mr-2" />
              Portfolio
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <PieChart className="h-5 w-5 mr-2" />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <DollarSign className="h-5 w-5 mr-2" />
              Transactions
            </Button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Portfolio Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {portfolioStats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors"
            >
              <h3 className="text-sm font-medium text-gray-400">{stat.label}</h3>
              <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
              <p className={`mt-2 text-sm ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Transactions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentTransactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {transaction.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium
                          ${transaction.type === 'BUY' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      ${transaction.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {transaction.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;