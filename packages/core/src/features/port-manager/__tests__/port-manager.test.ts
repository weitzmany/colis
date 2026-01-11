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

  it('should detect conflicts for a project path', async () => {
    const projectPath = '/tmp/test-project';
    await portManager.allocate('test-project', projectPath, 'node');
    const conflicts = await portManager.detectConflicts(projectPath);
    expect(Array.isArray(conflicts)).toBe(true);
  });

  it('should reserve a port', async () => {
    await portManager.reservePort(9999, 'Test reservation', 'Reserved for testing');
    const reserved = await portManager.getByPort(9999);
    expect(reserved).not.toBeNull();
    expect(reserved?.status).toBe('reserved');
  });

  it('should throw PortConflictError when reserving an already assigned port', async () => {
    const port = await portManager.allocate('test-project', '/tmp/test', 'node');
    await expect(
      portManager.reservePort(port, 'Test reservation')
    ).rejects.toThrow(/already assigned/);
  });

  it('should throw PortRangeExhaustedError when port range is exhausted', async () => {
    // Allocate all ports in a small range
    const portManagerWithSmallRange = new PortManager({
      database: {
        type: 'sqlite',
        sqlite: { path: dbPath },
      },
      portRanges: {
        node: { start: 3001, end: 3002 }, // Very small range
      },
    });
    await portManagerWithSmallRange.connect();

    await portManagerWithSmallRange.allocate('project1', '/tmp/project1', 'node');
    await portManagerWithSmallRange.allocate('project2', '/tmp/project2', 'node');
    
    await expect(
      portManagerWithSmallRange.allocate('project3', '/tmp/project3', 'node')
    ).rejects.toThrow(/No available ports in range/);

    await portManagerWithSmallRange.disconnect();
  });

  it('should throw PortAssignmentNotFoundError when getting non-existent assignment', async () => {
    await expect(
      portManager.configure('non-existent', 'node', 3000)
    ).rejects.toThrow(/Port assignment not found/);
  });

  it('should validate port assignments', async () => {
    await portManager.allocate('test-project', '/tmp/test', 'node');
    const validation = await portManager.validate('test-project');
    expect(validation).toHaveProperty('valid');
    expect(validation).toHaveProperty('conflicts');
    expect(validation).toHaveProperty('errors');
  });

  it('should validate all port assignments', async () => {
    await portManager.allocate('project1', '/tmp/project1', 'node');
    await portManager.allocate('project2', '/tmp/project2', 'nextjs');
    const validation = await portManager.validate();
    expect(validation).toHaveProperty('valid');
    expect(validation).toHaveProperty('conflicts');
  });
});




