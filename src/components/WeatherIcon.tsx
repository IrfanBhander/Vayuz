import React from 'react';
import { 
  Sun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle,
  Sparkles,
  Wind
} from 'lucide-react';

interface WeatherIconProps {
  weatherCode: string;
  size?: number;
  className?: string;
}

const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  weatherCode, 
  size = 48, 
  className = '' 
}) => {
  const getWeatherIcon = (code: string) => {
    const iconProps = { 
      size, 
      className: `${className} transition-all duration-300 hover:scale-110 drop-shadow-lg` 
    };

    switch (code) {
      case '01d':
      case '01n':
        return (
          <div className="relative">
            <Sun {...iconProps} className={`${iconProps.className} text-yellow-500 animate-pulse`} />
            <Sparkles className="absolute -top-1 -right-1 text-yellow-400 animate-bounce" size={size * 0.3} />
          </div>
        );
      
      case '02d':
      case '02n':
        return (
          <div className="relative">
            <Cloud {...iconProps} className={`${iconProps.className} text-blue-400`} />
            <Sun className="absolute -top-2 -right-2 text-yellow-400" size={size * 0.4} />
          </div>
        );
      
      case '03d':
      case '03n':
      case '04d':
      case '04n':
        return <Cloud {...iconProps} className={`${iconProps.className} text-blue-500`} />;
      
      case '09d':
      case '09n':
        return <CloudDrizzle {...iconProps} className={`${iconProps.className} text-blue-600`} />;
      
      case '10d':
      case '10n':
        return <CloudRain {...iconProps} className={`${iconProps.className} text-blue-700`} />;
      
      case '13d':
      case '13n':
        return <CloudSnow {...iconProps} className={`${iconProps.className} text-blue-300`} />;
      
      case '50d':
      case '50n':
        return <Wind {...iconProps} className={`${iconProps.className} text-gray-400`} />;
      
      default:
        return <Sun {...iconProps} className={`${iconProps.className} text-yellow-500`} />;
    }
  };

  return (
    <div className="flex items-center justify-center">
      {getWeatherIcon(weatherCode)}
    </div>
  );
};

export default WeatherIcon;