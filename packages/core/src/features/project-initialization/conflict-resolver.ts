/**
 * Conflict Resolver
 * 
 * Handles file conflicts during project initialization.
 * Provides utilities for resolving conflicts when files already exist.
 */

import * as fs from 'fs-extra';
import chalk from 'chalk';
import * as readline from 'readline';

/**
 * Conflict resolution strategy
 */
export enum ConflictStrategy {
  /** Skip existing files (default) */
  SKIP = 'skip',
  /** Overwrite existing files */
  OVERWRITE = 'overwrite',
  /** Ask user for each conflict */
  INTERACTIVE = 'interactive',
}

/**
 * File conflict information
 */
export interface FileConflict {
  /** Relative path to the conflicting file */
  filePath: string;
  /** Full path to source file */
  sourcePath: string;
  /** Full path to target file */
  targetPath: string;
  /** Whether target file exists */
  targetExists: boolean;
}

/**
 * Result of conflict resolution
 */
export interface ConflictResolutionResult {
  /** Whether to proceed with copying */
  shouldCopy: boolean;
  /** Strategy used to resolve the conflict */
  strategy: ConflictStrategy;
}

/**
 * Resolve a file conflict based on strategy
 * 
 * Determines whether a file should be copied based on the conflict resolution strategy.
 * For interactive mode, prompts the user for each conflict.
 * 
 * @param conflict - File conflict information
 * @param strategy - Conflict resolution strategy
 * @param defaultOverwrite - Default overwrite behavior (used when strategy is not interactive)
 * @returns Promise resolving to conflict resolution result
 * 
 * @example
 * ```typescript
 * const conflict = {
 *   filePath: 'experts/database_expert.mdc',
 *   sourcePath: '/path/to/source',
 *   targetPath: '/path/to/target',
 *   targetExists: true,
 * };
 * const result = await resolveConflict(conflict, ConflictStrategy.INTERACTIVE, false);
 * if (result.shouldCopy) {
 *   await fs.copy(conflict.sourcePath, conflict.targetPath);
 * }
 * ```
 */
export async function resolveConflict(
  conflict: FileConflict,
  strategy: ConflictStrategy,
  defaultOverwrite: boolean = false
): Promise<ConflictResolutionResult> {
  if (!conflict.targetExists) {
    // No conflict - file doesn't exist, proceed with copy
    return {
      shouldCopy: true,
      strategy: ConflictStrategy.SKIP,
    };
  }

  switch (strategy) {
    case ConflictStrategy.SKIP:
      return {
        shouldCopy: false,
        strategy: ConflictStrategy.SKIP,
      };

    case ConflictStrategy.OVERWRITE:
      return {
        shouldCopy: true,
        strategy: ConflictStrategy.OVERWRITE,
      };

    case ConflictStrategy.INTERACTIVE:
      return await resolveInteractive(conflict);

    default:
      // Default to skip if overwrite is false, otherwise overwrite
      return {
        shouldCopy: defaultOverwrite,
        strategy: defaultOverwrite ? ConflictStrategy.OVERWRITE : ConflictStrategy.SKIP,
      };
  }
}

/**
 * Resolve conflict interactively by prompting user
 * 
 * @param conflict - File conflict information
 * @returns Promise resolving to conflict resolution result
 */
async function resolveInteractive(conflict: FileConflict): Promise<ConflictResolutionResult> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log(chalk.yellow(`\n⚠ File conflict: ${chalk.bold(conflict.filePath)}`));
    console.log(chalk.dim(`  Target: ${conflict.targetPath}`));
    
    rl.question(
      chalk.blue('  Overwrite? (y/n/a/q): '),
      (answer: string) => {
        rl.close();
        
        const normalized = answer.trim().toLowerCase();
        
        if (normalized === 'y' || normalized === 'yes') {
          resolve({
            shouldCopy: true,
            strategy: ConflictStrategy.OVERWRITE,
          });
        } else if (normalized === 'n' || normalized === 'no') {
          resolve({
            shouldCopy: false,
            strategy: ConflictStrategy.SKIP,
          });
        } else if (normalized === 'a' || normalized === 'all') {
          // Note: This would need to be handled at a higher level
          // For now, just overwrite this one
          resolve({
            shouldCopy: true,
            strategy: ConflictStrategy.OVERWRITE,
          });
        } else {
          // 'q' or anything else - skip
          resolve({
            shouldCopy: false,
            strategy: ConflictStrategy.SKIP,
          });
        }
      }
    );
  });
}

/**
 * Check if a file would conflict (already exists)
 * 
 * @param targetPath - Path to check
 * @returns Promise resolving to true if file exists, false otherwise
 */
export async function checkConflict(targetPath: string): Promise<boolean> {
  return await fs.pathExists(targetPath);
}

/**
 * Get conflict information for a file
 * 
 * @param sourcePath - Path to source file
 * @param targetPath - Path to target file
 * @param relativePath - Relative path for reporting (e.g., 'experts/file.mdc')
 * @returns Promise resolving to file conflict information
 */
export async function getConflictInfo(
  sourcePath: string,
  targetPath: string,
  relativePath: string
): Promise<FileConflict> {
  const targetExists = await fs.pathExists(targetPath);
  
  return {
    filePath: relativePath,
    sourcePath,
    targetPath,
    targetExists,
  };
}
