# @colis/shipyard

CI/CD package for projects generated and managed by the Colis package ecosystem.

Shipyard installs an opinionated delivery chain:
- `dockside`: local validation scripts and pre-push guardrails
- `passage`: GitHub Actions CI workflow
- `landfall`: GitHub to AWS deployment workflow

## Installation

```bash
npm install @colis/shipyard
```

## CLI Usage

```bash
# Apply all three features in the current project
shipyard init

# Apply a single feature
shipyard dockside
shipyard passage
shipyard landfall
```

Common options:

```bash
--project-root <path>
--force
--aws-region <region>
--ecs-cluster <name>
--ecs-service <name>
--s3-bucket <name>
--cloudfront-distribution-id <id>
```

## What Shipyard Writes

- `package.json` scripts:
  - `lint`, `test`, `build` (generated at root if missing)
  - `dockside`
  - `ci:verify`
- `.githooks/pre-push`
- `.github/workflows/passage-ci.yml`
- `.github/workflows/landfall-deploy.yml`

If `frontend/` and/or `backend/` exist, Shipyard tries to create root `lint/test/build` scripts that orchestrate inner package scripts (for example `npm --prefix frontend run lint && npm --prefix backend run lint`).

If inner scripts are missing, Shipyard will attempt to create defaults:
- Angular frontend defaults: `ng lint`, `ng test --watch=false --browsers=ChromeHeadless`, `ng build`
- Composer backend defaults:
  - `lint`: fail-fast placeholder (requires project-specific command)
  - `test`: `phpunit` when available, otherwise fail-fast placeholder
  - `build`: informational no-op command

## Target v1 Topology

- Angular frontend -> S3 + CloudFront
- Slim API backend -> ECS Fargate
- MySQL database -> RDS MySQL

## Development

```bash
npm run build
npm test
npm run lint
```

## Manual Testing

- [TEST_PLAN.md](./TEST_PLAN.md)
- [QUICK_TEST_CHECKLIST.md](./QUICK_TEST_CHECKLIST.md)
