"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.repair = repair;
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("../utils");
async function repair(options) {
    const { projectRoot, issues } = options;
    const result = {
        repaired: [],
        failed: []
    };
    try {
        console.log(chalk_1.default.blue('\n🔧 Repairing Git Workflow...\n'));
        const assetsDir = (0, utils_1.getAssetsDir)();
        for (const issue of issues) {
            try {
                switch (issue.type) {
                    case 'missing': {
                        if (issue.file.startsWith('.git/hooks/')) {
                            const hookName = path_1.default.basename(issue.file);
                            const src = path_1.default.join(assetsDir, 'hooks', hookName);
                            const dest = path_1.default.join(projectRoot, issue.file);
                            await (0, utils_1.copyFile)(src, dest, { preservePermissions: true });
                            await (0, utils_1.makeExecutable)(dest);
                            result.repaired.push(issue.file);
                            console.log(chalk_1.default.green(`  ✓ Repaired: ${issue.file}`));
                        }
                        else if (issue.file === '.gitignore') {
                            const src = path_1.default.join(assetsDir, 'config', '.gitignore.nodejs');
                            const dest = path_1.default.join(projectRoot, '.gitignore');
                            await (0, utils_1.copyFile)(src, dest);
                            result.repaired.push(issue.file);
                            console.log(chalk_1.default.green(`  ✓ Repaired: ${issue.file}`));
                        }
                        else if (issue.file === '.gitattributes') {
                            const src = path_1.default.join(assetsDir, 'config', '.gitattributes');
                            const dest = path_1.default.join(projectRoot, '.gitattributes');
                            await (0, utils_1.copyFile)(src, dest);
                            result.repaired.push(issue.file);
                            console.log(chalk_1.default.green(`  ✓ Repaired: ${issue.file}`));
                        }
                        else if (issue.file === 'gh') {
                            const installResult = await (0, utils_1.installGh)();
                            if (installResult.installed) {
                                result.repaired.push(issue.file);
                                console.log(chalk_1.default.green(`  ✓ Installed gh CLI via ${installResult.method}`));
                            }
                            else {
                                result.failed.push(issue.file);
                                console.log(chalk_1.default.red(`  ❌ Failed to install gh CLI: ${installResult.error}`));
                            }
                        }
                        break;
                    }
                    case 'broken': {
                        if (issue.file.startsWith('.git/hooks/') || issue.file.includes('.gitmessage')) {
                            const fileName = path_1.default.basename(issue.file);
                            const assetPath = issue.file.startsWith('.git/hooks/')
                                ? path_1.default.join('hooks', fileName)
                                : path_1.default.join('templates', fileName);
                            const src = path_1.default.join(assetsDir, assetPath);
                            const dest = path_1.default.join(projectRoot, issue.file);
                            await (0, utils_1.copyFile)(src, dest, { preservePermissions: true });
                            if (issue.file.startsWith('.git/hooks/')) {
                                await (0, utils_1.makeExecutable)(dest);
                            }
                            result.repaired.push(issue.file);
                            console.log(chalk_1.default.green(`  ✓ Repaired: ${issue.file}`));
                        }
                        break;
                    }
                    case 'misconfigured': {
                        if (issue.message.includes('Commit template')) {
                            await (0, utils_1.setGitConfig)(projectRoot, 'commit.template', '.gitmessage');
                            result.repaired.push('commit.template config');
                            console.log(chalk_1.default.green('  ✓ Configured commit template'));
                        }
                        break;
                    }
                    case 'unauthenticated': {
                        if (issue.file === 'gh') {
                            console.log(chalk_1.default.yellow('  → Initiating gh authentication...'));
                            const authResult = await (0, utils_1.ghAuthLogin)();
                            if (authResult.authenticated) {
                                result.repaired.push('gh authentication');
                                console.log(chalk_1.default.green(`  ✓ Authenticated as ${authResult.username}`));
                            }
                            else {
                                result.failed.push('gh authentication');
                                console.log(chalk_1.default.red(`  ❌ Authentication failed: ${authResult.error}`));
                            }
                        }
                        break;
                    }
                    default: {
                        result.failed.push(issue.file);
                        console.log(chalk_1.default.yellow(`  ⊘ Cannot auto-repair: ${issue.file}`));
                    }
                }
            }
            catch (error) {
                result.failed.push(issue.file);
                console.log(chalk_1.default.red(`  ❌ Failed to repair ${issue.file}: ${error}`));
            }
        }
        if (result.repaired.length > 0) {
            console.log(chalk_1.default.green(`\n✅ Repaired ${result.repaired.length} issue(s)\n`));
        }
        if (result.failed.length > 0) {
            console.log(chalk_1.default.yellow(`\n⚠️  Failed to repair ${result.failed.length} issue(s)\n`));
        }
    }
    catch (error) {
        console.log(chalk_1.default.red(`\n❌ Error during repair: ${error}\n`));
    }
    return result;
}
//# sourceMappingURL=repair.js.map