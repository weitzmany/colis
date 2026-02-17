/**
 * Project Updater
 * 
 * Updates project initialization by checking for gaps and making changes as needed.
 * Similar to init but smarter - only updates what's missing or outdated.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import { readdir, readFile } from 'fs/promises';
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
import { ensureGitHubRepo, EnsureGitHubRepoResult } from './github-repo-manager.js';
import { runShipyardInit } from './shipyard-manager.js';

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
  skipShipyard?: boolean; // Skip Shipyard CI/CD update
  skipGitHub?: boolean; // Skip GitHub repository setup
  githubVisibility?: 'public' | 'private'; // GitHub repository visibility
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
  shipyardUpdated: boolean;
  githubResult?: EnsureGitHubRepoResult;
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
    shipyardUpdated: false,
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
        'Core package not found. Make sure @colis/rig is installed in node_modules.'
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
      let portManager: PortManager | null = null;
      try {
        const globalConfig = new GlobalConfigManager();
        await globalConfig.load();

        portManager = new PortManager({
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
          // Check if this should be a multi-service project
          const { ServiceDetector } = await import('../port-manager/utils/service-detector.js');
          const serviceDetector = new ServiceDetector();
          const services = await serviceDetector.detectServices(projectPath);

          const frontendService = services.find((s: any) => s.name === 'frontend');
          const backendService = services.find((s: any) => s.name === 'backend');
          const isMultiService = frontendService && backendService;

          // Check if currently registered as single service but should be multi-service
          const backendExists = await portManager.getPort(`${projectName}-backend`, backendService?.appType || 'php');
          const isSingleServiceRegistration = !backendExists;

          if (isMultiService && isSingleServiceRegistration) {
            console.log(chalk.yellow('  ⚠ Detected multi-service project (frontend + backend)'));
            console.log(chalk.yellow('  ⚠ Currently registered as single service, upgrading...'));

            // Release old single-service registration
            console.log(chalk.blue(`  ↻ Releasing single-service registration...`));
            await portManager.release(projectName, appType as any);

            // Register frontend
            console.log(chalk.blue(`  ↻ Registering frontend (${frontendService!.appType})...`));
            const frontendPath = path.join(projectPath, frontendService!.path);
            const frontendPort = await portManager.allocate(projectName, frontendPath, frontendService!.appType as any);
            await portManager.configure(projectName, frontendService!.appType as any, frontendPort, true);
            console.log(chalk.green(`  ✓ Frontend registered: port ${frontendPort}`));

            // Register backend
            console.log(chalk.blue(`  ↻ Registering backend (${backendService!.appType})...`));
            const backendPath = path.join(projectPath, backendService!.path);
            const backendPort = await portManager.allocate(`${projectName}-backend`, backendPath, backendService!.appType as any);
            await portManager.configure(`${projectName}-backend`, backendService!.appType as any, backendPort, true);
            console.log(chalk.green(`  ✓ Backend registered: port ${backendPort}`));

            result.portManagerUpdated = true;
            result.updated.push('Port Manager (upgraded to multi-service)');

            // Update domain configuration
            if (!options.skipDomain) {
              console.log(chalk.blue('  🌐 Updating domain for multi-service...'));
              try {
                const { DomainManager } = await import('../domain-manager/domain-manager.js');
                const domainManager = new DomainManager();

                // Remove old single-service domain if exists
                const domains = await domainManager.list();
                const oldDomain = domains.find(d => d.domain === `${projectName}.local`);
                if (oldDomain && oldDomain.config.port) {
                  console.log(chalk.blue('  ↻ Removing old single-service domain...'));
                  await domainManager.remove(`${projectName}.local`);
                }

                // Set up new multi-service domain
                const setupOptions = {
                  projectName,
                  frontendPort,
                  backendPort,
                };

                const domainResult = await domainManager.setup(projectPath, setupOptions);
                result.updated.push('Domain configuration (multi-service)');
                console.log(chalk.green(`  ✓ Domain updated: ${domainResult.domain}`));
                console.log(chalk.gray(`    Frontend: localhost:${frontendPort}`));
                console.log(chalk.gray(`    Backend:  localhost:${backendPort} (via /api/*)`));
              } catch (domainError: any) {
                result.warnings.push(`Domain update failed: ${domainError.message}`);
                console.log(chalk.yellow(`  ⚠ Domain update failed: ${domainError.message}`));
              }
            }
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
          }

          console.log(chalk.green(`  ✓ Port Manager already initialized (port: ${existing.port})`));

          // Check and set up domain even when Port Manager is already initialized
          if (!options.skipDomain) {
            console.log(chalk.blue('  🌐 Checking domain setup...'));
            try {
              const { DomainManager } = await import('../domain-manager/domain-manager.js');
              const domainManager = new DomainManager();

              // Check if domain exists for this project
              const domains = await domainManager.list();
              const expectedDomain = `${projectName}.local`;
              const hasDomain = domains.some(d =>
                d.domain === expectedDomain &&
                (d.config.port === existing.port ||
                  d.config.frontendPort === existing.port ||
                  d.config.backendPort === existing.port)
              );

              if (!hasDomain) {
                console.log(chalk.yellow('  ⚠ Domain not found, setting up...'));
                await domainManager.setup(projectPath, {
                  projectName: projectName,
                  port: existing.port,
                  domain: expectedDomain,
                });
                result.added.push('Domain configuration');
                console.log(chalk.green(`  ✓ Domain setup complete (${expectedDomain})`));
              } else {
                console.log(chalk.green('  ✓ Domain already configured'));
              }
            } catch (domainError: any) {
              result.warnings.push(`Domain setup failed: ${domainError.message}`);
              console.log(chalk.yellow(`  ⚠ Domain setup failed: ${domainError.message}`));
            }
          }
        }
      } catch (error: any) {
        result.warnings.push(`Port Manager check failed: ${error.message}`);
        console.log(chalk.yellow(`  ⚠ Port Manager check failed: ${error.message}`));
      } finally {
        // Always disconnect portManager if it was connected
        if (portManager) {
          try {
            await portManager.disconnect();
          } catch (disconnectError: any) {
            console.log(chalk.dim(`  ⓘ Port Manager disconnect: ${disconnectError.message}`));
          }
        }
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
          const hookContent = await readFile(hookPath, 'utf-8');
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
      console.log(chalk.blue('🔍 Checking defaults...'));
      try {
        const defaultsInstaller = new DefaultsInstaller();
        // Check but don't prompt
        const installResult = await defaultsInstaller.checkAndPromptForDefaults(projectPath, false);

        if (installResult.errors.length > 0) {
          result.warnings.push(...installResult.errors);
        }
        console.log(chalk.green('  ✓ Defaults check complete'));
      } catch (error: any) {
        result.warnings.push(`Defaults check failed: ${error.message}`);
        console.log(chalk.yellow(`  ⚠ Defaults check failed: ${error.message}`));
      }
    }

    // Update Shipyard CI/CD configuration
    if (!options.skipShipyard) {
      console.log(chalk.blue('⚓ Checking Shipyard CI/CD...'));
      const shipyardResult = runShipyardInit({
        projectPath,
        force: Boolean(options.overwrite),
        dryRun: options.dryRun
      });

      if (shipyardResult.success) {
        result.shipyardUpdated = true;
        result.updated.push('Shipyard CI/CD configuration');
        console.log(chalk.green('  ✓ Shipyard CI/CD checked/updated'));
      } else {
        result.warnings.push(...shipyardResult.warnings);
        console.log(chalk.yellow('  ⚠ Shipyard CI/CD check skipped (non-blocking)'));
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

    // GitHub repository setup
    if (!options.skipGitHub && !options.dryRun) {
      console.log(chalk.bold.blue('🐙 Setting up GitHub repository...'));
      
      result.githubResult = await ensureGitHubRepo(projectPath, projectName, {
        visibility: options.githubVisibility || 'private',
        skipIfNoGh: true, // Non-blocking
        pushInitial: true,
        interactive: process.stdout.isTTY && !process.env.CI,
        dryRun: false,
      });

      // Accumulate warnings from GitHub setup
      if (result.githubResult.warnings.length > 0) {
        result.warnings.push(...result.githubResult.warnings);
      }

      // Display GitHub result summary
      if (result.githubResult.repoUrl) {
        console.log(chalk.green(`  ✓ GitHub repository: ${result.githubResult.repoUrl}`));
        if (result.githubResult.pushed) {
          console.log(chalk.green('  ✓ Initial commit pushed to origin'));
        }
      } else if (result.githubResult.skippedReason) {
        console.log(chalk.dim(`  ⊘ ${result.githubResult.skippedReason}`));
      }
    }

    // Final completion message
    console.log(chalk.blue('\n⏳ Finalizing update...'))

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
    const expertFiles = (await readdir(expertsPath)).filter((f) => f.endsWith('.mdc'));
    state.rulesCount += expertFiles.length;
  }

  if (await fs.pathExists(userPath)) {
    const userFiles = (await readdir(userPath)).filter((f) => f.endsWith('.mdc'));
    state.rulesCount += userFiles.length;
  }

  // Check commands
  const commandsPath = path.join(projectPath, '.cursor', 'commands');
  const generalPath = path.join(commandsPath, 'general');

  if (await fs.pathExists(generalPath)) {
    const commandFiles = (await readdir(generalPath)).filter((f) => f.endsWith('.md'));
    state.commandsCount = commandFiles.length;
  }

  // Check Port Manager
  const portManagerConfigPath = path.join(projectPath, '.port-manager.json');
  state.portManagerInitialized = await fs.pathExists(portManagerConfigPath);

  // Check colors
  const hookPath = path.join(projectPath, '.githooks', 'post-checkout');
  if (await fs.pathExists(hookPath)) {
    try {
      const hookContent = await readFile(hookPath, 'utf-8');
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

    // Check complement
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
      const commandFiles = (await readdir(generalSource)).filter((f) => f.endsWith('.md'));
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
