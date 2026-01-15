/**
 * Database Migration System
 * 
 * Handles versioned database schema migrations.
 * Provides a structured way to manage database schema changes over time,
 * ensuring consistent schema across environments and enabling rollback capabilities.
 * 
 * Migrations are versioned and tracked in a `schema_migrations` table,
 * allowing the system to know which migrations have been applied.
 */

import { DatabaseRepository } from './repository.js';

/**
 * Database migration definition
 * 
 * Represents a single database schema migration with version, name,
 * and up/down migration functions.
 */
export interface Migration {
  /** Migration version number (must be unique and sequential) */
  version: number;
  /** Human-readable migration name */
  name: string;
  /** Function to apply the migration (upgrade schema) */
  up: (db: DatabaseRepository) => Promise<void>;
  /** Function to rollback the migration (downgrade schema) */
  down: (db: DatabaseRepository) => Promise<void>;
}

/**
 * Migration Manager
 * 
 * Manages database schema migrations, tracking applied migrations
 * and executing pending migrations in order.
 * 
 * @example
 * ```typescript
 * const manager = new MigrationManager(repository);
 * manager.register({
 *   version: 1,
 *   name: 'create_users_table',
 *   up: async (db) => {
 *     await db.execute('CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT)');
 *   },
 *   down: async (db) => {
 *     await db.execute('DROP TABLE users');
 *   }
 * });
 * await manager.migrate();
 * ```
 */
export class MigrationManager {
  private db: DatabaseRepository;
  private migrations: Migration[] = [];

  /**
   * Create a new migration manager
   * 
   * @param db - Database repository to use for migrations
   */
  constructor(db: DatabaseRepository) {
    this.db = db;
  }

  /**
   * Register a migration
   * 
   * Registers a migration with the manager. Migrations are automatically
   * sorted by version number.
   * 
   * @param migration - Migration definition to register
   * 
   * @example
   * ```typescript
   * manager.register({
   *   version: 1,
   *   name: 'initial_schema',
   *   up: async (db) => { /* ... *\/ },
   *   down: async (db) => { /* ... *\/ }
   * });
   * ```
   */
  register(migration: Migration): void {
    this.migrations.push(migration);
    this.migrations.sort((a, b) => a.version - b.version);
  }

  /**
   * Get current database version
   * 
   * Returns the highest migration version that has been applied to the database.
   * Returns 0 if no migrations have been applied.
   * 
   * @returns Promise resolving to current database version number
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
   * 
   * Creates the `schema_migrations` table if it doesn't exist.
   * This table tracks which migrations have been applied.
   * 
   * @returns Promise that resolves when initialization completes
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
   * 
   * Applies all migrations that haven't been applied yet, in version order.
   * Each migration runs in a transaction, so if one fails, it can be rolled back.
   * 
   * @returns Promise that resolves when all migrations are applied
   * @throws Error if any migration fails
   * 
   * @example
   * ```typescript
   * await manager.migrate();
   * // All pending migrations have been applied
   * ```
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
   * 
   * Rolls back the most recently applied migration by executing its `down` function
   * and removing it from the migration tracking table.
   * 
   * @returns Promise that resolves when rollback completes
   * @throws Error if no migrations have been applied or migration not found
   * 
   * @example
   * ```typescript
   * await manager.rollback();
   * // Last migration has been rolled back
   * ```
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
   * 
   * Returns a copy of all registered migrations, sorted by version.
   * 
   * @returns Array of all registered migrations
   */
  getMigrations(): Migration[] {
    return [...this.migrations];
  }
}




