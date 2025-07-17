import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon, LatLng } from 'leaflet';
import { WeatherData } from '../types/weather';
import { WeatherService } from '../services/weatherService';
import { useSettings } from '../contexts/SettingsContext';
import { getPleasantWeatherInfo } from '../utils/weatherUtils';
import WeatherIcon from './WeatherIcon';
import { MapPin, Thermometer, Droplets, Wind, Loader } from 'lucide-react';
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

interface MapMarker {
  id: string;
  lat: number;
  lon: number;
  weather: WeatherData;
  loading: boolean;
}

const MapClickHandler: React.FC<{ onLocationSelect: (lat: number, lon: number) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat, lng);
    },
  });
  return null;
};

const WeatherMap: React.FC<WeatherMapProps> = ({ 
  currentWeather, 
  onLocationSelect, 
  className = '' 
}) => {
  const { temperatureUnit } = useSettings();
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  const [mapZoom, setMapZoom] = useState(10);
  
  const weatherService = WeatherService.getInstance();

  // Update map center when current weather changes
  useEffect(() => {
    if (currentWeather) {
      setMapCenter([currentWeather.coord.lat, currentWeather.coord.lon]);
      setMapZoom(12);
      
      // Add current weather as a marker if not already present
      const existingMarker = markers.find(m => 
        Math.abs(m.lat - currentWeather.coord.lat) < 0.01 && 
        Math.abs(m.lon - currentWeather.coord.lon) < 0.01
      );
      
      if (!existingMarker) {
        const newMarker: MapMarker = {
          id: `${currentWeather.coord.lat}-${currentWeather.coord.lon}`,
          lat: currentWeather.coord.lat,
          lon: currentWeather.coord.lon,
          weather: currentWeather,
          loading: false
        };
        setMarkers(prev => [newMarker, ...prev.slice(0, 9)]); // Keep max 10 markers
      }
    }
  }, [currentWeather]);

  const handleMapClick = async (lat: number, lon: number) => {
    // Check if marker already exists at this location
    const existingMarker = markers.find(m => 
      Math.abs(m.lat - lat) < 0.01 && Math.abs(m.lon - lon) < 0.01
    );
    
    if (existingMarker) {
      onLocationSelect(lat, lon);
      return;
    }

    // Add loading marker
    const loadingMarker: MapMarker = {
      id: `${lat}-${lon}`,
      lat,
      lon,
      weather: null as any,
      loading: true
    };
    
    setMarkers(prev => [loadingMarker, ...prev.slice(0, 9)]);

    try {
      const weatherData = await weatherService.getCurrentWeatherByCoords(lat, lon, temperatureUnit);
      
      // Update marker with weather data
      setMarkers(prev => prev.map(marker => 
        marker.id === loadingMarker.id 
          ? { ...marker, weather: weatherData, loading: false }
          : marker
      ));
      
      onLocationSelect(lat, lon);
    } catch (error) {
      // Remove failed marker
      setMarkers(prev => prev.filter(marker => marker.id !== loadingMarker.id));
    }
  };

  const createWeatherIcon = (weather: WeatherData) => {
    const pleasantInfo = getPleasantWeatherInfo(weather);
    return new Icon({
      iconUrl: `data:image/svg+xml;base64,${btoa(`
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="15" fill="${pleasantInfo.color.includes('yellow') ? '#fbbf24' : 
            pleasantInfo.color.includes('blue') ? '#3b82f6' : 
            pleasantInfo.color.includes('gray') ? '#6b7280' : '#10b981'}" stroke="white" stroke-width="2"/>
          <text x="16" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">
            ${Math.round(weather.main.temp)}°
          </text>
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  const getUnitSymbol = () => temperatureUnit === 'metric' ? '°C' : '°F';

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-white/50 dark:border-gray-700/50">
        {/* Map Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-4 text-white">
          <div className="flex items-center gap-3">
            <MapPin className="animate-pulse" size={24} />
            <h3 className="text-xl font-bold">Weather Map</h3>
          </div>
          <p className="text-white/90 text-sm mt-1">Click anywhere on the map to get weather information</p>
        </div>

        {/* Map Container */}
        <div className="h-96 relative">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <MapClickHandler onLocationSelect={handleMapClick} />
            
            {markers.map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.lat, marker.lon]}
                icon={marker.loading ? new Icon({
                  iconUrl: `data:image/svg+xml;base64,${btoa(`
                    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="16" cy="16" r="15" fill="#6b7280" stroke="white" stroke-width="2"/>
                      <circle cx="16" cy="16" r="8" fill="none" stroke="white" stroke-width="2" stroke-dasharray="12.57" stroke-dashoffset="12.57">
                        <animateTransform attributeName="transform" type="rotate" values="0 16 16;360 16 16" dur="1s" repeatCount="indefinite"/>
                      </circle>
                    </svg>
                  `)}`,
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                  popupAnchor: [0, -32],
                }) : createWeatherIcon(marker.weather)}
              >
                <Popup className="weather-popup">
                  {marker.loading ? (
                    <div className="flex items-center gap-2 p-2">
                      <Loader className="animate-spin" size={16} />
                      <span className="text-sm">Loading weather...</span>
                    </div>
                  ) : (
                    <div className="p-2 min-w-48">
                      <div className="flex items-center gap-3 mb-3">
                        <WeatherIcon weatherCode={marker.weather.weather[0].icon} size={32} />
                        <div>
                          <h4 className="font-bold text-gray-800">{marker.weather.name}</h4>
                          <p className="text-sm text-gray-600 capitalize">
                            {getPleasantWeatherInfo(marker.weather).description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Thermometer size={16} className="text-red-500" />
                          <span className="font-semibold">
                            {Math.round(marker.weather.main.temp)}{getUnitSymbol()}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Droplets size={16} className="text-blue-500" />
                          <span>{marker.weather.main.humidity}%</span>
                        </div>
                        
                        <div className="flex items-center gap-2 col-span-2">
                          <Wind size={16} className="text-green-500" />
                          <span>
                            {marker.weather.wind.speed} {temperatureUnit === 'metric' ? 'm/s' : 'mph'}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => onLocationSelect(marker.lat, marker.lon)}
                        className="w-full mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                      >
                        View Full Details
                      </button>
                    </div>
                  )}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Map Legend */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 border-t border-gray-200 dark:border-gray-600">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span>Sunny</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Cloudy/Rainy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <span>Overcast</span>
              </div>
            </div>
            <span className="text-xs">
              {markers.length}/10 locations
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;