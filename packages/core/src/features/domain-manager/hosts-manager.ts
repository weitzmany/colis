/**
 * Hosts Manager
 * 
 * Manages /etc/hosts file for local domain resolution.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { HostsFileError } from './errors.js';

const execAsync = promisify(exec);

export class HostsManager {
  private hostsPath: string;

  constructor() {
    // Determine hosts file path based on OS
    if (process.platform === 'win32') {
      this.hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
    } else {
      this.hostsPath = '/etc/hosts';
    }
  }

  /**
   * Check if domain entry exists in hosts file
   */
  async hasEntry(domain: string): Promise<boolean> {
    try {
      const content = await fs.readFile(this.hostsPath, 'utf-8');
      const lines = content.split('\n');
      return lines.some(line => {
        const trimmed = line.trim();
        return trimmed && !trimmed.startsWith('#') && trimmed.includes(domain);
      });
    } catch (error) {
      return false;
    }
  }

  /**
   * Add domain entry to hosts file
   * 
   * @param domain - Domain name to add
   * @param ip - IP address (default: 127.0.0.1)
   * @throws {HostsFileError} If adding entry fails
   */
  async addEntry(domain: string, ip: string = '127.0.0.1'): Promise<void> {
    // Validate inputs
    if (!domain || typeof domain !== 'string') {
      throw new HostsFileError('Domain name is required', 'write', this.hostsPath);
    }

    // Validate IP format
    const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipRegex.test(ip)) {
      throw new HostsFileError(`Invalid IP address: ${ip}`, 'write', this.hostsPath);
    }

    // Check if already exists
    if (await this.hasEntry(domain)) {
      return; // Already exists, skip
    }

    // Create backup
    await this.createBackup();

    // Read current content
    let content = '';
    try {
      content = await fs.readFile(this.hostsPath, 'utf-8');
    } catch (error) {
      // File might not exist or be readable
      const errorMessage = error instanceof Error ? error.message : String(error);
      // If file doesn't exist, that's okay - we'll create it
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) {
        throw new HostsFileError(
          `Failed to read hosts file: ${errorMessage}`,
          'read',
          this.hostsPath
        );
      }
      content = '';
    }

    // Add entry
    const entry = `${ip}\t${domain}`;
    const newContent = content.trim() + (content ? '\n' : '') + entry + '\n';

    // Write to hosts file (requires sudo on Unix systems)
    if (process.platform === 'win32') {
      // Windows: try to write directly (may need admin)
      try {
        await fs.writeFile(this.hostsPath, newContent, 'utf-8');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new HostsFileError(
          `Failed to write to hosts file. Please run as Administrator or add manually:\n${entry}\nError: ${errorMessage}`,
          'write',
          this.hostsPath
        );
      }
    } else {
      // Unix/macOS: use sudo
      try {
        // Write to temp file first
        const tempFile = path.join(os.tmpdir(), `hosts-${Date.now()}.tmp`);
        await fs.writeFile(tempFile, newContent, 'utf-8');
        
        // Copy to hosts file with sudo
        await execAsync(`sudo cp ${tempFile} ${this.hostsPath}`);
        await fs.remove(tempFile);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new HostsFileError(
          `Failed to update hosts file. Please run with sudo or add manually:\n${entry}\nError: ${errorMessage}`,
          'write',
          this.hostsPath
        );
      }
    }
  }

  /**
   * Remove domain entry from hosts file
   * 
   * @param domain - Domain name to remove
   * @throws {HostsFileError} If removing entry fails
   */
  async removeEntry(domain: string): Promise<void> {
    // Validate input
    if (!domain || typeof domain !== 'string') {
      throw new HostsFileError('Domain name is required', 'write', this.hostsPath);
    }

    if (!(await this.hasEntry(domain))) {
      return; // Doesn't exist, skip
    }

    // Create backup
    await this.createBackup();

    // Read current content
    let content: string;
    try {
      content = await fs.readFile(this.hostsPath, 'utf-8');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      throw new HostsFileError(
        `Failed to read hosts file: ${errorMessage}`,
        'read',
        this.hostsPath
      );
    }
    const lines = content.split('\n');

    // Filter out the domain entry
    const filteredLines = lines.filter(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) {
        return true; // Keep comments and empty lines
      }
      return !trimmed.includes(domain);
    });

    const newContent = filteredLines.join('\n') + '\n';

    // Write back
    if (process.platform === 'win32') {
      try {
        await fs.writeFile(this.hostsPath, newContent, 'utf-8');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new HostsFileError(
          `Failed to write to hosts file. Please run as Administrator or remove manually:\n127.0.0.1 ${domain}\nError: ${errorMessage}`,
          'write',
          this.hostsPath
        );
      }
    } else {
      try {
        const tempFile = path.join(os.tmpdir(), `hosts-${Date.now()}.tmp`);
        await fs.writeFile(tempFile, newContent, 'utf-8');
        await execAsync(`sudo cp ${tempFile} ${this.hostsPath}`);
        await fs.remove(tempFile);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new HostsFileError(
          `Failed to update hosts file. Please run with sudo or remove manually:\n127.0.0.1 ${domain}\nError: ${errorMessage}`,
          'write',
          this.hostsPath
        );
      }
    }
  }

  /**
   * List all .local domains in hosts file
   */
  async listEntries(): Promise<string[]> {
    try {
      const content = await fs.readFile(this.hostsPath, 'utf-8');
      const lines = content.split('\n');
      const domains: string[] = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          // Match IP and domain pattern
          const match = trimmed.match(/127\.0\.0\.1\s+(\S+\.local)/);
          if (match && match[1]) {
            domains.push(match[1]);
          }
        }
      }

      return domains;
    } catch (error) {
      return [];
    }
  }

  /**
   * Create backup of hosts file
   */
  private async createBackup(): Promise<void> {
    try {
      const backupPath = `${this.hostsPath}.backup.${Date.now()}`;
      if (await fs.pathExists(this.hostsPath)) {
        if (process.platform === 'win32') {
          await fs.copy(this.hostsPath, backupPath);
        } else {
          await execAsync(`sudo cp ${this.hostsPath} ${backupPath}`);
        }
      }
    } catch (error) {
      // Backup failure is not critical, continue
    }
  }
}




