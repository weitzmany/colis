export interface CloseIssueInput {
    issue_number: number;
    comment?: string;
}
export interface CloseIssueOutput {
    success: boolean;
    issue_url?: string;
    message: string;
}
export declare function closeIssue(input: CloseIssueInput): CloseIssueOutput;
//# sourceMappingURL=close-issue.d.ts.map