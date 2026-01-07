/**
 * Detect Command
 * 
 * Detects all port configurations in a project.
 */

import { PortDetector } from '../../utils/port-detector';
import chalk from 'chalk';
import * as path from 'path';

export async function detectCommand(options: {
  path?: string;
  format?: 'text' | 'json';
}) {
  try {
    const projectPath = options.path ? path.resolve(options.path) : process.cwd();
    
    console.log(chalk.blue(`🔍 Scanning for port configurations in: ${projectPath}`));
    
    const detector = new PortDetector();
    const detections = await detector.detectPortConfigurations(projectPath);

    if (options.format === 'json') {
      console.log(JSON.stringify(detections, null, 2));
      return;
    }

    if (detections.length === 0) {
      console.log(chalk.green('✓ No port configurations found'));
      return;
    }

    console.log(chalk.yellow(`\n⚠️  Found ${detections.length} port configuration(s):\n`));

    // Group by type
    const byType = detections.reduce((acc, det) => {
      if (!acc[det.type]) acc[det.type] = [];
      acc[det.type].push(det);
      return acc;
    }, {} as Record<string, typeof detections>);

    for (const [type, items] of Object.entries(byType)) {
      const typeLabel = type.replace('_', ' ').toUpperCase();
      console.log(chalk.cyan(`📁 ${typeLabel} (${items.length}):`));
      
      for (const det of items) {
        const severityColor =
          det.severity === 'error' ? chalk.red : det.severity === 'warning' ? chalk.yellow : chalk.gray;
        const portInfo = det.port ? chalk.yellow(` → port ${det.port}`) : '';
        const severityIcon = det.severity === 'error' ? '❌' : det.severity === 'warning' ? '⚠️ ' : 'ℹ️ ';
        
        console.log(severityColor(`  ${severityIcon} ${det.file}:${det.line}`));
        console.log(chalk.gray(`     Pattern: ${det.pattern}${portInfo}`));
        if (det.context && det.context.length > 0) {
          const context = det.context.length > 100 ? det.context.substring(0, 97) + '...' : det.context;
          console.log(chalk.gray(`     Context: ${context}`));
        }
        console.log('');
      }
    }

    // Summary
    const errorCount = detections.filter(d => d.severity === 'error').length;
    const warningCount = detections.filter(d => d.severity === 'warning').length;
    
    console.log(chalk.blue('\n📊 Summary:'));
    console.log(`  Total: ${detections.length}`);
    if (errorCount > 0) {
      console.log(chalk.red(`  Errors: ${errorCount} (default fallbacks that override Port Manager)`));
    }
    if (warningCount > 0) {
      console.log(chalk.yellow(`  Warnings: ${warningCount} (hardcoded ports)`));
    }
    
    console.log(chalk.yellow('\n💡 Recommendation: Update these to use Port Manager assigned port'));
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

