"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApplyResult = createApplyResult;
exports.ensureShipyardScripts = ensureShipyardScripts;
exports.writeFileIfAllowed = writeFileIfAllowed;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
function createApplyResult() {
    return {
        updatedFiles: [],
        skippedFiles: [],
        warnings: []
    };
}
const SCRIPT_ALIASES = {
    lint: ['lint', 'cs', 'phpcs', 'check', 'check-style'],
    test: ['test', 'unit', 'phpunit'],
    build: ['build', 'compile']
};
function pickScriptName(scripts, target) {
    return SCRIPT_ALIASES[target].find((name) => Boolean(scripts[name]));
}
function isAngularProject(frontendDir, packageJson) {
    const deps = (packageJson.dependencies || {});
    const devDeps = (packageJson.devDependencies || {});
    return (Boolean(deps['@angular/core']) ||
        Boolean(devDeps['@angular/cli']) ||
        fs_extra_1.default.existsSync(path_1.default.join(frontendDir, 'angular.json')));
}
function failingNodeScript(message) {
    const escaped = message.replace(/'/g, "\\'");
    return `node -e "console.error('${escaped}'); process.exit(1)"`;
}
async function ensureInnerScripts(projectRoot) {
    const candidates = ['frontend', 'backend'];
    const sources = [];
    const warnings = [];
    const touchedFiles = [];
    for (const candidate of candidates) {
        const dirPath = path_1.default.join(projectRoot, candidate);
        if (!(await fs_extra_1.default.pathExists(dirPath))) {
            continue;
        }
        const packageJsonPath = path_1.default.join(dirPath, 'package.json');
        if (await fs_extra_1.default.pathExists(packageJsonPath)) {
            const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
            const scripts = (packageJson.scripts || {});
            let changed = false;
            if (candidate === 'frontend') {
                const angular = isAngularProject(dirPath, packageJson);
                if (!scripts.lint) {
                    scripts.lint = angular ? 'ng lint' : failingNodeScript('Shipyard: define frontend lint script');
                    warnings.push(`Added default frontend lint script in ${candidate}/package.json`);
                    changed = true;
                }
                if (!scripts.test) {
                    scripts.test = angular
                        ? 'ng test --watch=false --browsers=ChromeHeadless'
                        : failingNodeScript('Shipyard: define frontend test script');
                    warnings.push(`Added default frontend test script in ${candidate}/package.json`);
                    changed = true;
                }
                if (!scripts.build) {
                    scripts.build = angular ? 'ng build' : failingNodeScript('Shipyard: define frontend build script');
                    warnings.push(`Added default frontend build script in ${candidate}/package.json`);
                    changed = true;
                }
            }
            if (changed) {
                packageJson.scripts = scripts;
                await fs_extra_1.default.writeJson(packageJsonPath, packageJson, { spaces: 2 });
                touchedFiles.push(`${candidate}/package.json`);
            }
            const lintScript = pickScriptName(scripts, 'lint');
            const testScript = pickScriptName(scripts, 'test');
            const buildScript = pickScriptName(scripts, 'build');
            sources.push({
                name: candidate,
                lint: lintScript ? `npm --prefix ${candidate} run ${lintScript}` : undefined,
                test: testScript ? `npm --prefix ${candidate} run ${testScript}` : undefined,
                build: buildScript ? `npm --prefix ${candidate} run ${buildScript}` : undefined
            });
            continue;
        }
        const composerJsonPath = path_1.default.join(dirPath, 'composer.json');
        if (await fs_extra_1.default.pathExists(composerJsonPath)) {
            const composerJson = await fs_extra_1.default.readJson(composerJsonPath);
            const scripts = (composerJson.scripts || {});
            let changed = false;
            if (!pickScriptName(scripts, 'lint')) {
                scripts.lint = 'echo "Shipyard: define backend lint in composer.json" && exit 1';
                warnings.push(`Added default backend lint script in ${candidate}/composer.json`);
                changed = true;
            }
            if (!pickScriptName(scripts, 'test')) {
                const requireDev = (composerJson['require-dev'] || {});
                scripts.test = requireDev['phpunit/phpunit']
                    ? 'phpunit'
                    : 'echo "Shipyard: define backend test in composer.json" && exit 1';
                warnings.push(`Added default backend test script in ${candidate}/composer.json`);
                changed = true;
            }
            if (!pickScriptName(scripts, 'build')) {
                scripts.build = 'echo "Shipyard: backend has no build step by default"';
                warnings.push(`Added default backend build script in ${candidate}/composer.json`);
                changed = true;
            }
            if (changed) {
                composerJson.scripts = scripts;
                await fs_extra_1.default.writeJson(composerJsonPath, composerJson, { spaces: 2 });
                touchedFiles.push(`${candidate}/composer.json`);
            }
            const lintScript = pickScriptName(scripts, 'lint');
            const testScript = pickScriptName(scripts, 'test');
            const buildScript = pickScriptName(scripts, 'build');
            sources.push({
                name: candidate,
                lint: lintScript ? `composer --working-dir ${candidate} run ${lintScript}` : undefined,
                test: testScript ? `composer --working-dir ${candidate} run ${testScript}` : undefined,
                build: buildScript ? `composer --working-dir ${candidate} run ${buildScript}` : undefined
            });
        }
    }
    return { sources, warnings, touchedFiles };
}
function failingPlaceholder(scriptName) {
    return `node -e "console.error('Shipyard: define \\"${scriptName}\\" at root or in frontend/backend first.'); process.exit(1)"`;
}
async function ensureShipyardScripts(projectRoot, packageJson) {
    const warnings = [];
    const updated = { ...packageJson };
    const scripts = { ...updated.scripts };
    const ensured = await ensureInnerScripts(projectRoot);
    const sources = ensured.sources;
    const touchedFiles = [...ensured.touchedFiles];
    warnings.push(...ensured.warnings);
    let changed = false;
    const baseScripts = ['lint', 'test', 'build'];
    for (const scriptName of baseScripts) {
        if (!scripts[scriptName]) {
            const collected = sources
                .map((source) => source[scriptName])
                .filter((command) => Boolean(command));
            if (collected.length > 0) {
                scripts[scriptName] = collected.join(' && ');
            }
            else {
                scripts[scriptName] = failingPlaceholder(scriptName);
                warnings.push(`Could not infer "${scriptName}" from frontend/backend. Added a failing placeholder; define a real "${scriptName}" command.`);
            }
            changed = true;
        }
    }
    const requiredScripts = {
        dockside: 'npm run lint && npm run test && npm run build',
        'ci:verify': 'npm run dockside'
    };
    for (const [scriptName, command] of Object.entries(requiredScripts)) {
        if (scripts[scriptName] !== command) {
            scripts[scriptName] = command;
            changed = true;
        }
    }
    if (changed) {
        updated.scripts = scripts;
    }
    return {
        changed,
        packageJson: updated,
        warnings,
        touchedFiles
    };
}
async function writeFileIfAllowed(projectRoot, relativePath, content, force, result) {
    const targetPath = path_1.default.join(projectRoot, relativePath);
    const exists = await fs_extra_1.default.pathExists(targetPath);
    if (exists && !force) {
        result.skippedFiles.push(relativePath);
        return;
    }
    await fs_extra_1.default.ensureDir(path_1.default.dirname(targetPath));
    await fs_extra_1.default.writeFile(targetPath, content);
    result.updatedFiles.push(relativePath);
}
//# sourceMappingURL=file-utils.js.map