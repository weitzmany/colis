/**
 * Setup Command
 * 
 * Set up domain for current project.
 */

import { DomainManager } from '../../domain-manager';
import { generateProjectName } from '../../../port-manager/utils/project-name';
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
    const domainManager = new DomainManager();

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
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}




