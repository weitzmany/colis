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
import { readdir } from 'fs/promises';
import { execSync } from 'child_process';
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
  /** Delete files from project that don't exist in core package. Default: false */
  deleteOrphaned?: boolean;
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
        'Core package not found. Make sure @colis/rig is installed in node_modules.\n' +
        '  Solution: Run: npm install @colis/rig'
      );
      return result;
    }

    if (options.dryRun) {
      console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
      console.log(chalk.bold.cyan('║') + chalk.bold.white('  🔍 Dry Run Mode - Preview Only') + chalk.bold.cyan('                    ║'));
      console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════╝\n'));
      
      console.log(chalk.bold('📁 Project Information:'));
      console.log(chalk.gray(`  Project path: ${chalk.white(projectPath)}`));
      console.log(chalk.gray(`  Project name: ${chalk.white(projectName)}`));
      console.log(chalk.gray(`  Core package: ${chalk.white(corePackagePath)}\n`));
      
      // Show what would be done
      console.log(chalk.bold('📋 Operations that would be performed:\n'));
      
      if (!options.skipRules) {
        const sourceRulesPath = path.join(corePackagePath, 'rules');
        const expertsPath = path.join(sourceRulesPath, 'experts');
        const userPath = path.join(sourceRulesPath, 'user');
        
        let expertCount = 0;
        let userCount = 0;
        
        if (await fs.pathExists(expertsPath)) {
          const expertFiles = (await readdir(expertsPath)).filter(f => f.endsWith('.mdc'));
          expertCount = expertFiles.length;
        }
        if (await fs.pathExists(userPath)) {
          const userFiles = (await readdir(userPath)).filter(f => f.endsWith('.mdc'));
          userCount = userFiles.length;
        }
        
        console.log(chalk.cyan(`  📋 Copy ${chalk.bold(expertCount.toString())} expert personas and ${chalk.bold(userCount.toString())} user rules`));
        console.log(chalk.dim(`     → .cursor/rules/`));
      }
      
      if (!options.skipCommands) {
        const sourceCommandsPath = path.join(corePackagePath, 'commands', 'general');
        let commandCount = 0;
        if (await fs.pathExists(sourceCommandsPath)) {
          const commandFiles = (await readdir(sourceCommandsPath)).filter(f => f.endsWith('.md'));
          commandCount = commandFiles.length;
        }
        console.log(chalk.cyan(`  ⚡ Copy ${chalk.bold(commandCount.toString())} general commands`));
        console.log(chalk.dim(`     → .cursor/commands/general/`));
      }
      
      if (!options.skipPortManager) {
        console.log(chalk.cyan(`  🔌 Initialize Port Manager`));
        console.log(chalk.dim(`     → Project: ${projectName || 'auto-detect'}`));
        console.log(chalk.dim(`     → Creates .port-manager.json`));
      }
      
      if (!options.skipColors) {
        const palette = generateColorPalette(projectName || generateProjectName(projectPath));
        console.log(chalk.cyan(`  🎨 Configure IDE colors`));
        console.log(chalk.dim(`     → KEY_COLOR: ${chalk.bold(palette.keyColor)}`));
        console.log(chalk.dim(`     → Creates .githooks/post-checkout`));
        console.log(chalk.dim(`     → Creates .vscode/settings.json`));
      }
      
      console.log(chalk.cyan(`  ✓ Validate setup`));
      console.log(chalk.dim(`     → Verify all files copied correctly\n`));
      
      console.log(chalk.dim('💡 Tip: Remove --dry-run to actually perform these operations\n'));
      
      return result;
    }

    // Copy rules
    if (!options.skipRules) {
      console.log(chalk.bold.blue('📋 Copying rules...'));
      process.stdout.write(chalk.dim('  ⏳ Processing...'));
      
      result.rulesResult = await copyRules(corePackagePath, projectPath, {
        overwrite: options.overwrite,
        deleteOrphaned: options.deleteOrphaned,
      });

      // Clear the loading indicator
      process.stdout.write('\r' + ' '.repeat(20) + '\r');

      if (result.rulesResult.success) {
        const { stats } = result.rulesResult;
        
        if (stats.copied > 0) {
          const expertCount = result.rulesResult.copied.filter(f => f.startsWith('experts/')).length;
          const userCount = result.rulesResult.copied.filter(f => f.startsWith('user/')).length;
          console.log(chalk.green(`  ✓ Copied ${chalk.bold(stats.copied.toString())} files (${expertCount} expert personas, ${userCount} user rules)`));
        }
        
        if (stats.skipped > 0) {
          console.log(
            chalk.dim(`  ⊙ Skipped ${chalk.bold(stats.skipped.toString())} identical files (same hash)`)
          );
        }
        
        if (stats.deleted > 0) {
          console.log(
            chalk.yellow(`  ⚠ Deleted ${chalk.bold(stats.deleted.toString())} orphaned files`)
          );
        }
      } else {
        result.success = false;
        result.errors.push(...result.rulesResult.errors);
        console.log(chalk.red(`  ✗ Failed to synchronize rules`));
        result.rulesResult.errors.forEach(err => {
          console.log(chalk.red(`    • ${err}`));
        });
      }
    }

    // Copy commands
    if (!options.skipCommands) {
      console.log(chalk.bold.blue('⚡ Copying commands...'));
      process.stdout.write(chalk.dim('  ⏳ Processing...'));
      
      result.commandsResult = await copyCommands(corePackagePath, projectPath, {
        overwrite: options.overwrite,
        deleteOrphaned: options.deleteOrphaned,
      });

      // Clear the loading indicator
      process.stdout.write('\r' + ' '.repeat(20) + '\r');

      if (result.commandsResult.success) {
        const { stats } = result.commandsResult;
        
        if (stats.copied > 0) {
          console.log(
            chalk.green(`  ✓ Copied ${chalk.bold(stats.copied.toString())} command files`)
          );
        }
        
        if (stats.skipped > 0) {
          console.log(
            chalk.dim(`  ⊙ Skipped ${chalk.bold(stats.skipped.toString())} identical files (same hash)`)
          );
        }
        
        if (stats.deleted > 0) {
          console.log(
            chalk.yellow(`  ⚠ Deleted ${chalk.bold(stats.deleted.toString())} orphaned files`)
          );
        }
        
        if (result.commandsResult.excluded.length > 0) {
          console.log(
            chalk.dim(`  ⊘ Excluded ${result.commandsResult.excluded.length} local commands (packages repo only)`)
          );
        }
      } else {
        result.success = false;
        result.errors.push(...result.commandsResult.errors);
        console.log(chalk.red(`  ✗ Failed to synchronize commands`));
        result.commandsResult.errors.forEach(err => {
          console.log(chalk.red(`    • ${err}`));
        });
      }
    }

    // Project name already determined above

    // Initialize Port Manager (mandatory unless skipped)
    if (!options.skipPortManager) {
      console.log(chalk.bold.blue('🔌 Initializing Port Manager...'));
      process.stdout.write(chalk.dim('  ⏳ Allocating port and configuring...'));
      
      try {
        await portManagerInit({
          projectName: projectName,
          appType: options.appType,
          autoConfigure: true,
          setupDomain: !options.skipDomain, // Automatically set up domain unless explicitly skipped
        });
        
        // Clear the loading indicator
        process.stdout.write('\r' + ' '.repeat(40) + '\r');
        
        result.portManagerInitialized = true;
        console.log(chalk.green('  ✓ Port Manager initialized successfully'));
        console.log(chalk.dim('    → Port allocation configured'));
        console.log(chalk.dim('    → Created .port-manager.json'));
      } catch (error: unknown) {
        // Clear the loading indicator
        process.stdout.write('\r' + ' '.repeat(40) + '\r');
        // Port allocation failures are not critical - continue with initialization
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('UNIQUE constraint') || errorMessage.includes('already assigned') || errorMessage.includes('already exists')) {
          result.warnings.push(`Port Manager: Port conflict detected. ${errorMessage}. You can allocate a port manually later with: port-manager allocate`);
          console.log(chalk.yellow(`  ⚠ Port conflict detected: ${errorMessage.split('\n')[0]}`));
          console.log(chalk.dim('    💡 You can allocate a port manually: npx @colis/rig port-manager allocate'));
        } else {
          // Other errors are warnings but don't fail initialization
          result.warnings.push(`Port Manager initialization had issues: ${errorMessage}`);
          console.log(chalk.yellow(`  ⚠ Port Manager initialization had issues: ${errorMessage.split('\n')[0]}`));
          console.log(chalk.dim('    💡 You can initialize manually: npx @colis/rig port-manager init'));
        }
        // Don't mark as failed - port allocation is optional for project setup
        result.portManagerInitialized = false;
      }
    } else {
      result.warnings.push('Port Manager initialization was skipped (not recommended)');
      console.log(chalk.yellow('  ⚠ Port Manager initialization skipped'));
      console.log(chalk.dim('    💡 Initialize manually: npx @colis/rig port-manager init'));
    }

    // Setup IDE colors and git hooks (unless skipped)
    if (!options.skipColors && result.success && !options.dryRun) {
      console.log(chalk.bold.blue('🎨 Setting up IDE colors...'));
      process.stdout.write(chalk.dim('  ⏳ Generating color palette and configuring...'));
      
      try {
        // Generate color palette for this project
        const palette = generateColorPalette(projectName);
        
        // Generate and install post-checkout hook
        await generatePostCheckoutHook(projectPath, palette);
        
        // Setup git hooks path
        await setupGitHooksPath(projectPath);
        
        // Ensure .vscode/settings.json is ignored and remove from git tracking
        await ensureSettingsIgnored(projectPath);
        
        // Clear the loading indicator
        process.stdout.write('\r' + ' '.repeat(50) + '\r');
        
        console.log(chalk.green(`  ✓ Generated post-checkout hook`));
        console.log(chalk.dim(`    → KEY_COLOR: ${chalk.bold(palette.keyColor)}`));
        console.log(chalk.green('  ✓ Configured git hooks path'));
        console.log(chalk.green('  ✓ Configured .vscode/settings.json (ignored in git)'));
        
        // Initialize settings.json with colors by running the hook
        try {
          process.stdout.write(chalk.dim('  ⏳ Applying color scheme...'));
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
            process.stdout.write('\r' + ' '.repeat(30) + '\r');
            console.log(chalk.green('  ✓ Applied color scheme to IDE'));
            console.log(chalk.dim(`    → Colors will change automatically when you switch branches`));
          } catch {
            // Hook failed, generate settings.json directly
            await initializeSettingsJson(projectPath, palette, branchName);
            process.stdout.write('\r' + ' '.repeat(30) + '\r');
            console.log(chalk.green('  ✓ Applied color scheme to IDE'));
            console.log(chalk.dim(`    → Colors will change automatically when you switch branches`));
          }
        } catch (error: unknown) {
          // Fallback: generate settings.json directly
          try {
            await initializeSettingsJson(projectPath, palette, 'main');
            process.stdout.write('\r' + ' '.repeat(30) + '\r');
            console.log(chalk.green('  ✓ Applied color scheme to IDE'));
            console.log(chalk.dim(`    → Colors will change automatically when you switch branches`));
          } catch (initError: unknown) {
            process.stdout.write('\r' + ' '.repeat(30) + '\r');
            const errorMsg = initError instanceof Error ? initError.message : String(initError);
            result.warnings.push(`Could not initialize settings.json: ${errorMsg}`);
            console.log(chalk.yellow(`  ⚠ Could not initialize settings.json: ${errorMsg}`));
          }
        }
      } catch (error: unknown) {
        // Clear the loading indicator
        process.stdout.write('\r' + ' '.repeat(50) + '\r');
        
        // Don't fail initialization if color setup fails
        const errorMsg = error instanceof Error ? error.message : String(error);
        result.warnings.push(`Color setup failed: ${errorMsg}`);
        console.log(chalk.yellow(`  ⚠ Color setup failed: ${errorMsg}`));
        console.log(chalk.dim('    💡 You can set up colors manually: npx @colis/rig colors'));
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
      console.log(chalk.bold.blue('\n✓ Validating setup...'));
      process.stdout.write(chalk.dim('  ⏳ Checking files and configuration...'));
      
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

      // Clear the loading indicator
      process.stdout.write('\r' + ' '.repeat(40) + '\r');

      if (result.validationResult.success) {
        console.log(chalk.green('  ✓ All components validated successfully'));
      } else {
        result.warnings.push(...result.validationResult.errors);
        result.warnings.push(...result.validationResult.warnings);
        if (result.validationResult.errors.length > 0) {
          console.log(chalk.yellow('  ⚠ Some validation issues found (see warnings)'));
        }
      }
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
 * Searches for @colis/rig package in common node_modules locations.
 * 
 * @returns Promise resolving to core package path if found, null otherwise
 */
async function findCorePackagePath(): Promise<string | null> {
  const projectPath = process.cwd();
  const possiblePaths = [
    path.join(projectPath, 'node_modules', '@colis', 'rig'),
    path.join(projectPath, 'node_modules', 'core'),
  ];

  console.log(chalk.dim('\n🔍 Debug: Searching for core package...'));
  console.log(chalk.dim(`   Project path: ${projectPath}`));
  console.log(chalk.dim(`   Checking paths:`));
  
  for (const possiblePath of possiblePaths) {
    const exists = await fs.pathExists(possiblePath);
    console.log(chalk.dim(`   - ${possiblePath}: ${exists ? '✓ FOUND' : '✗ not found'}`));
    if (exists) {
      console.log(chalk.dim(`   Using: ${possiblePath}\n`));
      return possiblePath;
    }
  }

  console.log(chalk.yellow(`   ⚠️  Core package not found in any location\n`));
  return null;
}
