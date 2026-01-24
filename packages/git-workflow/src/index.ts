/**
 * Git Workflow Package - Main Entry Point
 * 
 * Provides standardized git configuration, hooks, templates, and lifecycle management
 * for consistent git practices across all projects.
 */

export * from './types';
export * from './lifecycle';
export * from './utils';

import { GitWorkflowLifecycle } from './lifecycle';

/**
 * Main GitWorkflow class providing lifecycle management
 */
export class GitWorkflow {
  /**
   * Initialize git workflow in a project
   */
  static async init(options: import('./types').InitOptions): Promise<import('./types').InitResult> {
    return GitWorkflowLifecycle.init(options);
  }

  /**
   * Verify git workflow health
   */
  static async verify(options: import('./types').VerifyOptions): Promise<import('./types').HealthStatus> {
    return GitWorkflowLifecycle.verify(options);
  }

  /**
   * Repair git workflow issues
   */
  static async repair(options: import('./types').RepairOptions): Promise<import('./types').RepairResult> {
    return GitWorkflowLifecycle.repair(options);
  }

  /**
   * Update git workflow to latest version
   */
  static async update(options: import('./types').UpdateOptions): Promise<import('./types').UpdateResult> {
    return GitWorkflowLifecycle.update(options);
  }
}
