/**
 * Install Command
 * 
 * Check Caddy installation and provide installation instructions.
 */

import { DomainManager } from '../../domain-manager.js';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function installCommand() {
  try {
    const domainManager = new DomainManager();
    const installed = await domainManager.checkCaddyInstalled();

    if (installed) {
      console.log(chalk.green('✓ Caddy is installed'));
      
      // Check version
      try {
        const { stdout } = await execAsync('caddy version');
        console.log(chalk.cyan(`  Version: ${stdout.trim()}`));
      } catch (error) {
        // Ignore
      }

      // Check if running
      const running = await domainManager.checkCaddyRunning();
      if (running) {
        console.log(chalk.green('✓ Caddy is running'));
      } else {
        console.log(chalk.yellow('⚠ Caddy is not running'));
        console.log(chalk.cyan('\n  To start Caddy:'));
        console.log(chalk.cyan('    caddy run --config ~/.caddy/Caddyfile'));
        console.log(chalk.cyan('    # Or in background:'));
        console.log(chalk.cyan('    caddy start --config ~/.caddy/Caddyfile'));
      }
    } else {
      console.log(chalk.red('✗ Caddy is not installed'));
      console.log(chalk.yellow('\nInstallation instructions:'));
      console.log('');
      console.log(chalk.cyan('  macOS (Homebrew):'));
      console.log(chalk.white('    brew install caddy'));
      console.log('');
      console.log(chalk.cyan('  Linux:'));
      console.log(chalk.white('    See: https://caddyserver.com/docs/install'));
      console.log('');
      console.log(chalk.cyan('  After installation, start Caddy:'));
      console.log(chalk.white('    caddy run --config ~/.caddy/Caddyfile'));
    }
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}




