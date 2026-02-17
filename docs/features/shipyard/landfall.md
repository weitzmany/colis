# Feature: landfall (Deployment - GitHub to AWS)

## Overview

`landfall` defines deployment from GitHub workflows into AWS for generated projects.

For v1, deployment is opinionated around the selected stack and split topology.

## Goals

- Provide a reliable default deployment path for generated projects.
- Standardize environment promotion and rollback expectations.
- Keep deployment configuration explicit, secure, and reproducible.

## v1 Locked Topology

- **Frontend (Angular)** -> **S3 + CloudFront**
- **Backend (Slim API)** -> **ECS Fargate**
- **Database (MySQL)** -> **RDS MySQL**
- **Pipeline Orchestrator** -> **GitHub Actions**

## In Scope (v1)

- GitHub workflow path for build/package/deploy aligned to the topology above.
- Environment-specific configuration model (at minimum staging and production).
- Secure use of AWS credentials/secrets in GitHub Actions.
- Deployment verification and rollback-forward guidance.
- Idempotency/retry behavior for partial deployment failures.
- Operational runbook and notification expectations.

## Out of Scope (v1)

- Non-AWS deployment targets.
- Alternative backend runtime targets (Lambda, EC2-only baseline).
- Multi-cloud abstraction layer.
- Full progressive delivery suites beyond practical baseline.

## Functional Requirements

1. Deployment can be triggered from GitHub in a documented, deterministic way.
2. Angular artifact deployment invalidates or refreshes CloudFront as needed.
3. Slim API image/service deployment updates ECS service safely.
4. RDS is treated as managed stateful infrastructure with migration strategy defined.
5. Workflow outputs deployment status, target environment, and verification signals.

## Inputs and Outputs

### Inputs
- GitHub workflow event and commit/tag context
- Built frontend artifacts and backend container image
- AWS credentials/roles, region, and environment configuration
- Database migration package/command where applicable

### Outputs
- Updated frontend assets in S3 and active CloudFront distribution state
- Updated ECS service revision for Slim API
- Deployment report with success/failure and post-deploy verification summary

## Deployment Safety Requirements

- Least-privilege AWS permissions for workflow roles.
- Explicit environment boundaries and approval policy (if enabled).
- Safe failure behavior: stop on critical stage failures and preserve prior healthy state where possible.
- Forward-fix-first policy for failed deployments, with rollback guidance documented.
- Retry rules are defined for transient failures; non-transient failures require explicit operator action.
- Post-deploy verification gates must complete before marking deployment successful.

## Operations and Recovery

- Standard runbook documents failure triage for frontend, backend, and database stages.
- Deployment logs include enough context to identify failing stage, environment, and revision.
- Notifications are emitted on deployment success/failure to the configured channel.

## Acceptance Criteria

- A generated project can deploy to AWS using the defined split topology.
- Deployment run logs clearly show frontend, backend, and DB-related stages.
- Failure in one stage does not silently mark deployment successful.
- Required secrets/variables are documented with exact naming conventions.
- Retry/idempotency behavior is documented and validated in dry-run or staging checks.
