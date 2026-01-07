/**
 * React Framework Handler
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { FrameworkHandler } from './interfaces';
import { ConfigurationResult } from '../types';

export class ReactHandler implements FrameworkHandler {
  getName(): string {
    return 'react';
  }

  async detect(projectPath: string): Promise<boolean> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      return (
        packageJson.dependencies?.react !== undefined ||
        packageJson.devDependencies?.react !== undefined
      );
    }
    return false;
  }

  async updateConfig(projectPath: string, port: number): Promise<ConfigurationResult> {
    const result: ConfigurationResult = {
      filesUpdated: [],
      filesCreated: [],
      errors: [],
    };

    const envPath = path.join(projectPath, '.env');
    const envLocalPath = path.join(projectPath, '.env.local');

    for (const envFile of [envLocalPath, envPath]) {
      try {
        let content = '';
        if (await fs.pathExists(envFile)) {
          content = await fs.readFile(envFile, 'utf-8');
        }

        if (content.includes('PORT=')) {
          content = content.replace(/PORT\s*=\s*\d+/i, `PORT=${port}`);
        } else {
          content += `\nPORT=${port}\n`;
        }

        await fs.writeFile(envFile, content, 'utf-8');
        if (await fs.pathExists(envFile)) {
          result.filesUpdated.push(path.basename(envFile));
        } else {
          result.filesCreated.push(path.basename(envFile));
        }
      } catch (error) {
        result.errors.push(`Failed to update ${envFile}: ${error}`);
      }
    }

    return result;
  }

  getDefaultPort(): number {
    return 3000;
  }

  async validateConfig(projectPath: string, port: number): Promise<boolean> {
    const envPath = path.join(projectPath, '.env');
    const envLocalPath = path.join(projectPath, '.env.local');

    for (const envFile of [envLocalPath, envPath]) {
      if (await fs.pathExists(envFile)) {
        const content = await fs.readFile(envFile, 'utf-8');
        const portMatch = content.match(/PORT\s*=\s*(\d+)/i);
        if (portMatch && parseInt(portMatch[1]) === port) {
          return true;
        }
      }
    }
    return false;
  }
}




