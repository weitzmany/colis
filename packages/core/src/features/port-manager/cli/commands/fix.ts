/**
 * Fix Command
 * 
 * Automatically fixes port configurations to use Port Manager assigned ports.
 * Handles multiple services in one project with different env variable names.
 */

import { PortManager } from '../../port-manager';
import { GlobalConfigManager } from '../../../../shared/config/global-config';
import { PortDetector, PortDetection } from '../../utils/port-detector';
import { PortFixer, ServicePortMapping } from '../../utils/port-fixer';
import { ServiceDetector, DetectedService, PortServiceMapping } from '../../utils/service-detector';
import { generateProjectName, generateServiceProjectName } from '../../utils/project-name';
import chalk from 'chalk';
import * as path from 'path';
import * as readline from 'readline';

export async function fixCommand(options: {
  projectName?: string;
  appType?: string;
  path?: string;
  yes?: boolean;
  dryRun?: boolean;
}) {
  try {
    const projectPath = options.path ? path.resolve(options.path) : process.cwd();
    const globalConfig = new GlobalConfigManager();
    await globalConfig.load();

    const portManager = new PortManager({
      database: (await globalConfig.get()).database || {
        type: 'sqlite',
        sqlite: { path: '~/.port-manager/registry.db' },
      },
    });

    await portManager.connect();

    // Detect all services in the project
    const serviceDetector = new ServiceDetector();
    const detectedServices = await serviceDetector.detectServices(projectPath);
    
    console.log(chalk.blue(`\n🔍 Detected ${detectedServices.length} service(s) in project:`));
    for (const service of detectedServices) {
      console.log(chalk.cyan(`  - ${service.name} (${service.appType}) in ${service.path}`));
      if (service.likelyPort) {
        console.log(chalk.gray(`    Likely port: ${service.likelyPort}`));
      }
    }

    // Detect all port configurations first
    const detector = new PortDetector();
    const allDetections = await detector.detectPortConfigurations(projectPath);

    // Detect multiple services by env var names (use allDetections, not filtered yet)
    const envVars = new Set<string>();
    for (const det of allDetections) {
      if (det.type === 'default_fallback') {
        const envVarMatch = det.pattern.match(/(?:process\.env\.|env\.)(PORT|ADMIN_PORT|WEB_PORT|SERVER_PORT)/i);
        if (envVarMatch) {
          envVars.add(envVarMatch[1].toUpperCase());
        }
      }
    }
    
    // Map each detected port to its service
    const portServiceMap = new Map<number, PortServiceMapping>();
    for (const det of allDetections) {
      if (det.port) {
        const filePath = path.isAbsolute(det.file) ? det.file : path.join(projectPath, det.file);
        const mapping = serviceDetector.mapPortToService(det.port, filePath, detectedServices);
        if (!portServiceMap.has(det.port) || mapping.confidence === 'high') {
          portServiceMap.set(det.port, mapping);
        }
      }
    }

    // Find Port Manager assignments for each detected service
    const baseProjectName = generateProjectName(projectPath);
    const serviceMappings: Array<{ envVar: string; projectName: string; port: number; service?: DetectedService }> = [];
    const servicePortMap = new Map<string, number>(); // service name -> port
    
    for (const service of detectedServices) {
      // Generate unambiguous service project name
      const serviceProjectName = generateServiceProjectName(projectPath, service.name, service.appType);
      
      // Try to find Port Manager assignment for this service
      const searchNames = [
        serviceProjectName,
        `${baseProjectName}-${service.name}`,
        `${baseProjectName}-${service.name}-${service.appType}`,
        service.name, // Fallback for backward compatibility
        `${service.name}-${service.appType}`,
      ];
      
      for (const searchName of searchNames) {
        const assignment = await portManager.getPort(searchName, service.appType);
        if (assignment) {
          servicePortMap.set(service.name, assignment.port);
          console.log(chalk.green(`  ✓ Found Port Manager assignment: ${searchName} → port ${assignment.port}`));
          break;
        }
      }
      
      // If no assignment found but we have a likely port, use it for fixing (but don't auto-assign)
      if (!servicePortMap.has(service.name) && service.likelyPort) {
        // Use likely port for fixing purposes (this is a detected port, not assigned)
        servicePortMap.set(service.name, service.likelyPort);
        console.log(chalk.yellow(`  ⚠ No Port Manager assignment found for ${service.name}, using detected likely port: ${service.likelyPort}`));
        console.log(chalk.yellow(`     Consider running: port-manager init in ${service.path} directory`));
      }
    }
    
    // Also get Angular app ports if they exist (for allowedOrigins, etc.)
    const angularPorts: number[] = [];
    try {
      const allAssignments = await portManager.listPorts({ status: 'active' });
      for (const assignment of allAssignments) {
        if (assignment.appType === 'angular') {
          angularPorts.push(assignment.port);
        }
      }
    } catch (error) {
      // Ignore errors
    }
    
    // Build service mappings from env vars (for backward compatibility)
    let defaultPort = 0;

    if (envVars.size > 1) {
      console.log(chalk.blue(`\n🔍 Detected multiple services with different env vars:`));
      for (const envVar of envVars) {
        // Try to find a project that matches this env var
        let projectNameMatch = '';
        if (envVar === 'PORT') {
          projectNameMatch = 'web-server';
        } else if (envVar === 'ADMIN_PORT') {
          projectNameMatch = 'admin-server';
        } else {
          projectNameMatch = envVar.toLowerCase().replace('_PORT', '-server');
        }
        
        const baseName = path.basename(projectPath);
        const searchNames = [
          `${baseName}-${projectNameMatch}`,
          projectNameMatch,
          `${baseName}-${envVar.toLowerCase().replace('_PORT', '')}`,
        ];

        let found = false;
        for (const searchName of searchNames) {
          const assignment = await portManager.getPort(searchName, 'node');
          if (assignment) {
            serviceMappings.push({ envVar, projectName: searchName, port: assignment.port });
            console.log(chalk.cyan(`  ${envVar}: ${searchName} → port ${assignment.port}`));
            found = true;
            break;
          }
        }

        if (!found && !defaultPort) {
          // Use first found assignment as default
          const allAssignments = await portManager.listPorts({ status: 'active' });
          if (allAssignments.length > 0) {
            defaultPort = allAssignments[0].port;
          }
        }
      }
    } else {
      // Single service - get or allocate port
      let projectName = options.projectName || generateProjectName(projectPath);
      let appType = options.appType || 'node';

      let assignment = await portManager.getPort(projectName, appType as any);
      if (!assignment) {
        console.log(chalk.yellow(`No port assignment found for ${projectName}. Allocating one...`));
        const port = await portManager.allocate(projectName, projectPath, appType as any);
        assignment = await portManager.getPort(projectName, appType as any);
        console.log(chalk.green(`✓ Allocated port ${port} for ${projectName}`));
      }

      if (assignment) {
        defaultPort = assignment.port;
      }
    }

    if (!defaultPort && serviceMappings.length === 0) {
      throw new Error('No port assignments found. Please initialize Port Manager first.');
    }

    const assignedPort = defaultPort || (serviceMappings.length > 0 ? serviceMappings[0].port : 0);

    // Now filter detections - only keep those that don't match assigned ports
    const fixableDetections = allDetections.filter((d: PortDetection) => {
      // Only process errors and warnings
      if (d.severity !== 'error' && d.severity !== 'warning') {
        return false;
      }

      // For default fallbacks, check if the port matches the assigned port
      if (d.type === 'default_fallback' && d.port) {
        // Detect which env var this is for
        const envVarMatch = d.pattern.match(/(?:process\.env\.|env\.)(PORT|ADMIN_PORT|WEB_PORT|SERVER_PORT)/i);
        if (envVarMatch) {
          const envVar = envVarMatch[1].toUpperCase();
          // Find the assigned port for this env var
          const mapping = serviceMappings.find(m => m.envVar === envVar);
          const targetPort = mapping ? mapping.port : assignedPort;
          // Only flag if the fallback port doesn't match the assigned port
          return d.port !== targetPort;
        }
      }

      // For env file patterns (PORT=3001), check if it matches assigned port
      if (d.type === 'env_var' && d.port) {
        // Try to detect which env var from the file name or pattern
        const envVarMatch = d.pattern.match(/(PORT|ADMIN_PORT|WEB_PORT|SERVER_PORT)\s*=/i);
        if (envVarMatch) {
          const envVar = envVarMatch[1].toUpperCase();
          const mapping = serviceMappings.find(m => m.envVar === envVar);
          const targetPort = mapping ? mapping.port : assignedPort;
          // Only flag if the port doesn't match
          return d.port !== targetPort;
        }
      }

      // For config files (angular.json, package.json, etc.), check if port matches
      if (d.type === 'config_file' && d.port) {
        // Config files typically use PORT (not ADMIN_PORT, etc.)
        const mapping = serviceMappings.find(m => m.envVar === 'PORT');
        const targetPort = mapping ? mapping.port : assignedPort;
        // Only flag if the port doesn't match
        return d.port !== targetPort;
      }

      // For hardcoded ports, check if they match the correct service port
      if (d.type === 'hardcoded' && d.port) {
        const filePath = path.isAbsolute(d.file) ? d.file : path.join(projectPath, d.file);
        const relativePath = path.relative(projectPath, filePath);
        
        // Map port to service to determine correct target port
        const portMapping = portServiceMap.get(d.port);
        let targetPort: number | null = null;
        
        // Check if file is in a service directory
        if (portMapping && portMapping.service) {
          const serviceName = portMapping.service.name;
          const servicePort = servicePortMap.get(serviceName);
          if (servicePort) {
            targetPort = servicePort;
          }
        }
        
        // For CORS and API contexts, determine target based on what's being referenced
        const context = (d.context || '').toLowerCase();
        if (!targetPort) {
          // CORS middleware in backend referencing frontend port
          if ((context.includes('cors') || context.includes('allowed')) && 
              relativePath.includes('backend') &&
              (d.port === 4200 || d.port === 3000)) {
            const frontendPort = servicePortMap.get('frontend');
            if (frontendPort) {
              targetPort = frontendPort;
            }
          }
          // API calls in frontend referencing backend port
          else if ((context.includes('api') || context.includes('baseurl')) &&
                   relativePath.includes('frontend') &&
                   (d.port === 8080 || d.port === 3000)) {
            const backendPort = servicePortMap.get('backend');
            if (backendPort) {
              targetPort = backendPort;
            }
          }
          // E2E tests
          else if (relativePath.includes('e2e') || relativePath.includes('test')) {
            if (d.port === 4200) {
              targetPort = servicePortMap.get('frontend') || null;
            } else if (d.port === 8080) {
              targetPort = servicePortMap.get('backend') || null;
            }
          }
          // Files in service directories use their service port
          else {
            for (const [serviceName, servicePort] of servicePortMap.entries()) {
              if (relativePath.includes(`/${serviceName}/`) || relativePath.startsWith(`${serviceName}/`)) {
                targetPort = servicePort;
                break;
              }
            }
          }
        }
        
        // If we can't determine target port, don't flag it (too complicated)
        if (!targetPort) {
          return false;
        }
        
        // Only flag if port doesn't match target
        return d.port !== targetPort;
      }

      // For other types, keep them if they're errors/warnings
      return true;
    });

    console.log(chalk.blue(`\n🔍 Detecting port configurations in: ${projectPath}`));
    if (serviceMappings.length > 0) {
      console.log(chalk.blue(`📌 Multiple services detected - will use respective ports`));
    } else {
      console.log(chalk.blue(`📌 Assigned port: ${assignedPort}`));
    }

    if (fixableDetections.length === 0) {
      console.log(chalk.green('✓ All port configurations are correct - no fixes needed'));
      await portManager.disconnect();
      return;
    }

    console.log(chalk.yellow(`\n⚠️  Found ${fixableDetections.length} port configuration(s) to fix:`));
    
    // Show what will be fixed, grouped by env var
    const byEnvVar = new Map<string, PortDetection[]>();
    for (const det of fixableDetections) {
      const envVarMatch = det.pattern.match(/(?:process\.env\.|env\.)(PORT|ADMIN_PORT|WEB_PORT|SERVER_PORT)/i);
      const envVar = envVarMatch ? envVarMatch[1].toUpperCase() : 'PORT';
      if (!byEnvVar.has(envVar)) {
        byEnvVar.set(envVar, []);
      }
      byEnvVar.get(envVar)!.push(det);
    }

    for (const [envVar, dets] of byEnvVar.entries()) {
      const mapping = serviceMappings.find(m => m.envVar === envVar);
      const targetPort = mapping ? mapping.port : assignedPort;
      console.log(chalk.cyan(`\n  ${envVar} (will use port ${targetPort}):`));
      for (const det of dets) {
        const severityColor = det.severity === 'error' ? chalk.red : chalk.yellow;
        const portInfo = det.port ? ` (currently ${det.port})` : '';
        console.log(severityColor(`    ${det.file}:${det.line} - ${det.pattern}${portInfo}`));
      }
    }

    // Ask for confirmation unless --yes or --dry-run
    if (!options.yes && !options.dryRun) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      const answer = await new Promise<string>((resolve) => {
        rl.question(
          chalk.cyan(`\nUpdate all to use assigned ports? (y/N): `),
          resolve
        );
      });
      rl.close();

      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log(chalk.yellow('Cancelled'));
        await portManager.disconnect();
        return;
      }
    }

    if (options.dryRun) {
      console.log(chalk.blue('\n🔍 DRY RUN - No files will be modified'));
      for (const det of fixableDetections) {
        console.log(chalk.gray(`Would fix: ${det.file}:${det.line}`));
      }
      await portManager.disconnect();
      return;
    }

      // Build port-to-service mapping for fixer
      const portToServiceMap = new Map<number, { serviceName: string; port: number }>();
      for (const [port, mapping] of portServiceMap.entries()) {
        if (mapping.service) {
          const servicePort = servicePortMap.get(mapping.service.name);
          if (servicePort) {
            portToServiceMap.set(port, { serviceName: mapping.service.name, port: servicePort });
          }
        }
      }
      
      // Fix all configurations
      console.log(chalk.blue('\n🔧 Fixing port configurations...'));
      const serviceMappingsForFixer: ServicePortMapping[] | undefined = serviceMappings.length > 0
        ? serviceMappings.map((m) => ({ envVar: m.envVar, projectName: m.projectName, appType: 'node' as const, port: m.port }))
        : undefined;
      const fixer = new PortFixer(projectPath, assignedPort, serviceMappingsForFixer, angularPorts, servicePortMap);
      
      // Set port-to-service mappings
      for (const [port, mapping] of portToServiceMap.entries()) {
        fixer.setPortServiceMapping(port, mapping.serviceName, mapping.port);
      }
    const results = await fixer.fixAll(fixableDetections);
    const configResults = await fixer.fixConfigFiles(allDetections);

    // Show results
    const allResults = [...results, ...configResults];
    const fixedCount = allResults.filter((r) => r.fixed).length;
    const errorCount = allResults.reduce((sum, r) => sum + r.errors.length, 0);

    if (fixedCount > 0) {
      console.log(chalk.green(`\n✓ Fixed ${fixedCount} file(s):`));
      for (const result of allResults) {
        if (result.fixed) {
          console.log(chalk.green(`  ✓ ${result.file}`));
          for (const change of result.changes) {
            console.log(chalk.gray(`    ${change}`));
          }
        }
      }
    }

    if (errorCount > 0) {
      console.log(chalk.red(`\n✗ ${errorCount} error(s) occurred:`));
      for (const result of allResults) {
        for (const error of result.errors) {
          console.log(chalk.red(`  ✗ ${result.file}: ${error}`));
        }
      }
    }

    if (fixedCount === 0 && errorCount === 0) {
      console.log(chalk.yellow('No files needed fixing'));
    }

    if (serviceMappings.length > 0) {
      console.log(chalk.green(`\n✓ All port configurations updated to use respective assigned ports`));
    } else {
      console.log(chalk.green(`\n✓ All port configurations updated to use port ${assignedPort}`));
    }

    await portManager.disconnect();
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}
