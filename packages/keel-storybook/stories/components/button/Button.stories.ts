import type { Meta, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type KeelButtonVariant = 'solid' | 'outline' | 'flat' | 'link';
type KeelButtonTheme =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'tertiary'
  | 'dark';
type KeelButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'keel-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      class="kh-button"
      [ngClass]="buttonClasses"
      type="button"
      [disabled]="isDisabled"
      >
      <span class="kh-button__spinner" *ngIf="loading" aria-hidden="true"></span>
      <ng-content />
    </button>
  `,
  styles: [
    `
      .kh-button {
        --keel-button-min-size: var(--keel-button-min-size-md);
        --keel-button-text: var(--keel-color-text-inverse);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: var(--keel-space-xs, 4px);
        min-height: var(--keel-button-min-size);
        min-width: var(--keel-button-min-size);
        padding: var(--keel-space-sm, 8px) var(--keel-space-lg, 16px);
        border: 1px solid transparent;
        border-radius: var(--keel-radius-md, 6px);
        background: var(--keel-button-bg, var(--keel-color-primary));
        color: var(--keel-button-text, var(--keel-color-text-inverse));
        font-family: var(--keel-font-family);
        font-size: var(--keel-font-size-md, var(--keel-font-size-base));
        font-weight: var(--keel-font-weight-medium);
        line-height: var(--keel-line-height-base);
        text-decoration: none;
        text-underline-offset: 2px;
        cursor: pointer;
        transition:
          background-color var(--keel-transition-fast, 150ms ease),
          color var(--keel-transition-fast, 150ms ease),
          border-color var(--keel-transition-fast, 150ms ease),
          opacity var(--keel-transition-fast, 150ms ease);
      }

      .kh-button:hover:not(:disabled) {
        background: var(--keel-button-bg-hover, var(--keel-color-primary-hover));
      }

      .kh-button:active:not(:disabled) {
        background: var(--keel-button-bg-active, var(--keel-color-primary-active));
      }

      .kh-button__spinner {
        width: 1em;
        height: 1em;
        border: 2px solid currentColor;
        border-right-color: transparent;
        border-radius: 50%;
        animation: kh-button-spin 0.8s linear infinite;
      }

      @keyframes kh-button-spin {
        to {
          transform: rotate(360deg);
        }
      }

      .kh-button-rounded { border-radius: var(--keel-radius-full); }
      .kh-button-xs {
        --keel-button-min-size: var(--keel-button-min-size-xs);
        padding: calc(var(--keel-space-xs) / 2) calc(var(--keel-space-sm) - 2px);
        font-size: var(--keel-font-size-xs, 0.75rem);
      }
      .kh-button-sm {
        --keel-button-min-size: var(--keel-button-min-size-sm);
        padding: var(--keel-space-xs) calc(var(--keel-space-md) - 2px);
        font-size: var(--keel-font-size-sm, 0.875rem);
      }
      .kh-button-md {
        --keel-button-min-size: var(--keel-button-min-size-md);
        font-size: var(--keel-font-size-md, var(--keel-font-size-base));
      }
      .kh-button-lg {
        --keel-button-min-size: var(--keel-button-min-size-lg);
        padding: var(--keel-space-md) var(--keel-space-xl);
        font-size: var(--keel-font-size-lg);
      }
      .kh-button-xl {
        --keel-button-min-size: var(--keel-button-min-size-xl);
        padding: var(--keel-space-lg) var(--keel-space-2xl);
        font-size: var(--keel-font-size-xl);
      }

      .kh-button-primary {
        --keel-button-bg: var(--keel-color-primary, #3b82f6);
        --keel-button-bg-hover: var(--keel-color-primary-hover, #2563eb);
        --keel-button-bg-soft-hover: var(--keel-color-primary-subtle, #eff6ff);
      }
      .kh-button-secondary {
        --keel-button-bg: var(--keel-color-secondary, var(--keel-color-gray-300, #d1d5db));
        --keel-button-bg-hover: var(--keel-color-secondary-hover, var(--keel-color-gray-400, #9ca3af));
        --keel-button-bg-soft-hover: var(--keel-color-secondary-subtle, var(--keel-color-gray-100, #f3f4f6));
        --keel-button-text: var(--keel-color-text-base, #111827);
      }
      .kh-button-success { --keel-button-bg: var(--keel-color-success, #22c55e); --keel-button-bg-hover: var(--keel-color-success-hover, #16a34a); --keel-button-bg-soft-hover: var(--keel-color-success-subtle, #f0fdf4); }
      .kh-button-warning { --keel-button-bg: var(--keel-color-warning, #f59e0b); --keel-button-bg-hover: var(--keel-color-warning-hover, #d97706); --keel-button-bg-soft-hover: var(--keel-color-warning-subtle, #fffbeb); }
      .kh-button-danger { --keel-button-bg: var(--keel-color-danger, #ef4444); --keel-button-bg-hover: var(--keel-color-danger-hover, #dc2626); --keel-button-bg-soft-hover: var(--keel-color-danger-subtle, #fef2f2); }
      .kh-button-info { --keel-button-bg: var(--keel-color-info, #0ea5e9); --keel-button-bg-hover: var(--keel-color-info-hover, #0284c7); --keel-button-bg-soft-hover: var(--keel-color-info-subtle, #f0f9ff); }
      .kh-button-tertiary { --keel-button-bg: var(--keel-color-tertiary, #8b5cf6); --keel-button-bg-hover: var(--keel-color-tertiary-hover, #7c3aed); --keel-button-bg-soft-hover: var(--keel-color-tertiary-subtle, #f5f3ff); }
      .kh-button-dark { --keel-button-bg: var(--keel-color-text-base, #111827); --keel-button-bg-hover: var(--keel-color-text-muted, #6b7280); --keel-button-bg-soft-hover: var(--keel-color-bg-subtle, #f9fafb); }

      .kh-button-outline {
        background: transparent;
        color: var(--keel-button-bg);
        border-color: var(--keel-button-bg);
      }
      .kh-button-outline:hover:not(:disabled) {
        background: var(--keel-button-bg-soft-hover, var(--keel-color-primary-subtle));
      }
      .kh-button-flat {
        background: var(--keel-button-bg-soft-hover);
        color: var(--keel-button-bg);
      }
      .kh-button-flat:hover:not(:disabled) {
        background: var(--keel-button-bg-soft-hover, var(--keel-color-primary-subtle));
      }
      .kh-button-link {
        background: transparent;
        border-color: transparent;
        color: var(--keel-button-bg);
        text-decoration: underline;
        padding-inline: var(--keel-space-xs, 4px);
      }
      .kh-button-link:hover:not(:disabled) {
        color: var(--keel-button-bg-hover, var(--keel-color-primary-hover));
      }
    `,
  ],
})
class KeelButtonPreviewComponent {
  @Input() variant: KeelButtonVariant = 'solid';
  @Input() theme: KeelButtonTheme = 'primary';
  @Input() size: KeelButtonSize = 'md';
  @Input() rounded = false;
  @Input() disabled = false;
  @Input() loading = false;

  get buttonClasses(): string[] {
    return [
      `kh-button-${this.theme}`,
      `kh-button-${this.variant}`,
      `kh-button-${this.size}`,
      this.rounded ? 'kh-button-rounded' : '',
    ].filter(Boolean);
  }

  get isDisabled(): boolean {
    return this.disabled || this.loading;
  }
}

type ButtonStoryArgs = {
  variant: KeelButtonVariant;
  theme: KeelButtonTheme;
  size: KeelButtonSize;
  rounded: boolean;
  disabled: boolean;
  loading: boolean;
};

const meta: Meta<ButtonStoryArgs> = {
  title: 'Components/Button',
  component: KeelButtonPreviewComponent,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'flat', 'link'],
    },
    theme: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'warning', 'danger', 'info', 'tertiary', 'dark'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    rounded: { control: 'boolean' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <keel-button
        [variant]="variant"
        [theme]="theme"
        [size]="size"
        [rounded]="rounded"
        [disabled]="disabled"
        [loading]="loading"
      >
        Save
      </keel-button>
    `,
  }),
};

export default meta;
type Story = StoryObj<ButtonStoryArgs>;

export const Playground: Story = {
  args: {
    variant: 'solid',
    theme: 'primary',
    size: 'md',
    rounded: false,
    disabled: false,
    loading: false,
  },
};

export const Variants: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <keel-button variant="solid" theme="primary">Solid</keel-button>
        <keel-button variant="outline" theme="primary">Outline</keel-button>
        <keel-button variant="flat" theme="primary">Flat</keel-button>
        <keel-button variant="link" theme="primary">Link</keel-button>
      </div>
    `,
  }),
};

export const Themes: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap;">
        <keel-button variant="solid" theme="primary">Primary</keel-button>
        <keel-button variant="solid" theme="secondary">Secondary</keel-button>
        <keel-button variant="solid" theme="success">Success</keel-button>
        <keel-button variant="solid" theme="warning">Warning</keel-button>
        <keel-button variant="solid" theme="danger">Danger</keel-button>
        <keel-button variant="solid" theme="info">Info</keel-button>
        <keel-button variant="solid" theme="tertiary">Tertiary</keel-button>
        <keel-button variant="solid" theme="dark">Dark</keel-button>
      </div>
    `,
  }),
};

export const SizesAndShape: Story = {
  render: () => ({
    template: `
      <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center;">
        <keel-button size="xs">XS</keel-button>
        <keel-button size="sm">SM</keel-button>
        <keel-button size="md">MD</keel-button>
        <keel-button size="lg">LG</keel-button>
        <keel-button size="xl">XL</keel-button>
        <keel-button rounded="true">Rounded</keel-button>
        <keel-button [disabled]="true">Disabled</keel-button>
        <keel-button [loading]="true">Loading</keel-button>
      </div>
    `,
  }),
};

export const Loading: Story = {
  args: {
    variant: 'solid',
    theme: 'primary',
    size: 'md',
    rounded: false,
    disabled: false,
    loading: true,
  },
};
