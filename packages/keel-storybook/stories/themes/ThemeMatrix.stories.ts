import type { Meta, StoryObj } from '@storybook/angular';
import { Component, Input } from '@angular/core';

/**
 * Theme Matrix story — shows all hull theme contexts side by side.
 *
 * Sync requirements (per package_docs_sync.mdc):
 * When adding a new keel component, add it to the COMPONENTS list below
 * and ensure it renders correctly in each theme context.
 */
@Component({
  standalone: true,
  selector: 'hull-theme-matrix',
  template: `
    <div style="font-family: var(--keel-font-family); display: flex; flex-direction: column; gap: 2px;">
      <div style="display: flex; gap: 2px;">
        <!-- Theme columns -->
        <div *ngFor="let theme of themes"
          [class]="theme.class"
          [style.background]="theme.bg"
          style="flex: 1; padding: 24px; display: flex; flex-direction: column; gap: 16px; border-radius: 8px;">
          <h3 [style.color]="theme.textColor" style="margin: 0 0 8px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
            {{ theme.label }}
          </h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button
              type="button"
              style="
                min-height: 44px;
                border-radius: var(--keel-radius-md);
                padding: var(--keel-space-sm) var(--keel-space-lg);
                border: 1px solid transparent;
                background: var(--keel-color-primary);
                color: var(--keel-color-text-inverse);
                font-family: var(--keel-font-family);
                font-size: var(--keel-font-size-base);
                font-weight: var(--keel-font-weight-medium);
                text-align: left;
              ">
              Primary Button
            </button>
            <div [style.background]="'var(--keel-color-bg-subtle)'" [style.color]="'var(--keel-color-text-base)'" [style.border]="'1px solid var(--keel-color-border)'" style="padding: 8px 12px; border-radius: var(--keel-radius-md); font-size: 14px;">
              Input field
            </div>
            <div [style.color]="'var(--keel-color-text-base)'" style="font-size: 14px;">
              Body text in this theme
            </div>
            <div [style.color]="'var(--keel-color-text-muted)'" style="font-size: 12px;">
              Muted text example
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [],
})
class HullThemeMatrixComponent {
  @Input() themes: Array<{ label: string; class: string; bg: string; textColor: string }> = [];
}

const meta: Meta<HullThemeMatrixComponent> = {
  title: 'Hull Themes/Theme Matrix',
  component: HullThemeMatrixComponent,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Side-by-side comparison of all hull theme contexts.

**Sync requirement**: When adding a new keel component, add it to all columns of this matrix story.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<HullThemeMatrixComponent>;

export const LightAndDark: Story = {
  name: 'Light vs Dark',
  args: {
    themes: [
      { label: 'Hull Light', class: '', bg: '#ffffff', textColor: '#111827' },
      { label: 'Hull Dark', class: 'hull-dark', bg: '#111827', textColor: '#f9fafb' },
    ],
  },
};

export const AllThemes: Story = {
  name: 'All Theme Contexts',
  args: {
    themes: [
      { label: 'Light', class: '', bg: 'var(--keel-color-bg-base)', textColor: 'var(--keel-color-text-base)' },
      { label: 'Dark', class: 'hull-dark', bg: '#111827', textColor: '#f9fafb' },
      { label: 'Subtle BG', class: '', bg: 'var(--keel-color-bg-subtle)', textColor: 'var(--keel-color-text-base)' },
    ],
  },
};
