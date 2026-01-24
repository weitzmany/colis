/**
 * File Synchronization with Hash Comparison
 * 
 * Synchronizes files between source (core package) and target (project) with smart
 * hash comparison to detect changes. Copies new/modified files, and optionally
 * deletes files that no longer exist in source.
 */

import * as fs from 'fs-extra';
import { readdir } from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';

/**
 * Result of file synchronization operation
 */
export interface FileSyncResult {
  /** Whether the operation succeeded */
  success: boolean;
  /** List of files that were copied (new or modified) */
  copied: string[];
  /** List of files that were skipped (identical) */
  skipped: string[];
  /** List of files that were deleted (no longer in source) */
  deleted: string[];
  /** List of error messages if any occurred */
  errors: string[];
  /** Summary statistics */
  stats: {
    total: number;
    copied: number;
    skipped: number;
    deleted: number;
  };
}

/**
 * Options for file synchronization
 */
export interface FileSyncOptions {
  /** If true, overwrite all files regardless of hash. Default: false */
  forceOverwrite?: boolean;
  /** If true, delete files from target that don't exist in source. Default: false */
  deleteOrphaned?: boolean;
  /** File extensions to include (e.g., ['.mdc', '.md']). Default: all files */
  includeExtensions?: string[];
  /** Directories to exclude (relative to source). Default: [] */
  excludeDirs?: string[];
}

/**
 * Calculate MD5 hash of a file
 * 
 * @param filePath - Path to file
 * @returns MD5 hash as hex string
 */
async function getFileHash(filePath: string): Promise<string> {
  const content = await fs.readFile(filePath);
  return crypto.createHash('md5').update(content).digest('hex');
}

/**
 * Recursively get all files in a directory
 * 
 * @param dirPath - Directory path
 * @param baseDir - Base directory for relative paths
 * @param extensions - File extensions to include (optional)
 * @returns Array of relative file paths
 */
async function getAllFiles(
  dirPath: string,
  baseDir: string,
  extensions?: string[]
): Promise<string[]> {
  const files: string[] = [];
  
  if (!(await fs.pathExists(dirPath))) {
    return files;
  }
  
  const entries = await readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Recursively get files from subdirectory
      const subFiles = await getAllFiles(fullPath, baseDir, extensions);
      files.push(...subFiles);
    } else {
      // Check file extension if filter is provided
      if (extensions && extensions.length > 0) {
        const ext = path.extname(entry.name);
        if (!extensions.includes(ext)) {
          continue;
        }
      }
      
      // Add relative path
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }
  
  return files;
}

/**
 * Synchronize files from source to target with hash comparison
 * 
 * This function intelligently syncs files by:
 * 1. Comparing file hashes to detect changes
 * 2. Copying new files
 * 3. Copying modified files (different hash)
 * 4. Skipping identical files
 * 5. Optionally deleting orphaned files (exist in target but not in source)
 * 
 * @param sourceDir - Source directory (e.g., core package rules directory)
 * @param targetDir - Target directory (e.g., project .cursor/rules directory)
 * @param options - Synchronization options
 * @returns Promise resolving to sync result with statistics
 * 
 * @example
 * ```typescript
 * // Sync rules with hash comparison
 * const result = await syncFiles(
 *   '/path/to/core/rules/experts',
 *   '/path/to/project/.cursor/rules/experts',
 *   { deleteOrphaned: true, includeExtensions: ['.mdc'] }
 * );
 * 
 * console.log(`Copied: ${result.stats.copied}`);
 * console.log(`Skipped: ${result.stats.skipped}`);
 * console.log(`Deleted: ${result.stats.deleted}`);
 * ```
 */
export async function syncFiles(
  sourceDir: string,
  targetDir: string,
  options: FileSyncOptions = {}
): Promise<FileSyncResult> {
  const result: FileSyncResult = {
    success: true,
    copied: [],
    skipped: [],
    deleted: [],
    errors: [],
    stats: {
      total: 0,
      copied: 0,
      skipped: 0,
      deleted: 0,
    },
  };
  
  try {
    // Check if source exists
    if (!(await fs.pathExists(sourceDir))) {
      result.errors.push(`Source directory not found: ${sourceDir}`);
      result.success = false;
      return result;
    }
    
    // Ensure target directory exists
    await fs.ensureDir(targetDir);
    
    // Get all files from source
    const sourceFiles = await getAllFiles(
      sourceDir,
      sourceDir,
      options.includeExtensions
    );
    
    result.stats.total = sourceFiles.length;
    
    // Process each source file
    for (const relativeFilePath of sourceFiles) {
      const sourceFile = path.join(sourceDir, relativeFilePath);
      const targetFile = path.join(targetDir, relativeFilePath);
      
      try {
        const targetExists = await fs.pathExists(targetFile);
        
        if (!targetExists) {
          // File doesn't exist in target - copy it
          await fs.ensureDir(path.dirname(targetFile));
          await fs.copy(sourceFile, targetFile);
          result.copied.push(relativeFilePath);
          result.stats.copied++;
        } else if (options.forceOverwrite) {
          // Force overwrite without hash comparison
          await fs.copy(sourceFile, targetFile);
          result.copied.push(relativeFilePath);
          result.stats.copied++;
        } else {
          // File exists - compare hashes
          const sourceHash = await getFileHash(sourceFile);
          const targetHash = await getFileHash(targetFile);
          
          if (sourceHash !== targetHash) {
            // Hashes differ - file has been modified
            await fs.copy(sourceFile, targetFile);
            result.copied.push(relativeFilePath);
            result.stats.copied++;
          } else {
            // Hashes match - skip
            result.skipped.push(relativeFilePath);
            result.stats.skipped++;
          }
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        result.errors.push(`Error syncing ${relativeFilePath}: ${errorMessage}`);
      }
    }
    
    // Handle orphaned files (exist in target but not in source)
    if (options.deleteOrphaned) {
      const targetFiles = await getAllFiles(
        targetDir,
        targetDir,
        options.includeExtensions
      );
      
      for (const relativeFilePath of targetFiles) {
        if (!sourceFiles.includes(relativeFilePath)) {
          // File exists in target but not in source - delete it
          const targetFile = path.join(targetDir, relativeFilePath);
          try {
            await fs.remove(targetFile);
            result.deleted.push(relativeFilePath);
            result.stats.deleted++;
          } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            result.errors.push(`Error deleting ${relativeFilePath}: ${errorMessage}`);
          }
        }
      }
    }
    
    // Set success based on whether there were errors
    result.success = result.errors.length === 0;
    
    return result;
  } catch (error: unknown) {
    result.success = false;
    const errorMessage = error instanceof Error ? error.message : String(error);
    result.errors.push(`Error during file sync: ${errorMessage}`);
    return result;
  }
}

/**
 * Synchronize multiple directory pairs
 * 
 * Convenience function to sync multiple source/target directory pairs in one operation.
 * 
 * @param syncPairs - Array of source/target directory pairs
 * @param options - Synchronization options (applied to all pairs)
 * @returns Combined result from all sync operations
 * 
 * @example
 * ```typescript
 * const result = await syncMultiple([
 *   { source: '/core/rules/experts', target: '/project/.cursor/rules/experts' },
 *   { source: '/core/commands/general', target: '/project/.cursor/commands/general' }
 * ], { deleteOrphaned: true });
 * ```
 */
export async function syncMultiple(
  syncPairs: Array<{ source: string; target: string }>,
  options: FileSyncOptions = {}
): Promise<FileSyncResult> {
  const combinedResult: FileSyncResult = {
    success: true,
    copied: [],
    skipped: [],
    deleted: [],
    errors: [],
    stats: {
      total: 0,
      copied: 0,
      skipped: 0,
      deleted: 0,
    },
  };
  
  for (const { source, target } of syncPairs) {
    const result = await syncFiles(source, target, options);
    
    // Combine results
    combinedResult.copied.push(...result.copied);
    combinedResult.skipped.push(...result.skipped);
    combinedResult.deleted.push(...result.deleted);
    combinedResult.errors.push(...result.errors);
    
    combinedResult.stats.total += result.stats.total;
    combinedResult.stats.copied += result.stats.copied;
    combinedResult.stats.skipped += result.stats.skipped;
    combinedResult.stats.deleted += result.stats.deleted;
    
    if (!result.success) {
      combinedResult.success = false;
    }
  }
  
  return combinedResult;
}
