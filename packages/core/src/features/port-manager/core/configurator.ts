/**
 * Configuration Manager
 * 
 * Manages project configuration files and updates them with port assignments.
 */

import { ProjectConfigManager } from '../../../shared/config/project-config';
import { ConfigurationResult } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';

export class ConfigurationManager {
  constructor(private projectPath: string) {}

  /**
   * Configure project with port assignment
   */
  async configure(
    projectName: string,
    appType: string,
    port: number,
    autoConfigure: boolean = true
  ): Promise<ConfigurationResult> {
    const result: ConfigurationResult = {
      filesUpdated: [],
      filesCreated: [],
      errors: [],
    };

    if (!autoConfigure) {
      return result;
    }

    const configManager = new ProjectConfigManager(this.projectPath);

    // Save project configuration
    try {
      await configManager.save({
        projectName,
        appType: appType as any,
        port,
        autoConfigure: true,
      });
      result.filesCreated.push('.port-manager.json');
    } catch (error) {
      result.errors.push(`Failed to create .port-manager.json: ${error}`);
    }

    // Update framework-specific configuration files
    try {
      const frameworkResult = await this.updateFrameworkConfig(appType, port);
      result.filesUpdated.push(...frameworkResult.filesUpdated);
      result.filesCreated.push(...frameworkResult.filesCreated);
      result.errors.push(...frameworkResult.errors);
    } catch (error) {
      result.errors.push(`Failed to update framework config: ${error}`);
    }

    return result;
  }

  /**
   * Update framework-specific configuration files
   */
  private async updateFrameworkConfig(
    appType: string,
    port: number
  ): Promise<ConfigurationResult> {
    const result: ConfigurationResult = {
      filesUpdated: [],
      filesCreated: [],
      errors: [],
    };

    switch (appType) {
      case 'nextjs':
        await this.updateNextJsConfig(port, result);
        break;
      case 'angular':
        await this.updateAngularConfig(port, result);
        break;
      case 'react':
      case 'node':
        await this.updateNodeConfig(port, result);
        break;
      case 'docker':
        await this.updateDockerConfig(port, result);
        break;
    }

    return result;
  }

  /**
   * Update Next.js configuration
   */
  private async updateNextJsConfig(port: number, result: ConfigurationResult): Promise<void> {
    const envLocalPath = path.join(this.projectPath, '.env.local');
    const envPath = path.join(this.projectPath, '.env');

    let envFile = envLocalPath;
    if (!(await fs.pathExists(envLocalPath))) {
      envFile = envPath;
    }

    try {
      let content = '';
      if (await fs.pathExists(envFile)) {
        content = await fs.readFile(envFile, 'utf-8');
      }

      // Update or add PORT
      if (content.includes('PORT=')) {
        content = content.replace(/PORT\s*=\s*\d+/i, `PORT=${port}`);
      } else {
        content += `\nPORT=${port}\n`;
      }

      await fs.writeFile(envFile, content, 'utf-8');
      result.filesUpdated.push(path.basename(envFile));
    } catch (error) {
      result.errors.push(`Failed to update ${envFile}: ${error}`);
    }
  }

  /**
   * Update Angular configuration
   */
  private async updateAngularConfig(port: number, result: ConfigurationResult): Promise<void> {
    const angularJsonPath = path.join(this.projectPath, 'angular.json');
    if (!(await fs.pathExists(angularJsonPath))) {
      return;
    }

    try {
      const angularJson = JSON.parse(await fs.readFile(angularJsonPath, 'utf-8'));
      if (angularJson.projects) {
        for (const projectName of Object.keys(angularJson.projects)) {
          const project = angularJson.projects[projectName];
          if (project.architect?.serve?.options) {
            project.architect.serve.options.port = port;
          }
        }
        await fs.writeFile(angularJsonPath, JSON.stringify(angularJson, null, 2), 'utf-8');
        result.filesUpdated.push('angular.json');
      }
    } catch (error) {
      result.errors.push(`Failed to update angular.json: ${error}`);
    }
  }

  /**
   * Update Node.js/React configuration
   */
  private async updateNodeConfig(port: number, result: ConfigurationResult): Promise<void> {
    const envPath = path.join(this.projectPath, '.env');
    const envLocalPath = path.join(this.projectPath, '.env.local');

    for (const envFile of [envLocalPath, envPath]) {
      if (await fs.pathExists(envFile)) {
        try {
          let content = await fs.readFile(envFile, 'utf-8');
          if (content.includes('PORT=')) {
            content = content.replace(/PORT\s*=\s*\d+/i, `PORT=${port}`);
          } else {
            content += `\nPORT=${port}\n`;
          }
          await fs.writeFile(envFile, content, 'utf-8');
          result.filesUpdated.push(path.basename(envFile));
        } catch (error) {
          result.errors.push(`Failed to update ${envFile}: ${error}`);
        }
      }
    }
  }

  /**
   * Update Docker configuration
   */
  private async updateDockerConfig(port: number, result: ConfigurationResult): Promise<void> {
    const dockerComposePath = path.join(this.projectPath, 'docker-compose.yml');
    if (!(await fs.pathExists(dockerComposePath))) {
      return;
    }

    try {
      const yaml = require('js-yaml');
      const content = await fs.readFile(dockerComposePath, 'utf-8');
      const dockerCompose = yaml.load(content);

      if (dockerCompose.services) {
        for (const serviceName of Object.keys(dockerCompose.services)) {
          const service = dockerCompose.services[serviceName];
          if (service.ports) {
            service.ports = service.ports.map((portMapping: string) => {
              if (portMapping.includes(':')) {
                return `${port}:${portMapping.split(':').slice(1).join(':')}`;
              }
              return portMapping;
            });
          }
        }
        await fs.writeFile(dockerComposePath, yaml.dump(dockerCompose), 'utf-8');
        result.filesUpdated.push('docker-compose.yml');
      }
    } catch (error) {
      result.errors.push(`Failed to update docker-compose.yml: ${error}`);
    }
  }
}

