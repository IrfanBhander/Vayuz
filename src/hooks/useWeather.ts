import { useState, useEffect } from 'react';
import { WeatherData } from '../types/weather';
import { WeatherService } from '../services/weatherService';
import { useSettings } from '../contexts/SettingsContext';

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { temperatureUnit } = useSettings();

  const weatherService = WeatherService.getInstance();

  const fetchWeatherByCity = async (city: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await weatherService.getCurrentWeather(city, temperatureUnit);
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
        temperatureUnit
      );
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to get your location weather');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch weather when temperature unit changes
  useEffect(() => {
    if (weather) {
      fetchWeatherByCity(weather.name);
    }
  }, [temperatureUnit]);

  return {
    weather,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    clearError: () => setError(null)
  };
};