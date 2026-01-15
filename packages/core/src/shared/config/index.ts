/**
 * Shared Configuration Utilities
 * 
 * Exports all configuration-related utilities.
 * Provides managers for global and project-specific configuration.
 * 
 * @packageDocumentation
 * @module @your-org/core/shared/config
 */

export * from './global-config.js';
export * from './project-config.js';
// Export validator types with explicit name to avoid conflicts
export { ConfigValidator, type ValidationResult as ConfigValidationResult } from './validator.js';




