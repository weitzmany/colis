/**
 * Shared Database Repository Interface
 * 
 * Provides a database-agnostic interface for database operations.
 * Implementations can use SQLite, MySQL, PostgreSQL, etc.
 */

export interface Transaction {
  query<T>(sql: string, params?: any[]): Promise<T[]>;
  execute(sql: string, params?: any[]): Promise<void>;
  commit(): Promise<void>;
  rollback(): Promise<void>;
}

export interface DatabaseRepository {
  /**
   * Connect to the database
   */
  connect(): Promise<void>;

  /**
   * Disconnect from the database
   */
  disconnect(): Promise<void>;

  /**
   * Execute a query and return results
   */
  query<T>(sql: string, params?: any[]): Promise<T[]>;

  /**
   * Execute a statement (INSERT, UPDATE, DELETE)
   */
  execute(sql: string, params?: any[]): Promise<void>;

  /**
   * Execute multiple statements in a transaction
   */
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

  /**
   * Check if database connection is active
   */
  isConnected(): boolean;

  /**
   * Get database type
   */
  getType(): 'sqlite' | 'mysql' | 'postgresql';
}

export interface DatabaseConfig {
  type: 'sqlite' | 'mysql' | 'postgresql';
  sqlite?: {
    path: string;
  };
  mysql?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    connectionLimit?: number;
  };
  postgresql?: {
    host: string;
    port: number;
    database: string;
    user: string;
    password: string;
    max?: number;
  };
}




