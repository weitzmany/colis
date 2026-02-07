/**
 * Global Configuration Manager
 * 
 * Manages global configuration stored at ~/.port-manager/config.json.
 * This configuration is shared across all projects and contains global
 * settings like database configuration and port ranges.
 * 
 * @packageDocumentation
 * @module @colis/rig/shared/config
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

/**
 * Global configuration interface
 * 
 * Represents the global configuration stored in the user's home directory.
 * This configuration applies to all projects using the core package.
 */
export interface GlobalConfig {
  /** Database configuration for port manager registry */
  database?: {
    /** Database type */
    type: 'sqlite' | 'mysql' | 'postgresql';
    /** SQLite-specific configuration */
    sqlite?: {
      /** Path to SQLite database file */
      path: string;
    };
    /** MySQL-specific configuration */
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
    };
    /** PostgreSQL-specific configuration */
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
    };
  };
  /** Port ranges for different app types */
  portRanges?: {
    /** App type name -> port range mapping */
    [key: string]: { start: number; end: number };
  };
  /** System-reserved ports that should not be allocated */
  reservedPorts?: Array<{ port: number; purpose: string }>;
}

const DEFAULT_CONFIG_PATH = path.join(os.homedir(), '.port-manager', 'config.json');

/**
 * Global Configuration Manager
 * 
 * Manages global configuration stored in the user's home directory.
 * Provides methods to load, save, and update global configuration.
 * 
 * @example
 * ```typescript
 * const manager = new GlobalConfigManager();
 * const config = await manager.load();
 * config.portRanges = { nextjs: { start: 3001, end: 3099 } };
 * await manager.save(config);
 * ```
 */
export class GlobalConfigManager {
  private configPath: string;
  private config: GlobalConfig | null = null;

  /**
   * Create a new global configuration manager
   * 
   * @param configPath - Path to configuration file (defaults to ~/.port-manager/config.json)
   */
  constructor(configPath: string = DEFAULT_CONFIG_PATH) {
    this.configPath = configPath;
  }

  /**
   * Get the configuration file path
   * 
   * @returns Absolute path to the configuration file
   */
  getConfigPath(): string {
    return this.configPath;
  }

  /**
   * Load configuration from file
   * 
   * Loads configuration from the file system. If the file doesn't exist,
   * returns default configuration. Caches the configuration in memory
   * for subsequent calls.
   * 
   * @returns Promise resolving to global configuration object
   * 
   * @example
   * ```typescript
   * const config = await manager.load();
   * console.log(config.portRanges);
   * ```
   */
  async load(): Promise<GlobalConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      if (await fs.pathExists(this.configPath)) {
        const content = await fs.readFile(this.configPath, 'utf-8');
        this.config = JSON.parse(content);
      } else {
        this.config = this.getDefaultConfig();
      }
    } catch (error) {
      this.config = this.getDefaultConfig();
    }

    return this.config!;
  }

  /**
   * Save configuration to file
   * 
   * Saves the configuration to the file system and updates the cached
   * configuration. Creates the directory if it doesn't exist.
   * 
   * @param config - Configuration object to save
   * @returns Promise that resolves when save completes
   * 
   * @example
   * ```typescript
   * await manager.save({
   *   database: { type: 'sqlite', sqlite: { path: '~/.port-manager/registry.db' } },
   *   portRanges: { nextjs: { start: 3001, end: 3099 } }
   * });
   * ```
   */
  async save(config: GlobalConfig): Promise<void> {
    this.config = config;
    const configDir = path.dirname(this.configPath);
    await fs.ensureDir(configDir);
    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
  }

  /**
   * Get default configuration
   * 
   * Returns the default global configuration with sensible defaults
   * for port ranges and database settings.
   * 
   * @returns Default global configuration object
   */
  getDefaultConfig(): GlobalConfig {
    return {
      database: {
        type: 'sqlite',
        sqlite: {
          path: '~/.port-manager/registry.db',
        },
      },
      portRanges: {
        node: { start: 3001, end: 3099 },      // Skip 3000 (default, reserved for unmanaged)
        nextjs: { start: 3001, end: 3099 },   // Skip 3000 (default, reserved for unmanaged)
        angular: { start: 4201, end: 4299 },  // Skip 4200 (default, reserved for unmanaged)
        react: { start: 4001, end: 4099 },    // Skip 4000 (default, reserved for unmanaged)
        python: { start: 5001, end: 5099 },   // Skip 5000 (default, reserved for unmanaged)
        php: { start: 8001, end: 8099 },      // Skip 8000 (default, reserved for unmanaged)
      },
      reservedPorts: [
        { port: 3306, purpose: 'MySQL' },
        { port: 5432, purpose: 'PostgreSQL' },
        { port: 6379, purpose: 'Redis' },
      ],
    };
  }

  /**
   * Get configuration value
   * 
   * Alias for `load()` - loads and returns the current configuration.
   * 
   * @returns Promise resolving to global configuration object
   */
  async get(): Promise<GlobalConfig> {
    return this.load();
  }

  /**
   * Update configuration (merges with existing)
   * 
   * Updates the configuration by merging the provided updates with
   * the existing configuration, then saves the result.
   * 
   * @param updates - Partial configuration object with updates to apply
   * @returns Promise that resolves when update completes
   * 
   * @example
   * ```typescript
   * await manager.update({ portRanges: { nextjs: { start: 3001, end: 3099 } } });
   * ```
   */
  async update(updates: Partial<GlobalConfig>): Promise<void> {
    const current = await this.load();
    const merged = { ...current, ...updates };
    await this.save(merged);
  }

  /**
   * Reset to default configuration
   * 
   * Resets the configuration to default values and saves it.
   * 
   * @returns Promise that resolves when reset completes
   */
  async reset(): Promise<void> {
    await this.save(this.getDefaultConfig());
  }
}
