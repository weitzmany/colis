/**
 * GitHub CLI (gh) utility functions
 */

import { execa } from 'execa';
import os from 'os';
import type {
  GhInstallResult,
  GhAuthResult,
  GhRepoCreateResult,
  IssueCreateOptions,
  IssueListOptions,
  GitHubIssue
} from '../types';

/**
 * Check if gh CLI is installed
 */
export async function isGhInstalled(): Promise<boolean> {
  try {
    await execa('gh', ['--version']);
    return true;
  } catch {
    return false;
  }
}

/**
 * Install gh CLI based on platform
 */
export async function installGh(): Promise<GhInstallResult> {
  const platform = os.platform();

  try {
    if (platform === 'darwin') {
      // macOS - use Homebrew
      await execa('brew', ['install', 'gh']);
      return { installed: true, alreadyInstalled: false, method: 'brew' };
    } else if (platform === 'linux') {
      // Linux - try apt (Debian/Ubuntu)
      try {
        await execa('sudo', ['apt', 'install', '-y', 'gh']);
        return { installed: true, alreadyInstalled: false, method: 'apt' };
      } catch {
        return {
          installed: false,
          alreadyInstalled: false,
          error: 'Automatic installation failed. Please install gh manually: https://cli.github.com/'
        };
      }
    } else if (platform === 'win32') {
      // Windows - try winget first, then choco
      try {
        await execa('winget', ['install', '--id', 'GitHub.cli']);
        return { installed: true, alreadyInstalled: false, method: 'winget' };
      } catch {
        try {
          await execa('choco', ['install', 'gh', '-y']);
          return { installed: true, alreadyInstalled: false, method: 'choco' };
        } catch {
          return {
            installed: false,
            alreadyInstalled: false,
            error: 'Automatic installation failed. Please install gh manually: https://cli.github.com/'
          };
        }
      }
    }

    return {
      installed: false,
      alreadyInstalled: false,
      error: `Unsupported platform: ${platform}`
    };
  } catch (error) {
    return {
      installed: false,
      alreadyInstalled: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Ensure gh is installed (install if missing)
 */
export async function ensureGhInstalled(): Promise<GhInstallResult> {
  const installed = await isGhInstalled();
  
  if (installed) {
    return { installed: true, alreadyInstalled: true };
  }

  return installGh();
}

/**
 * Check gh authentication status
 */
export async function checkGhAuth(): Promise<GhAuthResult> {
  try {
    const { stdout } = await execa('gh', ['auth', 'status']);
    
    // Parse username from output
    const match = stdout.match(/Logged in to github\.com as ([^\s]+)/);
    const username = match ? match[1] : undefined;

    return {
      authenticated: true,
      username
    };
  } catch (error) {
    return {
      authenticated: false,
      error: 'Not authenticated. Run: gh auth login'
    };
  }
}

/**
 * Login to GitHub via gh CLI
 */
export async function ghAuthLogin(): Promise<GhAuthResult> {
  try {
    await execa('gh', ['auth', 'login', '--web'], { stdio: 'inherit' });
    return checkGhAuth();
  } catch (error) {
    return {
      authenticated: false,
      error: error instanceof Error ? error.message : 'Authentication failed'
    };
  }
}

/**
 * Ensure gh is authenticated (prompt login if needed)
 */
export async function ensureGhAuth(): Promise<GhAuthResult> {
  const authStatus = await checkGhAuth();
  
  if (authStatus.authenticated) {
    return authStatus;
  }

  // Prompt for authentication
  return ghAuthLogin();
}

/**
 * Check if a GitHub repository exists
 */
export async function checkRepoExists(repoSlug: string): Promise<boolean> {
  try {
    await execa('gh', ['repo', 'view', repoSlug]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Set repository visibility (public/private)
 */
export async function setRepoVisibility(
  repoSlug: string,
  visibility: 'public' | 'private'
): Promise<{ success: boolean; error?: string }> {
  try {
    await execa('gh', ['repo', 'edit', repoSlug, `--visibility=${visibility}`]);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set visibility'
    };
  }
}

/**
 * Create a GitHub repository
 */
export async function createGhRepo(
  repoName: string,
  options?: {
    description?: string;
    visibility?: 'public' | 'private';
    homepage?: string;
  }
): Promise<GhRepoCreateResult> {
  try {
    // Check if repo already exists
    const authStatus = await checkGhAuth();
    if (!authStatus.authenticated || !authStatus.username) {
      return {
        created: false,
        alreadyExists: false,
        error: 'Not authenticated to GitHub'
      };
    }

    const repoSlug = `${authStatus.username}/${repoName}`;
    const exists = await checkRepoExists(repoSlug);

    if (exists) {
      // Get repo URL
      const { stdout } = await execa('gh', ['repo', 'view', repoSlug, '--json', 'url', '-q', '.url']);
      const repoUrl = stdout.trim();
      
      // Ensure repo is private (even if it already existed)
      const desiredVisibility = options?.visibility || 'private';
      await setRepoVisibility(repoSlug, desiredVisibility);
      
      return {
        created: false,
        alreadyExists: true,
        repoUrl
      };
    }

    // Create repo
    const args = ['repo', 'create', repoSlug];
    
    if (options?.visibility) {
      args.push(`--${options.visibility}`);
    } else {
      args.push('--private'); // Default to private
    }

    if (options?.description) {
      args.push('--description', options.description);
    }

    if (options?.homepage) {
      args.push('--homepage', options.homepage);
    }

    const { stdout } = await execa('gh', args);
    
    // Get repo URL
    const urlMatch = stdout.match(/https:\/\/github\.com\/[^\s]+/);
    const repoUrl = urlMatch ? urlMatch[0] : `https://github.com/${repoSlug}`;

    return {
      created: true,
      alreadyExists: false,
      repoUrl
    };
  } catch (error) {
    return {
      created: false,
      alreadyExists: false,
      error: error instanceof Error ? error.message : 'Repository creation failed'
    };
  }
}

/**
 * Open an issue in a repository
 */
export async function openIssue(
  repoSlug: string,
  options: IssueCreateOptions
): Promise<{ success: boolean; issueUrl?: string; error?: string }> {
  try {
    const args = ['issue', 'create', '--repo', repoSlug, '--title', options.title, '--body', options.body];

    if (options.labels && options.labels.length > 0) {
      args.push('--label', options.labels.join(','));
    }

    const { stdout } = await execa('gh', args);
    
    // Extract issue URL from output
    const urlMatch = stdout.match(/(https:\/\/github\.com\/[^\s]+)/);
    const issueUrl = urlMatch ? urlMatch[1] : undefined;

    return {
      success: true,
      issueUrl
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create issue'
    };
  }
}

/**
 * List issues in a repository
 */
export async function listIssues(
  repoSlug: string,
  options?: IssueListOptions
): Promise<{ success: boolean; issues?: GitHubIssue[]; error?: string }> {
  try {
    const args = [
      'issue',
      'list',
      '--repo',
      repoSlug,
      '--json',
      'number,title,state,url,body,labels,createdAt,updatedAt,comments'
    ];

    if (options?.state) {
      args.push('--state', options.state);
    }

    if (options?.limit) {
      args.push('--limit', options.limit.toString());
    }

    // Add label filter if projectName provided
    if (options?.projectName) {
      args.push('--label', `project:${options.projectName}`);
    }

    const { stdout } = await execa('gh', args);
    const issues: GitHubIssue[] = JSON.parse(stdout);

    return {
      success: true,
      issues
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list issues'
    };
  }
}

/**
 * View an issue
 */
export async function viewIssue(
  repoSlug: string,
  issueNumber: number
): Promise<{ success: boolean; issue?: GitHubIssue; error?: string }> {
  try {
    const { stdout } = await execa('gh', [
      'issue',
      'view',
      issueNumber.toString(),
      '--repo',
      repoSlug,
      '--json',
      'number,title,state,url,body,labels,createdAt,updatedAt,comments'
    ]);

    const issue: GitHubIssue = JSON.parse(stdout);

    return {
      success: true,
      issue
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to view issue'
    };
  }
}

/**
 * Get issue comments
 */
export async function getIssueComments(
  repoSlug: string,
  issueNumber: number
): Promise<{ success: boolean; comments?: Array<{ author: string; body: string; createdAt: string }>; error?: string }> {
  try {
    const { stdout } = await execa('gh', [
      'issue',
      'view',
      issueNumber.toString(),
      '--repo',
      repoSlug,
      '--json',
      'comments',
      '-q',
      '.comments[] | {author: .author.login, body: .body, createdAt: .createdAt}'
    ]);

    const comments = stdout.trim() ? JSON.parse(`[${stdout.split('\n').join(',')}]`) : [];

    return {
      success: true,
      comments
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get comments'
    };
  }
}
