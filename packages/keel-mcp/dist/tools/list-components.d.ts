import { ComponentStatus } from '../data/components.js';
export interface ListComponentsInput {
    status?: ComponentStatus | 'all';
}
export declare function listComponents(input?: ListComponentsInput): {
    components: {
        name: string;
        selector: string;
        importPath: string;
        status: ComponentStatus;
        description: string;
        phase: number;
        storyUrl: string | null;
        docsUrl: string;
    }[];
    total: number;
    available: number;
    planned: number;
};
//# sourceMappingURL=list-components.d.ts.map