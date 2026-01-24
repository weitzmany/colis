export type ProjectType = 'nodejs' | 'python' | 'go' | 'generic';
export type IssueType = 'missing' | 'outdated' | 'broken' | 'misconfigured' | 'unauthenticated';
export type IssueSeverity = 'error' | 'warning' | 'info';
export type HealthStatusType = 'healthy' | 'warnings' | 'errors';
export interface InitOptions {
    projectRoot: string;
    projectType: ProjectType;
    options?: {
        hooksEnabled?: string[];
        commitTemplate?: boolean;
        prTemplate?: boolean;
        issueTemplates?: boolean;
        createRemoteRepo?: boolean;
        remoteRepoName?: string;
        remoteVisibility?: 'public' | 'private';
    };
}
export interface InitResult {
    success: boolean;
    installed: string[];
    skipped: string[];
    errors: string[];
    ghInstalled: boolean;
    ghAuthenticated: boolean;
    remoteRepoCreated: boolean;
    remoteRepoUrl?: string;
    expertRegistered: boolean;
    expertGitHubUser?: string;
}
export interface VerifyOptions {
    projectRoot: string;
}
export interface Issue {
    type: IssueType;
    file: string;
    message: string;
    severity: IssueSeverity;
}
export interface HealthStatus {
    status: HealthStatusType;
    issues: Issue[];
    recommendations: string[];
    ghInstalled: boolean;
    ghAuthenticated: boolean;
    remoteRepoExists: boolean;
    expertMapped: boolean;
}
export interface RepairOptions {
    projectRoot: string;
    issues: Issue[];
}
export interface RepairResult {
    repaired: string[];
    failed: string[];
}
export interface UpdateOptions {
    projectRoot: string;
    options?: {
        force?: boolean;
        backup?: boolean;
        interactive?: boolean;
    };
}
export interface UpdateResult {
    updated: string[];
    skipped: string[];
    backed_up: string[];
}
export interface GhInstallResult {
    installed: boolean;
    alreadyInstalled: boolean;
    method?: 'brew' | 'apt' | 'winget' | 'choco' | 'manual';
    error?: string;
}
export interface GhAuthResult {
    authenticated: boolean;
    username?: string;
    error?: string;
}
export interface GhRepoCreateResult {
    created: boolean;
    alreadyExists: boolean;
    repoUrl?: string;
    error?: string;
}
export interface ExpertContributor {
    name: string;
    email: string;
    githubUsername: string;
    expertise: string[];
}
export interface ExpertRegistryResult {
    registered: boolean;
    expert?: ExpertContributor;
    error?: string;
}
export interface IssueCreateOptions {
    title: string;
    body: string;
    labels?: string[];
    projectName?: string;
}
export interface IssueListOptions {
    projectName?: string;
    state?: 'open' | 'closed' | 'all';
    limit?: number;
}
export interface GitHubIssue {
    number: number;
    title: string;
    state: string;
    url: string;
    body: string;
    labels: string[];
    createdAt: string;
    updatedAt: string;
    comments: number;
}
//# sourceMappingURL=index.d.ts.map