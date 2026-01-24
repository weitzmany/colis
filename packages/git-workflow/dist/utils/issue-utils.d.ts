import type { IssueCreateOptions, IssueListOptions, GitHubIssue } from '../types';
interface RepoMapping {
    packagesRepo: string;
    projects: Record<string, string>;
}
export declare function getRepoMapPath(): string;
export declare function loadRepoMapping(): Promise<RepoMapping | null>;
export declare function getPackagesRepo(): Promise<string | null>;
export declare function createPackagesIssue(options: IssueCreateOptions): Promise<{
    success: boolean;
    issueUrl?: string;
    error?: string;
}>;
export declare function listPackagesIssues(options?: IssueListOptions): Promise<{
    success: boolean;
    issues?: GitHubIssue[];
    error?: string;
}>;
export declare function viewPackagesIssue(issueNumber: number): Promise<{
    success: boolean;
    issue?: GitHubIssue;
    error?: string;
}>;
export declare function getMaintainerResponses(issueNumber: number): Promise<{
    success: boolean;
    responses?: Array<{
        author: string;
        body: string;
        createdAt: string;
    }>;
    error?: string;
}>;
export {};
//# sourceMappingURL=issue-utils.d.ts.map