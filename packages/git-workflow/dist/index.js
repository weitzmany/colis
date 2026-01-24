"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GitWorkflow = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./lifecycle"), exports);
__exportStar(require("./utils"), exports);
const lifecycle_1 = require("./lifecycle");
class GitWorkflow {
    static async init(options) {
        return lifecycle_1.GitWorkflowLifecycle.init(options);
    }
    static async verify(options) {
        return lifecycle_1.GitWorkflowLifecycle.verify(options);
    }
    static async repair(options) {
        return lifecycle_1.GitWorkflowLifecycle.repair(options);
    }
    static async update(options) {
        return lifecycle_1.GitWorkflowLifecycle.update(options);
    }
}
exports.GitWorkflow = GitWorkflow;
//# sourceMappingURL=index.js.map