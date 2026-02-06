/**
 * Framework CLI Registry
 *
 * Manages registration and lookup of framework CLI implementations.
 */
import { FrameworkCli } from './types.js';
/**
 * Registry for framework CLI implementations
 */
export declare class FrameworkCliRegistry {
    private clis;
    constructor();
    /**
     * Register a framework CLI implementation
     */
    register(cli: FrameworkCli): void;
    /**
     * Get a framework CLI by name
     */
    get(name: string): FrameworkCli | undefined;
    /**
     * Find a framework CLI that should handle the given template type
     */
    find(templateType: string): FrameworkCli | undefined;
    /**
     * Get all registered framework CLIs
     */
    getAll(): FrameworkCli[];
    /**
     * Check if a framework CLI is registered
     */
    has(name: string): boolean;
}
/**
 * Global framework CLI registry instance
 */
export declare const frameworkCliRegistry: FrameworkCliRegistry;
//# sourceMappingURL=registry.d.ts.map