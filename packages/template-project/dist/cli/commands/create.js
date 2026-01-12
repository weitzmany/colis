/**
 * Create Command
 *
 * CLI command for creating new projects from templates.
 *
 * This command orchestrates the entire project creation workflow:
 * 1. Collects user configuration (interactive or via options)
 * 2. Selects and loads the appropriate template
 * 3. Allocates a port via Port Manager (if available)
 * 4. Generates project structure from template
 * 5. Links @your-org/core for Project Initialization
 * 6. Runs Project Initialization (rules, commands, Port Manager, colors)
 * 7. Installs dependencies (if not skipped)
 * 8. Initializes Task Manager (if not skipped)
 * 9. Initializes git repository (if not skipped)
 * 10. Opens project in Cursor IDE
 *
 * @module
 */
import * as path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import { execSync } from 'child_process';
import inquirer from 'inquirer';
import { TemplateRegistry } from '../../features/template-engine/template-registry.js';
import { ConfigManager } from '../../features/template-engine/config-manager.js';
import { FileGenerator } from '../../features/template-engine/file-generator.js';
import { initializeProject } from '@your-org/core/features/project-initialization';
/**
 * Create a new project from a template.
 *
 * This is the main entry point for project creation. It handles the complete
 * workflow from configuration collection to project generation and initialization.
 *
 * @param options - Configuration options for project creation
 * @throws {Error} If project creation fails (template not found, file system errors, etc.)
 *
 * @example
 * ```typescript
 * // Basic usage
 * await createCommand({ projectName: 'my-app' });
 *
 * // With options
 * await createCommand({
 *   projectName: 'my-app',
 *   template: 'angular',
 *   packageManager: 'pnpm',
 *   skipDeps: true
 * });
 * ```
 */
export async function createCommand(options = {}) {
    try {
        console.log(chalk.blue('🚀 Creating new project...\n'));
        // Step 1: Collect configuration
        const configManager = new ConfigManager();
        // Ensure projectName is a string if provided
        let projectName = undefined;
        if (options.projectName) {
            if (typeof options.projectName === 'string') {
                projectName = options.projectName.trim();
            }
            else {
                // If it's not a string, try to convert it
                projectName = String(options.projectName).trim();
            }
        }
        const config = await configManager.collectConfig({
            projectName: projectName,
            templateType: options.template,
            packageManager: options.packageManager,
            skipDeps: options.skipDeps,
            skipGit: options.skipGit,
            skipInit: options.skipInit,
            skipTaskManager: options.skipTaskManager,
            overwrite: options.overwrite,
            skipExisting: options.skipExisting ?? false, // Default to false to show prompt
            dryRun: options.dryRun,
            projectDescription: options.description,
            author: options.author,
            license: options.license,
        });
        // Ensure projectName is set and trimmed
        if (config.projectName && typeof config.projectName === 'string') {
            config.projectName = config.projectName.trim();
        }
        // Validate configuration
        const validation = configManager.validateConfig(config);
        if (!validation.valid) {
            console.error(chalk.red('❌ Configuration errors:'));
            validation.errors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
            // Debug: show actual projectName value
            if (config.projectName) {
                console.error(chalk.yellow(`  Debug: projectName="${config.projectName}" (type: ${typeof config.projectName}, length: ${config.projectName.length})`));
            }
            process.exit(1);
        }
        // Step 2: Select template(s) based on stack selection
        const templateRegistry = new TemplateRegistry();
        // Determine template type from stack selection or legacy templateType
        let templateType = config.templateType;
        if (config.stackSelection) {
            const { frontend, backend } = config.stackSelection;
            if (frontend !== 'none' && backend !== 'none') {
                templateType = 'full-stack';
            }
            else if (frontend !== 'none') {
                templateType = frontend;
            }
            else if (backend !== 'none') {
                templateType = backend;
            }
        }
        if (!templateType) {
            console.error(chalk.red('❌ No template type selected'));
            process.exit(1);
        }
        const template = await templateRegistry.getTemplate(templateType);
        if (!template) {
            console.error(chalk.red(`❌ Template "${templateType}" not found`));
            const availableTemplates = await templateRegistry.discoverTemplates();
            if (availableTemplates.length > 0) {
                console.log(chalk.yellow('\nAvailable templates:'));
                availableTemplates.forEach((t) => {
                    console.log(chalk.yellow(`  - ${t.type}: ${t.description}`));
                });
            }
            process.exit(1);
        }
        console.log(chalk.green(`✓ Selected template: ${template.name}`));
        // Show stack selection summary
        if (config.stackSelection) {
            const { frontend, backend, mobile } = config.stackSelection;
            const selected = [];
            if (frontend !== 'none')
                selected.push(`Frontend: ${frontend}`);
            if (backend !== 'none')
                selected.push(`Backend: ${backend}`);
            if (mobile && mobile !== 'none')
                selected.push(`Mobile: ${mobile}`);
            if (selected.length > 0) {
                console.log(chalk.blue(`  Stack: ${selected.join(', ')}`));
            }
        }
        // Step 3: Prepare output path
        let outputPath = path.resolve(process.cwd(), config.projectName);
        // Check if directory already exists
        if (await fs.pathExists(outputPath)) {
            // Only skip if user explicitly passed --skip-existing flag
            // Commander.js sets boolean flags to true when present, undefined when absent
            const userExplicitlySkipped = options.skipExisting === true;
            if (userExplicitlySkipped && !config.overwrite) {
                console.log(chalk.yellow(`⚠ Directory already exists: ${outputPath}`));
                console.log(chalk.yellow('  Skipping project creation'));
                return;
            }
            if (config.overwrite) {
                // User explicitly requested overwrite, proceed
                console.log(chalk.yellow(`⚠ Directory already exists: ${outputPath}`));
                console.log(chalk.yellow('  Overwriting existing directory...'));
            }
            else {
                // Interactive prompt for handling existing directory
                console.log(chalk.yellow(`\n⚠ Directory already exists: ${outputPath}\n`));
                const answer = await inquirer.prompt([
                    {
                        type: 'list',
                        name: 'action',
                        message: 'What would you like to do?',
                        choices: [
                            {
                                name: 'Abort - Cancel project creation',
                                value: 'abort',
                            },
                            {
                                name: 'Use a new name - Enter a different project name',
                                value: 'new-name',
                            },
                            {
                                name: 'Delete existing directory - Remove the existing directory and create new project',
                                value: 'delete',
                            },
                            {
                                name: 'Rename existing directory - Move existing directory to a backup name',
                                value: 'rename',
                            },
                        ],
                    },
                ]);
                switch (answer.action) {
                    case 'abort':
                        console.log(chalk.yellow('\n❌ Project creation cancelled'));
                        process.exit(0);
                        break;
                    case 'new-name':
                        const nameAnswer = await inquirer.prompt([
                            {
                                type: 'input',
                                name: 'newName',
                                message: 'Enter new project name:',
                                validate: (input) => {
                                    if (!input || input.trim().length === 0) {
                                        return 'Project name is required';
                                    }
                                    if (!/^[a-z0-9-]+$/i.test(input)) {
                                        return 'Project name must contain only letters, numbers, and hyphens';
                                    }
                                    const newPath = path.resolve(process.cwd(), input.trim());
                                    // Use synchronous check for validation
                                    try {
                                        if (fs.existsSync(newPath)) {
                                            return 'This directory also exists. Please choose a different name.';
                                        }
                                    }
                                    catch {
                                        // Ignore errors during validation
                                    }
                                    return true;
                                },
                            },
                        ]);
                        config.projectName = nameAnswer.newName.trim();
                        outputPath = path.resolve(process.cwd(), config.projectName);
                        console.log(chalk.green(`✓ Using new project name: ${config.projectName}`));
                        break;
                    case 'delete':
                        const confirmAnswer = await inquirer.prompt([
                            {
                                type: 'confirm',
                                name: 'confirm',
                                message: `⚠️  This will permanently delete: ${outputPath}\n   Are you sure?`,
                                default: false,
                            },
                        ]);
                        if (!confirmAnswer.confirm) {
                            console.log(chalk.yellow('\n❌ Project creation cancelled'));
                            process.exit(0);
                        }
                        try {
                            // Use remove with force option to handle nested directories and permissions
                            await fs.remove(outputPath);
                            console.log(chalk.green(`✓ Deleted existing directory: ${outputPath}`));
                        }
                        catch (error) {
                            // If fs.remove fails, try using execSync with rm -rf as fallback
                            console.log(chalk.yellow(`⚠ Attempting alternative deletion method...`));
                            try {
                                execSync(`rm -rf "${outputPath}"`, { stdio: 'inherit' });
                                console.log(chalk.green(`✓ Deleted existing directory: ${outputPath}`));
                            }
                            catch (rmError) {
                                console.error(chalk.red(`❌ Failed to delete directory: ${error.message || rmError.message}`));
                                console.error(chalk.red(`   Please delete the directory manually and try again.`));
                                process.exit(1);
                            }
                        }
                        break;
                    case 'rename':
                        const renameAnswer = await inquirer.prompt([
                            {
                                type: 'input',
                                name: 'backupName',
                                message: 'Enter backup name for existing directory:',
                                default: `${config.projectName}-backup-${Date.now()}`,
                                validate: (input) => {
                                    if (!input || input.trim().length === 0) {
                                        return 'Backup name is required';
                                    }
                                    const backupPath = path.resolve(process.cwd(), input.trim());
                                    // Note: We can't use await in validate, so we'll check synchronously
                                    try {
                                        if (fs.existsSync(backupPath)) {
                                            return 'This directory already exists. Please choose a different backup name.';
                                        }
                                    }
                                    catch {
                                        // Ignore errors during validation
                                    }
                                    return true;
                                },
                            },
                        ]);
                        const backupPath = path.resolve(process.cwd(), renameAnswer.backupName.trim());
                        await fs.move(outputPath, backupPath);
                        console.log(chalk.green(`✓ Renamed existing directory to: ${backupPath}`));
                        break;
                }
            }
        }
        // Step 4: Allocate port (if Port Manager is available)
        // Port will be allocated during Project Initialization, so we'll use a default
        // The actual port will be set during the init step
        let allocatedPort;
        // Default ports by template type (will be overridden by Port Manager during init)
        const defaultPorts = {
            'angular': 4200,
            'slim': 8000,
            'full-stack': 3000,
            'frontend': 3000,
            'backend': 3001,
            'api': 3001,
        };
        allocatedPort = defaultPorts[templateType] || 4200;
        // Step 5: Generate project structure
        console.log(chalk.blue('\n📁 Generating project structure...'));
        const fileGenerator = new FileGenerator();
        const templateContext = {
            projectName: config.projectName,
            projectDescription: config.projectDescription,
            appType: templateType,
            packageManager: config.packageManager,
            author: config.author,
            license: config.license,
            version: '1.0.0',
            port: allocatedPort,
            // Include stack selection in context for templates
            stackSelection: config.stackSelection,
        };
        // Check if template path contains {{projectName}} directory
        // If so, use the contents of that directory, not the directory itself
        let templatePath = template.path;
        const projectNameDir = path.join(template.path, '{{projectName}}');
        if (await fs.pathExists(projectNameDir)) {
            templatePath = projectNameDir;
        }
        const generationResult = await fileGenerator.generateProject({
            outputPath,
            templatePath,
            context: templateContext,
            overwrite: config.overwrite,
            skipExisting: config.skipExisting,
            dryRun: config.dryRun,
        });
        if (!generationResult.success) {
            console.error(chalk.red('\n❌ Failed to generate project:'));
            generationResult.errors.forEach((error) => console.error(chalk.red(`  - ${error}`)));
            process.exit(1);
        }
        if (config.dryRun) {
            console.log(chalk.blue('\n🔍 Dry run - files that would be created:'));
            generationResult.filesCreated.forEach((file) => {
                console.log(chalk.green(`  ✓ ${file}`));
            });
            return;
        }
        console.log(chalk.green(`✓ Created ${generationResult.filesCreated.length} files`));
        if (generationResult.filesSkipped.length > 0) {
            console.log(chalk.yellow(`⚠ Skipped ${generationResult.filesSkipped.length} existing files`));
        }
        // Step 6: Run Project Initialization (if not skipped)
        if (!config.skipInit) {
            console.log(chalk.blue('\n⚙️  Running Project Initialization...'));
            // Change to project directory
            const originalCwd = process.cwd();
            process.chdir(outputPath);
            try {
                // Ensure @your-org/core is available (link if globally linked, or install)
                const corePackagePath = path.join(outputPath, 'node_modules', '@your-org', 'core');
                if (!await fs.pathExists(corePackagePath)) {
                    console.log(chalk.blue('  Linking @your-org/core...'));
                    try {
                        execSync('npm link @your-org/core', { stdio: 'inherit' });
                        console.log(chalk.green('  ✓ Linked @your-org/core'));
                    }
                    catch (linkError) {
                        console.warn(chalk.yellow('  ⚠ Could not link @your-org/core, trying to continue...'));
                        console.warn(chalk.yellow('  Make sure @your-org/core is linked globally: cd packages/core && npm link'));
                    }
                }
                await initializeProject({
                    projectName: config.projectName,
                    appType: config.templateType,
                    skipRules: false,
                    skipCommands: false,
                    skipPortManager: false,
                    skipColors: false,
                });
                console.log(chalk.green('✓ Project Initialization completed'));
            }
            catch (error) {
                console.warn(chalk.yellow(`⚠ Project Initialization failed: ${error instanceof Error ? error.message : String(error)}`));
                console.warn(chalk.yellow('  You can run "npm link @your-org/core && npx @your-org/core init" manually later'));
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        // Step 7: Install dependencies (if not skipped)
        if (!config.skipDeps) {
            console.log(chalk.blue('\n📦 Installing dependencies...'));
            const originalCwd = process.cwd();
            process.chdir(outputPath);
            try {
                const installCommand = config.packageManager === 'yarn'
                    ? 'yarn install'
                    : config.packageManager === 'pnpm'
                        ? 'pnpm install'
                        : 'npm install';
                execSync(installCommand, { stdio: 'inherit' });
                console.log(chalk.green('✓ Dependencies installed'));
            }
            catch (error) {
                console.warn(chalk.yellow(`⚠ Dependency installation failed: ${error instanceof Error ? error.message : String(error)}`));
                console.warn(chalk.yellow(`  You can run "${config.packageManager} install" manually later`));
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        // Step 8: Initialize Task Manager (if not skipped)
        if (!config.skipTaskManager) {
            console.log(chalk.blue('\n📋 Initializing Task Manager...'));
            const originalCwd = process.cwd();
            process.chdir(outputPath);
            try {
                // Check if taskmaster-ai is available (either via task-manager package or directly)
                const taskmasterDir = path.join(outputPath, '.taskmaster');
                if (!fs.existsSync(taskmasterDir)) {
                    // Try to initialize using taskmaster-ai CLI (suppress npm errors)
                    try {
                        execSync('npx taskmaster-ai init', {
                            stdio: ['ignore', 'inherit', 'pipe'], // Suppress stderr to avoid npm 404 noise
                            cwd: outputPath
                        });
                        console.log(chalk.green('✓ Task Manager initialized'));
                    }
                    catch (taskmasterError) {
                        // Check if error is due to package not found (404)
                        const errorOutput = taskmasterError.stderr?.toString() || taskmasterError.message || '';
                        const isNotFoundError = errorOutput.includes('404') ||
                            errorOutput.includes('Not found') ||
                            errorOutput.includes('is not in this registry');
                        if (isNotFoundError) {
                            // Package doesn't exist in npm registry - skip silently
                            console.log(chalk.gray('  ⊘ Task Manager skipped (package not available in npm registry)'));
                        }
                        else {
                            // Other errors - try installing task-manager package
                            console.log(chalk.yellow('⚠ taskmaster-ai not found, trying @your-org/task-manager...'));
                            try {
                                const installCommand = config.packageManager === 'yarn'
                                    ? 'yarn add @your-org/task-manager'
                                    : config.packageManager === 'pnpm'
                                        ? 'pnpm add @your-org/task-manager'
                                        : 'npm install @your-org/task-manager';
                                execSync(installCommand, {
                                    stdio: ['ignore', 'inherit', 'pipe'], // Suppress stderr
                                    cwd: outputPath
                                });
                                // Postinstall script will initialize taskmaster-ai
                                console.log(chalk.green('✓ Task Manager installed and initialized'));
                            }
                            catch (installError) {
                                const installErrorOutput = installError.stderr?.toString() || installError.message || '';
                                if (installErrorOutput.includes('404') || installErrorOutput.includes('Not found')) {
                                    // Package doesn't exist - skip silently
                                    console.log(chalk.gray('  ⊘ Task Manager skipped (package not available in npm registry)'));
                                }
                                else {
                                    console.warn(chalk.yellow('⚠ Task Manager initialization skipped'));
                                    console.warn(chalk.yellow('  Install manually: npm install @your-org/task-manager'));
                                }
                            }
                        }
                    }
                }
                else {
                    console.log(chalk.green('✓ Task Manager already initialized'));
                }
            }
            catch (error) {
                // Silent skip - Task Manager is optional
                console.log(chalk.gray('  ⊘ Task Manager skipped'));
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        // Step 9: Initialize git (if not skipped)
        if (!config.skipGit) {
            console.log(chalk.blue('\n🔧 Initializing git repository...'));
            const originalCwd = process.cwd();
            process.chdir(outputPath);
            try {
                // Check if git is available
                execSync('git --version', { stdio: 'ignore' });
                // Initialize git repo
                execSync('git init', { stdio: 'inherit' });
                console.log(chalk.green('✓ Git repository initialized'));
            }
            catch (error) {
                console.warn(chalk.yellow('⚠ Git initialization skipped (git not available or already initialized)'));
            }
            finally {
                process.chdir(originalCwd);
            }
        }
        // Success message
        console.log(chalk.green('\n✅ Project created successfully!'));
        console.log(chalk.blue(`\nNext steps:`));
        console.log(chalk.blue(`  cd ${config.projectName}`));
        if (config.skipDeps) {
            console.log(chalk.blue(`  ${config.packageManager} install`));
        }
        console.log(chalk.blue(`  Start developing!`));
        // Open project in Cursor IDE
        try {
            const projectPath = path.resolve(outputPath);
            // Try cursor command first, fallback to code command
            try {
                execSync(`cursor "${projectPath}"`, { stdio: 'ignore' });
                console.log(chalk.green(`\n🚀 Opening project in Cursor IDE...`));
            }
            catch (cursorError) {
                // Fallback to code command (VS Code, which Cursor is based on)
                try {
                    execSync(`code "${projectPath}"`, { stdio: 'ignore' });
                    console.log(chalk.green(`\n🚀 Opening project in IDE...`));
                }
                catch (codeError) {
                    // Silently fail if neither command is available
                    console.log(chalk.yellow(`\n💡 Tip: Open the project manually with: cursor ${config.projectName}`));
                }
            }
        }
        catch (error) {
            // Silently fail - opening IDE is optional
            console.log(chalk.yellow(`\n💡 Tip: Open the project manually with: cursor ${config.projectName}`));
        }
    }
    catch (error) {
        console.error(chalk.red('\n❌ Error creating project:'));
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
    }
}
//# sourceMappingURL=create.js.map