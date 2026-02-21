import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
} from '@angular/core';

export type KeelButtonVariant = 'solid' | 'outline' | 'flat' | 'link';
export type KeelButtonTheme =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'tertiary'
  | 'dark';
export type KeelButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'keel-button',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="kh-button"
      [ngClass]="buttonClasses"
      type="button"
      [disabled]="disabled"
      (click)="onClick()">
      <span class="kh-button__icon" aria-hidden="true">
        <ng-content select="[keelButtonIcon]" />
      </span>
      <span class="kh-button__label"><ng-content /></span>
    </button>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }

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
        font-size: var(--keel-font-size-base);
        font-weight: var(--keel-font-weight-medium);
        line-height: var(--keel-line-height-base);
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

      .kh-button:focus-visible {
        outline: var(--keel-focus-ring-width, 2px) solid
          var(--keel-focus-ring-color, var(--keel-color-border-focus));
        outline-offset: var(--keel-focus-ring-offset, 2px);
      }

      .kh-button:disabled {
        cursor: not-allowed;
        opacity: 0.6;
      }

      .kh-button-rounded {
        border-radius: var(--keel-radius-full);
      }

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
        padding: var(--keel-space-sm) var(--keel-space-lg);
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
        --keel-button-bg: var(--keel-color-primary, var(--keel-color-text-base));
        --keel-button-bg-hover: var(--keel-color-primary-hover, var(--keel-color-primary, var(--keel-color-text-base)));
        --keel-button-bg-active: var(--keel-color-primary-active, var(--keel-color-primary-hover, var(--keel-color-primary, var(--keel-color-text-base))));
        --keel-button-bg-soft-hover: var(--keel-color-primary-subtle, var(--keel-color-bg-subtle));
      }

      .kh-button-secondary {
        --keel-button-bg: var(--keel-color-secondary, var(--keel-color-primary, var(--keel-color-text-base)));
        --keel-button-bg-hover: var(--keel-color-secondary-hover, var(--keel-color-primary-hover, var(--keel-color-primary, var(--keel-color-text-base))));
        --keel-button-bg-active: var(--keel-color-secondary-hover, var(--keel-color-primary-active, var(--keel-color-primary-hover, var(--keel-color-primary, var(--keel-color-text-base)))));
        --keel-button-bg-soft-hover: var(--keel-color-secondary-subtle, var(--keel-color-primary-subtle, var(--keel-color-bg-subtle)));
        --keel-button-text: var(--keel-color-text-base);
      }

      .kh-button-success {
        --keel-button-bg: var(--keel-color-success);
        --keel-button-bg-hover: var(--keel-color-success-hover);
        --keel-button-bg-active: var(--keel-color-success-hover);
        --keel-button-bg-soft-hover: var(--keel-color-success-subtle);
      }

      .kh-button-warning {
        --keel-button-bg: var(--keel-color-warning);
        --keel-button-bg-hover: var(--keel-color-warning-hover);
        --keel-button-bg-active: var(--keel-color-warning-hover);
        --keel-button-bg-soft-hover: var(--keel-color-warning-subtle);
      }

      .kh-button-danger {
        --keel-button-bg: var(--keel-color-danger);
        --keel-button-bg-hover: var(--keel-color-danger-hover);
        --keel-button-bg-active: var(--keel-color-danger-hover);
        --keel-button-bg-soft-hover: var(--keel-color-danger-subtle);
      }

      .kh-button-info {
        --keel-button-bg: var(--keel-color-info, var(--keel-color-primary));
        --keel-button-bg-hover: var(--keel-color-info-hover, var(--keel-color-primary-hover));
        --keel-button-bg-active: var(--keel-color-info-hover, var(--keel-color-primary-active));
        --keel-button-bg-soft-hover: var(--keel-color-info-subtle, var(--keel-color-primary-subtle));
      }

      .kh-button-tertiary {
        --keel-button-bg: var(--keel-color-tertiary, var(--keel-color-secondary));
        --keel-button-bg-hover: var(--keel-color-tertiary-hover, var(--keel-color-secondary-hover));
        --keel-button-bg-active: var(--keel-color-tertiary-hover, var(--keel-color-secondary-hover));
        --keel-button-bg-soft-hover: var(--keel-color-tertiary-subtle, var(--keel-color-secondary-subtle));
      }

      .kh-button-dark {
        --keel-button-bg: var(--keel-color-text-base);
        --keel-button-bg-hover: var(--keel-color-text-muted);
        --keel-button-bg-active: var(--keel-color-text-muted);
        --keel-button-bg-soft-hover: var(--keel-color-bg-subtle);
      }

      .kh-button-flat {
        background: var(--keel-button-bg-subtle, var(--keel-color-bg-subtle));
        color: var(--keel-button-bg, var(--keel-color-primary));
        border-color: transparent;
      }

      .kh-button-flat:hover:not(:disabled) {
        background: var(--keel-button-bg-soft-hover, var(--keel-color-primary-subtle));
      }

      .kh-button-outline {
        background: transparent;
        color: var(--keel-button-bg, var(--keel-color-primary));
        border-color: var(--keel-button-bg, var(--keel-color-primary));
      }

      .kh-button-outline:hover:not(:disabled) {
        background: var(--keel-button-bg-soft-hover, var(--keel-color-primary-subtle));
      }

      .kh-button-link {
        background: transparent;
        border-color: transparent;
        color: var(--keel-button-bg, var(--keel-color-primary));
        text-decoration: underline;
        text-underline-offset: 2px;
        padding-inline: var(--keel-space-xs, 4px);
      }

      .kh-button-link:hover:not(:disabled) {
        color: var(--keel-button-bg-hover, var(--keel-color-primary-hover));
      }

      .kh-button__icon:empty {
        display: none;
      }
    `,
  ],
})
export class KeelButtonComponent {
  @Input() variant: KeelButtonVariant = 'solid';
  @Input() theme: KeelButtonTheme = 'primary';
  @Input() size: KeelButtonSize = 'md';
  @Input({ transform: booleanAttribute }) rounded = false;
  @Input({ transform: booleanAttribute }) disabled = false;

  @Output() clicked = new EventEmitter<void>();

  get buttonClasses(): string[] {
    return [
      `kh-button-${this.theme}`,
      `kh-button-${this.variant}`,
      `kh-button-${this.size}`,
      this.rounded ? 'kh-button-rounded' : '',
    ].filter(Boolean);
  }

  onClick(): void {
    if (this.disabled) {
      return;
    }

    this.clicked.emit();
  }
}
