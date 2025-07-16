import { WeatherData, PleasantWeatherCondition } from '../types/weather';

export const getPleasantWeatherInfo = (weather: WeatherData): PleasantWeatherCondition => {
  const condition = weather.weather[0].main.toLowerCase();
  const temp = weather.main.temp;
  const description = weather.weather[0].description;
  
  // Focus on positive aspects and pleasant presentation
  switch (condition) {
    case 'clear':
      return {
        condition: 'Clear Skies',
        description: 'Perfect sunny weather',
        pleasantLevel: 'excellent',
        color: 'text-yellow-600',
        bgGradient: 'from-yellow-300 via-orange-400 to-pink-400'
      };
    
    case 'clouds':
      if (weather.clouds.all < 50) {
        return {
          condition: 'Partly Cloudy',
          description: 'Pleasant with some clouds',
          pleasantLevel: 'excellent',
          color: 'text-blue-500',
          bgGradient: 'from-blue-300 via-sky-400 to-cyan-400'
        };
      }
      return {
        condition: 'Cloudy',
        description: 'Comfortable overcast day',
        pleasantLevel: 'good',
        color: 'text-gray-600',
        bgGradient: 'from-gray-300 via-blue-300 to-indigo-400'
      };
    
    case 'rain':
      if (description.includes('light')) {
        return {
          condition: 'Light Rain',
          description: 'Refreshing light showers',
          pleasantLevel: 'fair',
          color: 'text-blue-600',
          bgGradient: 'from-blue-400 via-indigo-500 to-purple-500'
        };
      }
      return {
        condition: 'Rainy',
        description: 'Cozy rainy weather',
        pleasantLevel: 'fair',
        color: 'text-blue-700',
        bgGradient: 'from-slate-400 via-blue-500 to-indigo-600'
      };
    
    case 'drizzle':
      return {
        condition: 'Light Drizzle',
        description: 'Gentle mist in the air',
        pleasantLevel: 'good',
        color: 'text-teal-600',
        bgGradient: 'from-teal-300 via-blue-400 to-indigo-500'
      };
    
    case 'snow':
      return {
        condition: 'Snowy',
        description: 'Beautiful winter weather',
        pleasantLevel: 'good',
        color: 'text-blue-400',
        bgGradient: 'from-blue-200 via-indigo-300 to-purple-400'
      };
    
    case 'mist':
    case 'fog':
      return {
        condition: 'Misty',
        description: 'Atmospheric and serene',
        pleasantLevel: 'good',
        color: 'text-gray-500',
        bgGradient: 'from-gray-300 via-slate-400 to-blue-400'
      };
    
    default:
      return {
        condition: 'Pleasant Weather',
        description: 'Nice conditions outside',
        pleasantLevel: 'good',
        color: 'text-green-600',
        bgGradient: 'from-green-300 via-teal-400 to-blue-500'
      };
  }
};

export const getTemperatureFeeling = (temp: number, unit: 'metric' | 'imperial'): string => {
  const celsius = unit === 'metric' ? temp : (temp - 32) * 5/9;
  
  if (celsius >= 25) return 'Warm and pleasant';
  if (celsius >= 20) return 'Comfortable';
  if (celsius >= 15) return 'Mild and nice';
  if (celsius >= 10) return 'Cool and refreshing';
  if (celsius >= 5) return 'Crisp and invigorating';
  return 'Cool and cozy';
};

export const getComfortLevel = (humidity: number, temp: number): string => {
  if (humidity < 30) return 'Dry and comfortable';
  if (humidity < 50) return 'Very comfortable';
  if (humidity < 70) return 'Pleasant humidity';
  return 'A bit humid but manageable';
};

export const getWindDescription = (speed: number, unit: 'metric' | 'imperial'): string => {
  const mps = unit === 'metric' ? speed : speed * 0.44704;
  
  if (mps < 2) return 'Calm and peaceful';
  if (mps < 5) return 'Light breeze';
  if (mps < 8) return 'Gentle breeze';
  if (mps < 12) return 'Moderate breeze';
  return 'Fresh breeze';
};