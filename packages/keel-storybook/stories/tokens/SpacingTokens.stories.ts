import type { Meta, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'token-spacing-swatch',
  template: `
    <div style="display: flex; flex-direction: column; gap: 12px; font-family: var(--keel-font-family);">
      <div *ngFor="let t of tokens" style="display: flex; align-items: center; gap: 16px;">
        <code style="width: 180px; font-size: 12px; color: var(--keel-color-text-muted);">{{ t.name }}</code>
        <div
          [style.width]="'var(' + t.name + ')'"
          style="height: 20px; background: var(--keel-color-primary); border-radius: 2px; min-width: 4px;">
        </div>
        <span style="font-size: 12px; color: var(--keel-color-text-muted);">{{ t.value }}</span>
      </div>
    </div>
  `,
})
class TokenSpacingSwatchComponent {
  @Input() tokens: Array<{ name: string; value: string }> = [];
}

const meta: Meta<TokenSpacingSwatchComponent> = {
  title: 'Design Tokens/Spacing',
  component: TokenSpacingSwatchComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TokenSpacingSwatchComponent>;

export const All: Story = {
  name: 'All Spacing Tokens',
  args: {
    tokens: [
      { name: '--keel-space-xs', value: '4px' },
      { name: '--keel-space-sm', value: '8px' },
      { name: '--keel-space-md', value: '12px' },
      { name: '--keel-space-lg', value: '16px' },
      { name: '--keel-space-xl', value: '24px' },
      { name: '--keel-space-2xl', value: '32px' },
    ],
  },
};
