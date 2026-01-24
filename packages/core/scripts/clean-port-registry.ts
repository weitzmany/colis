#!/usr/bin/env node
/**
 * Clean Port Manager Registry
 * 
 * ONE-TIME CLEANUP SCRIPT
 * Deletes the Port Manager database so all projects can be rebuilt with new port ranges.
 * 
 * WARNING: This will delete all port assignments!
 * All projects will need to be re-initialized with Port Manager.
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import chalk from 'chalk';

async function cleanRegistry() {
    console.log(chalk.yellow('\n⚠️  Port Manager Registry Cleanup'));
    console.log(chalk.yellow('This will delete ALL port assignments!\n'));

    const dbPath = path.join(os.homedir(), '.port-manager', 'registry.db');
    const dbDir = path.dirname(dbPath);

    try {
        // Check if database exists
        if (await fs.pathExists(dbPath)) {
            console.log(chalk.blue(`Found database: ${dbPath}`));

            // Delete the database file
            await fs.remove(dbPath);
            console.log(chalk.green('✓ Deleted database file'));

            // Check if directory is empty and remove if so
            const files = await fs.readdir(dbDir);
            if (files.length === 0) {
                await fs.remove(dbDir);
                console.log(chalk.green('✓ Deleted empty directory'));
            }

            console.log(chalk.green('\n✅ Port Manager registry cleaned successfully!'));
            console.log(chalk.blue('\nNext steps:'));
            console.log(chalk.blue('1. Rebuild all projects with new port ranges'));
            console.log(chalk.blue('2. Port Manager will create a fresh database with the new ranges\n'));
        } else {
            console.log(chalk.yellow('⚠️  No database found at:'));
            console.log(chalk.yellow(`   ${dbPath}`));
            console.log(chalk.green('\n✓ Nothing to clean!'));
        }
    } catch (error) {
        console.error(chalk.red('\n❌ Error cleaning registry:'));
        console.error(chalk.red((error as Error).message));
        process.exit(1);
    }
}

// Run cleanup
cleanRegistry().catch((error) => {
    console.error(chalk.red('\n❌ Fatal error:'));
    console.error(chalk.red(error.message));
    process.exit(1);
});
