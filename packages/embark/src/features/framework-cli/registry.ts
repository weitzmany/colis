/**
 * Framework CLI Registry
 * 
 * Manages registration and lookup of framework CLI implementations.
 */

import { FrameworkCli } from './types.js';
import { AngularCli } from './angular-cli.js';
import { SlimCli } from './slim-cli.js';

/**
 * Registry for framework CLI implementations
 */
export class FrameworkCliRegistry {
  private clis: Map<string, FrameworkCli> = new Map();
  
  constructor() {
    // Register built-in CLIs
    this.register(new AngularCli());
    this.register(new SlimCli());
  }
  
  /**
   * Register a framework CLI implementation
   */
  register(cli: FrameworkCli): void {
    this.clis.set(cli.name, cli);
  }
  
  /**
   * Get a framework CLI by name
   */
  get(name: string): FrameworkCli | undefined {
    return this.clis.get(name.toLowerCase());
  }
  
  /**
   * Find a framework CLI that should handle the given template type
   */
  find(templateType: string): FrameworkCli | undefined {
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
  getAll(): FrameworkCli[] {
    return Array.from(this.clis.values());
  }
  
  /**
   * Check if a framework CLI is registered
   */
  has(name: string): boolean {
    return this.clis.has(name.toLowerCase());
  }
}

/**
 * Global framework CLI registry instance
 */
export const frameworkCliRegistry = new FrameworkCliRegistry();
