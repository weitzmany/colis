"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAssetsDir = getAssetsDir;
exports.copyFile = copyFile;
exports.makeExecutable = makeExecutable;
exports.fileExists = fileExists;
exports.readJson = readJson;
exports.writeJson = writeJson;
exports.createBackup = createBackup;
exports.getFilesRecursive = getFilesRecursive;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
function getAssetsDir() {
    const packageRoot = path_1.default.resolve(__dirname, '../..');
    return path_1.default.join(packageRoot, 'assets');
}
async function copyFile(src, dest, options) {
    await fs_extra_1.default.ensureDir(path_1.default.dirname(dest));
    await fs_extra_1.default.copy(src, dest, {
        overwrite: true,
        preserveTimestamps: true
    });
    if (options?.preservePermissions) {
        const stats = await fs_extra_1.default.stat(src);
        await fs_extra_1.default.chmod(dest, stats.mode);
    }
}
async function makeExecutable(filePath) {
    const stats = await fs_extra_1.default.stat(filePath);
    await fs_extra_1.default.chmod(filePath, stats.mode | 0o111);
}
async function fileExists(filePath) {
    try {
        await fs_extra_1.default.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
async function readJson(filePath) {
    return fs_extra_1.default.readJson(filePath);
}
async function writeJson(filePath, data) {
    await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
    await fs_extra_1.default.writeJson(filePath, data, { spaces: 2 });
}
async function createBackup(filePath) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `${filePath}.backup-${timestamp}`;
    await fs_extra_1.default.copy(filePath, backupPath);
    return backupPath;
}
async function getFilesRecursive(dir) {
    const entries = await fs_extra_1.default.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (entry) => {
        const fullPath = path_1.default.join(dir, entry.name);
        if (entry.isDirectory()) {
            return getFilesRecursive(fullPath);
        }
        return [fullPath];
    }));
    return files.flat();
}
//# sourceMappingURL=file-utils.js.map