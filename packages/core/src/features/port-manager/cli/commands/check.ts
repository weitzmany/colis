/**
 * Check Command
 * 
 * Checks port availability and conflicts.
 */

import { PortManager } from '../../port-manager';
import { GlobalConfigManager } from '../../../../shared/config/global-config';
import chalk from 'chalk';

export async function checkCommand(options: {
  projectName?: string;
  port?: string;
}) {
  try {
    const globalConfig = new GlobalConfigManager();
    await globalConfig.load();

    const portManager = new PortManager({
      database: (await globalConfig.get()).database || {
        type: 'sqlite',
        sqlite: { path: '~/.port-manager/registry.db' },
      },
    });

    await portManager.connect();

    if (options.port) {
      const port = parseInt(options.port);
      const available = await portManager.checkAvailability(port);
      if (available) {
        console.log(chalk.green(`✓ Port ${port} is available`));
      } else {
        const assignment = await portManager.getByPort(port);
        if (assignment) {
          console.log(chalk.red(`✗ Port ${port} is assigned to ${assignment.projectName} (${assignment.appType})`));
        } else {
          console.log(chalk.red(`✗ Port ${port} is not available`));
        }
      }
    } else if (options.projectName) {
      const assignments = await portManager.listPorts({ projectName: options.projectName });
      if (assignments.length === 0) {
        console.log(chalk.yellow(`No port assignments found for ${options.projectName}`));
      } else {
        console.log(chalk.blue(`Port assignments for ${options.projectName}:`));
        for (const assignment of assignments) {
          console.log(`  ${assignment.appType}: ${assignment.port} (${assignment.status})`);
        }
      }
    } else {
      console.log(chalk.yellow('Please specify either --project-name or --port'));
    }

    await portManager.disconnect();
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

