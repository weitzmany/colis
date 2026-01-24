/**
 * Hosts Manager Tests
 */

import { HostsManager } from '../hosts-manager.js';
import { HostsFileError } from '../errors.js';
import * as fs from 'fs-extra';

jest.mock('fs-extra');
jest.mock('child_process');
// Use var for hoisting compatibility with jest.mock factory
var execAsyncMock = jest.fn();
jest.mock('util', () => ({
  promisify: jest.fn(() => execAsyncMock),
}));

// Initialize spies at top level
const pathExistsMock: any = jest.spyOn(fs, 'pathExists').mockImplementation((() => Promise.resolve(false)) as any);
const readFileMock: any = jest.spyOn(fs, 'readFile').mockImplementation((() => Promise.resolve('')) as any);
const writeFileMock: any = jest.spyOn(fs, 'writeFile').mockImplementation((() => Promise.resolve()) as any);
const copyMock: any = jest.spyOn(fs, 'copy').mockImplementation((() => Promise.resolve()) as any);

describe('HostsManager', () => {
  let hostsManager: HostsManager;

  beforeEach(() => {
    jest.clearAllMocks();
    execAsyncMock.mockResolvedValue({ stdout: '', stderr: '' });
    hostsManager = new HostsManager();
  });

  describe('hasEntry', () => {
    it('should return true if domain exists in hosts file', async () => {
      const content = '127.0.0.1\ttest.local\n';
      readFileMock.mockResolvedValue(content);

      const result = await hostsManager.hasEntry('test.local');

      expect(result).toBe(true);
    });

    it('should return false if domain does not exist', async () => {
      const content = '127.0.0.1\tother.local\n';
      readFileMock.mockResolvedValue(content);

      const result = await hostsManager.hasEntry('test.local');

      expect(result).toBe(false);
    });

    it('should ignore comments', async () => {
      const content = '# 127.0.0.1\ttest.local\n';
      readFileMock.mockResolvedValue(content);

      const result = await hostsManager.hasEntry('test.local');

      expect(result).toBe(false);
    });

    it('should return false if read fails', async () => {
      readFileMock.mockRejectedValue(new Error('Read failed'));

      const result = await hostsManager.hasEntry('test.local');

      expect(result).toBe(false);
    });
  });

  describe('addEntry', () => {
    beforeEach(() => {
      pathExistsMock.mockResolvedValue(true);
      readFileMock.mockResolvedValue('');
      writeFileMock.mockResolvedValue(undefined);
      copyMock.mockResolvedValue(undefined);
      execAsyncMock.mockResolvedValue({ stdout: '', stderr: '' });
    });

    it('should validate domain name', async () => {
      await expect(hostsManager.addEntry('')).rejects.toThrow(HostsFileError);
      await expect(
        hostsManager.addEntry(null as any)
      ).rejects.toThrow(HostsFileError);
    });

    it('should validate IP address format', async () => {
      await expect(
        hostsManager.addEntry('test.local', 'invalid-ip')
      ).rejects.toThrow(HostsFileError);

      await expect(
        hostsManager.addEntry('test.local', '256.256.256.256')
      ).rejects.toThrow(HostsFileError);
    });

    it('should skip if entry already exists', async () => {
      readFileMock.mockResolvedValue(
        '127.0.0.1\ttest.local\n'
      );

      await hostsManager.addEntry('test.local');

      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should add entry to hosts file', async () => {
      readFileMock.mockResolvedValue('');

      await hostsManager.addEntry('test.local', '127.0.0.1');

      expect(fs.writeFile).toHaveBeenCalled();
      const writtenContent = writeFileMock.mock.calls[0][1];
      expect(writtenContent).toContain('127.0.0.1');
      expect(writtenContent).toContain('test.local');
    });

    it('should create backup before adding entry', async () => {
      pathExistsMock.mockResolvedValue(true);
      readFileMock.mockResolvedValue('');

      await hostsManager.addEntry('test.local');

      if (process.platform === 'win32') {
        expect(fs.copy).toHaveBeenCalled();
      } else {
        expect(execAsyncMock).toHaveBeenCalledWith(
          expect.stringContaining('sudo cp')
        );
      }
    });

    it('should throw HostsFileError if write fails', async () => {
      readFileMock.mockResolvedValue('');
      writeFileMock.mockRejectedValue(
        new Error('Permission denied')
      );

      await expect(hostsManager.addEntry('test.local')).rejects.toThrow(
        HostsFileError
      );
    });
  });

  describe('removeEntry', () => {
    beforeEach(() => {
      pathExistsMock.mockResolvedValue(true);
      readFileMock.mockResolvedValue(
        '127.0.0.1\ttest.local\n'
      );
      writeFileMock.mockResolvedValue(undefined);
      execAsyncMock.mockResolvedValue({ stdout: '', stderr: '' });
    });

    it('should validate domain name', async () => {
      await expect(hostsManager.removeEntry('')).rejects.toThrow(
        HostsFileError
      );
    });

    it('should skip if entry does not exist', async () => {
      readFileMock.mockResolvedValue('127.0.0.1\tother.local\n');

      await hostsManager.removeEntry('test.local');

      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should remove entry from hosts file', async () => {
      const content = '127.0.0.1\ttest.local\n127.0.0.1\tother.local\n';
      readFileMock.mockResolvedValue(content);

      await hostsManager.removeEntry('test.local');

      expect(fs.writeFile).toHaveBeenCalled();
      const writtenContent = writeFileMock.mock.calls[0][1];
      expect(writtenContent).not.toContain('test.local');
      expect(writtenContent).toContain('other.local');
    });

    it('should preserve comments and empty lines', async () => {
      const content = '# Comment\n127.0.0.1\ttest.local\n\n';
      readFileMock.mockResolvedValue(content);

      await hostsManager.removeEntry('test.local');

      const writtenContent = writeFileMock.mock.calls[0][1];
      expect(writtenContent).toContain('# Comment');
    });

    it('should throw HostsFileError if read fails', async () => {
      readFileMock.mockRejectedValue(new Error('Read failed'));

      await expect(hostsManager.removeEntry('test.local')).rejects.toThrow(
        HostsFileError
      );
    });

    it('should throw HostsFileError if write fails', async () => {
      writeFileMock.mockRejectedValue(
        new Error('Permission denied')
      );

      await expect(hostsManager.removeEntry('test.local')).rejects.toThrow(
        HostsFileError
      );
    });
  });

  describe('listEntries', () => {
    it('should list all .local domains', async () => {
      const content = `127.0.0.1\ttest1.local
127.0.0.1\ttest2.local
127.0.0.1\tother.com
`;
      readFileMock.mockResolvedValue(content);

      const result = await hostsManager.listEntries();

      expect(result).toEqual(['test1.local', 'test2.local']);
    });

    it('should ignore comments', async () => {
      const content = `# 127.0.0.1\ttest.local
127.0.0.1\ttest.local
`;
      readFileMock.mockResolvedValue(content);

      const result = await hostsManager.listEntries();

      expect(result).toEqual(['test.local']);
    });

    it('should return empty array if read fails', async () => {
      readFileMock.mockRejectedValue(new Error('Read failed'));

      const result = await hostsManager.listEntries();

      expect(result).toEqual([]);
    });

    it('should handle multiple spaces and tabs', async () => {
      const content = '127.0.0.1   test.local\n127.0.0.1\ttest2.local\n';
      readFileMock.mockResolvedValue(content);

      const result = await hostsManager.listEntries();

      expect(result).toContain('test.local');
      expect(result).toContain('test2.local');
    });
  });
});
