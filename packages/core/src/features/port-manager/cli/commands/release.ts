/**
 * Release Command
 * 
 * Releases a port assignment.
 */

import { PortManager } from '../../port-manager';
import { GlobalConfigManager } from '../../../../shared/config/global-config';
import chalk from 'chalk';

export async function releaseCommand(options: {
  projectName: string;
  appType: string;
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

    const assignment = await portManager.getPort(options.projectName, options.appType as any);
    if (!assignment) {
      console.log(chalk.yellow(`No port assignment found for ${options.projectName} (${options.appType})`));
      await portManager.disconnect();
      return;
    }

    await portManager.release(options.projectName, options.appType as any);
    console.log(chalk.green(`✓ Released port ${assignment.port} from ${options.projectName} (${options.appType})`));

    await portManager.disconnect();
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

