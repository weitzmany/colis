export * from './types';
export * from './lifecycle';
export * from './utils';
export declare class GitWorkflow {
    static init(options: import('./types').InitOptions): Promise<import('./types').InitResult>;
    static verify(options: import('./types').VerifyOptions): Promise<import('./types').HealthStatus>;
    static repair(options: import('./types').RepairOptions): Promise<import('./types').RepairResult>;
    static update(options: import('./types').UpdateOptions): Promise<import('./types').UpdateResult>;
}
//# sourceMappingURL=index.d.ts.map