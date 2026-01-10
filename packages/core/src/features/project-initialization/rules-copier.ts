/**
 * Rules Copier
 * 
 * Copies rules (expert personas and user rules) from core package to project.
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export interface CopyRulesResult {
  success: boolean;
  copied: string[];
  skipped: string[];
  errors: string[];
}

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
      result.errors.push(`Source rules directory not found: ${sourceRulesPath}`);
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
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Error copying rules: ${error.message}`);
    return result;
  }
}
