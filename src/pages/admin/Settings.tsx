import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { toast } from 'react-hot-toast';
import { adminApi } from '../../services/api';

interface SettingsState {
  emailNotifications: boolean;
  darkMode: boolean;
  auditLogging: boolean;
  sessionTimeout: number;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>({
    emailNotifications: true,
    darkMode: false,
    auditLogging: true,
    sessionTimeout: 60
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Load saved settings from localStorage or API
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSettingChange = (key: keyof SettingsState, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      // Save to localStorage
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      // Here you would typically save to your backend as well
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
      console.error('Settings save error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Settings</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Email Notifications</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Appearance</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Dark Mode</span>
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Security</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.auditLogging}
                  onChange={(e) => handleSettingChange('auditLogging', e.target.checked)}
                  className="rounded border-gray-300"
                />
                <span>Enable Audit Logging</span>
              </label>
              
              <div className="flex items-center space-x-3">
                <label className="text-sm">Session Timeout (minutes):</label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                  min="15"
                  max="480"
                  className="rounded border-gray-300 w-20"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;