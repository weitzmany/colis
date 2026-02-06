/**
 * Framework CLI Registry
 *
 * Manages registration and lookup of framework CLI implementations.
 */
import { AngularCli } from './angular-cli.js';
import { SlimCli } from './slim-cli.js';
/**
 * Registry for framework CLI implementations
 */
export class FrameworkCliRegistry {
    clis = new Map();
    constructor() {
        // Register built-in CLIs
        this.register(new AngularCli());
        this.register(new SlimCli());
    }
    /**
     * Register a framework CLI implementation
     */
    register(cli) {
        this.clis.set(cli.name, cli);
    }
    /**
     * Get a framework CLI by name
     */
    get(name) {
        return this.clis.get(name.toLowerCase());
    }
    /**
     * Find a framework CLI that should handle the given template type
     */
    find(templateType) {
        for (const cli of this.clis.values()) {
            if (cli.shouldUse(templateType)) {
                return cli;
            }
        }
        return undefined;
    }
    /**
     * Get all registered framework CLIs
     */
    getAll() {
        return Array.from(this.clis.values());
    }
    /**
     * Check if a framework CLI is registered
     */
    has(name) {
        return this.clis.has(name.toLowerCase());
    }
}
/**
 * Global framework CLI registry instance
 */
export const frameworkCliRegistry = new FrameworkCliRegistry();
//# sourceMappingURL=registry.js.map