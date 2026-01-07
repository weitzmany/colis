/**
 * Detect Command
 * 
 * CLI command for technology stack detection.
 */

import { TechDetector } from '../../tech-detector';
import { PackageJsonMapper } from '../../mappers/package-json-mapper';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export async function detectCommand(options: {
  path?: string;
  save?: boolean;
  format?: string;
  update?: boolean;
}) {
  try {
    const projectPath = options.path ? path.resolve(options.path) : process.cwd();
    
    if (!(await fs.pathExists(projectPath))) {
      console.error(chalk.red(`Error: Path does not exist: ${projectPath}`));
      process.exit(1);
    }

    const detector = new TechDetector();
    let techStack;

    if (options.update) {
      console.log(chalk.blue('🔄 Updating technology stack...'));
      techStack = await detector.update(projectPath);
    } else {
      console.log(chalk.blue('🔍 Detecting technology stack...'));
      techStack = await detector.detect(projectPath);
    }

    // Output based on format
    if (options.format === 'json') {
      console.log(JSON.stringify(techStack, null, 2));
    } else if (options.format === 'table') {
      printTable(techStack);
    } else {
      printText(techStack);
    }

    // Save if requested
    if (options.save) {
      await detector.save(projectPath, techStack);
      console.log(chalk.green('\n✓ Saved to .core-tech.json'));

      // Also update package.json
      const packageJsonPath = path.join(projectPath, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        try {
          const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
          const mapper = new PackageJsonMapper();
          const updated = mapper.mergeIntoPackageJson(packageJson, techStack);
          await fs.writeFile(
            packageJsonPath,
            JSON.stringify(updated, null, 2),
            'utf-8'
          );
          console.log(chalk.green('✓ Updated package.json'));
        } catch (error) {
          console.warn(chalk.yellow('⚠ Could not update package.json'));
        }
      }
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error}`));
    process.exit(1);
  }
}

/**
 * Print tech stack in text format
 */
function printText(techStack: any) {
  console.log(chalk.cyan('\n📦 Technology Stack:'));
  
  if (techStack.framework) {
    console.log(chalk.green(`\n  Framework: ${techStack.framework.name}`));
    if (techStack.framework.version) {
      console.log(chalk.gray(`    Version: ${techStack.framework.version}`));
    }
    if (techStack.framework.configFile) {
      console.log(chalk.gray(`    Config: ${techStack.framework.configFile}`));
    }
  }

  if (techStack.languages.length > 0) {
    console.log(chalk.green('\n  Languages:'));
    for (const lang of techStack.languages) {
      const primary = lang.primary ? ' (primary)' : '';
      console.log(chalk.gray(`    ${lang.name}${primary}`));
      if (lang.version) {
        console.log(chalk.gray(`      Version: ${lang.version}`));
      }
      if (lang.fileCount) {
        console.log(chalk.gray(`      Files: ${lang.fileCount}`));
      }
    }
  }

  if (techStack.buildTools.length > 0) {
    console.log(chalk.green('\n  Build Tools:'));
    for (const tool of techStack.buildTools) {
      console.log(chalk.gray(`    ${tool.name}`));
      if (tool.version) {
        console.log(chalk.gray(`      Version: ${tool.version}`));
      }
      if (tool.configFile) {
        console.log(chalk.gray(`      Config: ${tool.configFile}`));
      }
    }
  }

  console.log(chalk.green(`\n  Package Manager: ${techStack.packageManager.name}`));
  if (techStack.packageManager.version) {
    console.log(chalk.gray(`    Version: ${techStack.packageManager.version}`));
  }
  if (techStack.packageManager.lockFile) {
    console.log(chalk.gray(`    Lock File: ${techStack.packageManager.lockFile}`));
  }

  if (techStack.runtime) {
    console.log(chalk.green(`\n  Runtime: ${techStack.runtime.name}`));
    if (techStack.runtime.version) {
      console.log(chalk.gray(`    Version: ${techStack.runtime.version}`));
    }
    if (techStack.runtime.minVersion) {
      console.log(chalk.gray(`    Min Version: ${techStack.runtime.minVersion}`));
    }
  }

  console.log(chalk.gray(`\n  Detected: ${techStack.detectedAt}`));
}

/**
 * Print tech stack in table format
 */
function printTable(techStack: any) {
  console.log(chalk.cyan('\n📦 Technology Stack:\n'));
  
  const rows: string[][] = [];
  
  if (techStack.framework) {
    rows.push(['Framework', techStack.framework.name, techStack.framework.version || 'N/A']);
  }
  
  const primaryLang = techStack.languages.find((l: any) => l.primary) || techStack.languages[0];
  if (primaryLang) {
    rows.push(['Primary Language', primaryLang.name, primaryLang.version || 'N/A']);
  }
  
  if (techStack.buildTools.length > 0) {
    rows.push(['Build Tool', techStack.buildTools[0].name, techStack.buildTools[0].version || 'N/A']);
  }
  
  rows.push(['Package Manager', techStack.packageManager.name, techStack.packageManager.version || 'N/A']);
  
  if (techStack.runtime) {
    rows.push(['Runtime', techStack.runtime.name, techStack.runtime.version || techStack.runtime.minVersion || 'N/A']);
  }
  
  // Calculate column widths
  const colWidths = [0, 0, 0];
  for (const row of rows) {
    colWidths[0] = Math.max(colWidths[0], row[0].length);
    colWidths[1] = Math.max(colWidths[1], row[1].length);
    colWidths[2] = Math.max(colWidths[2], row[2].length);
  }
  
  // Print header
  console.log(
    chalk.bold(
      '  ' +
      'Category'.padEnd(colWidths[0] + 2) +
      'Name'.padEnd(colWidths[1] + 2) +
      'Version'
    )
  );
  console.log(chalk.gray('  ' + '-'.repeat(colWidths[0] + colWidths[1] + colWidths[2] + 6)));
  
  // Print rows
  for (const row of rows) {
    console.log(
      '  ' +
      row[0].padEnd(colWidths[0] + 2) +
      row[1].padEnd(colWidths[1] + 2) +
      row[2]
    );
  }
}

