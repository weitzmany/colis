/**
 * Detect Command
 * 
 * CLI command for technology stack detection.
 */

import { TechDetector } from '../../tech-detector.js';
import { PackageJsonMapper } from '../../mappers/package-json-mapper.js';
import { StandardsLoader } from '../../standards/standards-loader.js';
import { WarningDetector } from '../../standards/warning-detector.js';
import { WarningHandler } from '../../standards/warning-handler.js';
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';

export async function detectCommand(options: {
  path?: string;
  save?: boolean;
  format?: string;
  update?: boolean;
  'check-standards'?: boolean;
  'skip-warnings'?: boolean;
  interactive?: boolean;
  'fail-on-warning'?: boolean;
  'report'?: string;
}) {
  try {
    const projectPath = options.path ? path.resolve(options.path) : process.cwd();
    
    if (!(await fs.pathExists(projectPath))) {
      console.error(chalk.red(`Error: Path does not exist: ${projectPath}`));
      process.exit(1);
    }

    // Detect CI/CD environment
    const isCI = detectCIEnvironment();
    if (isCI) {
      console.log(chalk.blue('🤖 CI/CD environment detected'));
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

    // Check standards and show warnings (if enabled)
    const checkStandards = options['check-standards'] !== false;
    const skipWarnings = options['skip-warnings'] === true;
    const interactive = options.interactive !== false && !isCI; // Disable interactive in CI
    const failOnWarning = options['fail-on-warning'] === true;
    let hasWarnings = false;

    if (checkStandards && !skipWarnings) {
      try {
        const standardsLoader = new StandardsLoader();
        const warningDetector = new WarningDetector();
        const warningHandler = new WarningHandler();

        const standards = await standardsLoader.loadStandards(projectPath);
        const userChoices = await standardsLoader.loadUserChoices(projectPath);

        const warnings = await warningDetector.detectWarnings(techStack, standards, userChoices);

        if (warnings.length > 0) {
          hasWarnings = true;
          
          // Generate JSON report if requested
          if (options.report) {
            await generateCIReport(techStack, warnings, options.report);
            console.log(chalk.green(`✓ Report saved to ${options.report}`));
          }

          await warningHandler.handleWarnings(warnings, projectPath, interactive);

          // Exit with error code if fail-on-warning is enabled
          if (failOnWarning) {
            console.error(chalk.red(`\n✗ ${warnings.length} warning(s) detected. Failing build due to --fail-on-warning flag.`));
            process.exit(2); // Exit code 2 for warnings
          }
        }
      } catch (error: any) {
        console.warn(chalk.yellow(`⚠ Standards checking failed: ${error.message}`));
        // Continue execution even if standards checking fails
      }
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

/**
 * Detect CI/CD environment
 */
function detectCIEnvironment(): boolean {
  const ciEnvVars = [
    'CI',
    'CONTINUOUS_INTEGRATION',
    'GITHUB_ACTIONS',
    'GITLAB_CI',
    'CIRCLECI',
    'TRAVIS',
    'JENKINS_URL',
    'BUILDKITE',
    'DRONE',
    'BITBUCKET_PIPELINES_BUILD_NUMBER',
    'AWS_CODEBUILD_BUILD_ID',
    'AZURE_PIPELINES',
    'TEAMCITY_VERSION',
  ];

  return ciEnvVars.some((envVar) => process.env[envVar] === 'true' || process.env[envVar] !== undefined);
}

/**
 * Generate CI/CD report in JSON format
 */
async function generateCIReport(
  techStack: any,
  warnings: any[],
  reportPath: string
): Promise<void> {
  const report = {
    timestamp: new Date().toISOString(),
    ci: {
      detected: detectCIEnvironment(),
      provider: getCIProvider(),
    },
    techStack: {
      framework: techStack.framework ? {
        name: techStack.framework.name,
        version: techStack.framework.version,
      } : null,
      languages: techStack.languages.map((l: any) => ({
        name: l.name,
        version: l.version,
        primary: l.primary,
      })),
      buildTools: techStack.buildTools.map((bt: any) => ({
        name: bt.name,
        version: bt.version,
      })),
      packageManager: {
        name: techStack.packageManager.name,
        version: techStack.packageManager.version,
      },
      runtime: techStack.runtime ? {
        name: techStack.runtime.name,
        version: techStack.runtime.version,
      } : null,
    },
    warnings: {
      count: warnings.length,
      items: warnings.map((w) => ({
        type: w.type,
        category: w.category,
        detected: w.detected,
        recommended: w.recommended,
        minimumVersion: w.minimumVersion,
        message: w.message,
      })),
    },
    summary: {
      hasWarnings: warnings.length > 0,
      nonRecommendedCount: warnings.filter((w) => w.type === 'non-recommended').length,
      outdatedVersionCount: warnings.filter((w) => w.type === 'outdated-version').length,
    },
  };

  await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8');
}

/**
 * Get CI provider name
 */
function getCIProvider(): string | null {
  if (process.env.GITHUB_ACTIONS) return 'GitHub Actions';
  if (process.env.GITLAB_CI) return 'GitLab CI';
  if (process.env.CIRCLECI) return 'CircleCI';
  if (process.env.TRAVIS) return 'Travis CI';
  if (process.env.JENKINS_URL) return 'Jenkins';
  if (process.env.BUILDKITE) return 'Buildkite';
  if (process.env.DRONE) return 'Drone';
  if (process.env.BITBUCKET_PIPELINES_BUILD_NUMBER) return 'Bitbucket Pipelines';
  if (process.env.AWS_CODEBUILD_BUILD_ID) return 'AWS CodeBuild';
  if (process.env.AZURE_PIPELINES) return 'Azure Pipelines';
  if (process.env.TEAMCITY_VERSION) return 'TeamCity';
  if (process.env.CI) return 'Generic CI';
  return null;
}
