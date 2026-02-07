/**
 * Allocate Command
 * 
 * Allocates a port for a project.
 */

import { PortManager } from '../../port-manager.js';
import { GlobalConfigManager } from '../../../../shared/config/global-config.js';
import chalk from 'chalk';

export async function allocateCommand(options: {
  projectName: string;
  appType: string;
  port?: string;
  path?: string;
  autoConfigure?: boolean;
}) {
  try {
    const projectPath = options.path || process.cwd();
    const globalConfig = new GlobalConfigManager();
    await globalConfig.load();

    const portManager = new PortManager({
      database: (await globalConfig.get()).database || {
        type: 'sqlite',
        sqlite: { path: '~/.port-manager/registry.db' },
      },
    });

    await portManager.connect();

    const preferredPort = options.port ? parseInt(options.port) : undefined;
    const port = await portManager.allocate(
      options.projectName,
      projectPath,
      options.appType as any,
      preferredPort
    );

    // Configure project
    if (options.autoConfigure !== false) {
      const configResult = await portManager.configure(
        options.projectName,
        options.appType as any,
        port,
        true
      );
      if (configResult.filesUpdated.length > 0) {
        console.log(chalk.green(`Updated files: ${configResult.filesUpdated.join(', ')}`));
      }
      if (configResult.errors.length > 0) {
        console.log(chalk.yellow(`Warnings: ${configResult.errors.join(', ')}`));
      }
    }

    console.log(chalk.green(`✓ Allocated port ${port} for ${options.projectName} (${options.appType})`));

    await portManager.disconnect();
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

