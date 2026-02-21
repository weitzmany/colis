import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';

/**
 * Hull Light theme — default token values on white background.
 * Update when @colis/hull Layer 1 or Layer 2 light values change.
 */
@Component({
  standalone: true,
  selector: 'hull-light-preview',
  template: `
    <div style="background: var(--keel-color-bg-base); padding: 32px; font-family: var(--keel-font-family); display: flex; flex-direction: column; gap: 16px;">
      <h2 style="color: var(--keel-color-text-base); margin: 0; font-weight: var(--keel-font-weight-bold);">Hull Light Theme</h2>
      <p style="color: var(--keel-color-text-muted); margin: 0; font-size: var(--keel-font-size-sm);">
        Default keel token values. Used when no hull-dark class is present.
      </p>
      <div style="display: flex; gap: 8px;">
        <div style="padding: 8px 16px; background: var(--keel-color-primary); color: var(--keel-color-text-inverse); border-radius: var(--keel-radius-md); font-size: var(--keel-font-size-sm); font-weight: var(--keel-font-weight-medium);">
          Primary
        </div>
        <div style="padding: 8px 16px; background: var(--keel-color-danger); color: var(--keel-color-text-inverse); border-radius: var(--keel-radius-md); font-size: var(--keel-font-size-sm); font-weight: var(--keel-font-weight-medium);">
          Danger
        </div>
        <div style="padding: 8px 16px; background: var(--keel-color-success); color: var(--keel-color-text-inverse); border-radius: var(--keel-radius-md); font-size: var(--keel-font-size-sm); font-weight: var(--keel-font-weight-medium);">
          Success
        </div>
        <div style="padding: 8px 16px; background: var(--keel-color-warning); color: var(--keel-color-text-inverse); border-radius: var(--keel-radius-md); font-size: var(--keel-font-size-sm); font-weight: var(--keel-font-weight-medium);">
          Warning
        </div>
      </div>
      <div style="border: 1px solid var(--keel-color-border); border-radius: var(--keel-radius-md); padding: 12px; background: var(--keel-color-bg-subtle);">
        <p style="color: var(--keel-color-text-base); margin: 0; font-size: var(--keel-font-size-base);">Subtle background panel</p>
        <p style="color: var(--keel-color-text-muted); margin: 4px 0 0; font-size: var(--keel-font-size-sm);">With border and muted text</p>
      </div>
    </div>
  `,
})
class HullLightPreviewComponent {}

const meta: Meta<HullLightPreviewComponent> = {
  title: 'Hull Themes/Light',
  component: HullLightPreviewComponent,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<HullLightPreviewComponent>;

export const Default: Story = {
  name: 'Hull Light (Default)',
  args: {},
};
