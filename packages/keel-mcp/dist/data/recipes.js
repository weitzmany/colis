/**
 * Theming recipes — step-by-step guides for common hull/keel setup tasks.
 */
export const THEMING_RECIPES = [
    {
        id: 'keel-only',
        title: 'Use keel without hull',
        description: 'Install and configure @colis/keel with built-in CSS token defaults, no @colis/hull required.',
        prerequisites: ['@colis/keel'],
        steps: [
            {
                step: 1,
                description: 'Install keel',
                code: 'npm install @colis/keel',
                language: 'bash',
            },
            {
                step: 2,
                description: 'Add keel token defaults to angular.json styles array',
                code: JSON.stringify({
                    styles: [
                        'node_modules/@colis/keel/src/tokens/defaults.css',
                        'src/styles.css',
                    ],
                }, null, 2),
                language: 'json',
            },
            {
                step: 3,
                description: 'Import a component in your Angular standalone component',
                code: `import { KeelButtonComponent } from '@colis/keel';

@Component({
  standalone: true,
  imports: [KeelButtonComponent],
  template: \`<keel-button variant="primary">Click me</keel-button>\`
})
export class MyComponent {}`,
                language: 'typescript',
            },
        ],
        docsPath: '/design-system/getting-started/without-hull',
    },
    {
        id: 'with-hull',
        title: 'Add hull to keel',
        description: 'Install @colis/hull on top of @colis/keel for a full design system with light/dark themes.',
        prerequisites: ['@colis/keel', '@colis/hull'],
        steps: [
            {
                step: 1,
                description: 'Install keel and hull',
                code: 'npm install @colis/keel @colis/hull',
                language: 'bash',
            },
            {
                step: 2,
                description: 'Replace keel defaults with hull styles in angular.json',
                code: JSON.stringify({
                    styles: [
                        'node_modules/@colis/hull/src/styles.css',
                        'src/styles.css',
                    ],
                }, null, 2),
                language: 'json',
                note: 'Hull includes keel token defaults — do not add both.',
            },
        ],
        docsPath: '/design-system/getting-started/with-hull',
    },
    {
        id: 'dark-mode',
        title: 'Enable dark mode with hull',
        description: 'Activate the hull dark theme using CSS class, data attribute, or system preference.',
        prerequisites: ['@colis/keel', '@colis/hull'],
        steps: [
            {
                step: 1,
                description: 'Install hull (includes dark theme)',
                code: 'npm install @colis/keel @colis/hull',
                language: 'bash',
            },
            {
                step: 2,
                description: 'Add hull-dark class to <html> for dark mode',
                code: '<html class="hull-dark">',
                language: 'html',
            },
            {
                step: 3,
                description: 'Or toggle programmatically in Angular',
                code: `// In your theme service
toggleDarkMode(isDark: boolean): void {
  document.documentElement.classList.toggle('hull-dark', isDark);
}`,
                language: 'typescript',
            },
        ],
        docsPath: '/design-system/hull/dark-mode',
    },
    {
        id: 'project-theme',
        title: 'Apply project brand (Layer 3)',
        description: 'Override --keel-* tokens to apply your project brand on top of hull.',
        prerequisites: ['@colis/keel', '@colis/hull'],
        steps: [
            {
                step: 1,
                description: 'Create your project theme CSS file',
                code: `/* src/styles/hull.theme.css */
:root {
  --keel-color-primary:        #7c3aed;   /* brand purple */
  --keel-color-primary-hover:  #6d28d9;
  --keel-font-family:          'Geist', sans-serif;
  --keel-radius-md:            8px;
}`,
                language: 'css',
            },
            {
                step: 2,
                description: 'Import after hull in angular.json (order matters)',
                code: JSON.stringify({
                    styles: [
                        'node_modules/@colis/hull/src/styles.css',
                        'src/styles/hull.theme.css',
                        'src/styles.css',
                    ],
                }, null, 2),
                language: 'json',
            },
            {
                step: 3,
                description: 'For dark mode brand overrides, scope to .hull-dark',
                code: `/* src/styles/hull.theme.css */
:root {
  --keel-color-primary: #7c3aed;
}

.hull-dark {
  --keel-color-primary: #a78bfa;   /* lighter for dark backgrounds */
}`,
                language: 'css',
            },
        ],
        docsPath: '/design-system/hull/project-theming',
    },
];
export function getRecipeById(id) {
    return THEMING_RECIPES.find((r) => r.id === id);
}
//# sourceMappingURL=recipes.js.map