/**
 * Authentication Button Component
 * 
 * Button to trigger authentication modal with user status display.
 */

import React from 'react';
import { User, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthButtonProps {
  onOpenAuth: () => void;
}

const AuthButton: React.FC<AuthButtonProps> = ({ onOpenAuth }) => {
  const { user, logout, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed top-6 right-32 z-50 p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 rounded-full">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="fixed top-6 right-32 z-50 flex items-center gap-2">
        {/* User Menu */}
        <div className="relative group">
          <button className="flex items-center gap-3 p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 group-hover:scale-105">
            <User className="text-gray-700 dark:text-gray-300" size={20} />
            <span className="text-gray-700 dark:text-gray-300 font-medium hidden sm:block">
              {user.firstName}
            </span>
          </button>

          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="text-white" size={20} />
                </div>
                <div>
                  <p className="font-semibold text-gray-800 dark:text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                </div>
              </div>
              
              {/* Verification Status */}
              <div className="mt-3 flex items-center gap-2">
                {user.isVerified ? (
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                    <Shield size={12} />
                    <span>Verified Account</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400 text-xs">
                    <Shield size={12} />
                    <span>Unverified Account</span>
                  </div>
                )}
                
                {user.twoFactorEnabled && (
                  <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 text-xs">
                    <Shield size={12} />
                    <span>2FA Enabled</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-2">
              <button className="w-full flex items-center gap-3 p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200">
                <Settings size={16} />
                <span>Account Settings</span>
              </button>
              
              <button 
                onClick={logout}
                className="w-full flex items-center gap-3 p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors duration-200"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={onOpenAuth}
      className="fixed top-6 right-32 z-50 flex items-center gap-3 p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-md border border-white/30 dark:border-gray-600/30 rounded-full hover:bg-white/30 dark:hover:bg-gray-700/30 transition-all duration-300 group hover:scale-105"
      aria-label="Sign in to your account"
    >
      <User className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" size={20} />
      <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-medium hidden sm:block transition-colors duration-300">
        Sign In
      </span>
    </button>
  );
};

export default AuthButton;