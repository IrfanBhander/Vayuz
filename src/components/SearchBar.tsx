import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, X, Sparkles } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { useTranslation } from '../utils/translations';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onUseCurrentLocation: () => void;
  loading: boolean;
  error: string | null;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  onUseCurrentLocation, 
  loading, 
  error 
}) => {
  const { language } = useSettings();
  const t = useTranslation(language);
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pleasantWeatherSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  const handleSearch = (city: string) => {
    onSearch(city);
    setQuery('');
    setShowRecent(false);
    
    const updated = [city, ...recentSearches.filter(s => s !== city)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('pleasantWeatherSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('pleasantWeatherSearches');
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowRecent(true)}
            placeholder={t.searchPlaceholder}
            className="w-full px-6 py-5 pl-16 pr-32 bg-transparent rounded-2xl text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-300 text-lg font-medium"
            disabled={loading}
          />
          
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={24} />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={onUseCurrentLocation}
              disabled={loading}
              className="p-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 disabled:opacity-50 hover:scale-110 group"
             title={t.useCurrentLocation}
            >
              <MapPin size={20} className="group-hover:animate-pulse" />
            </button>

            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl p-3 transition-all duration-300 disabled:opacity-50 hover:scale-105 shadow-lg hover:shadow-xl group"
            >
              <Search size={18} className="group-hover:rotate-12 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </form>

      {/* Recent Searches Dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700/50 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Clock size={16} className="text-blue-500" />
              {t.recentSearches}
            </span>
            <button
              onClick={clearRecentSearches}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 hover:scale-110"
            >
              <X size={16} />
            </button>
          </div>
          <div className="max-h-52 overflow-y-auto">
            {recentSearches.map((city, index) => (
              <button
                key={index}
                onClick={() => handleSearch(city)}
                className="w-full px-4 py-3 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium hover:translate-x-2 flex items-center gap-3 group"
              >
                <Sparkles size={14} className="text-blue-400 group-hover:animate-spin" />
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {showRecent && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowRecent(false)}
        />
      )}
    </div>
  );
};

export default SearchBar;