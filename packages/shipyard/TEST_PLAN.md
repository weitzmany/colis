# Shipyard Test Plan

## Scope

Verify that Shipyard correctly installs and updates CI/CD assets for generated projects:
- `dockside` local checks
- `passage` GitHub CI workflow
- `landfall` GitHub to AWS deployment workflow

## Prerequisites

- Node.js 18+
- npm
- A temporary test project directory with a `package.json`

## Test Cases

### 1) Package Build and Unit Tests

1. Run `npm install` in `packages/shipyard`.
2. Run `npm run build`.
3. Run `npm test`.

Expected:
- Build succeeds with no TypeScript errors.
- Tests pass.

### 2) `shipyard init` Creates All Assets

1. Create temp project with scripts: `lint`, `test`, `build`.
2. Run `shipyard init --project-root <temp-project>`.
3. Inspect generated files.

Expected files:
- `package.json` contains `dockside` and `ci:verify`.
- `.githooks/pre-push` exists.
- `.github/workflows/passage-ci.yml` exists.
- `.github/workflows/landfall-deploy.yml` exists.

### 3) No Overwrite by Default

1. Modify `.github/workflows/passage-ci.yml`.
2. Re-run `shipyard init` without `--force`.

Expected:
- Existing workflow is skipped.
- Skip warning is shown in output.

### 4) Force Overwrite

1. Re-run `shipyard init --force`.

Expected:
- Existing files are overwritten.

### 5) Feature-Only Commands

1. Run `shipyard dockside`.
2. Run `shipyard passage`.
3. Run `shipyard landfall --aws-region eu-west-1`.

Expected:
- Each command only applies its intended assets.
- `landfall` workflow includes provided region.

### 6) Missing Base Scripts Warning

1. Create temp project with package.json missing one of: `lint`, `test`, `build`.
2. Run `shipyard dockside`.

Expected:
- `dockside` and `ci:verify` are still added.
- Warning indicates missing base script(s).

## Regression Checks

- Re-running commands should be safe and predictable.
- No unrelated files are modified.
- Generated YAML remains valid.
