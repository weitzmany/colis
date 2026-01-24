/**
 * Git Workflow Update
 */

import path from 'path';
import chalk from 'chalk';
import type { UpdateOptions, UpdateResult } from '../types';
import {
  getAssetsDir,
  copyFile,
  makeExecutable,
  fileExists,
  createBackup
} from '../utils';

/**
 * Update git workflow to latest version
 */
export async function update(options: UpdateOptions): Promise<UpdateResult> {
  const { projectRoot, options: opts = {} } = options;
  
  const result: UpdateResult = {
    updated: [],
    skipped: [],
    backed_up: []
  };

  try {
    console.log(chalk.blue('\n🔄 Updating Git Workflow...\n'));

    const assetsDir = getAssetsDir();
    const force = opts.force || false;
    const backup = opts.backup !== false; // Default to true

    // Update hooks
    const hooks = ['pre-commit', 'commit-msg', 'pre-push', 'post-checkout'];
    
    for (const hook of hooks) {
      const src = path.join(assetsDir, 'hooks', hook);
      const dest = path.join(projectRoot, '.git', 'hooks', hook);

      if (await fileExists(dest)) {
        if (backup) {
          const backupPath = await createBackup(dest);
          result.backed_up.push(backupPath);
          console.log(chalk.gray(`  → Backed up: ${hook}`));
        }

        await copyFile(src, dest, { preservePermissions: true });
        await makeExecutable(dest);
        result.updated.push(hook);
        console.log(chalk.green(`  ✓ Updated: ${hook}`));
      }
    }

    // Update commit template
    const templateSrc = path.join(assetsDir, 'templates', '.gitmessage');
    const templateDest = path.join(projectRoot, '.gitmessage');

    if (await fileExists(templateDest)) {
      if (backup) {
        const backupPath = await createBackup(templateDest);
        result.backed_up.push(backupPath);
      }

      await copyFile(templateSrc, templateDest);
      result.updated.push('.gitmessage');
      console.log(chalk.green('  ✓ Updated: .gitmessage'));
    }

    // Update templates (unless force is false)
    if (force || !(await fileExists(path.join(projectRoot, '.github', 'PULL_REQUEST_TEMPLATE.md')))) {
      const prSrc = path.join(assetsDir, 'templates', 'PULL_REQUEST_TEMPLATE.md');
      const prDest = path.join(projectRoot, '.github', 'PULL_REQUEST_TEMPLATE.md');

      if (await fileExists(prDest) && backup) {
        const backupPath = await createBackup(prDest);
        result.backed_up.push(backupPath);
      }

      await copyFile(prSrc, prDest);
      result.updated.push('PULL_REQUEST_TEMPLATE.md');
      console.log(chalk.green('  ✓ Updated: PULL_REQUEST_TEMPLATE.md'));
    }

    console.log(chalk.green(`\n✅ Updated ${result.updated.length} file(s)\n`));

    if (result.backed_up.length > 0) {
      console.log(chalk.gray(`Backups created: ${result.backed_up.length}\n`));
    }

  } catch (error) {
    console.log(chalk.red(`\n❌ Error during update: ${error}\n`));
  }

  return result;
}
