import { SimpleGit } from 'simple-git';
export declare function getGit(projectRoot: string): SimpleGit;
export declare function isGitInstalled(): Promise<boolean>;
export declare function isGitRepo(projectRoot: string): Promise<boolean>;
export declare function initGitRepo(projectRoot: string): Promise<void>;
export declare function getCurrentBranch(projectRoot: string): Promise<string | null>;
export declare function getGitConfig(projectRoot: string, key: string): Promise<string | null>;
export declare function setGitConfig(projectRoot: string, key: string, value: string, scope?: 'local' | 'global'): Promise<void>;
export declare function getRemoteUrl(projectRoot: string, remoteName?: string): Promise<string | null>;
export declare function addRemote(projectRoot: string, remoteName: string, url: string): Promise<void>;
export declare function hasRemote(projectRoot: string, remoteName?: string): Promise<boolean>;
export declare function getGitUserName(projectRoot: string): Promise<string | null>;
export declare function getGitUserEmail(projectRoot: string): Promise<string | null>;
export declare function setGitUserName(projectRoot: string, name: string, scope?: 'local' | 'global'): Promise<void>;
export declare function setGitUserEmail(projectRoot: string, email: string, scope?: 'local' | 'global'): Promise<void>;
export declare function findNestedGitDirs(projectRoot: string): Promise<string[]>;
export declare function enforceMonorepoStructure(projectRoot: string): Promise<{
    removed: string[];
    errors: string[];
}>;
//# sourceMappingURL=git-utils.d.ts.map