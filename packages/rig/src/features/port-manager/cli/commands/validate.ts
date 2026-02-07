/**
 * Validate Command
 * 
 * Validates all port assignments and detects conflicts.
 */

import { PortManager } from '../../port-manager.js';
import { GlobalConfigManager } from '../../../../shared/config/global-config.js';
import { PortDetector } from '../../utils/port-detector.js';
import chalk from 'chalk';

export async function validateCommand(options: {
  projectName?: string;
}) {
  try {
    const globalConfig = new GlobalConfigManager();
    await globalConfig.load();

    const portManager = new PortManager({
      database: (await globalConfig.get()).database || {
        type: 'sqlite',
        sqlite: { path: '~/.port-manager/registry.db' },
      },
    });

    await portManager.connect();

    const validation = await portManager.validate(options.projectName);

    if (validation.valid) {
      console.log(chalk.green('✓ All port assignments are valid'));
    } else {
      console.log(chalk.red('✗ Found conflicts:'));
      for (const conflict of validation.conflicts) {
        const severityColor =
          conflict.severity === 'error' ? chalk.red : conflict.severity === 'warning' ? chalk.yellow : chalk.blue;
        console.log(severityColor(`  [${conflict.severity.toUpperCase()}] Port ${conflict.port}: ${conflict.details}`));
        if (conflict.resolution) {
          console.log(chalk.gray(`    Resolution: ${conflict.resolution}`));
        }
      }
    }

    if (validation.errors.length > 0) {
      console.log(chalk.red('Errors:'));
      for (const error of validation.errors) {
        console.log(chalk.red(`  - ${error}`));
      }
    }

    // Detect port configurations in code
    console.log(chalk.blue('\n🔍 Scanning for port configurations in code...'));
    const detector = new PortDetector();
    const projectPath = options.projectName
      ? (await portManager.getPort(options.projectName, 'node'))?.projectPath || process.cwd()
      : process.cwd();
    
    const detections = await detector.detectPortConfigurations(projectPath);
    
    if (detections.length > 0) {
      console.log(chalk.yellow(`\n⚠️  Found ${detections.length} port configuration(s) in project:`));
      
      // Group by type
      const byType = detections.reduce((acc, det) => {
        if (!acc[det.type]) acc[det.type] = [];
        acc[det.type].push(det);
        return acc;
      }, {} as Record<string, typeof detections>);

      for (const [type, items] of Object.entries(byType)) {
        const typeLabel = type.replace('_', ' ').toUpperCase();
        console.log(chalk.cyan(`\n  ${typeLabel} (${items.length}):`));
        
        for (const det of items) {
          const severityColor =
            det.severity === 'error' ? chalk.red : det.severity === 'warning' ? chalk.yellow : chalk.gray;
          const portInfo = det.port ? chalk.yellow(` (port ${det.port})`) : '';
          console.log(severityColor(`    ${det.file}:${det.line} - ${det.pattern}${portInfo}`));
          if (det.context.length > 80) {
            console.log(chalk.gray(`      ${det.context.substring(0, 77)}...`));
          } else {
            console.log(chalk.gray(`      ${det.context}`));
          }
        }
      }
      
      console.log(chalk.yellow('\n💡 Tip: Update these to use Port Manager assigned port or remove hardcoded defaults'));
    } else {
      console.log(chalk.green('✓ No port overrides detected in code'));
    }

    await portManager.disconnect();
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

