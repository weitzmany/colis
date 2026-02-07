/**
 * Git Workflow Initialization
 */

import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import type { InitOptions, InitResult } from '../types';
import {
  getAssetsDir,
  copyFile,
  makeExecutable,
  fileExists,
  isGitInstalled,
  isGitRepo,
  initGitRepo,
  setGitConfig,
  addRemote,
  hasRemote,
  getRemoteUrl,
  getGitUserEmail,
  ensureGhInstalled,
  ensureGhAuth,
  createGhRepo,
  findExpertByEmail,
  enforceMonorepoStructure
} from '../utils';

/**
 * Initialize git workflow in a project
 */
export async function init(options: InitOptions): Promise<InitResult> {
  const { projectRoot, projectType, options: opts = {} } = options;
  
  const result: InitResult = {
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
    console.log(chalk.blue('\n🔧 Initializing Git Workflow...\n'));

    // Step 1: Check git installation
    if (!(await isGitInstalled())) {
      result.errors.push('Git is not installed');
      console.log(chalk.red('❌ Git is not installed. Please install git first.'));
      return result;
    }

    // Step 1.5: Enforce monorepo structure (remove nested .git directories)
    console.log(chalk.blue('\n🔍 Enforcing monorepo structure...\n'));
    const monorepoResult = await enforceMonorepoStructure(projectRoot);
    
    if (monorepoResult.removed.length > 0) {
      console.log(chalk.yellow('  → Removed nested .git directories:'));
      for (const dir of monorepoResult.removed) {
        const relativePath = path.relative(projectRoot, dir);
        console.log(chalk.yellow(`    - ${relativePath}`));
        result.installed.push(`removed nested git: ${relativePath}`);
      }
    } else {
      console.log(chalk.gray('  ✓ No nested .git directories found'));
    }
    
    if (monorepoResult.errors.length > 0) {
      for (const error of monorepoResult.errors) {
        result.errors.push(error);
        console.log(chalk.red(`  ❌ ${error}`));
      }
    }

    // Step 2: Initialize git repository if needed
    if (!(await isGitRepo(projectRoot))) {
      console.log(chalk.yellow('  → Initializing git repository...'));
      await initGitRepo(projectRoot);
      result.installed.push('git repository');
    } else {
      console.log(chalk.gray('  ✓ Git repository already initialized'));
      result.skipped.push('git repository');
    }

    // Step 3: Install git hooks
    const hooksToInstall = opts.hooksEnabled || ['pre-commit', 'commit-msg', 'pre-push', 'post-checkout'];
    const assetsDir = getAssetsDir();
    // Use .githooks directory (matches @colis/rig's post-checkout hook location)
    const hooksDir = path.join(projectRoot, '.githooks');

    await fs.ensureDir(hooksDir);

    for (const hook of hooksToInstall) {
      const src = path.join(assetsDir, 'hooks', hook);
      const dest = path.join(hooksDir, hook);

      // Check if hook already exists (e.g., from @colis/rig)
      if (await fileExists(dest)) {
        result.skipped.push(`git hook: ${hook}`);
        console.log(chalk.gray(`  ✓ Hook already exists: ${hook} (preserving existing)`));
        continue;
      }

      if (await fileExists(src)) {
        await copyFile(src, dest, { preservePermissions: true });
        await makeExecutable(dest);
        result.installed.push(`git hook: ${hook}`);
        console.log(chalk.green(`  ✓ Installed ${hook} hook`));
      } else {
        result.errors.push(`Hook not found: ${hook}`);
        console.log(chalk.yellow(`  ⚠️  Hook not found: ${hook}`));
      }
    }

    // Step 3.5: Configure git to use .githooks directory
    try {
      await setGitConfig(projectRoot, 'core.hooksPath', '.githooks');
      console.log(chalk.green('  ✓ Configured git hooks path'));
    } catch (error) {
      result.errors.push('Failed to configure git hooks path');
      console.log(chalk.yellow('  ⚠️  Failed to configure git hooks path'));
    }

    // Step 4: Install commit template
    if (opts.commitTemplate !== false) {
      const templateSrc = path.join(assetsDir, 'templates', '.gitmessage');
      const templateDest = path.join(projectRoot, '.gitmessage');

      if (await fileExists(templateSrc)) {
        await copyFile(templateSrc, templateDest);
        await setGitConfig(projectRoot, 'commit.template', '.gitmessage');
        result.installed.push('commit template');
        console.log(chalk.green('  ✓ Installed commit message template'));
      }
    }

    // Step 5: Install PR template
    if (opts.prTemplate !== false) {
      const prSrc = path.join(assetsDir, 'templates', 'PULL_REQUEST_TEMPLATE.md');
      const prDest = path.join(projectRoot, '.github', 'PULL_REQUEST_TEMPLATE.md');

      if (await fileExists(prSrc)) {
        await copyFile(prSrc, prDest);
        result.installed.push('PR template');
        console.log(chalk.green('  ✓ Installed PR template'));
      }
    }

    // Step 6: Install issue templates
    if (opts.issueTemplates !== false) {
      const issueTemplatesDir = path.join(assetsDir, 'templates', 'ISSUE_TEMPLATE');
      const issueTemplatesDest = path.join(projectRoot, '.github', 'ISSUE_TEMPLATE');

      if (await fileExists(issueTemplatesDir)) {
        await fs.ensureDir(issueTemplatesDest);
        const templates = await fs.readdir(issueTemplatesDir);
        
        for (const template of templates) {
          const src = path.join(issueTemplatesDir, template);
          const dest = path.join(issueTemplatesDest, template);
          await copyFile(src, dest);
        }
        
        result.installed.push('issue templates');
        console.log(chalk.green('  ✓ Installed issue templates'));
      }
    }

    // Step 7: Install .gitignore
    const gitignoreSrc = path.join(assetsDir, 'config', `.gitignore.${projectType}`);
    const gitignoreFallback = path.join(assetsDir, 'config', '.gitignore.nodejs');
    const gitignoreDest = path.join(projectRoot, '.gitignore');

    let gitignoreSource = gitignoreSrc;
    if (!(await fileExists(gitignoreSrc))) {
      gitignoreSource = gitignoreFallback;
    }

    if (await fileExists(gitignoreSource)) {
      const gitignoreExists = await fileExists(gitignoreDest);
      if (!gitignoreExists) {
        await copyFile(gitignoreSource, gitignoreDest);
        result.installed.push('.gitignore');
        console.log(chalk.green('  ✓ Installed .gitignore'));
      } else {
        result.skipped.push('.gitignore');
        console.log(chalk.gray('  ✓ .gitignore already exists'));
      }
    }

    // Step 8: Install .gitattributes
    const gitattributesSrc = path.join(assetsDir, 'config', '.gitattributes');
    const gitattributesDest = path.join(projectRoot, '.gitattributes');

    if (await fileExists(gitattributesSrc)) {
      const gitattributesExists = await fileExists(gitattributesDest);
      if (!gitattributesExists) {
        await copyFile(gitattributesSrc, gitattributesDest);
        result.installed.push('.gitattributes');
        console.log(chalk.green('  ✓ Installed .gitattributes'));
      } else {
        result.skipped.push('.gitattributes');
        console.log(chalk.gray('  ✓ .gitattributes already exists'));
      }
    }

    // Step 9: Ensure gh CLI is installed
    console.log(chalk.blue('\n🐙 Setting up GitHub CLI...\n'));
    const ghInstallResult = await ensureGhInstalled();
    result.ghInstalled = ghInstallResult.installed;

    if (ghInstallResult.installed) {
      if (ghInstallResult.alreadyInstalled) {
        console.log(chalk.gray('  ✓ GitHub CLI already installed'));
      } else {
        console.log(chalk.green(`  ✓ GitHub CLI installed via ${ghInstallResult.method}`));
      }
    } else {
      result.errors.push(ghInstallResult.error || 'Failed to install gh CLI');
      console.log(chalk.yellow(`  ⚠️  ${ghInstallResult.error}`));
    }

    // Step 10: Ensure gh authentication
    if (result.ghInstalled) {
      const ghAuthResult = await ensureGhAuth();
      result.ghAuthenticated = ghAuthResult.authenticated;

      if (ghAuthResult.authenticated) {
        console.log(chalk.green(`  ✓ Authenticated as ${ghAuthResult.username}`));
      } else {
        result.errors.push(ghAuthResult.error || 'Not authenticated to GitHub');
        console.log(chalk.yellow(`  ⚠️  ${ghAuthResult.error}`));
      }
    }

    // Step 11: Create remote repository if requested
    if (opts.createRemoteRepo !== false && result.ghInstalled && result.ghAuthenticated) {
      console.log(chalk.blue('\n📦 Setting up remote repository...\n'));
      
      const repoName = opts.remoteRepoName || path.basename(projectRoot);
      const repoVisibility = opts.remoteVisibility || 'private';

      // Check if remote already exists
      const hasOrigin = await hasRemote(projectRoot, 'origin');
      
      if (hasOrigin) {
        const remoteUrl = await getRemoteUrl(projectRoot, 'origin');
        result.skipped.push('remote repository');
        result.remoteRepoUrl = remoteUrl || undefined;
        console.log(chalk.gray(`  ✓ Remote already configured: ${remoteUrl}`));
      } else {
        // Create GitHub repository
        const createResult = await createGhRepo(repoName, {
          visibility: repoVisibility
        });

        if (createResult.created || createResult.alreadyExists) {
          result.remoteRepoCreated = createResult.created;
          result.remoteRepoUrl = createResult.repoUrl;
          
          // Add remote
          if (createResult.repoUrl) {
            await addRemote(projectRoot, 'origin', createResult.repoUrl);
            result.installed.push('remote repository');
            
            if (createResult.created) {
              console.log(chalk.green(`  ✓ Created repository: ${createResult.repoUrl}`));
            } else {
              console.log(chalk.gray(`  ✓ Repository already exists: ${createResult.repoUrl}`));
            }
          }
        } else {
          result.errors.push(createResult.error || 'Failed to create repository');
          console.log(chalk.yellow(`  ⚠️  ${createResult.error}`));
        }
      }
    }

    // Step 12: Setup expert contributor identity
    console.log(chalk.blue('\n👤 Setting up contributor identity...\n'));
    
    // Try to detect expert from git config
    const userEmail = await getGitUserEmail(projectRoot);

    if (userEmail) {
      const expert = await findExpertByEmail(userEmail);
      
      if (expert) {
        result.expertRegistered = true;
        result.expertGitHubUser = expert.githubUsername;
        console.log(chalk.green(`  ✓ Expert identity detected: ${expert.name} (${expert.githubUsername})`));
      } else {
        console.log(chalk.yellow(`  ⚠️  Email ${userEmail} not in expert registry`));
        console.log(chalk.yellow('     Add expert to registry: assets/config/experts-registry.json'));
      }
    } else {
      console.log(chalk.yellow('  ⚠️  No git user.email configured'));
      console.log(chalk.yellow('     Run: git config user.email "your@email.com"'));
    }

    // Success!
    result.success = true;
    console.log(chalk.green('\n✅ Git workflow initialized successfully!\n'));

  } catch (error) {
    result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    console.log(chalk.red(`\n❌ Error during initialization: ${error}\n`));
  }

  return result;
}
