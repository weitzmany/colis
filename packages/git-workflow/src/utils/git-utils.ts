/**
 * Git utility functions
 */

import { simpleGit, SimpleGit, SimpleGitOptions } from 'simple-git';
import path from 'path';
import { fileExists } from './file-utils';

/**
 * Get simple-git instance for a project
 */
export function getGit(projectRoot: string): SimpleGit {
  const options: Partial<SimpleGitOptions> = {
    baseDir: projectRoot,
    binary: 'git',
    maxConcurrentProcesses: 6,
  };
  return simpleGit(options);
}

/**
 * Check if git is installed
 */
export async function isGitInstalled(): Promise<boolean> {
  try {
    const git = simpleGit();
    await git.version();
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if directory is a git repository
 */
export async function isGitRepo(projectRoot: string): Promise<boolean> {
  const gitDir = path.join(projectRoot, '.git');
  return fileExists(gitDir);
}

/**
 * Initialize git repository
 */
export async function initGitRepo(projectRoot: string): Promise<void> {
  const git = getGit(projectRoot);
  await git.init();
}

/**
 * Get current branch name
 */
export async function getCurrentBranch(projectRoot: string): Promise<string | null> {
  try {
    const git = getGit(projectRoot);
    const branch = await git.branch();
    return branch.current;
  } catch {
    return null;
  }
}

/**
 * Get git config value
 */
export async function getGitConfig(
  projectRoot: string,
  key: string
): Promise<string | null> {
  try {
    const git = getGit(projectRoot);
    const value = await git.getConfig(key);
    return value.value || null;
  } catch {
    return null;
  }
}

/**
 * Set git config value
 */
export async function setGitConfig(
  projectRoot: string,
  key: string,
  value: string,
  scope: 'local' | 'global' = 'local'
): Promise<void> {
  const git = getGit(projectRoot);
  await git.addConfig(key, value, false, scope);
}

/**
 * Get remote URL
 */
export async function getRemoteUrl(
  projectRoot: string,
  remoteName: string = 'origin'
): Promise<string | null> {
  try {
    const git = getGit(projectRoot);
    const remotes = await git.getRemotes(true);
    const remote = remotes.find((r) => r.name === remoteName);
    return remote?.refs?.fetch || null;
  } catch {
    return null;
  }
}

/**
 * Add remote
 */
export async function addRemote(
  projectRoot: string,
  remoteName: string,
  url: string
): Promise<void> {
  const git = getGit(projectRoot);
  await git.addRemote(remoteName, url);
}

/**
 * Check if remote exists
 */
export async function hasRemote(
  projectRoot: string,
  remoteName: string = 'origin'
): Promise<boolean> {
  try {
    const git = getGit(projectRoot);
    const remotes = await git.getRemotes();
    return remotes.some((r) => r.name === remoteName);
  } catch {
    return false;
  }
}

/**
 * Get git user name
 */
export async function getGitUserName(projectRoot: string): Promise<string | null> {
  return getGitConfig(projectRoot, 'user.name');
}

/**
 * Get git user email
 */
export async function getGitUserEmail(projectRoot: string): Promise<string | null> {
  return getGitConfig(projectRoot, 'user.email');
}

/**
 * Set git user name
 */
export async function setGitUserName(
  projectRoot: string,
  name: string,
  scope: 'local' | 'global' = 'local'
): Promise<void> {
  await setGitConfig(projectRoot, 'user.name', name, scope);
}

/**
 * Set git user email
 */
export async function setGitUserEmail(
  projectRoot: string,
  email: string,
  scope: 'local' | 'global' = 'local'
): Promise<void> {
  await setGitConfig(projectRoot, 'user.email', email, scope);
}

/**
 * Find all nested .git directories (not in project root)
 */
export async function findNestedGitDirs(projectRoot: string): Promise<string[]> {
  const fs = await import('fs-extra');
  const path = await import('path');
  const nestedGitDirs: string[] = [];
  
  async function scanDirectory(dir: string): Promise<void> {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        // Skip node_modules and other common directories
        if (entry.name === 'node_modules' || 
            entry.name === '.npm' || 
            entry.name === '.yarn' ||
            entry.name === 'dist' ||
            entry.name === 'build') {
          continue;
        }
        
        if (entry.isDirectory()) {
          if (entry.name === '.git' && fullPath !== path.join(projectRoot, '.git')) {
            // Found a nested .git directory
            nestedGitDirs.push(fullPath);
          } else if (entry.name !== '.git') {
            // Recursively scan subdirectories (but not inside .git dirs)
            await scanDirectory(fullPath);
          }
        }
      }
    } catch (error) {
      // Ignore permission errors and continue
    }
  }
  
  await scanDirectory(projectRoot);
  return nestedGitDirs;
}

/**
 * Remove nested .git directories to enforce monorepo structure
 */
export async function enforceMonorepoStructure(projectRoot: string): Promise<{
  removed: string[];
  errors: string[];
}> {
  const fs = await import('fs-extra');
  const removed: string[] = [];
  const errors: string[] = [];
  
  const nestedGitDirs = await findNestedGitDirs(projectRoot);
  
  for (const gitDir of nestedGitDirs) {
    try {
      await fs.remove(gitDir);
      removed.push(gitDir);
    } catch (error) {
      errors.push(`Failed to remove ${gitDir}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  return { removed, errors };
}
