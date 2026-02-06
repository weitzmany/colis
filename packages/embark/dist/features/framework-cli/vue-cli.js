/**
 * Vue CLI Integration (Placeholder)
 *
 * TODO: Implement Vue CLI integration using @vue/cli or create-vue
 */
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
export class VueCli {
    name = 'vue';
    displayName = 'Vue';
    shouldUse(templateType) {
        return templateType.toLowerCase().includes('vue');
    }
    async create(_options) {
        // TODO: Implement Vue project creation
        // Options:
        // 1. @vue/cli (traditional Vue CLI)
        // 2. create-vue (Vite-powered, recommended)
        throw new Error('Vue CLI integration not yet implemented');
    }
}
//# sourceMappingURL=vue-cli.js.map