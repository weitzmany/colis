/**
 * Commands Copier
 * 
 * Copies general commands from core package to project.
 * Excludes local commands (for packages repo only).
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export interface CopyCommandsResult {
  success: boolean;
  copied: string[];
  skipped: string[];
  excluded: string[];
  errors: string[];
}

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
      result.errors.push(`Source commands directory not found: ${sourceCommandsPath}`);
      result.success = false;
      return result;
    }

    // Copy general commands (exclude local commands)
    const generalSource = path.join(sourceCommandsPath, 'general');
    const generalTarget = path.join(targetCommandsPath, 'general');

    if (await fs.pathExists(generalSource)) {
      await fs.ensureDir(generalTarget);
      const generalFiles = await fs.readdir(generalSource);
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
      const localFiles = await fs.readdir(localSource);
      for (const file of localFiles) {
        if (file.endsWith('.md')) {
          result.excluded.push(`local/${file}`);
        }
      }
    }

    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Error copying commands: ${error.message}`);
    return result;
  }
}
