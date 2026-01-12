/**
 * @your-org/core
 * 
 * Core package providing foundational features, rules, experts, and commands
 * for use across all projects.
 * 
 * This package serves as the foundation for all projects, providing:
 * - **Features**: Port Manager, Tech Detector, Domain Manager, Project Initialization
 * - **Shared Utilities**: Database abstractions, configuration management
 * - **Rules**: Cursor IDE rules and expert personas
 * - **Commands**: CLI commands for common development tasks
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
export * from './features/project-initialization';

// Export shared database utilities
export * from './shared/database';

// Export shared configuration utilities
export * from './shared/config';
// Note: ValidationResult is exported from both port-manager and shared/config
// Import directly from the specific module if you need a specific one