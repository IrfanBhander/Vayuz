/**
 * Authentication Routes
 * 
 * RESTful API endpoints for user authentication and account management.
 */

import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from '../services/userService';
import {
  authRateLimit,
  validateRegistration,
  validateLogin,
  validatePasswordReset,
  validateNewPassword,
  handleValidationErrors,
  authenticateToken,
  csrfProtection
} from '../middleware/auth';

const router = Router();
const userService = new UserService();

/**
 * POST /api/auth/register
 * Register a new user account
 */
router.post('/register',
  authRateLimit,
  validateRegistration,
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName } = req.body;

      const result = await userService.createUser({
        email,
        password,
        firstName,
        lastName
      });

      if (result.success) {
        res.status(201).json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed. Please try again.'
      });
    }
  }
);

/**
 * POST /api/auth/login
 * Authenticate user login
 */
router.post('/login',
  authRateLimit,
  validateLogin,
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, rememberMe, twoFactorCode } = req.body;
      const ipAddress = req.ip || 'unknown';
      const userAgent = req.get('User-Agent') || 'unknown';

      const result = await userService.authenticateUser(
        email,
        password,
        ipAddress,
        userAgent,
        twoFactorCode
      );

      if (result.success && result.token) {
        // Set secure HTTP-only cookie for token
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict' as const,
          maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000 // 30 days or 1 day
        };

        res.cookie('authToken', result.token, cookieOptions);

        res.json({
          success: true,
          message: 'Login successful',
          user: result.user,
          token: result.token // Also return in response for client-side storage if needed
        });
      } else {
        res.status(401).json({
          success: false,
          message: result.message,
          requiresTwoFactor: result.requiresTwoFactor
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed. Please try again.'
      });
    }
  }
);

/**
 * POST /api/auth/logout
 * Logout user and invalidate session
 */
router.post('/logout',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Clear the authentication cookie
      res.clearCookie('authToken');

      // In a production app, you might want to blacklist the JWT token
      // or store active sessions in Redis and remove them here

      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed. Please try again.'
      });
    }
  }
);

/**
 * GET /api/auth/verify-email
 * Verify user email address
 */
router.get('/verify-email',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== 'string') {
        res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
        return;
      }

      const result = await userService.verifyEmail(token);

      if (result.success) {
        res.json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Email verification failed. Please try again.'
      });
    }
  }
);

/**
 * POST /api/auth/forgot-password
 * Initiate password reset process
 */
router.post('/forgot-password',
  authRateLimit,
  validatePasswordReset,
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      const result = await userService.initiatePasswordReset(email);

      // Always return success to prevent email enumeration
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error('Password reset initiation error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset failed. Please try again.'
      });
    }
  }
);

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password',
  authRateLimit,
  validateNewPassword,
  handleValidationErrors,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;

      const result = await userService.resetPassword(token, password);

      if (result.success) {
        res.json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset failed. Please try again.'
      });
    }
  }
);

/**
 * GET /api/auth/me
 * Get current user information
 */
router.get('/me',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await userService.findById(req.user!.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          isVerified: user.is_verified,
          twoFactorEnabled: user.two_factor_enabled,
          lastLogin: user.last_login,
          createdAt: user.created_at
        }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user information'
      });
    }
  }
);

/**
 * POST /api/auth/setup-2fa
 * Setup two-factor authentication
 */
router.post('/setup-2fa',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await userService.setupTwoFactor(req.user!.id);

      if (result.success) {
        res.json({
          success: true,
          secret: result.secret,
          qrCode: result.qrCode,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('2FA setup error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to setup two-factor authentication'
      });
    }
  }
);

/**
 * POST /api/auth/enable-2fa
 * Enable two-factor authentication
 */
router.post('/enable-2fa',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { verificationCode } = req.body;

      if (!verificationCode) {
        res.status(400).json({
          success: false,
          message: 'Verification code is required'
        });
        return;
      }

      const result = await userService.enableTwoFactor(req.user!.id, verificationCode);

      if (result.success) {
        res.json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('2FA enable error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to enable two-factor authentication'
      });
    }
  }
);

/**
 * POST /api/auth/disable-2fa
 * Disable two-factor authentication
 */
router.post('/disable-2fa',
  authenticateToken,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { password } = req.body;

      if (!password) {
        res.status(400).json({
          success: false,
          message: 'Password is required'
        });
        return;
      }

      const result = await userService.disableTwoFactor(req.user!.id, password);

      if (result.success) {
        res.json({
          success: true,
          message: result.message
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      console.error('2FA disable error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to disable two-factor authentication'
      });
    }
  }
);

/**
 * GET /api/auth/csrf-token
 * Get CSRF token for forms
 */
router.get('/csrf-token',
  (req: Request, res: Response): void => {
    const token = uuidv4();
    req.session!.csrfToken = token;
    
    res.json({
      success: true,
      csrfToken: token
    });
  }
);

export default router;