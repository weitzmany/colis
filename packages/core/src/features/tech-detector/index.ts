/**
 * Tech Detector Feature
 * 
 * Public API exports for technology stack detection.
 */

export { TechDetector } from './tech-detector.js';
export { FrameworkDetector } from './detectors/framework-detector.js';
export { LanguageDetector } from './detectors/language-detector.js';
export { BuildToolDetector } from './detectors/build-tool-detector.js';
export { PackageManagerDetector } from './detectors/package-manager-detector.js';
export { RuntimeDetector } from './detectors/runtime-detector.js';
export { ConfigMapper } from './mappers/config-mapper.js';
export { PackageJsonMapper } from './mappers/package-json-mapper.js';
export * from './types.js';




