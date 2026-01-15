/**
 * Docker Framework Handler
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { FrameworkHandler } from './interfaces.js';
import { ConfigurationResult } from '../types.js';

export class DockerHandler implements FrameworkHandler {
  getName(): string {
    return 'docker';
  }

  async detect(projectPath: string): Promise<boolean> {
    const dockerComposePath = path.join(projectPath, 'docker-compose.yml');
    const dockerfilePath = path.join(projectPath, 'Dockerfile');
    return (
      (await fs.pathExists(dockerComposePath)) || (await fs.pathExists(dockerfilePath))
    );
  }

  async updateConfig(projectPath: string, port: number): Promise<ConfigurationResult> {
    const result: ConfigurationResult = {
      filesUpdated: [],
      filesCreated: [],
      errors: [],
    };

    const dockerComposePath = path.join(projectPath, 'docker-compose.yml');
    if (!(await fs.pathExists(dockerComposePath))) {
      result.errors.push('docker-compose.yml not found');
      return result;
    }

    try {
      const content = await fs.readFile(dockerComposePath, 'utf-8');
      const dockerCompose = yaml.load(content) as any;

      if (dockerCompose.services) {
        for (const serviceName of Object.keys(dockerCompose.services)) {
          const service = dockerCompose.services[serviceName];
          if (service.ports) {
            service.ports = service.ports.map((portMapping: string) => {
              if (typeof portMapping === 'string' && portMapping.includes(':')) {
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

    return result;
  }

  getDefaultPort(): number {
    return 3000;
  }

  async validateConfig(projectPath: string, port: number): Promise<boolean> {
    const dockerComposePath = path.join(projectPath, 'docker-compose.yml');
    if (!(await fs.pathExists(dockerComposePath))) {
      return false;
    }

    try {
      const content = await fs.readFile(dockerComposePath, 'utf-8');
      const dockerCompose = yaml.load(content) as any;

      if (dockerCompose.services) {
        for (const serviceName of Object.keys(dockerCompose.services)) {
          const service = dockerCompose.services[serviceName];
          if (service.ports) {
            for (const portMapping of service.ports) {
              if (typeof portMapping === 'string' && portMapping.includes(':')) {
                const [hostPort] = portMapping.split(':');
                if (parseInt(hostPort) === port) {
                  return true;
                }
              }
            }
          }
        }
      }
    } catch (error) {
      return false;
    }

    return false;
  }
}

