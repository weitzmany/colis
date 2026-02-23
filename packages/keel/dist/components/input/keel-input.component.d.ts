import { EventEmitter } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import * as i0 from "@angular/core";
export type KeelInputType = 'text' | 'email' | 'password' | 'number' | 'search';
export declare class KeelInputComponent implements ControlValueAccessor {
    type: KeelInputType;
    name: string;
    placeholder: string;
    disabled: boolean;
    invalid: boolean;
    valueChange: EventEmitter<string>;
    value: string;
    private onChange;
    private onTouched;
    writeValue(value: string | null): void;
    registerOnChange(fn: (value: string) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    onInput(event: Event): void;
    onBlur(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<KeelInputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<KeelInputComponent, "keel-input", never, { "type": { "alias": "type"; "required": false; }; "name": { "alias": "name"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "invalid": { "alias": "invalid"; "required": false; }; }, { "valueChange": "valueChange"; }, never, ["[keelInputLabel]", "[keelInputHelper]"], true, never>;
    static ngAcceptInputType_disabled: unknown;
    static ngAcceptInputType_invalid: unknown;
}
//# sourceMappingURL=keel-input.component.d.ts.map