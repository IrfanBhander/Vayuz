/**
 * Authentication Context
 * 
 * Centralized authentication state management with security best practices.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
}

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
  twoFactorCode?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginResult {
  success: boolean;
  requiresTwoFactor?: boolean;
  message?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = 'http://localhost:3001/api/auth';

  // Helper function for API calls
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  };

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const data = await apiCall('/me');
      
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      // User is not authenticated, which is fine
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiCall('/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      if (data.success) {
        setUser(data.user);
        
        // Store token in localStorage if remember me is checked
        if (credentials.rememberMe && data.token) {
          localStorage.setItem('authToken', data.token);
        }

        return { success: true };
      } else {
        return { 
          success: false, 
          requiresTwoFactor: data.requiresTwoFactor,
          message: data.message 
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiCall('/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      if (data.success) {
        // Registration successful - user needs to verify email
        // You might want to show a success message or redirect to a verification page
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      
      await apiCall('/logout', {
        method: 'POST',
      });
    } catch (error) {
      // Even if logout fails on server, clear local state
      console.error('Logout error:', error);
    } finally {
      // Clear local state
      setUser(null);
      localStorage.removeItem('authToken');
      setLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const data = await apiCall('/me');
      
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      // If refresh fails, user might need to login again
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    clearError,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};