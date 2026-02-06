/**
 * Refit Command
 * 
 * CLI command for refitting existing projects with latest rules, commands, and configurations
 * from the rig package. Uses hash-based synchronization to intelligently refit only
 * what has changed.
 * 
 * This command performs the same workflow as if you ran rig refit, but is
 * accessible via the embark CLI.
 * (Formerly: update command)
 */

import chalk from 'chalk';
import { execSync } from 'child_process';

/**
 * Display a visually appealing header for the update process
 */
function displayHeader(): void {
  console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.cyan('║') + chalk.bold.white('  🔄 Project Refit') + chalk.bold.cyan('                                   ║'));
  console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════╝\n'));
  console.log(chalk.dim('  Synchronizing project with latest rig package...\n'));
}

/**
 * Display success message with summary
 */
function displaySuccessMessage(hasChanges: boolean): void {
  
  if (hasChanges) {
    console.log(chalk.bold.green('\n╔═══════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.green('║') + chalk.bold.white('  ✅ Project Refitted Successfully!') + chalk.bold.green('                  ║'));
    console.log(chalk.bold.green('╚═══════════════════════════════════════════════════════════╝\n'));
  } else {
    console.log(chalk.bold.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.cyan('║') + chalk.bold.white('  ✓ Project Already Up to Date') + chalk.bold.cyan('                      ║'));
    console.log(chalk.bold.cyan('╚═══════════════════════════════════════════════════════════╝\n'));
  }
}

/**
 * Display errors in a user-friendly format
 */
function displayErrors(errors: string[]): void {
  console.log(chalk.bold.red('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.bold.red('║') + chalk.bold.white('  ❌ Refit Errors') + chalk.bold.red('                                    ║'));
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
 * Update Command Interface
 */
export interface UpdateCommandOptions {
  overwrite?: boolean;
  deleteOrphaned?: boolean;
  skipRules?: boolean;
  skipCommands?: boolean;
  checkOnly?: boolean;
}

/**
 * Execute the update command
 * 
 * This command synchronizes the current project with the latest core package,
 * using hash-based comparison to intelligently update only what has changed.
 * 
 * @param options - Update options
 */
export async function refitCommand(options: UpdateCommandOptions = {}) {
  try {
    displayHeader();
    
    // Build the CLI command
    const args = ['refit'];
    
    if (options.overwrite) args.push('--overwrite');
    if (options.deleteOrphaned) args.push('--delete-orphaned');
    if (options.skipRules) args.push('--skip-rules');
    if (options.skipCommands) args.push('--skip-commands');
    if (options.checkOnly) args.push('--check-only');
    
    // Execute the rig package's refit command
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
    } catch (error: unknown) {
      // Command failed
      displayErrors(['Update command failed. See error messages above.']);
      process.exit(1);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.log(chalk.bold.red('\n╔═══════════════════════════════════════════════════════════╗'));
    console.log(chalk.bold.red('║') + chalk.bold.white('  💥 Fatal Error') + chalk.bold.red('                                    ║'));
    console.log(chalk.bold.red('╚═══════════════════════════════════════════════════════════╝\n'));
    console.error(chalk.red(`  ${errorMessage}`));
    console.log(chalk.dim('\n  Please check the error above and try again.\n'));
    process.exit(1);
  }
}
