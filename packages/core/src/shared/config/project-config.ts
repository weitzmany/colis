/**
 * Project Configuration Manager
 * 
 * Manages project-specific configuration stored at .port-manager.json.
 * This configuration is specific to each project and contains project-level
 * settings like project name, app type, and allocated port.
 * 
 * @packageDocumentation
 * @module @your-org/core/shared/config
 */

import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Project configuration interface
 * 
 * Represents the project-specific configuration stored in the project root.
 * This configuration is unique to each project.
 */
export interface ProjectConfig {
  /** Project name (used for port allocation identification) */
  projectName: string;
  /** Application type (determines port range) */
  appType: 'node' | 'nextjs' | 'angular' | 'react' | 'php' | 'python' | 'docker' | 'react-native' | 'expo' | 'ionic' | 'flutter';
  /** Allocated port number for this project */
  port: number;
  /** Whether to automatically configure project files with port */
  autoConfigure?: boolean;
  /** Configuration files that have been updated with port */
  configFiles?: {
    /** Environment file path (e.g., .env) */
    env?: string;
    /** package.json file path */
    packageJson?: string;
    /** Next.js config file path */
    nextConfig?: string;
    /** Angular config file path */
    angularJson?: string;
    /** Docker Compose file path */
    dockerCompose?: string;
  };
}

const CONFIG_FILE_NAME = '.port-manager.json';

/**
 * Project Configuration Manager
 * 
 * Manages project-specific configuration stored in `.port-manager.json`.
 * Provides methods to load, save, update, and delete project configuration.
 * 
 * @example
 * ```typescript
 * const manager = new ProjectConfigManager('/path/to/project');
 * const config = await manager.load();
 * if (config) {
 *   console.log(`Project: ${config.projectName}, Port: ${config.port}`);
 * }
 * ```
 */
export class ProjectConfigManager {
  private projectPath: string;
  private configPath: string;

  /**
   * Create a new project configuration manager
   * 
   * @param projectPath - Path to project root directory
   */
  constructor(projectPath: string) {
    this.projectPath = path.resolve(projectPath);
    this.configPath = path.join(this.projectPath, CONFIG_FILE_NAME);
  }

  /**
   * Get the configuration file path
   * 
   * @returns Absolute path to the project configuration file
   */
  getConfigPath(): string {
    return this.configPath;
  }

  /**
   * Check if configuration file exists
   * 
   * @returns Promise resolving to true if file exists, false otherwise
   */
  async exists(): Promise<boolean> {
    return fs.pathExists(this.configPath);
  }

  /**
   * Load configuration from file
   * 
   * Loads the project configuration from `.port-manager.json`.
   * Returns null if the file doesn't exist.
   * 
   * @returns Promise resolving to configuration object or null if not found
   * @throws Error if file exists but cannot be parsed
   * 
   * @example
   * ```typescript
   * const config = await manager.load();
   * if (config) {
   *   console.log(`Port: ${config.port}`);
   * }
   * ```
   */
  async load(): Promise<ProjectConfig | null> {
    if (!(await this.exists())) {
      return null;
    }

    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      return JSON.parse(content) as ProjectConfig;
    } catch (error) {
      throw new Error(`Failed to load project config: ${error}`);
    }
  }

  /**
   * Save configuration to file
   * 
   * Saves the project configuration to `.port-manager.json`.
   * 
   * @param config - Configuration object to save
   * @returns Promise that resolves when save completes
   * 
   * @example
   * ```typescript
   * await manager.save({
   *   projectName: 'my-project',
   *   appType: 'nextjs',
   *   port: 3001
   * });
   * ```
   */
  async save(config: ProjectConfig): Promise<void> {
    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
  }

  /**
   * Update configuration (merges with existing)
   * 
   * Updates the configuration by merging the provided updates with
   * the existing configuration. If no configuration exists, creates a new one.
   * 
   * @param updates - Partial configuration object with updates to apply
   * @returns Promise that resolves when update completes
   * 
   * @example
   * ```typescript
   * await manager.update({ port: 3002 });
   * ```
   */
  async update(updates: Partial<ProjectConfig>): Promise<void> {
    const current = await this.load();
    const merged = current ? { ...current, ...updates } : (updates as ProjectConfig);
    await this.save(merged as ProjectConfig);
  }

  /**
   * Delete configuration file
   * 
   * Removes the `.port-manager.json` file from the project.
   * Safe to call even if the file doesn't exist.
   * 
   * @returns Promise that resolves when deletion completes
   */
  async delete(): Promise<void> {
    if (await this.exists()) {
      await fs.remove(this.configPath);
    }
  }

  /**
   * Get project path
   * 
   * @returns Absolute path to the project root directory
   */
  getProjectPath(): string {
    return this.projectPath;
  }
}




