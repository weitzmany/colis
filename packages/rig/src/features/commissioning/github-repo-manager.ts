/**
 * GitHub Repository Manager
 * 
 * Orchestrates GitHub repository creation and configuration using logbook utilities.
 * Handles git initialization, GitHub repo creation, remote configuration, and initial push.
 */

import * as path from 'path';
import * as fs from 'fs-extra';
import chalk from 'chalk';
import { execSync } from 'child_process';
import {
  ensureGhInstalled,
  ensureGhAuth,
  checkGhAuth,
  createGhRepo,
  hasRemote,
  addRemote,
  initGitRepo,
  getRemoteUrl,
  isGitRepo,
  getCurrentBranch,
} from '@colis/logbook/utils';
import inquirer from 'inquirer';

/**
 * Options for ensuring GitHub repository
 */
export interface EnsureGitHubRepoOptions {
  /** Repository visibility (default: 'private') */
  visibility?: 'public' | 'private';
  /** Skip if gh CLI is not available (default: false) */
  skipIfNoGh?: boolean;
  /** Repository description */
  description?: string;
  /** Perform initial push if conditions match (default: true) */
  pushInitial?: boolean;
  /** Interactive mode - allows prompts (default: auto-detect from TTY) */
  interactive?: boolean;
  /** Dry run - preview actions without executing */
  dryRun?: boolean;
}

/**
 * Result of ensuring GitHub repository
 */
export interface EnsureGitHubRepoResult {
  /** Whether a new repo was created */
  repoCreated: boolean;
  /** Whether repo already existed */
  repoExists: boolean;
  /** Whether remote was added */
  remoteAdded: boolean;
  /** Whether initial commit was pushed */
  pushed?: boolean;
  /** GitHub repository URL */
  repoUrl?: string;
  /** Reason for skipping (if skipped) */
  skippedReason?: string;
  /** Warnings encountered */
  warnings: string[];
}

/**
 * Security baseline for .gitignore
 */
const SECURITY_GITIGNORE_BASELINE = [
  'node_modules',
  '.env',
  '.env.*',
  '.env*',
  'dist',
  'build',
  'coverage',
  '*.log',
  '.DS_Store',
  '*.pem',
  '*.key',
  'secrets/',
  '.credentials',
  'credentials.json',
  '*.pfx',
];

/**
 * Sensitive file patterns for pre-push check
 */
const SENSITIVE_FILE_PATTERNS = [
  /\.env$/i,
  /\.env\./i,
  /\.env[^/]*$/i,
  /\.pem$/i,
  /\.key$/i,
  /secrets\//i,
  /\.credentials/i,
  /credentials\.json$/i,
  /\.pfx$/i,
];

/**
 * Ensure minimal .gitignore exists with security baseline
 * 
 * @param projectPath - Project directory path
 * @returns Whether .gitignore was created or updated
 */
async function ensureMinimalGitignore(projectPath: string): Promise<boolean> {
  const gitignorePath = path.join(projectPath, '.gitignore');
  let existingContent = '';
  let updated = false;

  // Read existing .gitignore if present
  if (await fs.pathExists(gitignorePath)) {
    existingContent = await fs.readFile(gitignorePath, 'utf-8');
  }

  const existingLines = existingContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));

  // Append missing entries (never overwrite)
  const newEntries: string[] = [];
  for (const entry of SECURITY_GITIGNORE_BASELINE) {
    if (!existingLines.includes(entry)) {
      newEntries.push(entry);
    }
  }

  if (newEntries.length > 0) {
    const appendContent = existingContent
      ? `\n${newEntries.join('\n')}\n`
      : `${newEntries.join('\n')}\n`;
    await fs.appendFile(gitignorePath, appendContent);
    updated = true;
  }

  return updated;
}

/**
 * Check if staged files contain sensitive patterns
 * 
 * @param projectPath - Project directory path
 * @returns Array of sensitive files found
 */
async function checkStagedForSensitiveFiles(projectPath: string): Promise<string[]> {
  try {
    const staged = execSync('git diff --cached --name-only', {
      cwd: projectPath,
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();

    if (!staged) {
      return [];
    }

    const stagedFiles = staged.split('\n');
    const sensitiveFiles: string[] = [];

    for (const file of stagedFiles) {
      for (const pattern of SENSITIVE_FILE_PATTERNS) {
        if (pattern.test(file)) {
          sensitiveFiles.push(file);
          break;
        }
      }
    }

    return sensitiveFiles;
  } catch {
    return [];
  }
}

/**
 * Detect if current directory is inside a parent git repository
 * 
 * @param projectPath - Current project path
 * @returns Parent repo path if nested, null otherwise
 */
async function detectParentRepo(projectPath: string): Promise<string | null> {
  try {
    const topLevel = execSync('git rev-parse --show-toplevel', {
      cwd: projectPath,
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();

    // If toplevel is not the current project, we're in a nested repo
    if (path.resolve(topLevel) !== path.resolve(projectPath)) {
      return topLevel;
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Add subdirectory to parent .gitignore
 * 
 * @param parentPath - Parent repository path
 * @param subdirPath - Subdirectory path (relative to parent)
 */
async function addToParentGitignore(parentPath: string, subdirPath: string): Promise<void> {
  // Validate path safety (no absolute paths, no ..)
  if (path.isAbsolute(subdirPath) || subdirPath.includes('..')) {
    throw new Error(`Unsafe path for .gitignore: ${subdirPath}`);
  }

  const gitignorePath = path.join(parentPath, '.gitignore');
  const entry = subdirPath.endsWith('/') ? subdirPath : `${subdirPath}/`;

  // Read existing or create new
  let content = '';
  if (await fs.pathExists(gitignorePath)) {
    content = await fs.readFile(gitignorePath, 'utf-8');
  }

  // Check if entry already exists
  const lines = content.split('\n').map((line) => line.trim());
  if (lines.includes(entry.trim())) {
    return; // Already present
  }

  // Append entry
  const appendContent = content ? `\n${entry}\n` : `${entry}\n`;
  await fs.appendFile(gitignorePath, appendContent);
}

/**
 * Sanitize error messages to avoid leaking sensitive information
 * 
 * @param error - Error message or object
 * @returns Sanitized error message
 */
function sanitizeError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  
  // Truncate very long messages
  if (message.length > 200) {
    return message.substring(0, 200) + '...';
  }
  
  return message;
}

/**
 * Ensure GitHub repository exists for the project
 * 
 * This function orchestrates the complete GitHub repository setup:
 * 1. Ensures git repository is initialized
 * 2. Ensures gh CLI is installed
 * 3. Ensures gh authentication (interactive or check-only based on mode)
 * 4. Creates GitHub repository if needed
 * 5. Adds remote if not present
 * 6. Ensures .gitignore security baseline
 * 7. Performs initial commit and push if conditions match
 * 
 * @param projectPath - Project directory path
 * @param projectName - Project name for repository
 * @param options - Configuration options
 * @returns Result with repository status and any warnings
 */
export async function ensureGitHubRepo(
  projectPath: string,
  projectName: string,
  options: EnsureGitHubRepoOptions = {}
): Promise<EnsureGitHubRepoResult> {
  const result: EnsureGitHubRepoResult = {
    repoCreated: false,
    repoExists: false,
    remoteAdded: false,
    pushed: false,
    warnings: [],
  };

  const {
    visibility = 'private',
    skipIfNoGh = false,
    description,
    pushInitial = true,
    interactive = process.stdout.isTTY && !process.env.CI,
    dryRun = false,
  } = options;

  try {
    // Detect non-interactive/CI environment early
    const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true' || !interactive;

    if (isCI && !interactive) {
      result.skippedReason = 'CI/non-interactive mode';
      if (!dryRun) {
        console.log(chalk.dim('  ℹ GitHub sync skipped (CI/non-interactive mode)'));
      }
      return result;
    }

    if (dryRun) {
      console.log(chalk.blue('\n🔍 [Dry Run] GitHub Repository Setup Preview:'));
    }

    // Step 1: Ensure git repository exists
    if (!(await isGitRepo(projectPath))) {
      if (dryRun) {
        console.log(chalk.cyan('  → Would initialize git repository'));
      } else {
        await initGitRepo(projectPath);
        console.log(chalk.gray('  ✓ Git repository initialized'));
      }
    }

    // Step 2: Check for nested repository
    const parentRepo = await detectParentRepo(projectPath);
    if (parentRepo && interactive && !dryRun) {
      console.log(
        chalk.yellow(
          `\n⚠️  This directory is inside another git repository:\n  Parent: ${parentRepo}\n  Current: ${projectPath}`
        )
      );

      const { createNested } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'createNested',
          message: 'Create a separate GitHub repository for this subdirectory?',
          default: false,
        },
      ]);

      if (!createNested) {
        result.skippedReason = 'User declined nested repository creation';
        console.log(chalk.gray('  ⊘ GitHub repository creation skipped'));
        return result;
      }

      // Add subdirectory to parent .gitignore
      try {
        const relativePath = path.relative(parentRepo, projectPath);
        await addToParentGitignore(parentRepo, relativePath);
        console.log(chalk.green(`  ✓ Added ${relativePath}/ to parent .gitignore`));
      } catch (error) {
        result.warnings.push(`Could not update parent .gitignore: ${sanitizeError(error)}`);
        console.log(chalk.yellow(`  ⚠ Could not update parent .gitignore: ${sanitizeError(error)}`));
      }
    }

    // Step 3: Ensure gh CLI is installed
    const ghInstallResult = await ensureGhInstalled();

    if (!ghInstallResult.installed) {
      if (skipIfNoGh) {
        result.skippedReason = 'gh CLI not installed';
        if (!dryRun) {
          console.log(chalk.yellow('  ⚠ gh CLI not installed - skipping GitHub setup'));
          console.log(chalk.dim('    💡 Install: brew install gh && gh auth login'));
        }
        return result;
      } else {
        result.warnings.push(ghInstallResult.error || 'gh CLI not installed');
        if (!dryRun) {
          console.log(chalk.yellow(`  ⚠ ${ghInstallResult.error || 'gh CLI not installed'}`));
          console.log(chalk.dim('    💡 Install: brew install gh && gh auth login'));
        }
        return result;
      }
    }

    if (dryRun) {
      console.log(chalk.cyan('  ✓ gh CLI is installed'));
    }

    // Step 4: Check gh authentication
    let authResult;
    if (interactive) {
      // First check current auth status
      authResult = await checkGhAuth();
      
      console.log(chalk.dim(`  [DEBUG] Interactive: ${interactive}, Authenticated: ${authResult.authenticated}, DryRun: ${dryRun}`));
      
      if (!authResult.authenticated && !dryRun) {
        // Offer to authenticate
        console.log(chalk.yellow('\n  ⚠ Not authenticated to GitHub'));
        
        const { shouldAuth } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'shouldAuth',
            message: 'Would you like to authenticate with GitHub now?',
            default: true,
          },
        ]);

        if (shouldAuth) {
          console.log(chalk.blue('  Opening browser for authentication...'));
          authResult = await ensureGhAuth();
          
          if (authResult.authenticated) {
            console.log(chalk.green(`  ✓ Authenticated as ${authResult.username}`));
          } else {
            result.warnings.push('Authentication failed');
            console.log(chalk.yellow('  ⚠ Authentication failed'));
            console.log(chalk.dim('    💡 Try manually: gh auth login'));
            return result;
          }
        } else {
          result.skippedReason = 'User declined GitHub authentication';
          console.log(chalk.gray('  ⊘ GitHub setup skipped'));
          return result;
        }
      } else if (!authResult.authenticated && dryRun) {
        console.log(chalk.yellow('  ⚠ Not authenticated (would prompt in real run)'));
        return result;
      }
    } else {
      authResult = await checkGhAuth();
    }

    if (!authResult.authenticated) {
      result.warnings.push(authResult.error || 'Not authenticated to GitHub');
      if (!dryRun) {
        console.log(chalk.yellow(`  ⚠ ${authResult.error || 'Not authenticated'}`));
        console.log(chalk.dim('    💡 Authenticate: gh auth login'));
      }
      return result;
    }

    if (dryRun) {
      console.log(chalk.cyan(`  ✓ Authenticated as ${authResult.username}`));
    }

    // Step 5: Check if remote already exists
    if (await hasRemote(projectPath, 'origin')) {
      const existingUrl = await getRemoteUrl(projectPath, 'origin');
      result.repoUrl = existingUrl || undefined;
      result.skippedReason = 'Remote already configured';
      if (!dryRun) {
        console.log(chalk.gray(`  ✓ Remote already configured: ${existingUrl}`));
      }
      return result;
    }

    // Step 6: Create GitHub repository
    if (dryRun) {
      console.log(chalk.cyan(`  → Would create GitHub repository: ${projectName} (${visibility})`));
    } else {
      console.log(chalk.blue('  Creating GitHub repository...'));
    }

    const createResult = await createGhRepo(projectName, {
      description,
      visibility,
    });

    if (!createResult.created && !createResult.alreadyExists) {
      const errorMsg = sanitizeError(createResult.error || 'Repository creation failed');
      result.warnings.push(errorMsg);
      if (!dryRun) {
        console.log(chalk.yellow(`  ⚠ ${errorMsg}`));
      }
      return result;
    }

    result.repoCreated = createResult.created || false;
    result.repoExists = createResult.alreadyExists || false;
    result.repoUrl = createResult.repoUrl;

    if (!dryRun) {
      if (createResult.created) {
        console.log(chalk.green(`  ✓ Created repository: ${createResult.repoUrl}`));
      } else {
        console.log(chalk.gray(`  ✓ Repository already exists: ${createResult.repoUrl}`));
      }
    }

    // Step 7: Add remote
    if (createResult.repoUrl) {
      if (dryRun) {
        console.log(chalk.cyan(`  → Would add remote origin: ${createResult.repoUrl}`));
      } else {
        await addRemote(projectPath, 'origin', createResult.repoUrl);
        result.remoteAdded = true;
        console.log(chalk.green('  ✓ Added remote origin'));
      }
    }

    // Step 8: Initial commit and push (if conditions match)
    if (pushInitial && !dryRun) {
      try {
        // Check if we should push
        const hasCommits = await hasAnyCommits(projectPath);
        const isDirty = await isWorkingTreeDirty(projectPath);

        if (!hasCommits || isDirty) {
          // Ensure .gitignore security baseline
          console.log(chalk.blue('  Ensuring .gitignore security baseline...'));
          await ensureMinimalGitignore(projectPath);

          // Stage all files
          execSync('git add .', { cwd: projectPath, stdio: 'pipe' });

          // Pre-push security check
          const sensitiveFiles = await checkStagedForSensitiveFiles(projectPath);
          if (sensitiveFiles.length > 0) {
            result.warnings.push(
              `Sensitive files detected, aborting auto-push: ${sensitiveFiles.join(', ')}`
            );
            console.log(chalk.red('  ✗ Sensitive files detected in staging area:'));
            sensitiveFiles.forEach((file) => console.log(chalk.red(`    - ${file}`)));
            console.log(
              chalk.yellow(
                '    💡 Review and commit manually, or add these files to .gitignore'
              )
            );

            // Unstage to prevent accidental commit
            execSync('git reset', { cwd: projectPath, stdio: 'pipe' });
            return result;
          }

          // Check if there's anything to commit
          const statusResult = execSync('git status --porcelain', {
            cwd: projectPath,
            encoding: 'utf-8',
            stdio: 'pipe',
          }).trim();

          if (!statusResult) {
            console.log(chalk.gray('  ⊘ No changes to commit'));
            return result;
          }

          // Create initial commit
          execSync('git commit -m "chore: initial commit"', {
            cwd: projectPath,
            stdio: 'pipe',
          });

          console.log(chalk.green('  ✓ Created initial commit'));

          // Get current branch (fallback to main, then master)
          let branch = await getCurrentBranch(projectPath);
          if (!branch) {
            branch = 'main';
          }

          // Push to remote
          try {
            execSync(`git push -u origin ${branch}`, {
              cwd: projectPath,
              stdio: 'pipe',
            });

            result.pushed = true;
            console.log(chalk.green(`  ✓ Pushed to origin ${branch}`));
          } catch (pushError) {
            // Push failed - warn but don't fail initialization
            const pushErrorMsg = sanitizeError(pushError);
            result.warnings.push(`Push failed: ${pushErrorMsg}`);
            console.log(chalk.yellow(`  ⚠ Push failed: ${pushErrorMsg}`));
            console.log(
              chalk.dim(`    💡 You can push manually: git push -u origin ${branch}`)
            );
            console.log(chalk.dim('    Or retry: npx @colis/rig github-sync'));
          }
        }
      } catch (error) {
        const errorMsg = sanitizeError(error);
        result.warnings.push(`Initial commit/push error: ${errorMsg}`);
        console.log(chalk.yellow(`  ⚠ Initial commit/push error: ${errorMsg}`));
      }
    } else if (pushInitial && dryRun) {
      console.log(chalk.cyan('  → Would check for commits/changes and push if needed'));
    }

    return result;
  } catch (error) {
    const errorMsg = sanitizeError(error);
    result.warnings.push(`GitHub setup error: ${errorMsg}`);
    if (!dryRun) {
      console.log(chalk.yellow(`  ⚠ GitHub setup error: ${errorMsg}`));
    }
    return result;
  }
}

/**
 * Check if repository has any commits
 * 
 * @param projectPath - Project directory path
 * @returns Whether repository has commits
 */
async function hasAnyCommits(projectPath: string): Promise<boolean> {
  try {
    execSync('git rev-parse HEAD', {
      cwd: projectPath,
      stdio: 'pipe',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if working tree has uncommitted changes
 * 
 * @param projectPath - Project directory path
 * @returns Whether working tree is dirty
 */
async function isWorkingTreeDirty(projectPath: string): Promise<boolean> {
  try {
    const status = execSync('git status --porcelain', {
      cwd: projectPath,
      encoding: 'utf-8',
      stdio: 'pipe',
    }).trim();

    return status.length > 0;
  } catch {
    return false;
  }
}
