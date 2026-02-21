/**
 * Usage examples for keel components.
 *
 * Sync requirement (package_docs_sync.mdc):
 * Add examples here when new components are added to @colis/keel.
 */
export const COMPONENT_EXAMPLES = [
    // keel-button (available)
    {
        component: 'keel-button',
        title: 'Solid primary button',
        variant: 'solid',
        description: 'Default solid variant with primary theme',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button variant="solid" theme="primary">Save changes</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'Outline secondary button',
        variant: 'outline',
        description: 'Outline variant using secondary theme',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button variant="outline" theme="secondary">Cancel</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'Flat warning button',
        variant: 'flat',
        description: 'Flat variant for low-emphasis warning actions',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button variant="flat" theme="warning">Review</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'Link danger button',
        variant: 'link',
        description: 'Link-like button with danger theme',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button variant="link" theme="danger">Delete account</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'Large rounded button',
        variant: 'solid',
        description: 'Large button with full pill radius',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button size="lg" [rounded]="true">Continue</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'Disabled state',
        variant: 'solid',
        description: 'Disabled button (no interaction)',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button [disabled]="true">Cannot submit</keel-button>',
    },
    {
        component: 'keel-button',
        title: 'With event binding',
        variant: 'solid',
        description: 'Listen to the clicked output',
        imports: "import { KeelButtonComponent } from '@colis/keel';",
        componentDecorator: "@Component({ standalone: true, imports: [KeelButtonComponent] })",
        template: '<keel-button (clicked)="onSave()">Save</keel-button>',
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