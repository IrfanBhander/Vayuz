import React, { createContext, useContext, useState, useEffect } from 'react';

export type Theme = 'light' | 'dark' | 'auto';
export type TemperatureUnit = 'metric' | 'imperial';

interface SettingsContextType {
  theme: Theme;
  temperatureUnit: TemperatureUnit;
  notifications: boolean;
  autoLocation: boolean;
  setTheme: (theme: Theme) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setNotifications: (enabled: boolean) => void;
  setAutoLocation: (enabled: boolean) => void;
  resetSettings: () => void;
}

const defaultSettings = {
  theme: 'light' as Theme,
  temperatureUnit: 'metric' as TemperatureUnit,
  notifications: true,
  autoLocation: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('weather-app-theme');
    return (saved as Theme) || defaultSettings.theme;
  });

  const [temperatureUnit, setTemperatureUnitState] = useState<TemperatureUnit>(() => {
    const saved = localStorage.getItem('weather-app-temperature-unit');
    return (saved as TemperatureUnit) || defaultSettings.temperatureUnit;
  });

  const [notifications, setNotificationsState] = useState<boolean>(() => {
    const saved = localStorage.getItem('weather-app-notifications');
    return saved ? JSON.parse(saved) : defaultSettings.notifications;
  });

  const [autoLocation, setAutoLocationState] = useState<boolean>(() => {
    const saved = localStorage.getItem('weather-app-auto-location');
    return saved ? JSON.parse(saved) : defaultSettings.autoLocation;
  });

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark', prefersDark);
      } else {
        document.documentElement.classList.toggle('dark', theme === 'dark');
      }
    };

    applyTheme();

    if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', applyTheme);
      return () => mediaQuery.removeEventListener('change', applyTheme);
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('weather-app-theme', newTheme);
  };

  const setTemperatureUnit = (unit: TemperatureUnit) => {
    setTemperatureUnitState(unit);
    localStorage.setItem('weather-app-temperature-unit', unit);
  };

  const setNotifications = (enabled: boolean) => {
    setNotificationsState(enabled);
    localStorage.setItem('weather-app-notifications', JSON.stringify(enabled));
  };

  const setAutoLocation = (enabled: boolean) => {
    setAutoLocationState(enabled);
    localStorage.setItem('weather-app-auto-location', JSON.stringify(enabled));
  };

  const resetSettings = () => {
    setTheme(defaultSettings.theme);
    setTemperatureUnit(defaultSettings.temperatureUnit);
    setNotifications(defaultSettings.notifications);
    setAutoLocation(defaultSettings.autoLocation);
    
    // Clear localStorage
    localStorage.removeItem('weather-app-theme');
    localStorage.removeItem('weather-app-temperature-unit');
    localStorage.removeItem('weather-app-notifications');
    localStorage.removeItem('weather-app-auto-location');
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        temperatureUnit,
        notifications,
        autoLocation,
        setTheme,
        setTemperatureUnit,
        setNotifications,
        setAutoLocation,
        resetSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};