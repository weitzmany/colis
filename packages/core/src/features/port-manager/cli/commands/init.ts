/**
 * Init Command
 * 
 * Initializes Port Manager in the current project.
 */

import { PortManager } from '../../port-manager.js';
import { GlobalConfigManager } from '../../../../shared/config/global-config.js';
import { FrameworkDetector } from '../../utils/project-detector.js';
import { generateProjectName } from '../../utils/project-name.js';
import * as path from 'path';
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

    // Check if already initialized
    const existing = await portManager.getPort(projectName, appType as any);
    if (existing) {
      console.log(chalk.yellow(`Port Manager already initialized for ${projectName} (${appType})`));
      console.log(chalk.green(`Current port: ${existing.port}`));
      return;
    }

    // Allocate port (handle conflicts gracefully)
    let port: number;
    try {
      port = await portManager.allocate(projectName, projectPath, appType as any);
    } catch (allocateError: any) {
      const errorMessage = allocateError.message || String(allocateError);
      if (errorMessage.includes('UNIQUE constraint') || errorMessage.includes('already assigned')) {
        // Port conflict - try to find next available port or skip
        console.log(chalk.yellow(`⚠ Port allocation conflict: ${errorMessage}`));
        console.log(chalk.yellow('  Port Manager will continue without port allocation'));
        console.log(chalk.yellow('  You can allocate a port manually later with: port-manager allocate'));
        // Return early without failing
        return;
      }
      // Re-throw other errors
      throw allocateError;
    }

    // Configure project
    if (options.autoConfigure !== false) {
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
        const { TechDetector } = require('../../../tech-detector/tech-detector');
        const techDetector = new TechDetector();
        console.log(chalk.blue('\n🔍 Detecting technology stack...'));
        const techStack = await techDetector.detect(projectPath);
        await techDetector.save(projectPath, techStack);
        console.log(chalk.green('✓ Technology stack detected and saved to .core-tech.json'));
        
        // Update package.json
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (await require('fs-extra').pathExists(packageJsonPath)) {
          const { PackageJsonMapper } = require('../../../tech-detector/mappers/package-json-mapper');
          const fs = require('fs-extra');
          const mapper = new PackageJsonMapper();
          const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
          const updated = mapper.mergeIntoPackageJson(packageJson, techStack);
          await fs.writeFile(packageJsonPath, JSON.stringify(updated, null, 2), 'utf-8');
          console.log(chalk.green('✓ Updated package.json with tech stack info'));
        }
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

