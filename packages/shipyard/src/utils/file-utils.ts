import path from 'path';
import fs from 'fs-extra';
import type { ApplyResult } from '../types';

export function createApplyResult(): ApplyResult {
  return {
    updatedFiles: [],
    skippedFiles: [],
    warnings: []
  };
}

interface ScriptSource {
  name: string;
  lint?: string;
  test?: string;
  build?: string;
}

const SCRIPT_ALIASES: Record<'lint' | 'test' | 'build', string[]> = {
  lint: ['lint', 'cs', 'phpcs', 'check', 'check-style'],
  test: ['test', 'unit', 'phpunit'],
  build: ['build', 'compile']
};

function pickScriptName(
  scripts: Record<string, string>,
  target: 'lint' | 'test' | 'build'
): string | undefined {
  return SCRIPT_ALIASES[target].find((name) => Boolean(scripts[name]));
}

function isAngularProject(frontendDir: string, packageJson: Record<string, unknown>): boolean {
  const deps = (packageJson.dependencies || {}) as Record<string, string>;
  const devDeps = (packageJson.devDependencies || {}) as Record<string, string>;
  return (
    Boolean(deps['@angular/core']) ||
    Boolean(devDeps['@angular/cli']) ||
    fs.existsSync(path.join(frontendDir, 'angular.json'))
  );
}

function failingNodeScript(message: string): string {
  const escaped = message.replace(/'/g, "\\'");
  return `node -e "console.error('${escaped}'); process.exit(1)"`;
}

async function ensureInnerScripts(projectRoot: string): Promise<{
  sources: ScriptSource[];
  warnings: string[];
  touchedFiles: string[];
}> {
  const candidates = ['frontend', 'backend'];
  const sources: ScriptSource[] = [];
  const warnings: string[] = [];
  const touchedFiles: string[] = [];

  for (const candidate of candidates) {
    const dirPath = path.join(projectRoot, candidate);
    if (!(await fs.pathExists(dirPath))) {
      continue;
    }

    const packageJsonPath = path.join(dirPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const scripts = (packageJson.scripts || {}) as Record<string, string>;
      let changed = false;

      if (candidate === 'frontend') {
        const angular = isAngularProject(dirPath, packageJson as Record<string, unknown>);
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
        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
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

    const composerJsonPath = path.join(dirPath, 'composer.json');
    if (await fs.pathExists(composerJsonPath)) {
      const composerJson = await fs.readJson(composerJsonPath);
      const scripts = (composerJson.scripts || {}) as Record<string, string>;
      let changed = false;

      if (!pickScriptName(scripts, 'lint')) {
        scripts.lint = 'echo "Shipyard: define backend lint in composer.json" && exit 1';
        warnings.push(`Added default backend lint script in ${candidate}/composer.json`);
        changed = true;
      }
      if (!pickScriptName(scripts, 'test')) {
        const requireDev = (composerJson['require-dev'] || {}) as Record<string, string>;
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
        await fs.writeJson(composerJsonPath, composerJson, { spaces: 2 });
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

function failingPlaceholder(scriptName: 'lint' | 'test' | 'build'): string {
  return `node -e "console.error('Shipyard: define \\"${scriptName}\\" at root or in frontend/backend first.'); process.exit(1)"`;
}

export async function ensureShipyardScripts(
  projectRoot: string,
  packageJson: Record<string, unknown>
): Promise<{
  changed: boolean;
  packageJson: Record<string, unknown>;
  warnings: string[];
  touchedFiles: string[];
}> {
  const warnings: string[] = [];
  const updated = { ...packageJson };
  const scripts = { ...(updated.scripts as Record<string, string> | undefined) };
  const ensured = await ensureInnerScripts(projectRoot);
  const sources = ensured.sources;
  const touchedFiles = [...ensured.touchedFiles];
  warnings.push(...ensured.warnings);

  let changed = false;

  const baseScripts: Array<'lint' | 'test' | 'build'> = ['lint', 'test', 'build'];
  for (const scriptName of baseScripts) {
    if (!scripts[scriptName]) {
      const collected = sources
        .map((source) => source[scriptName])
        .filter((command): command is string => Boolean(command));

      if (collected.length > 0) {
        scripts[scriptName] = collected.join(' && ');
      } else {
        scripts[scriptName] = failingPlaceholder(scriptName);
        warnings.push(
          `Could not infer "${scriptName}" from frontend/backend. Added a failing placeholder; define a real "${scriptName}" command.`
        );
      }
      changed = true;
    }
  }

  const requiredScripts: Record<string, string> = {
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

export async function writeFileIfAllowed(
  projectRoot: string,
  relativePath: string,
  content: string,
  force: boolean,
  result: ApplyResult
): Promise<void> {
  const targetPath = path.join(projectRoot, relativePath);
  const exists = await fs.pathExists(targetPath);
  if (exists && !force) {
    result.skippedFiles.push(relativePath);
    return;
  }

  await fs.ensureDir(path.dirname(targetPath));
  await fs.writeFile(targetPath, content);
  result.updatedFiles.push(relativePath);
}
