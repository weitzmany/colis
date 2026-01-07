/**
 * Global Configuration Manager
 * 
 * Manages global configuration stored at ~/.port-manager/config.json
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

export interface GlobalConfig {
  database?: {
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
    };
    postgresql?: {
      host: string;
      port: number;
      database: string;
      user: string;
      password: string;
    };
  };
  portRanges?: {
    [key: string]: { start: number; end: number };
  };
  reservedPorts?: Array<{ port: number; purpose: string }>;
}

const DEFAULT_CONFIG_PATH = path.join(os.homedir(), '.port-manager', 'config.json');

export class GlobalConfigManager {
  private configPath: string;
  private config: GlobalConfig | null = null;

  constructor(configPath: string = DEFAULT_CONFIG_PATH) {
    this.configPath = configPath;
  }

  /**
   * Get the configuration file path
   */
  getConfigPath(): string {
    return this.configPath;
  }

  /**
   * Load configuration from file
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
   */
  async save(config: GlobalConfig): Promise<void> {
    this.config = config;
    const configDir = path.dirname(this.configPath);
    await fs.ensureDir(configDir);
    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
  }

  /**
   * Get default configuration
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
   */
  async get(): Promise<GlobalConfig> {
    return this.load();
  }

  /**
   * Update configuration (merges with existing)
   */
  async update(updates: Partial<GlobalConfig>): Promise<void> {
    const current = await this.load();
    const merged = { ...current, ...updates };
    await this.save(merged);
  }

  /**
   * Reset to default configuration
   */
  async reset(): Promise<void> {
    await this.save(this.getDefaultConfig());
  }
}
