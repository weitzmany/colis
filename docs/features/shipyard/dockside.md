# Feature: dockside (Local Testing)

## Overview

`dockside` defines local validation for generated projects before code is pushed.

Its purpose is to make local feedback fast, deterministic, and aligned with remote CI expectations.

## Goals

- Prevent obvious failures from reaching pull requests.
- Keep local checks consistent with `passage` checks.
- Standardize local quality gates across generated projects.

## In Scope (v1)

- Local command contract for validation (lint, test, build, and config checks as applicable per project).
- Fast-fail behavior and actionable output for developers.
- Baseline parity map with `passage` so checks are aligned.
- Support for the target stack context (Angular + Slim projects).

## Out of Scope (v1)

- Full local environment orchestration for cloud infrastructure.
- Heavy integration/end-to-end suites that significantly slow local loops.
- Custom per-team rule engines outside shared defaults.

## Functional Requirements

1. Generated projects expose a single local validation entrypoint.
2. Validation returns non-zero exit code on failure for scriptability.
3. The check list is documented and mapped to corresponding `passage` jobs.
4. Output includes concise remediation guidance for common failures.
5. A documented dry-run mode exists for validating local pipeline behavior without deployment side effects.

## Inputs and Outputs

### Inputs
- Workspace-generated project structure
- Project scripts and config files
- Developer environment (Node/npm and required toolchain)

### Outputs
- Pass/fail status
- Structured logs indicating failed stage(s)
- Guidance links or short hints for recovery

## Acceptance Criteria

- A generated project can run local validation with one documented command.
- Local failures are clear and reproducible.
- Each `dockside` check is traceable to a corresponding `passage` check or explicitly marked local-only.
- Documentation describes expected runtime and troubleshooting flow.
- A dry-run path is documented and usable for pre-PR verification.
