import { EventEmitter } from '@angular/core';
import * as i0 from "@angular/core";
export type KeelButtonVariant = 'solid' | 'outline' | 'flat' | 'link';
export type KeelButtonTheme = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'tertiary' | 'dark';
export type KeelButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export declare class KeelButtonComponent {
    variant: KeelButtonVariant;
    theme: KeelButtonTheme;
    size: KeelButtonSize;
    rounded: boolean;
    disabled: boolean;
    clicked: EventEmitter<void>;
    get buttonClasses(): string[];
    onClick(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<KeelButtonComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<KeelButtonComponent, "keel-button", never, { "variant": { "alias": "variant"; "required": false; }; "theme": { "alias": "theme"; "required": false; }; "size": { "alias": "size"; "required": false; }; "rounded": { "alias": "rounded"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; }, { "clicked": "clicked"; }, never, ["[keelButtonIcon]", "*"], true, never>;
    static ngAcceptInputType_rounded: unknown;
    static ngAcceptInputType_disabled: unknown;
}
//# sourceMappingURL=keel-button.component.d.ts.map