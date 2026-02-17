export * from './types';
export * from './lifecycle';
export * from './utils';
export declare class GitWorkflow {
    static init(options: import('./types').InitOptions): Promise<import('./types').InitResult>;
    static verify(options: import('./types').VerifyOptions): Promise<import('./types').HealthStatus>;
    static mend(options: import('./types').MendOptions): Promise<import('./types').MendResult>;
    static update(options: import('./types').UpdateOptions): Promise<import('./types').UpdateResult>;
}
//# sourceMappingURL=index.d.ts.map