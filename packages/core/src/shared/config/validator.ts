/**
 * Configuration Validator
 * 
 * Validates configuration values and provides default values.
 */

import { GlobalConfig } from './global-config';
import { ProjectConfig } from './project-config';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class ConfigValidator {
  /**
   * Validate port number
   */
  static validatePort(port: number): ValidationResult {
    const errors: string[] = [];

    if (!Number.isInteger(port)) {
      errors.push('Port must be an integer');
    } else if (port < 1 || port > 65535) {
      errors.push('Port must be between 1 and 65535');
    } else if (port < 1024) {
      errors.push('Ports below 1024 are system ports and should not be used');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate project name
   */
  static validateProjectName(name: string): ValidationResult {
    const errors: string[] = [];

    if (!name || typeof name !== 'string') {
      errors.push('Project name is required');
    } else if (name.length > 255) {
      errors.push('Project name must be 255 characters or less');
    } else if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      errors.push('Project name can only contain letters, numbers, underscores, and hyphens');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate app type
   */
  static validateAppType(appType: string): ValidationResult {
    const validTypes = ['node', 'nextjs', 'angular', 'react', 'php', 'python', 'docker'];
    const errors: string[] = [];

    if (!validTypes.includes(appType)) {
      errors.push(`App type must be one of: ${validTypes.join(', ')}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate port range
   */
  static validatePortRange(start: number, end: number): ValidationResult {
    const errors: string[] = [];

    const startValidation = this.validatePort(start);
    const endValidation = this.validatePort(end);

    errors.push(...startValidation.errors);
    errors.push(...endValidation.errors);

    if (start >= end) {
      errors.push('Port range start must be less than end');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate global configuration
   */
  static validateGlobalConfig(config: GlobalConfig): ValidationResult {
    const errors: string[] = [];

    if (config.portRanges) {
      for (const [appType, range] of Object.entries(config.portRanges)) {
        const rangeValidation = this.validatePortRange(range.start, range.end);
        if (!rangeValidation.valid) {
          errors.push(`Port range for ${appType}: ${rangeValidation.errors.join(', ')}`);
        }
      }
    }

    if (config.reservedPorts) {
      for (const reserved of config.reservedPorts) {
        const portValidation = this.validatePort(reserved.port);
        if (!portValidation.valid) {
          errors.push(`Reserved port ${reserved.port}: ${portValidation.errors.join(', ')}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate project configuration
   */
  static validateProjectConfig(config: ProjectConfig): ValidationResult {
    const errors: string[] = [];

    const nameValidation = this.validateProjectName(config.projectName);
    if (!nameValidation.valid) {
      errors.push(...nameValidation.errors);
    }

    const appTypeValidation = this.validateAppType(config.appType);
    if (!appTypeValidation.valid) {
      errors.push(...appTypeValidation.errors);
    }

    const portValidation = this.validatePort(config.port);
    if (!portValidation.valid) {
      errors.push(...portValidation.errors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

