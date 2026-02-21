# Project Review: Recipes

**Reviewer**: Lisa Garcia  
**Expertise**: Internationalization (i18n) and Localization  
**Review Date**: 2026-02-18  
**Project Version**: Frontend `0.0.0` (backend version not specified)  
**Review Type**: Initial Review

---

## Executive Summary

The current implementation is effectively English-only and not yet internationalization-ready. UI copy is hardcoded throughout Angular templates, locale formatting is fixed to `en-US` in key user flows, and backend data/search assumptions are English-centric. This means adding multilingual support later will require broad refactoring across frontend, backend, and data layers instead of incremental configuration.

Documentation mentions future localization as part of expansion, but there is no concrete i18n implementation plan, acceptance criteria, or technical migration path for the current Angular + Slim stack. This creates a planning-to-implementation gap and raises cost/risk for future global rollout.

**Overall Project Health**: 3 / 10

**Key Findings**:
- No translation system or locale infrastructure is implemented.
- Date and day labels are hardcoded to `en-US`, blocking locale-correct UX.
- Backend search and schema are not prepared for multilingual content and user locale preferences.

---

## Strengths

### Basic Foundations
- **UTF-8 database encoding is configured** (`CREATE DATABASE recipes ENCODING 'UTF8'`), which is a good baseline for international text storage.
- **Root HTML sets language metadata** (`<html lang="en">`), providing at least a default locale declaration.
- **Project docs acknowledge international expansion** (localization appears in PRD/business planning), showing strategic awareness.

### Framework Capability Potential
- **Angular stack can support i18n cleanly** with either Angular i18n or runtime translation libraries when adopted.
- **Frontend structure is modular by page**, which can support progressive extraction of translatable strings.

---

## Weaknesses

### Missing i18n Architecture
- No translation files, no locale switcher, no fallback strategy, and no locale persistence model.
- Hardcoded UI text across all major pages and flow states (auth, recipes, meal planning, cooking mode).

### Locale Formatting and UX Gaps
- Week/day/date labels are explicitly formatted as `en-US`, not user locale.
- UI directionality and RTL readiness are not implemented.

### Backend and Data Layer Gaps
- User model does not store locale/language/timezone preferences.
- Full-text search trigger is hardcoded to English analyzer only.
- API does not expose locale context (no language negotiation, no locale headers contract).

---

## Issues to Address

### Critical Issues (Rank 1) ⚠️

#### No Translation Infrastructure Across Core User Flows
- **Severity**: 1 (Critical)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `i18n`, `architecture`, `new-feature`
- **Description**: The app has no i18n runtime or compile-time translation system; all user-facing copy is embedded directly in templates and TS.
- **Impact**: Any non-English launch requires a large refactor touching most UI surfaces.
- **Business Impact Details**: Blocks market expansion and increases localization delivery cost/timeline.
- **Location**: `frontend/src/app/pages/*/*.ts`, `frontend/src/app/app.html`
- **Recommendation**: Introduce a translation layer (Angular i18n or runtime library), extract all user-facing strings to keys, and define fallback locale behavior.
- **Estimated Effort**: Large
- **Status**: 🔄 Partial (2026-02-18) - Added locale foundation (`LocaleService`, lang/dir updates), but full translation extraction/runtime is not yet implemented.

---

### High Priority Issues (Rank 2) 🔴

#### Locale is Hardcoded to `en-US` in Meal Planner Dates
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `i18n`, `bug`, `ux`
- **Description**: Date formatting for week labels/day labels uses fixed `toLocaleDateString('en-US', ...)`.
- **Impact**: Incorrect localized date/day rendering for non-US users.
- **Business Impact Details**: Degrades trust and usability for international audiences.
- **Location**: `frontend/src/app/pages/meal-plan/meal-plan.component.ts`
- **Recommendation**: Replace hardcoded locale with active app locale and centralized date-format helpers.
- **Estimated Effort**: Small
- **Status**: ✅ Done (2026-02-18)

#### No User Locale Preference Model
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `i18n`, `database`, `api`, `architecture`
- **Description**: User schema/auth payload lacks language/locale/timezone fields.
- **Impact**: Locale cannot be persisted across sessions/devices or used by backend logic.
- **Business Impact Details**: Prevents personalized localized UX and cross-device consistency.
- **Location**: `backend/database/schema.sql`, `backend/src/controllers/AuthController.php`, `backend/src/repositories/UserRepository.php`
- **Recommendation**: Add `preferred_language`, `locale`, `timezone` fields; include them in auth/profile APIs.
- **Estimated Effort**: Medium
- **Status**: ✅ Done (2026-02-18)

#### Search Pipeline is English-Specific
- **Severity**: 2 (High)
- **Business Impact**: `medium-impact`
- **Priority Score**: P2
- **Labels**: `i18n`, `database`, `search`, `tech-debt`
- **Description**: PostgreSQL `to_tsvector('english', ...)` is fixed to English, which is unsuitable for multilingual data.
- **Impact**: Lower relevance and broken search behavior for non-English content.
- **Business Impact Details**: International users will have poorer core feature quality (recipe discovery).
- **Location**: `backend/database/schema.sql`
- **Recommendation**: Introduce per-locale indexing strategy or language-aware search configuration.
- **Estimated Effort**: Medium
- **Status**: 🔄 Partial (2026-02-18) - Moved search vector/query to `simple` config for broader language tolerance; per-locale strategy still pending.

---

### Medium Priority Issues (Rank 3) 🟡

#### No Locale Switching UX or Directionality Support
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `i18n`, `ux`, `mobile`
- **Description**: No language selector, no locale switching state, and no `dir` management for RTL locales.
- **Impact**: App cannot support multilingual UX and is not ready for RTL language expansion.
- **Business Impact Details**: Increases redesign effort for key international markets.
- **Location**: `frontend/src/app/*`
- **Recommendation**: Add language switcher, locale store, and global `dir` binding strategy.
- **Estimated Effort**: Medium
- **Status**: 🔄 Partial (2026-02-18) - Added locale store and global `dir`/`lang` binding; language switcher UI not yet implemented.

#### PRD Lacks Concrete i18n Acceptance Criteria
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `documentation`, `i18n`, `prd`
- **Description**: Localization is mentioned as expansion, but no explicit i18n milestones, quality bars, or rollout phases for current stack.
- **Impact**: Teams cannot plan/refine i18n scope predictably.
- **Business Impact Details**: Planning ambiguity can delay international launch.
- **Location**: `../docs/projects/recipes/PRD_OVERVIEW.md`, `../docs/projects/recipes/ARCHITECTURE.md`
- **Recommendation**: Add an i18n roadmap section with phased deliverables and measurable acceptance criteria.
- **Estimated Effort**: Small
- **Status**: ⏳ Blocked (2026-02-18) - PRD documentation update deferred to dedicated docs planning pass.

#### Mixed Static Placeholder/App Shell Content
- **Severity**: 3 (Medium)
- **Business Impact**: `low-impact`
- **Priority Score**: P4
- **Labels**: `i18n`, `tech-debt`, `improvement`
- **Description**: Root app shell still contains Angular starter placeholder content with hardcoded English strings.
- **Impact**: Adds extra extraction/refactor work and inconsistent i18n readiness across routes.
- **Business Impact Details**: Minor productivity drag and maintainability cost.
- **Location**: `frontend/src/app/app.html`
- **Recommendation**: Remove placeholder shell and route all text through product pages/translation keys.
- **Estimated Effort**: Small
- **Status**: ✅ Done (2026-02-18)

---

### Low Priority Issues (Rank 4) 🟢

#### No Multilingual SEO Path Defined in Frontend
- **Severity**: 4 (Low)
- **Business Impact**: `medium-impact`
- **Priority Score**: P4
- **Labels**: `i18n`, `seo`, `improvement`
- **Description**: There is no locale-aware routing or hreflang strategy in current Angular app structure.
- **Impact**: International discoverability is limited once multilingual content is introduced.
- **Business Impact Details**: Slower organic growth in non-English markets.
- **Location**: `frontend/src/index.html`, `frontend/src/app/app.routes.ts`
- **Recommendation**: Define locale URL strategy (`/en/...`, `/es/...`) and dynamic metadata/hreflang generation.
- **Estimated Effort**: Medium
- **Status**: ⏳ Blocked (2026-02-18) - Requires routing/SEO strategy decision not covered in this implementation run.

---

### Trivial Issues (Rank 5) ⚪

#### Language Metadata is Static
- **Severity**: 5 (Trivial)
- **Business Impact**: `low-impact`
- **Priority Score**: P4
- **Labels**: `i18n`, `improvement`
- **Description**: `<html lang="en">` is static and not tied to app locale state.
- **Impact**: Assistive tech/SEO metadata won’t reflect chosen language in future.
- **Business Impact Details**: Minor quality issue until multilingual support is enabled.
- **Location**: `frontend/src/index.html`
- **Recommendation**: Update `lang` dynamically from active locale when i18n state is introduced.
- **Estimated Effort**: Small
- **Status**: ✅ Done (2026-02-18)

---

## Priority Matrix

| Severity / Business Impact | High Impact | Medium Impact | Low Impact |
|----------------------------|-------------|---------------|------------|
| **Rank 1 (Critical)**      | P1 (Do Now) | P1 (Do Now)   | P2 (Do Soon) |
| **Rank 2 (High)**          | P1 (Do Now) | P2 (Do Soon)  | P3 (Do Later) |
| **Rank 3 (Medium)**        | P2 (Do Soon) | P3 (Do Later) | P4 (Backlog) |
| **Rank 4 (Low)**           | P3 (Do Later) | P4 (Backlog) | P4 (Backlog) |
| **Rank 5 (Trivial)**       | P4 (Backlog) | P4 (Backlog) | P4 (Backlog) |

**Priority Definitions**:
- **P1 (Do Now)**: Immediate action required
- **P2 (Do Soon)**: Address in next sprint
- **P3 (Do Later)**: Future sprint
- **P4 (Backlog)**: Backlog item

### Issues by Priority

#### P1 Issues (Do Now)
- No translation infrastructure across core user flows (Rank 1, high impact)
- Locale hardcoded to `en-US` in meal planner dates (Rank 2, high impact)
- No user locale preference model (Rank 2, high impact)

#### P2 Issues (Do Soon)
- Search pipeline is English-specific (Rank 2, medium impact)

#### P3 Issues (Do Later)
- No locale switching UX or directionality support (Rank 3, medium impact)
- PRD lacks concrete i18n acceptance criteria (Rank 3, medium impact)

#### P4 Issues (Backlog)
- Mixed static placeholder/app shell content (Rank 3, low impact)
- No multilingual SEO path defined in frontend (Rank 4, medium impact)
- Language metadata is static (Rank 5, low impact)

---

## PRD Review

### PRD Quality Assessment

**Overall PRD Quality**: 7 / 10

#### PRD Completeness
- **Requirements Coverage**: Partial (for i18n scope)
- **User Stories**: Need improvement (i18n-specific stories absent)
- **Acceptance Criteria**: Missing (for localization implementation)
- **Technical Requirements**: Incomplete (for locale-aware architecture)
- **Success Metrics**: Need improvement (no locale adoption metrics)

#### PRD vs Implementation Gap Analysis

**Features in PRD but Not Implemented**:
- Localization/international expansion planning is mentioned but no implementation exists.

**Features Implemented but Not in PRD**:
- English-only hardcoded UX behavior in current Angular implementation is not explicitly acknowledged as interim scope/risk.

**Implementation Deviations from PRD**:
- PRD/architecture describe a Next.js + NestJS path, but current implementation is Angular + Slim, and i18n plans are not adapted to actual stack.

#### PRD Issues

##### i18n Requirements Not Operationalized
- **Severity**: 3
- **Business Impact**: medium
- **Priority Score**: P3
- **Labels**: `documentation`, `prd`, `i18n`
- **Issue**: Localization is strategic but not decomposed into concrete implementation tasks.
- **Impact**: Increases rework and schedule uncertainty for global rollout.
- **Recommendation**: Add explicit i18n architecture, milestones, and acceptance tests.

### PRD Recommendations

**Strategic Recommendations**:
- Treat i18n readiness as a platform capability, not a late content task.
- Add global expansion readiness criteria early (locale UX, storage, search, SEO).

**Immediate PRD Updates Needed**:
- Define phase-based i18n plan (Foundation -> Translation rollout -> Market-specific optimization).
- Add measurable KPIs (e.g., locale coverage %, translation completeness %, locale error rate).

---

## Documentation Review

### Documentation Strengths
- International expansion is explicitly recognized in product/business docs.
- Core architecture docs are comprehensive overall.

### Documentation Weaknesses
- No dedicated i18n architecture guide for current stack.
- No implementation checklist for localization readiness.

### Documentation Issues
- Missing feature-level docs for locale switching, translation workflow, and multilingual SEO implementation in current app.

---

## Recommendations

### Strategic Recommendations
- Establish an **i18n baseline contract**: locale detection, fallback, storage, translation key governance, and QA checks.
- Add i18n as a release gate for all new UI features (no new hardcoded user-facing strings).

### Technical Recommendations
- Introduce translation infrastructure and extract existing strings in prioritized surfaces (auth, recipes, meal planner, cooking mode).
- Add `LocaleService` + app-level state for language and directionality (`ltr`/`rtl`).
- Replace fixed `en-US` formatters with locale-driven formatting utilities.
- Extend user schema/API for locale/timezone preferences.
- Define multilingual search strategy for PostgreSQL (or future search service) and test with non-English recipes.

### Learning Resources
- Angular i18n guide and CLDR locale data best practices
- ICU message format for pluralization/gender/complex text
- W3C recommendations for language metadata and directionality

---

## Next Steps

### Immediate Actions (This Week)
1. Add translation framework and extract strings from at least one end-to-end user flow.
2. Remove hardcoded `en-US` date/day formatting in meal planner.

### Short-term Actions (This Month)
1. Implement locale preference persistence in frontend and backend.
2. Add language switcher with fallback and directionality support.

### Medium-term Actions (This Quarter)
1. Introduce multilingual search strategy and validation dataset.
2. Add multilingual SEO strategy (localized routes + metadata).

### Long-term Actions (Backlog)
1. Establish translation QA workflow with coverage checks.
2. Add culturally localized content patterns and market-specific tuning.

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
- Refactor: 0
- Documentation: 2
- Testing: 0
- Tech Debt: 2
- Compliance: 0
- UX: 2
- Design: 0
- Dependency: 0
- Configuration: 0
- Deployment: 0
- i18n: 9
- Mobile: 1
- API: 1
- Database: 2
- Architecture: 2
- DevOps: 0
- SEO: 1
- PRD: 1

**Issue Distribution by Priority**:
- P1 (Do Now): 3
- P2 (Do Soon): 1
- P3 (Do Later): 2
- P4 (Backlog): 3

**Issue Distribution by Business Impact**:
- High Impact: 3
- Medium Impact: 4
- Low Impact: 2

---

## Review Methodology

This i18n review focused on localization readiness across documentation, frontend, backend, and data model. I examined:
- Project docs (`PRD_OVERVIEW`, `ARCHITECTURE`, `INDEX`) for localization requirements and implementation plans.
- Angular frontend pages and app shell for translatable string extraction readiness, locale formatting, and RTL support.
- Backend schema/controllers for locale persistence and language-aware search assumptions.

The scope is limited to artifacts present in the repository and project documentation directory at review time.

---

*This review was conducted by Lisa Garcia on 2026-02-18. For questions or clarifications, refer to `.cursor/rules/experts/i18n_expert.mdc`.*
