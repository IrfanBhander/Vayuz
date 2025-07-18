import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import { WeatherData } from '../types/weather';
import { 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind, 
  Layers, 
  Satellite, 
  CloudRain, 
  Sun, 
  Navigation,
  Crosshair,
  Share2,
  Download,
  Maximize2,
  Search,
  Clock
} from 'lucide-react';
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
  // Load recent locations from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('weather-map-recent-locations');
    if (saved) {
      setRecentLocations(JSON.parse(saved));
    }
  }, []);

  // Save location to recent locations
  const saveRecentLocation = (name: string, lat: number, lon: number) => {
    const newLocation = { name, lat, lon };
    const updated = [newLocation, ...recentLocations.filter(loc => loc.name !== name)].slice(0, 5);
    setRecentLocations(updated);
    localStorage.setItem('weather-map-recent-locations', JSON.stringify(updated));
  };

  // Search for location
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    try {
      setLoading(true);
      const weatherService = WeatherService.getInstance();
      const data = await weatherService.getCurrentWeather(searchQuery, temperatureUnit);
      onLocationSelect(data.coord.lat, data.coord.lon);
      saveRecentLocation(data.name, data.coord.lat, data.coord.lon);
      setSearchQuery('');
    } catch (error) {
      console.error('Location search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          onLocationSelect(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLoading(false);
        }
      );
    }
  };

  // Share location
  const shareLocation = () => {
    if (currentWeather) {
      const url = `${window.location.origin}?lat=${currentWeather.coord.lat}&lon=${currentWeather.coord.lon}`;
      if (navigator.share) {
        navigator.share({
          title: `Weather in ${currentWeather.name}`,
          text: `Check out the weather in ${currentWeather.name}: ${Math.round(currentWeather.main.temp)}°`,
          url: url
        });
      } else {
        navigator.clipboard.writeText(url);
        // You could add a toast notification here
      }
    }
  };

  // Download weather data
  const downloadWeatherData = () => {
    if (currentWeather) {
      const data = {
        location: `${currentWeather.name}, ${currentWeather.sys.country}`,
        coordinates: `${currentWeather.coord.lat}, ${currentWeather.coord.lon}`,
        temperature: `${Math.round(currentWeather.main.temp)}°${temperatureUnit === 'metric' ? 'C' : 'F'}`,
        humidity: `${currentWeather.main.humidity}%`,
        windSpeed: `${currentWeather.wind.speed} ${temperatureUnit === 'metric' ? 'm/s' : 'mph'}`,
        description: currentWeather.weather[0].description,
        timestamp: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather-${currentWeather.name}-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Get tile layer URL based on selected layer
  const getTileLayerUrl = () => {
    switch (mapLayer) {
      case 'satellite':
        return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      case 'terrain':
        return 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      default:
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Get tile layer attribution
  const getTileLayerAttribution = () => {
    switch (mapLayer) {
      case 'satellite':
        return '&copy; <a href="https://www.esri.com/">Esri</a>';
      case 'terrain':
        return '&copy; <a href="https://opentopomap.org/">OpenTopoMap</a>';
      default:
        return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
    }
  };

};

const WeatherMap: React.FC<WeatherMapProps> = ({ 
  currentWeather, 
  onLocationSelect, 
  className = '' 
}) => {
  const [mapWeatherData, setMapWeatherData] = useState<WeatherData[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mapLayer, setMapLayer] = useState<'street' | 'satellite' | 'terrain'>('street');
  const [showWeatherLayer, setShowWeatherLayer] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentLocations, setRecentLocations] = useState<Array<{name: string, lat: number, lon: number}>>([]);
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
    <div className={`relative ${className} ${isFullscreen ? 'fixed inset-0 z-50 bg-white dark:bg-gray-900' : ''}`}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl border border-white/50 dark:border-gray-700/50">
        {/* Map Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700 p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <MapPin className="animate-pulse" size={24} />
              <h3 className="text-xl font-bold">Interactive Weather Map</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={shareLocation}
                disabled={!currentWeather}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                title="Share location"
              >
                <Share2 size={18} />
              </button>
              <button
                onClick={downloadWeatherData}
                disabled={!currentWeather}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 disabled:opacity-50"
                title="Download weather data"
              >
                <Download size={18} />
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors duration-200"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex gap-2 mb-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                placeholder="Search for a city or location..."
                className="w-full px-4 py-2 pl-10 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" size={16} />
            </div>
            <button
              onClick={searchLocation}
              disabled={!searchQuery.trim() || loading}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              <Search size={16} />
            </button>
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg transition-colors duration-200 disabled:opacity-50"
              title="Use current location"
            >
              <Crosshair size={16} />
            </button>
          </div>

          {/* Map Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Layer Selection */}
              <select
                value={mapLayer}
                onChange={(e) => setMapLayer(e.target.value as 'street' | 'satellite' | 'terrain')}
                className="px-3 py-1 bg-white/20 border border-white/30 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                <option value="street" className="text-gray-800">Street Map</option>
                <option value="satellite" className="text-gray-800">Satellite</option>
                <option value="terrain" className="text-gray-800">Terrain</option>
              </select>
              
              {/* Weather Layer Toggle */}
              <button
                onClick={() => setShowWeatherLayer(!showWeatherLayer)}
                className={`px-3 py-1 border border-white/30 rounded-lg text-sm transition-colors duration-200 ${
                  showWeatherLayer ? 'bg-white/30' : 'bg-white/20 hover:bg-white/30'
                }`}
              >
                <CloudRain size={16} className="inline mr-1" />
                Weather Layer
              </button>
            </div>
            
            <p className="text-white/90 text-sm">
              {userLocation ? 'Your location detected! ' : ''}Click anywhere to get weather
            </p>
          </div>
          
          {/* Recent Locations */}
          {recentLocations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={14} />
                <span className="text-sm font-medium">Recent Locations:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentLocations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => onLocationSelect(location.lat, location.lon)}
                    className="px-2 py-1 bg-white/20 hover:bg-white/30 border border-white/30 rounded text-xs transition-colors duration-200"
                  >
                    {location.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Map Container */}
        <div className={`relative ${isFullscreen ? 'h-screen' : 'h-96'}`}>
          <MapContainer
            center={[mapCenter.lat, mapCenter.lng]}
            zoom={10}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
          >
            <TileLayer
              attribution={getTileLayerAttribution()}
              url={getTileLayerUrl()}
            />
            
            {/* Weather Layer Overlay */}
            {showWeatherLayer && (
              <TileLayer
                url="https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=YOUR_API_KEY"
                opacity={0.6}
              />
            )}
            
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
                    <button
                      onClick={() => onLocationSelect(userLocation.lat, userLocation.lon)}
                      className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                    >
                      Get Weather Here
                    </button>
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
                      
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={shareLocation}
                          className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                        >
                          Share
                        </button>
                        <button
                          onClick={downloadWeatherData}
                          className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 transition-colors"
                        >
                          Download
                        </button>
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
            <span>• Search, click, or use current location</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;
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