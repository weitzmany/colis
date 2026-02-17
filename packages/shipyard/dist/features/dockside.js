"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installDockside = installDockside;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const file_utils_1 = require("../utils/file-utils");
const PRE_PUSH_HOOK = `#!/usr/bin/env bash
set -euo pipefail

echo "Running dockside checks..."
npm run dockside
`;
async function installDockside(options) {
    const result = (0, file_utils_1.createApplyResult)();
    const packageJsonPath = path_1.default.join(options.projectRoot, 'package.json');
    if (!(await fs_extra_1.default.pathExists(packageJsonPath))) {
        result.warnings.push('No package.json found in target project root. Skipped dockside script installation.');
    }
    else {
        const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
        const update = await (0, file_utils_1.ensureShipyardScripts)(options.projectRoot, packageJson);
        result.warnings.push(...update.warnings);
        for (const touchedFile of update.touchedFiles) {
            if (!result.updatedFiles.includes(touchedFile)) {
                result.updatedFiles.push(touchedFile);
            }
        }
        if (update.changed) {
            await fs_extra_1.default.writeJson(packageJsonPath, update.packageJson, { spaces: 2 });
            result.updatedFiles.push('package.json');
        }
    }
    await (0, file_utils_1.writeFileIfAllowed)(options.projectRoot, '.githooks/pre-push', PRE_PUSH_HOOK, Boolean(options.force), result);
    return result;
}
//# sourceMappingURL=dockside.js.map