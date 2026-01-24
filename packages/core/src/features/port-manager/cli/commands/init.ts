/**
 * Init Command
 * 
 * Initializes Port Manager in the current project.
 */

import { PortManager } from '../../port-manager.js';
import { GlobalConfigManager } from '../../../../shared/config/global-config.js';
import { FrameworkDetector } from '../../utils/project-detector.js';
import { generateProjectName } from '../../utils/project-name.js';
import chalk from 'chalk';

export async function initCommand(options: {
  projectName?: string;
  appType?: string;
  autoConfigure?: boolean;
  skipTechDetect?: boolean;
  setupDomain?: boolean;
}) {
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
          console.log(chalk.yellow(`  Run: npx @your-org/core port-manager allocate --project-name="${projectName}" --app-type="${appType}"`));
          return;
        }
      } catch (getError) {
        console.log(chalk.yellow(`  Could not retrieve port allocation.`));
        console.log(chalk.yellow(`  Run: npx @your-org/core port-manager allocate --project-name="${projectName}" --app-type="${appType}"`));
        return;
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
        const { DomainManager } = require('../../../domain-manager/domain-manager');
        const { ServiceDetector } = require('../../utils/service-detector');
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

          setupOptions.frontendPort = frontendAssignment?.port || frontendService.detectedPort || 4200;
          setupOptions.backendPort = backendAssignment?.port || backendService.detectedPort || 8080;
        } else if (frontendService) {
          const frontendProjectName = `${projectName}-frontend`;
          const frontendAssignment = await portManager.getPort(frontendProjectName, frontendService.appType);
          setupOptions.frontendPort = frontendAssignment?.port || frontendService.detectedPort || 4200;
        } else if (backendService) {
          const backendProjectName = `${projectName}-backend`;
          const backendAssignment = await portManager.getPort(backendProjectName, backendService.appType);
          setupOptions.backendPort = backendAssignment?.port || backendService.detectedPort || 8080;
        }

        console.log(chalk.blue('\n🌐 Setting up local domain...'));
        const domainResult = await domainManager.setup(projectPath, setupOptions);
        console.log(chalk.green(`✓ Domain configured: ${domainResult.domain}`));
        
        // Domain info is stored in Caddyfile and hosts file
        // Port Manager metadata can optionally store domain reference for future use
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
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

