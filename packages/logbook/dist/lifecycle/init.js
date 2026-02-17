"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("../utils");
async function init(options) {
    const { projectRoot, projectType, options: opts = {} } = options;
    const result = {
        success: false,
        installed: [],
        skipped: [],
        errors: [],
        ghInstalled: false,
        ghAuthenticated: false,
        remoteRepoCreated: false,
        expertRegistered: false
    };
    try {
        console.log(chalk_1.default.blue('\n🔧 Initializing Git Workflow...\n'));
        if (!(await (0, utils_1.isGitInstalled)())) {
            result.errors.push('Git is not installed');
            console.log(chalk_1.default.red('❌ Git is not installed. Please install git first.'));
            return result;
        }
        console.log(chalk_1.default.blue('\n🔍 Enforcing monorepo structure...\n'));
        const monorepoResult = await (0, utils_1.enforceMonorepoStructure)(projectRoot);
        if (monorepoResult.removed.length > 0) {
            console.log(chalk_1.default.yellow('  → Removed nested .git directories:'));
            for (const dir of monorepoResult.removed) {
                const relativePath = path_1.default.relative(projectRoot, dir);
                console.log(chalk_1.default.yellow(`    - ${relativePath}`));
                result.installed.push(`removed nested git: ${relativePath}`);
            }
        }
        else {
            console.log(chalk_1.default.gray('  ✓ No nested .git directories found'));
        }
        if (monorepoResult.errors.length > 0) {
            for (const error of monorepoResult.errors) {
                result.errors.push(error);
                console.log(chalk_1.default.red(`  ❌ ${error}`));
            }
        }
        if (!(await (0, utils_1.isGitRepo)(projectRoot))) {
            console.log(chalk_1.default.yellow('  → Initializing git repository...'));
            await (0, utils_1.initGitRepo)(projectRoot);
            result.installed.push('git repository');
        }
        else {
            console.log(chalk_1.default.gray('  ✓ Git repository already initialized'));
            result.skipped.push('git repository');
        }
        const hooksToInstall = opts.hooksEnabled || ['pre-commit', 'commit-msg', 'pre-push', 'post-checkout'];
        const assetsDir = (0, utils_1.getAssetsDir)();
        const hooksDir = path_1.default.join(projectRoot, '.githooks');
        await fs_extra_1.default.ensureDir(hooksDir);
        for (const hook of hooksToInstall) {
            const src = path_1.default.join(assetsDir, 'hooks', hook);
            const dest = path_1.default.join(hooksDir, hook);
            if (await (0, utils_1.fileExists)(dest)) {
                result.skipped.push(`git hook: ${hook}`);
                console.log(chalk_1.default.gray(`  ✓ Hook already exists: ${hook} (preserving existing)`));
                continue;
            }
            if (await (0, utils_1.fileExists)(src)) {
                await (0, utils_1.copyFile)(src, dest, { preservePermissions: true });
                await (0, utils_1.makeExecutable)(dest);
                result.installed.push(`git hook: ${hook}`);
                console.log(chalk_1.default.green(`  ✓ Installed ${hook} hook`));
            }
            else {
                result.errors.push(`Hook not found: ${hook}`);
                console.log(chalk_1.default.yellow(`  ⚠️  Hook not found: ${hook}`));
            }
        }
        try {
            await (0, utils_1.setGitConfig)(projectRoot, 'core.hooksPath', '.githooks');
            console.log(chalk_1.default.green('  ✓ Configured git hooks path'));
        }
        catch (error) {
            result.errors.push('Failed to configure git hooks path');
            console.log(chalk_1.default.yellow('  ⚠️  Failed to configure git hooks path'));
        }
        if (opts.commitTemplate !== false) {
            const templateSrc = path_1.default.join(assetsDir, 'templates', '.gitmessage');
            const templateDest = path_1.default.join(projectRoot, '.gitmessage');
            if (await (0, utils_1.fileExists)(templateSrc)) {
                await (0, utils_1.copyFile)(templateSrc, templateDest);
                await (0, utils_1.setGitConfig)(projectRoot, 'commit.template', '.gitmessage');
                result.installed.push('commit template');
                console.log(chalk_1.default.green('  ✓ Installed commit message template'));
            }
        }
        if (opts.prTemplate !== false) {
            const prSrc = path_1.default.join(assetsDir, 'templates', 'PULL_REQUEST_TEMPLATE.md');
            const prDest = path_1.default.join(projectRoot, '.github', 'PULL_REQUEST_TEMPLATE.md');
            if (await (0, utils_1.fileExists)(prSrc)) {
                await (0, utils_1.copyFile)(prSrc, prDest);
                result.installed.push('PR template');
                console.log(chalk_1.default.green('  ✓ Installed PR template'));
            }
        }
        if (opts.issueTemplates !== false) {
            const issueTemplatesDir = path_1.default.join(assetsDir, 'templates', 'ISSUE_TEMPLATE');
            const issueTemplatesDest = path_1.default.join(projectRoot, '.github', 'ISSUE_TEMPLATE');
            if (await (0, utils_1.fileExists)(issueTemplatesDir)) {
                await fs_extra_1.default.ensureDir(issueTemplatesDest);
                const templates = await fs_extra_1.default.readdir(issueTemplatesDir);
                for (const template of templates) {
                    const src = path_1.default.join(issueTemplatesDir, template);
                    const dest = path_1.default.join(issueTemplatesDest, template);
                    await (0, utils_1.copyFile)(src, dest);
                }
                result.installed.push('issue templates');
                console.log(chalk_1.default.green('  ✓ Installed issue templates'));
            }
        }
        const gitignoreSrc = path_1.default.join(assetsDir, 'config', `.gitignore.${projectType}`);
        const gitignoreFallback = path_1.default.join(assetsDir, 'config', '.gitignore.nodejs');
        const gitignoreDest = path_1.default.join(projectRoot, '.gitignore');
        let gitignoreSource = gitignoreSrc;
        if (!(await (0, utils_1.fileExists)(gitignoreSrc))) {
            gitignoreSource = gitignoreFallback;
        }
        if (await (0, utils_1.fileExists)(gitignoreSource)) {
            const gitignoreExists = await (0, utils_1.fileExists)(gitignoreDest);
            if (!gitignoreExists) {
                await (0, utils_1.copyFile)(gitignoreSource, gitignoreDest);
                result.installed.push('.gitignore');
                console.log(chalk_1.default.green('  ✓ Installed .gitignore'));
            }
            else {
                result.skipped.push('.gitignore');
                console.log(chalk_1.default.gray('  ✓ .gitignore already exists'));
            }
        }
        const gitattributesSrc = path_1.default.join(assetsDir, 'config', '.gitattributes');
        const gitattributesDest = path_1.default.join(projectRoot, '.gitattributes');
        if (await (0, utils_1.fileExists)(gitattributesSrc)) {
            const gitattributesExists = await (0, utils_1.fileExists)(gitattributesDest);
            if (!gitattributesExists) {
                await (0, utils_1.copyFile)(gitattributesSrc, gitattributesDest);
                result.installed.push('.gitattributes');
                console.log(chalk_1.default.green('  ✓ Installed .gitattributes'));
            }
            else {
                result.skipped.push('.gitattributes');
                console.log(chalk_1.default.gray('  ✓ .gitattributes already exists'));
            }
        }
        console.log(chalk_1.default.blue('\n🐙 Setting up GitHub CLI...\n'));
        const ghInstallResult = await (0, utils_1.ensureGhInstalled)();
        result.ghInstalled = ghInstallResult.installed;
        if (ghInstallResult.installed) {
            if (ghInstallResult.alreadyInstalled) {
                console.log(chalk_1.default.gray('  ✓ GitHub CLI already installed'));
            }
            else {
                console.log(chalk_1.default.green(`  ✓ GitHub CLI installed via ${ghInstallResult.method}`));
            }
        }
        else {
            result.errors.push(ghInstallResult.error || 'Failed to install gh CLI');
            console.log(chalk_1.default.yellow(`  ⚠️  ${ghInstallResult.error}`));
        }
        if (result.ghInstalled) {
            const ghAuthResult = await (0, utils_1.ensureGhAuth)();
            result.ghAuthenticated = ghAuthResult.authenticated;
            if (ghAuthResult.authenticated) {
                console.log(chalk_1.default.green(`  ✓ Authenticated as ${ghAuthResult.username}`));
            }
            else {
                result.errors.push(ghAuthResult.error || 'Not authenticated to GitHub');
                console.log(chalk_1.default.yellow(`  ⚠️  ${ghAuthResult.error}`));
            }
        }
        if (opts.createRemoteRepo !== false && result.ghInstalled && result.ghAuthenticated) {
            console.log(chalk_1.default.blue('\n📦 Setting up remote repository...\n'));
            const repoName = opts.remoteRepoName || path_1.default.basename(projectRoot);
            const repoVisibility = opts.remoteVisibility || 'private';
            const hasOrigin = await (0, utils_1.hasRemote)(projectRoot, 'origin');
            if (hasOrigin) {
                const remoteUrl = await (0, utils_1.getRemoteUrl)(projectRoot, 'origin');
                result.skipped.push('remote repository');
                result.remoteRepoUrl = remoteUrl || undefined;
                console.log(chalk_1.default.gray(`  ✓ Remote already configured: ${remoteUrl}`));
            }
            else {
                const createResult = await (0, utils_1.createGhRepo)(repoName, {
                    visibility: repoVisibility
                });
                if (createResult.created || createResult.alreadyExists) {
                    result.remoteRepoCreated = createResult.created;
                    result.remoteRepoUrl = createResult.repoUrl;
                    if (createResult.repoUrl) {
                        await (0, utils_1.addRemote)(projectRoot, 'origin', createResult.repoUrl);
                        result.installed.push('remote repository');
                        if (createResult.created) {
                            console.log(chalk_1.default.green(`  ✓ Created repository: ${createResult.repoUrl}`));
                        }
                        else {
                            console.log(chalk_1.default.gray(`  ✓ Repository already exists: ${createResult.repoUrl}`));
                        }
                    }
                }
                else {
                    result.errors.push(createResult.error || 'Failed to create repository');
                    console.log(chalk_1.default.yellow(`  ⚠️  ${createResult.error}`));
                }
            }
        }
        console.log(chalk_1.default.blue('\n👤 Setting up contributor identity...\n'));
        const userEmail = await (0, utils_1.getGitUserEmail)(projectRoot);
        if (userEmail) {
            const expert = await (0, utils_1.findExpertByEmail)(userEmail);
            if (expert) {
                result.expertRegistered = true;
                result.expertGitHubUser = expert.githubUsername;
                console.log(chalk_1.default.green(`  ✓ Expert identity detected: ${expert.name} (${expert.githubUsername})`));
            }
            else {
                console.log(chalk_1.default.yellow(`  ⚠️  Email ${userEmail} not in expert registry`));
                console.log(chalk_1.default.yellow('     Add expert to registry: assets/config/experts-registry.json'));
            }
        }
        else {
            console.log(chalk_1.default.yellow('  ⚠️  No git user.email configured'));
            console.log(chalk_1.default.yellow('     Run: git config user.email "your@email.com"'));
        }
        result.success = true;
        console.log(chalk_1.default.green('\n✅ Git workflow initialized successfully!\n'));
    }
    catch (error) {
        result.errors.push(error instanceof Error ? error.message : 'Unknown error');
        console.log(chalk_1.default.red(`\n❌ Error during initialization: ${error}\n`));
    }
    return result;
}
//# sourceMappingURL=init.js.map