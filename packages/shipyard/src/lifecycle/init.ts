import chalk from 'chalk';
import type { ApplyResult, InitOptions, LandfallInstallOptions } from '../types';
import { installDockside } from '../features/dockside';
import { installPassage } from '../features/passage';
import { installLandfall } from '../features/landfall';

function mergeResults(target: ApplyResult, source: ApplyResult): void {
  target.updatedFiles.push(...source.updatedFiles);
  target.skippedFiles.push(...source.skippedFiles);
  target.warnings.push(...source.warnings);
}

export async function init(options: InitOptions): Promise<ApplyResult> {
  const result: ApplyResult = {
    updatedFiles: [],
    skippedFiles: [],
    warnings: []
  };

  console.log(chalk.blue('\n⚓ Shipyard init'));
  console.log(chalk.gray(`Target: ${options.projectRoot}`));

  const docksideResult = await installDockside({
    projectRoot: options.projectRoot,
    force: options.force
  });
  mergeResults(result, docksideResult);

  const passageResult = await installPassage({
    projectRoot: options.projectRoot,
    force: options.force
  });
  mergeResults(result, passageResult);

  const landfallOptions: LandfallInstallOptions = {
    projectRoot: options.projectRoot,
    force: options.force,
    awsRegion: options.landfall?.awsRegion || 'us-east-1',
    ecsCluster: options.landfall?.ecsCluster || 'your-ecs-cluster',
    ecsService: options.landfall?.ecsService || 'your-ecs-service',
    s3Bucket: options.landfall?.s3Bucket || 'your-frontend-bucket',
    cloudFrontDistributionId:
      options.landfall?.cloudFrontDistributionId || 'YOUR_DISTRIBUTION_ID'
  };

  const landfallResult = await installLandfall(landfallOptions);
  mergeResults(result, landfallResult);

  if (result.updatedFiles.length > 0) {
    console.log(chalk.green(`\n✓ Updated ${result.updatedFiles.length} file(s)`));
  }
  if (result.skippedFiles.length > 0) {
    console.log(chalk.yellow(`⚠ Skipped ${result.skippedFiles.length} file(s) (use --force to overwrite)`));
  }
  if (result.warnings.length > 0) {
    console.log(chalk.yellow('\nWarnings:'));
    for (const warning of result.warnings) {
      console.log(chalk.yellow(`- ${warning}`));
    }
  }

  return result;
}
