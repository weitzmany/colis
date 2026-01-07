/**
 * SQLite Repository Tests
 */

import { SQLiteRepository } from '../sqlite';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';

describe('SQLiteRepository', () => {
  let dbPath: string;
  let repository: SQLiteRepository;

  beforeEach(async () => {
    const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'port-manager-test-'));
    dbPath = path.join(tmpDir, 'test.db');
    repository = new SQLiteRepository({ path: dbPath });
  });

  afterEach(async () => {
    if (repository && repository.isConnected()) {
      await repository.disconnect();
    }
    if (dbPath && (await fs.pathExists(dbPath))) {
      await fs.remove(path.dirname(dbPath));
    }
  });

  it('should connect to database', async () => {
    await repository.connect();
    expect(repository.isConnected()).toBe(true);
  });

  it('should disconnect from database', async () => {
    await repository.connect();
    await repository.disconnect();
    expect(repository.isConnected()).toBe(false);
  });

  it('should execute queries', async () => {
    await repository.connect();
    await repository.execute('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');
    await repository.execute('INSERT INTO test (name) VALUES (?)', ['test']);
    const results = await repository.query<{ id: number; name: string }>('SELECT * FROM test');
    expect(results).toHaveLength(1);
    expect(results[0].name).toBe('test');
  });

  it('should handle transactions', async () => {
    await repository.connect();
    await repository.execute('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');

    await repository.transaction(async (tx) => {
      await tx.execute('INSERT INTO test (name) VALUES (?)', ['test1']);
      await tx.execute('INSERT INTO test (name) VALUES (?)', ['test2']);
    });

    const results = await repository.query<{ id: number; name: string }>('SELECT * FROM test');
    expect(results).toHaveLength(2);
  });

  it('should rollback transactions on error', async () => {
    await repository.connect();
    await repository.execute('CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT)');

    try {
      await repository.transaction(async (tx) => {
        await tx.execute('INSERT INTO test (name) VALUES (?)', ['test1']);
        throw new Error('Test error');
      });
    } catch (error) {
      // Expected error
    }

    const results = await repository.query<{ id: number; name: string }>('SELECT * FROM test');
    expect(results).toHaveLength(0);
  });
});




