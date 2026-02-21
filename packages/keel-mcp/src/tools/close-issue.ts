import { execSync } from 'child_process';

const REPO = 'weitzmany/colis';

export interface CloseIssueInput {
  issue_number: number;
  comment?: string;
}

export interface CloseIssueOutput {
  success: boolean;
  issue_url?: string;
  message: string;
}

export function closeIssue(input: CloseIssueInput): CloseIssueOutput {
  const { issue_number, comment } = input;
  const issueUrl = `https://github.com/${REPO}/issues/${issue_number}`;

  try {
    // Add closing comment first if provided
    if (comment) {
      execSync(
        `gh issue comment ${issue_number} --repo "${REPO}" --body "${comment.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"`,
        { encoding: 'utf8', timeout: 15000 },
      );
    }

    execSync(
      `gh issue close ${issue_number} --repo "${REPO}"`,
      { encoding: 'utf8', timeout: 15000 },
    );

    return {
      success: true,
      issue_url: issueUrl,
      message: `Issue #${issue_number} closed successfully. Thank you for confirming the fix.`,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isNotInstalled = msg.includes('command not found') || msg.includes('not found');
    const isNotAuth = msg.includes('auth') || msg.includes('401') || msg.includes('403');

    return {
      success: false,
      message: isNotInstalled
        ? '`gh` CLI is not installed. Install it from https://cli.github.com/ then run `gh auth login`.'
        : isNotAuth
          ? '`gh` is not authenticated. Run `gh auth login` to connect your GitHub account.'
          : `Failed to close issue #${issue_number}: ${msg}`,
    };
  }
}
