/**
 * Environment Configuration
 * 
 * Centralized configuration management with security best practices.
 * All sensitive data should be stored in environment variables.
 */

import { config } from 'dotenv';

// Load environment variables
config();

export const ENV = {
  // Server Configuration
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Security Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  SESSION_SECRET: process.env.SESSION_SECRET || 'your-super-secret-session-key-change-in-production',
  
  // Password Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_ATTEMPTS: parseInt(process.env.RATE_LIMIT_MAX_ATTEMPTS || '5', 10),
  
  // Account Lockout
  MAX_FAILED_ATTEMPTS: parseInt(process.env.MAX_FAILED_ATTEMPTS || '5', 10),
  LOCKOUT_DURATION_MS: parseInt(process.env.LOCKOUT_DURATION_MS || '1800000', 10), // 30 minutes
  
  // Email Configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  FROM_EMAIL: process.env.FROM_EMAIL || 'noreply@weatherapp.com',
  
  // Frontend URL
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // Redis Configuration (for session storage)
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Database
  DATABASE_PATH: process.env.DATABASE_PATH || './weather_auth.db',
} as const;

// Validation for required environment variables in production
if (ENV.NODE_ENV === 'production') {
  const requiredVars = ['JWT_SECRET', 'SESSION_SECRET', 'SMTP_USER', 'SMTP_PASS'];
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Required environment variable ${varName} is not set`);
    }
  }
}