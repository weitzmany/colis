/**
 * Migrate Command
 * 
 * Runs database migrations.
 */

import { PortManager } from '../../port-manager';
import { GlobalConfigManager } from '../../../../shared/config/global-config';
import chalk from 'chalk';

export async function migrateCommand() {
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
    await portManager.migrate();
    console.log(chalk.green('✓ Database migrations completed'));

    await portManager.disconnect();
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

