export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface GeoLocation {
  lat: number;
  lon: number;
}

export type TemperatureUnit = 'metric' | 'imperial';

export interface WeatherError {
  message: string;
  code?: number;
}

export interface PleasantWeatherCondition {
  condition: string;
  description: string;
  pleasantLevel: 'excellent' | 'good' | 'fair';
  color: string;
  bgGradient: string;
}