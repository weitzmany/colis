/**
 * @your-org/core
 * 
 * Core package providing features, rules, experts, and commands
 * for use across all projects.
 */

// Export Port Manager feature
export * from './features/port-manager';

// Export Tech Detector feature
export * from './features/tech-detector';

// Export Domain Manager feature
export * from './features/domain-manager';

// Export Project Initialization feature
export * from './features/project-initialization';

// Export shared utilities (if needed)
export * from './shared/database';
export { GlobalConfigManager, ProjectConfigManager, ConfigValidator } from './shared/config';
export type { GlobalConfig } from './shared/config/global-config';
export type { ProjectConfig } from './shared/config/project-config';
