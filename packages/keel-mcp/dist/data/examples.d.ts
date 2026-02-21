/**
 * Usage examples for keel components.
 *
 * Sync requirement (package_docs_sync.mdc):
 * Add examples here when new components are added to @colis/keel.
 */
export interface ComponentExample {
    component: string;
    title: string;
    variant?: string;
    description: string;
    imports: string;
    componentDecorator: string;
    template: string;
}
export declare const COMPONENT_EXAMPLES: ComponentExample[];
export declare function getExamplesForComponent(component: string, variant?: string): ComponentExample[];
//# sourceMappingURL=examples.d.ts.map