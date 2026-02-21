# Project Review: Recipes

**Reviewer**: Dr. Amanda Foster  
**Expertise**: Learning Analytics (Educational Data, Engagement, Outcomes)  
**Review Date**: 2026-02-19  
**Project Version**: 1.0.0  
**Review Type**: Initial Review

---

## Executive Summary

The product delivers strong user-facing foundations for recipe planning and cooking workflows, but it lacks a learning-analytics-style measurement layer for behavior, progression, and outcome analysis. Core events and outcome signals are not modeled as first-class product telemetry, which blocks KPI-driven iteration and prevents robust funnel diagnostics.

The most urgent issue is not UI quality; it is observability of learning-like progression behaviors (step completion, session completion, drop-off points, and return patterns). Additionally, there is substantial PRD-to-implementation drift (documented stack versus actual stack), which creates risk that future analytics requirements are specified against the wrong architecture assumptions.

**Overall Project Health**: 5.9 / 10

**Key Findings**:
- No structured product analytics pipeline exists for cooking/meal-planning journeys (only operational error telemetry).
- No persisted model for cooking sessions or progression events despite product goals requiring these metrics.
- Documentation and PRD quality are strong in breadth, but implementation alignment is weak in critical technical areas.

---

## Strengths

### Instrumentation Foundation
- **Request correlation baseline exists**: Correlation IDs and structured request logging are implemented, which can anchor future event tracing (`backend/src/middleware/RequestContextMiddleware.php`, `frontend/src/app/services/global-error-handler.service.ts`).
- **Frontend error ingestion exists**: Client-side error telemetry is wired and can be extended into product behavior events (`frontend/src/app/services/global-error-handler.service.ts`, `backend/src/routes/routes.php`).

### User Journey Surfaces Are Clear
- **Distinct measurable flows exist**: Cooking mode and meal planning provide clear event boundaries suitable for funnels and retention analysis (`frontend/src/app/pages/cooking-mode/cooking-mode.component.ts`, `frontend/src/app/pages/meal-plan/meal-plan.component.ts`).
- **Feature docs define outcome-oriented goals**: Cooking mode documentation includes adoption/completion/performance targets that are suitable for analytics operationalization (`/Users/yoavweitzman/Documents/packages/docs/projects/recipes/features/cooking-mode.md`).

### Compliance Intent Is Documented
- **Privacy framework is well articulated**: The data privacy document explicitly includes usage and analytics intent, creating a governance starting point (`/Users/yoavweitzman/Documents/packages/docs/projects/recipes/compliance/data-privacy.md`).

---

## Weaknesses

### Learning Analytics Coverage
- **No event taxonomy** for progression, engagement, and completion signals.
- **No analytics data model** for cooking sessions, drop-off points, or outcome snapshots.
- **No KPI computation/reporting layer** for feature adoption and retention.

### PRD-Implementation Alignment
- **Architecture mismatch** between PRD/architecture docs and current implementation stack makes analytics planning brittle.
- **Missing feature docs referenced by index** reduce traceability from requirements to implementation.

### Compliance Operationalization Gap
- **Policy-to-implementation disconnect** for analytics consent, retention, and user-level analytics controls.

---

## Issues to Address

### Critical Issues (Rank 1) ⚠️

#### Missing Product Event Analytics Pipeline For Core Journeys
- **Severity**: 1 (Critical)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `analytics`, `documentation`, `architecture`
- **Description**: The system captures operational errors and request logs but does not capture structured behavior events for core user journeys.
- **Impact**: No reliable way to measure funnel progression, session completion, or user engagement quality.
- **Business Impact Details**: Blocks data-driven roadmap decisions and optimization of high-value retention loops.
- **Location**: `frontend/src/app/services/global-error-handler.service.ts`, `backend/src/routes/routes.php`, `backend/src/middleware/RequestContextMiddleware.php`
- **Recommendation**: Introduce event taxonomy + ingestion endpoint(s) for core events: `cooking_started`, `step_advanced`, `timer_started`, `cooking_completed`, `meal_planned`, `meal_removed`, `week_navigated`.
- **Estimated Effort**: Medium

#### No Persisted Cooking Session Model Despite KPI Dependence
- **Severity**: 1 (Critical)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `analytics`, `database`, `api`
- **Description**: Cooking mode and docs depend on session-level outcomes, but no `cooking_sessions` persistence or API exists in implementation.
- **Impact**: Session completion rate, average duration, and step-level drop-off cannot be computed reliably.
- **Business Impact Details**: Prevents measurement of the app’s key differentiator (cooking mode effectiveness), limiting retention and premium strategy tuning.
- **Location**: `backend/database/schema.sql`, `backend/src/routes/routes.php`, `frontend/src/app/pages/cooking-mode/cooking-mode.component.ts`, `/Users/yoavweitzman/Documents/packages/docs/projects/recipes/features/cooking-mode.md`
- **Recommendation**: Add a `cooking_sessions` table plus minimal write endpoint; capture `started_at`, `completed_at`, `steps_completed`, `duration_seconds`, and optional per-step events.
- **Estimated Effort**: Medium

---

### High Priority Issues (Rank 2) 🔴

#### PRD/Architecture Stack Mismatch Undermines Analytics Planning
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `documentation`, `architecture`, `analytics`
- **Description**: Project planning docs describe Next.js + NestJS while implementation is Angular + Slim PHP.
- **Impact**: Analytics requirements are currently framed against incorrect technical assumptions, increasing rework risk.
- **Business Impact Details**: Slows implementation and introduces planning errors in instrumentation ownership and pipeline design.
- **Location**: `/Users/yoavweitzman/Documents/packages/docs/projects/recipes/PRD_OVERVIEW.md`, `/Users/yoavweitzman/Documents/packages/docs/projects/recipes/ARCHITECTURE.md`, `README.md`
- **Recommendation**: Publish a reconciled architecture addendum and update PRD technical sections to the implemented stack before analytics work continues.
- **Estimated Effort**: Small

#### KPI Layer Is Declared But Not Computable
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `analytics`, `improvement`, `api`
- **Description**: Success metrics are documented (adoption, completion, return rate), but there is no metric computation or reporting endpoint.
- **Impact**: KPIs remain aspirational and cannot be monitored or trended.
- **Business Impact Details**: Leadership cannot prioritize with evidence or evaluate feature ROI.
- **Location**: `/Users/yoavweitzman/Documents/packages/docs/projects/recipes/PRD_OVERVIEW.md`, `/Users/yoavweitzman/Documents/packages/docs/projects/recipes/features/cooking-mode.md`, `backend/src/routes/routes.php`
- **Recommendation**: Define metric contracts and create a minimal analytics read API for daily aggregates and 7/30-day trend snapshots.
- **Estimated Effort**: Medium

#### Privacy Claims For Usage Analytics Not Backed By Runtime Controls
- **Severity**: 2 (High)
- **Business Impact**: `medium-impact`
- **Priority Score**: P2
- **Labels**: `compliance`, `analytics`, `documentation`
- **Description**: Documentation states usage analytics collection and opt-out controls, but implementation artifacts for consent-state-aware analytics collection are not present.
- **Impact**: Future analytics rollout risks non-compliant behavior and policy drift.
- **Business Impact Details**: Increases legal/compliance risk and can erode user trust.
- **Location**: `/Users/yoavweitzman/Documents/packages/docs/projects/recipes/compliance/data-privacy.md`, `frontend/src/app/services/global-error-handler.service.ts`, `backend/src/routes/routes.php`
- **Recommendation**: Gate analytics events by explicit consent state and add retention/deletion policy implementation notes to backend analytics schema design.
- **Estimated Effort**: Medium

---

### Medium Priority Issues (Rank 3) 🟡

#### Feature Documentation Index Contains Missing Linked Specs
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P2
- **Labels**: `documentation`, `analytics`
- **Description**: The index references `meal-planning.md` and `recipe-import.md` that do not currently exist.
- **Impact**: Analytics requirements for those feature areas are hard to derive and verify.
- **Business Impact Details**: Slows delivery and increases ambiguity for instrumentation scope.
- **Location**: `/Users/yoavweitzman/Documents/packages/docs/projects/recipes/INDEX.md`
- **Recommendation**: Add the missing feature docs with explicit event requirements and success metrics sections.
- **Estimated Effort**: Small

#### Missing Experimentation Hooks For Behavioral Optimization
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `analytics`, `improvement`
- **Description**: No explicit support for experiment IDs/variants in event payloads for cooking or meal planning interactions.
- **Impact**: A/B tests cannot be analyzed cleanly when UX changes are introduced.
- **Business Impact Details**: Slows optimization cycles and weakens evidence quality.
- **Location**: `frontend/src/app/pages/cooking-mode/cooking-mode.component.ts`, `frontend/src/app/pages/meal-plan/meal-plan.component.ts`
- **Recommendation**: Include optional `experiment_id` and `variant_id` in future event schema.
- **Estimated Effort**: Small

---

### Low Priority Issues (Rank 4) 🟢

#### No Qualitative Context Capture For Drop-Off Diagnosis
- **Severity**: 4 (Low)
- **Business Impact**: `low-impact`
- **Priority Score**: P4
- **Labels**: `analytics`, `ux`
- **Description**: There is no lightweight mechanism to capture reason/context when users exit cooking mode early.
- **Impact**: Quantitative signals may identify where users drop, but not why.
- **Business Impact Details**: Limits product insight depth for UX refinement.
- **Location**: `frontend/src/app/pages/cooking-mode/cooking-mode.component.ts`
- **Recommendation**: Add optional low-friction exit reason capture for incomplete sessions.
- **Estimated Effort**: Small

---

### Trivial Issues (Rank 5) ⚪

No trivial issues identified in this review.

---

## Priority Matrix

This matrix helps prioritize issues by combining severity with business impact.

| Severity / Business Impact | High Impact | Medium Impact | Low Impact |
|----------------------------|-------------|---------------|------------|
| **Rank 1 (Critical)**      | P1 (Do Now) | P1 (Do Now)   | P2 (Do Soon) |
| **Rank 2 (High)**          | P1 (Do Now) | P2 (Do Soon)  | P3 (Do Later) |
| **Rank 3 (Medium)**        | P2 (Do Soon) | P3 (Do Later) | P4 (Backlog) |
| **Rank 4 (Low)**           | P3 (Do Later) | P4 (Backlog) | P4 (Backlog) |
| **Rank 5 (Trivial)**       | P4 (Backlog) | P4 (Backlog) | P4 (Backlog) |

**Priority Definitions**:
- **P1 (Do Now)**: Immediate action required
- **P2 (Do Soon)**: Next sprint
- **P3 (Do Later)**: Future sprint
- **P4 (Backlog)**: Optional backlog item

### Issues by Priority

#### P1 Issues (Do Now)
- Missing product event analytics pipeline for core journeys.
- No persisted cooking session model despite KPI dependence.
- PRD/architecture stack mismatch undermines analytics planning.
- KPI layer is declared but not computable.

#### P2 Issues (Do Soon)
- Privacy claims for usage analytics not backed by runtime controls.
- Feature documentation index contains missing linked specs.

#### P3 Issues (Do Later)
- Missing experimentation hooks for behavioral optimization.

#### P4 Issues (Backlog)
- No qualitative context capture for drop-off diagnosis.

---

## PRD Review

### PRD Quality Assessment

**Overall PRD Quality**: 7 / 10

#### PRD Completeness
- **Requirements Coverage**: Complete for core product scope
- **User Stories**: Well-defined in PRD overview and feature doc
- **Acceptance Criteria**: Partial (strong in feature docs, less explicit in implementation mapping)
- **Technical Requirements**: Present but partially inconsistent with actual stack
- **Success Metrics**: Defined but currently not operationalized

#### PRD vs Implementation Gap Analysis

**Features in PRD but Not Implemented**:
- `features/meal-planning.md` documentation artifact (missing file).
- `features/recipe-import.md` documentation artifact (missing file).
- Learning-analytics-enabling session tracking persistence for cooking mode.

**Features Implemented but Not in PRD**:
- Backend client error telemetry sink (`/api/client-errors`) as implemented operational telemetry surface.
- Request-correlation implementation details.

**Implementation Deviations from PRD**:
- Planned stack in external docs (Next.js/NestJS) differs from implemented stack (Angular/Slim PHP).
- Analytics and success metrics are specified as goals but not represented in data models/API surfaces.

#### PRD Issues

##### Analytics Requirements Not Translated Into Data Contracts
- **Severity**: 2
- **Business Impact**: high
- **Priority Score**: P1
- **Labels**: `analytics`, `documentation`, `api`
- **Issue**: PRD metrics are not backed by event schema, persistence model, or reporting endpoints.
- **Impact**: The team cannot verify whether product goals are being met.
- **Recommendation**: Add an Analytics Requirements section per feature: event names, payload schema, storage model, and KPI formulas.

##### Technical Architecture Drift
- **Severity**: 2
- **Business Impact**: high
- **Priority Score**: P1
- **Labels**: `architecture`, `documentation`
- **Issue**: PRD/architecture stack assumptions do not match implementation.
- **Impact**: Development planning and analytics ownership become ambiguous.
- **Recommendation**: Reconcile architecture docs and publish implementation-aligned analytics architecture notes.

### PRD Recommendations

**Strategic Recommendations**:
- Define a canonical event taxonomy for the cooking and planning lifecycle before expanding feature scope.
- Introduce milestone-based analytics maturity: event capture -> storage -> KPI dashboards -> cohort analysis.

**Immediate PRD Updates Needed**:
- Add analytics acceptance criteria for MVP journeys in `PRD_OVERVIEW.md` and `features/cooking-mode.md`.
- Add/restore missing feature docs and include event and metric sections in each.

---

## Documentation Review

### Documentation Strengths
- Rich high-level PRD and architecture narratives with clear product intent.
- Detailed cooking mode feature documentation with measurable targets.
- Privacy documentation includes user-rights framing and data handling intent.

### Documentation Weaknesses
- Missing linked feature documents in index reduce trust and traceability.
- Technical stack inconsistency across docs vs implementation.
- Analytics governance is described conceptually but not operationally.

### Documentation Issues
- Missing feature docs linked from index (`P2`).
- PRD technical assumptions not aligned with implementation (`P1`).
- Analytics policy not grounded in implementation controls (`P2`).

---

## Recommendations

### Strategic Recommendations
- Treat learning analytics as a product capability, not an observability side effect.
- Prioritize measurement of completion and drop-off in cooking mode before adding new premium features.
- Establish a monthly KPI review cadence tied to concrete event quality checks.

### Technical Recommendations
- Add analytics event ingestion endpoint(s) and storage schema.
- Implement session lifecycle instrumentation in cooking mode and meal planning.
- Create minimal analytics read endpoints for trend dashboards.
- Introduce consent-aware event collection gates.

### Learning Resources
- xAPI event design patterns for behavior tracking.
- Product analytics taxonomy design guides (event naming and schema evolution).
- Privacy-preserving analytics design (aggregation, retention, deletion workflows).

---

## Next Steps

### Immediate Actions (This Week)
1. Define v1 analytics event taxonomy and payload contracts.
2. Add cooking session persistence model and write path.
3. Reconcile architecture/stack documentation to match implementation.

### Short-term Actions (This Month)
1. Implement KPI aggregate endpoints for adoption/completion/retention proxies.
2. Add feature-level analytics acceptance criteria to missing/updated feature docs.
3. Wire consent-aware controls for analytics collection behavior.

### Medium-term Actions (This Quarter)
1. Add cohort and funnel analysis surfaces (7-day return, step drop-off rates).
2. Add experiment metadata support for UI optimization testing.

### Long-term Actions (Backlog)
1. Expand from operational dashboards to predictive insights (early churn/drop-off risk).
2. Add automated data quality checks for analytics event completeness.

---

## Summary Statistics

### Current Review
- **Total Issues Identified**: 8
- **Critical (Rank 1)**: 2
- **High Priority (Rank 2)**: 3
- **Medium Priority (Rank 3)**: 2
- **Low Priority (Rank 4)**: 1
- **Trivial (Rank 5)**: 0

**Issue Distribution by Label**:
- Bug: 0
- Security: 0
- Performance: 0
- Accessibility: 0
- Improvement: 2
- New Feature: 0
- Refactor: 0
- Documentation: 4
- Testing: 0
- Tech Debt: 0
- Compliance: 1
- UX: 1
- Design: 0
- Dependency: 0
- Configuration: 0
- Deployment: 0
- i18n: 0
- Mobile: 0
- API: 3
- Database: 1
- Architecture: 3
- DevOps: 0
- Analytics: 8

**Issue Distribution by Priority**:
- P1 (Do Now): 4
- P2 (Do Soon): 2
- P3 (Do Later): 1
- P4 (Backlog): 1

**Issue Distribution by Business Impact**:
- High Impact: 4
- Medium Impact: 3
- Low Impact: 1

---

## Review Methodology

This review was conducted from a learning analytics perspective. I analyzed product documentation (PRD, architecture, feature docs, privacy docs) and implementation surfaces (frontend journey components, backend routes, telemetry middleware, and schema) to assess analytics readiness, event observability, KPI computability, and compliance-aligned analytics operations.

---

*This review was conducted by Dr. Amanda Foster on 2026-02-19. For persona context, see `.cursor/rules/experts/learning_analytics_expert.mdc`.*
