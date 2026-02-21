/**
 * Keel/Hull CSS token definitions.
 *
 * Sync requirement (package_docs_sync.mdc):
 * When the token contract in docs/reference/KEEL_HULL_TOKEN_CONTRACT.md changes,
 * update this file to match.
 */

export type TokenCategory = 'color' | 'spacing' | 'radius' | 'typography' | 'shadow' | 'transition' | 'z-index' | 'focus';

export interface KeelToken {
  name: string;
  category: TokenCategory;
  keelFallback: string;
  hullLayer1Value: string;
  tailwindSource: string;
  description: string;
  usedBy: string[];
}

export const KEEL_TOKENS: KeelToken[] = [
  // --- Colors: Primary ---
  {
    name: '--keel-color-primary',
    category: 'color',
    keelFallback: '#3b82f6',
    hullLayer1Value: '#3b82f6',
    tailwindSource: 'blue-500',
    description: 'Primary action color — buttons, links, active states',
    usedBy: ['keel-button', 'keel-input'],
  },
  {
    name: '--keel-color-primary-hover',
    category: 'color',
    keelFallback: '#2563eb',
    hullLayer1Value: '#2563eb',
    tailwindSource: 'blue-600',
    description: 'Primary color hover state',
    usedBy: ['keel-button'],
  },
  {
    name: '--keel-color-primary-active',
    category: 'color',
    keelFallback: '#1d4ed8',
    hullLayer1Value: '#1d4ed8',
    tailwindSource: 'blue-700',
    description: 'Primary color active/pressed state',
    usedBy: ['keel-button'],
  },
  {
    name: '--keel-color-primary-subtle',
    category: 'color',
    keelFallback: '#eff6ff',
    hullLayer1Value: '#eff6ff',
    tailwindSource: 'blue-50',
    description: 'Light background for primary context',
    usedBy: [],
  },

  // --- Colors: Semantic ---
  {
    name: '--keel-color-danger',
    category: 'color',
    keelFallback: '#ef4444',
    hullLayer1Value: '#ef4444',
    tailwindSource: 'red-500',
    description: 'Destructive/error actions',
    usedBy: ['keel-button', 'keel-input'],
  },
  {
    name: '--keel-color-success',
    category: 'color',
    keelFallback: '#22c55e',
    hullLayer1Value: '#22c55e',
    tailwindSource: 'green-500',
    description: 'Success/positive states',
    usedBy: [],
  },
  {
    name: '--keel-color-warning',
    category: 'color',
    keelFallback: '#f59e0b',
    hullLayer1Value: '#f59e0b',
    tailwindSource: 'amber-500',
    description: 'Warning states',
    usedBy: [],
  },

  // --- Colors: Text & Background ---
  {
    name: '--keel-color-text-base',
    category: 'color',
    keelFallback: '#111827',
    hullLayer1Value: '#111827',
    tailwindSource: 'gray-900',
    description: 'Primary text color',
    usedBy: [],
  },
  {
    name: '--keel-color-text-muted',
    category: 'color',
    keelFallback: '#6b7280',
    hullLayer1Value: '#6b7280',
    tailwindSource: 'gray-500',
    description: 'Muted/secondary text',
    usedBy: [],
  },
  {
    name: '--keel-color-text-inverse',
    category: 'color',
    keelFallback: '#ffffff',
    hullLayer1Value: '#ffffff',
    tailwindSource: 'white',
    description: 'Text on dark/colored backgrounds',
    usedBy: ['keel-button'],
  },
  {
    name: '--keel-color-bg-base',
    category: 'color',
    keelFallback: '#ffffff',
    hullLayer1Value: '#ffffff',
    tailwindSource: 'white',
    description: 'Primary background color',
    usedBy: ['keel-modal'],
  },
  {
    name: '--keel-color-bg-subtle',
    category: 'color',
    keelFallback: '#f9fafb',
    hullLayer1Value: '#f9fafb',
    tailwindSource: 'gray-50',
    description: 'Subtle background for panels and inputs',
    usedBy: ['keel-input'],
  },
  {
    name: '--keel-color-border',
    category: 'color',
    keelFallback: '#e5e7eb',
    hullLayer1Value: '#e5e7eb',
    tailwindSource: 'gray-200',
    description: 'Default border color',
    usedBy: ['keel-input', 'keel-modal'],
  },

  // --- Spacing ---
  { name: '--keel-space-xs', category: 'spacing', keelFallback: '4px', hullLayer1Value: '4px', tailwindSource: 'spacing-1', description: 'Extra small spacing (4px)', usedBy: [] },
  { name: '--keel-space-sm', category: 'spacing', keelFallback: '8px', hullLayer1Value: '8px', tailwindSource: 'spacing-2', description: 'Small spacing (8px)', usedBy: ['keel-button', 'keel-input'] },
  { name: '--keel-space-md', category: 'spacing', keelFallback: '12px', hullLayer1Value: '12px', tailwindSource: 'spacing-3', description: 'Medium spacing (12px)', usedBy: ['keel-input'] },
  { name: '--keel-space-lg', category: 'spacing', keelFallback: '16px', hullLayer1Value: '16px', tailwindSource: 'spacing-4', description: 'Large spacing (16px)', usedBy: ['keel-button'] },
  { name: '--keel-space-xl', category: 'spacing', keelFallback: '24px', hullLayer1Value: '24px', tailwindSource: 'spacing-6', description: 'Extra large spacing (24px)', usedBy: ['keel-modal'] },
  { name: '--keel-space-2xl', category: 'spacing', keelFallback: '32px', hullLayer1Value: '32px', tailwindSource: 'spacing-8', description: '2x large spacing (32px)', usedBy: [] },

  // --- Border Radius ---
  { name: '--keel-radius-sm', category: 'radius', keelFallback: '4px', hullLayer1Value: '4px', tailwindSource: 'rounded-sm (2px) / rounded (4px)', description: 'Small corner radius', usedBy: [] },
  { name: '--keel-radius-md', category: 'radius', keelFallback: '6px', hullLayer1Value: '6px', tailwindSource: 'rounded-md', description: 'Default corner radius for most components', usedBy: ['keel-button', 'keel-input'] },
  { name: '--keel-radius-lg', category: 'radius', keelFallback: '8px', hullLayer1Value: '8px', tailwindSource: 'rounded-lg', description: 'Large corner radius for cards/modals', usedBy: ['keel-modal'] },
  { name: '--keel-radius-full', category: 'radius', keelFallback: '9999px', hullLayer1Value: '9999px', tailwindSource: 'rounded-full', description: 'Pill shape', usedBy: [] },

  // --- Typography ---
  { name: '--keel-font-family', category: 'typography', keelFallback: 'ui-sans-serif, system-ui, sans-serif', hullLayer1Value: 'ui-sans-serif, system-ui, sans-serif', tailwindSource: 'font-sans', description: 'Default font stack', usedBy: [] },
  { name: '--keel-font-size-sm', category: 'typography', keelFallback: '0.875rem', hullLayer1Value: '0.875rem', tailwindSource: 'text-sm', description: 'Small text (14px)', usedBy: [] },
  { name: '--keel-font-size-base', category: 'typography', keelFallback: '1rem', hullLayer1Value: '1rem', tailwindSource: 'text-base', description: 'Body text (16px)', usedBy: ['keel-button'] },
  { name: '--keel-font-size-lg', category: 'typography', keelFallback: '1.125rem', hullLayer1Value: '1.125rem', tailwindSource: 'text-lg', description: 'Large text (18px)', usedBy: [] },
  { name: '--keel-font-weight-normal', category: 'typography', keelFallback: '400', hullLayer1Value: '400', tailwindSource: 'font-normal', description: 'Normal weight', usedBy: [] },
  { name: '--keel-font-weight-medium', category: 'typography', keelFallback: '500', hullLayer1Value: '500', tailwindSource: 'font-medium', description: 'Medium weight — buttons, labels', usedBy: ['keel-button'] },
  { name: '--keel-font-weight-bold', category: 'typography', keelFallback: '700', hullLayer1Value: '700', tailwindSource: 'font-bold', description: 'Bold weight — headings', usedBy: [] },
  { name: '--keel-line-height-base', category: 'typography', keelFallback: '1.5', hullLayer1Value: '1.5', tailwindSource: 'leading-normal', description: 'Default line height', usedBy: [] },
];

export function getTokensByCategory(category: TokenCategory): KeelToken[] {
  return KEEL_TOKENS.filter((t) => t.category === category);
}

export function getTokenByName(name: string): KeelToken | undefined {
  return KEEL_TOKENS.find((t) => t.name === name);
}
