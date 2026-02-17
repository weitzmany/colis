/**
 * Init Command
 * 
 * Initializes Port Manager in the current project.
 */

import { PortManager } from '../../port-manager.js';
import { GlobalConfigManager } from '../../../../shared/config/global-config.js';
import { ProjectConfigManager, type ProjectConfig } from '../../../../shared/config/project-config.js';
import { ConfigurationManager } from '../../core/configurator.js';
import { FrameworkDetector } from '../../utils/project-detector.js';
import { generateProjectName } from '../../utils/project-name.js';
import chalk from 'chalk';
import * as path from 'path';
import type { AppType } from '../../types.js';
import type { DetectedService } from '../../utils/service-detector.js';

/**
 * Initialize a single service with Port Manager
 */
async function initService(
  portManager: PortManager,
  rootProjectPath: string,
  serviceName: string,
  appType: AppType,
  options: { autoConfigure?: boolean },
  servicePath?: string
): Promise<number> {
  // For multi-service, the service path is the subdirectory
  // For single-service, it's the root
  const serviceFullPath = servicePath ? path.join(rootProjectPath, servicePath) : rootProjectPath;

  // Check if already initialized
  const existing = await portManager.getPort(serviceName, appType);
  if (existing) {
    console.log(chalk.green(`  ✓ ${serviceName} already initialized (port: ${existing.port})`));
    return existing.port;
  }

  // Allocate port with service subdirectory path
  const port = await portManager.allocate(serviceName, serviceFullPath, appType);
  console.log(chalk.green(`  ✓ ${serviceName}: port ${port} (${appType})`));

  // Configure will use the path stored during allocation
  if (options.autoConfigure !== false) {
    await portManager.configure(serviceName, appType, port, true);
  }

  return port;
}

/**
 * Set up domain for multi-service project
 */
async function setupMultiServiceDomain(
  portManager: PortManager,
  projectPath: string,
  projectName: string,
  frontendService: DetectedService,
  backendService: DetectedService
): Promise<void> {
  const { DomainManager } = await import('../../../domain-manager/domain-manager.js');
  const domainManager = new DomainManager();

  // Get port assignments
  const frontendAssignment = await portManager.getPort(projectName, frontendService.appType);
  const backendAssignment = await portManager.getPort(`${projectName}-backend`, backendService.appType);

  if (!frontendAssignment || !backendAssignment) {
    throw new Error('Port assignments not found for services');
  }

  console.log(chalk.blue('\n🌐 Setting up local domain...'));

  const setupOptions = {
    projectName,
    frontendPort: frontendAssignment.port,
    backendPort: backendAssignment.port,
  };

  const domainResult = await domainManager.setup(projectPath, setupOptions);
  console.log(chalk.green(`✓ Domain configured: ${domainResult.domain}`));
  console.log(chalk.gray(`  Frontend: localhost:${frontendAssignment.port}`));
  console.log(chalk.gray(`  Backend:  localhost:${backendAssignment.port} (via /api/*)`));

  // Save domain to frontend .port-manager.json
  const frontendConfigManager = new ProjectConfigManager(path.join(projectPath, frontendService.path || '.'));
  const frontendConfig = await frontendConfigManager.load();
  await frontendConfigManager.save({
    ...(frontendConfig || {}),
    domain: domainResult.domain
  } as ProjectConfig);

  // Reconfigure frontend Angular if needed
  if (frontendService.appType === 'angular') {
    console.log(chalk.dim('  ⏳ Updating Angular configuration with domain...'));
    const configManager = new ConfigurationManager(path.join(projectPath, frontendService.path || '.'));
    const result = await configManager.updateFrameworkConfigOnly(
      frontendService.appType,
      frontendAssignment.port
    );
    if (result.filesUpdated.length > 0) {
      console.log(chalk.green(`  ✓ Updated: ${result.filesUpdated.join(', ')}`));
    }
    if (result.errors.length > 0) {
      console.warn(chalk.yellow(`  ⚠ Warnings: ${result.errors.join(', ')}`));
    }
  }
}

export async function initCommand(options: {
  projectName?: string;
  appType?: string;
  autoConfigure?: boolean;
  skipTechDetect?: boolean;
  setupDomain?: boolean;
}): Promise<{ domainSetup?: { domain: string; caddyfileUpdated: boolean; hostsUpdated: boolean } }> {
  let domainSetup: { domain: string; caddyfileUpdated: boolean; hostsUpdated: boolean } | undefined;
  try {
    const projectPath = process.cwd();
    const globalConfig = new GlobalConfigManager();
    await globalConfig.load();

    // Initialize Port Manager
    const portManager = new PortManager({
      database: (await globalConfig.get()).database || {
        type: 'sqlite',
        sqlite: { path: '~/.port-manager/registry.db' },
      },
    });

    await portManager.connect();

    // Detect project name and app type if not provided
    let projectName = options.projectName;
    if (!projectName) {
      // Generate unambiguous project name from path
      projectName = generateProjectName(projectPath);
      console.log(chalk.blue(`Generated project name: ${projectName}`));
    }

    // Detect if this is a multi-service project
    const { ServiceDetector } = await import('../../utils/service-detector.js');
    const serviceDetector = new ServiceDetector();
    const services = await serviceDetector.detectServices(projectPath);

    // Filter out root service if we have frontend/backend
    const frontendService = services.find((s: any) => s.name === 'frontend');
    const backendService = services.find((s: any) => s.name === 'backend');
    const hasMultiService = frontendService && backendService;

    if (hasMultiService) {
      console.log(chalk.blue('🔍 Detected multi-service project:'));
      console.log(chalk.blue(`  Frontend: ${frontendService!.appType}`));
      console.log(chalk.blue(`  Backend: ${backendService!.appType}`));

      // Initialize both services
      await initService(portManager, projectPath, projectName, frontendService!.appType, options, frontendService!.path);
      await initService(portManager, projectPath, `${projectName}-backend`, backendService!.appType, options, backendService!.path);

      // Set up domain for multi-service if requested
      if (options.setupDomain) {
        try {
          await setupMultiServiceDomain(portManager, projectPath, projectName, frontendService!, backendService!);
          domainSetup = { domain: `${projectName}.local`, caddyfileUpdated: true, hostsUpdated: true };
        } catch (error: any) {
          console.warn(chalk.yellow(`\n⚠ Domain setup failed: ${error.message}`));
        }
      }

      await portManager.disconnect();
      return { domainSetup };
    }

    // Single service project - continue with original logic
    let appType = options.appType;
    if (!appType) {
      const detector = new FrameworkDetector();
      appType = (await detector.detect(projectPath)) || 'node';
      console.log(chalk.blue(`Detected app type: ${appType}`));
    }

    // Port allocation variables
    let port: number | undefined;
    let portAlreadyConfigured = false;

    // Check if already initialized
    const existing = await portManager.getPort(projectName, appType as any);
    if (existing) {
      console.log(chalk.yellow(`⚠ Port Manager already initialized for ${projectName} (${appType})`));
      console.log(chalk.blue(`  Current assignment: Port ${existing.port} → ${existing.projectPath}`));

      // Check if project path matches
      if (existing.projectPath === projectPath) {
        console.log(chalk.green(`  ✓ Using existing port allocation`));
        port = existing.port;

        // Still create .port-manager.json if missing
        if (options.autoConfigure !== false) {
          const configResult = await portManager.configure(projectName, appType as any, existing.port, true);
          if (configResult.errors.length > 0) {
            console.log(chalk.red(`Errors: ${configResult.errors.join(', ')}`));
          }
          portAlreadyConfigured = true;
        }
        // Don't return early - continue to print success message and configure
      } else {
        // Project path changed - release old allocation and create new one
        console.log(chalk.yellow(`  Project path has changed:`));
        console.log(chalk.gray(`    Old: ${existing.projectPath}`));
        console.log(chalk.gray(`    New: ${projectPath}`));
        console.log(chalk.yellow(`  Releasing old allocation and creating new one...`));

        await portManager.release(projectName, appType as any);
        // Continue to allocate new port below
      }
    }

    // Allocate port (if not already assigned above)
    if (!port) {
      try {
        port = await portManager.allocate(projectName, projectPath, appType as any);
      } catch (allocateError: any) {
        const errorMessage = allocateError.message || String(allocateError);

        // Log the error for debugging
        console.log(chalk.gray(`  Debug: ${errorMessage}`));

        // Check if it's any kind of port conflict
        if (errorMessage.includes('UNIQUE constraint') ||
          errorMessage.includes('already exists') ||
          errorMessage.includes('already assigned')) {
          console.log(chalk.yellow(`⚠ Port allocation issue detected`));
          console.log(chalk.yellow(`  Attempting to retrieve or allocate alternative port...`));

          // Try to get the existing port first
          try {
            const existing = await portManager.getPort(projectName, appType as any);
            if (existing) {
              port = existing.port;
              console.log(chalk.green(`  ✓ Using existing port allocation: ${port}`));
            } else {
              // No existing allocation, manually find next available port
              console.log(chalk.yellow(`  No existing allocation found. Manual allocation needed.`));
              console.log(chalk.yellow(`  Run: npx @colis/rig port-manager allocate --project-name="${projectName}" --app-type="${appType}"`));
              return {};
            }
          } catch (getError) {
            console.log(chalk.yellow(`  Could not retrieve port allocation.`));
            console.log(chalk.yellow(`  Run: npx @colis/rig port-manager allocate --project-name="${projectName}" --app-type="${appType}"`));
            return {};
          }
        } else {
          // Re-throw other errors
          throw allocateError;
        }
      }
    }  // End of port allocation if (!port) block

    // Configure project (if not already configured above)
    if (!portAlreadyConfigured && options.autoConfigure !== false && port) {
      const configResult = await portManager.configure(projectName, appType as any, port, true);
      if (configResult.filesUpdated.length > 0) {
        console.log(chalk.green(`Updated files: ${configResult.filesUpdated.join(', ')}`));
      }
      if (configResult.filesCreated.length > 0) {
        console.log(chalk.green(`Created files: ${configResult.filesCreated.join(', ')}`));
      }
      if (configResult.errors.length > 0) {
        console.log(chalk.red(`Errors: ${configResult.errors.join(', ')}`));
      }
    }

    console.log(chalk.green(`✓ Port Manager initialized for ${projectName}`));
    console.log(chalk.green(`✓ Allocated port: ${port}`));

    // Set up domain if requested
    if (options.setupDomain) {
      try {
        const { DomainManager } = await import('../../../domain-manager/domain-manager.js');
        const { ServiceDetector } = await import('../../utils/service-detector.js');
        const domainManager = new DomainManager();
        const serviceDetector = new ServiceDetector();

        // Detect services in project
        const services = await serviceDetector.detectServices(projectPath);
        const frontendService = services.find((s: any) => s.name === 'frontend');
        const backendService = services.find((s: any) => s.name === 'backend');

        // Prepare setup options
        const setupOptions: any = {
          projectName,
          port: port, // The allocated port
        };

        // If multi-service detected, use service ports
        if (frontendService && backendService) {
          // Try to get ports from Port Manager for these services
          const frontendProjectName = `${projectName}-frontend`;
          const backendProjectName = `${projectName}-backend`;

          const frontendAssignment = await portManager.getPort(frontendProjectName, frontendService.appType);
          const backendAssignment = await portManager.getPort(backendProjectName, backendService.appType);

          setupOptions.frontendPort = frontendAssignment?.port || frontendService.detectedPorts[0] || 4200;
          setupOptions.backendPort = backendAssignment?.port || backendService.detectedPorts[0] || 8080;
        } else if (frontendService) {
          const frontendProjectName = `${projectName}-frontend`;
          const frontendAssignment = await portManager.getPort(frontendProjectName, frontendService.appType);
          setupOptions.frontendPort = frontendAssignment?.port || frontendService.detectedPorts[0] || 4200;
        } else if (backendService) {
          const backendProjectName = `${projectName}-backend`;
          const backendAssignment = await portManager.getPort(backendProjectName, backendService.appType);
          setupOptions.backendPort = backendAssignment?.port || backendService.detectedPorts[0] || 8080;
        }

        console.log(chalk.blue('\n🌐 Setting up local domain...'));
        const domainResult = await domainManager.setup(projectPath, setupOptions);
        console.log(chalk.green(`✓ Domain configured: ${domainResult.domain}`));

        // Store domain setup result
        domainSetup = {
          domain: domainResult.domain,
          caddyfileUpdated: domainResult.caddyfileUpdated,
          hostsUpdated: domainResult.hostsUpdated
        };

        // Save domain to .port-manager.json so Angular can configure allowedHosts
        const projectConfigManager = new ProjectConfigManager(projectPath);
        const currentConfig = await projectConfigManager.load();
        await projectConfigManager.save({
          ...(currentConfig || {}),
          domain: domainResult.domain
        } as ProjectConfig);

        // Now reconfigure Angular with the domain
        if (appType === 'angular') {
          const configManager = new ConfigurationManager(projectPath);
          const configResult = await configManager.updateFrameworkConfigOnly(
            appType,
            port
          );
          if (configResult.filesUpdated.length > 0) {
            console.log(chalk.dim(`  ⓘ Updated Angular config with domain: ${configResult.filesUpdated.join(', ')}`));
          }
        }
      } catch (error: any) {
        console.warn(chalk.yellow(`\n⚠ Domain setup failed: ${error.message}`));
        console.warn(chalk.yellow('  Port Manager initialization completed successfully'));
        console.warn(chalk.yellow('  You can set up domain later with: domain-manager setup'));
      }
    }

    // Auto-detect tech stack if not skipped
    if (!options.skipTechDetect) {
      try {
        // Tech detection is optional and not critical for port allocation
        // If it fails, we can still proceed with port allocation
        console.log(chalk.dim('  ⓘ Tech stack detection skipped (optional feature)'));
      } catch (error) {
        console.warn(chalk.yellow(`⚠ Could not detect tech stack: ${error}`));
      }
    }

    await portManager.disconnect();

    process.exit(0);
    return { domainSetup };
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

