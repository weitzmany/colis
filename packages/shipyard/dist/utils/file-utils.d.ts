import type { ApplyResult } from '../types';
export declare function createApplyResult(): ApplyResult;
export declare function ensureShipyardScripts(projectRoot: string, packageJson: Record<string, unknown>): Promise<{
    changed: boolean;
    packageJson: Record<string, unknown>;
    warnings: string[];
    touchedFiles: string[];
}>;
export declare function writeFileIfAllowed(projectRoot: string, relativePath: string, content: string, force: boolean, result: ApplyResult): Promise<void>;
//# sourceMappingURL=file-utils.d.ts.map