import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'token-typography',
  template: `
    <div style="display: flex; flex-direction: column; gap: 24px; font-family: var(--keel-font-family);">
      <div>
        <p style="font-size: 11px; color: var(--keel-color-text-muted); margin: 0 0 4px;">--keel-font-size-lg ({{ '1.125rem' }})</p>
        <p style="font-size: var(--keel-font-size-lg); margin: 0;">The quick brown fox jumps over the lazy dog</p>
      </div>
      <div>
        <p style="font-size: 11px; color: var(--keel-color-text-muted); margin: 0 0 4px;">--keel-font-size-base ({{ '1rem' }})</p>
        <p style="font-size: var(--keel-font-size-base); margin: 0;">The quick brown fox jumps over the lazy dog</p>
      </div>
      <div>
        <p style="font-size: 11px; color: var(--keel-color-text-muted); margin: 0 0 4px;">--keel-font-size-sm ({{ '0.875rem' }})</p>
        <p style="font-size: var(--keel-font-size-sm); margin: 0;">The quick brown fox jumps over the lazy dog</p>
      </div>
      <div style="display: flex; gap: 24px;">
        <div>
          <p style="font-size: 11px; color: var(--keel-color-text-muted); margin: 0 0 4px;">--keel-font-weight-normal</p>
          <p style="font-weight: var(--keel-font-weight-normal); margin: 0;">Normal weight text</p>
        </div>
        <div>
          <p style="font-size: 11px; color: var(--keel-color-text-muted); margin: 0 0 4px;">--keel-font-weight-medium</p>
          <p style="font-weight: var(--keel-font-weight-medium); margin: 0;">Medium weight text</p>
        </div>
        <div>
          <p style="font-size: 11px; color: var(--keel-color-text-muted); margin: 0 0 4px;">--keel-font-weight-bold</p>
          <p style="font-weight: var(--keel-font-weight-bold); margin: 0;">Bold weight text</p>
        </div>
      </div>
    </div>
  `,
})
class TokenTypographyComponent {}

const meta: Meta<TokenTypographyComponent> = {
  title: 'Design Tokens/Typography',
  component: TokenTypographyComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<TokenTypographyComponent>;

export const All: Story = {
  name: 'All Typography Tokens',
  args: {},
};
