/**
 * List Command
 * 
 * Lists all port assignments.
 */

import { PortManager } from '../../port-manager';
import { GlobalConfigManager } from '../../../../shared/config/global-config';
import chalk from 'chalk';

export async function listCommand(options: {
  projectName?: string;
  appType?: string;
  status?: string;
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

    const filters: any = {};
    if (options.projectName) filters.projectName = options.projectName;
    if (options.appType) filters.appType = options.appType;
    if (options.status) filters.status = options.status;

    const assignments = await portManager.listPorts(filters);

    if (assignments.length === 0) {
      console.log(chalk.yellow('No port assignments found'));
      return;
    }

    console.log(chalk.blue('Port Assignments:'));
    console.log('');
    console.log('Project Name          | App Type | Port | Status');
    console.log('----------------------|----------|------|----------');
    for (const assignment of assignments) {
      const statusColor = assignment.status === 'active' ? chalk.green : chalk.yellow;
      console.log(
        `${assignment.projectName.padEnd(22)} | ${assignment.appType.padEnd(8)} | ${assignment.port.toString().padStart(4)} | ${statusColor(assignment.status)}`
      );
    }

    await portManager.disconnect();
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

