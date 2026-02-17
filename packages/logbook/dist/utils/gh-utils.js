"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGhInstalled = isGhInstalled;
exports.installGh = installGh;
exports.ensureGhInstalled = ensureGhInstalled;
exports.checkGhAuth = checkGhAuth;
exports.ghAuthLogin = ghAuthLogin;
exports.ensureGhAuth = ensureGhAuth;
exports.checkRepoExists = checkRepoExists;
exports.setRepoVisibility = setRepoVisibility;
exports.createGhRepo = createGhRepo;
exports.openIssue = openIssue;
exports.listIssues = listIssues;
exports.viewIssue = viewIssue;
exports.getIssueComments = getIssueComments;
const execa_1 = __importDefault(require("execa"));
const os_1 = __importDefault(require("os"));
async function isGhInstalled() {
    try {
        await (0, execa_1.default)('gh', ['--version']);
        return true;
    }
    catch {
        return false;
    }
}
async function installGh() {
    const platform = os_1.default.platform();
    try {
        if (platform === 'darwin') {
            await (0, execa_1.default)('brew', ['install', 'gh']);
            return { installed: true, alreadyInstalled: false, method: 'brew' };
        }
        else if (platform === 'linux') {
            try {
                await (0, execa_1.default)('sudo', ['apt', 'install', '-y', 'gh']);
                return { installed: true, alreadyInstalled: false, method: 'apt' };
            }
            catch {
                return {
                    installed: false,
                    alreadyInstalled: false,
                    error: 'Automatic installation failed. Please install gh manually: https://cli.github.com/'
                };
            }
        }
        else if (platform === 'win32') {
            try {
                await (0, execa_1.default)('winget', ['install', '--id', 'GitHub.cli']);
                return { installed: true, alreadyInstalled: false, method: 'winget' };
            }
            catch {
                try {
                    await (0, execa_1.default)('choco', ['install', 'gh', '-y']);
                    return { installed: true, alreadyInstalled: false, method: 'choco' };
                }
                catch {
                    return {
                        installed: false,
                        alreadyInstalled: false,
                        error: 'Automatic installation failed. Please install gh manually: https://cli.github.com/'
                    };
                }
            }
        }
        return {
            installed: false,
            alreadyInstalled: false,
            error: `Unsupported platform: ${platform}`
        };
    }
    catch (error) {
        return {
            installed: false,
            alreadyInstalled: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
async function ensureGhInstalled() {
    const installed = await isGhInstalled();
    if (installed) {
        return { installed: true, alreadyInstalled: true };
    }
    return installGh();
}
async function checkGhAuth() {
    try {
        const { stdout, stderr } = await (0, execa_1.default)('gh', ['auth', 'status']);
        const output = stdout || stderr || '';
        const match = output.match(/account\s+(\S+)/);
        const username = match?.[1] || undefined;
        return {
            authenticated: true,
            username
        };
    }
    catch (error) {
        return {
            authenticated: false,
            error: 'Not authenticated. Run: gh auth login'
        };
    }
}
async function ghAuthLogin() {
    try {
        await (0, execa_1.default)('gh', ['auth', 'login', '--web'], { stdio: 'inherit' });
        return checkGhAuth();
    }
    catch (error) {
        return {
            authenticated: false,
            error: error instanceof Error ? error.message : 'Authentication failed'
        };
    }
}
async function ensureGhAuth() {
    const authStatus = await checkGhAuth();
    if (authStatus.authenticated) {
        return authStatus;
    }
    return ghAuthLogin();
}
async function checkRepoExists(repoSlug) {
    try {
        await (0, execa_1.default)('gh', ['repo', 'view', repoSlug]);
        return true;
    }
    catch {
        return false;
    }
}
async function setRepoVisibility(repoSlug, visibility) {
    try {
        await (0, execa_1.default)('gh', ['repo', 'edit', repoSlug, `--visibility=${visibility}`]);
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to set visibility'
        };
    }
}
async function createGhRepo(repoName, options) {
    try {
        const authStatus = await checkGhAuth();
        if (!authStatus.authenticated || !authStatus.username) {
            return {
                created: false,
                alreadyExists: false,
                error: 'Not authenticated to GitHub'
            };
        }
        const repoSlug = `${authStatus.username}/${repoName}`;
        const exists = await checkRepoExists(repoSlug);
        if (exists) {
            const { stdout } = await (0, execa_1.default)('gh', ['repo', 'view', repoSlug, '--json', 'url', '-q', '.url']);
            const repoUrl = stdout.trim();
            const desiredVisibility = options?.visibility || 'private';
            await setRepoVisibility(repoSlug, desiredVisibility);
            return {
                created: false,
                alreadyExists: true,
                repoUrl
            };
        }
        const args = ['repo', 'create', repoSlug];
        if (options?.visibility) {
            args.push(`--${options.visibility}`);
        }
        else {
            args.push('--private');
        }
        if (options?.description) {
            args.push('--description', options.description);
        }
        if (options?.homepage) {
            args.push('--homepage', options.homepage);
        }
        const { stdout } = await (0, execa_1.default)('gh', args);
        const urlMatch = stdout.match(/https:\/\/github\.com\/[^\s]+/);
        const repoUrl = urlMatch ? urlMatch[0] : `https://github.com/${repoSlug}`;
        return {
            created: true,
            alreadyExists: false,
            repoUrl
        };
    }
    catch (error) {
        return {
            created: false,
            alreadyExists: false,
            error: error instanceof Error ? error.message : 'Repository creation failed'
        };
    }
}
async function openIssue(repoSlug, options) {
    try {
        const args = ['issue', 'create', '--repo', repoSlug, '--title', options.title, '--body', options.body];
        if (options.labels && options.labels.length > 0) {
            args.push('--label', options.labels.join(','));
        }
        const { stdout } = await (0, execa_1.default)('gh', args);
        const urlMatch = stdout.match(/(https:\/\/github\.com\/[^\s]+)/);
        const issueUrl = urlMatch ? urlMatch[1] : undefined;
        return {
            success: true,
            issueUrl
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create issue'
        };
    }
}
async function listIssues(repoSlug, options) {
    try {
        const args = [
            'issue',
            'list',
            '--repo',
            repoSlug,
            '--json',
            'number,title,state,url,body,labels,createdAt,updatedAt,comments'
        ];
        if (options?.state) {
            args.push('--state', options.state);
        }
        if (options?.limit) {
            args.push('--limit', options.limit.toString());
        }
        if (options?.projectName) {
            args.push('--label', `project:${options.projectName}`);
        }
        const { stdout } = await (0, execa_1.default)('gh', args);
        const issues = JSON.parse(stdout);
        return {
            success: true,
            issues
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to list issues'
        };
    }
}
async function viewIssue(repoSlug, issueNumber) {
    try {
        const { stdout } = await (0, execa_1.default)('gh', [
            'issue',
            'view',
            issueNumber.toString(),
            '--repo',
            repoSlug,
            '--json',
            'number,title,state,url,body,labels,createdAt,updatedAt,comments'
        ]);
        const issue = JSON.parse(stdout);
        return {
            success: true,
            issue
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to view issue'
        };
    }
}
async function getIssueComments(repoSlug, issueNumber) {
    try {
        const { stdout } = await (0, execa_1.default)('gh', [
            'issue',
            'view',
            issueNumber.toString(),
            '--repo',
            repoSlug,
            '--json',
            'comments',
            '-q',
            '.comments[] | {author: .author.login, body: .body, createdAt: .createdAt}'
        ]);
        const comments = stdout.trim() ? JSON.parse(`[${stdout.split('\n').join(',')}]`) : [];
        return {
            success: true,
            comments
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get comments'
        };
    }
}
//# sourceMappingURL=gh-utils.js.map