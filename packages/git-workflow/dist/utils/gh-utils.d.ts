import type { GhInstallResult, GhAuthResult, GhRepoCreateResult, IssueCreateOptions, IssueListOptions, GitHubIssue } from '../types';
export declare function isGhInstalled(): Promise<boolean>;
export declare function installGh(): Promise<GhInstallResult>;
export declare function ensureGhInstalled(): Promise<GhInstallResult>;
export declare function checkGhAuth(): Promise<GhAuthResult>;
export declare function ghAuthLogin(): Promise<GhAuthResult>;
export declare function ensureGhAuth(): Promise<GhAuthResult>;
export declare function checkRepoExists(repoSlug: string): Promise<boolean>;
export declare function setRepoVisibility(repoSlug: string, visibility: 'public' | 'private'): Promise<{
    success: boolean;
    error?: string;
}>;
export declare function createGhRepo(repoName: string, options?: {
    description?: string;
    visibility?: 'public' | 'private';
    homepage?: string;
}): Promise<GhRepoCreateResult>;
export declare function openIssue(repoSlug: string, options: IssueCreateOptions): Promise<{
    success: boolean;
    issueUrl?: string;
    error?: string;
}>;
export declare function listIssues(repoSlug: string, options?: IssueListOptions): Promise<{
    success: boolean;
    issues?: GitHubIssue[];
    error?: string;
}>;
export declare function viewIssue(repoSlug: string, issueNumber: number): Promise<{
    success: boolean;
    issue?: GitHubIssue;
    error?: string;
}>;
export declare function getIssueComments(repoSlug: string, issueNumber: number): Promise<{
    success: boolean;
    comments?: Array<{
        author: string;
        body: string;
        createdAt: string;
    }>;
    error?: string;
}>;
//# sourceMappingURL=gh-utils.d.ts.map