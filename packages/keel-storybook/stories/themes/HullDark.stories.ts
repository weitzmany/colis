import type { Meta, StoryObj } from '@storybook/angular';
import { Component } from '@angular/core';

/**
 * Hull Dark theme preview.
 * The hull-dark class overrides --keel-color-text-base, --keel-color-bg-base, --keel-color-border.
 * Defined in .storybook/preview-head.html.
 * Will move to @colis/hull/src/themes/dark/index.css in Phase 2.
 */
@Component({
  standalone: true,
  selector: 'hull-dark-preview',
  template: `
    <div class="hull-dark" style="background: var(--keel-color-bg-base); padding: 32px; font-family: var(--keel-font-family); display: flex; flex-direction: column; gap: 16px; min-height: 300px;">
      <h2 style="color: var(--keel-color-text-base); margin: 0; font-weight: var(--keel-font-weight-bold);">Hull Dark Theme</h2>
      <p style="color: var(--keel-color-text-muted); margin: 0; font-size: var(--keel-font-size-sm);">
        Dark token overrides. Activated by <code style="background: #374151; padding: 2px 6px; border-radius: 4px;">.hull-dark</code> class.
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
      </div>
      <div style="border: 1px solid var(--keel-color-border); border-radius: var(--keel-radius-md); padding: 12px; background: var(--keel-color-bg-subtle);">
        <p style="color: var(--keel-color-text-base); margin: 0; font-size: var(--keel-font-size-base);">Subtle background panel (dark)</p>
        <p style="color: var(--keel-color-text-muted); margin: 4px 0 0; font-size: var(--keel-font-size-sm);">With border and muted text</p>
      </div>
    </div>
  `,
})
class HullDarkPreviewComponent {}

const meta: Meta<HullDarkPreviewComponent> = {
  title: 'Hull Themes/Dark',
  component: HullDarkPreviewComponent,
  tags: ['autodocs'],
  parameters: {
    backgrounds: { default: 'Hull Dark' },
  },
};

export default meta;
type Story = StoryObj<HullDarkPreviewComponent>;

export const Default: Story = {
  name: 'Hull Dark',
  args: {},
};
