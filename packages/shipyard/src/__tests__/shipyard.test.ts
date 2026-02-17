import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import { Shipyard } from '../index';
import { ensureShipyardScripts } from '../utils/file-utils';
import { __private__ } from '../features/landfall';

describe('Shipyard', () => {
  describe('ensureShipyardScripts', () => {
    it('adds dockside and ci:verify scripts', async () => {
      const testRoot = path.join(os.tmpdir(), `shipyard-script-test-${Date.now()}`);
      await fs.ensureDir(testRoot);
      const input = {
        scripts: {
          lint: 'eslint src',
          test: 'jest',
          build: 'tsc'
        }
      };

      try {
        const result = await ensureShipyardScripts(testRoot, input);
        const scripts = result.packageJson.scripts as Record<string, string>;

        expect(result.changed).toBe(true);
        expect(scripts.dockside).toBe('npm run lint && npm run test && npm run build');
        expect(scripts['ci:verify']).toBe('npm run dockside');
        expect(result.warnings).toHaveLength(0);
      } finally {
        await fs.remove(testRoot);
      }
    });

    it('creates root aggregators from frontend and backend scripts', async () => {
      const testRoot = path.join(os.tmpdir(), `shipyard-aggregator-test-${Date.now()}`);
      await fs.ensureDir(path.join(testRoot, 'frontend'));
      await fs.ensureDir(path.join(testRoot, 'backend'));

      await fs.writeJson(path.join(testRoot, 'frontend', 'package.json'), {
        scripts: {
          lint: 'eslint src',
          test: 'jest',
          build: 'ng build'
        }
      });

      await fs.writeJson(path.join(testRoot, 'backend', 'package.json'), {
        scripts: {
          lint: 'eslint src',
          test: 'jest',
          build: 'tsc'
        }
      });

      const rootPackage = { name: 'sample' };

      try {
        const result = await ensureShipyardScripts(testRoot, rootPackage);
        const scripts = result.packageJson.scripts as Record<string, string>;

        expect(scripts.lint).toBe('npm --prefix frontend run lint && npm --prefix backend run lint');
        expect(scripts.test).toBe('npm --prefix frontend run test && npm --prefix backend run test');
        expect(scripts.build).toBe('npm --prefix frontend run build && npm --prefix backend run build');
        expect(result.warnings).toHaveLength(0);
      } finally {
        await fs.remove(testRoot);
      }
    });

    it('infers composer alias scripts for backend', async () => {
      const testRoot = path.join(os.tmpdir(), `shipyard-composer-alias-test-${Date.now()}`);
      await fs.ensureDir(path.join(testRoot, 'frontend'));
      await fs.ensureDir(path.join(testRoot, 'backend'));

      await fs.writeJson(path.join(testRoot, 'frontend', 'package.json'), {
        scripts: {
          lint: 'eslint src',
          test: 'jest',
          build: 'ng build'
        }
      });

      await fs.writeJson(path.join(testRoot, 'backend', 'composer.json'), {
        scripts: {
          phpcs: 'phpcs src',
          phpunit: 'phpunit'
        }
      });

      try {
        const result = await ensureShipyardScripts(testRoot, { name: 'sample' });
        const scripts = result.packageJson.scripts as Record<string, string>;

        expect(scripts.lint).toBe(
          'npm --prefix frontend run lint && composer --working-dir backend run phpcs'
        );
        expect(scripts.test).toBe(
          'npm --prefix frontend run test && composer --working-dir backend run phpunit'
        );
        expect(scripts.build).toBe(
          'npm --prefix frontend run build && composer --working-dir backend run build'
        );
      } finally {
        await fs.remove(testRoot);
      }
    });

    it('creates missing frontend scripts for angular projects', async () => {
      const testRoot = path.join(os.tmpdir(), `shipyard-angular-defaults-test-${Date.now()}`);
      await fs.ensureDir(path.join(testRoot, 'frontend'));

      await fs.writeJson(path.join(testRoot, 'frontend', 'package.json'), {
        dependencies: {
          '@angular/core': '^17.0.0'
        },
        scripts: {}
      });

      try {
        const result = await ensureShipyardScripts(testRoot, { name: 'sample' });
        const frontendPackage = await fs.readJson(path.join(testRoot, 'frontend', 'package.json'));
        const scripts = result.packageJson.scripts as Record<string, string>;

        expect(frontendPackage.scripts.lint).toBe('ng lint');
        expect(frontendPackage.scripts.test).toBe('ng test --watch=false --browsers=ChromeHeadless');
        expect(frontendPackage.scripts.build).toBe('ng build');
        expect(scripts.lint).toBe('npm --prefix frontend run lint');
        expect(scripts.test).toBe('npm --prefix frontend run test');
        expect(scripts.build).toBe('npm --prefix frontend run build');
      } finally {
        await fs.remove(testRoot);
      }
    });
  });

  describe('landfall workflow rendering', () => {
    it('renders expected AWS placeholders', () => {
      const content = __private__.renderLandfallWorkflow({
        projectRoot: '/tmp/project',
        awsRegion: 'eu-central-1',
        ecsCluster: 'my-cluster',
        ecsService: 'my-service',
        s3Bucket: 'my-bucket',
        cloudFrontDistributionId: 'ABC123',
        force: false
      });

      expect(content).toContain('AWS_REGION: eu-central-1');
      expect(content).toContain('ECS_CLUSTER: my-cluster');
      expect(content).toContain('S3_BUCKET: my-bucket');
      expect(content).toContain('distribution-id "${CLOUDFRONT_DISTRIBUTION_ID}"');
    });
  });

  describe('init', () => {
    it('creates scripts, workflows, and hook files', async () => {
      const testRoot = path.join(os.tmpdir(), `shipyard-test-${Date.now()}`);
      await fs.ensureDir(testRoot);
      await fs.writeJson(path.join(testRoot, 'package.json'), {
        name: 'sample-project',
        scripts: {
          lint: 'echo lint',
          test: 'echo test',
          build: 'echo build'
        }
      });

      try {
        const result = await Shipyard.init({
          projectRoot: testRoot
        });

        expect(result.updatedFiles).toEqual(
          expect.arrayContaining([
            'package.json',
            '.githooks/pre-push',
            '.github/workflows/passage-ci.yml',
            '.github/workflows/landfall-deploy.yml'
          ])
        );

        const updatedPackageJson = await fs.readJson(path.join(testRoot, 'package.json'));
        expect(updatedPackageJson.scripts.dockside).toBeDefined();
      } finally {
        await fs.remove(testRoot);
      }
    });
  });
});
