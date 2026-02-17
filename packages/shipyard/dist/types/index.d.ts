export interface LandfallTemplateOptions {
    awsRegion: string;
    ecsCluster: string;
    ecsService: string;
    s3Bucket: string;
    cloudFrontDistributionId: string;
}
export interface InitOptions {
    projectRoot: string;
    force?: boolean;
    landfall?: Partial<LandfallTemplateOptions>;
}
export interface FeatureInstallOptions {
    projectRoot: string;
    force?: boolean;
}
export interface LandfallInstallOptions extends FeatureInstallOptions, LandfallTemplateOptions {
}
export interface ApplyResult {
    updatedFiles: string[];
    skippedFiles: string[];
    warnings: string[];
}
//# sourceMappingURL=index.d.ts.map