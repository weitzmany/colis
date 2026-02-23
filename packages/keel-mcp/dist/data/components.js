/**
 * Keel component registry.
 *
 * Sync requirement (package_docs_sync.mdc):
 * When a new component is added to @colis/keel, add an entry here
 * and update status to 'available' when the component ships.
 */
export const KEEL_COMPONENTS = [
    {
        name: 'KeelButtonComponent',
        selector: 'keel-button',
        importPath: '@colis/keel',
        status: 'available',
        description: 'Action button with separate variant and theme controls',
        phase: 1,
        inputs: [
            {
                name: 'variant',
                type: "'solid' | 'outline' | 'flat' | 'link'",
                default: 'solid',
                required: false,
                description: 'Structural style of the button',
            },
            {
                name: 'theme',
                type: "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'tertiary' | 'dark'",
                default: 'primary',
                required: false,
                description: 'Color theme used by the selected variant',
            },
            {
                name: 'size',
                type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
                default: 'md',
                required: false,
                description: 'Controls spacing and typography scale',
            },
            {
                name: 'rounded',
                type: 'boolean',
                default: false,
                required: false,
                description: 'If true, border radius becomes fully rounded',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: false,
                required: false,
                description: 'Disables the button, preventing interaction',
            },
            {
                name: 'loading',
                type: 'boolean',
                default: false,
                required: false,
                description: 'Shows a spinner and disables interaction while async work is running',
            },
        ],
        outputs: [
            {
                name: 'clicked',
                type: 'EventEmitter<void>',
                description: 'Emitted when button is clicked (not when disabled or loading)',
            },
        ],
        slots: [
            { name: 'default', description: 'Button label content' },
            { name: '[keelButtonIcon]', description: 'Reserved slot for future icon component' },
        ],
        cssTokens: [
            '--keel-color-primary',
            '--keel-color-primary-hover',
            '--keel-color-primary-active',
            '--keel-color-secondary',
            '--keel-color-success',
            '--keel-color-warning',
            '--keel-color-danger',
            '--keel-color-info',
            '--keel-color-tertiary',
            '--keel-space-sm',
            '--keel-space-lg',
            '--keel-button-min-size-xs',
            '--keel-button-min-size-sm',
            '--keel-button-min-size-md',
            '--keel-button-min-size-lg',
            '--keel-button-min-size-xl',
            '--keel-font-size-xs',
            '--keel-font-size-sm',
            '--keel-font-size-md',
            '--keel-radius-md',
            '--keel-radius-full',
            '--keel-font-size-lg',
            '--keel-font-size-xl',
            '--keel-font-weight-medium',
            '--keel-color-text-inverse',
        ],
        storyId: 'components-button--playground',
        docsPath: '/design-system/keel/components/button',
    },
    {
        name: 'KeelInputComponent',
        selector: 'keel-input',
        importPath: '@colis/keel',
        status: 'available',
        description: 'Text input field with Angular Forms support and validation states',
        phase: 1,
        inputs: [
            {
                name: 'type',
                type: "'text' | 'email' | 'password' | 'number' | 'search'",
                default: 'text',
                required: false,
                description: 'HTML input type',
            },
            {
                name: 'placeholder',
                type: 'string',
                required: false,
                description: 'Placeholder text',
            },
            {
                name: 'name',
                type: 'string',
                default: '',
                required: false,
                description: 'Native input name attribute',
            },
            {
                name: 'disabled',
                type: 'boolean',
                default: false,
                required: false,
                description: 'Disables the input',
            },
            {
                name: 'invalid',
                type: 'boolean',
                default: false,
                required: false,
                description: 'Marks the input as invalid (red border)',
            },
        ],
        outputs: [
            {
                name: 'valueChange',
                type: 'EventEmitter<string>',
                description: 'Emits the input value on every change',
            },
        ],
        slots: [
            { name: '[keelInputLabel]', description: 'Input label content' },
            { name: '[keelInputHelper]', description: 'Helper or error text below the input' },
        ],
        cssTokens: [
            '--keel-color-border',
            '--keel-color-bg-base',
            '--keel-color-text-base',
            '--keel-color-danger',
            '--keel-space-sm',
            '--keel-space-md',
            '--keel-radius-md',
        ],
        storyId: 'components-input--playground',
        docsPath: '/design-system/keel/components/input',
    },
    {
        name: 'KeelModalComponent',
        selector: 'keel-modal',
        importPath: '@colis/keel',
        status: 'planned',
        description: 'Accessible modal dialog with focus trap and keyboard support',
        phase: 2,
        inputs: [
            {
                name: 'open',
                type: 'boolean',
                default: false,
                required: true,
                description: 'Controls whether the modal is visible',
            },
            {
                name: 'closeOnBackdrop',
                type: 'boolean',
                default: true,
                required: false,
                description: 'Close modal when clicking outside',
            },
        ],
        outputs: [
            {
                name: 'closed',
                type: 'EventEmitter<void>',
                description: 'Emitted when the modal is dismissed',
            },
        ],
        slots: [
            { name: 'default', description: 'Modal body content' },
            { name: 'header', description: 'Modal header / title area' },
            { name: 'footer', description: 'Modal action buttons' },
        ],
        cssTokens: [
            '--keel-color-bg-base',
            '--keel-color-border',
            '--keel-radius-lg',
            '--keel-shadow-lg',
            '--keel-z-modal',
            '--keel-space-xl',
        ],
        storyId: null,
        docsPath: '/design-system/keel/components/modal',
    },
];
export function getComponentBySelector(selector) {
    return KEEL_COMPONENTS.find((c) => c.selector === selector || c.name.toLowerCase().includes(selector.toLowerCase()));
}
//# sourceMappingURL=components.js.map