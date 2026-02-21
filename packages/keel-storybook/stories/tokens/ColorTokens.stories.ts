import type { Meta, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'token-color-swatch',
  template: `
    <div style="display: flex; flex-wrap: wrap; gap: 16px; font-family: var(--keel-font-family);">
      <div *ngFor="let t of tokens" style="display: flex; flex-direction: column; gap: 6px; min-width: 120px;">
        <div
          [style.background]="'var(' + t.name + ')'"
          style="width: 80px; height: 80px; border-radius: var(--keel-radius-md); border: 1px solid var(--keel-color-border);">
        </div>
        <code style="font-size: 11px; color: var(--keel-color-text-muted);">{{ t.name }}</code>
        <span style="font-size: 11px; color: var(--keel-color-text-muted);">{{ t.value }}</span>
      </div>
    </div>
  `,
})
class TokenColorSwatchComponent {
  @Input() tokens: Array<{ name: string; value: string }> = [];
}

const meta: Meta<TokenColorSwatchComponent> = {
  title: 'Design Tokens/Colors',
  component: TokenColorSwatchComponent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'All `--keel-color-*` CSS custom properties. Override any token at `:root` level or via `@colis/hull` Layer 3.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<TokenColorSwatchComponent>;

export const Primary: Story = {
  name: 'Primary Colors',
  args: {
    tokens: [
      { name: '--keel-color-primary', value: '#3b82f6' },
      { name: '--keel-color-primary-hover', value: '#2563eb' },
      { name: '--keel-color-primary-active', value: '#1d4ed8' },
      { name: '--keel-color-primary-subtle', value: '#eff6ff' },
    ],
  },
};

export const Semantic: Story = {
  name: 'Semantic State Colors',
  args: {
    tokens: [
      { name: '--keel-color-secondary', value: '#d1d5db' },
      { name: '--keel-color-danger', value: '#ef4444' },
      { name: '--keel-color-success', value: '#22c55e' },
      { name: '--keel-color-warning', value: '#f59e0b' },
      { name: '--keel-color-info', value: '#0ea5e9' },
      { name: '--keel-color-tertiary', value: '#8b5cf6' },
    ],
  },
};

export const TextAndBackground: Story = {
  name: 'Text & Background',
  args: {
    tokens: [
      { name: '--keel-color-text-base', value: '#111827' },
      { name: '--keel-color-text-muted', value: '#6b7280' },
      { name: '--keel-color-bg-base', value: '#ffffff' },
      { name: '--keel-color-bg-subtle', value: '#f9fafb' },
      { name: '--keel-color-border', value: '#e5e7eb' },
    ],
  },
};
