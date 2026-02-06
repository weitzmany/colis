/**
 * PHP Installation Checker and Debugger
 *
 * Comprehensive PHP detection with detailed debugging information
 */
export interface PhpCheckResult {
    isAvailable: boolean;
    phpPath: string | null;
    phpVersion: string | null;
    inPath: boolean;
    homebrewInstalled: boolean;
    composerAvailable: boolean;
    issues: string[];
    recommendations: string[];
}
/**
 * Comprehensive PHP availability check with debugging
 */
export declare function checkPhp(verbose?: boolean): PhpCheckResult;
/**
 * Quick PHP availability check (no output)
 */
export declare function isPhpAvailable(): boolean;
/**
 * Print PHP installation instructions
 */
export declare function printPhpInstallInstructions(): void;
/**
 * Print PATH fix instructions for Homebrew PHP
 */
export declare function printPathFixInstructions(_phpPath: string): void;
//# sourceMappingURL=php-checker.d.ts.map