/**
 * Remove Command
 * 
 * Remove domain configuration.
 */

import { DomainManager } from '../../domain-manager';
import {
  DomainValidationError,
  DomainConfigurationError,
  HostsFileError,
} from '../../errors';
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
  } catch (error) {
    if (error instanceof DomainValidationError) {
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
      console.log(chalk.yellow('  Domain removed from Caddyfile but hosts file update failed.'));
      console.log(chalk.yellow('  You may need to remove the domain manually from your hosts file.'));
    } else {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(chalk.red(`Error: ${errorMessage}`));
    }
    process.exit(1);
  }
}




