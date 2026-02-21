/**
 * Keel component registry.
 *
 * Sync requirement (package_docs_sync.mdc):
 * When a new component is added to @colis/keel, add an entry here
 * and update status to 'available' when the component ships.
 */
export type ComponentStatus = 'available' | 'planned' | 'deprecated';
export interface ComponentInput {
    name: string;
    type: string;
    default?: unknown;
    required: boolean;
    description: string;
}
export interface ComponentOutput {
    name: string;
    type: string;
    description: string;
}
export interface ComponentSlot {
    name: string;
    description: string;
}
export interface KeelComponent {
    name: string;
    selector: string;
    importPath: string;
    status: ComponentStatus;
    description: string;
    phase: number;
    inputs: ComponentInput[];
    outputs: ComponentOutput[];
    slots: ComponentSlot[];
    cssTokens: string[];
    storyId: string | null;
    docsPath: string;
}
export declare const KEEL_COMPONENTS: KeelComponent[];
export declare function getComponentBySelector(selector: string): KeelComponent | undefined;
//# sourceMappingURL=components.d.ts.map