/**
 * Project Configuration Manager
 * 
 * Manages project-specific configuration stored at .port-manager.json
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export interface ProjectConfig {
  projectName: string;
  appType: 'node' | 'nextjs' | 'angular' | 'react' | 'php' | 'python' | 'docker';
  port: number;
  autoConfigure?: boolean;
  configFiles?: {
    env?: string;
    packageJson?: string;
    nextConfig?: string;
    angularJson?: string;
    dockerCompose?: string;
  };
}

const CONFIG_FILE_NAME = '.port-manager.json';

export class ProjectConfigManager {
  private projectPath: string;
  private configPath: string;

  constructor(projectPath: string) {
    this.projectPath = path.resolve(projectPath);
    this.configPath = path.join(this.projectPath, CONFIG_FILE_NAME);
  }

  /**
   * Get the configuration file path
   */
  getConfigPath(): string {
    return this.configPath;
  }

  /**
   * Check if configuration file exists
   */
  async exists(): Promise<boolean> {
    return fs.pathExists(this.configPath);
  }

  /**
   * Load configuration from file
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
   */
  async save(config: ProjectConfig): Promise<void> {
    await fs.writeFile(this.configPath, JSON.stringify(config, null, 2), 'utf-8');
  }

  /**
   * Update configuration (merges with existing)
   */
  async update(updates: Partial<ProjectConfig>): Promise<void> {
    const current = await this.load();
    const merged = current ? { ...current, ...updates } : (updates as ProjectConfig);
    await this.save(merged as ProjectConfig);
  }

  /**
   * Delete configuration file
   */
  async delete(): Promise<void> {
    if (await this.exists()) {
      await fs.remove(this.configPath);
    }
  }

  /**
   * Get project path
   */
  getProjectPath(): string {
    return this.projectPath;
  }
}




