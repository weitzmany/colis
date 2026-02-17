import { execSync } from 'child_process';

export interface ShipyardRunOptions {
  projectPath: string;
  force?: boolean;
  dryRun?: boolean;
}

export interface ShipyardRunResult {
  success: boolean;
  warnings: string[];
  output?: string;
}

export function runShipyardInit(options: ShipyardRunOptions): ShipyardRunResult {
  const result: ShipyardRunResult = {
    success: false,
    warnings: []
  };

  if (options.dryRun) {
    result.success = true;
    result.output = 'dry-run: npx shipyard init';
    return result;
  }

  const forceFlag = options.force ? ' --force' : '';
  const command = `npx shipyard init${forceFlag}`;

  try {
    const output = execSync(command, {
      cwd: options.projectPath,
      encoding: 'utf-8'
    });
    result.success = true;
    result.output = output;
    return result;
  } catch (error: any) {
    let stderr = '';
    let stdout = '';

    if (error && typeof error === 'object') {
      const err = error as { stderr?: unknown; stdout?: unknown };
      stderr = String(err.stderr || '');
      stdout = String(err.stdout || '');
    }

    const combined = `${stdout}\n${stderr}`.trim();

    if (combined.length > 0) {
      result.warnings.push(`Shipyard initialization failed: ${combined.split('\n')[0]}`);
    } else {
      result.warnings.push('Shipyard initialization failed. Ensure @colis/shipyard is installed in the target project.');
    }
    return result;
  }
}
