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
exports.Shipyard = void 0;
__exportStar(require("./types"), exports);
__exportStar(require("./lifecycle"), exports);
const lifecycle_1 = require("./lifecycle");
const dockside_1 = require("./features/dockside");
const passage_1 = require("./features/passage");
const landfall_1 = require("./features/landfall");
class Shipyard {
    static async init(options) {
        return (0, lifecycle_1.init)(options);
    }
    static async installDockside(options) {
        return (0, dockside_1.installDockside)(options);
    }
    static async installPassage(options) {
        return (0, passage_1.installPassage)(options);
    }
    static async installLandfall(options) {
        return (0, landfall_1.installLandfall)(options);
    }
}
exports.Shipyard = Shipyard;
//# sourceMappingURL=index.js.map