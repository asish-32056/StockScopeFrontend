import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { toast } from 'react-hot-toast';

const Settings: React.FC = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSaveSettings = () => {
    // Implement settings save logic here
    toast.success('Settings saved successfully');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="ml-2">Email Notifications</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium">Appearance</h3>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span className="ml-2">Dark Mode</span>
              </label>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleSaveSettings}>
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;