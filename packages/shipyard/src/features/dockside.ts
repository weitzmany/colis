import path from 'path';
import fs from 'fs-extra';
import type { ApplyResult, FeatureInstallOptions } from '../types';
import { createApplyResult, ensureShipyardScripts, writeFileIfAllowed } from '../utils/file-utils';

const PRE_PUSH_HOOK = `#!/usr/bin/env bash
set -euo pipefail

echo "Running dockside checks..."
npm run dockside
`;

export async function installDockside(options: FeatureInstallOptions): Promise<ApplyResult> {
  const result = createApplyResult();
  const packageJsonPath = path.join(options.projectRoot, 'package.json');

  if (!(await fs.pathExists(packageJsonPath))) {
    result.warnings.push('No package.json found in target project root. Skipped dockside script installation.');
  } else {
    const packageJson = await fs.readJson(packageJsonPath);
    const update = await ensureShipyardScripts(options.projectRoot, packageJson);
    result.warnings.push(...update.warnings);
    for (const touchedFile of update.touchedFiles) {
      if (!result.updatedFiles.includes(touchedFile)) {
        result.updatedFiles.push(touchedFile);
      }
    }

    if (update.changed) {
      await fs.writeJson(packageJsonPath, update.packageJson, { spaces: 2 });
      result.updatedFiles.push('package.json');
    }
  }

  await writeFileIfAllowed(
    options.projectRoot,
    '.githooks/pre-push',
    PRE_PUSH_HOOK,
    Boolean(options.force),
    result
  );

  return result;
}
