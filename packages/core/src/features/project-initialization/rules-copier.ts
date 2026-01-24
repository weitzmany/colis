/**
 * Rules Copier with Hash Comparison
 * 
 * Synchronizes rules (expert personas and project rules) from core package to project
 * using hash comparison to detect changes. Excludes workspace-specific rules.
 * Handles file conflicts and provides detailed results.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { syncFiles } from './file-sync.js';

/**
 * Result of copying rules operation
 */
export interface CopyRulesResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** List of files that were copied (relative paths like 'experts/file.mdc') */
  copied: string[];
  /** List of files that were skipped (identical hash) */
  skipped: string[];
  /** List of files that were deleted (no longer in source) */
  deleted: string[];
  /** List of error messages if any occurred */
  errors: string[];
  /** Summary statistics */
  stats: {
    total: number;
    copied: number;
    skipped: number;
    deleted: number;
  };
}

/**
 * Synchronize rules from core package to project with hash comparison
 * 
 * Synchronizes expert personas and project rules from the core package's rules directory
 * to the project's `.cursor/rules/` directory using MD5 hash comparison to detect changes.
 * 
 * **What Gets Synchronized:**
 * - `rules/experts/` - Expert persona files (*.mdc)
 * - `rules/projects/` - Project-specific rule patterns (*.mdc) - if directory exists
 * 
 * **What Gets Excluded:**
 * - `rules/user/` - User-specific rules (workspace-specific, not synchronized)
 * - Root-level `.mdc` files in `rules/` - Workspace-specific rules (not synchronized)
 * 
 * **Smart Synchronization:**
 * - Copies new files that don't exist in project
 * - Copies modified files (different hash) from core package
 * - Skips identical files (same hash) to save time
 * - Optionally deletes files from project that no longer exist in core package
 * 
 * @param corePackagePath - Path to the core package (usually in node_modules/@your-org/core)
 * @param projectPath - Path to the project root directory
 * @param options - Synchronization options
 * @param options.overwrite - If true, overwrite all files regardless of hash. Default: false
 * @param options.deleteOrphaned - If true, delete files from project that don't exist in core. Default: false
 * @returns Promise resolving to sync result with success status, statistics, and errors
 * 
 * @example
 * ```typescript
 * // Sync with hash comparison (only copy changed files)
 * const result = await copyRules('/path/to/core', '/path/to/project');
 * console.log(`Copied: ${result.stats.copied}, Skipped: ${result.stats.skipped}`);
 * 
 * // Force overwrite all files
 * const result = await copyRules('/path/to/core', '/path/to/project', { overwrite: true });
 * 
 * // Sync and delete orphaned files
 * const result = await copyRules('/path/to/core', '/path/to/project', { deleteOrphaned: true });
 * ```
 */
export async function copyRules(
  corePackagePath: string,
  projectPath: string,
  options: {
    overwrite?: boolean;
    deleteOrphaned?: boolean;
  } = {}
): Promise<CopyRulesResult> {
  const result: CopyRulesResult = {
    success: true,
    copied: [],
    skipped: [],
    deleted: [],
    errors: [],
    stats: {
      total: 0,
      copied: 0,
      skipped: 0,
      deleted: 0,
    },
  };

  try {
    const sourceRulesPath = path.join(corePackagePath, 'rules');
    const targetRulesPath = path.join(projectPath, '.cursor', 'rules');

    // Check if source exists
    if (!(await fs.pathExists(sourceRulesPath))) {
      result.errors.push(
        `Source rules directory not found: ${sourceRulesPath}\n` +
        `  Solution: Make sure @your-org/core is installed: npm install @your-org/core`
      );
      result.success = false;
      return result;
    }

    // Sync expert personas
    const expertsSource = path.join(sourceRulesPath, 'experts');
    const expertsTarget = path.join(targetRulesPath, 'experts');

    if (await fs.pathExists(expertsSource)) {
      const expertsResult = await syncFiles(expertsSource, expertsTarget, {
        forceOverwrite: options.overwrite,
        deleteOrphaned: options.deleteOrphaned,
        includeExtensions: ['.mdc'],
      });

      // Prefix paths with 'experts/' for clarity
      result.copied.push(...expertsResult.copied.map(f => `experts/${f}`));
      result.skipped.push(...expertsResult.skipped.map(f => `experts/${f}`));
      result.deleted.push(...expertsResult.deleted.map(f => `experts/${f}`));
      result.errors.push(...expertsResult.errors);

      result.stats.total += expertsResult.stats.total;
      result.stats.copied += expertsResult.stats.copied;
      result.stats.skipped += expertsResult.stats.skipped;
      result.stats.deleted += expertsResult.stats.deleted;

      if (!expertsResult.success) {
        result.success = false;
      }
    }

    // Sync project rules (if directory exists)
    const projectsSource = path.join(sourceRulesPath, 'projects');
    const projectsTarget = path.join(targetRulesPath, 'projects');

    if (await fs.pathExists(projectsSource)) {
      const projectsResult = await syncFiles(projectsSource, projectsTarget, {
        forceOverwrite: options.overwrite,
        deleteOrphaned: options.deleteOrphaned,
        includeExtensions: ['.mdc'],
      });

      // Prefix paths with 'projects/' for clarity
      result.copied.push(...projectsResult.copied.map(f => `projects/${f}`));
      result.skipped.push(...projectsResult.skipped.map(f => `projects/${f}`));
      result.deleted.push(...projectsResult.deleted.map(f => `projects/${f}`));
      result.errors.push(...projectsResult.errors);

      result.stats.total += projectsResult.stats.total;
      result.stats.copied += projectsResult.stats.copied;
      result.stats.skipped += projectsResult.stats.skipped;
      result.stats.deleted += projectsResult.stats.deleted;

      if (!projectsResult.success) {
        result.success = false;
      }
    }

    return result;
  } catch (error: unknown) {
    result.success = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(
      `Error synchronizing rules: ${errorMessage}\n` +
      `  Solution: Check file permissions and ensure core package is properly installed`
    );
    return result;
  }
}
