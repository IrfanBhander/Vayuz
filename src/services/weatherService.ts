import { WeatherData, GeoLocation, TemperatureUnit } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  private static instance: WeatherService;

  public static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(city: string, units: TemperatureUnit = 'metric'): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=${units}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('City not found. Please try a different location.');
        }
        if (response.status === 401) {
          throw new Error('Weather service temporarily unavailable.');
        }
        throw new Error('Unable to get weather information right now.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Weather information is currently unavailable. Please try again.');
    }
  }

  async getCurrentWeatherByCoords(
    lat: number, 
    lon: number, 
    units: TemperatureUnit = 'metric'
  ): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${units}`
      );

      if (!response.ok) {
        throw new Error('Weather information is currently unavailable.');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unable to get weather for your location.');
    }
  }

  getCurrentLocation(): Promise<GeoLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Location services are not available.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          let message = 'Unable to access your location.';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = 'Please enable location access to get local weather.';
              break;
            case error.POSITION_UNAVAILABLE:
              message = 'Location services are temporarily unavailable.';
              break;
            case error.TIMEOUT:
              message = 'Location request timed out. Please try again.';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        }
      );
    });
  }
}