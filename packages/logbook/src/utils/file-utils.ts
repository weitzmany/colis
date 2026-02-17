/**
 * File utility functions for git-workflow package
 */

import fs from 'fs-extra';
import path from 'path';

/**
 * Get the assets directory path
 */
export function getAssetsDir(): string {
  // In development, assets are in the same repo
  // In published package, assets are at package root
  const packageRoot = path.resolve(__dirname, '../..');
  return path.join(packageRoot, 'assets');
}

/**
 * Copy a file with optional permission preservation
 */
export async function copyFile(
  src: string,
  dest: string,
  options?: { preservePermissions?: boolean }
): Promise<void> {
  await fs.ensureDir(path.dirname(dest));
  await fs.copy(src, dest, {
    overwrite: true,
    preserveTimestamps: true
  });

  if (options?.preservePermissions) {
    const stats = await fs.stat(src);
    await fs.chmod(dest, stats.mode);
  }
}

/**
 * Make a file executable
 */
export async function makeExecutable(filePath: string): Promise<void> {
  const stats = await fs.stat(filePath);
  await fs.chmod(filePath, stats.mode | 0o111); // Add execute permission
}

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read JSON file
 */
export async function readJson<T>(filePath: string): Promise<T> {
  return fs.readJson(filePath);
}

/**
 * Write JSON file
 */
export async function writeJson(filePath: string, data: any): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeJson(filePath, data, { spaces: 2 });
}

/**
 * Create a backup of a file
 */
export async function createBackup(filePath: string): Promise<string> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `${filePath}.backup-${timestamp}`;
  await fs.copy(filePath, backupPath);
  return backupPath;
}

/**
 * Get all files in a directory recursively
 */
export async function getFilesRecursive(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return getFilesRecursive(fullPath);
      }
      return [fullPath];
    })
  );
  return files.flat();
}
