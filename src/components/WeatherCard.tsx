import React from 'react';
import { WeatherData } from '../types/weather';
import WeatherIcon from './WeatherIcon';
import { getPleasantWeatherInfo, getTemperatureFeeling, getComfortLevel, getWindDescription } from '../utils/weatherUtils';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Eye,
  Sunrise,
  Sunset,
  Heart,
  Smile
} from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather }) => {
  const { temperatureUnit, setTemperatureUnit, language } = useSettings();
  const t = useTranslation(language);
  const pleasantInfo = getPleasantWeatherInfo(weather, language);
  const temperatureFeeling = getTemperatureFeeling(weather.main.temp, temperatureUnit, language);
  const comfortLevel = getComfortLevel(weather.main.humidity, weather.main.temp, language);
  const windDescription = getWindDescription(weather.wind.speed, temperatureUnit, language);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getUnitSymbol = () => temperatureUnit === 'metric' ? '°C' : '°F';
  const getSpeedUnit = () => temperatureUnit === 'metric' ? 'm/s' : 'mph';

  const toggleUnit = () => {
    setTemperatureUnit(temperatureUnit === 'metric' ? 'imperial' : 'metric');
  };

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] max-w-4xl mx-auto">
      {/* Header with Pleasant Weather Focus */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
              {weather.name}, {weather.sys.country}
            </h2>
            <Heart className="text-pink-500 animate-pulse" size={24} />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Smile className="text-yellow-500" size={20} />
            <p className={`text-xl font-semibold ${pleasantInfo.color} capitalize`}>
              {pleasantInfo.condition}
            </p>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg font-medium">
            {pleasantInfo.description}
          </p>
        </div>
        <div className="text-center">
          <WeatherIcon 
            weatherCode={weather.weather[0].icon} 
            size={100}
            className="mb-2"
          />
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${pleasantInfo.color} bg-gradient-to-r ${pleasantInfo.bgGradient} bg-opacity-20`}>
            {pleasantInfo.pleasantLevel.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Temperature Section with Pleasant Messaging */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-3">
            <span className="text-6xl font-bold text-gray-800 dark:text-white tracking-tight">
              {Math.round(weather.main.temp)}
            </span>
            <button
              onClick={toggleUnit}
              className="text-3xl text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 cursor-pointer hover:scale-110 font-semibold"
            >
              {getUnitSymbol()}
            </button>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-2">
              <Thermometer size={20} className="text-red-400" />
              <span className="text-sm font-medium">{t.feelsLike}</span>
            </div>
            <span className="text-2xl font-semibold text-gray-800 dark:text-white">
              {Math.round(weather.main.feels_like)}{getUnitSymbol()}
            </span>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 font-medium">
              {temperatureFeeling}
            </p>
          </div>
        </div>
      </div>

      {/* Pleasant Weather Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-5 border border-blue-200 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-3 text-blue-600 mb-3">
            <Droplets size={24} className="text-blue-500" />
            <span className="text-sm font-semibold">{t.humidity}</span>
          </div>
          <span className="text-2xl font-bold text-gray-800 dark:text-white block mb-1">
            {weather.main.humidity}%
          </span>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{comfortLevel}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-5 border border-green-200 dark:border-green-700/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-3 text-green-600 mb-3">
            <Wind size={24} className="text-green-500" />
            <span className="text-sm font-semibold">{t.wind}</span>
          </div>
          <span className="text-2xl font-bold text-gray-800 dark:text-white block mb-1">
            {weather.wind.speed} {getSpeedUnit()}
          </span>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">{windDescription}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-5 border border-purple-200 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-3 text-purple-600 mb-3">
            <Gauge size={24} className="text-purple-500" />
            <span className="text-sm font-semibold">{t.pressure}</span>
          </div>
          <span className="text-2xl font-bold text-gray-800 dark:text-white block mb-1">
            {weather.main.pressure}
          </span>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">hPa</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-2xl p-5 border border-orange-200 dark:border-orange-700/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center gap-3 text-orange-600 mb-3">
            <Eye size={24} className="text-orange-500" />
            <span className="text-sm font-semibold">{t.visibility}</span>
          </div>
          <span className="text-2xl font-bold text-gray-800 dark:text-white block mb-1">
            {(weather.visibility / 1000).toFixed(1)}
          </span>
          <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">km</p>
        </div>
      </div>

      {/* Sunrise/Sunset with Pleasant Messaging */}
      <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-900/30 dark:via-orange-900/30 dark:to-pink-900/30 rounded-2xl p-6 border border-yellow-200 dark:border-yellow-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <Sunrise size={24} className="text-yellow-500" />
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.sunrise}</span>
                <span className="text-xl font-bold text-gray-800 dark:text-white ml-3">
                  {formatTime(weather.sys.sunrise)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-3">
              <Sunset size={24} className="text-orange-500" />
              <div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t.sunset}</span>
                <span className="text-xl font-bold text-gray-800 dark:text-white ml-3">
                  {formatTime(weather.sys.sunset)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-gray-600 dark:text-gray-300 font-medium">
            {t.perfectTimeOutdoors}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;