/**
 * Remove Command
 * 
 * Remove domain configuration.
 */

import { DomainManager } from '../../domain-manager';
import chalk from 'chalk';

export async function removeCommand(domain: string) {
  try {
    if (!domain) {
      console.error(chalk.red('Error: Domain name is required'));
      console.log(chalk.yellow('Usage: domain-manager remove <domain>'));
      process.exit(1);
    }

    const domainManager = new DomainManager();

    console.log(chalk.blue(`\n🗑️  Removing domain: ${domain}`));

    await domainManager.remove(domain);

    console.log(chalk.green(`✓ Domain removed from Caddyfile`));
    console.log(chalk.green(`✓ Domain removed from hosts file`));
    console.log(chalk.yellow(`\n⚠ You may need to restart Caddy for changes to take effect`));
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

