import { WeatherData, PleasantWeatherCondition } from '../types/weather';
import { useTranslation } from './translations';
import { Language } from '../contexts/SettingsContext';

export const getPleasantWeatherInfo = (weather: WeatherData, language: Language = 'en'): PleasantWeatherCondition => {
  const t = useTranslation(language);
  const condition = weather.weather[0].main.toLowerCase();
  const temp = weather.main.temp;
  const description = weather.weather[0].description;
  
  // Focus on positive aspects and pleasant presentation
  switch (condition) {
    case 'clear':
      return {
        condition: 'Clear Skies',
        description: t.clearSkies,
        pleasantLevel: 'excellent',
        color: 'text-yellow-600',
        bgGradient: 'from-yellow-300 via-orange-400 to-pink-400'
      };
    
    case 'clouds':
      if (weather.clouds.all < 50) {
        return {
          condition: 'Partly Cloudy',
          description: t.partlyCloudy,
          pleasantLevel: 'excellent',
          color: 'text-blue-500',
          bgGradient: 'from-blue-300 via-sky-400 to-cyan-400'
        };
      }
      return {
        condition: 'Cloudy',
        description: t.cloudy,
        pleasantLevel: 'good',
        color: 'text-gray-600',
        bgGradient: 'from-gray-300 via-blue-300 to-indigo-400'
      };
    
    case 'rain':
      if (description.includes('light')) {
        return {
          condition: 'Light Rain',
          description: t.lightRain,
          pleasantLevel: 'fair',
          color: 'text-blue-600',
          bgGradient: 'from-blue-400 via-indigo-500 to-purple-500'
        };
      }
      return {
        condition: 'Rainy',
        description: t.rainy,
        pleasantLevel: 'fair',
        color: 'text-blue-700',
        bgGradient: 'from-slate-400 via-blue-500 to-indigo-600'
      };
    
    case 'drizzle':
      return {
        condition: 'Light Drizzle',
        description: t.lightDrizzle,
        pleasantLevel: 'good',
        color: 'text-teal-600',
        bgGradient: 'from-teal-300 via-blue-400 to-indigo-500'
      };
    
    case 'snow':
      return {
        condition: 'Snowy',
        description: t.snowy,
        pleasantLevel: 'good',
        color: 'text-blue-400',
        bgGradient: 'from-blue-200 via-indigo-300 to-purple-400'
      };
    
    case 'mist':
    case 'fog':
      return {
        condition: 'Misty',
        description: t.misty,
        pleasantLevel: 'good',
        color: 'text-gray-500',
        bgGradient: 'from-gray-300 via-slate-400 to-blue-400'
      };
    
    default:
      return {
        condition: 'Pleasant Weather',
        description: t.pleasantWeather,
        pleasantLevel: 'good',
        color: 'text-green-600',
        bgGradient: 'from-green-300 via-teal-400 to-blue-500'
      };
  }
};

export const getTemperatureFeeling = (temp: number, unit: 'metric' | 'imperial', language: Language = 'en'): string => {
  const t = useTranslation(language);
  const celsius = unit === 'metric' ? temp : (temp - 32) * 5/9;
  
  if (celsius >= 25) return t.warmAndPleasant;
  if (celsius >= 20) return t.comfortable;
  if (celsius >= 15) return t.mildAndNice;
  if (celsius >= 10) return t.coolAndRefreshing;
  if (celsius >= 5) return t.crispAndInvigorating;
  return t.coolAndCozy;
};

export const getComfortLevel = (humidity: number, temp: number, language: Language = 'en'): string => {
  const t = useTranslation(language);
  if (humidity < 30) return t.dryAndComfortable;
  if (humidity < 50) return t.veryComfortable;
  if (humidity < 70) return t.pleasantHumidity;
  return t.bitHumidButManageable;
};

export const getWindDescription = (speed: number, unit: 'metric' | 'imperial', language: Language = 'en'): string => {
  const t = useTranslation(language);
  const mps = unit === 'metric' ? speed : speed * 0.44704;
  
  if (mps < 2) return t.calmAndPeaceful;
  if (mps < 5) return t.lightBreeze;
  if (mps < 8) return t.gentleBreeze;
  if (mps < 12) return t.moderateBreeze;
  return t.freshBreeze;
};