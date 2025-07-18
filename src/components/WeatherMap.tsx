import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { WeatherData } from '../types/weather';
import { MapPin, Thermometer, Droplets, Wind } from 'lucide-react';
import { WeatherService } from '../services/weatherService';
import { useSettings } from '../contexts/SettingsContext';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherMapProps {
  currentWeather?: WeatherData | null;
  onLocationSelect: (lat: number, lon: number) => void;
  className?: string;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lon: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const WeatherMap: React.FC<WeatherMapProps> = ({ 
  currentWeather, 
  onLocationSelect, 
  className = '' 
}) => {
  const [mapWeatherData, setMapWeatherData] = useState<WeatherData[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const { temperatureUnit } = useSettings();

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log('Location access denied or unavailable');
        }
      );
    }
  }, []);

  // Default center (New York City if no current weather or user location)
  const defaultCenter = { lat: 40.7128, lng: -74.0060 };
  const mapCenter = currentWeather 
    ? { lat: currentWeather.coord.lat, lng: currentWeather.coord.lon }
    : userLocation 
    ? { lat: userLocation.lat, lng: userLocation.lon }
    : defaultCenter;

  const fetchWeatherForLocation = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const weatherService = WeatherService.getInstance();
      const data = await weatherService.getCurrentWeatherByCoords(lat, lon, temperatureUnit);
      return data;
    } catch (error) {
      console.error('Failed to fetch weather for location:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Custom weather marker icon
  const createWeatherIcon = (temp: number) => {
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
          <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="12" font-weight="bold">
            ${Math.round(temp)}°
          </text>
        </svg>
      `)}`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-white/50 dark:border-gray-700/50">
        {/* Map Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-4 text-white">
          <div className="flex items-center gap-3">
            <MapPin className="animate-pulse" size={24} />
            <h3 className="text-xl font-bold">Interactive Weather Map</h3>
          </div>
          <p className="text-white/90 text-sm mt-1">
            {userLocation ? 'Your location detected! ' : ''}Click anywhere on the map to get weather information
          </p>
        </div>

        {/* Map Container */}
        <div className="h-96 relative">
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Click handler for map */}
            <MapClickHandler onLocationSelect={onLocationSelect} />
            
            {/* User's current location marker */}
            {userLocation && (
              <Marker 
                position={[userLocation.lat, userLocation.lon]}
                icon={new Icon({
                  iconUrl: `data:image/svg+xml;base64,${btoa(`
                    <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="15" cy="15" r="12" fill="#EF4444" stroke="#DC2626" stroke-width="2"/>
                      <circle cx="15" cy="15" r="6" fill="white"/>
                      <circle cx="15" cy="15" r="3" fill="#EF4444"/>
                    </svg>
                  `)}`,
                  iconSize: [30, 30],
                  iconAnchor: [15, 15],
                  popupAnchor: [0, -15],
                })}
              >
                <Popup className="weather-popup">
                  <div className="p-2 text-center">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={16} className="text-red-500" />
                      <span className="font-semibold text-gray-800 dark:text-white">Your Location</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Lat: {userLocation.lat.toFixed(4)}<br/>
                      Lon: {userLocation.lon.toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Current weather location marker */}
            {currentWeather && (
              <Marker 
                position={[currentWeather.coord.lat, currentWeather.coord.lon]}
                icon={createWeatherIcon(currentWeather.main.temp)}
              >
                <Popup className="weather-popup">
                  <div className="p-3 min-w-[200px]">
                    <h4 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                      <MapPin size={16} className="text-blue-500" />
                      {currentWeather.name}, {currentWeather.sys.country}
                    </h4>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Thermometer size={14} className="text-red-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {Math.round(currentWeather.main.temp)}° 
                          {temperatureUnit === 'metric' ? 'C' : 'F'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Droplets size={14} className="text-blue-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {currentWeather.main.humidity}% humidity
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Wind size={14} className="text-green-500" />
                        <span className="text-gray-700 dark:text-gray-300">
                          {currentWeather.wind.speed} {temperatureUnit === 'metric' ? 'm/s' : 'mph'}
                        </span>
                      </div>
                      
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-400 capitalize">
                          {currentWeather.weather[0].description}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  <span className="text-gray-700 dark:text-gray-300">Loading weather...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Map Instructions */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-300 space-x-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Your Location</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Weather Location</span>
            </div>
            <span>• Click anywhere to get weather</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;