/**
 * Slim Framework Integration
 *
 * Creates Slim Framework projects using composer create-project.
 * This allows future fixes in composer to affect us automatically.
 */
import { execSync } from 'child_process';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { checkPhp, printPhpInstallInstructions, printPathFixInstructions } from './php-checker.js';
/**
 * Slim Framework implementation using composer create-project
 *
 * @example
 * composer create-project slim/slim-skeleton my-app
 */
export class SlimCli {
    name = 'slim';
    displayName = 'Slim Framework';
    /**
     * Check if Slim CLI should be used for this template
     */
    shouldUse(templateType) {
        return templateType.toLowerCase().includes('slim');
    }
    /**
     * Create a Slim Framework project using composer create-project
     */
    async create(options) {
        const { projectName, outputPath, skipDeps = false, dryRun = false, } = options;
        console.log(chalk.blue('🎼 Using Composer to create Slim Framework project...'));
        // Dry run
        if (dryRun) {
            console.log(chalk.blue('\n🔍 Dry run - Would run Composer:'));
            console.log(chalk.green(`  composer create-project slim/slim-skeleton ${projectName}`));
            return {
                success: true,
                outputPath,
                framework: 'slim',
                depsInstalled: false,
            };
        }
        try {
            // Comprehensive PHP check with debugging
            const phpCheck = checkPhp(true);
            if (!phpCheck.isAvailable) {
                // PHP not found anywhere
                printPhpInstallInstructions();
                throw new Error('PHP is not installed. Please install PHP 8.1 or higher.');
            }
            if (!phpCheck.inPath) {
                // PHP found but not in PATH
                if (phpCheck.phpPath) {
                    printPathFixInstructions(phpCheck.phpPath);
                }
                throw new Error('PHP is installed but not in PATH. Composer requires PHP in PATH to work.');
            }
            if (!phpCheck.composerAvailable) {
                console.error(chalk.red('\n❌ Composer is not installed'));
                console.error(chalk.yellow('Please install Composer: https://getcomposer.org/'));
                throw new Error('Composer is not installed. Please install Composer.');
            }
            const parentDir = path.dirname(outputPath);
            // Ensure parent directory exists
            await fs.ensureDir(parentDir);
            // Build composer create-project command
            const skipInstallFlag = skipDeps ? '--no-install' : '';
            const composerCommand = [
                'composer',
                'create-project',
                'slim/slim-skeleton',
                projectName,
                '--no-interaction',
                skipInstallFlag,
            ].filter(Boolean).join(' ');
            console.log(chalk.gray(`  Running: ${composerCommand}`));
            // Run composer create-project
            execSync(composerCommand, {
                cwd: parentDir,
                stdio: 'inherit',
            });
            console.log(chalk.green('✓ Slim Framework project created with Composer'));
            return {
                success: true,
                outputPath,
                framework: 'slim',
                depsInstalled: !skipDeps, // Composer installed deps unless skipped
            };
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(chalk.red('\n❌ Failed to create project with Composer:'));
            console.error(chalk.red(errorMessage));
            return {
                success: false,
                outputPath,
                framework: 'slim',
                depsInstalled: false,
                error: errorMessage,
            };
        }
    }
    /**
     * Update Slim configuration files with custom settings
     */
    async updateConfig(outputPath, config) {
        if (config.port) {
            // Update composer.json scripts with port
            const composerJsonPath = path.join(outputPath, 'composer.json');
            if (await fs.pathExists(composerJsonPath)) {
                const composerJson = await fs.readJson(composerJsonPath);
                // Update start script with port
                if (composerJson.scripts) {
                    composerJson.scripts.start = `/usr/bin/env php -S localhost:${config.port} -t public`;
                }
                await fs.writeJson(composerJsonPath, composerJson, { spaces: 2 });
            }
        }
    }
}
//# sourceMappingURL=slim-cli.js.map