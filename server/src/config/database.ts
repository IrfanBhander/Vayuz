/**
 * Database Configuration and Schema
 * 
 * This file contains the database schema and configuration for user management.
 * Using SQLite for simplicity, but can be easily adapted to PostgreSQL/MySQL.
 */

import { Database } from 'sqlite3';
import { promisify } from 'util';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  verification_token?: string;
  reset_token?: string;
  reset_token_expires?: Date;
  two_factor_secret?: string;
  two_factor_enabled: boolean;
  failed_login_attempts: number;
  locked_until?: Date;
  last_login?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
  user_agent?: string;
  ip_address?: string;
}

export class DatabaseManager {
  private db: Database;

  constructor(dbPath: string = './weather_auth.db') {
    this.db = new Database(dbPath);
    this.initializeTables();
  }

  private async initializeTables(): Promise<void> {
    const run = promisify(this.db.run.bind(this.db));

    // Users table with comprehensive security fields
    await run(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        is_verified BOOLEAN DEFAULT FALSE,
        verification_token TEXT,
        reset_token TEXT,
        reset_token_expires DATETIME,
        two_factor_secret TEXT,
        two_factor_enabled BOOLEAN DEFAULT FALSE,
        failed_login_attempts INTEGER DEFAULT 0,
        locked_until DATETIME,
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sessions table for secure session management
    await run(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        token TEXT UNIQUE NOT NULL,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_agent TEXT,
        ip_address TEXT,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Login attempts table for rate limiting and security monitoring
    await run(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        ip_address TEXT NOT NULL,
        success BOOLEAN NOT NULL,
        attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        user_agent TEXT
      )
    `);

    // Indexes for performance
    await run(`CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions (token)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions (user_id)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts (email)`);
    await run(`CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts (ip_address)`);
  }

  public getDatabase(): Database {
    return this.db;
  }

  public async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export const dbManager = new DatabaseManager();