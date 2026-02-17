/**
 * Git Workflow Verification
 */

import path from 'path';
import chalk from 'chalk';
import type { VerifyOptions, HealthStatus } from '../types';
import {
  fileExists,
  isGitRepo,
  getGitConfig,
  hasRemote,
  isGhInstalled,
  checkGhAuth,
  detectCurrentExpert
} from '../utils';

/**
 * Verify git workflow health
 */
export async function verify(options: VerifyOptions): Promise<HealthStatus> {
  const { projectRoot } = options;
  
  const status: HealthStatus = {
    status: 'healthy',
    issues: [],
    recommendations: [],
    ghInstalled: false,
    ghAuthenticated: false,
    remoteRepoExists: false,
    expertMapped: false
  };

  try {
    console.log(chalk.blue('\n🔍 Verifying Git Workflow...\n'));

    // Check 1: Git repository initialized
    if (!(await isGitRepo(projectRoot))) {
      status.issues.push({
        type: 'missing',
        file: '.git',
        message: 'Git repository not initialized',
        severity: 'error'
      });
      console.log(chalk.red('  ❌ Git repository not initialized'));
    } else {
      console.log(chalk.green('  ✓ Git repository initialized'));
    }

    // Check 2: Git hooks
    const expectedHooks = ['pre-commit', 'commit-msg', 'pre-push', 'post-checkout'];
    const hooksDir = path.join(projectRoot, '.git', 'hooks');

    for (const hook of expectedHooks) {
      const hookPath = path.join(hooksDir, hook);
      const exists = await fileExists(hookPath);

      if (!exists) {
        status.issues.push({
          type: 'missing',
          file: `.git/hooks/${hook}`,
          message: `Git hook missing: ${hook}`,
          severity: 'warning'
        });
        console.log(chalk.yellow(`  ⚠️  Git hook missing: ${hook}`));
      } else {
        console.log(chalk.green(`  ✓ Git hook exists: ${hook}`));
      }
    }

    // Check 3: Commit template
    const commitTemplate = await getGitConfig(projectRoot, 'commit.template');
    if (!commitTemplate) {
      status.issues.push({
        type: 'misconfigured',
        file: 'git config',
        message: 'Commit template not configured',
        severity: 'info'
      });
      console.log(chalk.yellow('  ⚠️  Commit template not configured'));
    } else {
      const templatePath = path.join(projectRoot, commitTemplate);
      if (await fileExists(templatePath)) {
        console.log(chalk.green(`  ✓ Commit template configured: ${commitTemplate}`));
      } else {
        status.issues.push({
          type: 'broken',
          file: commitTemplate,
          message: 'Commit template file not found',
          severity: 'warning'
        });
        console.log(chalk.yellow(`  ⚠️  Commit template file not found: ${commitTemplate}`));
      }
    }

    // Check 4: .gitignore and .gitattributes
    const gitignorePath = path.join(projectRoot, '.gitignore');
    if (!(await fileExists(gitignorePath))) {
      status.issues.push({
        type: 'missing',
        file: '.gitignore',
        message: '.gitignore file missing',
        severity: 'warning'
      });
      console.log(chalk.yellow('  ⚠️  .gitignore file missing'));
    } else {
      console.log(chalk.green('  ✓ .gitignore exists'));
    }

    const gitattributesPath = path.join(projectRoot, '.gitattributes');
    if (!(await fileExists(gitattributesPath))) {
      status.issues.push({
        type: 'missing',
        file: '.gitattributes',
        message: '.gitattributes file missing',
        severity: 'info'
      });
      console.log(chalk.yellow('  ⚠️  .gitattributes file missing'));
    } else {
      console.log(chalk.green('  ✓ .gitattributes exists'));
    }

    // Check 5: GitHub CLI
    status.ghInstalled = await isGhInstalled();
    if (!status.ghInstalled) {
      status.issues.push({
        type: 'missing',
        file: 'gh',
        message: 'GitHub CLI (gh) not installed',
        severity: 'warning'
      });
      console.log(chalk.yellow('  ⚠️  GitHub CLI not installed'));
    } else {
      console.log(chalk.green('  ✓ GitHub CLI installed'));

      // Check gh authentication
      const authResult = await checkGhAuth();
      status.ghAuthenticated = authResult.authenticated;

      if (!authResult.authenticated) {
        status.issues.push({
          type: 'unauthenticated',
          file: 'gh',
          message: 'GitHub CLI not authenticated',
          severity: 'error'
        });
        console.log(chalk.red('  ❌ GitHub CLI not authenticated'));
        status.recommendations.push('Run: gh auth login');
      } else {
        console.log(chalk.green(`  ✓ Authenticated as ${authResult.username}`));
      }
    }

    // Check 6: Remote repository
    status.remoteRepoExists = await hasRemote(projectRoot, 'origin');
    if (!status.remoteRepoExists) {
      status.issues.push({
        type: 'missing',
        file: 'git remote',
        message: 'No remote repository configured',
        severity: 'info'
      });
      console.log(chalk.yellow('  ⚠️  No remote repository configured'));
      status.recommendations.push('Configure remote: git remote add origin <url>');
    } else {
      console.log(chalk.green('  ✓ Remote repository configured'));
    }

    // Check 7: Expert contributor mapping
    const expert = await detectCurrentExpert(projectRoot);
    status.expertMapped = expert !== null;

    if (!expert) {
      status.issues.push({
        type: 'misconfigured',
        file: 'expert registry',
        message: 'Current git user not in expert registry',
        severity: 'info'
      });
      console.log(chalk.yellow('  ⚠️  Current git user not in expert registry'));
      status.recommendations.push('Add expert to registry: assets/config/experts-registry.json');
    } else {
      console.log(chalk.green(`  ✓ Expert mapped: ${expert.name} (${expert.githubUsername})`));
    }

    // Determine overall health status
    const errorCount = status.issues.filter(i => i.severity === 'error').length;
    const warningCount = status.issues.filter(i => i.severity === 'warning').length;

    if (errorCount > 0) {
      status.status = 'errors';
      console.log(chalk.red(`\n❌ Git workflow has ${errorCount} error(s) and ${warningCount} warning(s)\n`));
    } else if (warningCount > 0) {
      status.status = 'warnings';
      console.log(chalk.yellow(`\n⚠️  Git workflow has ${warningCount} warning(s)\n`));
    } else {
      console.log(chalk.green('\n✅ Git workflow is healthy!\n'));
    }

  } catch (error) {
    status.issues.push({
      type: 'broken',
      file: 'unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      severity: 'error'
    });
    status.status = 'errors';
    console.log(chalk.red(`\n❌ Error during verification: ${error}\n`));
  }

  return status;
}
