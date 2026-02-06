/**
 * Commands Copier with Hash Comparison
 * 
 * Synchronizes general commands from core package to project using hash comparison
 * to detect changes. Excludes local commands (for packages repo only).
 * Handles file conflicts and provides detailed results.
 */

import * as fs from 'fs-extra';
import { readdir } from 'fs/promises';
import * as path from 'path';
import { syncFiles } from './file-sync.js';

/**
 * Result of copying commands operation
 */
export interface CopyCommandsResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** List of files that were copied (relative paths like 'general/command.md') */
  copied: string[];
  /** List of files that were skipped (identical hash) */
  skipped: string[];
  /** List of files that were deleted (no longer in source) */
  deleted: string[];
  /** List of local commands that were excluded (packages repo only) */
  excluded: string[];
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
 * Synchronize commands from core package to project with hash comparison
 * 
 * Synchronizes general commands from the core package's commands directory
 * to the project's `.cursor/commands/general/` directory using MD5 hash comparison
 * to detect changes. Automatically excludes local commands that are meant only
 * for the packages repo.
 * 
 * **Smart Synchronization:**
 * - Copies new command files that don't exist in project
 * - Copies modified command files (different hash) from core package
 * - Skips identical command files (same hash) to save time
 * - Optionally deletes command files from project that no longer exist in core package
 * 
 * @param corePackagePath - Path to the core package (usually in node_modules/@colis/rig)
 * @param projectPath - Path to the project root directory
 * @param options - Synchronization options
 * @param options.overwrite - If true, overwrite all files regardless of hash. Default: false
 * @param options.deleteOrphaned - If true, delete files from project that don't exist in core. Default: false
 * @returns Promise resolving to sync result with success status, statistics, excluded files, and errors
 * 
 * @example
 * ```typescript
 * // Sync with hash comparison (only copy changed files)
 * const result = await copyCommands('/path/to/core', '/path/to/project');
 * console.log(`Copied: ${result.stats.copied}, Skipped: ${result.stats.skipped}`);
 * 
 * // Force overwrite all files
 * const result = await copyCommands('/path/to/core', '/path/to/project', { overwrite: true });
 * 
 * // Sync and delete orphaned files
 * const result = await copyCommands('/path/to/core', '/path/to/project', { deleteOrphaned: true });
 * ```
 */
export async function copyCommands(
  corePackagePath: string,
  projectPath: string,
  options: {
    overwrite?: boolean;
    deleteOrphaned?: boolean;
  } = {}
): Promise<CopyCommandsResult> {
  const result: CopyCommandsResult = {
    success: true,
    copied: [],
    skipped: [],
    deleted: [],
    excluded: [],
    errors: [],
    stats: {
      total: 0,
      copied: 0,
      skipped: 0,
      deleted: 0,
    },
  };

  try {
    const sourceCommandsPath = path.join(corePackagePath, 'commands');
    const targetCommandsPath = path.join(projectPath, '.cursor', 'commands');

    // Check if source exists
    if (!(await fs.pathExists(sourceCommandsPath))) {
      result.errors.push(
        `Source commands directory not found: ${sourceCommandsPath}\n` +
        `  Solution: Make sure @colis/rig is installed: npm install @colis/rig`
      );
      result.success = false;
      return result;
    }

    // Sync general commands (exclude local commands)
    const generalSource = path.join(sourceCommandsPath, 'general');
    const generalTarget = path.join(targetCommandsPath, 'general');

    if (await fs.pathExists(generalSource)) {
      const generalResult = await syncFiles(generalSource, generalTarget, {
        forceOverwrite: options.overwrite,
        deleteOrphaned: options.deleteOrphaned,
        includeExtensions: ['.md'],
      });

      // Prefix paths with 'general/' for clarity
      result.copied.push(...generalResult.copied.map(f => `general/${f}`));
      result.skipped.push(...generalResult.skipped.map(f => `general/${f}`));
      result.deleted.push(...generalResult.deleted.map(f => `general/${f}`));
      result.errors.push(...generalResult.errors);

      result.stats.total += generalResult.stats.total;
      result.stats.copied += generalResult.stats.copied;
      result.stats.skipped += generalResult.stats.skipped;
      result.stats.deleted += generalResult.stats.deleted;

      if (!generalResult.success) {
        result.success = false;
      }
    }

    // Track excluded local commands (for reporting)
    const localSource = path.join(sourceCommandsPath, 'local');
    if (await fs.pathExists(localSource)) {
      const localFiles = await readdir(localSource);
      for (const file of localFiles) {
        if (file.endsWith('.md')) {
          result.excluded.push(`local/${file}`);
        }
      }
    }

    return result;
  } catch (error: unknown) {
    result.success = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(
      `Error synchronizing commands: ${errorMessage}\n` +
      `  Solution: Check file permissions and ensure core package is properly installed`
    );
    return result;
  }
}
