/**
 * Issue workflow utility functions
 */

import path from 'path';
import { readJson, fileExists } from './file-utils';
import { openIssue, listIssues, viewIssue, getIssueComments } from './gh-utils';
import type { IssueCreateOptions, IssueListOptions, GitHubIssue } from '../types';

const REPO_MAP_PATH = 'assets/config/gh-repo-map.json';

interface RepoMapping {
  packagesRepo: string;
  projects: Record<string, string>; // projectName -> repo slug
}

/**
 * Get repo mapping config path
 */
export function getRepoMapPath(): string {
  const packageRoot = path.resolve(__dirname, '../..');
  return path.join(packageRoot, REPO_MAP_PATH);
}

/**
 * Load repo mapping
 */
export async function loadRepoMapping(): Promise<RepoMapping | null> {
  const mapPath = getRepoMapPath();
  
  if (!(await fileExists(mapPath))) {
    return null;
  }

  try {
    return await readJson<RepoMapping>(mapPath);
  } catch {
    return null;
  }
}

/**
 * Get packages repo slug
 */
export async function getPackagesRepo(): Promise<string | null> {
  const mapping = await loadRepoMapping();
  return mapping?.packagesRepo || null;
}

/**
 * Create issue in packages repo
 */
export async function createPackagesIssue(
  options: IssueCreateOptions
): Promise<{ success: boolean; issueUrl?: string; error?: string }> {
  const packagesRepo = await getPackagesRepo();
  
  if (!packagesRepo) {
    return {
      success: false,
      error: 'Packages repo not configured. Run initialization first.'
    };
  }

  // Add project label if provided
  const labels = options.labels || [];
  if (options.projectName) {
    labels.push(`project:${options.projectName}`);
  }

  return openIssue(packagesRepo, {
    ...options,
    labels
  });
}

/**
 * List issues in packages repo
 */
export async function listPackagesIssues(
  options?: IssueListOptions
): Promise<{ success: boolean; issues?: GitHubIssue[]; error?: string }> {
  const packagesRepo = await getPackagesRepo();
  
  if (!packagesRepo) {
    return {
      success: false,
      error: 'Packages repo not configured. Run initialization first.'
    };
  }

  return listIssues(packagesRepo, options);
}

/**
 * View issue in packages repo
 */
export async function viewPackagesIssue(
  issueNumber: number
): Promise<{ success: boolean; issue?: GitHubIssue; error?: string }> {
  const packagesRepo = await getPackagesRepo();
  
  if (!packagesRepo) {
    return {
      success: false,
      error: 'Packages repo not configured. Run initialization first.'
    };
  }

  return viewIssue(packagesRepo, issueNumber);
}

/**
 * Get maintainer responses for an issue
 */
export async function getMaintainerResponses(
  issueNumber: number
): Promise<{ success: boolean; responses?: Array<{ author: string; body: string; createdAt: string }>; error?: string }> {
  const packagesRepo = await getPackagesRepo();
  
  if (!packagesRepo) {
    return {
      success: false,
      error: 'Packages repo not configured. Run initialization first.'
    };
  }

  const commentsResult = await getIssueComments(packagesRepo, issueNumber);
  
  if (!commentsResult.success) {
    return {
      success: false,
      error: commentsResult.error
    };
  }

  // Filter for maintainer responses (authors who are not the issue creator)
  // In a real implementation, you'd check against a maintainer list
  return {
    success: true,
    responses: commentsResult.comments
  };
}
