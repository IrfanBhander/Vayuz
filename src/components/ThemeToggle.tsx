import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useSettings();

  const cycleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('auto');
    } else {
      setTheme('light');
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="text-yellow-500" size={24} />;
      case 'dark':
        return <Moon className="text-blue-400" size={24} />;
      case 'auto':
        return <Monitor className="text-gray-500 dark:text-gray-400" size={24} />;
      default:
        return <Sun className="text-yellow-500" size={24} />;
    }
  };

  return (
    <button
      onClick={cycleTheme}
      className="fixed top-6 right-20 z-50 p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 group hover:scale-110"
      aria-label={`Current theme: ${theme}. Click to cycle themes.`}
      title={`Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)} mode`}
    >
      <div className="relative w-6 h-6 transition-transform duration-300 group-hover:rotate-12">
        {getThemeIcon()}
      </div>
    </button>
  );
};

export default ThemeToggle;