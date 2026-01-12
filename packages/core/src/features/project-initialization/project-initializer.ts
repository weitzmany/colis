/**
 * Project Initializer
 * 
 * Main initialization logic that orchestrates rules copying, commands copying,
 * Port Manager initialization, and IDE color configuration.
 * 
 * This is the core function that handles the complete project initialization workflow.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import { copyRules, CopyRulesResult } from './rules-copier.js';
import { copyCommands, CopyCommandsResult } from './commands-copier.js';
import { validateSetup, InitValidationResult } from './setup-validator.js';
import { initCommand as portManagerInit } from '../port-manager/cli/commands/init.js';
import { DefaultsInstaller } from '../tech-detector/standards/defaults-installer.js';
import { generateProjectName } from '../port-manager/utils/project-name.js';
import { generateColorPalette } from './color-manager.js';
import {
  generatePostCheckoutHook,
  setupGitHooksPath,
  ensureSettingsIgnored,
  initializeSettingsJson,
} from './hook-generator.js';

/**
 * Options for project initialization
 */
export interface InitOptions {
  /** Project name (auto-detected if not provided) */
  projectName?: string;
  /** App type (auto-detected if not provided) */
  appType?: string;
  /** Overwrite existing files. Default: false */
  overwrite?: boolean;
  /** Skip existing files (default behavior). Default: true */
  skipExisting?: boolean;
  /** Skip copying rules. Default: false */
  skipRules?: boolean;
  /** Skip copying commands. Default: false */
  skipCommands?: boolean;
  /** Skip Port Manager initialization (not recommended). Default: false */
  skipPortManager?: boolean;
  /** Skip prompting to install default frameworks. Default: false */
  skipDefaults?: boolean;
  /** Skip automatic domain setup with Caddy. Default: false */
  skipDomain?: boolean;
  /** Skip IDE color setup. Default: false */
  skipColors?: boolean;
  /** Show what would be done without making changes. Default: false */
  dryRun?: boolean;
}

/**
 * Result of project initialization
 */
export interface InitResult {
  /** Whether initialization succeeded */
  success: boolean;
  /** Result of rules copying operation */
  rulesResult?: CopyRulesResult;
  /** Result of commands copying operation */
  commandsResult?: CopyCommandsResult;
  /** Result of setup validation */
  validationResult?: InitValidationResult;
  /** Whether Port Manager was initialized */
  portManagerInitialized: boolean;
  /** List of errors encountered during initialization */
  errors: string[];
  /** List of warnings encountered during initialization */
  warnings: string[];
}

/**
 * Initialize a project with rules, commands, Port Manager, and IDE colors
 * 
 * This is the main entry point for project initialization. It orchestrates:
 * - Copying expert personas and user rules to `.cursor/rules/`
 * - Copying general commands to `.cursor/commands/general/` (excludes local commands)
 * - Initializing Port Manager (mandatory unless skipped)
 * - Configuring IDE colors with unique KEY_COLOR and branch-based themes
 * - Validating the setup
 * 
 * @param options - Initialization options
 * @returns Promise resolving to initialization result with success status and detailed information
 * 
 * @example
 * ```typescript
 * const result = await initializeProject({ overwrite: false, skipColors: false });
 * if (result.success) {
 *   console.log('Project initialized successfully!');
 * } else {
 *   console.error('Errors:', result.errors);
 * }
 * ```
 */
export async function initializeProject(options: InitOptions = {}): Promise<InitResult> {
  const result: InitResult = {
    success: true,
    portManagerInitialized: false,
    errors: [],
    warnings: [],
  };

  try {
    const projectPath = process.cwd();

    // Determine project name early (needed for color generation and logging)
    let projectName: string;
    if (options.projectName) {
      projectName = options.projectName;
    } else {
      projectName = generateProjectName(projectPath);
    }

    // Find core package path
    const corePackagePath = await findCorePackagePath();
    if (!corePackagePath) {
      result.success = false;
      result.errors.push(
        'Core package not found. Make sure @your-org/core is installed in node_modules.\n' +
        '  Solution: Run: npm install @your-org/core'
      );
      return result;
    }

    if (options.dryRun) {
      console.log(chalk.blue('🔍 Dry run mode - no changes will be made\n'));
      console.log(chalk.blue(`Project path: ${projectPath}`));
      console.log(chalk.blue(`Core package path: ${corePackagePath}\n`));
      
      // Show what would be done
      console.log(chalk.blue('Would perform the following operations:'));
      
      if (!options.skipRules) {
        const sourceRulesPath = path.join(corePackagePath, 'rules');
        const expertsPath = path.join(sourceRulesPath, 'experts');
        const userPath = path.join(sourceRulesPath, 'user');
        
        let expertCount = 0;
        let userCount = 0;
        
        if (await fs.pathExists(expertsPath)) {
          const expertFiles = (await fs.readdir(expertsPath)).filter(f => f.endsWith('.mdc'));
          expertCount = expertFiles.length;
        }
        if (await fs.pathExists(userPath)) {
          const userFiles = (await fs.readdir(userPath)).filter(f => f.endsWith('.mdc'));
          userCount = userFiles.length;
        }
        
        console.log(chalk.blue(`  📋 Copy ${expertCount} expert personas and ${userCount} user rules`));
      }
      
      if (!options.skipCommands) {
        const sourceCommandsPath = path.join(corePackagePath, 'commands', 'general');
        let commandCount = 0;
        if (await fs.pathExists(sourceCommandsPath)) {
          const commandFiles = (await fs.readdir(sourceCommandsPath)).filter(f => f.endsWith('.md'));
          commandCount = commandFiles.length;
        }
        console.log(chalk.blue(`  ⚡ Copy ${commandCount} general commands`));
      }
      
      if (!options.skipPortManager) {
        console.log(chalk.blue(`  🔌 Initialize Port Manager for project: ${projectName || 'auto-detect'}`));
      }
      
      if (!options.skipColors) {
        const palette = generateColorPalette(projectName || generateProjectName(projectPath));
        console.log(chalk.blue(`  🎨 Configure IDE colors with KEY_COLOR: ${palette.keyColor}`));
      }
      
      console.log(chalk.blue(`  ✓ Validate setup\n`));
      
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

    // Project name already determined above

    // Initialize Port Manager (mandatory unless skipped)
    if (!options.skipPortManager) {
      console.log(chalk.blue('🔌 Initializing Port Manager...'));
      try {
        await portManagerInit({
          projectName: projectName,
          appType: options.appType,
          autoConfigure: true,
          setupDomain: !options.skipDomain, // Automatically set up domain unless explicitly skipped
        });
        result.portManagerInitialized = true;
        console.log(chalk.green('  ✓ Port Manager initialized'));
      } catch (error: any) {
        // Port allocation failures are not critical - continue with initialization
        const errorMessage = error.message || String(error);
        if (errorMessage.includes('UNIQUE constraint') || errorMessage.includes('already assigned') || errorMessage.includes('already exists')) {
          result.warnings.push(`Port Manager: Port conflict detected. ${errorMessage}. You can allocate a port manually later with: port-manager allocate`);
          console.log(chalk.yellow(`  ⚠ Port allocation skipped (port conflict): ${errorMessage}`));
          console.log(chalk.yellow('  You can allocate a port manually later with: port-manager allocate'));
        } else {
          // Other errors are warnings but don't fail initialization
          result.warnings.push(`Port Manager initialization had issues: ${errorMessage}`);
          console.log(chalk.yellow(`  ⚠ Port Manager initialization had issues: ${errorMessage}`));
          console.log(chalk.yellow('  You can initialize Port Manager manually later with: npx @your-org/core port-manager init'));
        }
        // Don't mark as failed - port allocation is optional for project setup
        result.portManagerInitialized = false;
      }
    } else {
      result.warnings.push('Port Manager initialization was skipped (not recommended)');
    }

    // Setup IDE colors and git hooks (unless skipped)
    if (!options.skipColors && result.success && !options.dryRun) {
      console.log(chalk.blue('🎨 Setting up IDE colors...'));
      try {
        // Generate color palette for this project
        const palette = generateColorPalette(projectName);
        
        // Generate and install post-checkout hook
        await generatePostCheckoutHook(projectPath, palette);
        console.log(chalk.green(`  ✓ Generated post-checkout hook with KEY_COLOR: ${palette.keyColor}`));
        
        // Setup git hooks path
        await setupGitHooksPath(projectPath);
        console.log(chalk.green('  ✓ Configured git hooks path'));
        
        // Ensure .vscode/settings.json is ignored and remove from git tracking
        await ensureSettingsIgnored(projectPath);
        console.log(chalk.green('  ✓ Ensured .vscode/settings.json is ignored and removed from git tracking'));
        
        // Initialize settings.json with colors by running the hook
        try {
          const { execSync } = require('child_process');
          // Try to get current branch, default to 'main' if git not initialized
          let branchName = 'main';
          try {
            branchName = execSync('git rev-parse --abbrev-ref HEAD', {
              cwd: projectPath,
              encoding: 'utf-8',
              stdio: 'pipe',
            }).trim();
          } catch {
            // Git not initialized, use default
          }
          
          // Try to run the hook first
          try {
            execSync('bash .githooks/post-checkout', { cwd: projectPath, stdio: 'ignore' });
            console.log(chalk.green('  ✓ Initialized .vscode/settings.json with color scheme'));
          } catch {
            // Hook failed, generate settings.json directly
            await initializeSettingsJson(projectPath, palette, branchName);
            console.log(chalk.green('  ✓ Initialized .vscode/settings.json with color scheme'));
          }
        } catch (error: any) {
          // Fallback: generate settings.json directly
          try {
            await initializeSettingsJson(projectPath, palette, 'main');
            console.log(chalk.green('  ✓ Initialized .vscode/settings.json with color scheme'));
          } catch (initError: any) {
            result.warnings.push(`Could not initialize settings.json: ${initError.message}`);
          }
        }
      } catch (error: any) {
        // Don't fail initialization if color setup fails
        result.warnings.push(`Color setup failed: ${error.message}`);
        console.log(chalk.yellow(`  ⚠ Color setup failed: ${error.message}`));
      }
    }

    // Check for new project and prompt to install defaults
    if (result.success && !options.dryRun && !options.skipDefaults) {
      try {
        const defaultsInstaller = new DefaultsInstaller();
        const installResult = await defaultsInstaller.checkAndPromptForDefaults(projectPath, true);
        
        if (installResult.installed && installResult.framework) {
          console.log(chalk.green(`  ✓ Installed default framework: ${installResult.framework}`));
        } else if (installResult.errors.length > 0) {
          result.warnings.push(...installResult.errors);
        }
      } catch (error: any) {
        // Don't fail initialization if defaults installation fails
        result.warnings.push(`Defaults installation check failed: ${error.message}`);
      }
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

      result.validationResult = await validateSetup(
        projectPath,
        expectedRules,
        expectedCommands,
        { checkColors: !options.skipColors }
      );

      if (result.validationResult.success) {
        console.log(chalk.green('  ✓ All rules copied successfully'));
        console.log(chalk.green('  ✓ All commands copied successfully'));
        if (result.portManagerInitialized) {
          console.log(chalk.green('  ✓ Port Manager initialized successfully'));
        }
        if (result.validationResult.colorsValid && !options.skipColors) {
          console.log(chalk.green('  ✓ IDE colors configured successfully'));
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
  } catch (error: unknown) {
    result.success = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(
      `Initialization error: ${errorMessage}\n` +
      '  Solution: Check error details above and ensure all dependencies are installed'
    );
    return result;
  }
}

/**
 * Find the core package path in node_modules
 * 
 * Searches for @your-org/core package in common node_modules locations.
 * 
 * @returns Promise resolving to core package path if found, null otherwise
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
