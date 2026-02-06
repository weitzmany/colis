/**
 * @your-org/core
 * 
 * Your development foundation — Essential tools, rules, and utilities for all projects.
 * 
 * The core package provides everything you need to set up and manage projects efficiently:
 * 
 * **Features**:
 * - Port Manager: Automatic port assignment and conflict prevention
 * - Tech Detector: Detect and document your project's technology stack
 * - Domain Manager: Manage local domains with Caddy integration
 * - Project Initialization: One-command project setup
 * 
 * **Shared Utilities**:
 * - Database abstractions: Work with SQLite, MySQL, or PostgreSQL seamlessly
 * - Configuration management: Global and project-specific settings
 * 
 * **Development Tools**:
 * - Cursor IDE rules: Expert personas and best practices
 * - CLI commands: Reusable commands for common tasks
 * 
 * @packageDocumentation
 * @module @your-org/core
 * 
 * @example
 * ```typescript
 * // Import Port Manager
 * import { PortManager } from '@your-org/core/features/port-manager';
 * 
 * // Import Tech Detector
 * import { TechDetector } from '@your-org/core/features/tech-detector';
 * 
 * // Import shared database utilities
 * import { DatabaseFactory } from '@your-org/core/shared/database';
 * 
 * // Import shared configuration utilities
 * import { GlobalConfigManager } from '@your-org/core/shared/config';
 * ```
 */

// Export Port Manager feature
export * from './features/port-manager';

// Export Tech Detector feature
export * from './features/tech-detector';

// Export Domain Manager feature
export * from './features/domain-manager';

// Export Project Initialization feature
export * from './features/commissioning';

// Export shared database utilities
export * from './shared/database';

// Export shared configuration utilities
export * from './shared/config';
// Note: ValidationResult is exported from both port-manager and shared/config
// Import directly from the specific module if you need a specific one