import type { Meta, StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

type KeelInputType = 'text' | 'email' | 'password' | 'number' | 'search';

@Component({
  selector: 'keel-input',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label class="kh-input" [class.kh-input--invalid]="invalid">
      <span class="kh-input__label">
        <ng-content select="[keelInputLabel]" />
      </span>
      <input
        class="kh-input__control"
        [type]="type"
        [name]="name"
        [placeholder]="placeholder"
        [disabled]="disabled"
      />
      <span class="kh-input__helper">
        <ng-content select="[keelInputHelper]" />
      </span>
    </label>
  `,
  styles: [
    `
      .kh-input {
        display: grid;
        gap: var(--keel-space-xs, 4px);
        color: var(--keel-color-text-base, #111827);
        font-family: var(--keel-font-family);
      }

      .kh-input__label {
        font-size: var(--keel-font-size-sm, 0.875rem);
        font-weight: var(--keel-font-weight-medium, 500);
      }

      .kh-input__control {
        width: 100%;
        padding: var(--keel-space-sm, 8px) var(--keel-space-md, 12px);
        border: 1px solid var(--keel-color-border, #e5e7eb);
        border-radius: var(--keel-radius-md, 6px);
        background: var(--keel-color-bg-base, #ffffff);
        color: var(--keel-color-text-base, #111827);
        font-family: inherit;
        font-size: var(--keel-font-size-md, var(--keel-font-size-base, 1rem));
        line-height: var(--keel-line-height-base, 1.5);
        transition:
          border-color var(--keel-transition-fast, 150ms ease),
          box-shadow var(--keel-transition-fast, 150ms ease);
      }

      .kh-input__control:hover:not(:disabled) {
        border-color: var(--keel-color-border-strong, #d1d5db);
      }

      .kh-input__control:focus-visible {
        outline: var(--keel-focus-ring-width, 2px) solid
          var(--keel-focus-ring-color, var(--keel-color-border-focus, #3b82f6));
        outline-offset: var(--keel-focus-ring-offset, 2px);
      }

      .kh-input__control:disabled {
        background: var(--keel-color-bg-subtle, #f9fafb);
        color: var(--keel-color-text-disabled, #9ca3af);
        cursor: not-allowed;
      }

      .kh-input--invalid .kh-input__control {
        border-color: var(--keel-color-danger, #ef4444);
      }

      .kh-input__helper {
        font-size: var(--keel-font-size-sm, 0.875rem);
        color: var(--keel-color-text-muted, #6b7280);
      }

      .kh-input--invalid .kh-input__helper {
        color: var(--keel-color-danger, #ef4444);
      }
    `,
  ],
})
class KeelInputPreviewComponent {
  @Input() type: KeelInputType = 'text';
  @Input() name = '';
  @Input() placeholder = 'Enter value';
  @Input() disabled = false;
  @Input() invalid = false;
}

type InputStoryArgs = {
  type: KeelInputType;
  name: string;
  placeholder: string;
  disabled: boolean;
  invalid: boolean;
};

const meta: Meta<InputStoryArgs> = {
  title: 'Components/Input',
  component: KeelInputPreviewComponent,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search'],
    },
    name: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  render: (args) => ({
    props: args,
    template: `
      <keel-input
        [type]="type"
        [name]="name"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [invalid]="invalid"
      >
        <span keelInputLabel>Full name</span>
        <span keelInputHelper>Use your legal name as it appears on your ID</span>
      </keel-input>
    `,
  }),
};

export default meta;
type Story = StoryObj<InputStoryArgs>;

export const Playground: Story = {
  args: {
    type: 'text',
    name: 'fullName',
    placeholder: 'Enter your full name',
    disabled: false,
    invalid: false,
  },
};

export const States: Story = {
  render: () => ({
    template: `
      <div style="display: grid; gap: 16px; max-width: 420px;">
        <keel-input placeholder="john@company.com">
          <span keelInputLabel>Email</span>
          <span keelInputHelper>We will use this for account notifications</span>
        </keel-input>

        <keel-input [invalid]="true" placeholder="john@company">
          <span keelInputLabel>Email</span>
          <span keelInputHelper>Please enter a valid email address</span>
        </keel-input>

        <keel-input [disabled]="true" placeholder="Disabled value">
          <span keelInputLabel>Disabled field</span>
          <span keelInputHelper>This field is currently locked</span>
        </keel-input>
      </div>
    `,
  }),
};
