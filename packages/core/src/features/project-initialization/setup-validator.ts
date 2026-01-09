/**
 * Setup Validator
 * 
 * Validates that project initialization was successful.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export interface ValidationResult {
  success: boolean;
  rulesValid: boolean;
  commandsValid: boolean;
  portManagerValid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateSetup(
  projectPath: string,
  expectedRules: { experts: number; user: number },
  expectedCommands: { general: number }
): Promise<ValidationResult> {
  const result: ValidationResult = {
    success: true,
    rulesValid: false,
    commandsValid: false,
    portManagerValid: false,
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
      const generalFiles = (await fs.readdir(generalPath)).filter((f) => f.endsWith('.md'));
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

    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Validation error: ${error.message}`);
    return result;
  }
}
