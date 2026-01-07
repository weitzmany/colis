/**
 * Database Factory
 * 
 * Creates database repository instances based on configuration.
 * Uses Strategy pattern to select the appropriate database implementation.
 */

import { DatabaseRepository, DatabaseConfig } from './repository';
import { SQLiteRepository } from './sqlite';
import { MySQLRepository } from './mysql';
import { PostgreSQLRepository } from './postgresql';

export class DatabaseFactory {
  /**
   * Create a database repository instance based on configuration
   */
  static create(config: DatabaseConfig): DatabaseRepository {
    switch (config.type) {
      case 'sqlite':
        if (!config.sqlite) {
          throw new Error('SQLite configuration is required when type is sqlite');
        }
        return new SQLiteRepository(config.sqlite);

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
   */
  static createDefault(): DatabaseRepository {
    return new SQLiteRepository({
      path: '~/.port-manager/registry.db',
    });
  }
}




