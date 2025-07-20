/**
 * Email Service
 * 
 * Handles all email communications including verification and password reset.
 */

import nodemailer from 'nodemailer';
import { ENV } from '../config/environment';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: ENV.SMTP_HOST,
      port: ENV.SMTP_PORT,
      secure: ENV.SMTP_PORT === 465, // true for 465, false for other ports
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
    });
  }

  /**
   * Send email verification message
   */
  async sendVerificationEmail(email: string, token: string, firstName: string): Promise<void> {
    const verificationUrl = `${ENV.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: ENV.FROM_EMAIL,
      to: email,
      subject: 'Verify Your Weather App Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Account</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🌤️ Welcome to Weather App!</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName}!</h2>
              <p>Thank you for creating an account with Weather App. To complete your registration and start enjoying beautiful weather forecasts, please verify your email address.</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
              
              <p><strong>This verification link will expire in 24 hours.</strong></p>
              
              <p>If you didn't create this account, please ignore this email.</p>
              
              <p>Best regards,<br>The Weather App Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email');
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, token: string, firstName: string): Promise<void> {
    const resetUrl = `${ENV.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: ENV.FROM_EMAIL,
      to: email,
      subject: 'Reset Your Weather App Password',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName}!</h2>
              <p>We received a request to reset your Weather App password. If you made this request, click the button below to create a new password.</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
              
              <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul>
                  <li>This reset link will expire in 1 hour</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your password will remain unchanged until you create a new one</li>
                </ul>
              </div>
              
              <p>For your security, we recommend choosing a strong password that includes:</p>
              <ul>
                <li>At least 8 characters</li>
                <li>A mix of uppercase and lowercase letters</li>
                <li>Numbers and special characters</li>
              </ul>
              
              <p>Best regards,<br>The Weather App Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send two-factor authentication setup notification
   */
  async sendTwoFactorSetupEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: ENV.FROM_EMAIL,
      to: email,
      subject: 'Two-Factor Authentication Enabled',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Two-Factor Authentication Enabled</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Security Update</h1>
            </div>
            <div class="content">
              <h2>Hi ${firstName}!</h2>
              
              <div class="success">
                <strong>✅ Two-Factor Authentication Enabled</strong><br>
                Your account security has been enhanced with two-factor authentication.
              </div>
              
              <p>Two-factor authentication adds an extra layer of security to your Weather App account. From now on, you'll need to provide a verification code from your authenticator app when logging in.</p>
              
              <p><strong>What this means:</strong></p>
              <ul>
                <li>Your account is now more secure against unauthorized access</li>
                <li>You'll need your authenticator app to log in</li>
                <li>Keep your backup codes in a safe place</li>
              </ul>
              
              <p>If you didn't enable two-factor authentication, please contact our support team immediately.</p>
              
              <p>Best regards,<br>The Weather App Team</p>
            </div>
            <div class="footer">
              <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`2FA setup notification sent to ${email}`);
    } catch (error) {
      console.error('Error sending 2FA setup email:', error);
      // Don't throw error for notification emails
    }
  }
}