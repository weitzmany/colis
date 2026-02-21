export interface GetComponentApiInput {
    component: string;
}
export declare function getComponentApi(input: GetComponentApiInput): {
    error: string;
    availableSelectors: string[];
    name?: undefined;
    selector?: undefined;
    importPath?: undefined;
    status?: undefined;
    phase?: undefined;
    inputs?: undefined;
    outputs?: undefined;
    slots?: undefined;
    cssTokens?: undefined;
    angularUsage?: undefined;
} | {
    name: string;
    selector: string;
    importPath: string;
    status: import("../data/components.js").ComponentStatus;
    phase: number;
    inputs: import("../data/components.js").ComponentInput[];
    outputs: import("../data/components.js").ComponentOutput[];
    slots: import("../data/components.js").ComponentSlot[];
    cssTokens: string[];
    angularUsage: {
        import: string;
        componentDecorator: string;
        selector: string;
    };
    error?: undefined;
    availableSelectors?: undefined;
};
//# sourceMappingURL=get-component-api.d.ts.map