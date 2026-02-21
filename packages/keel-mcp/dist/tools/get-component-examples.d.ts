export interface GetComponentExamplesInput {
    component: string;
    variant?: string;
}
export declare function getComponentExamples(input: GetComponentExamplesInput): {
    error: string;
    availableSelectors: string[];
    component?: undefined;
    status?: undefined;
    note?: undefined;
    examples?: undefined;
} | {
    component: string;
    status: string;
    note: string;
    examples: import("../data/examples.js").ComponentExample[];
    error?: undefined;
    availableSelectors?: undefined;
} | {
    component: string;
    status: "available" | "deprecated";
    examples: import("../data/examples.js").ComponentExample[];
    error?: undefined;
    availableSelectors?: undefined;
    note?: undefined;
};
//# sourceMappingURL=get-component-examples.d.ts.map