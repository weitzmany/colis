/**
 * SQLite Database Repository Implementation
 * 
 * Implements DatabaseRepository interface for SQLite database.
 */

import sqlite3 from 'sqlite3';
import * as fs from 'fs-extra';
import * as path from 'path';
import { DatabaseRepository, Transaction } from './repository.js';

const { Database } = sqlite3;
type DatabaseType = typeof Database;

export class SQLiteRepository implements DatabaseRepository {
  private db: InstanceType<DatabaseType> | null = null;
  private dbPath: string;
  private retryConfig: {
    maxAttempts: number;
    initialDelay: number;
    maxDelay: number;
    backoffMultiplier: number;
  };
  private timeoutConfig: {
    connect: number;
    query: number;
  };

  constructor(config: { path: string; retry?: any; timeout?: any }) {
    if (!config) {
      throw new Error('SQLite configuration is required');
    }
    this.dbPath = this.expandPath(config.path);
    this.retryConfig = {
      maxAttempts: config.retry?.maxAttempts ?? 3,
      initialDelay: config.retry?.initialDelay ?? 1000,
      maxDelay: config.retry?.maxDelay ?? 10000,
      backoffMultiplier: config.retry?.backoffMultiplier ?? 2,
    };
    this.timeoutConfig = {
      connect: config.timeout?.connect ?? 30000,
      query: config.timeout?.query ?? 30000,
    };
  }

  private expandPath(filePath: string): string {
    if (filePath.startsWith('~')) {
      const homeDir = process.env.HOME || process.env.USERPROFILE || '';
      return path.join(homeDir, filePath.slice(1));
    }
    return path.resolve(filePath);
  }

  async connect(): Promise<void> {
    if (this.db) {
      return;
    }

    // Retry connection with exponential backoff
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= this.retryConfig.maxAttempts; attempt++) {
      try {
        // Ensure directory exists
        const dbDir = path.dirname(this.dbPath);
        await fs.ensureDir(dbDir);

        // Create database connection with timeout
        await Promise.race([
          new Promise<void>((resolve, reject) => {
            this.db = new Database(this.dbPath, (err) => {
              if (err) {
                reject(new Error(`Failed to connect to SQLite database: ${err.message}`));
              } else {
                resolve();
              }
            });
          }),
          new Promise<void>((_, reject) => {
            setTimeout(() => reject(new Error('Connection timeout')), this.timeoutConfig.connect);
          }),
        ]);

        // Enable foreign keys
        await this.execute('PRAGMA foreign_keys = ON');
        return;
      } catch (error: any) {
        lastError = error;
        if (attempt < this.retryConfig.maxAttempts) {
          const delay = Math.min(
            this.retryConfig.initialDelay * Math.pow(this.retryConfig.backoffMultiplier, attempt - 1),
            this.retryConfig.maxDelay
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Failed to connect to SQLite database');
  }

  async disconnect(): Promise<void> {
    if (!this.db) {
      return;
    }

    return new Promise((resolve, reject) => {
      this.db!.close((err) => {
        if (err) {
          reject(err);
        } else {
          this.db = null;
          resolve();
        }
      });
    });
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    return Promise.race([
      new Promise<T[]>((resolve, reject) => {
        this.db!.all(sql, params, (err: Error | null, rows: any[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows as T[]);
          }
        });
      }),
      new Promise<T[]>((_, reject) => {
        setTimeout(() => reject(new Error('Query timeout')), this.timeoutConfig.query);
      }),
    ]);
  }

  async execute(sql: string, params: any[] = []): Promise<void> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    return new Promise((resolve, reject) => {
      this.db!.run(sql, params, function (err: Error | null) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    await this.execute('BEGIN TRANSACTION');

    const tx: Transaction = {
      query: async <T>(sql: string, params: any[] = []): Promise<T[]> => {
        return this.query<T>(sql, params);
      },
      execute: async (sql: string, params: any[] = []): Promise<void> => {
        return this.execute(sql, params);
      },
      commit: async (): Promise<void> => {
        await this.execute('COMMIT');
      },
      rollback: async (): Promise<void> => {
        await this.execute('ROLLBACK');
      },
    };

    try {
      const result = await fn(tx);
      await this.execute('COMMIT');
      return result;
    } catch (error) {
      await this.execute('ROLLBACK');
      throw error;
    }
  }

  isConnected(): boolean {
    return this.db !== null;
  }

  async healthCheck(): Promise<boolean> {
    if (!this.db) {
      return false;
    }

    try {
      await this.query('SELECT 1');
      return true;
    } catch {
      return false;
    }
  }

  async reconnect(): Promise<void> {
    await this.disconnect();
    await this.connect();
  }

  getType(): 'sqlite' {
    return 'sqlite';
  }

  /**
   * Get the database file path
   */
  getPath(): string {
    return this.dbPath;
  }
}

