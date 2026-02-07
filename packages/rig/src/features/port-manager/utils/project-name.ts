/**
 * Project Name Generator
 * 
 * Generates unambiguous project names from file paths.
 * Uses path relative to Documents root to avoid conflicts.
 */

import * as path from 'path';
import * as os from 'os';

export interface ProjectNameConfig {
  rootPath?: string; // Root path for projects (default: ~/Documents)
  projectsSubdir?: string; // Subdirectory for projects (default: none, future: "projects")
}

/**
 * Generate an unambiguous project name from a file path
 */
export function generateProjectName(
  projectPath: string,
  config?: ProjectNameConfig
): string {
  const resolvedPath = path.resolve(projectPath);
  const homeDir = os.homedir();

  // Determine root path
  let rootPath = config?.rootPath || path.join(homeDir, 'Documents');
  if (config?.projectsSubdir) {
    rootPath = path.join(rootPath, config.projectsSubdir);
  }

  const resolvedRoot = path.resolve(rootPath);

  // Check if path is under the root
  if (!resolvedPath.startsWith(resolvedRoot + path.sep) && resolvedPath !== resolvedRoot) {
    // Path is not under Documents, use full path relative to home
    const relativeToHome = path.relative(homeDir, resolvedPath);
    return normalizePathToName(relativeToHome);
  }

  // Get path relative to root
  const relativePath = path.relative(resolvedRoot, resolvedPath);

  // If it's the root itself, use "root" or the last directory name
  if (!relativePath || relativePath === '.' || relativePath === '') {
    return path.basename(resolvedPath);
  }

  // Check if path is directly under Documents/Projects/
  // If so, use just the project name without "Projects-" prefix
  const documentsProjectsPath = path.join(homeDir, 'Documents', 'Projects');
  if (resolvedPath.startsWith(documentsProjectsPath + path.sep)) {
    const relativeToProjects = path.relative(documentsProjectsPath, resolvedPath);
    // If it's a direct child (no more subdirs), use just the name
    if (!relativeToProjects.includes(path.sep)) {
      return relativeToProjects;
    }
  }

  return normalizePathToName(relativePath);
}

/**
 * Normalize a path to a project name
 * Replaces path separators with dashes and removes special characters
 */
function normalizePathToName(pathStr: string): string {
  // Replace path separators with dashes
  let name = pathStr.replace(/[/\\]/g, '-');

  // Remove leading/trailing dashes and dots
  name = name.replace(/^[-.]+|[-.]+$/g, '');

  // Remove multiple consecutive dashes
  name = name.replace(/-+/g, '-');

  return name || 'root';
}

/**
 * Generate project name for a service within a project
 * e.g., "games-frontend" or "games-backend"
 */
export function generateServiceProjectName(
  projectPath: string,
  serviceName: string,
  appType?: string,
  config?: ProjectNameConfig
): string {
  const baseName = generateProjectName(projectPath, config);

  // If service name is already in the path, don't duplicate it
  if (baseName.includes(serviceName)) {
    return baseName;
  }

  // Append service name and optionally app type
  if (appType && appType !== 'node') {
    return `${baseName}-${serviceName}-${appType}`;
  }

  return `${baseName}-${serviceName}`;
}

/**
 * Try to find a project name match from a list of existing assignments
 * Handles backward compatibility with old naming schemes
 */
export function findProjectNameMatch(
  searchName: string,
  existingNames: string[]
): string | null {
  // Exact match
  if (existingNames.includes(searchName)) {
    return searchName;
  }

  // Try matching by basename (for backward compatibility)
  const searchBasename = path.basename(searchName);
  for (const existing of existingNames) {
    if (existing === searchBasename || existing.endsWith(`-${searchBasename}`)) {
      return existing;
    }
  }

  return null;
}




