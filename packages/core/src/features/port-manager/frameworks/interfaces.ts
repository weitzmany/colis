/**
 * Framework Handler Interfaces
 * 
 * Defines interfaces for framework-specific handlers.
 */

import { ConfigurationResult } from '../types';

export interface FrameworkHandler {
  /**
   * Get framework name
   */
  getName(): string;

  /**
   * Detect if this framework is used in the project
   */
  detect(projectPath: string): Promise<boolean>;

  /**
   * Update configuration files with port
   */
  updateConfig(projectPath: string, port: number): Promise<ConfigurationResult>;

  /**
   * Get default port for this framework
   */
  getDefaultPort(): number;

  /**
   * Validate port configuration
   */
  validateConfig(projectPath: string, port: number): Promise<boolean>;
}




