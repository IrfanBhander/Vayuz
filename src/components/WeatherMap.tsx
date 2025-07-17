import React from 'react';
import { WeatherData } from '../types/weather';
import { MapPin } from 'lucide-react';

interface WeatherMapProps {
  currentWeather?: WeatherData | null;
  onLocationSelect: (lat: number, lon: number) => void;
  className?: string;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ 
  currentWeather, 
  onLocationSelect, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-white/50 dark:border-gray-700/50">
        {/* Map Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-4 text-white">
          <div className="flex items-center gap-3">
            <MapPin className="animate-pulse" size={24} />
            <h3 className="text-xl font-bold">Weather Map</h3>
          </div>
          <p className="text-white/90 text-sm mt-1">Map functionality temporarily unavailable</p>
        </div>

        {/* Placeholder Content */}
        <div className="h-96 flex items-center justify-center bg-gray-100 dark:bg-gray-700">
          <div className="text-center">
            <MapPin size={48} className="mx-auto mb-4 text-gray-400" />
            <h4 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              Map Loading...
            </h4>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Interactive map will be available soon
            </p>
          </div>
        </div>

        {/* Map Legend */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
            <span>Map functionality will be restored once dependencies are resolved</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;