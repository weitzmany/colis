# Project Review: Recipes

**Reviewer**: James Martinez  
**Expertise**: Performance Optimization  
**Review Date**: 2026-02-18  
**Project Version**: Frontend `0.0.0` (backend version not declared)  
**Review Type**: Initial Review

---

## Executive Summary

The project has a strong baseline for frontend delivery performance: route-level lazy chunks are in place, initial JS is moderate for an Angular PWA, and key database indexes exist for common read paths. However, several high-impact bottlenecks in both backend query design and frontend request behavior are likely to degrade quickly under realistic usage growth.

The most urgent issue is an expensive recipe detail SQL shape that multiplies joined rows before JSON aggregation. Combined with chatty client behavior (search on every keystroke) and N-query write patterns, this creates avoidable CPU/DB load in critical user flows.

**Overall Project Health**: 6 / 10

**Key Findings**:
- Recipe detail query pattern can cause combinatorial row expansion under normal data growth.
- Search requests are fired per keypress without debounce/cancellation.
- Create/update recipe writes use per-item insert loops instead of batched operations.

---

## Strengths

### Frontend Delivery Baseline
- **Route-level splitting is active**: production build emits lazy chunks per page (`meal-plan`, `cooking-mode`, `recipes`, auth pages), reducing initial route cost.
- **Initial bundle size is currently reasonable**: `258.82 kB` raw (`72.88 kB` estimated transfer), which is a usable baseline for an MVP PWA.
- **Shared button styles introduced** in global styles reduce style duplication pressure across pages.

### Data Layer Foundations
- **Core indexes are present** on high-frequency filters and joins (`recipes.user_id`, `meal_plans(user_id, scheduled_date)`, search GIN index).
- **Full-text search vector trigger exists**, and the analyzer was adjusted to `simple` for broader tokenization support.

---

## Weaknesses

### Backend Throughput Risks
- Recipe detail read path is implemented with a cross-join-heavy aggregation query.
- Recipe create/update flows perform one INSERT per ingredient/instruction/tag (no bulk insert strategy).
- No explicit API response compression/caching contract is defined at app layer.

### Frontend Runtime Efficiency Gaps
- Recipe search performs network requests for every input change.
- Meal planner template repeatedly recomputes meal lookup via linear scans in render loops.
- Component style budgets are currently exceeded on two high-traffic pages.

---

## Issues to Address

### Critical Issues (Rank 1) ⚠️

#### Recipe Detail Query Has Cross-Product Aggregation Explosion
- **Severity**: 1 (Critical)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `performance`, `database`, `api`
- **Description**: `findById` joins `ingredients`, `instructions`, and `tags` in one query, then relies on `DISTINCT` JSON aggregates. Row count scales as `ingredients × instructions × tags` before aggregation.
- **Impact**: High CPU, memory, and sort pressure on PostgreSQL for a core endpoint (`GET /api/recipes/:id`), especially on rich recipes.
- **Business Impact Details**: Slower recipe detail/cooking-mode loads directly hurt core engagement and retention loops.
- **Location**: `backend/src/repositories/RecipeRepository.php`
- **Recommendation**: Split aggregation into separate subqueries (or LATERAL subqueries) per child collection, then compose final JSON without cartesian multiplication.
- **Estimated Effort**: Medium
- **Status**: ⏳ Blocked (2026-02-19) – Large SQL refactor deferred; needs careful EXPLAIN ANALYZE validation before deployment.

---

### High Priority Issues (Rank 2) 🔴

#### Recipe Create/Update Uses N Query Loops for Child Rows
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `performance`, `database`, `api`, `tech-debt`
- **Description**: Ingredient/instruction/tag persistence loops execute one statement per item.
- **Impact**: Elevated DB round trips and transaction latency for common writes; worsens linearly with recipe complexity.
- **Business Impact Details**: Slower save/update flows increase abandonment in recipe authoring.
- **Location**: `backend/src/repositories/RecipeRepository.php`, `backend/src/controllers/RecipeController.php`
- **Recommendation**: Move to batched inserts (multi-row VALUES/unnest) and set-based tag upsert/linking.
- **Estimated Effort**: Medium
- **Status**: ⏳ Blocked (2026-02-19) – Batch-insert SQL refactor deferred; requires integration test expansion before safe migration.

#### Search Fires Requests on Every Keystroke (No Debounce/Distinct/Cancellation)
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `performance`, `ux`, `api`
- **Description**: Search input calls backend immediately from `(input)` with no debouncing and no request dedupe/cancellation.
- **Impact**: Excessive API traffic, avoidable backend load, and UI jitter on slower networks.
- **Business Impact Details**: Directly affects recipe discovery responsiveness, a top-frequency user action.
- **Location**: `frontend/src/app/pages/recipes/recipes.component.ts`
- **Recommendation**: Use RxJS stream (`debounceTime`, `distinctUntilChanged`, `switchMap`) and minimum query length threshold.
- **Estimated Effort**: Small
- **Status**: ✅ Done (2026-02-19)

#### Meal Planner Repeats O(n) Meal Lookup During Rendering
- **Severity**: 2 (High)
- **Business Impact**: `medium-impact`
- **Priority Score**: P2
- **Labels**: `performance`, `ux`, `improvement`
- **Description**: Template calls `getMealForDay()` multiple times per slot; each call scans full meals array.
- **Impact**: Unnecessary CPU work in change detection, especially when planner data grows.
- **Business Impact Details**: Degrades interaction smoothness in a core weekly planning flow.
- **Location**: `frontend/src/app/pages/meal-plan/meal-plan.component.ts`
- **Recommendation**: Precompute a keyed lookup map (`date+mealType -> meal`) once per data refresh and bind directly.
- **Estimated Effort**: Small
- **Status**: ✅ Done (2026-02-19)

---

### Medium Priority Issues (Rank 3) 🟡

#### Performance Budgets Failing for Cooking/Meal Plan Styles
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `performance`, `tech-debt`, `configuration`
- **Description**: Production build reports `anyComponentStyle` budget overages for cooking mode and meal planner.
- **Impact**: Signals rising CSS payload and style maintenance drift in high-traffic pages.
- **Business Impact Details**: Incremental slowdown risk and reduced headroom for future features.
- **Location**: `frontend/src/app/pages/cooking-mode/cooking-mode.component.scss`, `frontend/src/app/pages/meal-plan/meal-plan.component.scss`
- **Recommendation**: Extract shared primitives, prune duplicates, and keep page styles under configured budget.
- **Estimated Effort**: Small

#### No Explicit API Compression/Cache Policy at Service Boundary
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `performance`, `configuration`, `deployment`
- **Description**: API responses are JSON but no explicit compression/caching strategy is documented or enforced at app boundary.
- **Impact**: Higher transfer costs and slower responses on mobile networks when infra defaults are misconfigured.
- **Business Impact Details**: Increases latency for mobile-heavy usage segments.
- **Location**: `backend/public/index.php`, project deployment docs
- **Recommendation**: Define response compression and cache header policy in deployment baseline (reverse proxy/CDN) and document required settings.
- **Estimated Effort**: Small

---

### Low Priority Issues (Rank 4) 🟢

#### Missing Lightweight Frontend Request Result Caching for Search
- **Severity**: 4 (Low)
- **Business Impact**: `low-impact`
- **Priority Score**: P4
- **Labels**: `performance`, `improvement`
- **Description**: Repeated search queries are fully refetched without client result memoization.
- **Impact**: Redundant network calls for repeated terms within sessions.
- **Business Impact Details**: Minor latency/bandwidth inefficiency.
- **Location**: `frontend/src/app/services/recipe.service.ts`, `frontend/src/app/pages/recipes/recipes.component.ts`
- **Recommendation**: Add short-lived in-memory query cache keyed by normalized search term (or adopt query library with stale-time controls).
- **Estimated Effort**: Small

---

### Trivial Issues (Rank 5) ⚪

#### Build Output Is Not Persisted as Performance Baseline Artifact
- **Severity**: 5 (Trivial)
- **Business Impact**: `low-impact`
- **Priority Score**: P4
- **Labels**: `performance`, `documentation`
- **Description**: Build-size outputs are not tracked as a documented baseline.
- **Impact**: Harder to spot regressions over time.
- **Business Impact Details**: Minimal immediate risk; affects long-term performance governance.
- **Location**: Project docs/review process
- **Recommendation**: Add a small “performance baseline” section in release docs with initial/lazy chunk targets.
- **Estimated Effort**: Small

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
- **P1 (Do Now)**: Immediate action required - highest priority
- **P2 (Do Soon)**: Address in next sprint/iteration
- **P3 (Do Later)**: Schedule for future sprint
- **P4 (Backlog)**: Add to backlog, address when time permits

### Issues by Priority

#### P1 Issues (Do Now)
- Recipe detail cross-product query (Rank 1, high impact)
- N-query write loops for recipe children (Rank 2, high impact)
- Per-keystroke search requests (Rank 2, high impact)

#### P2 Issues (Do Soon)
- Meal planner repeated O(n) lookups in render (Rank 2, medium impact)

#### P3 Issues (Do Later)
- Component style budget overages (Rank 3, medium impact)
- Missing explicit compression/cache policy (Rank 3, medium impact)

#### P4 Issues (Backlog)
- Missing lightweight search-result memoization (Rank 4, low impact)
- No documented build-size baseline artifact (Rank 5, low impact)

---

## PRD Review

## PRD Quality Assessment

**Overall PRD Quality**: 7 / 10

#### PRD Completeness
- **Requirements Coverage**: Complete at business/feature level
- **User Stories**: Well-defined
- **Acceptance Criteria**: Partial for performance (goals exist, enforcement/checkpoints sparse)
- **Technical Requirements**: Partially stale vs current implementation stack
- **Success Metrics**: Defined, including load-time targets

#### PRD vs Implementation Gap Analysis

**Features in PRD but Not Implemented (Performance-Critical Aspects)**:
- Explicit measured performance gate for `<2s` cooking mode load is not evidenced with instrumentation.
- Planned caching strategy from architecture docs (e.g., richer API/data caching layers) is not implemented.

**Features Implemented but Not in PRD (or Mismatched)**:
- Current implementation stack is Angular + Slim PHP, while PRD/architecture docs still primarily describe Next.js + NestJS.

**Implementation Deviations from PRD**:
- Significant stack divergence introduces ambiguity in performance strategy ownership/tooling.
- Some index links reference non-existent docs, reducing execution clarity for performance workstreams.

#### PRD Issues

##### Performance Governance Is Under-Specified for Current Stack
- **Severity**: 2
- **Business Impact**: high
- **Priority Score**: P1
- **Labels**: `documentation`, `performance`, `architecture`
- **Issue**: PRD contains performance goals but lacks stack-aligned instrumentation and acceptance gating for the live Angular/Slim architecture.
- **Impact**: Teams can miss regressions while still claiming requirement compliance.
- **Recommendation**: Add stack-specific performance acceptance criteria (TTFB, cooking-mode route load, search latency, DB query percentile targets) and required measurement tooling.

### PRD Recommendations

**Strategic Recommendations**:
- Treat performance as a release gate with mandatory measured thresholds, not narrative goals.
- Define ownership: frontend route budgets + backend query latency + infra transfer optimization.

**Immediate PRD Updates Needed**:
- Update tech-stack references in `INDEX.md`, `PRD.md`, and `ARCHITECTURE.md` to current implementation reality.
- Add concrete performance test plan (Lighthouse budget, API p95 targets, SQL explain review checklist).

---

## Documentation Review

### Documentation Strengths
- Performance intent is clearly stated in PRD and architecture docs.
- Cooking mode and mobile experience include explicit latency expectations.

### Documentation Weaknesses
- Architecture and implementation stack are out of sync, reducing technical usability of performance guidance.
- Index references include missing files, making it harder to execute planned optimizations.

### Documentation Issues
- Missing stack-aligned performance instrumentation checklist.
- Missing current baseline artifact for frontend chunk/style budgets.

---

## Recommendations

### Strategic Recommendations
- Establish a **Performance DoD**: no feature is complete without measured before/after metrics.
- Prioritize DB query shape fixes before adding more high-volume feature traffic.

### Technical Recommendations
- Refactor `findById` aggregation query to avoid cartesian row multiplication.
- Batch ingredient/instruction/tag writes in create/update flows.
- Debounce and cancel search requests in recipes list UI.
- Precompute planner meal lookup map for constant-time template access.
- Keep component style payload under budget by extracting shared patterns and removing duplication.

### Learning Resources
- PostgreSQL docs: aggregate planning, `LATERAL` joins, `EXPLAIN (ANALYZE, BUFFERS)`
- Web.dev: interaction latency and network request efficiency patterns
- Angular performance guide: template computation and change-detection cost control

---

## Next Steps

### Immediate Actions (This Week)
1. Rewrite recipe detail query shape (`findById`) and validate with `EXPLAIN ANALYZE`.
2. Add search debounce/distinct/cancel flow in recipes page.
3. Convert recipe child-row writes to batched SQL paths.

### Short-term Actions (This Month)
1. Refactor meal planner rendering to constant-time meal lookup.
2. Resolve style budget overages in cooking/meal-plan pages.
3. Define deployment-level compression/cache policy and document it.

### Medium-term Actions (This Quarter)
1. Introduce standardized performance dashboards/checks for core endpoints and top routes.
2. Add CI budget checks for route payload growth and style regressions.

### Long-term Actions (Backlog)
1. Evaluate server/client caching strategy for frequent query patterns.
2. Add periodic performance regression reviews tied to release milestones.

---

## Summary Statistics

### Current Review
- **Total Issues Identified**: 8
- **Critical (Rank 1)**: 1
- **High Priority (Rank 2)**: 3
- **Medium Priority (Rank 3)**: 2
- **Low Priority (Rank 4)**: 1
- **Trivial (Rank 5)**: 1

**Issue Distribution by Label**:
- Bug: 0
- Security: 0
- Performance: 8
- Accessibility: 0
- Improvement: 3
- New Feature: 0
- Refactor: 1
- Documentation: 2
- Testing: 0
- Tech Debt: 2
- Compliance: 0
- UX: 2
- Design: 0
- Dependency: 0
- Configuration: 2
- Deployment: 1
- i18n: 0
- Mobile: 1
- API: 2
- Database: 2
- Architecture: 1
- DevOps: 0

**Issue Distribution by Priority**:
- P1 (Do Now): 3
- P2 (Do Soon): 1
- P3 (Do Later): 2
- P4 (Backlog): 2

**Issue Distribution by Business Impact**:
- High Impact: 3
- Medium Impact: 3
- Low Impact: 2

---

## Review Methodology

This review focused on runtime and scalability performance by analyzing:
- Product docs and PRDs for declared performance goals and constraints.
- Backend query/write paths in repositories/controllers that affect hot API endpoints.
- Frontend runtime behavior for search, render loops, and production build outputs.

The scope is limited to files and build outputs available at review time.

---

*This review was conducted by James Martinez on 2026-02-18. For expert persona details, refer to `.cursor/rules/experts/performance_expert.mdc`.*
