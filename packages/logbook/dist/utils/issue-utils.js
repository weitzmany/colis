"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRepoMapPath = getRepoMapPath;
exports.loadRepoMapping = loadRepoMapping;
exports.getPackagesRepo = getPackagesRepo;
exports.createPackagesIssue = createPackagesIssue;
exports.listPackagesIssues = listPackagesIssues;
exports.viewPackagesIssue = viewPackagesIssue;
exports.getMaintainerResponses = getMaintainerResponses;
const path_1 = __importDefault(require("path"));
const file_utils_1 = require("./file-utils");
const gh_utils_1 = require("./gh-utils");
const REPO_MAP_PATH = 'assets/config/gh-repo-map.json';
function getRepoMapPath() {
    const packageRoot = path_1.default.resolve(__dirname, '../..');
    return path_1.default.join(packageRoot, REPO_MAP_PATH);
}
async function loadRepoMapping() {
    const mapPath = getRepoMapPath();
    if (!(await (0, file_utils_1.fileExists)(mapPath))) {
        return null;
    }
    try {
        return await (0, file_utils_1.readJson)(mapPath);
    }
    catch {
        return null;
    }
}
async function getPackagesRepo() {
    const mapping = await loadRepoMapping();
    return mapping?.packagesRepo || null;
}
async function createPackagesIssue(options) {
    const packagesRepo = await getPackagesRepo();
    if (!packagesRepo) {
        return {
            success: false,
            error: 'Packages repo not configured. Run initialization first.'
        };
    }
    const labels = options.labels || [];
    if (options.projectName) {
        labels.push(`project:${options.projectName}`);
    }
    return (0, gh_utils_1.openIssue)(packagesRepo, {
        ...options,
        labels
    });
}
async function listPackagesIssues(options) {
    const packagesRepo = await getPackagesRepo();
    if (!packagesRepo) {
        return {
            success: false,
            error: 'Packages repo not configured. Run initialization first.'
        };
    }
    return (0, gh_utils_1.listIssues)(packagesRepo, options);
}
async function viewPackagesIssue(issueNumber) {
    const packagesRepo = await getPackagesRepo();
    if (!packagesRepo) {
        return {
            success: false,
            error: 'Packages repo not configured. Run initialization first.'
        };
    }
    return (0, gh_utils_1.viewIssue)(packagesRepo, issueNumber);
}
async function getMaintainerResponses(issueNumber) {
    const packagesRepo = await getPackagesRepo();
    if (!packagesRepo) {
        return {
            success: false,
            error: 'Packages repo not configured. Run initialization first.'
        };
    }
    const commentsResult = await (0, gh_utils_1.getIssueComments)(packagesRepo, issueNumber);
    if (!commentsResult.success) {
        return {
            success: false,
            error: commentsResult.error
        };
    }
    return {
        success: true,
        responses: commentsResult.comments
    };
}
//# sourceMappingURL=issue-utils.js.map