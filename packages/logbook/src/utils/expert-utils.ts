/**
 * Expert contributor utility functions
 */

import path from 'path';
import { readJson, writeJson, fileExists } from './file-utils';
import { setGitUserName, setGitUserEmail, getGitUserEmail } from './git-utils';
import type { ExpertContributor, ExpertRegistryResult } from '../types';

const EXPERT_REGISTRY_PATH = 'assets/config/experts-registry.json';

/**
 * Get expert registry path
 */
export function getExpertRegistryPath(): string {
  const packageRoot = path.resolve(__dirname, '../..');
  return path.join(packageRoot, EXPERT_REGISTRY_PATH);
}

/**
 * Load expert registry
 */
export async function loadExpertRegistry(): Promise<ExpertContributor[]> {
  const registryPath = getExpertRegistryPath();
  
  if (!(await fileExists(registryPath))) {
    return [];
  }

  try {
    const data = await readJson<{ experts: ExpertContributor[] }>(registryPath);
    return data.experts || [];
  } catch {
    return [];
  }
}

/**
 * Save expert registry
 */
export async function saveExpertRegistry(experts: ExpertContributor[]): Promise<void> {
  const registryPath = getExpertRegistryPath();
  await writeJson(registryPath, { experts });
}

/**
 * Find expert by email
 */
export async function findExpertByEmail(email: string): Promise<ExpertContributor | null> {
  const experts = await loadExpertRegistry();
  return experts.find((e) => e.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Find expert by GitHub username
 */
export async function findExpertByGitHub(githubUsername: string): Promise<ExpertContributor | null> {
  const experts = await loadExpertRegistry();
  return experts.find(
    (e) => e.githubUsername.toLowerCase() === githubUsername.toLowerCase()
  ) || null;
}

/**
 * Register expert contributor
 */
export async function registerExpert(expert: ExpertContributor): Promise<ExpertRegistryResult> {
  try {
    const experts = await loadExpertRegistry();
    
    // Check if expert already registered
    const existing = experts.find((e) => e.email.toLowerCase() === expert.email.toLowerCase());
    
    if (existing) {
      // Update existing expert
      const index = experts.indexOf(existing);
      experts[index] = { ...existing, ...expert };
    } else {
      // Add new expert
      experts.push(expert);
    }

    await saveExpertRegistry(experts);

    return {
      registered: true,
      expert
    };
  } catch (error) {
    return {
      registered: false,
      error: error instanceof Error ? error.message : 'Failed to register expert'
    };
  }
}

/**
 * List all registered experts
 */
export async function listExperts(): Promise<ExpertContributor[]> {
  return loadExpertRegistry();
}

/**
 * Set up git author identity for expert
 */
export async function setupExpertGitIdentity(
  projectRoot: string,
  email: string
): Promise<{ success: boolean; expert?: ExpertContributor; error?: string }> {
  try {
    const expert = await findExpertByEmail(email);
    
    if (!expert) {
      return {
        success: false,
        error: `No expert found with email: ${email}`
      };
    }

    // Set git user name and email
    await setGitUserName(projectRoot, expert.name);
    await setGitUserEmail(projectRoot, expert.email);

    return {
      success: true,
      expert
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set up git identity'
    };
  }
}

/**
 * Auto-detect expert from current git config
 */
export async function detectCurrentExpert(
  projectRoot: string
): Promise<ExpertContributor | null> {
  try {
    const email = await getGitUserEmail(projectRoot);
    
    if (!email) {
      return null;
    }

    return findExpertByEmail(email);
  } catch {
    return null;
  }
}
