import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  booleanAttribute,
  forwardRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type KeelInputType = 'text' | 'email' | 'password' | 'number' | 'search';

@Component({
  selector: 'keel-input',
  standalone: true,
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => KeelInputComponent),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="kh-input">
      <span class="kh-input__label">
        <ng-content select="[keelInputLabel]" />
      </span>
      <input
        class="kh-input__control"
        [type]="type"
        [name]="name"
        [placeholder]="placeholder"
        [disabled]="disabled"
        [value]="value"
        [attr.aria-invalid]="invalid ? 'true' : null"
        (input)="onInput($event)"
        (blur)="onBlur()"
      />
      <span class="kh-input__helper">
        <ng-content select="[keelInputHelper]" />
      </span>
    </label>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .kh-input {
        display: grid;
        gap: var(--keel-space-xs, 4px);
        color: var(--keel-color-text-base, #111827);
        font-family: var(--keel-font-family);
      }

      .kh-input__label {
        font-size: var(--keel-font-size-sm, 0.875rem);
        font-weight: var(--keel-font-weight-medium, 500);
        line-height: var(--keel-line-height-base, 1.5);
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

      .kh-input__label:empty,
      .kh-input__helper:empty {
        display: none;
      }
    `,
  ],
  host: {
    '[class.kh-input--invalid]': 'invalid',
  },
})
export class KeelInputComponent implements ControlValueAccessor {
  @Input() type: KeelInputType = 'text';
  @Input() name = '';
  @Input() placeholder = '';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input({ transform: booleanAttribute }) invalid = false;

  @Output() valueChange = new EventEmitter<string>();

  value = '';

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    const next = target.value;
    this.value = next;
    this.onChange(next);
    this.valueChange.emit(next);
  }

  onBlur(): void {
    this.onTouched();
  }
}
