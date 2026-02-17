/**
 * Git Workflow Package Tests
 */

import { GitWorkflow } from '../index';
import { findNestedGitDirs, enforceMonorepoStructure } from '../utils/git-utils';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

describe('GitWorkflow', () => {
  describe('API Surface', () => {
    it('should export init method', () => {
      expect(GitWorkflow.init).toBeDefined();
      expect(typeof GitWorkflow.init).toBe('function');
    });

    it('should export verify method', () => {
      expect(GitWorkflow.verify).toBeDefined();
      expect(typeof GitWorkflow.verify).toBe('function');
    });

    it('should export mend method', () => {
      expect(GitWorkflow.mend).toBeDefined();
      expect(typeof GitWorkflow.mend).toBe('function');
    });

    it('should export update method', () => {
      expect(GitWorkflow.update).toBeDefined();
      expect(typeof GitWorkflow.update).toBe('function');
    });
  });

  describe('Monorepo Enforcement', () => {
    let testDir: string;

    beforeEach(async () => {
      // Create a temporary test directory
      testDir = path.join(os.tmpdir(), `git-workflow-test-${Date.now()}`);
      await fs.ensureDir(testDir);
    });

    afterEach(async () => {
      // Clean up test directory
      await fs.remove(testDir);
    });

    describe('findNestedGitDirs', () => {
      it('should find nested .git directories', async () => {
        // Create nested .git directories
        const nestedGitPaths = [
          path.join(testDir, 'packages', 'core', '.git'),
          path.join(testDir, 'packages', 'utils', '.git'),
          path.join(testDir, 'apps', 'frontend', '.git')
        ];

        for (const gitPath of nestedGitPaths) {
          await fs.ensureDir(gitPath);
        }

        const found = await findNestedGitDirs(testDir);
        
        expect(found).toHaveLength(3);
        expect(found).toEqual(expect.arrayContaining(nestedGitPaths));
      });

      it('should not include root .git directory', async () => {
        // Create root .git
        const rootGit = path.join(testDir, '.git');
        await fs.ensureDir(rootGit);

        // Create nested .git
        const nestedGit = path.join(testDir, 'packages', 'core', '.git');
        await fs.ensureDir(nestedGit);

        const found = await findNestedGitDirs(testDir);
        
        expect(found).toHaveLength(1);
        expect(found).toContain(nestedGit);
        expect(found).not.toContain(rootGit);
      });

      it('should skip node_modules directories', async () => {
        // Create .git in node_modules (should be skipped)
        const nodeModulesGit = path.join(testDir, 'node_modules', 'some-package', '.git');
        await fs.ensureDir(nodeModulesGit);

        // Create legitimate nested .git
        const packageGit = path.join(testDir, 'packages', 'core', '.git');
        await fs.ensureDir(packageGit);

        const found = await findNestedGitDirs(testDir);
        
        expect(found).toHaveLength(1);
        expect(found).toContain(packageGit);
        expect(found).not.toContain(nodeModulesGit);
      });

      it('should return empty array when no nested .git directories exist', async () => {
        // Create some regular directories
        await fs.ensureDir(path.join(testDir, 'packages', 'core'));
        await fs.ensureDir(path.join(testDir, 'apps', 'frontend'));

        const found = await findNestedGitDirs(testDir);
        
        expect(found).toHaveLength(0);
      });
    });

    describe('enforceMonorepoStructure', () => {
      it('should remove nested .git directories', async () => {
        // Create nested .git directories
        const nestedGitPaths = [
          path.join(testDir, 'packages', 'core', '.git'),
          path.join(testDir, 'packages', 'utils', '.git')
        ];

        for (const gitPath of nestedGitPaths) {
          await fs.ensureDir(gitPath);
          // Add some files to make it realistic
          await fs.writeFile(path.join(gitPath, 'config'), 'test config');
        }

        const result = await enforceMonorepoStructure(testDir);
        
        expect(result.removed).toHaveLength(2);
        expect(result.errors).toHaveLength(0);
        expect(result.removed).toEqual(expect.arrayContaining(nestedGitPaths));

        // Verify directories were actually removed
        for (const gitPath of nestedGitPaths) {
          const exists = await fs.pathExists(gitPath);
          expect(exists).toBe(false);
        }
      });

      it('should not remove root .git directory', async () => {
        // Create root .git
        const rootGit = path.join(testDir, '.git');
        await fs.ensureDir(rootGit);
        await fs.writeFile(path.join(rootGit, 'config'), 'root config');

        // Create nested .git
        const nestedGit = path.join(testDir, 'packages', 'core', '.git');
        await fs.ensureDir(nestedGit);

        const result = await enforceMonorepoStructure(testDir);
        
        expect(result.removed).toHaveLength(1);
        expect(result.removed).toContain(nestedGit);

        // Verify root .git still exists
        const rootExists = await fs.pathExists(rootGit);
        expect(rootExists).toBe(true);

        // Verify nested .git was removed
        const nestedExists = await fs.pathExists(nestedGit);
        expect(nestedExists).toBe(false);
      });

      it('should return empty result when no nested .git directories exist', async () => {
        // Create some regular directories
        await fs.ensureDir(path.join(testDir, 'packages', 'core'));
        await fs.ensureDir(path.join(testDir, 'apps', 'frontend'));

        const result = await enforceMonorepoStructure(testDir);
        
        expect(result.removed).toHaveLength(0);
        expect(result.errors).toHaveLength(0);
      });

      it('should handle removal errors gracefully', async () => {
        // Create a nested .git directory
        const nestedGit = path.join(testDir, 'packages', 'core', '.git');
        await fs.ensureDir(nestedGit);

        // Mock fs.remove to simulate an error
        const originalRemove = fs.remove;
        jest.spyOn(fs, 'remove').mockImplementationOnce(() => Promise.reject<void>(new Error('Permission denied')));

        const result = await enforceMonorepoStructure(testDir);
        
        expect(result.removed).toHaveLength(0);
        expect(result.errors).toHaveLength(1);
        expect(result.errors[0]).toContain('Permission denied');

        // Restore original function
        fs.remove = originalRemove;
      });
    });
  });
});
