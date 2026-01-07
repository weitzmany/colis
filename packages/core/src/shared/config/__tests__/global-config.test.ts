/**
 * Global Config Manager Tests
 */

import { GlobalConfigManager } from '../global-config';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

describe('GlobalConfigManager', () => {
  let configPath: string;
  let configManager: GlobalConfigManager;

  beforeEach(() => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'port-manager-test-'));
    configPath = path.join(tmpDir, 'config.json');
    configManager = new GlobalConfigManager(configPath);
  });

  afterEach(async () => {
    if (configPath && (await fs.pathExists(configPath))) {
      await fs.remove(path.dirname(configPath));
    }
  });

  it('should load default config if file does not exist', async () => {
    const config = await configManager.load();
    expect(config.database).toBeDefined();
    expect(config.portRanges).toBeDefined();
  });

  it('should save and load config', async () => {
    const testConfig = {
      database: {
        type: 'sqlite' as const,
        sqlite: { path: '/tmp/test.db' },
      },
    };
    await configManager.save(testConfig);
    const loaded = await configManager.load();
    expect(loaded.database?.sqlite?.path).toBe('/tmp/test.db');
  });

  it('should update config', async () => {
    await configManager.load();
    await configManager.update({
      portRanges: {
        node: { start: 3000, end: 3099 },
      },
    });
    const config = await configManager.load();
    expect(config.portRanges?.node).toEqual({ start: 3000, end: 3099 });
  });
});

