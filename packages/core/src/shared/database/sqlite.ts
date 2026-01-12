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

  constructor(config: { path: string }) {
    if (!config) {
      throw new Error('SQLite configuration is required');
    }
    this.dbPath = this.expandPath(config.path);
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

    // Ensure directory exists
    const dbDir = path.dirname(this.dbPath);
    await fs.ensureDir(dbDir);

    // Create database connection
    this.db = new Database(this.dbPath, (err) => {
      if (err) {
        throw new Error(`Failed to connect to SQLite database: ${err.message}`);
      }
    });

    // Enable foreign keys
    await this.execute('PRAGMA foreign_keys = ON');
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

    return new Promise((resolve, reject) => {
      this.db!.all(sql, params, (err: Error | null, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as T[]);
        }
      });
    });
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

