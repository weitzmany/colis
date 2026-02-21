export interface RequestFeatureInput {
    package: string;
    title: string;
    use_case: string;
    expert_name?: string;
    expert_role?: string;
    project?: string;
    proposed_solution?: string;
}
export interface RequestFeatureOutput {
    success: boolean;
    issue_url?: string;
    issue_number?: number;
    message: string;
    fallback_url?: string;
}
export declare function requestFeature(input: RequestFeatureInput): RequestFeatureOutput;
//# sourceMappingURL=request-feature.d.ts.map