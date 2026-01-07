/**
 * Tech Detector Feature
 * 
 * Public API exports for technology stack detection.
 */

export { TechDetector } from './tech-detector';
export { FrameworkDetector } from './detectors/framework-detector';
export { LanguageDetector } from './detectors/language-detector';
export { BuildToolDetector } from './detectors/build-tool-detector';
export { PackageManagerDetector } from './detectors/package-manager-detector';
export { RuntimeDetector } from './detectors/runtime-detector';
export { ConfigMapper } from './mappers/config-mapper';
export { PackageJsonMapper } from './mappers/package-json-mapper';
export * from './types';

