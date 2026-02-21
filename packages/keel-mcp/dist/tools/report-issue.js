import { execSync } from 'child_process';
const REPO = 'weitzmany/colis';
const FALLBACK_URL = `https://github.com/${REPO}/issues/new`;
export function reportIssue(input) {
    const { package: pkg, title, description, expert_name, expert_role, project, version } = input;
    const filer = expert_name && expert_role
        ? `${expert_name} (${expert_role})`
        : expert_name || 'Cursor Agent';
    const pkgLabel = pkg.replace('@colis/', '');
    const versionStr = version ? `@${version}` : '';
    const projectStr = project ? `**Project:** ${project}  |  ` : '';
    const body = [
        `> 🤖 Filed by: ${filer}`,
        `> ${projectStr}**Package:** ${pkg}${versionStr}`,
        `> **Source:** AI agent via @colis/keel-mcp`,
        '',
        '---',
        '',
        description,
    ].join('\n');
    const labels = `type:bug,package:${pkgLabel},source:ai-agent,status:open`;
    try {
        const result = execSync(`gh issue create --repo "${REPO}" --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" --label "${labels}"`, { encoding: 'utf8', timeout: 15000 }).trim();
        const match = result.match(/https:\/\/github\.com\/.+\/issues\/(\d+)/);
        const issueUrl = match ? match[0] : result;
        const issueNumber = match ? parseInt(match[1], 10) : undefined;
        return {
            success: true,
            issue_url: issueUrl,
            issue_number: issueNumber,
            message: `Issue filed successfully by ${filer}: ${issueUrl}`,
        };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const isNotInstalled = msg.includes('command not found') || msg.includes('not found');
        const isNotAuth = msg.includes('auth') || msg.includes('401') || msg.includes('403');
        return {
            success: false,
            message: isNotInstalled
                ? '`gh` CLI is not installed. Install it from https://cli.github.com/ then run `gh auth login`.'
                : isNotAuth
                    ? '`gh` is not authenticated. Run `gh auth login` to connect your GitHub account.'
                    : `Failed to create issue: ${msg}`,
            fallback_url: FALLBACK_URL,
        };
    }
}
//# sourceMappingURL=report-issue.js.map