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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGit = getGit;
exports.isGitInstalled = isGitInstalled;
exports.isGitRepo = isGitRepo;
exports.initGitRepo = initGitRepo;
exports.getCurrentBranch = getCurrentBranch;
exports.getGitConfig = getGitConfig;
exports.setGitConfig = setGitConfig;
exports.getRemoteUrl = getRemoteUrl;
exports.addRemote = addRemote;
exports.hasRemote = hasRemote;
exports.getGitUserName = getGitUserName;
exports.getGitUserEmail = getGitUserEmail;
exports.setGitUserName = setGitUserName;
exports.setGitUserEmail = setGitUserEmail;
exports.findNestedGitDirs = findNestedGitDirs;
exports.enforceMonorepoStructure = enforceMonorepoStructure;
const simple_git_1 = require("simple-git");
const path_1 = __importDefault(require("path"));
const file_utils_1 = require("./file-utils");
function getGit(projectRoot) {
    const options = {
        baseDir: projectRoot,
        binary: 'git',
        maxConcurrentProcesses: 6,
    };
    return (0, simple_git_1.simpleGit)(options);
}
async function isGitInstalled() {
    try {
        const git = (0, simple_git_1.simpleGit)();
        await git.version();
        return true;
    }
    catch {
        return false;
    }
}
async function isGitRepo(projectRoot) {
    const gitDir = path_1.default.join(projectRoot, '.git');
    return (0, file_utils_1.fileExists)(gitDir);
}
async function initGitRepo(projectRoot) {
    const git = getGit(projectRoot);
    await git.init();
}
async function getCurrentBranch(projectRoot) {
    try {
        const git = getGit(projectRoot);
        const branch = await git.branch();
        return branch.current;
    }
    catch {
        return null;
    }
}
async function getGitConfig(projectRoot, key) {
    try {
        const git = getGit(projectRoot);
        const value = await git.getConfig(key);
        return value.value || null;
    }
    catch {
        return null;
    }
}
async function setGitConfig(projectRoot, key, value, scope = 'local') {
    const git = getGit(projectRoot);
    await git.addConfig(key, value, false, scope);
}
async function getRemoteUrl(projectRoot, remoteName = 'origin') {
    try {
        const git = getGit(projectRoot);
        const remotes = await git.getRemotes(true);
        const remote = remotes.find((r) => r.name === remoteName);
        return remote?.refs?.fetch || null;
    }
    catch {
        return null;
    }
}
async function addRemote(projectRoot, remoteName, url) {
    const git = getGit(projectRoot);
    await git.addRemote(remoteName, url);
}
async function hasRemote(projectRoot, remoteName = 'origin') {
    try {
        const git = getGit(projectRoot);
        const remotes = await git.getRemotes();
        return remotes.some((r) => r.name === remoteName);
    }
    catch {
        return false;
    }
}
async function getGitUserName(projectRoot) {
    return getGitConfig(projectRoot, 'user.name');
}
async function getGitUserEmail(projectRoot) {
    return getGitConfig(projectRoot, 'user.email');
}
async function setGitUserName(projectRoot, name, scope = 'local') {
    await setGitConfig(projectRoot, 'user.name', name, scope);
}
async function setGitUserEmail(projectRoot, email, scope = 'local') {
    await setGitConfig(projectRoot, 'user.email', email, scope);
}
async function findNestedGitDirs(projectRoot) {
    const fs = await Promise.resolve().then(() => __importStar(require('fs-extra')));
    const path = await Promise.resolve().then(() => __importStar(require('path')));
    const nestedGitDirs = [];
    async function scanDirectory(dir) {
        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.name === 'node_modules' ||
                    entry.name === '.npm' ||
                    entry.name === '.yarn' ||
                    entry.name === 'dist' ||
                    entry.name === 'build') {
                    continue;
                }
                if (entry.isDirectory()) {
                    if (entry.name === '.git' && fullPath !== path.join(projectRoot, '.git')) {
                        nestedGitDirs.push(fullPath);
                    }
                    else if (entry.name !== '.git') {
                        await scanDirectory(fullPath);
                    }
                }
            }
        }
        catch (error) {
        }
    }
    await scanDirectory(projectRoot);
    return nestedGitDirs;
}
async function enforceMonorepoStructure(projectRoot) {
    const fs = await Promise.resolve().then(() => __importStar(require('fs-extra')));
    const removed = [];
    const errors = [];
    const nestedGitDirs = await findNestedGitDirs(projectRoot);
    for (const gitDir of nestedGitDirs) {
        try {
            await fs.remove(gitDir);
            removed.push(gitDir);
        }
        catch (error) {
            errors.push(`Failed to remove ${gitDir}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    return { removed, errors };
}
//# sourceMappingURL=git-utils.js.map