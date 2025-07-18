import React, { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Monitor, 
  Thermometer, 
  Globe, 
  Bell, 
  MapPin,
  RotateCcw,
  X,
  Sparkles
} from 'lucide-react';
import { useSettings, Theme, TemperatureUnit, Language } from '../contexts/SettingsContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const {
    theme,
    temperatureUnit,
    notifications,
    autoLocation,
    setTheme,
    setTemperatureUnit,
    setNotifications,
    setAutoLocation,
    resetSettings,
  } = useSettings();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Light Mode', icon: <Sun size={20} className="text-yellow-500" /> },
    { value: 'dark', label: 'Dark Mode', icon: <Moon size={20} className="text-blue-400" /> },
    { value: 'auto', label: 'Auto (System)', icon: <Monitor size={20} className="text-gray-500" /> },
  ];

  const temperatureOptions: { value: TemperatureUnit; label: string }[] = [
    { value: 'metric', label: 'Celsius (°C)' },
    { value: 'imperial', label: 'Fahrenheit (°F)' },
  ];

  const handleReset = () => {
    resetSettings();
    setShowResetConfirm(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Settings Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="animate-spin" size={24} />
              <h2 className="text-xl font-bold">Settings</h2>
              <Sparkles className="text-yellow-300 animate-pulse" size={20} />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-white/90 mt-2">Customize your weather experience</p>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-8">
          {/* Theme Settings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Sun className="text-yellow-500" size={20} />
              Appearance
            </h3>
            <div className="space-y-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                    theme === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                  }`}
                >
                  {option.icon}
                  <span className="font-medium">{option.label}</span>
                  {theme === option.value && (
                    <Sparkles className="ml-auto text-blue-500 animate-pulse" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature Unit */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <Thermometer className="text-red-500" size={20} />
              Temperature Unit
            </h3>
            <div className="space-y-3">
              {temperatureOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTemperatureUnit(option.value)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                    temperatureUnit === option.value
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-red-300'
                  }`}
                >
                  <Thermometer size={20} className="text-red-400" />
                  <span className="font-medium">{option.label}</span>
                  {temperatureUnit === option.value && (
                    <Sparkles className="ml-auto text-red-500 animate-pulse" size={16} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Toggle Settings */}
          <div className="space-y-6">
            {/* Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <Bell className="text-purple-500" size={20} />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Notifications</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Get weather alerts</p>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  notifications ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    notifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Auto Location */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center gap-3">
                <MapPin className="text-orange-500" size={20} />
                <div>
                  <h4 className="font-medium text-gray-800 dark:text-white">Auto Location</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use current location</p>
                </div>
              </div>
              <button
                onClick={() => setAutoLocation(!autoLocation)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                  autoLocation ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                    autoLocation ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset Settings */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            {!showResetConfirm ? (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-center gap-3 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              >
                <RotateCcw size={20} />
                Reset to Defaults
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-center text-gray-600 dark:text-gray-400 font-medium">
                  Reset all settings to default values?
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 p-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsPanel;