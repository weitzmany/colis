import type { ExpertContributor, ExpertRegistryResult } from '../types';
export declare function getExpertRegistryPath(): string;
export declare function loadExpertRegistry(): Promise<ExpertContributor[]>;
export declare function saveExpertRegistry(experts: ExpertContributor[]): Promise<void>;
export declare function findExpertByEmail(email: string): Promise<ExpertContributor | null>;
export declare function findExpertByGitHub(githubUsername: string): Promise<ExpertContributor | null>;
export declare function registerExpert(expert: ExpertContributor): Promise<ExpertRegistryResult>;
export declare function listExperts(): Promise<ExpertContributor[]>;
export declare function setupExpertGitIdentity(projectRoot: string, email: string): Promise<{
    success: boolean;
    expert?: ExpertContributor;
    error?: string;
}>;
export declare function detectCurrentExpert(projectRoot: string): Promise<ExpertContributor | null>;
//# sourceMappingURL=expert-utils.d.ts.map