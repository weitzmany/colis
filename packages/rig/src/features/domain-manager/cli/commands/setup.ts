/**
 * Setup Command
 * 
 * Set up domain for current project.
 */

import { DomainManager } from '../../domain-manager.js';
import { CaddyManager } from '../../caddy-manager.js';
import { HostsManager } from '../../hosts-manager.js';
import { ServiceDetector } from '../../service-detector.js';
import { generateProjectName } from '../../../port-manager/utils/project-name.js';
import {
  CaddyNotInstalledError,
  DomainValidationError,
  DomainConfigurationError,
  HostsFileError,
} from '../../errors.js';
import chalk from 'chalk';
import * as path from 'path';

export async function setupCommand(options: {
  projectName?: string;
  port?: string;
  frontendPort?: string;
  backendPort?: string;
  domain?: string;
  skipHosts?: boolean;
  path?: string;
}) {
  try {
    const projectPath = options.path ? path.resolve(options.path) : process.cwd();
    const domainManager = new DomainManager({
      caddyManager: new CaddyManager(),
      hostsManager: new HostsManager(),
      serviceDetector: new ServiceDetector(),
    });

    // Check if Caddy is installed
    const caddyInstalled = await domainManager.checkCaddyInstalled();
    if (!caddyInstalled) {
      console.error(chalk.red('✗ Caddy is not installed.'));
      console.log(chalk.yellow('\nTo install Caddy:'));
      console.log(chalk.cyan('  macOS: brew install caddy'));
      console.log(chalk.cyan('  Linux: See https://caddyserver.com/docs/install'));
      console.log(chalk.cyan('  Or run: domain-manager install'));
      process.exit(1);
    }

    // Check if Caddy is running
    const caddyRunning = await domainManager.checkCaddyRunning();
    if (!caddyRunning) {
      console.warn(chalk.yellow('⚠ Caddy is not running.'));
      console.log(chalk.yellow('  Start Caddy with: caddy run --config ~/.caddy/Caddyfile'));
      console.log(chalk.yellow('  Or run in background: caddy start --config ~/.caddy/Caddyfile'));
    }

    // Generate project name if not provided
    let projectName = options.projectName;
    if (!projectName) {
      projectName = generateProjectName(projectPath);
      console.log(chalk.blue(`Generated project name: ${projectName}`));
    }

    // Parse ports
    const setupOptions = {
      projectName,
      port: options.port ? parseInt(options.port) : undefined,
      frontendPort: options.frontendPort ? parseInt(options.frontendPort) : undefined,
      backendPort: options.backendPort ? parseInt(options.backendPort) : undefined,
      domain: options.domain,
      skipHosts: options.skipHosts || false,
    };

    console.log(chalk.blue(`\n🔧 Setting up domain for: ${projectName}`));

    const result = await domainManager.setup(projectPath, setupOptions);

    console.log(chalk.green(`\n✓ Domain configured: ${result.domain}`));
    console.log(chalk.green(`✓ Caddyfile updated`));
    if (result.hostsUpdated) {
      console.log(chalk.green(`✓ Hosts file updated`));
    } else {
      console.log(chalk.yellow(`⚠ Hosts file not updated (run with sudo or add manually)`));
    }

    if (result.config.isMultiService) {
      console.log(chalk.cyan(`\n  Frontend: http://${result.domain} → localhost:${result.config.frontendPort}`));
      console.log(chalk.cyan(`  Backend API: http://${result.domain}/api/* → localhost:${result.config.backendPort}`));
    } else {
      console.log(chalk.cyan(`\n  Service: http://${result.domain} → localhost:${result.config.port}`));
    }

    if (!caddyRunning) {
      console.log(chalk.yellow(`\n⚠ Remember to start Caddy for the domain to work!`));
    }
  } catch (error) {
    if (error instanceof CaddyNotInstalledError) {
      console.error(chalk.red('✗ Caddy is not installed.'));
      console.log(chalk.yellow('\nTo install Caddy:'));
      console.log(chalk.cyan('  macOS: brew install caddy'));
      console.log(chalk.cyan('  Linux: See https://caddyserver.com/docs/install'));
      console.log(chalk.cyan('  Or run: domain-manager install'));
    } else if (error instanceof DomainValidationError) {
      console.error(chalk.red(`✗ Invalid domain: ${error.message}`));
      if (error.validationRule) {
        console.log(chalk.yellow(`  Validation rule: ${error.validationRule}`));
      }
    } else if (error instanceof DomainConfigurationError) {
      console.error(chalk.red(`✗ Configuration error: ${error.message}`));
      if (error.reason) {
        console.log(chalk.yellow(`  Reason: ${error.reason}`));
      }
    } else if (error instanceof HostsFileError) {
      console.warn(chalk.yellow(`⚠ ${error.message}`));
      console.log(chalk.yellow('  Domain is configured in Caddyfile but hosts file update failed.'));
      console.log(chalk.yellow('  You may need to add the domain manually to your hosts file.'));
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`Error: ${errorMessage}`));
    }
    process.exit(1);
  }
}




