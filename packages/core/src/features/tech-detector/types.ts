/**
 * Tech Detector Types
 * 
 * TypeScript interfaces for technology stack detection
 */

export interface TechStack {
  framework?: FrameworkInfo;
  languages: LanguageInfo[];
  buildTools: BuildToolInfo[];
  packageManager: PackageManagerInfo;
  runtime?: RuntimeInfo;
  detectedAt: string;
  version: string;
}

export interface FrameworkInfo {
  name: string;
  type: 'nextjs' | 'angular' | 'react' | 'vue' | 'svelte' | 'express' | 'django' | 'laravel' | 'flask' | null;
  version?: string;
  configFile?: string;
}

export interface LanguageInfo {
  name: string;
  type: 'typescript' | 'javascript' | 'python' | 'php' | 'java' | 'go' | 'rust';
  version?: string;
  fileCount?: number;
  primary?: boolean;
}

export interface BuildToolInfo {
  name: string;
  type: 'webpack' | 'vite' | 'rollup' | 'esbuild' | 'parcel' | 'angular-cli' | 'next-cli' | 'turbopack';
  version?: string;
  configFile?: string;
}

export interface PackageManagerInfo {
  name: string;
  type: 'npm' | 'yarn' | 'pnpm' | 'pip' | 'composer' | 'maven' | 'gradle';
  version?: string;
  lockFile?: string;
}

export interface RuntimeInfo {
  name: string;
  type: 'node' | 'python' | 'php' | 'java';
  version?: string;
  minVersion?: string;
  specifiedVersion?: string;
}

