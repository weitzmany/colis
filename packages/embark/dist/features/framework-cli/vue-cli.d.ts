/**
 * Vue CLI Integration (Placeholder)
 *
 * TODO: Implement Vue CLI integration using @vue/cli or create-vue
 */
import { FrameworkCli, FrameworkCliOptions, FrameworkCliResult } from './types.js';
/**
 * Vue CLI implementation
 *
 * @example
 * // Using @vue/cli
 * npx @vue/cli create my-app
 *
 * // Or using create-vue (Vite-powered)
 * npm create vue@latest my-app
 */
export declare class VueCli implements FrameworkCli {
    name: string;
    displayName: string;
    shouldUse(templateType: string): boolean;
    create(_options: FrameworkCliOptions): Promise<FrameworkCliResult>;
}
//# sourceMappingURL=vue-cli.d.ts.map