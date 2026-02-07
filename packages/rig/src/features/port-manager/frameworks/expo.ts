/**
 * Expo Framework Handler
 * 
 * Handles Expo project configuration for Port Manager.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { FrameworkHandler } from './interfaces.js';
import { ConfigurationResult } from '../types.js';

export class ExpoHandler implements FrameworkHandler {
  getName(): string {
    return 'expo';
  }

  async detect(projectPath: string): Promise<boolean> {
    const packageJsonPath = path.join(projectPath, 'package.json');
    const appJsonPath = path.join(projectPath, 'app.json');
    const appConfigPath = path.join(projectPath, 'app.config.js');
    const appConfigJsonPath = path.join(projectPath, 'app.config.json');

    // Check for Expo in package.json
    if (await fs.pathExists(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
        const dependencies = {
          ...packageJson.dependencies,
          ...packageJson.devDependencies,
        };
        if (
          dependencies['expo'] !== undefined ||
          dependencies['expo-cli'] !== undefined ||
          dependencies['@expo/cli'] !== undefined
        ) {
          return true;
        }
      } catch {
        // Continue checking other files
      }
    }

    // Check for Expo config files
    return (
      (await fs.pathExists(appJsonPath)) ||
      (await fs.pathExists(appConfigPath)) ||
      (await fs.pathExists(appConfigJsonPath))
    );
  }

  async updateConfig(projectPath: string, port: number): Promise<ConfigurationResult> {
    const result: ConfigurationResult = {
      filesUpdated: [],
      filesCreated: [],
      errors: [],
    };

    // Update app.json or app.config.js/json for Expo
    const appJsonPath = path.join(projectPath, 'app.json');
    const appConfigPath = path.join(projectPath, 'app.config.js');
    const appConfigJsonPath = path.join(projectPath, 'app.config.json');

    for (const configPath of [appJsonPath, appConfigJsonPath]) {
      if (await fs.pathExists(configPath)) {
        try {
          const content = await fs.readFile(configPath, 'utf-8');
          const config = JSON.parse(content);

          // Update Expo dev server port
          if (!config.expo) {
            config.expo = {};
          }
          if (!config.expo.extra) {
            config.expo.extra = {};
          }
          config.expo.extra.port = port;

          await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf-8');
          result.filesUpdated.push(path.basename(configPath));
        } catch (error: any) {
          result.errors.push(`Failed to update ${configPath}: ${error.message}`);
        }
      }
    }

    // Update app.config.js (JavaScript config)
    if (await fs.pathExists(appConfigPath)) {
      try {
        let content = await fs.readFile(appConfigPath, 'utf-8');
        
        // Try to update port in config
        if (content.includes('port')) {
          content = content.replace(/port\s*:\s*\d+/g, `port: ${port}`);
        } else {
          // Add port to expo.extra
          content = content.replace(
            /(expo:\s*\{[^}]*extra:\s*\{)/,
            `$1\n    port: ${port},`
          );
        }

        await fs.writeFile(appConfigPath, content, 'utf-8');
        result.filesUpdated.push(path.basename(appConfigPath));
      } catch (error: any) {
        result.errors.push(`Failed to update ${appConfigPath}: ${error.message}`);
      }
    }

    // Update .env files for Expo
    const envPath = path.join(projectPath, '.env');
    const envLocalPath = path.join(projectPath, '.env.local');

    for (const envFile of [envLocalPath, envPath]) {
      try {
        let content = '';
        if (await fs.pathExists(envFile)) {
          content = await fs.readFile(envFile, 'utf-8');
        }

        if (content.includes('EXPO_PORT=') || content.includes('PORT=')) {
          content = content.replace(/EXPO_PORT\s*=\s*\d+/i, `EXPO_PORT=${port}`);
          content = content.replace(/PORT\s*=\s*\d+/i, `PORT=${port}`);
        } else {
          content += `\nEXPO_PORT=${port}\nPORT=${port}\n`;
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
    return 8081; // Expo uses Metro bundler (default: 8081)
  }

  async validateConfig(projectPath: string, port: number): Promise<boolean> {
    // Check if port is configured in app.json/app.config.js or .env
    const appJsonPath = path.join(projectPath, 'app.json');
    const appConfigPath = path.join(projectPath, 'app.config.js');
    const appConfigJsonPath = path.join(projectPath, 'app.config.json');
    const envPath = path.join(projectPath, '.env');

    try {
      // Check app.json or app.config.json
      for (const configPath of [appJsonPath, appConfigJsonPath]) {
        if (await fs.pathExists(configPath)) {
          const content = await fs.readFile(configPath, 'utf-8');
          const config = JSON.parse(content);
          if (config.expo?.extra?.port === port) {
            return true;
          }
        }
      }

      // Check app.config.js
      if (await fs.pathExists(appConfigPath)) {
        const content = await fs.readFile(appConfigPath, 'utf-8');
        if (content.includes(`port: ${port}`)) {
          return true;
        }
      }

      // Check .env
      if (await fs.pathExists(envPath)) {
        const content = await fs.readFile(envPath, 'utf-8');
        if (content.includes(`EXPO_PORT=${port}`) || content.includes(`PORT=${port}`)) {
          return true;
        }
      }
    } catch {
      return false;
    }

    return false;
  }
}
