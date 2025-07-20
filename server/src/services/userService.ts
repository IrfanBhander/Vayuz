/**
 * User Service
 * 
 * Core business logic for user management, authentication, and security.
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { promisify } from 'util';
import { dbManager, User } from '../config/database';
import { ENV } from '../config/environment';
import { EmailService } from './emailService';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginResult {
  success: boolean;
  user?: Partial<User>;
  token?: string;
  requiresTwoFactor?: boolean;
  message?: string;
}

export class UserService {
  private db = dbManager.getDatabase();
  private emailService = new EmailService();

  /**
   * Create a new user account with email verification
   */
  async createUser(userData: CreateUserData): Promise<{ success: boolean; message: string }> {
    const { email, password, firstName, lastName } = userData;

    try {
      // Check if user already exists
      const existingUser = await this.findByEmail(email);
      if (existingUser) {
        return { success: false, message: 'An account with this email already exists' };
      }

      // Hash password with bcrypt
      const passwordHash = await bcrypt.hash(password, ENV.BCRYPT_ROUNDS);
      
      // Generate verification token
      const verificationToken = uuidv4();
      
      // Create user record
      const userId = uuidv4();
      const run = promisify(this.db.run.bind(this.db));
      
      await run(
        `INSERT INTO users (
          id, email, password_hash, first_name, last_name, 
          verification_token, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
        [userId, email, passwordHash, firstName, lastName, verificationToken]
      );

      // Send verification email
      await this.emailService.sendVerificationEmail(email, verificationToken, firstName);

      return { 
        success: true, 
        message: 'Account created successfully. Please check your email to verify your account.' 
      };

    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, message: 'Failed to create account. Please try again.' };
    }
  }

  /**
   * Authenticate user login with security checks
   */
  async authenticateUser(
    email: string, 
    password: string, 
    ipAddress: string, 
    userAgent: string,
    twoFactorCode?: string
  ): Promise<LoginResult> {
    try {
      // Log login attempt
      await this.logLoginAttempt(email, ipAddress, userAgent, false);

      // Find user by email
      const user = await this.findByEmail(email);
      if (!user) {
        return { success: false, message: 'Invalid email or password' };
      }

      // Check if account is locked
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        const unlockTime = new Date(user.locked_until).toLocaleString();
        return { 
          success: false, 
          message: `Account is locked due to too many failed attempts. Try again after ${unlockTime}` 
        };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        await this.handleFailedLogin(user.id);
        return { success: false, message: 'Invalid email or password' };
      }

      // Check if account is verified
      if (!user.is_verified) {
        return { 
          success: false, 
          message: 'Please verify your email address before logging in' 
        };
      }

      // Handle two-factor authentication
      if (user.two_factor_enabled) {
        if (!twoFactorCode) {
          return { 
            success: false, 
            requiresTwoFactor: true, 
            message: 'Two-factor authentication code required' 
          };
        }

        const isValidTwoFactor = speakeasy.totp.verify({
          secret: user.two_factor_secret!,
          encoding: 'base32',
          token: twoFactorCode,
          window: 2 // Allow 2 time steps of variance
        });

        if (!isValidTwoFactor) {
          await this.handleFailedLogin(user.id);
          return { success: false, message: 'Invalid two-factor authentication code' };
        }
      }

      // Reset failed attempts and update last login
      await this.resetFailedAttempts(user.id);
      await this.updateLastLogin(user.id);

      // Log successful login
      await this.logLoginAttempt(email, ipAddress, userAgent, true);

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        ENV.JWT_SECRET,
        { expiresIn: ENV.JWT_EXPIRES_IN }
      );

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          two_factor_enabled: user.two_factor_enabled
        },
        token
      };

    } catch (error) {
      console.error('Error authenticating user:', error);
      return { success: false, message: 'Authentication failed. Please try again.' };
    }
  }

  /**
   * Verify email address with token
   */
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const run = promisify(this.db.run.bind(this.db));
      const get = promisify(this.db.get.bind(this.db));

      // Find user with verification token
      const user = await get(
        'SELECT * FROM users WHERE verification_token = ?',
        [token]
      ) as User | undefined;

      if (!user) {
        return { success: false, message: 'Invalid or expired verification token' };
      }

      if (user.is_verified) {
        return { success: false, message: 'Email address is already verified' };
      }

      // Update user as verified
      await run(
        `UPDATE users SET 
          is_verified = TRUE, 
          verification_token = NULL, 
          updated_at = datetime('now') 
        WHERE id = ?`,
        [user.id]
      );

      return { success: true, message: 'Email address verified successfully' };

    } catch (error) {
      console.error('Error verifying email:', error);
      return { success: false, message: 'Email verification failed. Please try again.' };
    }
  }

  /**
   * Initiate password reset process
   */
  async initiatePasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return { 
          success: true, 
          message: 'If an account with this email exists, you will receive a password reset link.' 
        };
      }

      // Generate reset token with expiration
      const resetToken = uuidv4();
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

      const run = promisify(this.db.run.bind(this.db));
      await run(
        `UPDATE users SET 
          reset_token = ?, 
          reset_token_expires = ?, 
          updated_at = datetime('now') 
        WHERE id = ?`,
        [resetToken, expiresAt.toISOString(), user.id]
      );

      // Send password reset email
      await this.emailService.sendPasswordResetEmail(email, resetToken, user.first_name);

      return { 
        success: true, 
        message: 'If an account with this email exists, you will receive a password reset link.' 
      };

    } catch (error) {
      console.error('Error initiating password reset:', error);
      return { success: false, message: 'Failed to initiate password reset. Please try again.' };
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const get = promisify(this.db.get.bind(this.db));
      const run = promisify(this.db.run.bind(this.db));

      // Find user with valid reset token
      const user = await get(
        `SELECT * FROM users 
         WHERE reset_token = ? 
         AND reset_token_expires > datetime('now')`,
        [token]
      ) as User | undefined;

      if (!user) {
        return { success: false, message: 'Invalid or expired reset token' };
      }

      // Hash new password
      const passwordHash = await bcrypt.hash(newPassword, ENV.BCRYPT_ROUNDS);

      // Update password and clear reset token
      await run(
        `UPDATE users SET 
          password_hash = ?, 
          reset_token = NULL, 
          reset_token_expires = NULL,
          failed_login_attempts = 0,
          locked_until = NULL,
          updated_at = datetime('now') 
        WHERE id = ?`,
        [passwordHash, user.id]
      );

      return { success: true, message: 'Password reset successfully' };

    } catch (error) {
      console.error('Error resetting password:', error);
      return { success: false, message: 'Failed to reset password. Please try again.' };
    }
  }

  /**
   * Setup two-factor authentication
   */
  async setupTwoFactor(userId: string): Promise<{ success: boolean; secret?: string; qrCode?: string; message: string }> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Generate secret for 2FA
      const secret = speakeasy.generateSecret({
        name: `Weather App (${user.email})`,
        issuer: 'Weather App'
      });

      // Generate QR code
      const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

      // Store secret (not yet enabled)
      const run = promisify(this.db.run.bind(this.db));
      await run(
        'UPDATE users SET two_factor_secret = ?, updated_at = datetime(\'now\') WHERE id = ?',
        [secret.base32, userId]
      );

      return {
        success: true,
        secret: secret.base32,
        qrCode,
        message: 'Two-factor authentication setup initiated'
      };

    } catch (error) {
      console.error('Error setting up 2FA:', error);
      return { success: false, message: 'Failed to setup two-factor authentication' };
    }
  }

  /**
   * Enable two-factor authentication after verification
   */
  async enableTwoFactor(userId: string, verificationCode: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.findById(userId);
      if (!user || !user.two_factor_secret) {
        return { success: false, message: 'Two-factor setup not found' };
      }

      // Verify the code
      const isValid = speakeasy.totp.verify({
        secret: user.two_factor_secret,
        encoding: 'base32',
        token: verificationCode,
        window: 2
      });

      if (!isValid) {
        return { success: false, message: 'Invalid verification code' };
      }

      // Enable 2FA
      const run = promisify(this.db.run.bind(this.db));
      await run(
        'UPDATE users SET two_factor_enabled = TRUE, updated_at = datetime(\'now\') WHERE id = ?',
        [userId]
      );

      return { success: true, message: 'Two-factor authentication enabled successfully' };

    } catch (error) {
      console.error('Error enabling 2FA:', error);
      return { success: false, message: 'Failed to enable two-factor authentication' };
    }
  }

  /**
   * Disable two-factor authentication
   */
  async disableTwoFactor(userId: string, password: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = await this.findById(userId);
      if (!user) {
        return { success: false, message: 'User not found' };
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return { success: false, message: 'Invalid password' };
      }

      // Disable 2FA
      const run = promisify(this.db.run.bind(this.db));
      await run(
        `UPDATE users SET 
          two_factor_enabled = FALSE, 
          two_factor_secret = NULL, 
          updated_at = datetime('now') 
        WHERE id = ?`,
        [userId]
      );

      return { success: true, message: 'Two-factor authentication disabled successfully' };

    } catch (error) {
      console.error('Error disabling 2FA:', error);
      return { success: false, message: 'Failed to disable two-factor authentication' };
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const get = promisify(this.db.get.bind(this.db));
      const user = await get('SELECT * FROM users WHERE email = ?', [email]) as User | undefined;
      return user || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    try {
      const get = promisify(this.db.get.bind(this.db));
      const user = await get('SELECT * FROM users WHERE id = ?', [id]) as User | undefined;
      return user || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  /**
   * Handle failed login attempt
   */
  private async handleFailedLogin(userId: string): Promise<void> {
    try {
      const run = promisify(this.db.run.bind(this.db));
      const get = promisify(this.db.get.bind(this.db));

      // Increment failed attempts
      await run(
        'UPDATE users SET failed_login_attempts = failed_login_attempts + 1, updated_at = datetime(\'now\') WHERE id = ?',
        [userId]
      );

      // Check if account should be locked
      const user = await get('SELECT failed_login_attempts FROM users WHERE id = ?', [userId]) as { failed_login_attempts: number } | undefined;
      
      if (user && user.failed_login_attempts >= ENV.MAX_FAILED_ATTEMPTS) {
        const lockUntil = new Date(Date.now() + ENV.LOCKOUT_DURATION_MS);
        await run(
          'UPDATE users SET locked_until = ?, updated_at = datetime(\'now\') WHERE id = ?',
          [lockUntil.toISOString(), userId]
        );
      }
    } catch (error) {
      console.error('Error handling failed login:', error);
    }
  }

  /**
   * Reset failed login attempts
   */
  private async resetFailedAttempts(userId: string): Promise<void> {
    try {
      const run = promisify(this.db.run.bind(this.db));
      await run(
        'UPDATE users SET failed_login_attempts = 0, locked_until = NULL, updated_at = datetime(\'now\') WHERE id = ?',
        [userId]
      );
    } catch (error) {
      console.error('Error resetting failed attempts:', error);
    }
  }

  /**
   * Update last login timestamp
   */
  private async updateLastLogin(userId: string): Promise<void> {
    try {
      const run = promisify(this.db.run.bind(this.db));
      await run(
        'UPDATE users SET last_login = datetime(\'now\'), updated_at = datetime(\'now\') WHERE id = ?',
        [userId]
      );
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  }

  /**
   * Log login attempt for security monitoring
   */
  private async logLoginAttempt(email: string, ipAddress: string, userAgent: string, success: boolean): Promise<void> {
    try {
      const run = promisify(this.db.run.bind(this.db));
      await run(
        'INSERT INTO login_attempts (email, ip_address, success, user_agent) VALUES (?, ?, ?, ?)',
        [email, ipAddress, success, userAgent]
      );
    } catch (error) {
      console.error('Error logging login attempt:', error);
    }
  }
}