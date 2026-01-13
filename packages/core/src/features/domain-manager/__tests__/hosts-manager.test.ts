/**
 * Hosts Manager Tests
 */

import { HostsManager } from '../hosts-manager.js';
import { HostsFileError } from '../errors.js';
import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';

jest.mock('fs-extra');
jest.mock('child_process');
jest.mock('util');

const execAsync = promisify(exec);

describe('HostsManager', () => {
  let hostsManager: HostsManager;
  let mockHostsPath: string;

  beforeEach(() => {
    jest.clearAllMocks();
    hostsManager = new HostsManager();
    mockHostsPath =
      process.platform === 'win32'
        ? 'C:\\Windows\\System32\\drivers\\etc\\hosts'
        : '/etc/hosts';
  });

  describe('hasEntry', () => {
    it('should return true if domain exists in hosts file', async () => {
      const content = '127.0.0.1\ttest.local\n';
      (fs.readFile as jest.Mock).mockResolvedValue(content);

      const result = await hostsManager.hasEntry('test.local');

      expect(result).toBe(true);
    });

    it('should return false if domain does not exist', async () => {
      const content = '127.0.0.1\tother.local\n';
      (fs.readFile as jest.Mock).mockResolvedValue(content);

      const result = await hostsManager.hasEntry('test.local');

      expect(result).toBe(false);
    });

    it('should ignore comments', async () => {
      const content = '# 127.0.0.1\ttest.local\n';
      (fs.readFile as jest.Mock).mockResolvedValue(content);

      const result = await hostsManager.hasEntry('test.local');

      expect(result).toBe(false);
    });

    it('should return false if read fails', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('Read failed'));

      const result = await hostsManager.hasEntry('test.local');

      expect(result).toBe(false);
    });
  });

  describe('addEntry', () => {
    beforeEach(() => {
      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue('');
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
      (fs.copy as jest.Mock).mockResolvedValue(undefined);
      (execAsync as jest.Mock).mockResolvedValue({ stdout: '', stderr: '' });
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
      (fs.readFile as jest.Mock).mockResolvedValue(
        '127.0.0.1\ttest.local\n'
      );

      await hostsManager.addEntry('test.local');

      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should add entry to hosts file', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('');

      await hostsManager.addEntry('test.local', '127.0.0.1');

      expect(fs.writeFile).toHaveBeenCalled();
      const writtenContent = (fs.writeFile as jest.Mock).mock.calls[0][1];
      expect(writtenContent).toContain('127.0.0.1');
      expect(writtenContent).toContain('test.local');
    });

    it('should create backup before adding entry', async () => {
      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue('');

      await hostsManager.addEntry('test.local');

      if (process.platform === 'win32') {
        expect(fs.copy).toHaveBeenCalled();
      } else {
        expect(execAsync).toHaveBeenCalledWith(
          expect.stringContaining('sudo cp')
        );
      }
    });

    it('should throw HostsFileError if write fails', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('');
      (fs.writeFile as jest.Mock).mockRejectedValue(
        new Error('Permission denied')
      );

      await expect(hostsManager.addEntry('test.local')).rejects.toThrow(
        HostsFileError
      );
    });
  });

  describe('removeEntry', () => {
    beforeEach(() => {
      (fs.pathExists as jest.Mock).mockResolvedValue(true);
      (fs.readFile as jest.Mock).mockResolvedValue(
        '127.0.0.1\ttest.local\n'
      );
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);
      (execAsync as jest.Mock).mockResolvedValue({ stdout: '', stderr: '' });
    });

    it('should validate domain name', async () => {
      await expect(hostsManager.removeEntry('')).rejects.toThrow(
        HostsFileError
      );
    });

    it('should skip if entry does not exist', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue('127.0.0.1\tother.local\n');

      await hostsManager.removeEntry('test.local');

      expect(fs.writeFile).not.toHaveBeenCalled();
    });

    it('should remove entry from hosts file', async () => {
      const content = '127.0.0.1\ttest.local\n127.0.0.1\tother.local\n';
      (fs.readFile as jest.Mock).mockResolvedValue(content);

      await hostsManager.removeEntry('test.local');

      expect(fs.writeFile).toHaveBeenCalled();
      const writtenContent = (fs.writeFile as jest.Mock).mock.calls[0][1];
      expect(writtenContent).not.toContain('test.local');
      expect(writtenContent).toContain('other.local');
    });

    it('should preserve comments and empty lines', async () => {
      const content = '# Comment\n127.0.0.1\ttest.local\n\n';
      (fs.readFile as jest.Mock).mockResolvedValue(content);

      await hostsManager.removeEntry('test.local');

      const writtenContent = (fs.writeFile as jest.Mock).mock.calls[0][1];
      expect(writtenContent).toContain('# Comment');
    });

    it('should throw HostsFileError if read fails', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('Read failed'));

      await expect(hostsManager.removeEntry('test.local')).rejects.toThrow(
        HostsFileError
      );
    });

    it('should throw HostsFileError if write fails', async () => {
      (fs.writeFile as jest.Mock).mockRejectedValue(
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
      (fs.readFile as jest.Mock).mockResolvedValue(content);

      const result = await hostsManager.listEntries();

      expect(result).toEqual(['test1.local', 'test2.local']);
    });

    it('should ignore comments', async () => {
      const content = `# 127.0.0.1\ttest.local
127.0.0.1\ttest.local
`;
      (fs.readFile as jest.Mock).mockResolvedValue(content);

      const result = await hostsManager.listEntries();

      expect(result).toEqual(['test.local']);
    });

    it('should return empty array if read fails', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('Read failed'));

      const result = await hostsManager.listEntries();

      expect(result).toEqual([]);
    });

    it('should handle multiple spaces and tabs', async () => {
      const content = '127.0.0.1   test.local\n127.0.0.1\ttest2.local\n';
      (fs.readFile as jest.Mock).mockResolvedValue(content);

      const result = await hostsManager.listEntries();

      expect(result).toContain('test.local');
      expect(result).toContain('test2.local');
    });
  });
});
