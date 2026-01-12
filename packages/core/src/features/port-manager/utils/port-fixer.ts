/**
 * Port Fixer
 * 
 * Automatically fixes port configurations to use Port Manager assigned ports.
 * Supports multiple services in one project with different env variable names.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { PortDetection } from './port-detector.js';

export interface FixResult {
  file: string;
  fixed: boolean;
  changes: string[];
  errors: string[];
}

export interface ServicePortMapping {
  envVar: string; // e.g., 'PORT', 'ADMIN_PORT', 'WEB_PORT'
  projectName: string;
  appType: string;
  port: number;
}

export class PortFixer {
  private portToServiceMap: Map<number, { serviceName: string; port: number }> = new Map();

  constructor(
    private projectPath: string,
    private assignedPort: number,
    private serviceMappings?: ServicePortMapping[], // Multiple services with different env vars
    private angularPorts?: number[], // Angular app ports (for allowedOrigins, etc.)
    private servicePortMap?: Map<string, number> // service name -> assigned port
  ) {}
  
  /**
   * Set port to service mapping for smarter fixing
   */
  setPortServiceMapping(port: number, serviceName: string, assignedPort: number): void {
    this.portToServiceMap.set(port, { serviceName, port: assignedPort });
  }

  /**
   * Fix all port configurations in the project
   */
  async fixAll(detections: PortDetection[]): Promise<FixResult[]> {
    const results: FixResult[] = [];
    const filesToFix = new Map<string, PortDetection[]>();

    // Group detections by file
    for (const det of detections) {
      if (det.severity === 'error' || det.severity === 'warning') {
        const filePath = path.isAbsolute(det.file) ? det.file : path.join(this.projectPath, det.file);
        if (!filesToFix.has(filePath)) {
          filesToFix.set(filePath, []);
        }
        filesToFix.get(filePath)!.push(det);
      }
    }

    // Fix each file
    for (const [filePath, fileDetections] of filesToFix.entries()) {
      const result = await this.fixFile(filePath, fileDetections);
      results.push(result);
    }

    return results;
  }

  /**
   * Get port for a specific env variable
   */
  private getPortForEnvVar(envVar: string): number | null {
    if (this.serviceMappings) {
      const mapping = this.serviceMappings.find(m => m.envVar === envVar);
      if (mapping) {
        return mapping.port;
      }
    }
    return this.assignedPort; // Default to main assigned port
  }

  /**
   * Detect which env variable is used in a detection
   */
  private detectEnvVar(pattern: string): string | null {
    const envVarMatch = pattern.match(/(?:process\.env\.|env\.)(PORT|ADMIN_PORT|WEB_PORT|SERVER_PORT)/i);
    if (envVarMatch) {
      return envVarMatch[1].toUpperCase();
    }
    return null;
  }

  /**
   * Fix a single file
   */
  private async fixFile(filePath: string, detections: PortDetection[]): Promise<FixResult> {
    const result: FixResult = {
      file: path.relative(this.projectPath, filePath),
      fixed: false,
      changes: [],
      errors: [],
    };

    if (!(await fs.pathExists(filePath))) {
      result.errors.push(`File not found: ${filePath}`);
      return result;
    }

    try {
      let content = await fs.readFile(filePath, 'utf-8');
      const originalContent = content;
      const lines = content.split('\n');

      // Process each detection in reverse order (to preserve line numbers)
      const sortedDetections = [...detections].sort((a, b) => b.line - a.line);

      for (const det of sortedDetections) {
        const lineIndex = det.line - 1;
        if (lineIndex < 0 || lineIndex >= lines.length) continue;

        const originalLine = lines[lineIndex];
        let fixedLine = originalLine;

        // Fix default fallbacks: process.env.PORT || 3000
        if (det.type === 'default_fallback') {
          // Detect which env var is used
          const envVar = this.detectEnvVar(det.pattern);
          const targetPort = envVar ? this.getPortForEnvVar(envVar) : this.assignedPort;

          if (targetPort) {
            // Pattern: process.env.PORT || 3000 -> process.env.PORT || <assigned-port>
            fixedLine = fixedLine.replace(
              /(process\.env\.(?:PORT|port|ADMIN_PORT|WEB_PORT|SERVER_PORT)\s*\|\|\s*)\d+/gi,
              (match, prefix) => {
                const envVarMatch = match.match(/(?:process\.env\.|env\.)(PORT|ADMIN_PORT|WEB_PORT|SERVER_PORT)/i);
                const detectedEnvVar = envVarMatch ? envVarMatch[1].toUpperCase() : null;
                const port = detectedEnvVar ? this.getPortForEnvVar(detectedEnvVar) : this.assignedPort;
                return `${prefix}${port}`;
              }
            );
            // Pattern: env.PORT || 3000 -> env.PORT || <assigned-port>
            fixedLine = fixedLine.replace(
              /(env\.(?:PORT|port|ADMIN_PORT|WEB_PORT|SERVER_PORT)\s*\|\|\s*)\d+/gi,
              (match, prefix) => {
                const envVarMatch = match.match(/env\.(PORT|ADMIN_PORT|WEB_PORT|SERVER_PORT)/i);
                const detectedEnvVar = envVarMatch ? envVarMatch[1].toUpperCase() : null;
                const port = detectedEnvVar ? this.getPortForEnvVar(detectedEnvVar) : this.assignedPort;
                return `${prefix}${port}`;
              }
            );
          }
        }

        // Fix hardcoded ports
        if (det.type === 'hardcoded' && det.port) {
          // Determine which port to use based on service mapping and context
          let targetPort: number | null = null;
          const filePath = path.isAbsolute(det.file) ? det.file : path.join(this.projectPath, det.file);
          const relativePath = path.relative(this.projectPath, filePath);
          const context = (det.context || '').toLowerCase();
          const fileName = path.basename(det.file).toLowerCase();
          
          // Strategy 1: Check if file is in a service directory
          if (this.servicePortMap) {
            // Check for exact service directory matches (frontend/, backend/, etc.)
            for (const [serviceName, servicePort] of this.servicePortMap.entries()) {
              // Match service directory in path (e.g., frontend/, backend/)
              const serviceDirPattern = new RegExp(`[/\\\\]${serviceName}[/\\\\]`, 'i');
              if (serviceDirPattern.test(relativePath) || relativePath.startsWith(`${serviceName}/`)) {
                // This file is in a service directory
                // Now determine if the port should be changed based on context
                
                // For CORS middleware or allowed origins: if port is 4200 (Angular), keep it if it's frontend
                // If port is backend port (8080), check if it's referring to backend
                if (context.includes('cors') || context.includes('allowed') || context.includes('origin')) {
                  // CORS middleware: frontend URLs should use frontend port, backend URLs should use backend port
                  if (det.port === 4200 && serviceName === 'frontend') {
                    // Frontend CORS origin - use frontend port
                    targetPort = servicePort;
                  } else if (det.port === 8080 && serviceName === 'backend') {
                    // Backend CORS origin - use backend port
                    targetPort = servicePort;
                  } else if (det.port === 4200 && serviceName === 'backend') {
                    // Backend file referencing frontend port (CORS) - use frontend port
                    const frontendPort = this.servicePortMap.get('frontend');
                    if (frontendPort) {
                      targetPort = frontendPort;
                    }
                  } else {
                    // Default: use the service's own port
                    targetPort = servicePort;
                  }
                } else if (context.includes('api') || context.includes('baseurl') || context.includes('apiurl')) {
                  // API calls in frontend should use backend port
                  if (serviceName === 'frontend') {
                    const backendPort = this.servicePortMap.get('backend');
                    if (backendPort) {
                      targetPort = backendPort;
                    } else {
                      targetPort = servicePort; // Fallback to frontend port
                    }
                  } else {
                    targetPort = servicePort;
                  }
                } else {
                  // Default: use the service's own port
                  targetPort = servicePort;
                }
                break;
              }
            }
          }
          
          // Strategy 2: Check port-to-service mapping (if port was already mapped)
          if (!targetPort) {
            const portMapping = this.portToServiceMap.get(det.port);
            if (portMapping && this.servicePortMap) {
              targetPort = portMapping.port;
            }
          }
          
          // Strategy 3: Context-based detection for integration points
          if (!targetPort) {
            // CORS middleware in backend referencing frontend
            if ((context.includes('cors') || fileName.includes('cors')) && 
                (det.port === 4200 || det.port === 3000) &&
                relativePath.includes('backend')) {
              const frontendPort = this.servicePortMap?.get('frontend');
              if (frontendPort) {
                targetPort = frontendPort;
              }
            }
            // API calls in frontend
            else if ((context.includes('api') || context.includes('baseurl')) && 
                     relativePath.includes('frontend') &&
                     (det.port === 8080 || det.port === 3000)) {
              const backendPort = this.servicePortMap?.get('backend');
              if (backendPort) {
                targetPort = backendPort;
              }
            }
            // E2E tests - use appropriate port based on what's being tested
            else if (relativePath.includes('e2e') || relativePath.includes('test')) {
              // E2E tests might reference both frontend and backend
              // If port is 4200, it's likely frontend
              if (det.port === 4200) {
                const frontendPort = this.servicePortMap?.get('frontend');
                if (frontendPort) {
                  targetPort = frontendPort;
                }
              }
              // If port is 8080, it's likely backend API
              else if (det.port === 8080) {
                const backendPort = this.servicePortMap?.get('backend');
                if (backendPort) {
                  targetPort = backendPort;
                }
              }
            }
          }
          
          // Strategy 4: Fallback to service mappings by env var
          if (!targetPort) {
            // Check if it's referring to main server / web server (PORT)
            if (context.includes('mainserver') || 
                context.includes('main server') ||
                context.includes('main_server') ||
                context.includes('web server') ||
                context.includes('webserver') ||
                (context.includes('api') && !context.includes('baseurl')) ||
                (context.includes('redirect') && !context.includes('admin')) ||
                fileName.includes('web-server')) {
              const webMapping = this.serviceMappings?.find(m => m.envVar === 'PORT');
              if (webMapping) {
                targetPort = webMapping.port;
              }
            }
            // Check if it's in admin-server context (ADMIN_PORT)
            else if (context.includes('admin') || 
                     context.includes('admin_port') ||
                     fileName.includes('admin-server')) {
              const adminMapping = this.serviceMappings?.find(m => m.envVar === 'ADMIN_PORT');
              if (adminMapping) {
                targetPort = adminMapping.port;
              }
            }
          }
          
          // Strategy 5: If still no target port, skip this detection (don't fix if too complicated)
          if (!targetPort) {
            // Don't fix if we can't determine the correct port
            continue;
          }

          // Replace hardcoded port numbers in various patterns
          
          // Pattern 1: http://localhost:PORT or https://localhost:PORT
          fixedLine = fixedLine.replace(
            new RegExp(`(http|https):\\/\\/localhost:${det.port}\\b`, 'gi'),
            `$1://localhost:${targetPort}`
          );
          
          // Pattern 2: http://127.0.0.1:PORT
          fixedLine = fixedLine.replace(
            new RegExp(`(http|https):\\/\\/127\\.0\\.0\\.1:${det.port}\\b`, 'gi'),
            `$1://127.0.0.1:${targetPort}`
          );
          
          // Pattern 3: localhost:PORT (standalone)
          fixedLine = fixedLine.replace(
            new RegExp(`localhost:${det.port}\\b`, 'gi'),
            `localhost:${targetPort}`
          );
          
          // Pattern 4: Environment variable with URL (VAR=http://localhost:PORT)
          fixedLine = fixedLine.replace(
            new RegExp(`([A-Z_]+)\\s*=\\s*(['"]?)(http|https):\\/\\/localhost:${det.port}`, 'gi'),
            `$1=$2$3://localhost:${targetPort}`
          );
          
          // Pattern 5: Port in variable assignments (port: 3000, PORT: 3000)
          fixedLine = fixedLine.replace(
            new RegExp(`(?:port|PORT)\\s*[:=]\\s*${det.port}\\b`, 'gi'),
            (match) => match.replace(/\d+/, String(targetPort))
          );
          
          // Pattern 6: .listen(PORT)
          fixedLine = fixedLine.replace(
            new RegExp(`\\.listen\\s*\\(\\s*${det.port}\\s*\\)`, 'gi'),
            `.listen(${targetPort})`
          );
          
          // Pattern 7: AWS security group --port PORT
          fixedLine = fixedLine.replace(
            new RegExp(`--port\\s+${det.port}\\b`, 'gi'),
            `--port ${targetPort}`
          );
          
          // Pattern 8: PM2 config PORT: PORT
          fixedLine = fixedLine.replace(
            new RegExp(`(?:PORT|port)\\s*:\\s*${det.port}\\b`, 'gi'),
            (match) => match.replace(/\d+/, String(targetPort))
          );
          
          // Pattern 9: Proxy target URLs
          fixedLine = fixedLine.replace(
            new RegExp(`(target|proxy)\\s*[:=]\\s*(['"])(http|https):\\/\\/localhost:${det.port}`, 'gi'),
            `$1:$2$3://localhost:${targetPort}`
          );
          
          // Pattern 10: Template literals with ports
          fixedLine = fixedLine.replace(
            new RegExp(`\\$\\{.*?\\}.*?localhost:${det.port}`, 'gi'),
            (match) => match.replace(/:(\d+)/, `:${targetPort}`)
          );
          
          // Pattern 11: String concatenation with ports
          fixedLine = fixedLine.replace(
            new RegExp(`['"]http://localhost:${det.port}['"]`, 'gi'),
            `'http://localhost:${targetPort}'`
          );
          fixedLine = fixedLine.replace(
            new RegExp(`["']http://localhost:${det.port}["']`, 'gi'),
            `"http://localhost:${targetPort}"`
          );
          
          // Pattern 12: Arrays with localhost URLs (allowedOrigins, etc.)
          // Special handling: if port is 4200 (common Angular port), check if it's an Angular app port
          fixedLine = fixedLine.replace(
            new RegExp(`(?:['"])(?:http|https):\\/\\/localhost:${det.port}(?:['"])`, 'gi'),
            (match) => {
              const quote = match[0];
              const protocolMatch = match.match(/(http|https)/i);
              const protocol = protocolMatch ? protocolMatch[1] : 'http';
              
              // If this is a common Angular port (4200, 4201) and we have Angular ports, use the first one
              if ((det.port === 4200 || det.port === 4201) && this.angularPorts && this.angularPorts.length > 0) {
                return `${quote}${protocol}://localhost:${this.angularPorts[0]}${quote}`;
              }
              
              return `${quote}${protocol}://localhost:${targetPort}${quote}`;
            }
          );
          
          // Pattern 13: Arrays with 127.0.0.1 URLs
          fixedLine = fixedLine.replace(
            new RegExp(`(?:['"])(?:http|https):\\/\\/127\\.0\\.0\\.1:${det.port}(?:['"])`, 'gi'),
            (match) => {
              const quote = match[0];
              const protocolMatch = match.match(/(http|https)/i);
              const protocol = protocolMatch ? protocolMatch[1] : 'http';
              
              // If this is a common Angular port (4200, 4201) and we have Angular ports, use the first one
              if ((det.port === 4200 || det.port === 4201) && this.angularPorts && this.angularPorts.length > 0) {
                return `${quote}${protocol}://127.0.0.1:${this.angularPorts[0]}${quote}`;
              }
              
              return `${quote}${protocol}://127.0.0.1:${targetPort}${quote}`;
            }
          );
          
          // Pattern 14: Variable assignments with template strings
          fixedLine = fixedLine.replace(
            new RegExp(`\\$\\{.*?\\}\\s*\\|\\|\\s*['"]http://localhost:${det.port}`, 'gi'),
            (match) => match.replace(/:(\d+)/, `:${targetPort}`)
          );
        }

        if (fixedLine !== originalLine) {
          lines[lineIndex] = fixedLine;
          result.changes.push(`Line ${det.line}: ${originalLine.trim()} → ${fixedLine.trim()}`);
        }
      }

      // Rebuild content
      content = lines.join('\n');

      // Fix environment files - handle multiple env vars and URLs
      if (path.basename(filePath).startsWith('.env')) {
        if (this.serviceMappings) {
          // Update each env var with its assigned port
          for (const mapping of this.serviceMappings) {
            // Update PORT=3000 style
            const regex = new RegExp(`(${mapping.envVar})\\s*=\\s*\\d+`, 'gi');
            content = content.replace(regex, `$1=${mapping.port}`);
            
            // Update URLs with ports (e.g., DISCORD_REDIRECT_URI=http://localhost:3000/...)
            const urlRegex = new RegExp(`([A-Z_]+)\\s*=\\s*(http|https):\\/\\/localhost:(\\d{4,5})`, 'gi');
            content = content.replace(urlRegex, (match, varName, protocol, _port) => {
              // Try to determine which service this URL belongs to
              // If it contains 'admin' or 'ADMIN', use ADMIN_PORT
              if (varName.includes('ADMIN') || varName.includes('admin')) {
                const adminMapping = this.serviceMappings?.find(m => m.envVar === 'ADMIN_PORT');
                if (adminMapping) {
                  return `${varName}=${protocol}://localhost:${adminMapping.port}`;
                }
              }
              // Default to PORT (web server)
              const webMapping = this.serviceMappings?.find(m => m.envVar === 'PORT');
              if (webMapping) {
                return `${varName}=${protocol}://localhost:${webMapping.port}`;
              }
              return match;
            });
          }
        } else {
          // Default: update PORT=3000 style
          content = content.replace(
            /(PORT|port)\s*=\s*\d+/gi,
            (match) => {
              const parts = match.split('=');
              return `${parts[0].trim()}=${this.assignedPort}`;
            }
          );
          
          // Update URLs with ports
          content = content.replace(
            /([A-Z_]+)\s*=\s*(http|https):\/\/localhost:(\d{4,5})/gi,
            (_match, varName, protocol) => {
              return `${varName}=${protocol}://localhost:${this.assignedPort}`;
            }
          );
        }
      }

      // Write if changed
      if (content !== originalContent) {
        await fs.writeFile(filePath, content, 'utf-8');
        result.fixed = true;
      }
    } catch (error) {
      result.errors.push(`Failed to fix file: ${error}`);
    }

    return result;
  }

  /**
   * Fix configuration files (JSON, YAML)
   */
  async fixConfigFiles(detections: PortDetection[]): Promise<FixResult[]> {
    const results: FixResult[] = [];
    const configDetections = detections.filter(
      (d) => d.type === 'config_file' && (d.severity === 'error' || d.severity === 'warning')
    );

    for (const det of configDetections) {
      const filePath = path.isAbsolute(det.file) ? det.file : path.join(this.projectPath, det.file);
      const result = await this.fixConfigFile(filePath);
      results.push(result);
    }

    return results;
  }

  /**
   * Fix a configuration file
   */
  private async fixConfigFile(filePath: string): Promise<FixResult> {
    const result: FixResult = {
      file: path.relative(this.projectPath, filePath),
      fixed: false,
      changes: [],
      errors: [],
    };

    if (!(await fs.pathExists(filePath))) {
      result.errors.push(`File not found: ${filePath}`);
      return result;
    }

    try {
      const ext = path.extname(filePath);
      let content = await fs.readFile(filePath, 'utf-8');
      const originalContent = content;

      if (ext === '.json') {
        // Fix JSON files
        let json;
        try {
          json = JSON.parse(content);
        } catch (parseError: any) {
          // Try to fix common JSON issues (trailing commas, etc.)
          let fixedContent = content;
          
          // Remove trailing commas before closing brackets/braces
          fixedContent = fixedContent.replace(/,(\s*[}\]])/g, '$1');
          
          try {
            json = JSON.parse(fixedContent);
            // If we successfully parsed after fixing, update the content
            content = fixedContent;
            result.changes.push('Fixed JSON syntax (removed trailing commas)');
          } catch (secondError: any) {
            result.errors.push(
              `Invalid JSON syntax: ${parseError.message}. ` +
              `Please fix the JSON syntax first (e.g., remove trailing commas, fix quotes). ` +
              `Error at line ${parseError.message.match(/line (\d+)/)?.[1] || 'unknown'}`
            );
            return result;
          }
        }
        
        this.fixJsonConfig(json, filePath);
        const newContent = JSON.stringify(json, null, 2);
        if (newContent !== originalContent) {
          await fs.writeFile(filePath, newContent, 'utf-8');
          result.fixed = true;
          result.changes.push(`Updated port to ${this.assignedPort}`);
        }
      } else if (ext === '.yml' || ext === '.yaml') {
        // Fix YAML files
        const yaml = require('js-yaml');
        const data = yaml.load(content);
        this.fixYamlConfig(data);
        await fs.writeFile(filePath, yaml.dump(data), 'utf-8');
        result.fixed = true;
        result.changes.push(`Updated port to ${this.assignedPort}`);
      }
    } catch (error) {
      result.errors.push(`Failed to fix config file: ${error}`);
    }

    return result;
  }

  /**
   * Fix JSON configuration
   */
  private fixJsonConfig(json: any, filePath: string): void {
    const fileName = path.basename(filePath);

    if (fileName === 'package.json') {
      // Fix scripts that contain port
      if (json.scripts) {
        for (const [key, value] of Object.entries(json.scripts)) {
          if (typeof value === 'string') {
            json.scripts[key] = value.replace(/--port\s+\d+/g, `--port ${this.assignedPort}`);
          }
        }
      }
    } else if (fileName === 'angular.json') {
      // Fix Angular port configuration
      if (json.projects) {
        for (const projectName of Object.keys(json.projects)) {
          const project = json.projects[projectName];
          if (project.architect?.serve?.options?.port) {
            project.architect.serve.options.port = this.assignedPort;
          }
        }
      }
    }
  }

  /**
   * Fix YAML configuration (docker-compose, etc.)
   */
  private fixYamlConfig(data: any): void {
    if (data.services) {
      for (const serviceName of Object.keys(data.services)) {
        const service = data.services[serviceName];
        if (service.ports) {
          service.ports = service.ports.map((portMapping: string) => {
            if (typeof portMapping === 'string' && portMapping.includes(':')) {
              const [hostPort] = portMapping.split(':');
              if (hostPort && /^\d+$/.test(hostPort)) {
                return `${this.assignedPort}:${portMapping.split(':').slice(1).join(':')}`;
              }
            }
            return portMapping;
          });
        }
      }
    }
  }
}
