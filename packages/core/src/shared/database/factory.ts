/**
 * Database Factory
 * 
 * Creates database repository instances based on configuration.
 * Implements the Factory pattern to select the appropriate database implementation
 * at runtime based on configuration.
 * 
 * This factory abstracts the creation of database repositories, allowing
 * the application to work with different database backends without changing
 * business logic.
 * 
 * @example
 * ```typescript
 * // Create SQLite repository
 * const sqliteRepo = DatabaseFactory.create({
 *   type: 'sqlite',
 *   sqlite: { path: '~/.port-manager/registry.db' }
 * });
 * 
 * // Create MySQL repository
 * const mysqlRepo = DatabaseFactory.create({
 *   type: 'mysql',
 *   mysql: {
 *     host: 'localhost',
 *     port: 3306,
 *     database: 'mydb',
 *     user: 'user',
 *     password: 'password'
 *   }
 * });
 * ```
 */

import { DatabaseRepository, DatabaseConfig } from './repository.js';
import { SQLiteRepository } from './sqlite.js';
import { MySQLRepository } from './mysql.js';
import { PostgreSQLRepository } from './postgresql.js';

/**
 * Database Factory
 * 
 * Factory class for creating database repository instances.
 * Uses the Factory pattern to create appropriate repository implementations
 * based on configuration.
 */
export class DatabaseFactory {
  /**
   * Create a database repository instance based on configuration
   * 
   * Creates and returns a database repository instance for the specified
   * database type. The configuration must include the appropriate database-specific
   * configuration object.
   * 
   * @param config - Database configuration specifying type and connection details
   * @returns Database repository instance implementing DatabaseRepository interface
   * @throws Error if database type is unsupported or required configuration is missing
   * 
   * @example
   * ```typescript
   * const repo = DatabaseFactory.create({
   *   type: 'sqlite',
   *   sqlite: { path: 'db.sqlite' }
   * });
   * await repo.connect();
   * ```
   */
  static create(config: DatabaseConfig): DatabaseRepository {
    switch (config.type) {
      case 'sqlite':
        if (!config.sqlite) {
          throw new Error('SQLite configuration is required when type is sqlite');
        }
        return new SQLiteRepository({
          ...config.sqlite,
          retry: config.sqlite.retry ?? config.retry,
          timeout: config.sqlite.timeout ?? config.timeout,
        });

      case 'mysql':
        if (!config.mysql) {
          throw new Error('MySQL configuration is required when type is mysql');
        }
        return new MySQLRepository(config.mysql);

      case 'postgresql':
        if (!config.postgresql) {
          throw new Error('PostgreSQL configuration is required when type is postgresql');
        }
        return new PostgreSQLRepository(config.postgresql);

      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }

  /**
   * Create default SQLite repository (for local development)
   * 
   * Creates a SQLite repository with default configuration suitable for
   * local development. Uses the default port manager database path.
   * 
   * @returns SQLite database repository instance with default configuration
   * 
   * @example
   * ```typescript
   * const repo = DatabaseFactory.createDefault();
   * await repo.connect();
   * ```
   */
  static createDefault(): DatabaseRepository {
    return new SQLiteRepository({
      path: '~/.port-manager/registry.db',
    });
  }
}




