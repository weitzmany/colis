/**
 * Usage examples for keel components.
 *
 * Sync requirement (package_docs_sync.mdc):
 * Add examples here when new components are added to @colis/keel.
 */
export const COMPONENT_EXAMPLES = [
    // keel-button (Phase 2 — placeholder until component ships)
    {
        component: 'keel-button',
        title: 'Primary button',
        variant: 'primary',
        description: 'Basic primary action button',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button variant="primary">Save changes</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'Secondary button',
        variant: 'secondary',
        description: 'Secondary action button',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button variant="secondary">Cancel</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'Danger button',
        variant: 'danger',
        description: 'Destructive action button',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button variant="danger">Delete account</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'Disabled state',
        variant: 'primary',
        description: 'Disabled button (no interaction)',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button variant="primary" [disabled]="true">Cannot submit</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'Loading state',
        variant: 'primary',
        description: 'Button with loading spinner',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button variant="primary" [loading]="isSaving">Saving...</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'With event binding',
        variant: 'primary',
        description: 'Listen to the clicked output',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button variant="primary" (clicked)="onSave()">Save</keel-button>',
    },
    // keel-input (Phase 2 — placeholder until component ships)
    {
        component: 'keel-input',
        title: 'Basic text input',
        description: 'Simple text input with label',
        imports: "import { KeelInputComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelInputComponent] })",
        template: `<keel-input placeholder="Enter your name">
  <span slot="label">Full name</span>
</keel-input>`,
    },
    {
        component: 'keel-input',
        title: 'Invalid state',
        description: 'Input with validation error',
        imports: "import { KeelInputComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelInputComponent] })",
        template: `<keel-input [invalid]="true" placeholder="email@example.com">
  <span slot="label">Email</span>
  <span slot="helper">Please enter a valid email address</span>
</keel-input>`,
    },
];
export function getExamplesForComponent(component, variant) {
    return COMPONENT_EXAMPLES.filter((e) => e.component === component && (!variant || e.variant === variant));
}
//# sourceMappingURL=examples.js.map