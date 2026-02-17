export * from './types';
export * from './lifecycle';
import type { ApplyResult, FeatureInstallOptions, InitOptions, LandfallInstallOptions } from './types';
export declare class Shipyard {
    static init(options: InitOptions): Promise<ApplyResult>;
    static installDockside(options: FeatureInstallOptions): Promise<ApplyResult>;
    static installPassage(options: FeatureInstallOptions): Promise<ApplyResult>;
    static installLandfall(options: LandfallInstallOptions): Promise<ApplyResult>;
}
//# sourceMappingURL=index.d.ts.map