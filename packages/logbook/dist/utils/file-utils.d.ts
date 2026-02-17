export declare function getAssetsDir(): string;
export declare function copyFile(src: string, dest: string, options?: {
    preservePermissions?: boolean;
}): Promise<void>;
export declare function makeExecutable(filePath: string): Promise<void>;
export declare function fileExists(filePath: string): Promise<boolean>;
export declare function readJson<T>(filePath: string): Promise<T>;
export declare function writeJson(filePath: string, data: any): Promise<void>;
export declare function createBackup(filePath: string): Promise<string>;
export declare function getFilesRecursive(dir: string): Promise<string[]>;
//# sourceMappingURL=file-utils.d.ts.map