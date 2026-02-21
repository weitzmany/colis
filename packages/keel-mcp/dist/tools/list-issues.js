import { execSync } from 'child_process';
const REPO = 'weitzmany/colis';
export function listIssues(input = {}) {
    const { package: pkg, type, status, limit = 25 } = input;
    const labelFilters = [];
    if (pkg)
        labelFilters.push(`package:${pkg.replace('@colis/', '')}`);
    if (type)
        labelFilters.push(`type:${type}`);
    if (status)
        labelFilters.push(`status:${status}`);
    const labelFlag = labelFilters.length > 0
        ? labelFilters.map(l => `--label "${l}"`).join(' ')
        : '';
    try {
        const json = execSync(`gh issue list --repo "${REPO}" --state open --limit ${limit} ${labelFlag} --json number,title,url,state,labels,createdAt`, { encoding: 'utf8', timeout: 15000 }).trim();
        const raw = JSON.parse(json);
        const issues = raw.map(i => ({
            number: i.number,
            title: i.title,
            url: i.url,
            state: i.state,
            labels: i.labels.map(l => l.name),
            createdAt: i.createdAt,
        }));
        const filterDesc = labelFilters.length > 0
            ? ` (filters: ${labelFilters.join(', ')})`
            : '';
        return {
            success: true,
            issues,
            total: issues.length,
            message: issues.length > 0
                ? `Found ${issues.length} open issue(s)${filterDesc}.`
                : `No open issues found${filterDesc}. Safe to file a new one.`,
        };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const isNotInstalled = msg.includes('command not found') || msg.includes('not found');
        return {
            success: false,
            issues: [],
            total: 0,
            message: isNotInstalled
                ? '`gh` CLI is not installed. Install it from https://cli.github.com/'
                : `Failed to list issues: ${msg}`,
            fallback_url: `https://github.com/${REPO}/issues`,
        };
    }
}
//# sourceMappingURL=list-issues.js.map