/**
 * Conflict Detector / Validator
 * 
 * Detects port conflicts and validates port assignments.
 */

import { PortRepository } from '../database/port-repository';
import { ConflictReport, ValidationResult } from '../types';
import * as net from 'net';
import * as fs from 'fs-extra';
import * as path from 'path';

export class ConflictDetector {
  constructor(private repository: PortRepository) {}

  /**
   * Validate port assignment and detect conflicts
   */
  async validate(
    projectName: string,
    projectPath: string,
    _appType: string,
    port: number
  ): Promise<ValidationResult> {
    const conflicts: ConflictReport[] = [];
    const errors: string[] = [];

    // Check if port is already assigned to another project
    const existing = await this.repository.getByPort(port);
    if (existing && existing.projectName !== projectName) {
      conflicts.push({
        port,
        conflictType: 'assigned',
        details: `Port ${port} is already assigned to project "${existing.projectName}"`,
        severity: 'error',
        resolution: `Release port from "${existing.projectName}" or choose a different port`,
      });
    }

    // Check if port is in use on the system
    const inUse = await this.checkPortInUse(port);
    if (inUse) {
      conflicts.push({
        port,
        conflictType: 'in_use',
        details: `Port ${port} is currently in use by another process`,
        severity: 'error',
        resolution: 'Stop the process using this port or choose a different port',
      });
    }

    // Check for configuration file mismatches
    const configMismatch = await this.checkConfigMismatch(projectPath, port);
    if (configMismatch) {
      conflicts.push({
        port,
        conflictType: 'mismatch',
        details: configMismatch,
        severity: 'warning',
        resolution: 'Update configuration files to match assigned port',
      });
    }

    return {
      valid: conflicts.length === 0,
      conflicts,
      errors,
    };
  }

  /**
   * Check if port is in use on the system
   */
  private async checkPortInUse(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.listen(port, () => {
        server.once('close', () => resolve(false));
        server.close();
      });
      server.on('error', () => resolve(true));
    });
  }

  /**
   * Check for configuration file mismatches
   */
  private async checkConfigMismatch(projectPath: string, expectedPort: number): Promise<string | null> {
    try {
      // Check .env files
      const envFiles = ['.env', '.env.local', '.env.development'];
      for (const envFile of envFiles) {
        const envPath = path.join(projectPath, envFile);
        if (await fs.pathExists(envPath)) {
          const content = await fs.readFile(envPath, 'utf-8');
          const portMatch = content.match(/PORT\s*=\s*(\d+)/i);
          if (portMatch && parseInt(portMatch[1]) !== expectedPort) {
            return `Port mismatch in ${envFile}: expected ${expectedPort}, found ${portMatch[1]}`;
          }
        }
      }

      // Check package.json scripts
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const scripts = packageJson.scripts || {};
        for (const [scriptName, script] of Object.entries(scripts)) {
          if (typeof script === 'string') {
            const portMatch = script.match(/--port\s+(\d+)/);
            if (portMatch && parseInt(portMatch[1]) !== expectedPort) {
              return `Port mismatch in package.json script "${scriptName}": expected ${expectedPort}, found ${portMatch[1]}`;
            }
          }
        }
      }
    } catch (error) {
      // Ignore errors during validation
    }

    return null;
  }

  /**
   * Check all ports for conflicts
   */
  async validateAll(): Promise<ValidationResult> {
    const assignments = await this.repository.listPorts({ status: 'active' });
    const allConflicts: ConflictReport[] = [];
    const errors: string[] = [];

    for (const assignment of assignments) {
      const validation = await this.validate(
        assignment.projectName,
        assignment.projectPath,
        assignment.appType,
        assignment.port
      );
      allConflicts.push(...validation.conflicts);
      errors.push(...validation.errors);
    }

    return {
      valid: allConflicts.length === 0,
      conflicts: allConflicts,
      errors,
    };
  }
}

