/**
 * Service Detector
 * 
 * Detects multiple services in a project (frontend, backend, etc.)
 * and maps ports to their correct services.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { FrameworkDetector } from './project-detector.js';
import { AppType } from '../types.js';

export interface DetectedService {
  name: string; // e.g., 'frontend', 'backend', 'admin'
  path: string; // Relative path to service directory
  appType: AppType;
  detectedPorts: number[]; // Ports found in this service's code
  likelyPort?: number; // Most likely port based on patterns
}

export interface PortServiceMapping {
  port: number;
  service: DetectedService | null;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

export class ServiceDetector {
  private frameworkDetector: FrameworkDetector;

  constructor() {
    this.frameworkDetector = new FrameworkDetector();
  }

  /**
   * Detect all services in a project
   */
  async detectServices(projectPath: string): Promise<DetectedService[]> {
    const services: DetectedService[] = [];
    const commonServiceDirs = ['frontend', 'backend', 'admin', 'api', 'server', 'web', 'app', 'client'];

    // Check root level
    const rootAppType = await this.frameworkDetector.detect(projectPath);
    if (rootAppType) {
      services.push({
        name: 'root',
        path: '.',
        appType: rootAppType,
        detectedPorts: [],
      });
    }

    // Check common service directories
    for (const dir of commonServiceDirs) {
      const servicePath = path.join(projectPath, dir);
      if (await fs.pathExists(servicePath) && (await fs.stat(servicePath)).isDirectory()) {
        const appType = await this.frameworkDetector.detect(servicePath);
        if (appType) {
          services.push({
            name: dir,
            path: dir,
            appType: appType,
            detectedPorts: [],
          });
        }
      }
    }

    // Scan for ports in each service
    for (const service of services) {
      const serviceFullPath = path.join(projectPath, service.path);
      service.detectedPorts = await this.detectPortsInService(serviceFullPath, service.appType);
      service.likelyPort = this.inferLikelyPort(service.appType, service.detectedPorts);
    }

    return services;
  }

  /**
   * Map a port number to its likely service
   */
  mapPortToService(
    port: number,
    filePath: string,
    services: DetectedService[]
  ): PortServiceMapping {
    const pathParts = filePath.split(path.sep);

    // High confidence: Port matches service's likely port
    for (const service of services) {
      if (service.likelyPort === port) {
        // Check if file is in this service's directory
        if (filePath.includes(service.path) || service.path === '.') {
          return {
            port,
            service,
            confidence: 'high',
            reason: `Port ${port} matches ${service.name} service (${service.appType}) likely port`,
          };
        }
      }
    }

    // Medium confidence: File location matches service
    for (const service of services) {
      if (filePath.includes(service.path) || (service.path === '.' && !pathParts.includes('frontend') && !pathParts.includes('backend'))) {
        // Check if port pattern matches service type
        if (this.portMatchesServiceType(port, service.appType)) {
          return {
            port,
            service,
            confidence: 'medium',
            reason: `Port ${port} in ${service.name} directory matches ${service.appType} pattern`,
          };
        }
      }
    }

    // Low confidence: Port pattern matches service type
    for (const service of services) {
      if (this.portMatchesServiceType(port, service.appType)) {
        return {
          port,
          service,
          confidence: 'low',
          reason: `Port ${port} matches ${service.appType} pattern`,
        };
      }
    }

    return {
      port,
      service: null,
      confidence: 'low',
      reason: `Could not determine service for port ${port}`,
    };
  }

  /**
   * Detect ports used in a service directory
   */
  private async detectPortsInService(servicePath: string, appType: AppType): Promise<number[]> {
    const ports = new Set<number>();

    // Common port patterns for each app type
    const portPatterns: { [key in AppType]?: number[] } = {
      angular: [4200, 4201, 4202],
      nextjs: [3000, 3001, 3002],
      react: [3000, 3001, 3002, 4000, 4001],
      node: [3000, 3001, 3002, 8080, 8081],
      php: [8000, 8080, 8081],
      python: [5000, 5001, 8000, 8080],
    };

    // Add likely ports for this app type
    if (portPatterns[appType]) {
      portPatterns[appType]!.forEach(p => ports.add(p));
    }

    // Scan files for port mentions
    try {
      const files = await this.findCodeFiles(servicePath);
      for (const file of files.slice(0, 50)) { // Limit to first 50 files for performance
        try {
          const content = await fs.readFile(file, 'utf-8');
          // Find port numbers in URLs
          const urlMatches = content.matchAll(/(?:http|https):\/\/localhost:(\d{4,5})/gi);
          for (const match of urlMatches) {
            const port = parseInt(match[1]);
            if (port >= 1000 && port <= 65535) {
              ports.add(port);
            }
          }
          // Find port in listen() calls
          const listenMatches = content.matchAll(/\.listen\s*\(\s*(\d{4,5})\s*\)/gi);
          for (const match of listenMatches) {
            const port = parseInt(match[1]);
            if (port >= 1000 && port <= 65535) {
              ports.add(port);
            }
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return Array.from(ports);
  }

  /**
   * Infer likely port for a service based on app type and detected ports
   */
  private inferLikelyPort(appType: AppType, detectedPorts: number[]): number | undefined {
    const defaultPorts: { [key in AppType]?: number } = {
      angular: 4200,
      nextjs: 3000,
      react: 3000,
      node: 3000,
      php: 8000,
      python: 5000,
    };

    // If detected ports include the default for this app type, use it
    const defaultPort = defaultPorts[appType];
    if (defaultPort && detectedPorts.includes(defaultPort)) {
      return defaultPort;
    }

    // Otherwise, use the most common detected port
    if (detectedPorts.length > 0) {
      return detectedPorts[0];
    }

    return defaultPort;
  }

  /**
   * Check if a port number matches a service type pattern
   */
  private portMatchesServiceType(port: number, appType: AppType): boolean {
    const portRanges: { [key in AppType]?: number[] } = {
      angular: [4200, 4201, 4202, 4203, 4204, 4205],
      nextjs: [3000, 3001, 3002, 3003],
      react: [3000, 3001, 3002, 4000, 4001],
      node: [3000, 3001, 3002, 8080, 8081],
      php: [8000, 8001, 8080, 8081],
      python: [5000, 5001, 8000, 8080],
    };

    const ranges = portRanges[appType];
    if (!ranges) return false;

    // Check if port is in the common range or close to default
    return ranges.includes(port) || 
           (appType === 'angular' && port >= 4200 && port <= 4299) ||
           (appType === 'node' && port >= 3000 && port <= 3099) ||
           (appType === 'node' && port >= 8080 && port <= 8089) ||
           (appType === 'php' && port >= 8000 && port <= 8099) ||
           (appType === 'php' && port >= 8080 && port <= 8089);
  }

  /**
   * Find code files in a directory
   */
  private async findCodeFiles(dir: string): Promise<string[]> {
    const files: string[] = [];
    const extensions = ['.js', '.mjs', '.ts', '.jsx', '.tsx', '.php', '.py', '.java'];

    async function walk(currentDir: string) {
      try {
        const entries = await fs.readdir(currentDir);
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry);
          const stat = await fs.stat(fullPath);

          if (stat.isDirectory()) {
            const dirName = path.basename(fullPath);
            if (!['node_modules', '.git', 'dist', 'build', '.angular', '.next', 'vendor'].includes(dirName)) {
              await walk(fullPath);
            }
          } else if (stat.isFile()) {
            const ext = path.extname(entry);
            if (extensions.includes(ext)) {
              files.push(fullPath);
            }
          }
        }
      } catch (error) {
        // Skip directories that can't be read
      }
    }

    await walk(dir);
    return files;
  }
}

