/**
 * NPM Version Fetcher
 *
 * Fetches the latest version of npm packages from the npm registry.
 */
/**
 * Fetch the latest version of an npm package
 *
 * @param packageName - The npm package name (e.g., '@angular/core')
 * @param tag - The npm dist-tag to fetch (default: 'latest')
 * @returns The version string (e.g., '21.0.0') or null if not found
 */
export declare function getLatestNpmVersion(packageName: string, tag?: string): Promise<string | null>;
/**
 * Fetch the latest Angular version
 *
 * @returns The latest Angular version string or a fallback version
 */
export declare function getLatestAngularVersion(): Promise<string>;
/**
 * Get compatible versions for Angular ecosystem packages
 *
 * @param angularVersion - The Angular version (e.g., '21.0.0')
 * @returns Object with compatible package versions
 */
export declare function getAngularEcosystemVersions(angularVersion: string): Promise<{
    angular: string;
    typescript: string;
    node: string;
    rxjs: string;
    tslib: string;
    zoneJs: string;
}>;
export declare function getLatestVersionCached(packageName: string): Promise<string | null>;
//# sourceMappingURL=npm-version-fetcher.d.ts.map