/**
 * Git Workflow Repair
 */

import path from 'path';
import chalk from 'chalk';
import type { RepairOptions, RepairResult } from '../types';
import {
  getAssetsDir,
  copyFile,
  makeExecutable,
  setGitConfig,
  installGh,
  ghAuthLogin
} from '../utils';

/**
 * Repair git workflow issues
 */
export async function repair(options: RepairOptions): Promise<RepairResult> {
  const { projectRoot, issues } = options;
  
  const result: RepairResult = {
    repaired: [],
    failed: []
  };

  try {
    console.log(chalk.blue('\n🔧 Repairing Git Workflow...\n'));

    const assetsDir = getAssetsDir();

    for (const issue of issues) {
      try {
        switch (issue.type) {
          case 'missing': {
            // Repair missing files/hooks
            if (issue.file.startsWith('.git/hooks/')) {
              // Missing hook
              const hookName = path.basename(issue.file);
              const src = path.join(assetsDir, 'hooks', hookName);
              const dest = path.join(projectRoot, issue.file);

              await copyFile(src, dest, { preservePermissions: true });
              await makeExecutable(dest);
              result.repaired.push(issue.file);
              console.log(chalk.green(`  ✓ Repaired: ${issue.file}`));
            } else if (issue.file === '.gitignore') {
              // Missing .gitignore
              const src = path.join(assetsDir, 'config', '.gitignore.nodejs');
              const dest = path.join(projectRoot, '.gitignore');
              
              await copyFile(src, dest);
              result.repaired.push(issue.file);
              console.log(chalk.green(`  ✓ Repaired: ${issue.file}`));
            } else if (issue.file === '.gitattributes') {
              // Missing .gitattributes
              const src = path.join(assetsDir, 'config', '.gitattributes');
              const dest = path.join(projectRoot, '.gitattributes');
              
              await copyFile(src, dest);
              result.repaired.push(issue.file);
              console.log(chalk.green(`  ✓ Repaired: ${issue.file}`));
            } else if (issue.file === 'gh') {
              // Missing gh CLI
              const installResult = await installGh();
              
              if (installResult.installed) {
                result.repaired.push(issue.file);
                console.log(chalk.green(`  ✓ Installed gh CLI via ${installResult.method}`));
              } else {
                result.failed.push(issue.file);
                console.log(chalk.red(`  ❌ Failed to install gh CLI: ${installResult.error}`));
              }
            }
            break;
          }

          case 'broken': {
            // Repair broken hooks/files
            if (issue.file.startsWith('.git/hooks/') || issue.file.includes('.gitmessage')) {
              const fileName = path.basename(issue.file);
              const assetPath = issue.file.startsWith('.git/hooks/') 
                ? path.join('hooks', fileName)
                : path.join('templates', fileName);
              
              const src = path.join(assetsDir, assetPath);
              const dest = path.join(projectRoot, issue.file);

              await copyFile(src, dest, { preservePermissions: true });
              if (issue.file.startsWith('.git/hooks/')) {
                await makeExecutable(dest);
              }
              result.repaired.push(issue.file);
              console.log(chalk.green(`  ✓ Repaired: ${issue.file}`));
            }
            break;
          }

          case 'misconfigured': {
            // Repair misconfigured git settings
            if (issue.message.includes('Commit template')) {
              await setGitConfig(projectRoot, 'commit.template', '.gitmessage');
              result.repaired.push('commit.template config');
              console.log(chalk.green('  ✓ Configured commit template'));
            }
            break;
          }

          case 'unauthenticated': {
            // Repair gh authentication
            if (issue.file === 'gh') {
              console.log(chalk.yellow('  → Initiating gh authentication...'));
              const authResult = await ghAuthLogin();
              
              if (authResult.authenticated) {
                result.repaired.push('gh authentication');
                console.log(chalk.green(`  ✓ Authenticated as ${authResult.username}`));
              } else {
                result.failed.push('gh authentication');
                console.log(chalk.red(`  ❌ Authentication failed: ${authResult.error}`));
              }
            }
            break;
          }

          default: {
            result.failed.push(issue.file);
            console.log(chalk.yellow(`  ⊘ Cannot auto-repair: ${issue.file}`));
          }
        }
      } catch (error) {
        result.failed.push(issue.file);
        console.log(chalk.red(`  ❌ Failed to repair ${issue.file}: ${error}`));
      }
    }

    if (result.repaired.length > 0) {
      console.log(chalk.green(`\n✅ Repaired ${result.repaired.length} issue(s)\n`));
    }

    if (result.failed.length > 0) {
      console.log(chalk.yellow(`\n⚠️  Failed to repair ${result.failed.length} issue(s)\n`));
    }

  } catch (error) {
    console.log(chalk.red(`\n❌ Error during repair: ${error}\n`));
  }

  return result;
}
