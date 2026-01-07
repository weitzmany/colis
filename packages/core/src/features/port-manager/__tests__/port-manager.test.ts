/**
 * Port Manager Tests
 */

import { PortManager } from '../port-manager';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

describe('PortManager', () => {
  let dbPath: string;
  let portManager: PortManager;

  beforeEach(async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'port-manager-test-'));
    dbPath = path.join(tmpDir, 'test.db');
    portManager = new PortManager({
      database: {
        type: 'sqlite',
        sqlite: { path: dbPath },
      },
    });
    await portManager.connect();
  });

  afterEach(async () => {
    if (portManager) {
      await portManager.disconnect();
    }
    if (dbPath && (await fs.pathExists(dbPath))) {
      await fs.remove(path.dirname(dbPath));
    }
  });

  it('should allocate a port', async () => {
    const port = await portManager.allocate('test-project', '/tmp/test', 'node');
    expect(port).toBeGreaterThanOrEqual(3000);
    expect(port).toBeLessThanOrEqual(3099);
  });

  it('should get allocated port', async () => {
    const port = await portManager.allocate('test-project', '/tmp/test', 'node');
    const assignment = await portManager.getPort('test-project', 'node');
    expect(assignment).not.toBeNull();
    expect(assignment?.port).toBe(port);
  });

  it('should list port assignments', async () => {
    await portManager.allocate('project1', '/tmp/project1', 'node');
    await portManager.allocate('project2', '/tmp/project2', 'nextjs');
    const assignments = await portManager.listPorts();
    expect(assignments.length).toBeGreaterThanOrEqual(2);
  });

  it('should release a port', async () => {
    await portManager.allocate('test-project', '/tmp/test', 'node');
    await portManager.release('test-project', 'node');
    const assignment = await portManager.getPort('test-project', 'node');
    expect(assignment?.status).toBe('inactive');
  });

  it('should check port availability', async () => {
    const port = await portManager.allocate('test-project', '/tmp/test', 'node');
    const available = await portManager.checkAvailability(port);
    expect(available).toBe(false);
  });
});




