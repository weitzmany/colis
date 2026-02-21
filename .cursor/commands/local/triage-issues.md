# Triage @colis Issues

Read and triage open issues from the `weitzmany/colis` GitHub repository. Prioritize, summarize, and optionally begin work on one.

## Usage

```bash
/local/triage-issues
```

No parameters required.

## Workflow

### 1. Fetch Open Issues

Run:
```bash
gh issue list --repo weitzmany/colis --state open --json number,title,labels,createdAt,body --limit 100
```

Do **not** filter by status label during fetch. Some valid open issues may be unlabeled or partially labeled.

### 2. Group and Prioritize

Present issues in this order:

**Group 1 — Bugs (`type:bug`, `status:open`)**
Highest priority. List with: issue number, title, affected package, who filed it (look for "Filed by:" in the body), date filed.

**Group 2 — Bugs (`type:bug`, `status:in-progress`)**
Already being worked on. List for awareness.

**Group 3 — Feature Requests (`type:feature-request`, `status:open`)**
Review and plan. List with: issue number, title, affected package, use case summary.

**Group 4 — Questions (`type:question`, `status:open`)**
Lowest priority. Can often be resolved with a comment.

### Label Fallback Rules (Required)

If an issue is missing one or more triage labels, infer classification before listing:

- `type:*` missing:
  - use body fields (`## Type`, `Type`) if present
  - otherwise default to **question** until clarified
- `status:*` missing:
  - default to **status:open**
- `package:*` missing:
  - infer from body/package text if possible (e.g., `@colis/keel`)
  - otherwise mark as **package:unknown** in triage output

Always include unlabeled open issues in triage output; never drop them.

### 3. Summary Table

Present a summary like:

```
Open issues: X
  Bugs (open):             X
  Bugs (in-progress):      X
  Feature requests (open): X
  Questions (open):        X
```

### 4. Ask What to Do

After presenting the summary, ask:

> "Would you like to start working on one of these? If so, say the issue number and I'll move it to `status:in-progress` and begin investigation."

### 5. If User Selects an Issue

1. Fetch full issue details:
   ```bash
   gh issue view <number> --repo weitzmany/colis --json number,title,body,labels,author,state,createdAt
   ```

   If `gh issue view` fails due deprecated project fields, use:
   ```bash
   gh api repos/weitzmany/colis/issues/<number>
   ```

2. Move to in-progress:
   ```bash
   gh issue edit <number> --repo weitzmany/colis \
     --remove-label "status:open" \
     --add-label "status:in-progress"
   gh issue comment <number> --repo weitzmany/colis \
     --body "Acknowledged — investigating."
   ```

If the issue is missing expected labels, add them while acknowledging (for example `type:feature-request`, `package:keel`, `source:ai-agent` when appropriate).

3. Investigate the affected package in `packages/<name>/` and begin implementing the fix or feature.

4. When the fix is ready and published, mark resolved:
   ```bash
   gh issue edit <number> --repo weitzmany/colis \
     --remove-label "status:in-progress" \
     --add-label "status:resolved,status:awaiting-confirmation"
   gh issue comment <number> --repo weitzmany/colis \
     --body "Fixed in @colis/<package> v<X.Y.Z>. Please update the package in your project and confirm the fix works, then close this issue."
   ```

## Important Rules

- **Never write `fixes #N`, `closes #N`, or `resolves #N` in commit messages** — GitHub will auto-close the issue. Use neutral references like `(see #N)` instead.
- **Never close issues yourself** — only the consuming project that filed the issue may close it.
- Fix bugs in dependency order: core packages (`@colis/rig`) before leaf packages (`@colis/keel`, `@colis/hull`, etc.).
