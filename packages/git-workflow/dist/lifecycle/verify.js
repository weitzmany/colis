"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify = verify;
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("../utils");
async function verify(options) {
    const { projectRoot } = options;
    const status = {
        status: 'healthy',
        issues: [],
        recommendations: [],
        ghInstalled: false,
        ghAuthenticated: false,
        remoteRepoExists: false,
        expertMapped: false
    };
    try {
        console.log(chalk_1.default.blue('\n🔍 Verifying Git Workflow...\n'));
        if (!(await (0, utils_1.isGitRepo)(projectRoot))) {
            status.issues.push({
                type: 'missing',
                file: '.git',
                message: 'Git repository not initialized',
                severity: 'error'
            });
            console.log(chalk_1.default.red('  ❌ Git repository not initialized'));
        }
        else {
            console.log(chalk_1.default.green('  ✓ Git repository initialized'));
        }
        const expectedHooks = ['pre-commit', 'commit-msg', 'pre-push', 'post-checkout'];
        const hooksDir = path_1.default.join(projectRoot, '.git', 'hooks');
        for (const hook of expectedHooks) {
            const hookPath = path_1.default.join(hooksDir, hook);
            const exists = await (0, utils_1.fileExists)(hookPath);
            if (!exists) {
                status.issues.push({
                    type: 'missing',
                    file: `.git/hooks/${hook}`,
                    message: `Git hook missing: ${hook}`,
                    severity: 'warning'
                });
                console.log(chalk_1.default.yellow(`  ⚠️  Git hook missing: ${hook}`));
            }
            else {
                console.log(chalk_1.default.green(`  ✓ Git hook exists: ${hook}`));
            }
        }
        const commitTemplate = await (0, utils_1.getGitConfig)(projectRoot, 'commit.template');
        if (!commitTemplate) {
            status.issues.push({
                type: 'misconfigured',
                file: 'git config',
                message: 'Commit template not configured',
                severity: 'info'
            });
            console.log(chalk_1.default.yellow('  ⚠️  Commit template not configured'));
        }
        else {
            const templatePath = path_1.default.join(projectRoot, commitTemplate);
            if (await (0, utils_1.fileExists)(templatePath)) {
                console.log(chalk_1.default.green(`  ✓ Commit template configured: ${commitTemplate}`));
            }
            else {
                status.issues.push({
                    type: 'broken',
                    file: commitTemplate,
                    message: 'Commit template file not found',
                    severity: 'warning'
                });
                console.log(chalk_1.default.yellow(`  ⚠️  Commit template file not found: ${commitTemplate}`));
            }
        }
        const gitignorePath = path_1.default.join(projectRoot, '.gitignore');
        if (!(await (0, utils_1.fileExists)(gitignorePath))) {
            status.issues.push({
                type: 'missing',
                file: '.gitignore',
                message: '.gitignore file missing',
                severity: 'warning'
            });
            console.log(chalk_1.default.yellow('  ⚠️  .gitignore file missing'));
        }
        else {
            console.log(chalk_1.default.green('  ✓ .gitignore exists'));
        }
        const gitattributesPath = path_1.default.join(projectRoot, '.gitattributes');
        if (!(await (0, utils_1.fileExists)(gitattributesPath))) {
            status.issues.push({
                type: 'missing',
                file: '.gitattributes',
                message: '.gitattributes file missing',
                severity: 'info'
            });
            console.log(chalk_1.default.yellow('  ⚠️  .gitattributes file missing'));
        }
        else {
            console.log(chalk_1.default.green('  ✓ .gitattributes exists'));
        }
        status.ghInstalled = await (0, utils_1.isGhInstalled)();
        if (!status.ghInstalled) {
            status.issues.push({
                type: 'missing',
                file: 'gh',
                message: 'GitHub CLI (gh) not installed',
                severity: 'warning'
            });
            console.log(chalk_1.default.yellow('  ⚠️  GitHub CLI not installed'));
        }
        else {
            console.log(chalk_1.default.green('  ✓ GitHub CLI installed'));
            const authResult = await (0, utils_1.checkGhAuth)();
            status.ghAuthenticated = authResult.authenticated;
            if (!authResult.authenticated) {
                status.issues.push({
                    type: 'unauthenticated',
                    file: 'gh',
                    message: 'GitHub CLI not authenticated',
                    severity: 'error'
                });
                console.log(chalk_1.default.red('  ❌ GitHub CLI not authenticated'));
                status.recommendations.push('Run: gh auth login');
            }
            else {
                console.log(chalk_1.default.green(`  ✓ Authenticated as ${authResult.username}`));
            }
        }
        status.remoteRepoExists = await (0, utils_1.hasRemote)(projectRoot, 'origin');
        if (!status.remoteRepoExists) {
            status.issues.push({
                type: 'missing',
                file: 'git remote',
                message: 'No remote repository configured',
                severity: 'info'
            });
            console.log(chalk_1.default.yellow('  ⚠️  No remote repository configured'));
            status.recommendations.push('Configure remote: git remote add origin <url>');
        }
        else {
            console.log(chalk_1.default.green('  ✓ Remote repository configured'));
        }
        const expert = await (0, utils_1.detectCurrentExpert)(projectRoot);
        status.expertMapped = expert !== null;
        if (!expert) {
            status.issues.push({
                type: 'misconfigured',
                file: 'expert registry',
                message: 'Current git user not in expert registry',
                severity: 'info'
            });
            console.log(chalk_1.default.yellow('  ⚠️  Current git user not in expert registry'));
            status.recommendations.push('Add expert to registry: assets/config/experts-registry.json');
        }
        else {
            console.log(chalk_1.default.green(`  ✓ Expert mapped: ${expert.name} (${expert.githubUsername})`));
        }
        const errorCount = status.issues.filter(i => i.severity === 'error').length;
        const warningCount = status.issues.filter(i => i.severity === 'warning').length;
        if (errorCount > 0) {
            status.status = 'errors';
            console.log(chalk_1.default.red(`\n❌ Git workflow has ${errorCount} error(s) and ${warningCount} warning(s)\n`));
        }
        else if (warningCount > 0) {
            status.status = 'warnings';
            console.log(chalk_1.default.yellow(`\n⚠️  Git workflow has ${warningCount} warning(s)\n`));
        }
        else {
            console.log(chalk_1.default.green('\n✅ Git workflow is healthy!\n'));
        }
    }
    catch (error) {
        status.issues.push({
            type: 'broken',
            file: 'unknown',
            message: error instanceof Error ? error.message : 'Unknown error',
            severity: 'error'
        });
        status.status = 'errors';
        console.log(chalk_1.default.red(`\n❌ Error during verification: ${error}\n`));
    }
    return status;
}
//# sourceMappingURL=verify.js.map