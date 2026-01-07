/**
 * List Command
 * 
 * List all configured domains.
 */

import { DomainManager } from '../../domain-manager';
import chalk from 'chalk';

export async function listCommand() {
  try {
    const domainManager = new DomainManager();
    const domains = await domainManager.list();

    if (domains.length === 0) {
      console.log(chalk.yellow('No domains configured.'));
      return;
    }

    console.log(chalk.blue('Configured Domains:'));
    console.log('');

    for (const domainInfo of domains) {
      const config = domainInfo.config;
      console.log(chalk.cyan(`  ${domainInfo.domain}`));

      if (config.isMultiService) {
        console.log(chalk.gray(`    Frontend: localhost:${config.frontendPort}`));
        console.log(chalk.gray(`    Backend:  localhost:${config.backendPort} (via /api/*)`));
      } else {
        console.log(chalk.gray(`    Port: localhost:${config.port}`));
      }

      const status = [];
      if (domainInfo.caddyfileLine) {
        status.push(chalk.green('Caddyfile'));
      }
      if (domainInfo.hostsEntry) {
        status.push(chalk.green('hosts'));
      } else {
        status.push(chalk.yellow('hosts (missing)'));
      }

      console.log(chalk.gray(`    Status: ${status.join(', ')}`));
      console.log('');
    }
  } catch (error: any) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}




