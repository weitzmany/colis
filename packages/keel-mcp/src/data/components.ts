/**
 * Keel component registry.
 *
 * Sync requirement (package_docs_sync.mdc):
 * When a new component is added to @colis/keel, add an entry here
 * and update status to 'available' when the component ships.
 */

export type ComponentStatus = 'available' | 'planned' | 'deprecated';

export interface ComponentInput {
  name: string;
  type: string;
  default?: unknown;
  required: boolean;
  description: string;
}

export interface ComponentOutput {
  name: string;
  type: string;
  description: string;
}

export interface ComponentSlot {
  name: string;
  description: string;
}

export interface KeelComponent {
  name: string;
  selector: string;
  importPath: string;
  status: ComponentStatus;
  description: string;
  phase: number;
  inputs: ComponentInput[];
  outputs: ComponentOutput[];
  slots: ComponentSlot[];
  cssTokens: string[];
  storyId: string | null;
  docsPath: string;
}

export const KEEL_COMPONENTS: KeelComponent[] = [
  {
    name: 'KeelButtonComponent',
    selector: 'keel-button',
    importPath: '@colis/keel',
    status: 'planned',
    description: 'Primary action button with multiple variants and states',
    phase: 2,
    inputs: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'danger' | 'ghost' | 'link'",
        default: 'primary',
        required: false,
        description: 'Visual variant of the button',
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
        description: 'Shows a loading spinner and disables interaction',
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
    ],
    cssTokens: [
      '--keel-color-primary',
      '--keel-color-primary-hover',
      '--keel-color-primary-active',
      '--keel-space-sm',
      '--keel-space-lg',
      '--keel-radius-md',
      '--keel-font-size-base',
      '--keel-font-weight-medium',
    ],
    storyId: null,
    docsPath: '/design-system/keel/components/button',
  },
  {
    name: 'KeelInputComponent',
    selector: 'keel-input',
    importPath: '@colis/keel',
    status: 'planned',
    description: 'Text input field with label, validation states, and helper text',
    phase: 2,
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
      { name: 'label', description: 'Input label text' },
      { name: 'helper', description: 'Helper or error text below the input' },
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
    storyId: null,
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

export function getComponentBySelector(selector: string): KeelComponent | undefined {
  return KEEL_COMPONENTS.find(
    (c) => c.selector === selector || c.name.toLowerCase().includes(selector.toLowerCase()),
  );
}
