import { useState, useEffect } from 'react';
import { WeatherData, TemperatureUnit } from '../types/weather';
import { WeatherService } from '../services/weatherService';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TemperatureUnit>('metric');

  const weatherService = WeatherService.getInstance();

  const fetchWeatherByCity = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getCurrentWeather(city, unit);
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Weather information is temporarily unavailable');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const location = await weatherService.getCurrentLocation();
      const data = await weatherService.getCurrentWeatherByCoords(
        location.lat, 
        location.lon, 
        unit
      );
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to get your location weather');
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  // Re-fetch weather when unit changes
  useEffect(() => {
    if (weather) {
      fetchWeatherByCity(weather.name);
    }
  }, [unit]);

  return {
    weather,
    loading,
    error,
    unit,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    toggleUnit,
    clearError: () => setError(null)
  };
};