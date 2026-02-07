/**
 * Configuration Validator
 * 
 * Validates configuration values and provides validation results.
 * Ensures configuration values meet requirements and constraints.
 * 
 * @packageDocumentation
 * @module @colis/rig/shared/config
 */

import { GlobalConfig } from './global-config.js';
import { ProjectConfig } from './project-config.js';

/**
 * Validation result
 * 
 * Represents the result of a configuration validation operation.
 */
export interface ValidationResult {
  /** Whether the validation passed */
  valid: boolean;
  /** List of validation error messages (empty if valid is true) */
  errors: string[];
}

/**
 * Configuration Validator
 * 
 * Provides static methods for validating configuration values.
 * Used to ensure configuration meets requirements before saving or using.
 * 
 * @example
 * ```typescript
 * const result = ConfigValidator.validatePort(3000);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 * ```
 */
export class ConfigValidator {
  /**
   * Validate port number
   * 
   * Validates that a port number is a valid integer within the allowed range
   * and warns if it's a system port (below 1024).
   * 
   * @param port - Port number to validate
   * @returns Validation result with valid flag and error messages
   * 
   * @example
   * ```typescript
   * const result = ConfigValidator.validatePort(3000);
   * // result.valid = true (but warning about system ports if < 1024)
   * ```
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
   * 
   * Validates that a project name is a non-empty string, within length limits,
   * and contains only allowed characters (letters, numbers, underscores, hyphens).
   * 
   * @param name - Project name to validate
   * @returns Validation result with valid flag and error messages
   * 
   * @example
   * ```typescript
   * const result = ConfigValidator.validateProjectName('my-project');
   * // result.valid = true
   * ```
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
   * 
   * Validates that an app type is one of the supported application types.
   * 
   * @param appType - App type string to validate
   * @returns Validation result with valid flag and error messages
   * 
   * @example
   * ```typescript
   * const result = ConfigValidator.validateAppType('nextjs');
   * // result.valid = true
   * ```
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
   * 
   * Validates that a port range is valid (start < end, both ports valid).
   * 
   * @param start - Start port number
   * @param end - End port number
   * @returns Validation result with valid flag and error messages
   * 
   * @example
   * ```typescript
   * const result = ConfigValidator.validatePortRange(3001, 3099);
   * // result.valid = true
   * ```
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
   * 
   * Validates all aspects of a global configuration object, including
   * port ranges and reserved ports.
   * 
   * @param config - Global configuration object to validate
   * @returns Validation result with valid flag and error messages
   * 
   * @example
   * ```typescript
   * const result = ConfigValidator.validateGlobalConfig(config);
   * if (!result.valid) {
   *   console.error('Config errors:', result.errors);
   * }
   * ```
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
   * 
   * Validates all aspects of a project configuration object, including
   * project name, app type, and port number.
   * 
   * @param config - Project configuration object to validate
   * @returns Validation result with valid flag and error messages
   * 
   * @example
   * ```typescript
   * const result = ConfigValidator.validateProjectConfig(config);
   * if (!result.valid) {
   *   console.error('Config errors:', result.errors);
   * }
   * ```
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

