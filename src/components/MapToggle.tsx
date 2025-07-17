import React from 'react';
import { Map, List } from 'lucide-react';

interface MapToggleProps {
  showMap: boolean;
  onToggle: () => void;
}

const MapToggle: React.FC<MapToggleProps> = ({ showMap, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="fixed top-6 left-6 z-50 p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 group hover:scale-110"
      aria-label={showMap ? "Show weather details" : "Show weather map"}
      title={showMap ? "Weather Details" : "Weather Map"}
    >
      <div className="relative w-6 h-6 transition-transform duration-300 group-hover:rotate-12">
        {showMap ? (
          <List className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" size={24} />
        ) : (
          <Map className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" size={24} />
        )}
      </div>
    </button>
  );
};

export default MapToggle;