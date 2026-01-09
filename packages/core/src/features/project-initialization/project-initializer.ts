/**
 * Project Initializer
 * 
 * Main initialization logic that orchestrates rules copying, commands copying,
 * and Port Manager initialization.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import { copyRules, CopyRulesResult } from './rules-copier';
import { copyCommands, CopyCommandsResult } from './commands-copier';
import { validateSetup, ValidationResult } from './setup-validator';
import { initCommand as portManagerInit } from '../port-manager/cli/commands/init';

export interface InitOptions {
  projectName?: string;
  appType?: string;
  overwrite?: boolean;
  skipExisting?: boolean;
  skipRules?: boolean;
  skipCommands?: boolean;
  skipPortManager?: boolean;
  dryRun?: boolean;
}

export interface InitResult {
  success: boolean;
  rulesResult?: CopyRulesResult;
  commandsResult?: CopyCommandsResult;
  validationResult?: ValidationResult;
  portManagerInitialized: boolean;
  errors: string[];
  warnings: string[];
}

export async function initializeProject(options: InitOptions = {}): Promise<InitResult> {
  const result: InitResult = {
    success: true,
    portManagerInitialized: false,
    errors: [],
    warnings: [],
  };

  try {
    const projectPath = process.cwd();

    // Find core package path
    const corePackagePath = await findCorePackagePath();
    if (!corePackagePath) {
      result.success = false;
      result.errors.push(
        'Core package not found. Make sure @your-org/core is installed in node_modules.'
      );
      return result;
    }

    if (options.dryRun) {
      console.log(chalk.blue('🔍 Dry run mode - no changes will be made'));
      console.log(chalk.blue(`Project path: ${projectPath}`));
      console.log(chalk.blue(`Core package path: ${corePackagePath}`));
      return result;
    }

    // Copy rules
    if (!options.skipRules) {
      console.log(chalk.blue('📋 Copying rules...'));
      result.rulesResult = await copyRules(corePackagePath, projectPath, {
        overwrite: options.overwrite,
        skipExisting: options.skipExisting,
      });

      if (result.rulesResult.success) {
        if (result.rulesResult.copied.length > 0) {
          console.log(chalk.green(`  ✓ Copied ${result.rulesResult.copied.length} rule files`));
        }
        if (result.rulesResult.skipped.length > 0) {
          console.log(
            chalk.yellow(`  ⚠ Skipped ${result.rulesResult.skipped.length} existing files`)
          );
        }
      } else {
        result.success = false;
        result.errors.push(...result.rulesResult.errors);
        console.log(chalk.red(`  ✗ Failed to copy rules: ${result.rulesResult.errors.join(', ')}`));
      }
    }

    // Copy commands
    if (!options.skipCommands) {
      console.log(chalk.blue('⚡ Copying commands...'));
      result.commandsResult = await copyCommands(corePackagePath, projectPath, {
        overwrite: options.overwrite,
        skipExisting: options.skipExisting,
      });

      if (result.commandsResult.success) {
        if (result.commandsResult.copied.length > 0) {
          console.log(
            chalk.green(`  ✓ Copied ${result.commandsResult.copied.length} command files`)
          );
        }
        if (result.commandsResult.skipped.length > 0) {
          console.log(
            chalk.yellow(`  ⚠ Skipped ${result.commandsResult.skipped.length} existing files`)
          );
        }
        if (result.commandsResult.excluded.length > 0) {
          console.log(
            chalk.gray(`  ⊘ Excluded ${result.commandsResult.excluded.length} local commands (packages repo only)`)
          );
        }
      } else {
        result.success = false;
        result.errors.push(...result.commandsResult.errors);
        console.log(
          chalk.red(`  ✗ Failed to copy commands: ${result.commandsResult.errors.join(', ')}`)
        );
      }
    }

    // Initialize Port Manager (mandatory unless skipped)
    if (!options.skipPortManager) {
      console.log(chalk.blue('🔌 Initializing Port Manager...'));
      try {
        await portManagerInit({
          projectName: options.projectName,
          appType: options.appType,
          autoConfigure: true,
        });
        result.portManagerInitialized = true;
        console.log(chalk.green('  ✓ Port Manager initialized'));
      } catch (error: any) {
        result.success = false;
        result.errors.push(`Port Manager initialization failed: ${error.message}`);
        console.log(chalk.red(`  ✗ Port Manager initialization failed: ${error.message}`));
      }
    } else {
      result.warnings.push('Port Manager initialization was skipped (not recommended)');
    }

    // Validate setup
    if (result.success) {
      console.log(chalk.blue('✓ Validating setup...'));
      const expectedRules = {
        experts: result.rulesResult?.copied.length || 0,
        user: result.rulesResult?.copied.filter((f) => f.startsWith('user/')).length || 0,
      };
      const expectedCommands = {
        general: result.commandsResult?.copied.length || 0,
      };

      result.validationResult = await validateSetup(projectPath, expectedRules, expectedCommands);

      if (result.validationResult.success) {
        console.log(chalk.green('  ✓ All rules copied successfully'));
        console.log(chalk.green('  ✓ All commands copied successfully'));
        if (result.portManagerInitialized) {
          console.log(chalk.green('  ✓ Port Manager initialized successfully'));
        }
      } else {
        result.warnings.push(...result.validationResult.errors);
        result.warnings.push(...result.validationResult.warnings);
      }
    }

    if (result.success) {
      console.log(chalk.green('\n✅ Project initialized successfully!'));
    } else {
      console.log(chalk.red('\n❌ Project initialization completed with errors'));
    }

    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Initialization error: ${error.message}`);
    return result;
  }
}

/**
 * Find the core package path in node_modules
 */
async function findCorePackagePath(): Promise<string | null> {
  const projectPath = process.cwd();
  const possiblePaths = [
    path.join(projectPath, 'node_modules', '@your-org', 'core'),
    path.join(projectPath, 'node_modules', 'core'),
  ];

  for (const possiblePath of possiblePaths) {
    if (await fs.pathExists(possiblePath)) {
      return possiblePath;
    }
  }

  return null;
}
