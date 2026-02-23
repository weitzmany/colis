import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, booleanAttribute, forwardRef, } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import * as i0 from "@angular/core";
export class KeelInputComponent {
    type = 'text';
    name = '';
    placeholder = '';
    disabled = false;
    invalid = false;
    valueChange = new EventEmitter();
    value = '';
    onChange = () => { };
    onTouched = () => { };
    writeValue(value) {
        this.value = value ?? '';
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    onInput(event) {
        const target = event.target;
        const next = target.value;
        this.value = next;
        this.onChange(next);
        this.valueChange.emit(next);
    }
    onBlur() {
        this.onTouched();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.1.5", ngImport: i0, type: KeelInputComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "16.1.0", version: "21.1.5", type: KeelInputComponent, isStandalone: true, selector: "keel-input", inputs: { type: "type", name: "name", placeholder: "placeholder", disabled: ["disabled", "disabled", booleanAttribute], invalid: ["invalid", "invalid", booleanAttribute] }, outputs: { valueChange: "valueChange" }, host: { properties: { "class.kh-input--invalid": "invalid" } }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => KeelInputComponent),
                multi: true,
            },
        ], ngImport: i0, template: `
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
  `, isInline: true, styles: ["\n      :host {\n        display: block;\n      }\n\n      .kh-input {\n        display: grid;\n        gap: var(--keel-space-xs, 4px);\n        color: var(--keel-color-text-base, #111827);\n        font-family: var(--keel-font-family);\n      }\n\n      .kh-input__label {\n        font-size: var(--keel-font-size-sm, 0.875rem);\n        font-weight: var(--keel-font-weight-medium, 500);\n        line-height: var(--keel-line-height-base, 1.5);\n      }\n\n      .kh-input__control {\n        width: 100%;\n        padding: var(--keel-space-sm, 8px) var(--keel-space-md, 12px);\n        border: 1px solid var(--keel-color-border, #e5e7eb);\n        border-radius: var(--keel-radius-md, 6px);\n        background: var(--keel-color-bg-base, #ffffff);\n        color: var(--keel-color-text-base, #111827);\n        font-family: inherit;\n        font-size: var(--keel-font-size-md, var(--keel-font-size-base, 1rem));\n        line-height: var(--keel-line-height-base, 1.5);\n        transition:\n          border-color var(--keel-transition-fast, 150ms ease),\n          box-shadow var(--keel-transition-fast, 150ms ease);\n      }\n\n      .kh-input__control:hover:not(:disabled) {\n        border-color: var(--keel-color-border-strong, #d1d5db);\n      }\n\n      .kh-input__control:focus-visible {\n        outline: var(--keel-focus-ring-width, 2px) solid\n          var(--keel-focus-ring-color, var(--keel-color-border-focus, #3b82f6));\n        outline-offset: var(--keel-focus-ring-offset, 2px);\n      }\n\n      .kh-input__control:disabled {\n        background: var(--keel-color-bg-subtle, #f9fafb);\n        color: var(--keel-color-text-disabled, #9ca3af);\n        cursor: not-allowed;\n      }\n\n      .kh-input--invalid .kh-input__control {\n        border-color: var(--keel-color-danger, #ef4444);\n      }\n\n      .kh-input__helper {\n        font-size: var(--keel-font-size-sm, 0.875rem);\n        color: var(--keel-color-text-muted, #6b7280);\n      }\n\n      .kh-input--invalid .kh-input__helper {\n        color: var(--keel-color-danger, #ef4444);\n      }\n\n      .kh-input__label:empty,\n      .kh-input__helper:empty {\n        display: none;\n      }\n    "], dependencies: [{ kind: "ngmodule", type: CommonModule }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.1.5", ngImport: i0, type: KeelInputComponent, decorators: [{
            type: Component,
            args: [{ selector: 'keel-input', standalone: true, imports: [CommonModule], providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => KeelInputComponent),
                            multi: true,
                        },
                    ], changeDetection: ChangeDetectionStrategy.OnPush, template: `
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
  `, host: {
                        '[class.kh-input--invalid]': 'invalid',
                    }, styles: ["\n      :host {\n        display: block;\n      }\n\n      .kh-input {\n        display: grid;\n        gap: var(--keel-space-xs, 4px);\n        color: var(--keel-color-text-base, #111827);\n        font-family: var(--keel-font-family);\n      }\n\n      .kh-input__label {\n        font-size: var(--keel-font-size-sm, 0.875rem);\n        font-weight: var(--keel-font-weight-medium, 500);\n        line-height: var(--keel-line-height-base, 1.5);\n      }\n\n      .kh-input__control {\n        width: 100%;\n        padding: var(--keel-space-sm, 8px) var(--keel-space-md, 12px);\n        border: 1px solid var(--keel-color-border, #e5e7eb);\n        border-radius: var(--keel-radius-md, 6px);\n        background: var(--keel-color-bg-base, #ffffff);\n        color: var(--keel-color-text-base, #111827);\n        font-family: inherit;\n        font-size: var(--keel-font-size-md, var(--keel-font-size-base, 1rem));\n        line-height: var(--keel-line-height-base, 1.5);\n        transition:\n          border-color var(--keel-transition-fast, 150ms ease),\n          box-shadow var(--keel-transition-fast, 150ms ease);\n      }\n\n      .kh-input__control:hover:not(:disabled) {\n        border-color: var(--keel-color-border-strong, #d1d5db);\n      }\n\n      .kh-input__control:focus-visible {\n        outline: var(--keel-focus-ring-width, 2px) solid\n          var(--keel-focus-ring-color, var(--keel-color-border-focus, #3b82f6));\n        outline-offset: var(--keel-focus-ring-offset, 2px);\n      }\n\n      .kh-input__control:disabled {\n        background: var(--keel-color-bg-subtle, #f9fafb);\n        color: var(--keel-color-text-disabled, #9ca3af);\n        cursor: not-allowed;\n      }\n\n      .kh-input--invalid .kh-input__control {\n        border-color: var(--keel-color-danger, #ef4444);\n      }\n\n      .kh-input__helper {\n        font-size: var(--keel-font-size-sm, 0.875rem);\n        color: var(--keel-color-text-muted, #6b7280);\n      }\n\n      .kh-input--invalid .kh-input__helper {\n        color: var(--keel-color-danger, #ef4444);\n      }\n\n      .kh-input__label:empty,\n      .kh-input__helper:empty {\n        display: none;\n      }\n    "] }]
        }], propDecorators: { type: [{
                type: Input
            }], name: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], disabled: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], invalid: [{
                type: Input,
                args: [{ transform: booleanAttribute }]
            }], valueChange: [{
                type: Output
            }] } });
//# sourceMappingURL=keel-input.component.js.map