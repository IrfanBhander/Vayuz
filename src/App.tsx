import React, { useEffect, useState } from 'react';
import { Cloud, Sparkles, Heart, Sun } from 'lucide-react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherMap from './components/WeatherMap';
import MapToggle from './components/MapToggle';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import ThemeToggle from './components/ThemeToggle';
import SettingsButton from './components/SettingsButton';
import SettingsPanel from './components/SettingsPanel';
import CloudyIcon from './components/CloudyIcon';
import { useWeather } from './hooks/useWeather';
import { useSettings } from './contexts/SettingsContext';
import { getPleasantWeatherInfo } from './utils/weatherUtils';
import { useTranslation } from './utils/translations';

function App() {
  const {
    weather,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByLocation,
    clearError
  } = useWeather();

  const { autoLocation, temperatureUnit, language } = useSettings();
  const t = useTranslation(language);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Auto-fetch user's location weather on first load
  useEffect(() => {
    if (autoLocation) {
      fetchWeatherByLocation();
    }
  }, [autoLocation]);

  const handleLocationSelect = async (lat: number, lon: number) => {
    try {
      const weatherService = (await import('./services/weatherService')).WeatherService.getInstance();
      const data = await weatherService.getCurrentWeatherByCoords(lat, lon, temperatureUnit);
      // Update weather state through the hook
      fetchWeatherByCity(data.name);
      setShowMap(false); // Switch back to details view
    } catch (error) {
      console.error('Failed to fetch weather for selected location:', error);
    }
  };
  const getBackgroundClass = () => {
    if (!weather) {
      return 'bg-gradient-to-br from-blue-300 via-purple-400 to-pink-400 dark:from-blue-800 dark:via-purple-900 dark:to-pink-900';
    }
    
    const pleasantInfo = getPleasantWeatherInfo(weather, language);
    return `bg-gradient-to-br ${pleasantInfo.bgGradient} dark:from-gray-800 dark:via-gray-900 dark:to-black`;
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${getBackgroundClass()} relative overflow-hidden`}>
      {/* Pleasant animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating pleasant elements */}
        <Sparkles className="absolute top-20 left-20 text-white/30 animate-bounce" size={24} />
        <Heart className="absolute top-32 right-32 text-pink-300/40 animate-pulse" size={20} />
        <Sun className="absolute bottom-32 left-32 text-yellow-300/40 animate-spin" size={28} />
        <Cloud className="absolute bottom-20 right-20 text-white/30 animate-bounce delay-1000" size={32} />
      </div>
      
      {/* Theme Toggle and Settings */}
      <MapToggle showMap={showMap} onToggle={() => setShowMap(!showMap)} />
      <ThemeToggle />
      <SettingsButton onClick={() => setSettingsOpen(true)} />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Pleasant Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <CloudyIcon size={56} className="text-white animate-pulse" />
              <Sparkles className="absolute -top-2 -right-2 text-yellow-300 animate-pulse" size={20} />
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tight">
              {t.appTitle}
            </h1>
            <Heart className="text-pink-300 animate-pulse" size={40} />
          </div>
          <p className="text-white/90 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            {t.appSubtitle} {showMap ? '🗺️' : '✨'}
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="text-yellow-300" size={16} />
            <span className="text-white/80 text-sm font-medium">
              {showMap ? t.interactiveWeatherMap : t.appDescription}
            </span>
            <Sparkles className="text-yellow-300" size={16} />
          </div>
        </div>

        {!showMap && (
          /* Search Section */
          <div className="mb-12">
            <SearchBar
              onSearch={fetchWeatherByCity}
              onUseCurrentLocation={fetchWeatherByLocation}
              loading={loading}
              error={error}
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-6xl mx-auto">
          {showMap ? (
            <WeatherMap
              currentWeather={weather}
              onLocationSelect={handleLocationSelect}
              className="mb-8"
            />
          ) : (
            <>
              {loading && (
                <div className="flex flex-col items-center justify-center py-16">
                  <LoadingSpinner size={32} className="mb-6" />
                </div>
              )}

              {error && (
                <ErrorMessage 
                  message={error} 
                  onRetry={() => {
                    clearError();
                    if (weather) {
                      fetchWeatherByCity(weather.name);
                    } else {
                      fetchWeatherByLocation();
                    }
                  }}
                />
              )}

              {weather && !loading && !error && (
                <WeatherCard weather={weather} />
              )}

              {!weather && !loading && !error && (
                <div className="text-center py-16">
                  <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-12 max-w-2xl mx-auto border border-white/30">
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <Sun className="text-yellow-300 animate-pulse" size={64} />
                      <Cloud className="text-white/80" size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {t.readyToExplore}
                    </h3>
                    <p className="text-white/90 text-lg font-medium max-w-lg mx-auto leading-relaxed mb-6">
                      {t.searchOrUseLocation}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="text-yellow-300 animate-spin" size={16} />
                      <span className="text-white/80 text-sm font-medium">
                        {t.everyDayBeauty}
                      </span>
                      <Sparkles className="text-yellow-300 animate-spin" size={16} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Pleasant Footer */}
        <div className="text-center mt-16 text-white/70">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart className="text-pink-300" size={16} />
            <p className="text-sm font-medium">
              {t.brightSideWeather}
            </p>
            <Heart className="text-pink-300" size={16} />
          </div>
          <p className="text-xs">
            {t.weatherDataBy} | {t.designedWith}
          </p>
        </div>
      </div>
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
      />
    </div>
  );
}

export default App;