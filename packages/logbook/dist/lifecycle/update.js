"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = update;
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const utils_1 = require("../utils");
async function update(options) {
    const { projectRoot, options: opts = {} } = options;
    const result = {
        updated: [],
        skipped: [],
        backed_up: []
    };
    try {
        console.log(chalk_1.default.blue('\n🔄 Updating Git Workflow...\n'));
        const assetsDir = (0, utils_1.getAssetsDir)();
        const force = opts.force || false;
        const backup = opts.backup !== false;
        const hooks = ['pre-commit', 'commit-msg', 'pre-push', 'post-checkout'];
        for (const hook of hooks) {
            const src = path_1.default.join(assetsDir, 'hooks', hook);
            const dest = path_1.default.join(projectRoot, '.git', 'hooks', hook);
            if (await (0, utils_1.fileExists)(dest)) {
                if (backup) {
                    const backupPath = await (0, utils_1.createBackup)(dest);
                    result.backed_up.push(backupPath);
                    console.log(chalk_1.default.gray(`  → Backed up: ${hook}`));
                }
                await (0, utils_1.copyFile)(src, dest, { preservePermissions: true });
                await (0, utils_1.makeExecutable)(dest);
                result.updated.push(hook);
                console.log(chalk_1.default.green(`  ✓ Updated: ${hook}`));
            }
        }
        const templateSrc = path_1.default.join(assetsDir, 'templates', '.gitmessage');
        const templateDest = path_1.default.join(projectRoot, '.gitmessage');
        if (await (0, utils_1.fileExists)(templateDest)) {
            if (backup) {
                const backupPath = await (0, utils_1.createBackup)(templateDest);
                result.backed_up.push(backupPath);
            }
            await (0, utils_1.copyFile)(templateSrc, templateDest);
            result.updated.push('.gitmessage');
            console.log(chalk_1.default.green('  ✓ Updated: .gitmessage'));
        }
        if (force || !(await (0, utils_1.fileExists)(path_1.default.join(projectRoot, '.github', 'PULL_REQUEST_TEMPLATE.md')))) {
            const prSrc = path_1.default.join(assetsDir, 'templates', 'PULL_REQUEST_TEMPLATE.md');
            const prDest = path_1.default.join(projectRoot, '.github', 'PULL_REQUEST_TEMPLATE.md');
            if (await (0, utils_1.fileExists)(prDest) && backup) {
                const backupPath = await (0, utils_1.createBackup)(prDest);
                result.backed_up.push(backupPath);
            }
            await (0, utils_1.copyFile)(prSrc, prDest);
            result.updated.push('PULL_REQUEST_TEMPLATE.md');
            console.log(chalk_1.default.green('  ✓ Updated: PULL_REQUEST_TEMPLATE.md'));
        }
        console.log(chalk_1.default.green(`\n✅ Updated ${result.updated.length} file(s)\n`));
        if (result.backed_up.length > 0) {
            console.log(chalk_1.default.gray(`Backups created: ${result.backed_up.length}\n`));
        }
    }
    catch (error) {
        console.log(chalk_1.default.red(`\n❌ Error during update: ${error}\n`));
    }
    return result;
}
//# sourceMappingURL=update.js.map