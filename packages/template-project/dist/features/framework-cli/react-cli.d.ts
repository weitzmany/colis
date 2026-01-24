/**
 * React CLI Integration (Placeholder)
 *
 * TODO: Implement React CLI integration using create-react-app or Vite
 */
import { FrameworkCli, FrameworkCliOptions, FrameworkCliResult } from './types.js';
/**
 * React CLI implementation
 *
 * @example
 * // Using create-react-app
 * npx create-react-app my-app --template typescript
 *
 * // Or using Vite
 * npm create vite@latest my-app -- --template react-ts
 */
export declare class ReactCli implements FrameworkCli {
    name: string;
    displayName: string;
    shouldUse(templateType: string): boolean;
    create(_options: FrameworkCliOptions): Promise<FrameworkCliResult>;
}
//# sourceMappingURL=react-cli.d.ts.map