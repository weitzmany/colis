/**
 * React Native Framework Handler
 * 
 * Handles React Native project configuration for Port Manager.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { FrameworkHandler } from './interfaces.js';
import { ConfigurationResult } from '../types.js';

export class ReactNativeHandler implements FrameworkHandler {
  getName(): string {
    return 'react-native';
  }

  async detect(projectPath: string): Promise<boolean> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const dependencies = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };
        return (
          dependencies['react-native'] !== undefined ||
          dependencies['@react-native-community/cli'] !== undefined
        );
      } catch {
        return false;
      }
    }
    return false;
  }

  async updateConfig(projectPath: string, port: number): Promise<ConfigurationResult> {
    const result: ConfigurationResult = {
      filesUpdated: [],
      filesCreated: [],
      errors: [],
    };

    // Update metro.config.js for Metro bundler port
    const metroConfigJsPath = path.join(projectPath, 'metro.config.js');
    const metroConfigJsonPath = path.join(projectPath, 'metro.config.json');

    // Try to update metro.config.js
    for (const configPath of [metroConfigJsPath, metroConfigJsonPath]) {
      if (await fs.pathExists(configPath)) {
        try {
          let content = await fs.readFile(configPath, 'utf-8');
          
          // Update port in Metro config
          if (content.includes('port')) {
            content = content.replace(/port\s*:\s*\d+/g, `port: ${port}`);
          } else {
            // Add port configuration
            if (configPath.endsWith('.js')) {
              content = content.replace(
                /module\.exports\s*=\s*\{/,
                `module.exports = {\n  server: {\n    port: ${port},\n  },`
              );
            } else {
              const config = JSON.parse(content);
              config.server = { ...config.server, port };
              content = JSON.stringify(config, null, 2);
            }
          }

          await fs.writeFile(configPath, content, 'utf-8');
          result.filesUpdated.push(path.basename(configPath));
        } catch (error: any) {
          result.errors.push(`Failed to update ${configPath}: ${error.message}`);
        }
      }
    }

    // Update .env files for React Native
    const envPath = path.join(projectPath, '.env');
    const envLocalPath = path.join(projectPath, '.env.local');

    for (const envFile of [envLocalPath, envPath]) {
      try {
        let content = '';
        if (await fs.pathExists(envFile)) {
          content = await fs.readFile(envFile, 'utf-8');
        }

        if (content.includes('METRO_PORT=') || content.includes('PORT=')) {
          content = content.replace(/METRO_PORT\s*=\s*\d+/i, `METRO_PORT=${port}`);
          content = content.replace(/PORT\s*=\s*\d+/i, `PORT=${port}`);
        } else {
          content += `\nMETRO_PORT=${port}\nPORT=${port}\n`;
        }

        await fs.writeFile(envFile, content, 'utf-8');
        if (await fs.pathExists(envFile)) {
          result.filesUpdated.push(path.basename(envFile));
        } else {
          result.filesCreated.push(path.basename(envFile));
        }
      } catch (error: any) {
        result.errors.push(`Failed to update ${envFile}: ${error.message}`);
      }
    }

    return result;
  }

  getDefaultPort(): number {
    return 8081; // Metro bundler default port
  }

  async validateConfig(projectPath: string, port: number): Promise<boolean> {
    // Check if port is configured in metro.config.js or .env
    const metroConfigPath = path.join(projectPath, 'metro.config.js');
    const envPath = path.join(projectPath, '.env');

    try {
      if (await fs.pathExists(metroConfigPath)) {
        const content = await fs.readFile(metroConfigPath, 'utf-8');
        if (content.includes(`port: ${port}`) || content.includes(`port:${port}`)) {
          return true;
        }
      }

      if (await fs.pathExists(envPath)) {
        const content = await fs.readFile(envPath, 'utf-8');
        if (content.includes(`METRO_PORT=${port}`) || content.includes(`PORT=${port}`)) {
          return true;
        }
      }
    } catch {
      return false;
    }

    return false;
  }
}
