/**
 * Shared Database Repository Interface
 * 
 * Provides a database-agnostic interface for database operations.
 * Implements the Repository pattern to abstract database-specific implementations.
 * Supports SQLite, MySQL, PostgreSQL, and other database backends.
 * 
 * @packageDocumentation
 * @module @your-org/core/shared/database
 */

/**
 * Database transaction interface
 * 
 * Represents an active database transaction that can execute queries
 * and be committed or rolled back atomically.
 */
export interface Transaction {
  /**
   * Execute a query within the transaction and return results
   * 
   * @param sql - SQL query string (with optional placeholders)
   * @param params - Query parameters (for placeholders)
   * @returns Promise resolving to array of result rows
   */
  query<T>(sql: string, params?: any[]): Promise<T[]>;

  /**
   * Execute a statement (INSERT, UPDATE, DELETE) within the transaction
   * 
   * @param sql - SQL statement string (with optional placeholders)
   * @param params - Statement parameters (for placeholders)
   * @returns Promise that resolves when statement completes
   */
  execute(sql: string, params?: any[]): Promise<void>;

  /**
   * Commit the transaction (make changes permanent)
   * 
   * @returns Promise that resolves when commit completes
   */
  commit(): Promise<void>;

  /**
   * Rollback the transaction (discard changes)
   * 
   * @returns Promise that resolves when rollback completes
   */
  rollback(): Promise<void>;
}

/**
 * Database repository interface
 * 
 * Provides a database-agnostic interface for database operations.
 * Implementations handle connection management, query execution, and transactions.
 * 
 * @example
 * ```typescript
 * const repo = DatabaseFactory.create({ type: 'sqlite', sqlite: { path: 'db.sqlite' } });
 * await repo.connect();
 * const results = await repo.query<User>('SELECT * FROM users WHERE id = ?', [1]);
 * await repo.disconnect();
 * ```
 */
export interface DatabaseRepository {
  /**
   * Connect to the database
   * 
   * Establishes a connection to the database. Must be called before
   * executing queries or transactions.
   * 
   * @returns Promise that resolves when connection is established
   * @throws Error if connection fails
   */
  connect(): Promise<void>;

  /**
   * Disconnect from the database
   * 
   * Closes the database connection and releases resources.
   * Safe to call even if not connected.
   * 
   * @returns Promise that resolves when disconnection completes
   */
  disconnect(): Promise<void>;

  /**
   * Execute a query and return results
   * 
   * Executes a SELECT query and returns the result rows.
   * 
   * @param sql - SQL query string (with optional placeholders like ? or $1)
   * @param params - Query parameters (for placeholders)
   * @returns Promise resolving to array of result rows
   * @throws Error if database is not connected or query fails
   * 
   * @example
   * ```typescript
   * const users = await repo.query<User>('SELECT * FROM users WHERE age > ?', [18]);
   * ```
   */
  query<T>(sql: string, params?: any[]): Promise<T[]>;

  /**
   * Execute a statement (INSERT, UPDATE, DELETE)
   * 
   * Executes a data modification statement that doesn't return rows.
   * 
   * @param sql - SQL statement string (with optional placeholders)
   * @param params - Statement parameters (for placeholders)
   * @returns Promise that resolves when statement completes
   * @throws Error if database is not connected or statement fails
   * 
   * @example
   * ```typescript
   * await repo.execute('INSERT INTO users (name, email) VALUES (?, ?)', ['John', 'john@example.com']);
   * ```
   */
  execute(sql: string, params?: any[]): Promise<void>;

  /**
   * Execute multiple statements in a transaction
   * 
   * Executes a function that performs multiple database operations atomically.
   * If the function throws an error, the transaction is automatically rolled back.
   * 
   * @param fn - Function that receives a Transaction object and performs operations
   * @returns Promise resolving to the return value of fn
   * @throws Error if transaction fails or fn throws an error
   * 
   * @example
   * ```typescript
   * await repo.transaction(async (tx) => {
   *   await tx.execute('INSERT INTO users (name) VALUES (?)', ['John']);
   *   await tx.execute('INSERT INTO profiles (user_id) VALUES (?)', [userId]);
   * });
   * ```
   */
  transaction<T>(fn: (tx: Transaction) => Promise<T>): Promise<T>;

  /**
   * Check if database connection is active
   * 
   * @returns true if connected, false otherwise
   */
  isConnected(): boolean;

  /**
   * Health check - verify database connection is alive
   * 
   * Performs a lightweight query to verify the database connection is active
   * and responsive. Useful for health checks and connection validation.
   * 
   * @returns Promise resolving to true if connection is healthy, false otherwise
   * @throws Error if health check fails
   * 
   * @example
   * ```typescript
   * const isHealthy = await repo.healthCheck();
   * if (!isHealthy) {
   *   await repo.reconnect();
   * }
   * ```
   */
  healthCheck(): Promise<boolean>;

  /**
   * Reconnect to database
   * 
   * Closes existing connection (if any) and establishes a new connection.
   * Useful for recovering from connection failures.
   * 
   * @returns Promise that resolves when reconnection completes
   * @throws Error if reconnection fails
   */
  reconnect(): Promise<void>;

  /**
   * Get database type
   * 
   * @returns Database type identifier ('sqlite', 'mysql', or 'postgresql')
   */
  getType(): 'sqlite' | 'mysql' | 'postgresql';
}

/**
 * Database configuration
 * 
 * Configuration object for database repository creation.
 * The type field determines which database backend to use,
 * and the corresponding configuration object must be provided.
 * 
 * @example SQLite configuration
 * ```typescript
 * const config: DatabaseConfig = {
 *   type: 'sqlite',
 *   sqlite: { path: '~/.port-manager/registry.db' }
 * };
 * ```
 * 
 * @example MySQL configuration
 * ```typescript
 * const config: DatabaseConfig = {
 *   type: 'mysql',
 *   mysql: {
 *     host: 'localhost',
 *     port: 3306,
 *     database: 'mydb',
 *     user: 'user',
 *     password: 'password',
 *     connectionLimit: 10
 *   }
 * };
 * ```
 */
export interface DatabaseConfig {
  /** Database type - determines which backend to use */
  type: 'sqlite' | 'mysql' | 'postgresql';
  /** SQLite-specific configuration (required when type is 'sqlite') */
  sqlite?: {
    /** Path to SQLite database file (supports ~ for home directory) */
    path: string;
    /** Connection retry configuration (optional) */
    retry?: {
      maxAttempts?: number;
      initialDelay?: number;
      maxDelay?: number;
      backoffMultiplier?: number;
    };
    /** Connection timeout configuration (optional) */
    timeout?: {
      connect?: number;
      query?: number;
    };
  };
  /** MySQL-specific configuration (required when type is 'mysql') */
  mysql?: {
    /** Database server hostname */
    host: string;
    /** Database server port */
    port: number;
    /** Database name */
    database: string;
    /** Database user */
    user: string;
    /** Database password */
    password: string;
    /** Maximum number of connections in pool (optional) */
    connectionLimit?: number;
  };
  /** PostgreSQL-specific configuration (required when type is 'postgresql') */
  postgresql?: {
    /** Database server hostname */
    host: string;
    /** Database server port */
    port: number;
    /** Database name */
    database: string;
    /** Database user */
    user: string;
    /** Database password */
    password: string;
    /** Maximum number of connections in pool (optional) */
    max?: number;
  };
  /** Connection retry configuration (optional, applies to all database types) */
  retry?: {
    /** Maximum number of retry attempts (default: 3) */
    maxAttempts?: number;
    /** Initial delay between retries in milliseconds (default: 1000) */
    initialDelay?: number;
    /** Maximum delay between retries in milliseconds (default: 10000) */
    maxDelay?: number;
    /** Multiplier for exponential backoff (default: 2) */
    backoffMultiplier?: number;
  };
  /** Connection timeout configuration (optional, applies to all database types) */
  timeout?: {
    /** Connection timeout in milliseconds (default: 30000) */
    connect?: number;
    /** Query timeout in milliseconds (default: 30000) */
    query?: number;
  };
}




