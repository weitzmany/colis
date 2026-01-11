/**
 * Rules Copier
 * 
 * Copies rules (expert personas and user rules) from core package to project.
 * Handles file conflicts and provides detailed results.
 */

import * as fs from 'fs-extra';
import * as path from 'path';

/**
 * Result of copying rules operation
 */
export interface CopyRulesResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** List of files that were copied (relative paths like 'experts/file.mdc') */
  copied: string[];
  /** List of files that were skipped (already exist and overwrite=false) */
  skipped: string[];
  /** List of error messages if any occurred */
  errors: string[];
}

/**
 * Copy rules from core package to project
 * 
 * Copies all expert personas and user rules from the core package's rules directory
 * to the project's `.cursor/rules/` directory. Handles file conflicts based on options.
 * 
 * @param corePackagePath - Path to the core package (usually in node_modules/@your-org/core)
 * @param projectPath - Path to the project root directory
 * @param options - Copy options
 * @param options.overwrite - If true, overwrite existing files. Default: false
 * @param options.skipExisting - If true, skip files that already exist. Default: true when overwrite=false
 * @returns Promise resolving to copy result with success status, copied files, skipped files, and errors
 * 
 * @example
 * ```typescript
 * const result = await copyRules('/path/to/core', '/path/to/project', { overwrite: false });
 * if (result.success) {
 *   console.log(`Copied ${result.copied.length} files`);
 * }
 * ```
 */
export async function copyRules(
  corePackagePath: string,
  projectPath: string,
  options: {
    overwrite?: boolean;
    skipExisting?: boolean;
  } = {}
): Promise<CopyRulesResult> {
  const result: CopyRulesResult = {
    success: true,
    copied: [],
    skipped: [],
    errors: [],
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

    // Create target directory structure
    await fs.ensureDir(path.join(targetRulesPath, 'experts'));
    await fs.ensureDir(path.join(targetRulesPath, 'user'));

    // Copy expert personas
    const expertsSource = path.join(sourceRulesPath, 'experts');
    const expertsTarget = path.join(targetRulesPath, 'experts');

    if (await fs.pathExists(expertsSource)) {
      const expertFiles = await fs.readdir(expertsSource);
      for (const file of expertFiles) {
        if (file.endsWith('.mdc')) {
          const sourceFile = path.join(expertsSource, file);
          const targetFile = path.join(expertsTarget, file);

          if (await fs.pathExists(targetFile)) {
            if (options.overwrite) {
              await fs.copy(sourceFile, targetFile);
              result.copied.push(`experts/${file}`);
            } else {
              result.skipped.push(`experts/${file}`);
            }
          } else {
            await fs.copy(sourceFile, targetFile);
            result.copied.push(`experts/${file}`);
          }
        }
      }
    }

    // Copy user rules
    const userSource = path.join(sourceRulesPath, 'user');
    const userTarget = path.join(targetRulesPath, 'user');

    if (await fs.pathExists(userSource)) {
      const userFiles = await fs.readdir(userSource);
      for (const file of userFiles) {
        if (file.endsWith('.mdc')) {
          const sourceFile = path.join(userSource, file);
          const targetFile = path.join(userTarget, file);

          if (await fs.pathExists(targetFile)) {
            if (options.overwrite) {
              await fs.copy(sourceFile, targetFile);
              result.copied.push(`user/${file}`);
            } else {
              result.skipped.push(`user/${file}`);
            }
          } else {
            await fs.copy(sourceFile, targetFile);
            result.copied.push(`user/${file}`);
          }
        }
      }
    }

    return result;
  } catch (error: unknown) {
    result.success = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(
      `Error copying rules: ${errorMessage}\n` +
      `  Solution: Check file permissions and ensure core package is properly installed`
    );
    return result;
  }
}
