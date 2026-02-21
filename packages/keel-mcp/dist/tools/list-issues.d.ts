export interface ListIssuesInput {
    package?: string;
    type?: 'bug' | 'feature-request' | 'question';
    status?: 'open' | 'in-progress' | 'resolved' | 'awaiting-confirmation';
    limit?: number;
}
export interface GithubIssue {
    number: number;
    title: string;
    url: string;
    state: string;
    labels: string[];
    createdAt: string;
    body?: string;
}
export interface ListIssuesOutput {
    success: boolean;
    issues: GithubIssue[];
    total: number;
    message: string;
    fallback_url?: string;
}
export declare function listIssues(input?: ListIssuesInput): ListIssuesOutput;
//# sourceMappingURL=list-issues.d.ts.map