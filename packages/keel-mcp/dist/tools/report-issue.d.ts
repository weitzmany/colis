export interface ReportIssueInput {
    package: string;
    title: string;
    description: string;
    expert_name?: string;
    expert_role?: string;
    project?: string;
    version?: string;
}
export interface ReportIssueOutput {
    success: boolean;
    issue_url?: string;
    issue_number?: number;
    message: string;
    fallback_url?: string;
}
export declare function reportIssue(input: ReportIssueInput): ReportIssueOutput;
//# sourceMappingURL=report-issue.d.ts.map