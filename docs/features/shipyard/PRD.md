# Shipyard Package - PRD

**Feature Name**: Shipyard  
**Type**: Package Feature (`@colis/shipyard`)  
**Status**: Planning  
**Priority**: P1 (High)  
**Last Updated**: 2026-02-17  
**Formerly**: cicd-templates

## Package Context

Shipyard is a package for CI/CD enablement of projects created and managed by this workspace's packages.

This package is organized into three stable sub-features:
- `dockside` (local testing)
- `passage` (remote CI)
- `landfall` (deployment)

These names are locked for current planning.

## Overview

Shipyard standardizes delivery from local developer checks to cloud deployment with opinionated defaults.

For v1, Shipyard focuses on:
- GitHub Actions as the remote CI orchestrator
- Deployment from GitHub to AWS
- A concrete target stack:
  - Angular frontend
  - Slim backend
  - MySQL database

## Problem Statement

### Current Issues

1. Generated projects do not start with a unified CI/CD baseline.
2. Local checks and CI checks are often inconsistent.
3. Teams repeatedly rebuild deployment wiring for similar stacks.
4. Deployment reliability is reduced by ad hoc, per-project pipeline design.

### Why This Matters

- Slower onboarding for new generated projects
- More pipeline failures at PR/merge/deploy time
- Higher maintenance costs for package maintainers
- Inconsistent quality across managed projects

## Solution

Shipyard provides a layered delivery model:

1. **dockside**: local validation contract and parity
2. **passage**: remote CI enforcement in GitHub Actions
3. **landfall**: GitHub-driven deployment into AWS

This hierarchy separates responsibilities and keeps scope manageable as the package evolves.

## v1 Scope (Locked)

### Platform and Flow

- **Remote CI**: GitHub Actions
- **Deployment Path**: GitHub -> AWS
- **Topology**:
  - Angular -> S3 + CloudFront
  - Slim API -> ECS Fargate
  - MySQL -> RDS MySQL

### Release Trigger Contract (v1)

- Release/deploy trigger uses Git tags from GitHub.
- Tag format is versioned and documented (for example `vX.Y.Z`).
- Protected branches and required checks are defined by `passage` before deployment in `landfall`.

### In Scope

- Standard CI/CD templates and contracts for generated/managed projects
- Local/remote parity model for validation
- Deployment workflow with environment-aware configuration
- Documentation for failure handling and operational expectations

### Out of Scope

- Non-AWS providers in v1
- Non-GitHub CI providers in v1
- Fully generalized multi-cloud abstraction
- Advanced progressive delivery strategy suite as default

## Feature PRDs

- [dockside](dockside.md)
- [passage](passage.md)
- [landfall](landfall.md)

## Relationship to Existing CI/CD Feature Material

Shipyard continues and narrows the earlier CI/CD template direction:
- Source reference: `docs/features/cicd-templates/PRD.md`
- v1 prioritizes one concrete production path before expanding to multi-provider support.

### Adoption and Deferral Mapping

**Adopted in v1:**
- Reusable CI/CD template direction
- Standard checks baseline (lint/test/build gates)
- AWS deployment template direction through a concrete GitHub -> AWS flow

**Deferred after v1:**
- Multi-provider CI engines beyond GitHub Actions
- Multi-cloud deployment abstractions (Azure/GCP and generalized orchestration)
- Expanded platform matrices and advanced deployment strategies

## Success Metrics

### Reliability
- >=95% successful CI runs on default branches after stabilization
- >=90% successful deployment runs during first adoption window

### Speed
- New generated project CI/CD setup in <30 minutes
- Reduced mean time to diagnose failures via standardized logs and stages

### Standardization
- New generated projects include all three sub-features by default
- Reduced local/remote validation drift over time

## Risks and Mitigation

### Risk: Scope Creep
- **Mitigation**: enforce `dockside`/`passage`/`landfall` boundaries

### Risk: AWS Complexity
- **Mitigation**: opinionated defaults and explicit configuration docs

### Risk: Local/CI Drift
- **Mitigation**: parity mapping from local commands to CI jobs

## Implementation Handoff (Phased)

### Phase 1: `dockside` Baseline
- Define local command contract and parity matrix.
- Validate behavior on a generated Angular + Slim reference project.

### Phase 2: `passage` Enforcement
- Define GitHub workflow triggers, required checks, and branch protection guidance.
- Add artifact/log standards and failure diagnostics.

### Phase 3: `landfall` Delivery
- Implement tag-triggered GitHub -> AWS deployment flow.
- Document environment promotion, failure handling, and recovery guidance.

## Test Strategy (Planning-Level)

- **Template validation**: verify generated workflow/template files are present and correctly parameterized.
- **Pipeline dry-run**: execute non-destructive validation path before production deployment.
- **Stack validation**: confirm Angular build path, Slim image/deploy path, and MySQL migration contract.
- **Failure-path checks**: validate behavior for partial failures, retries, and operator guidance.

## Planning Acceptance Criteria

- The package PRD and feature PRDs reflect `dockside`, `passage`, and `landfall` boundaries.
- Release trigger contract, required checks policy, and GitHub -> AWS flow are explicitly documented.
- Existing `docs/features/cicd-templates/PRD.md` requirements are mapped to adopted vs deferred scope.
- Phased implementation and test strategy are defined for handoff.

## Next Steps

1. Finalize architecture doc and command contracts for each sub-feature.
2. Define implementation tasks and test strategy.
3. Validate templates with a generated Angular + Slim + MySQL reference project.
4. Update central documentation navigation (`docs/README.md`, `docs/reference/PROJECTS_LIST.md`) to point to Shipyard package docs under `docs/features/shipyard/`.
