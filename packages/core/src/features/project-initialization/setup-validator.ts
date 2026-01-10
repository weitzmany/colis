/**
 * Setup Validator
 * 
 * Validates that project initialization was successful.
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export interface InitValidationResult {
  success: boolean;
  rulesValid: boolean;
  commandsValid: boolean;
  portManagerValid: boolean;
  colorsValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ValidationOptions {
  checkColors?: boolean;
}

export async function validateSetup(
  projectPath: string,
  expectedRules: { experts: number; user: number },
  expectedCommands: { general: number },
  options: ValidationOptions = {}
): Promise<InitValidationResult> {
  const result: InitValidationResult = {
    success: true,
    rulesValid: false,
    commandsValid: false,
    portManagerValid: false,
    colorsValid: false,
    errors: [],
    warnings: [],
  };

  try {
    // Validate rules
    const rulesPath = path.join(projectPath, '.cursor', 'rules');
    const expertsPath = path.join(rulesPath, 'experts');
    const userPath = path.join(rulesPath, 'user');

    if (await fs.pathExists(expertsPath)) {
      const expertFiles = (await fs.readdir(expertsPath)).filter((f) => f.endsWith('.mdc'));
      if (expertFiles.length >= expectedRules.experts) {
        result.rulesValid = true;
      } else {
        result.errors.push(
          `Expected ${expectedRules.experts} expert personas, found ${expertFiles.length}`
        );
        result.success = false;
      }
    } else {
      result.errors.push('Expert personas directory not found');
      result.success = false;
    }

    if (await fs.pathExists(userPath)) {
      const userFiles = (await fs.readdir(userPath)).filter((f) => f.endsWith('.mdc'));
      if (userFiles.length >= expectedRules.user) {
        result.rulesValid = result.rulesValid && true;
      } else {
        result.errors.push(`Expected ${expectedRules.user} user rules, found ${userFiles.length}`);
        result.success = false;
      }
    } else {
      result.errors.push('User rules directory not found');
      result.success = false;
    }

    // Validate commands
    const commandsPath = path.join(projectPath, '.cursor', 'commands');
    const generalPath = path.join(commandsPath, 'general');

    if (await fs.pathExists(generalPath)) {
      // General commands are optional, so we just check if directory exists
      result.commandsValid = true;
    } else {
      // General commands directory doesn't exist, but that's okay if there are no general commands
      if (expectedCommands.general === 0) {
        result.commandsValid = true;
      } else {
        result.warnings.push('General commands directory not found (may be empty)');
        result.commandsValid = true; // Not a critical error
      }
    }

    // Validate that local commands were NOT copied
    const localPath = path.join(commandsPath, 'local');
    if (await fs.pathExists(localPath)) {
      const localFiles = (await fs.readdir(localPath)).filter((f) => f.endsWith('.md'));
      if (localFiles.length > 0) {
        result.warnings.push(
          `Found ${localFiles.length} local commands (these should not be copied to projects)`
        );
      }
    }

    // Port Manager validation is done separately by checking if it's initialized
    // This is handled in the main init command

    // Validate IDE colors setup (if requested)
    if (options.checkColors) {
      const hookPath = path.join(projectPath, '.githooks', 'post-checkout');
      const settingsPath = path.join(projectPath, '.vscode', 'settings.json');
      const gitignorePath = path.join(projectPath, '.gitignore');

      // Check if post-checkout hook exists
      if (await fs.pathExists(hookPath)) {
        try {
          const hookContent = await fs.readFile(hookPath, 'utf-8');
          // Check if hook contains KEY_COLOR
          if (hookContent.includes('KEY_COLOR=')) {
            result.colorsValid = true;
          } else {
            result.warnings.push('Post-checkout hook exists but does not contain KEY_COLOR');
          }
        } catch (error: any) {
          result.warnings.push(`Could not read post-checkout hook: ${error.message}`);
        }
      } else {
        result.warnings.push('Post-checkout hook not found (colors may not be configured)');
      }

      // Check if settings.json exists (optional, may not exist if git not initialized)
      if (await fs.pathExists(settingsPath)) {
        try {
          const settingsContent = await fs.readFile(settingsPath, 'utf-8');
          const settings = JSON.parse(settingsContent);
          if (settings['workbench.colorCustomizations']) {
            // Settings file exists and has color customizations
            result.colorsValid = result.colorsValid && true;
          }
        } catch (error: any) {
          result.warnings.push(`Settings.json exists but is not valid JSON: ${error.message}`);
        }
      }

      // Check if settings.json is in .gitignore
      if (await fs.pathExists(gitignorePath)) {
        try {
          const gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
          if (gitignoreContent.includes('.vscode/settings.json')) {
            // Settings file is properly ignored
          } else {
            result.warnings.push('.vscode/settings.json is not in .gitignore (should be ignored)');
          }
        } catch (error: any) {
          result.warnings.push(`Could not read .gitignore: ${error.message}`);
        }
      }
    } else {
      // Colors validation not requested, mark as valid (not checked)
      result.colorsValid = true;
    }

    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Validation error: ${error.message}`);
    return result;
  }
}
