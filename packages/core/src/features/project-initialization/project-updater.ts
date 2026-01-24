/**
 * Project Updater
 * 
 * Updates project initialization by checking for gaps and making changes as needed.
 * Similar to init but smarter - only updates what's missing or outdated.
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
import { FrameworkDetector } from '../port-manager/utils/project-detector.js';
import { DefaultsInstaller } from '../tech-detector/standards/defaults-installer.js';
import { generateProjectName } from '../port-manager/utils/project-name.js';
import { generateColorPalette } from './color-manager.js';
import {
  generatePostCheckoutHook,
  setupGitHooksPath,
  ensureSettingsIgnored,
  initializeSettingsJson,
} from './hook-generator.js';
import { PortManager } from '../port-manager/port-manager.js';
import { GlobalConfigManager } from '../../shared/config/global-config.js';
import { ProjectConfigManager } from '../../shared/config/project-config.js';

export interface UpdateOptions {
  projectName?: string;
  appType?: string;
  overwrite?: boolean;
  deleteOrphaned?: boolean; // Delete files from project that don't exist in core package
  skipRules?: boolean;
  skipCommands?: boolean;
  skipPortManager?: boolean;
  skipDefaults?: boolean;
  skipDomain?: boolean;
  skipColors?: boolean;
  dryRun?: boolean;
  checkOnly?: boolean; // Only check, don't update
}

export interface UpdateResult {
  success: boolean;
  rulesResult?: CopyRulesResult;
  commandsResult?: CopyCommandsResult;
  validationResult?: InitValidationResult;
  portManagerUpdated: boolean;
  colorsUpdated: boolean;
  updated: string[];
  added: string[];
  errors: string[];
  warnings: string[];
}

export async function updateProject(options: UpdateOptions = {}): Promise<UpdateResult> {
  const result: UpdateResult = {
    success: true,
    portManagerUpdated: false,
    colorsUpdated: false,
    updated: [],
    added: [],
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

    if (options.dryRun || options.checkOnly) {
      console.log(chalk.blue('🔍 Checking project status...'));
      console.log(chalk.blue(`Project path: ${projectPath}`));
      console.log(chalk.blue(`Core package path: ${corePackagePath}`));
    }

    // Check what's already initialized
    const currentState = await checkCurrentState(projectPath, corePackagePath);
    
    if (options.checkOnly) {
      console.log(chalk.blue('\n📊 Current State:'));
      console.log(chalk.blue(`  Rules: ${currentState.rulesCount} files`));
      console.log(chalk.blue(`  Commands: ${currentState.commandsCount} files`));
      console.log(chalk.blue(`  Port Manager: ${currentState.portManagerInitialized ? '✓' : '✗'}`));
      console.log(chalk.blue(`  Colors: ${currentState.colorsConfigured ? '✓' : '✗'}`));
      
      if (currentState.missingRules.length > 0) {
        console.log(chalk.yellow(`\n⚠ Missing rules: ${currentState.missingRules.length}`));
        currentState.missingRules.forEach((rule) => console.log(chalk.yellow(`  - ${rule}`)));
      }
      
      if (currentState.missingCommands.length > 0) {
        console.log(chalk.yellow(`\n⚠ Missing commands: ${currentState.missingCommands.length}`));
        currentState.missingCommands.forEach((cmd) => console.log(chalk.yellow(`  - ${cmd}`)));
      }
      
      return result;
    }

    // Update rules - sync with hash comparison
    if (!options.skipRules) {
      console.log(chalk.blue('📋 Synchronizing rules...'));
      
      result.rulesResult = await copyRules(corePackagePath, projectPath, {
        overwrite: options.overwrite || false,
        deleteOrphaned: options.deleteOrphaned || false,
      });

      if (result.rulesResult.success) {
        const { stats } = result.rulesResult;
        
        if (stats.copied > 0) {
          console.log(chalk.green(`  ✓ Copied ${stats.copied} rule files (modified or new)`));
          result.added.push(...result.rulesResult.copied.map((f) => `rule: ${f}`));
        }
        
        if (stats.skipped > 0) {
          console.log(chalk.dim(`  ⊙ Skipped ${stats.skipped} identical files (same hash)`));
        }
        
        if (stats.deleted > 0) {
          console.log(chalk.yellow(`  ⚠ Deleted ${stats.deleted} orphaned files`));
          result.updated.push(...result.rulesResult.deleted.map((f) => `deleted rule: ${f}`));
        }
        
        if (stats.total === stats.skipped) {
          console.log(chalk.green('  ✓ All rules up to date'));
        }
      } else {
        result.success = false;
        result.errors.push(...result.rulesResult.errors);
        console.log(chalk.red(`  ✗ Failed to synchronize rules`));
        result.rulesResult.errors.forEach((err) => {
          console.log(chalk.red(`    • ${err}`));
        });
      }
    }

    // Update commands - sync with hash comparison
    if (!options.skipCommands) {
      console.log(chalk.blue('⚡ Synchronizing commands...'));
      
      result.commandsResult = await copyCommands(corePackagePath, projectPath, {
        overwrite: options.overwrite || false,
        deleteOrphaned: options.deleteOrphaned || false,
      });

      if (result.commandsResult.success) {
        const { stats } = result.commandsResult;
        
        if (stats.copied > 0) {
          console.log(chalk.green(`  ✓ Copied ${stats.copied} command files (modified or new)`));
          result.added.push(...result.commandsResult.copied.map((f) => `command: ${f}`));
        }
        
        if (stats.skipped > 0) {
          console.log(chalk.dim(`  ⊙ Skipped ${stats.skipped} identical files (same hash)`));
        }
        
        if (stats.deleted > 0) {
          console.log(chalk.yellow(`  ⚠ Deleted ${stats.deleted} orphaned files`));
          result.updated.push(...result.commandsResult.deleted.map((f) => `deleted command: ${f}`));
        }
        
        if (result.commandsResult.excluded.length > 0) {
          console.log(
            chalk.dim(`  ⊘ Excluded ${result.commandsResult.excluded.length} local commands (packages repo only)`)
          );
        }
        
        if (stats.total === stats.skipped) {
          console.log(chalk.green('  ✓ All commands up to date'));
        }
      } else {
        result.success = false;
        result.errors.push(...result.commandsResult.errors);
        console.log(chalk.red(`  ✗ Failed to synchronize commands`));
        result.commandsResult.errors.forEach((err) => {
          console.log(chalk.red(`    • ${err}`));
        });
      }
    }

    // Determine project name (needed for color generation and Port Manager)
    let projectName = options.projectName;
    if (!projectName) {
      projectName = generateProjectName(projectPath);
    }

    // Update Port Manager if needed
    if (!options.skipPortManager) {
      console.log(chalk.blue('🔌 Checking Port Manager...'));
      try {
        const globalConfig = new GlobalConfigManager();
        await globalConfig.load();

        const portManager = new PortManager({
          database: (await globalConfig.get()).database || {
            type: 'sqlite',
            sqlite: { path: '~/.port-manager/registry.db' },
          },
        });

        await portManager.connect();

        // Detect app type if not provided
        let appType = options.appType;
        if (!appType) {
          const detector = new FrameworkDetector();
          appType = (await detector.detect(projectPath)) || 'node';
        }

        // Check if Port Manager is already initialized
        const existing = await portManager.getPort(projectName, appType as any);
        
        // Check if .port-manager.json exists
        const projectConfigManager = new ProjectConfigManager(projectPath);
        const configExists = await projectConfigManager.exists();
        
        if (!existing) {
          console.log(chalk.yellow('  ⚠ Port Manager not initialized, initializing now...'));
          await portManagerInit({
            projectName: projectName,
            appType: appType,
            autoConfigure: true,
            setupDomain: !options.skipDomain,
          });
          result.portManagerUpdated = true;
          result.added.push('Port Manager initialization');
          console.log(chalk.green('  ✓ Port Manager initialized'));
        } else {
          // Check if port configuration matches current project
          if (existing.projectPath !== projectPath) {
            result.warnings.push(
              `Port Manager assignment exists but project path differs: ${existing.projectPath} vs ${projectPath}`
            );
          }
          
          // Check if .port-manager.json file exists
          if (!configExists) {
            console.log(chalk.yellow('  ⚠ Port Manager database entry exists but .port-manager.json is missing, creating it...'));
            try {
              // Configure project to create .port-manager.json
              const configResult = await portManager.configure(projectName, appType as any, existing.port, true);
              if (configResult.filesCreated.includes('.port-manager.json')) {
                result.portManagerUpdated = true;
                result.added.push('.port-manager.json');
                console.log(chalk.green('  ✓ Created .port-manager.json'));
              }
            } catch (error: any) {
              result.warnings.push(`Failed to create .port-manager.json: ${error.message}`);
              console.log(chalk.yellow(`  ⚠ Failed to create .port-manager.json: ${error.message}`));
            }
          } else {
            // Verify config matches database
            const config = await projectConfigManager.load();
            if (config && (config.port !== existing.port || config.projectName !== existing.projectName)) {
              console.log(chalk.yellow('  ⚠ .port-manager.json exists but doesn\'t match database, updating...'));
              try {
                await projectConfigManager.update({
                  projectName: existing.projectName,
                  appType: existing.appType,
                  port: existing.port,
                });
                result.portManagerUpdated = true;
                result.updated.push('.port-manager.json');
                console.log(chalk.green('  ✓ Updated .port-manager.json to match database'));
              } catch (error: any) {
                result.warnings.push(`Failed to update .port-manager.json: ${error.message}`);
              }
            }
          }
          
          console.log(chalk.green(`  ✓ Port Manager already initialized (port: ${existing.port})`));
        }

        await portManager.disconnect();
      } catch (error: any) {
        result.warnings.push(`Port Manager check failed: ${error.message}`);
        console.log(chalk.yellow(`  ⚠ Port Manager check failed: ${error.message}`));
      }
    }

    // Update IDE colors if needed
    if (!options.skipColors && result.success && !options.dryRun) {
      console.log(chalk.blue('🎨 Checking IDE colors...'));
      try {
        const hookPath = path.join(projectPath, '.githooks', 'post-checkout');

        // Check if colors are configured
        let colorsNeedUpdate = false;
        
        if (!(await fs.pathExists(hookPath))) {
          colorsNeedUpdate = true;
          console.log(chalk.yellow('  ⚠ Post-checkout hook not found'));
        } else {
          const hookContent = await fs.readFile(hookPath, 'utf-8');
          if (!hookContent.includes('KEY_COLOR=')) {
            colorsNeedUpdate = true;
            console.log(chalk.yellow('  ⚠ Post-checkout hook missing KEY_COLOR'));
          }
        }

        if (colorsNeedUpdate) {
          console.log(chalk.blue('  ↻ Updating IDE colors...'));
          const palette = generateColorPalette(projectName);
          
          await generatePostCheckoutHook(projectPath, palette);
          await setupGitHooksPath(projectPath);
          await ensureSettingsIgnored(projectPath);
          
          // Try to initialize settings.json
          try {
            let branchName = 'main';
            try {
              branchName = execSync('git rev-parse --abbrev-ref HEAD', {
                cwd: projectPath,
                encoding: 'utf-8',
                stdio: 'pipe',
              }).trim();
            } catch {
              // Git not initialized
            }
            
            try {
              execSync('bash .githooks/post-checkout', { cwd: projectPath, stdio: 'ignore' });
            } catch {
              await initializeSettingsJson(projectPath, palette, branchName);
            }
          } catch (error: any) {
            // Ignore errors
          }
          
          result.colorsUpdated = true;
          result.updated.push('IDE colors configuration');
          console.log(chalk.green(`  ✓ Updated IDE colors (KEY_COLOR: ${palette.keyColor})`));
        } else {
          console.log(chalk.green('  ✓ IDE colors already configured'));
        }
      } catch (error: any) {
        result.warnings.push(`Color update check failed: ${error.message}`);
        console.log(chalk.yellow(`  ⚠ Color update check failed: ${error.message}`));
      }
    }

    // Check for defaults (but don't prompt, just check)
    if (result.success && !options.dryRun && !options.skipDefaults) {
      try {
        const defaultsInstaller = new DefaultsInstaller();
        // Check but don't prompt
        const installResult = await defaultsInstaller.checkAndPromptForDefaults(projectPath, false);
        
        if (installResult.errors.length > 0) {
          result.warnings.push(...installResult.errors);
        }
      } catch (error: any) {
        result.warnings.push(`Defaults check failed: ${error.message}`);
      }
    }

    // Validate setup
    if (result.success) {
      console.log(chalk.blue('✓ Validating setup...'));
      const expectedRules = {
        experts: result.rulesResult?.copied.length || currentState.rulesCount,
        user: result.rulesResult?.copied.filter((f) => f.startsWith('user/')).length || 0,
      };
      const expectedCommands = {
        general: result.commandsResult?.copied.length || currentState.commandsCount,
      };

      result.validationResult = await validateSetup(
        projectPath,
        expectedRules,
        expectedCommands,
        { checkColors: !options.skipColors }
      );

      if (result.validationResult.success) {
        console.log(chalk.green('  ✓ Setup validation passed'));
      } else {
        result.warnings.push(...result.validationResult.errors);
        result.warnings.push(...result.validationResult.warnings);
      }
    }

    if (result.success) {
      if (result.added.length > 0 || result.updated.length > 0) {
        console.log(chalk.green('\n✅ Project updated successfully!'));
      } else {
        console.log(chalk.green('\n✅ Project is up to date!'));
      }
    } else {
      console.log(chalk.red('\n❌ Project update completed with errors'));
    }

    return result;
  } catch (error: any) {
    result.success = false;
    result.errors.push(`Update error: ${error.message}`);
    return result;
  }
}

/**
 * Check current state of project initialization
 */
async function checkCurrentState(
  projectPath: string,
  corePackagePath: string
): Promise<{
  rulesCount: number;
  commandsCount: number;
  portManagerInitialized: boolean;
  colorsConfigured: boolean;
  missingRules: string[];
  missingCommands: string[];
}> {
  const state = {
    rulesCount: 0,
    commandsCount: 0,
    portManagerInitialized: false,
    colorsConfigured: false,
    missingRules: [] as string[],
    missingCommands: [] as string[],
  };

  // Check rules
  const rulesPath = path.join(projectPath, '.cursor', 'rules');
  const expertsPath = path.join(rulesPath, 'experts');
  const userPath = path.join(rulesPath, 'user');

  if (await fs.pathExists(expertsPath)) {
    const expertFiles = (await fs.readdir(expertsPath)).filter((f) => f.endsWith('.mdc'));
    state.rulesCount += expertFiles.length;
  }

  if (await fs.pathExists(userPath)) {
    const userFiles = (await fs.readdir(userPath)).filter((f) => f.endsWith('.mdc'));
    state.rulesCount += userFiles.length;
  }

  // Check commands
  const commandsPath = path.join(projectPath, '.cursor', 'commands');
  const generalPath = path.join(commandsPath, 'general');

  if (await fs.pathExists(generalPath)) {
    const commandFiles = (await fs.readdir(generalPath)).filter((f) => f.endsWith('.md'));
    state.commandsCount = commandFiles.length;
  }

  // Check Port Manager
  const portManagerConfigPath = path.join(projectPath, '.port-manager.json');
  state.portManagerInitialized = await fs.pathExists(portManagerConfigPath);

  // Check colors
  const hookPath = path.join(projectPath, '.githooks', 'post-checkout');
  if (await fs.pathExists(hookPath)) {
    try {
      const hookContent = await fs.readFile(hookPath, 'utf-8');
      state.colorsConfigured = hookContent.includes('KEY_COLOR=');
    } catch {
      // Ignore
    }
  }

  // Find missing rules
  state.missingRules = await findMissingRules(corePackagePath, projectPath);

  // Find missing commands
  state.missingCommands = await findMissingCommands(corePackagePath, projectPath);

  return state;
}

/**
 * Find missing rules by comparing core package with project
 */
async function findMissingRules(
  corePackagePath: string,
  projectPath: string
): Promise<string[]> {
  const missing: string[] = [];
  
  try {
    const sourceRulesPath = path.join(corePackagePath, 'rules');
    const targetRulesPath = path.join(projectPath, '.cursor', 'rules');

    // Check expert personas
    const expertsSource = path.join(sourceRulesPath, 'experts');
    const expertsTarget = path.join(targetRulesPath, 'experts');

    if (await fs.pathExists(expertsSource)) {
      const expertFiles = (await readdir(expertsSource)).filter((f) => f.endsWith('.mdc'));
      for (const file of expertFiles) {
        const targetFile = path.join(expertsTarget, file);
        if (!(await fs.pathExists(targetFile))) {
          missing.push(`experts/${file}`);
        }
      }
    }

    // Check user rules
    const userSource = path.join(sourceRulesPath, 'user');
    const userTarget = path.join(targetRulesPath, 'user');

    if (await fs.pathExists(userSource)) {
      const userFiles = (await readdir(userSource)).filter((f) => f.endsWith('.mdc'));
      for (const file of userFiles) {
        const targetFile = path.join(userTarget, file);
        if (!(await fs.pathExists(targetFile))) {
          missing.push(`user/${file}`);
        }
      }
    }
  } catch (error: any) {
    // Ignore errors
  }

  return missing;
}

/**
 * Find missing commands by comparing core package with project
 */
async function findMissingCommands(
  corePackagePath: string,
  projectPath: string
): Promise<string[]> {
  const missing: string[] = [];
  
  try {
    const sourceCommandsPath = path.join(corePackagePath, 'commands');
    const targetCommandsPath = path.join(projectPath, '.cursor', 'commands');

    // Check general commands
    const generalSource = path.join(sourceCommandsPath, 'general');
    const generalTarget = path.join(targetCommandsPath, 'general');

    if (await fs.pathExists(generalSource)) {
      const commandFiles = (await fs.readdir(generalSource)).filter((f) => f.endsWith('.md'));
      for (const file of commandFiles) {
        const targetFile = path.join(generalTarget, file);
        if (!(await fs.pathExists(targetFile))) {
          missing.push(`general/${file}`);
        }
      }
    }
  } catch (error: any) {
    // Ignore errors
  }

  return missing;
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
