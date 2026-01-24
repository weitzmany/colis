/**
 * Update Command
 *
 * CLI command for updating existing projects with latest rules, commands, and configurations
 * from the core package. Uses hash-based synchronization to intelligently update only
 * what has changed.
 *
 * This command performs the same workflow as if you ran project-init update, but is
 * accessible via the create-project CLI.
 */
import chalk from 'chalk';
import { execSync } from 'child_process';
/**
 * Display a visually appealing header for the update process
 */
function displayHeader() {
    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║') + chalk.bold.white('  🔄 Project Update') + chalk.bold.cyan('                                  ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════╝\n'));
    console.log(chalk.dim('  Synchronizing project with latest core package...\n'));
}
/**
 * Display success message with summary
 */
function displaySuccessMessage(hasChanges) {
    if (hasChanges) {
        console.log(chalk.bold.green('\n╔═══════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.green('║') + chalk.bold.white('  ✅ Project Updated Successfully!') + chalk.bold.green('                    ║'));
        console.log(chalk.bold.green('╚═══════════════════════════════════════════════════════════╝\n'));
    }
    else {
        console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.cyan('║') + chalk.bold.white('  ✓ Project Already Up to Date') + chalk.bold.cyan('                      ║'));
        console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════╝\n'));
    }
}
/**
 * Display errors in a user-friendly format
 */
function displayErrors(errors) {
    console.log(chalk.bold.red('\n╔═══════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.red('║') + chalk.bold.white('  ❌ Update Errors') + chalk.bold.red('                                  ║'));
    console.log(chalk.bold.red('╚═══════════════════════════════════════════════════════════╝\n'));
    errors.forEach((error, index) => {
        console.log(chalk.red(`  ${index + 1}. ${error.split('\n')[0]}`));
        if (error.includes('Solution:')) {
            const solution = error.split('Solution:')[1].trim();
            console.log(chalk.yellow(`     💡 ${solution}`));
        }
    });
    console.log(chalk.dim('\n  Need help? Check the error messages above for solutions.\n'));
}
/**
 * Execute the update command
 *
 * This command synchronizes the current project with the latest core package,
 * using hash-based comparison to intelligently update only what has changed.
 *
 * @param options - Update options
 */
export async function updateCommand(options = {}) {
    try {
        displayHeader();
        // Build the CLI command
        const args = ['update'];
        if (options.overwrite)
            args.push('--overwrite');
        if (options.deleteOrphaned)
            args.push('--delete-orphaned');
        if (options.skipRules)
            args.push('--skip-rules');
        if (options.skipCommands)
            args.push('--skip-commands');
        if (options.checkOnly)
            args.push('--check-only');
        // Execute the core package's update command
        try {
            execSync(`npx @colis/rig ${args.join(' ')}`, {
                cwd: process.cwd(),
                stdio: 'inherit', // Pass through stdout/stderr
            });
            // If we get here, command succeeded
            displaySuccessMessage(true);
            if (options.checkOnly) {
                console.log(chalk.dim('  Run without --check-only to apply these changes.\n'));
            }
        }
        catch (error) {
            // Command failed
            displayErrors(['Update command failed. See error messages above.']);
            process.exit(1);
        }
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.log(chalk.bold.red('\n╔═══════════════════════════════════════════════════════════╗'));
        console.log(chalk.bold.red('║') + chalk.bold.white('  💥 Fatal Error') + chalk.bold.red('                                    ║'));
        console.log(chalk.bold.red('╚═══════════════════════════════════════════════════════════╝\n'));
        console.error(chalk.red(`  ${errorMessage}`));
        console.log(chalk.dim('\n  Please check the error above and try again.\n'));
        process.exit(1);
    }
}
//# sourceMappingURL=update.js.map