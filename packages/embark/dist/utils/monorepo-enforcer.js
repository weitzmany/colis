/**
 * Monorepo Structure Enforcer
 *
 * Ensures project maintains monorepo structure by removing nested .git directories.
 * This is particularly important after framework CLIs (like Angular CLI) create projects,
 * as they automatically initialize git repositories.
 */
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
/**
 * Find all nested .git directories (not in project root)
 */
async function findNestedGitDirs(projectRoot) {
    const nestedGitDirs = [];
    async function scanDirectory(dir) {
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                // Skip node_modules and other common directories
                if (entry.name === 'node_modules' ||
                    entry.name === '.npm' ||
                    entry.name === '.yarn' ||
                    entry.name === 'dist' ||
                    entry.name === 'build') {
                    continue;
                }
                if (entry.isDirectory()) {
                    if (entry.name === '.git' && fullPath !== path.join(projectRoot, '.git')) {
                        // Found a nested .git directory
                        nestedGitDirs.push(fullPath);
                    }
                    else if (entry.name !== '.git') {
                        // Recursively scan subdirectories (but not inside .git dirs)
                        await scanDirectory(fullPath);
                    }
                }
            }
        }
        catch (error) {
            // Ignore permission errors and continue
        }
    }
    await scanDirectory(projectRoot);
    return nestedGitDirs;
}
/**
 * Remove nested .git directories to enforce monorepo structure
 */
export async function enforceMonorepoStructure(projectRoot) {
    const removed = [];
    const errors = [];
    try {
        const nestedGitDirs = await findNestedGitDirs(projectRoot);
        if (nestedGitDirs.length === 0) {
            return { removed, errors };
        }
        console.log(chalk.blue('\n🔍 Enforcing monorepo structure...'));
        for (const gitDir of nestedGitDirs) {
            try {
                await fs.remove(gitDir);
                const relativePath = path.relative(projectRoot, gitDir);
                removed.push(relativePath);
                console.log(chalk.yellow(`  → Removed nested .git: ${relativePath}`));
            }
            catch (error) {
                const errorMsg = `Failed to remove ${gitDir}: ${error instanceof Error ? error.message : 'Unknown error'}`;
                errors.push(errorMsg);
                console.log(chalk.red(`  ❌ ${errorMsg}`));
            }
        }
        if (removed.length > 0) {
            console.log(chalk.green(`\n✓ Removed ${removed.length} nested .git ${removed.length === 1 ? 'directory' : 'directories'}`));
        }
    }
    catch (error) {
        const errorMsg = `Monorepo enforcement failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.log(chalk.red(`\n❌ ${errorMsg}`));
    }
    return { removed, errors };
}
//# sourceMappingURL=monorepo-enforcer.js.map