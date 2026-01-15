/**
 * NPM Version Fetcher
 * 
 * Fetches the latest version of npm packages from the npm registry.
 */

import https from 'https';

/**
 * Fetch the latest version of an npm package
 * 
 * @param packageName - The npm package name (e.g., '@angular/core')
 * @param tag - The npm dist-tag to fetch (default: 'latest')
 * @returns The version string (e.g., '21.0.0') or null if not found
 */
export async function getLatestNpmVersion(
  packageName: string,
  tag: string = 'latest'
): Promise<string | null> {
  return new Promise((resolve) => {
    const url = `https://registry.npmjs.org/${packageName}`;
    
    https.get(url, { timeout: 5000 }, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const version = json['dist-tags']?.[tag];
          resolve(version || null);
        } catch (error) {
          console.warn(`Failed to parse npm registry response for ${packageName}`);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.warn(`Failed to fetch version for ${packageName}:`, error.message);
      resolve(null);
    }).on('timeout', () => {
      console.warn(`Timeout fetching version for ${packageName}`);
      resolve(null);
    });
  });
}

/**
 * Fetch the latest Angular version
 * 
 * @returns The latest Angular version string or a fallback version
 */
export async function getLatestAngularVersion(): Promise<string> {
  const version = await getLatestNpmVersion('@angular/core', 'latest');
  
  if (!version) {
    console.warn('Could not fetch latest Angular version, using fallback: 21.0.0');
    return '21.0.0'; // Fallback to a known stable version
  }
  
  return version;
}

/**
 * Get compatible versions for Angular ecosystem packages
 * 
 * @param angularVersion - The Angular version (e.g., '21.0.0')
 * @returns Object with compatible package versions
 */
export async function getAngularEcosystemVersions(angularVersion: string): Promise<{
  angular: string;
  typescript: string;
  node: string;
  rxjs: string;
  tslib: string;
  zoneJs: string;
}> {
  const major = parseInt(angularVersion.split('.')[0], 10);
  
  // Version compatibility matrix based on Angular documentation
  // https://angular.dev/reference/versions
  let typescript = '~5.6.0';
  let node = '^22.0.0';
  let rxjs = '^7.8.0';
  let tslib = '^2.8.0';
  let zoneJs = '^0.15.0';
  
  // Adjust based on Angular version if needed
  if (major < 21) {
    typescript = '~5.5.0';
    node = '^20.0.0';
    tslib = '^2.6.0';
    zoneJs = '^0.14.0';
  }
  
  return {
    angular: angularVersion,
    typescript,
    node,
    rxjs,
    tslib,
    zoneJs,
  };
}

/**
 * Fetch the latest version of a package with caching
 */
const versionCache = new Map<string, { version: string; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function getLatestVersionCached(packageName: string): Promise<string | null> {
  const cached = versionCache.get(packageName);
  const now = Date.now();
  
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.version;
  }
  
  const version = await getLatestNpmVersion(packageName);
  
  if (version) {
    versionCache.set(packageName, { version, timestamp: now });
  }
  
  return version;
}
