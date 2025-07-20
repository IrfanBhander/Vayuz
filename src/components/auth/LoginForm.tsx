/**
 * Login Form Component
 * 
 * Secure, accessible login form with comprehensive validation and UX features.
 */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSwitchToForgotPassword }) => {
  const { login, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
    twoFactorCode: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real-time validation
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!value) return 'Password is required';
        return '';
      case 'twoFactorCode':
        if (showTwoFactor && !value) return 'Two-factor code is required';
        if (showTwoFactor && !/^\d{6}$/.test(value)) return 'Please enter a 6-digit code';
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Real-time validation for better UX
    if (type !== 'checkbox') {
      const error = validateField(name, value);
      if (error) {
        setValidationErrors(prev => ({
          ...prev,
          [name]: error
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    Object.keys(formData).forEach(key => {
      if (key !== 'rememberMe') {
        const error = validateField(key, formData[key as keyof typeof formData] as string);
        if (error) errors[key] = error;
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await login(formData);
      
      if (result.requiresTwoFactor) {
        setShowTwoFactor(true);
      }
    } catch (error) {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-focus on two-factor input when it appears
  useEffect(() => {
    if (showTwoFactor) {
      const input = document.getElementById('twoFactorCode');
      if (input) input.focus();
    }
  }, [showTwoFactor]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="text-blue-500" size={32} />
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          Sign in to access your weather dashboard
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
          <span className="text-red-700 dark:text-red-300 text-sm">{error}</span>
        </div>
      )}

      {/* Two-Factor Notice */}
      {showTwoFactor && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg flex items-center gap-3">
          <Shield className="text-blue-500 flex-shrink-0" size={20} />
          <span className="text-blue-700 dark:text-blue-300 text-sm">
            Please enter the 6-digit code from your authenticator app
          </span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting || loading}
              className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                validationErrors.email 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              disabled={isSubmitting || loading}
              className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                validationErrors.password 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.password}</p>
          )}
        </div>

        {/* Two-Factor Code Field */}
        {showTwoFactor && (
          <div>
            <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Two-Factor Authentication Code
            </label>
            <div className="relative">
              <input
                id="twoFactorCode"
                name="twoFactorCode"
                type="text"
                value={formData.twoFactorCode}
                onChange={handleInputChange}
                disabled={isSubmitting || loading}
                className={`w-full px-4 py-3 pl-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center text-lg tracking-widest ${
                  validationErrors.twoFactorCode 
                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="000000"
                maxLength={6}
                pattern="\d{6}"
                autoComplete="one-time-code"
                required
              />
              <Shield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            {validationErrors.twoFactorCode && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.twoFactorCode}</p>
            )}
          </div>
        )}

        {/* Remember Me */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              disabled={isSubmitting || loading}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Remember me</span>
          </label>
          
          <button
            type="button"
            onClick={onSwitchToForgotPassword}
            className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || loading || Object.keys(validationErrors).some(key => validationErrors[key])}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.02] disabled:hover:scale-100"
        >
          {(isSubmitting || loading) ? (
            <>
              <Loader className="animate-spin" size={18} />
              Signing in...
            </>
          ) : (
            <>
              <CheckCircle size={18} />
              Sign In
            </>
          )}
        </button>
      </form>

      {/* Register Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors duration-200"
          >
            Create one here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;