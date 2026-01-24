/**
 * Monorepo Structure Enforcer
 *
 * Ensures project maintains monorepo structure by removing nested .git directories.
 * This is particularly important after framework CLIs (like Angular CLI) create projects,
 * as they automatically initialize git repositories.
 */
/**
 * Remove nested .git directories to enforce monorepo structure
 */
export declare function enforceMonorepoStructure(projectRoot: string): Promise<{
    removed: string[];
    errors: string[];
}>;
//# sourceMappingURL=monorepo-enforcer.d.ts.map