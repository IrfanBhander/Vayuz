import React from 'react';
import { Sun, Cloud } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 24, 
  className = '' 
}) => {
  const { language } = useSettings();
  const t = useTranslation(language);

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative mb-4">
        <Sun 
          size={size * 2} 
          className="animate-spin text-yellow-500 drop-shadow-lg" 
        />
        <Cloud 
          size={size} 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400 animate-pulse" 
        />
      </div>
      <p className="text-gray-600 dark:text-gray-300 font-medium animate-pulse">
        {t.gettingWeather}
      </p>
    </div>
  );
};

export default LoadingSpinner;