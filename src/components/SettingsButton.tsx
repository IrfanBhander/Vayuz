import React from 'react';
import { Settings, Sparkles } from 'lucide-react';

interface SettingsButtonProps {
  onClick: () => void;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 z-50 p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 group hover:scale-110"
      aria-label="Open settings"
      title="Settings"
    >
      <div className="relative">
        <Settings 
          className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:rotate-90" 
          size={24} 
        />
        <Sparkles 
          className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" 
          size={12} 
        />
      </div>
    </button>
  );
};

export default SettingsButton;