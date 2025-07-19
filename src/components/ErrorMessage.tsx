import React from 'react';
import { CloudOff, RefreshCw, Smile } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  const { language } = useSettings();
  const t = useTranslation(language);

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border border-orange-200 dark:border-orange-700/50 rounded-2xl p-8 max-w-lg mx-auto shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <CloudOff className="text-orange-500" size={32} />
          <Smile className="absolute -bottom-1 -right-1 text-yellow-500" size={16} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Oops! Weather Update Needed</h3>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">{t.weatherUpdateNeeded}</h3>
      </div>
      
      <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg leading-relaxed">
        {message} {t.greatWeatherAway}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl transition-all duration-300 text-white font-semibold hover:scale-105 shadow-lg hover:shadow-xl group"
        >
          <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          {t.tryAgain}
        </button>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          ✨ {t.greatWeatherAway}
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;