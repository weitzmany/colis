/**
 * Database Migration System
 * 
 * Handles versioned database schema migrations.
 */

import { DatabaseRepository } from './repository';

export interface Migration {
  version: number;
  name: string;
  up: (db: DatabaseRepository) => Promise<void>;
  down: (db: DatabaseRepository) => Promise<void>;
}

export class MigrationManager {
  private db: DatabaseRepository;
  private migrations: Migration[] = [];

  constructor(db: DatabaseRepository) {
    this.db = db;
  }

  /**
   * Register a migration
   */
  register(migration: Migration): void {
    this.migrations.push(migration);
    this.migrations.sort((a, b) => a.version - b.version);
  }

  /**
   * Get current database version
   */
  async getCurrentVersion(): Promise<number> {
    try {
      const result = await this.db.query<{ version: number }>(
        "SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1"
      );
      return result.length > 0 ? result[0].version : 0;
    } catch (error) {
      // Table doesn't exist, return 0
      return 0;
    }
  }

  /**
   * Initialize migration tracking table
   */
  async initialize(): Promise<void> {
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  /**
   * Run all pending migrations
   */
  async migrate(): Promise<void> {
    await this.initialize();

    const currentVersion = await this.getCurrentVersion();
    const pendingMigrations = this.migrations.filter((m) => m.version > currentVersion);

    if (pendingMigrations.length === 0) {
      return;
    }

    for (const migration of pendingMigrations) {
      await this.db.transaction(async (tx) => {
        await migration.up(this.db);
        await tx.execute(
          'INSERT INTO schema_migrations (version, name) VALUES (?, ?)',
          [migration.version, migration.name]
        );
      });
    }
  }

  /**
   * Rollback last migration
   */
  async rollback(): Promise<void> {
    await this.initialize();

    const currentVersion = await this.getCurrentVersion();
    if (currentVersion === 0) {
      return;
    }

    const migration = this.migrations.find((m) => m.version === currentVersion);
    if (!migration) {
      throw new Error(`Migration version ${currentVersion} not found`);
    }

    await this.db.transaction(async (tx) => {
      await migration.down(this.db);
      await tx.execute('DELETE FROM schema_migrations WHERE version = ?', [currentVersion]);
    });
  }

  /**
   * Get all registered migrations
   */
  getMigrations(): Migration[] {
    return [...this.migrations];
  }
}

