# Feature: passage (Remote CI)

## Overview

`passage` defines the remote CI layer in GitHub Actions for generated projects.

It enforces merge quality, protects release paths, and acts as the canonical validation authority.

## Goals

- Ensure pull requests meet quality gates before merge.
- Provide consistent CI behavior across generated projects.
- Keep CI checks aligned with `dockside` local checks.

## In Scope (v1)

- GitHub Actions workflows for PR and mainline validation.
- Required checks policy for protected branches.
- Caching and optimization patterns suitable for generated projects.
- Standardized artifacts/logs for failed-run diagnostics.
- Release trigger contract for tag-based progression into `landfall`.

## Out of Scope (v1)

- Non-GitHub CI providers.
- Cross-repository orchestration for large multi-repo release trains.
- Advanced dynamic matrix generation for arbitrary platform targets.

## Functional Requirements

1. Generated projects include CI workflows that run on PR and main branch updates.
2. Required checks are documented and can be enforced via branch protection.
3. CI jobs produce useful diagnostics and clearly identify failing stages.
4. CI includes security-sensitive handling of secrets with least-privilege defaults.
5. Tag naming and trigger rules are documented for release/deployment handoff.

## Inputs and Outputs

### Inputs
- GitHub repository events (pull_request, push, release/tag context as needed)
- Project scripts and lockfiles
- Repository/workflow secrets and variables

### Outputs
- CI status checks (required/pass/fail)
- Build/test artifacts as configured
- Logs sufficient to resolve failures without local reproduction in common cases

## Acceptance Criteria

- New generated projects include functional GitHub Actions CI workflows by default.
- PR checks block merge when required jobs fail.
- CI failures are actionable with minimal ambiguity.
- `passage` documentation includes branch protection recommendations.
- Tag-trigger policy from CI to deployment is documented and unambiguous.
