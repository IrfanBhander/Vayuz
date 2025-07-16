import React from 'react';
import { Sun, Cloud } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 24, 
  className = '' 
}) => {
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
      <p className="text-gray-600 font-medium animate-pulse">
        Getting your weather forecast...
      </p>
    </div>
  );
};

export default LoadingSpinner;