# Project Review: Recipes

**Reviewer**: Thomas Mitchell  
**Expertise**: Testing (TDD, Unit Tests, Integration Tests, E2E Tests)  
**Review Date**: 2026-02-18  
**Project Version**: Frontend `0.0.0`, backend `recipes/recipes`  
**Review Type**: Initial Review

---

## Executive Summary

The project has a working but very thin automated test baseline. Frontend tests currently validate only app bootstrapping, while backend tests cover one utility area and a placeholder assertion. That is far below the PRD quality bar and below what is needed for safe iteration on core MVP flows (auth, recipes, meal planning, cooking mode).

Recent implementation changes introduced significant behavior in `meal-plan` and `cooking-mode` plus backend bootstrap/DB fallback paths, but no corresponding tests were added for these paths. This creates a high regression risk and weak release confidence.

**Overall Project Health**: 4 / 10

**Key Findings**:
- Automated coverage is far below MVP intent and does not protect core user flows.
- No integration or E2E suite exists for business-critical journeys.
- Test execution ergonomics are inconsistent across environments (root backend test invocation fails here).

---

## Strengths

### Existing Test Foundations
- **Frontend unit test pipeline works**: `ng test --watch=false` runs successfully.
- **Backend PHPUnit is configured and runnable**: `phpunit.xml` is strict (`failOnRisky`, `failOnWarning`) and executes cleanly once invoked from backend context.
- **Root scripts define lint/test/build sequence** in `package.json`, showing intent for CI quality gates.

### Early Signals of Quality Direction
- **Request context logic has direct unit tests** (`backend/tests/RequestContextTest.php`), which is a good pattern for service-level testing.
- **Angular test builder is configured** (`@angular/build:unit-test`), so expanding test suites is straightforward.

---

## Weaknesses

### Coverage and Scope Gaps
- Frontend: only `app.spec.ts` (2 tests), no tests for `meal-plan` or `cooking-mode`.
- Backend: only 3 tests total, including one placeholder test.
- No API-level integration tests for routes/controllers/repositories.
- No E2E tests for signup/login, recipe CRUD, meal planning, or cooking timer flows.

### Process and Reliability Gaps
- Root backend test invocation (`composer --working-dir backend run test`) fails in this environment, which weakens confidence in portable CI execution.
- No coverage thresholds are enforced in frontend or backend test commands.
- No project-level `TEST_PLAN.md` / `QUICK_TEST_CHECKLIST.md` artifacts exist in the repo root for manual verification workflows.

---

## Issues to Address

### Critical Issues (Rank 1) ⚠️

#### Core MVP Flows Are Effectively Unprotected by Automated Tests
- **Severity**: 1 (Critical)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `testing`, `bug`, `tech-debt`
- **Description**: Core functionality (meal planning, cooking mode behavior, auth and recipe lifecycle) lacks meaningful automated tests.
- **Impact**: Regressions can ship undetected across critical user journeys.
- **Business Impact Details**: Directly affects retention and trust in MVP stability.
- **Location**: `frontend/src/app/pages/meal-plan/meal-plan.component.ts`, `frontend/src/app/pages/cooking-mode/cooking-mode.component.ts`, `backend/src/routes/routes.php`, `backend/src/controllers/*`
- **Recommendation**: Build a minimum critical-path test suite (unit + integration + E2E) before additional feature expansion.
- **Estimated Effort**: Large
- **Status**: 🔄 Partial (2026-02-19) – Component tests added for meal-plan (13 tests) and cooking-mode (15 tests); backend integration tests added (10 tests). E2E suite not yet implemented.

---

### High Priority Issues (Rank 2) 🔴

#### No Backend API Integration Tests for Route Contracts
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `testing`, `api`, `backend`
- **Description**: Controllers/routes are not exercised end-to-end in tests (status codes, validation errors, auth boundaries, response contracts).
- **Impact**: API breakage can pass unnoticed despite unit tests passing.
- **Business Impact Details**: Frontend/backend integration reliability is at risk during active development.
- **Location**: `backend/src/controllers/*`, `backend/src/routes/routes.php`, `backend/tests/*`
- **Recommendation**: Add Slim integration tests using HTTP request simulation for auth, recipes, meal plans, and health endpoints.
- **Estimated Effort**: Medium
- **Status**: ✅ Done (2026-02-19)

#### No Frontend Component Tests for Newly Added Meal Planner and Cooking Mode Logic
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `testing`, `frontend`, `ux`
- **Description**: Timer lifecycle, step navigation, wake lock behavior, day/week navigation, modal flows, and optimistic updates are untested.
- **Impact**: UI regressions in high-usage paths are likely.
- **Business Impact Details**: Impacts daily engagement loops (plan meals, cook from steps).
- **Location**: `frontend/src/app/pages/cooking-mode/cooking-mode.component.ts`, `frontend/src/app/pages/meal-plan/meal-plan.component.ts`
- **Recommendation**: Add focused component tests with mocked services and deterministic timer/wake lock behavior.
- **Estimated Effort**: Medium
- **Status**: ✅ Done (2026-02-19)

#### No E2E Test Suite for Critical User Journeys
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `testing`, `new-feature`, `mobile`
- **Description**: There is no Playwright/Cypress setup or E2E coverage for main end-user flows.
- **Impact**: Cross-page integration issues and mobile regressions will escape unit/integration checks.
- **Business Impact Details**: Production defects in onboarding and cooking flow directly affect retention.
- **Location**: Repository-wide (missing `playwright.config.*` / `cypress.config.*`)
- **Recommendation**: Add Playwright E2E for signup/login, create recipe, add meal plan entry, complete cooking-mode timer flow.
- **Estimated Effort**: Medium
- **Status**: ⏳ Blocked (2026-02-19) – Playwright setup deferred; requires running dev environment. Scheduled for next sprint.

---

### Medium Priority Issues (Rank 3) 🟡

#### Root Backend Test Invocation Is Not Portable in Current Environment
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `testing`, `configuration`, `devops`
- **Description**: `composer --working-dir backend run test` fails locally with `Command "backend" is not defined`, while `cd backend && composer test` works.
- **Impact**: Inconsistent developer and CI behavior depending on Composer version/runtime.
- **Business Impact Details**: Slows teams and creates false negatives in quality checks.
- **Location**: `package.json` (root `test` script)
- **Recommendation**: Use a more compatible invocation (`composer -d backend run test`) or run via shell command that changes directory explicitly.
- **Estimated Effort**: Small
- **Status**: ✅ Done (2026-02-19)

#### Test Coverage Targets Are Not Enforced
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `testing`, `tech-debt`, `improvement`
- **Description**: No minimum coverage gate is configured for frontend or backend, despite PRD aiming for high quality.
- **Impact**: Coverage can drift downward silently.
- **Business Impact Details**: Long-term defect rate increases with product complexity.
- **Location**: `frontend/package.json`, `backend/phpunit.xml`, CI workflows
- **Recommendation**: Enable coverage output and enforce minimum thresholds in CI.
- **Estimated Effort**: Small

#### Project-Level Manual Test Documentation Is Missing
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `testing`, `documentation`
- **Description**: No root-level `TEST_PLAN.md` / `QUICK_TEST_CHECKLIST.md` for regression verification.
- **Impact**: Manual QA is ad hoc and inconsistent.
- **Business Impact Details**: Slower and less reliable release validation.
- **Location**: Repository root (files missing)
- **Recommendation**: Add concise manual verification docs for MVP critical paths and known edge cases.
- **Estimated Effort**: Small

---

### Low Priority Issues (Rank 4) 🟢

#### Excessive Deprecation Noise Reduces Test Signal Quality
- **Severity**: 4 (Low)
- **Business Impact**: `low-impact`
- **Priority Score**: P4
- **Labels**: `testing`, `dependency`, `improvement`
- **Description**: Composer/PHP-DI deprecation output is very noisy under current PHP runtime.
- **Impact**: Real test failures can be harder to spot quickly.
- **Business Impact Details**: Minor productivity cost during debugging.
- **Location**: `composer test` execution output
- **Recommendation**: Update tooling/runtime compatibility or normalize deprecation handling in CI logs.
- **Estimated Effort**: Small

---

### Trivial Issues (Rank 5) ⚪

#### Placeholder Backend Test Still Present
- **Severity**: 5 (Trivial)
- **Business Impact**: `low-impact`
- **Priority Score**: P4
- **Status**: ✅ Done (2026-02-19)
- **Labels**: `testing`, `refactor`
- **Description**: `ExampleTest` only asserts `true`.
- **Impact**: Inflates perceived test count without adding protection.
- **Business Impact Details**: Minimal direct impact, but poor quality signal.
- **Location**: `backend/tests/ExampleTest.php`
- **Recommendation**: Replace with meaningful service/repository tests or remove.
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
- Core MVP flows are effectively unprotected by automated tests.
- No backend API integration tests for route contracts.
- No frontend component tests for meal planner/cooking mode logic.
- No E2E suite for critical user journeys.

#### P3 Issues (Do Later)
- Root backend test invocation is not portable in current environment.
- Coverage targets are not enforced.
- Manual test documentation is missing.

#### P4 Issues (Backlog)
- Deprecation noise reduces test signal quality.
- Placeholder backend test remains.

---

## PRD Review

### PRD Quality Assessment

**Overall PRD Quality**: 7 / 10

#### PRD Completeness
- **Requirements Coverage**: Partial
- **User Stories**: Well-defined
- **Acceptance Criteria**: Partial for testing execution details
- **Technical Requirements**: Inconsistent with current implementation stack in places
- **Success Metrics**: Defined, but not mapped to enforceable test gates in code/CI

#### PRD vs Implementation Gap Analysis

**Features in PRD but Not Implemented (testing perspective)**:
- PRD quality expectations imply broad, reliable test coverage; implementation has only minimal unit tests.
- Cooking mode testing strategy in feature docs lists unit/integration/E2E scenarios, but these tests are absent.

**Features Implemented but Not in PRD**:
- N/A (testing focus)

**Implementation Deviations from PRD**:
- Planning docs reference a different architecture stack than current Angular + Slim implementation, creating ambiguity for test strategy ownership and tooling.

#### PRD Issues

##### Testing Success Criteria Are Not Operationalized Into CI Gates
- **Severity**: 3
- **Business Impact**: medium
- **Priority Score**: P3
- **Labels**: `documentation`, `testing`, `prd`
- **Issue**: PRD-level quality goals are not translated into required CI thresholds (coverage, test tiers, mandatory suites).
- **Impact**: Success criteria cannot be objectively enforced.
- **Recommendation**: Add explicit CI acceptance gates and required test tiers per MVP feature.

### PRD Recommendations

**Strategic Recommendations**:
- Define a minimum test pyramid per MVP feature (unit + integration + E2E).
- Tie each PRD acceptance criterion to at least one automated test artifact.

**Immediate PRD Updates Needed**:
- Add a Testing Quality Gate section with concrete pass/fail thresholds.
- Align testing toolchain notes to current Angular + Slim stack.

---

## Documentation Review

### Documentation Strengths
- Feature docs (for cooking mode) include explicit testing strategy sections.
- Project docs clearly state quality and MVP reliability intent.

### Documentation Weaknesses
- Testing strategy in docs is not reflected in implemented test suites.
- No practical, up-to-date manual regression checklist for release readiness.

### Documentation Issues
- Missing project-level testing playbook causes inconsistent verification across contributors.

---

## Recommendations

### Strategic Recommendations
- Treat testing debt in core flows as release risk, not a backlog-only concern.
- Set policy: no feature-level logic changes without corresponding tests.

### Technical Recommendations
- Add backend integration tests for auth, recipes, meal plans, and health routes.
- Add component tests for meal planner and cooking mode (timers, step boundaries, modal flows, errors).
- Add Playwright E2E smoke flows for key journeys.
- Fix root test script portability and enforce coverage thresholds in CI.

### Learning Resources
- Angular component testing guide (signals + async templates)
- PHPUnit integration testing patterns for Slim apps
- Playwright best practices for PWA/mobile regression checks

---

## Next Steps

### Immediate Actions (This Week)
1. Add tests for current meal planner and cooking mode behavior.
2. Add backend route integration tests for critical API contracts.
3. Fix root backend test invocation portability.

### Short-term Actions (This Month)
1. Introduce Playwright smoke suite for critical user journeys.
2. Enforce minimum coverage thresholds in CI.
3. Replace placeholder tests with meaningful assertions.

### Medium-term Actions (This Quarter)
1. Expand contract tests around locale/auth/validation edge cases.
2. Add performance and stability checks for timer-heavy mobile flows.

### Long-term Actions (Backlog)
1. Add visual regression checks for key UI states.
2. Add mutation testing or stricter coverage quality metrics for core services.

---

## Summary Statistics

### Current Review
- **Total Issues Identified**: 9
- **Critical (Rank 1)**: 1
- **High Priority (Rank 2)**: 3
- **Medium Priority (Rank 3)**: 3
- **Low Priority (Rank 4)**: 1
- **Trivial (Rank 5)**: 1

**Issue Distribution by Label**:
- Bug: 1
- Security: 0
- Performance: 0
- Accessibility: 0
- Improvement: 3
- New Feature: 1
- Refactor: 1
- Documentation: 2
- Testing: 9
- Tech Debt: 2
- Compliance: 0
- UX: 1
- Design: 0
- Dependency: 1
- Configuration: 1
- Deployment: 0
- i18n: 0
- Mobile: 1
- API: 1
- Database: 0
- Architecture: 1
- DevOps: 1
- PRD: 1

**Issue Distribution by Priority**:
- P1 (Do Now): 4
- P2 (Do Soon): 0
- P3 (Do Later): 3
- P4 (Backlog): 2

**Issue Distribution by Business Impact**:
- High Impact: 4
- Medium Impact: 3
- Low Impact: 2

---

## Review Methodology

This testing review covered project documentation, current frontend/backend implementation, and executable test commands. I reviewed existing tests and test configuration, then validated command behavior by running:
- Frontend tests: `npm --prefix frontend run test -- --watch=false` (passes, 2 tests)
- Backend tests: `cd backend && composer test` (passes, 3 tests)
- Root backend test invocation: `composer --working-dir backend run test` (fails in this environment)

Scope is limited to artifacts and runtime behavior observable in the current repository and project docs.

---

*This review was conducted by Thomas Mitchell on 2026-02-18. For questions or clarifications, refer to `.cursor/rules/experts/testing_expert.mdc`.*
