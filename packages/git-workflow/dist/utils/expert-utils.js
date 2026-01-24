"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpertRegistryPath = getExpertRegistryPath;
exports.loadExpertRegistry = loadExpertRegistry;
exports.saveExpertRegistry = saveExpertRegistry;
exports.findExpertByEmail = findExpertByEmail;
exports.findExpertByGitHub = findExpertByGitHub;
exports.registerExpert = registerExpert;
exports.listExperts = listExperts;
exports.setupExpertGitIdentity = setupExpertGitIdentity;
exports.detectCurrentExpert = detectCurrentExpert;
const path_1 = __importDefault(require("path"));
const file_utils_1 = require("./file-utils");
const git_utils_1 = require("./git-utils");
const EXPERT_REGISTRY_PATH = 'assets/config/experts-registry.json';
function getExpertRegistryPath() {
    const packageRoot = path_1.default.resolve(__dirname, '../..');
    return path_1.default.join(packageRoot, EXPERT_REGISTRY_PATH);
}
async function loadExpertRegistry() {
    const registryPath = getExpertRegistryPath();
    if (!(await (0, file_utils_1.fileExists)(registryPath))) {
        return [];
    }
    try {
        const data = await (0, file_utils_1.readJson)(registryPath);
        return data.experts || [];
    }
    catch {
        return [];
    }
}
async function saveExpertRegistry(experts) {
    const registryPath = getExpertRegistryPath();
    await (0, file_utils_1.writeJson)(registryPath, { experts });
}
async function findExpertByEmail(email) {
    const experts = await loadExpertRegistry();
    return experts.find((e) => e.email.toLowerCase() === email.toLowerCase()) || null;
}
async function findExpertByGitHub(githubUsername) {
    const experts = await loadExpertRegistry();
    return experts.find((e) => e.githubUsername.toLowerCase() === githubUsername.toLowerCase()) || null;
}
async function registerExpert(expert) {
    try {
        const experts = await loadExpertRegistry();
        const existing = experts.find((e) => e.email.toLowerCase() === expert.email.toLowerCase());
        if (existing) {
            const index = experts.indexOf(existing);
            experts[index] = { ...existing, ...expert };
        }
        else {
            experts.push(expert);
        }
        await saveExpertRegistry(experts);
        return {
            registered: true,
            expert
        };
    }
    catch (error) {
        return {
            registered: false,
            error: error instanceof Error ? error.message : 'Failed to register expert'
        };
    }
}
async function listExperts() {
    return loadExpertRegistry();
}
async function setupExpertGitIdentity(projectRoot, email) {
    try {
        const expert = await findExpertByEmail(email);
        if (!expert) {
            return {
                success: false,
                error: `No expert found with email: ${email}`
            };
        }
        await (0, git_utils_1.setGitUserName)(projectRoot, expert.name);
        await (0, git_utils_1.setGitUserEmail)(projectRoot, expert.email);
        return {
            success: true,
            expert
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to set up git identity'
        };
    }
}
async function detectCurrentExpert(projectRoot) {
    try {
        const email = await (0, git_utils_1.getGitUserEmail)(projectRoot);
        if (!email) {
            return null;
        }
        return findExpertByEmail(email);
    }
    catch {
        return null;
    }
}
//# sourceMappingURL=expert-utils.js.map