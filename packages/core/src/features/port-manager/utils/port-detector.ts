/**
 * Port Detector
 * 
 * Detects port configurations in code files, environment files, and documentation.
 * Helps identify places where ports might be overridden or hardcoded.
 */

import * as fs from 'fs-extra';
import * as path from 'path';

export interface PortDetection {
  file: string;
  line: number;
  type: 'env_var' | 'hardcoded' | 'default_fallback' | 'config_file' | 'documentation';
  pattern: string;
  port?: number;
  context: string;
  severity: 'error' | 'warning' | 'info';
}

export class PortDetector {
  /**
   * Detect all port configurations in a project
   */
  async detectPortConfigurations(projectPath: string): Promise<PortDetection[]> {
    const detections: PortDetection[] = [];

    // Search in code files
    detections.push(...(await this.detectInCodeFiles(projectPath)));

    // Search in environment files
    detections.push(...(await this.detectInEnvFiles(projectPath)));

    // Search in configuration files
    detections.push(...(await this.detectInConfigFiles(projectPath)));

    // Search in documentation
    detections.push(...(await this.detectInDocumentation(projectPath)));

    return detections;
  }

  /**
   * Detect port configurations in code files
   */
  private async detectInCodeFiles(projectPath: string): Promise<PortDetection[]> {
    const detections: PortDetection[] = [];
    const codeExtensions = ['.js', '.mjs', '.ts', '.jsx', '.tsx', '.py', '.php', '.rb', '.go', '.java'];

    const files = await this.findFiles(projectPath, codeExtensions, [
      'node_modules',
      '.git',
      'dist',
      'build',
      '.angular',
      '.next',
    ]);

    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          const lineNum = index + 1;

          // Pattern 1: process.env.PORT || default
          const envPortPattern = /process\.env\.(PORT|port|ADMIN_PORT|WEB_PORT|SERVER_PORT)\s*\|\|\s*(\d+)/gi;
          let match;
          while ((match = envPortPattern.exec(line)) !== null) {
            detections.push({
              file: path.relative(projectPath, file),
              line: lineNum,
              type: 'default_fallback',
              pattern: match[0],
              port: parseInt(match[2]),
              context: line.trim(),
              severity: 'error',
            });
          }

          // Pattern 2: env.PORT || default
          const envPattern = /env\.(PORT|port|ADMIN_PORT|WEB_PORT|SERVER_PORT)\s*\|\|\s*(\d+)/gi;
          while ((match = envPattern.exec(line)) !== null) {
            detections.push({
              file: path.relative(projectPath, file),
              line: lineNum,
              type: 'default_fallback',
              pattern: match[0],
              port: parseInt(match[2]),
              context: line.trim(),
              severity: 'error',
            });
          }

          // Pattern 3: Hardcoded ports (common patterns)
          const hardcodedPattern = /(?:port|PORT)\s*[:=]\s*(\d{4,5})/gi;
          while ((match = hardcodedPattern.exec(line)) !== null) {
            const port = parseInt(match[1]);
            // Only flag if it's a common default port
            if ([3000, 4200, 4000, 5000, 8000, 8080, 3001, 4201].includes(port)) {
              detections.push({
                file: path.relative(projectPath, file),
                line: lineNum,
                type: 'hardcoded',
                pattern: match[0],
                port: port,
                context: line.trim(),
                severity: 'warning',
              });
            }
          }

          // Pattern 4: listen(port) or app.listen(port)
          const listenPattern = /\.listen\s*\(\s*(\d{4,5})\s*\)/gi;
          while ((match = listenPattern.exec(line)) !== null) {
            const port = parseInt(match[1]);
            if ([3000, 4200, 4000, 5000, 8000, 8080, 3001, 4201].includes(port)) {
              detections.push({
                file: path.relative(projectPath, file),
                line: lineNum,
                type: 'hardcoded',
                pattern: match[0],
                port: port,
                context: line.trim(),
                severity: 'warning',
              });
            }
          }

          // Pattern 5: http://localhost:PORT or https://localhost:PORT
          const urlPattern = /(?:http|https):\/\/localhost:(\d{4,5})/gi;
          while ((match = urlPattern.exec(line)) !== null) {
            const port = parseInt(match[1]);
            if ([3000, 4200, 4000, 5000, 8000, 8080, 3001, 4201, 3002, 4201].includes(port)) {
              detections.push({
                file: path.relative(projectPath, file),
                line: lineNum,
                type: 'hardcoded',
                pattern: match[0],
                port: port,
                context: line.trim(),
                severity: 'error',
              });
            }
          }

          // Pattern 6: http://127.0.0.1:PORT
          const localhostIpPattern = /(?:http|https):\/\/127\.0\.0\.1:(\d{4,5})/gi;
          while ((match = localhostIpPattern.exec(line)) !== null) {
            const port = parseInt(match[1]);
            if ([3000, 4200, 4000, 5000, 8000, 8080, 3001, 4201, 3002, 4201].includes(port)) {
              detections.push({
                file: path.relative(projectPath, file),
                line: lineNum,
                type: 'hardcoded',
                pattern: match[0],
                port: port,
                context: line.trim(),
                severity: 'error',
              });
            }
          }

          // Pattern 7: localhost:PORT (standalone, in strings, arrays, etc.)
          const localhostStandalonePattern = /localhost:(\d{4,5})/gi;
          while ((match = localhostStandalonePattern.exec(line)) !== null) {
            const port = parseInt(match[1]);
            // Skip if already matched by URL pattern (avoid duplicates)
            if (!line.match(/(?:http|https):\/\/localhost:\d{4,5}/i)) {
              if ([3000, 4200, 4000, 5000, 8000, 8080, 3001, 4201, 3002, 4201].includes(port)) {
                detections.push({
                  file: path.relative(projectPath, file),
                  line: lineNum,
                  type: 'hardcoded',
                  pattern: match[0],
                  port: port,
                  context: line.trim(),
                  severity: 'error',
                });
              }
            }
          }

          // Pattern 8: Environment variable assignments with URLs (DISCORD_REDIRECT_URI=http://localhost:3000/...)
          const envUrlPattern = /([A-Z_]+)\s*=\s*(?:['"]?)(?:http|https):\/\/localhost:(\d{4,5})/gi;
          while ((match = envUrlPattern.exec(line)) !== null) {
            const port = parseInt(match[2]);
            if ([3000, 4200, 4000, 5000, 8000, 8080, 3001, 4201, 3002, 4201].includes(port)) {
              detections.push({
                file: path.relative(projectPath, file),
                line: lineNum,
                type: 'hardcoded',
                pattern: match[0],
                port: port,
                context: line.trim(),
                severity: 'error',
              });
            }
          }

          // Pattern 9: Port in AWS security group rules (--port 3000)
          const awsPortPattern = /--port\s+(\d{4,5})/gi;
          while ((match = awsPortPattern.exec(line)) !== null) {
            const port = parseInt(match[1]);
            if ([3000, 4200, 4000, 5000, 8000, 8080, 3001, 4201, 3002, 4201].includes(port)) {
              detections.push({
                file: path.relative(projectPath, file),
                line: lineNum,
                type: 'hardcoded',
                pattern: match[0],
                port: port,
                context: line.trim(),
                severity: 'warning',
              });
            }
          }

          // Pattern 10: Port in PM2 config (PORT: 3000)
          const pm2PortPattern = /(?:PORT|port)\s*:\s*(\d{4,5})/gi;
          while ((match = pm2PortPattern.exec(line)) !== null) {
            const port = parseInt(match[1]);
            if ([3000, 4200, 4000, 5000, 8000, 8080, 3001, 4201, 3002, 4201].includes(port)) {
              detections.push({
                file: path.relative(projectPath, file),
                line: lineNum,
                type: 'hardcoded',
                pattern: match[0],
                port: port,
                context: line.trim(),
                severity: 'error',
              });
            }
          }

          // Pattern 11: Proxy target URLs (target: "http://localhost:3000")
          const proxyTargetPattern = /(?:target|proxy)\s*[:=]\s*(?:['"])(?:http|https):\/\/localhost:(\d{4,5})/gi;
          while ((match = proxyTargetPattern.exec(line)) !== null) {
            const port = parseInt(match[1]);
            if ([3000, 4200, 4000, 5000, 8000, 8080, 3001, 4201, 3002, 4201].includes(port)) {
              detections.push({
                file: path.relative(projectPath, file),
                line: lineNum,
                type: 'hardcoded',
                pattern: match[0],
                port: port,
                context: line.trim(),
                severity: 'error',
              });
            }
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }

    return detections;
  }

  /**
   * Detect port configurations in environment files
   */
  private async detectInEnvFiles(projectPath: string): Promise<PortDetection[]> {
    const detections: PortDetection[] = [];
    const envFiles = ['.env', '.env.local', '.env.development', '.env.production', '.env.test'];

    for (const envFile of envFiles) {
      const envPath = path.join(projectPath, envFile);
      if (await fs.pathExists(envPath)) {
        try {
          const content = await fs.readFile(envPath, 'utf-8');
          const lines = content.split('\n');

          lines.forEach((line, index) => {
            const lineNum = index + 1;
            // Match PORT=3000 or PORT = 3000
            const portMatch = line.match(/(?:PORT|port|ADMIN_PORT|WEB_PORT|SERVER_PORT)\s*=\s*(\d+)/i);
            if (portMatch) {
              detections.push({
                file: envFile,
                line: lineNum,
                type: 'env_var',
                pattern: portMatch[0],
                port: parseInt(portMatch[1]),
                context: line.trim(),
                severity: 'error',
              });
            }
          });
        } catch (error) {
          // Skip if can't read
        }
      }
    }

    return detections;
  }

  /**
   * Detect port configurations in config files
   */
  private async detectInConfigFiles(projectPath: string): Promise<PortDetection[]> {
    const detections: PortDetection[] = [];
    const configFiles = [
      'package.json',
      'angular.json',
      'next.config.js',
      'next.config.ts',
      'vite.config.js',
      'vite.config.ts',
      'webpack.config.js',
      'docker-compose.yml',
      'docker-compose.yaml',
    ];

    for (const configFile of configFiles) {
      const configPath = path.join(projectPath, configFile);
      if (await fs.pathExists(configPath)) {
        try {
          const content = await fs.readFile(configPath, 'utf-8');
          const lines = content.split('\n');

          lines.forEach((line, index) => {
            const lineNum = index + 1;
            // Match "port": 3000 or port: 3000
            const portMatch = line.match(/(?:["']?port["']?\s*[:=]\s*)(\d{4,5})/i);
            if (portMatch) {
              const port = parseInt(portMatch[1]);
              detections.push({
                file: configFile,
                line: lineNum,
                type: 'config_file',
                pattern: portMatch[0],
                port: port,
                context: line.trim(),
                severity: 'warning',
              });
            }
          });
        } catch (error) {
          // Skip if can't read
        }
      }
    }

    return detections;
  }

  /**
   * Detect port mentions in documentation
   */
  private async detectInDocumentation(projectPath: string): Promise<PortDetection[]> {
    const detections: PortDetection[] = [];
    const docExtensions = ['.md', '.txt', '.rst', '.adoc'];
    const docDirs = ['docs', 'documentation', 'doc', 'README.md'];

    // Check docs directories
    for (const docDir of docDirs) {
      const docPath = path.join(projectPath, docDir);
      if (await fs.pathExists(docPath)) {
        const files = await this.findFiles(docPath, docExtensions, []);
        for (const file of files) {
          try {
            const content = await fs.readFile(file, 'utf-8');
            const lines = content.split('\n');

            lines.forEach((line, index) => {
              const lineNum = index + 1;
              // Match port mentions like "port 3000" or "PORT=3000"
              const portMatch = line.match(/(?:port|PORT)\s*(?:[:=]|is|at)?\s*(\d{4,5})/i);
              if (portMatch) {
                const port = parseInt(portMatch[1]);
                if ([3000, 4200, 4000, 5000, 8000, 8080, 3001, 4201].includes(port)) {
                  detections.push({
                    file: path.relative(projectPath, file),
                    line: lineNum,
                    type: 'documentation',
                    pattern: portMatch[0],
                    port: port,
                    context: line.trim(),
                    severity: 'info',
                  });
                }
              }
            });
          } catch (error) {
            // Skip if can't read
          }
        }
      }
    }

    return detections;
  }

  /**
   * Find files with specific extensions
   */
  private async findFiles(
    dir: string,
    extensions: string[],
    excludeDirs: string[]
  ): Promise<string[]> {
    const files: string[] = [];

    async function walk(currentDir: string) {
      try {
        const entries = await fs.readdir(currentDir);
        for (const entry of entries) {
          const fullPath = path.join(currentDir, entry);
          const stat = await fs.stat(fullPath);

          if (stat.isDirectory()) {
            const dirName = path.basename(fullPath);
            if (!excludeDirs.includes(dirName) && !dirName.startsWith('.')) {
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

