/**
 * Commands Copier
 * 
 * Copies general commands from core package to project.
 * Excludes local commands (for packages repo only).
 * Handles file conflicts and provides detailed results.
 */

import * as fs from 'fs-extra';
import { readdir } from 'fs/promises';
import * as path from 'path';

/**
 * Result of copying commands operation
 */
export interface CopyCommandsResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** List of files that were copied (relative paths like 'general/command.md') */
  copied: string[];
  /** List of files that were skipped (already exist and overwrite=false) */
  skipped: string[];
  /** List of local commands that were excluded (packages repo only) */
  excluded: string[];
  /** List of error messages if any occurred */
  errors: string[];
}

/**
 * Copy commands from core package to project
 * 
 * Copies general commands from the core package's commands directory
 * to the project's `.cursor/commands/general/` directory. Automatically
 * excludes local commands that are meant only for the packages repo.
 * 
 * @param corePackagePath - Path to the core package (usually in node_modules/@your-org/core)
 * @param projectPath - Path to the project root directory
 * @param options - Copy options
 * @param options.overwrite - If true, overwrite existing files. Default: false
 * @param options.skipExisting - If true, skip files that already exist. Default: true when overwrite=false
 * @returns Promise resolving to copy result with success status, copied files, skipped files, excluded files, and errors
 * 
 * @example
 * ```typescript
 * const result = await copyCommands('/path/to/core', '/path/to/project', { overwrite: false });
 * if (result.success) {
 *   console.log(`Copied ${result.copied.length} files, excluded ${result.excluded.length} local commands`);
 * }
 * ```
 */
export async function copyCommands(
  corePackagePath: string,
  projectPath: string,
  options: {
    overwrite?: boolean;
    skipExisting?: boolean;
  } = {}
): Promise<CopyCommandsResult> {
  const result: CopyCommandsResult = {
    success: true,
    copied: [],
    skipped: [],
    excluded: [],
    errors: [],
  };

  try {
    const sourceCommandsPath = path.join(corePackagePath, 'commands');
    const targetCommandsPath = path.join(projectPath, '.cursor', 'commands');

    // Check if source exists
    if (!(await fs.pathExists(sourceCommandsPath))) {
      result.errors.push(
        `Source commands directory not found: ${sourceCommandsPath}\n` +
        `  Solution: Make sure @your-org/core is installed: npm install @your-org/core`
      );
      result.success = false;
      return result;
    }

    // Copy general commands (exclude local commands)
    const generalSource = path.join(sourceCommandsPath, 'general');
    const generalTarget = path.join(targetCommandsPath, 'general');

    if (await fs.pathExists(generalSource)) {
      await fs.ensureDir(generalTarget);
      const generalFiles = await readdir(generalSource);
      for (const file of generalFiles) {
        if (file.endsWith('.md')) {
          const sourceFile = path.join(generalSource, file);
          const targetFile = path.join(generalTarget, file);

          if (await fs.pathExists(targetFile)) {
            if (options.overwrite) {
              await fs.copy(sourceFile, targetFile);
              result.copied.push(`general/${file}`);
            } else {
              result.skipped.push(`general/${file}`);
            }
          } else {
            await fs.copy(sourceFile, targetFile);
            result.copied.push(`general/${file}`);
          }
        }
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
      `Error copying commands: ${errorMessage}\n` +
      `  Solution: Check file permissions and ensure core package is properly installed`
    );
    return result;
  }
}
