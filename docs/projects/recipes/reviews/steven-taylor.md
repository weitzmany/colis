# Project Review: Recipes

**Reviewer**: Steven Taylor  
**Expertise**: SEO (Search Engine Optimization)  
**Review Date**: 2026-02-18  
**Project Version**: Frontend `0.0.0`, backend `recipes/recipes`  
**Review Type**: Initial Review

---

## Executive Summary

The current implementation has a basic SEO baseline (static title/description, semantic headings, and route-friendly URLs), but it is not yet search-ready for growth objectives in the PRD. The two biggest blockers are crawlability and metadata depth: recipe content is loaded client-side from auth-protected APIs, and route-level metadata is not managed dynamically.

There is also strong documentation drift. Planning docs describe an SSR-ready Next.js architecture, while the live stack is Angular SPA + Slim API. Because SEO strategy in docs is tied to a different stack, current implementation decisions are not being translated into executable SEO requirements.

**Overall Project Health**: 4 / 10

**Key Findings**:
- Core recipe content is not reliably crawlable for public search indexing.
- Dynamic page titles/meta/social tags are missing across feature routes.
- Technical SEO essentials (robots.txt, sitemap.xml, structured data) are not implemented.

---

## Strengths

### Baseline On-Page Foundations
- **Basic head metadata exists** in `frontend/src/index.html` (title, description, viewport, theme color).
- **Clean route structure** (`/recipes`, `/recipes/:id`, `/recipes/:id/cook`) is SEO-friendlier than hash-based routing.
- **Semantic heading usage** is generally present in main pages (`h1`, section titles), supporting content structure.

### Performance/UX Signals That Help SEO Indirectly
- **PWA and production budgets are configured** in `frontend/angular.json`, supporting mobile experience and build discipline.
- **Mobile-first UX implementation is strong**, which aligns with mobile-first indexing priorities.

---

## Weaknesses

### Crawlability and Indexability
- Recipe listing and detail data are fetched client-side from protected API routes.
- No SSR/prerender capability is configured in the current Angular build.
- No crawler directives (`robots.txt`) or discovery maps (`sitemap.xml`) are present.

### Metadata and Rich Result Gaps
- No route-level title/description management via `Title`/`Meta` services.
- No Open Graph/Twitter cards, canonical tags, or schema.org structured data.
- No multilingual SEO path (`hreflang`/localized routes), despite i18n groundwork.

### Documentation Drift
- PRD/Architecture SEO assumptions are tied to Next.js SSR and not updated for Angular SPA reality.
- `INDEX.md` references several missing docs, limiting SEO implementation clarity.

---

## Issues to Address

### Critical Issues (Rank 1) ⚠️

#### Recipe Content Is Not Crawlable for Search Engines
- **Severity**: 1 (Critical)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `seo`, `bug`, `architecture`
- **Description**: Core recipe content depends on client-side API calls while backend recipe/search endpoints are auth-protected.
- **Impact**: Search crawlers cannot reliably access/index the actual recipe corpus.
- **Business Impact Details**: Directly blocks organic acquisition strategy ("SEO optimization for recipe searches") defined in product docs.
- **Location**: `backend/src/routes/routes.php`, `frontend/src/app/pages/recipes/recipes.component.ts`, `frontend/src/app/pages/recipe-detail/recipe-detail.component.ts`
- **Recommendation**: Define a public crawlable surface (public recipe endpoints/pages), then add SSR/prerender or server-rendered public pages for indexable content.
- **Estimated Effort**: Large
- **Status**: ⏳ Blocked (2026-02-19) – Requires architectural decision on public recipe surface (SSR vs. prerender vs. public API). Deferred to Phase 3 roadmap.

---

### High Priority Issues (Rank 2) 🔴

#### No Route-Level Meta Title/Description Management
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `seo`, `improvement`, `frontend`
- **Description**: The app uses one static `index.html` title/description; route views do not update metadata.
- **Impact**: All pages present nearly identical search snippets and weak keyword targeting.
- **Business Impact Details**: Lowers CTR and ranking relevance for high-intent pages (recipe detail, collections, meal planning).
- **Location**: `frontend/src/index.html`, `frontend/src/app/**`
- **Recommendation**: Implement an SEO service with route-aware `Title`/`Meta` updates and per-page defaults/fallbacks.
- **Estimated Effort**: Medium
- **Status**: ✅ Done (2026-02-19)

#### Missing Technical SEO Artifacts (`robots.txt`, `sitemap.xml`)
- **Severity**: 2 (High)
- **Business Impact**: `high-impact`
- **Priority Score**: P1
- **Labels**: `seo`, `configuration`, `deployment`
- **Description**: No `robots.txt` or sitemap exists in frontend assets/public output.
- **Impact**: Crawl guidance and URL discovery are weak or undefined.
- **Business Impact Details**: Slows or prevents efficient indexing, reducing top-of-funnel discoverability.
- **Location**: `frontend/src` / `frontend/public` (files absent)
- **Recommendation**: Add and publish `robots.txt` + generated/static sitemap; include deployment checks to keep sitemap current.
- **Estimated Effort**: Small
- **Status**: ✅ Done (2026-02-19)

#### Documentation SEO Strategy Is Misaligned With Implemented Stack
- **Severity**: 2 (High)
- **Business Impact**: `medium-impact`
- **Priority Score**: P2
- **Labels**: `seo`, `documentation`, `architecture`
- **Description**: Planning docs assume Next.js SSR/React stack while implementation is Angular SPA + Slim.
- **Impact**: SEO requirements are difficult to execute because implementation guidance is stale.
- **Business Impact Details**: Increases delivery risk and delays organic growth initiatives.
- **Location**: `docs/projects/recipes/PRD_OVERVIEW.md`, `docs/projects/recipes/ARCHITECTURE.md`, `docs/projects/recipes/INDEX.md`
- **Recommendation**: Publish a stack-accurate SEO addendum for Angular SPA (or planned migration path), including crawl/index strategy.
- **Estimated Effort**: Small

---

### Medium Priority Issues (Rank 3) 🟡

#### No Structured Data for Recipe Rich Results
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `seo`, `new-feature`, `improvement`
- **Description**: No `application/ld+json` markup is emitted for recipe detail pages.
- **Impact**: Rich snippets/features are unavailable in search results.
- **Business Impact Details**: Missed CTR gains and weaker SERP competitiveness.
- **Location**: `frontend/src/app/pages/recipe-detail/recipe-detail.component.ts` (and shared head management layer)
- **Recommendation**: Add Recipe schema (`Recipe`, `HowToStep`, optional `NutritionInformation`) for public recipe pages.
- **Estimated Effort**: Medium

#### Missing Canonical/Open Graph/Twitter Metadata
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `seo`, `ux`, `improvement`
- **Description**: Canonical URLs and social preview tags are not managed for content routes.
- **Impact**: Duplicate URL ambiguity and poor social sharing previews.
- **Business Impact Details**: Lower social amplification and reduced confidence signals for search.
- **Location**: `frontend/src/index.html`, `frontend/src/app/**`
- **Recommendation**: Add route-level canonical and OG/Twitter tag generation integrated with metadata service.
- **Estimated Effort**: Small

#### No Multilingual SEO Contract Despite Locale Foundation
- **Severity**: 3 (Medium)
- **Business Impact**: `medium-impact`
- **Priority Score**: P3
- **Labels**: `seo`, `i18n`, `improvement`
- **Description**: Locale handling exists (`lang`/`dir`), but there is no localized route strategy, hreflang plan, or localized metadata workflow.
- **Impact**: International SEO will be hard to scale and can cause duplicate-content/canonical conflicts.
- **Business Impact Details**: Limits future non-English growth and market expansion.
- **Location**: `frontend/src/app/app.component.ts`, `frontend/src/app/app.routes.ts`
- **Recommendation**: Define localized URL format and hreflang/canonical rules before multilingual rollout.
- **Estimated Effort**: Medium

---

### Low Priority Issues (Rank 4) 🟢

#### ID-Only Recipe URLs Limit Keyword-Relevant URL Signals
- **Severity**: 4 (Low)
- **Business Impact**: `low-impact`
- **Priority Score**: P4
- **Labels**: `seo`, `improvement`, `refactor`
- **Description**: Recipe details use `/recipes/:id` without slug context.
- **Impact**: URL text contributes little semantic relevance.
- **Business Impact Details**: Minor ranking/CTR opportunity loss versus slug-based URLs.
- **Location**: `frontend/src/app/app.routes.ts`
- **Recommendation**: Move to `/recipes/:id-:slug` (or `/recipes/:slug`) with canonical handling.
- **Estimated Effort**: Medium

---

### Trivial Issues (Rank 5) ⚪

#### Generic Default Homepage Description Is Broad
- **Severity**: 5 (Trivial)
- **Business Impact**: `low-impact`
- **Priority Score**: P4
- **Labels**: `seo`, `copy`, `improvement`
- **Description**: Current default description is generic and not tightly aligned to high-intent keywords.
- **Impact**: Small missed optimization opportunity.
- **Business Impact Details**: Minimal direct impact until route-level metadata exists.
- **Location**: `frontend/src/index.html`
- **Recommendation**: Refine baseline title/description while dynamic metadata rollout is in progress.
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

**Business Impact Guidelines**:
- **High Impact**: Affects revenue, user acquisition, retention, or critical user flows
- **Medium Impact**: Affects user experience, engagement, or secondary features
- **Low Impact**: Minor effects on business metrics or non-critical areas

### Issues by Priority

#### P1 Issues (Do Now)
- Recipe content is not crawlable for search engines (Rank 1, high impact).
- No route-level meta title/description management (Rank 2, high impact).
- Missing technical SEO artifacts (`robots.txt`, `sitemap.xml`) (Rank 2, high impact).

#### P2 Issues (Do Soon)
- Documentation SEO strategy is misaligned with implemented stack (Rank 2, medium impact).

#### P3 Issues (Do Later)
- No structured data for recipe rich results (Rank 3, medium impact).
- Missing canonical/Open Graph/Twitter metadata (Rank 3, medium impact).
- No multilingual SEO contract despite locale foundation (Rank 3, medium impact).

#### P4 Issues (Backlog)
- ID-only recipe URLs limit keyword URL signals (Rank 4, low impact).
- Generic default homepage description (Rank 5, low impact).

---

## PRD Review

### PRD Quality Assessment

**Overall PRD Quality**: 7 / 10

#### PRD Completeness
- **Requirements Coverage**: Partial (SEO goals present, implementation path incomplete for current stack)
- **User Stories**: Well-defined
- **Acceptance Criteria**: Vague for SEO-specific execution
- **Technical Requirements**: Incomplete/misaligned (Next.js SSR assumptions)
- **Success Metrics**: Defined, but not tied to concrete SEO acceptance gates

#### PRD vs Implementation Gap Analysis

**Features in PRD but Not Implemented**:
- SEO optimization as a go-to-market pillar is documented, but foundational technical SEO work is not implemented (crawl/index controls, structured metadata system, sitemap).
- Architecture calls out SSR for SEO but current app is SPA without SSR/prerender setup.

**Features Implemented but Not in PRD**:
- Angular locale `lang/dir` updates exist, but SEO/i18n path for those changes is undocumented.

**Implementation Deviations from PRD**:
- Planned Next.js + NestJS architecture differs from implemented Angular + Slim stack, changing SEO implementation mechanics significantly.

#### PRD Issues

##### SEO Strategy Not Operationalized for Current Stack
- **Severity**: 2
- **Business Impact**: high
- **Priority Score**: P1
- **Labels**: `documentation`, `prd`, `seo`, `architecture`
- **Issue**: SEO requirements are not translated into Angular SPA-compatible acceptance criteria.
- **Impact**: Team cannot reliably execute or verify SEO milestones.
- **Recommendation**: Add stack-specific SEO implementation plan (crawlability, metadata, schema, sitemap/robots, measurement).

### PRD Recommendations

**Strategic Recommendations**:
- Define an "SEO MVP Gate" with mandatory technical deliverables before growth campaigns.
- Separate "private app UX SEO" from "public indexable content SEO" and set explicit product decisions.

**Immediate PRD Updates Needed**:
- Add concrete SEO acceptance criteria for current stack.
- Update architecture references to either current implementation or explicit migration plan.

---

## Documentation Review

### Documentation Strengths
- PRD clearly recognizes SEO as a growth channel.
- Business strategy aligns SEO with user acquisition and CAC goals.

### Documentation Weaknesses
- SEO implementation guidance is anchored to a different frontend/backend stack.
- `INDEX.md` references missing docs (`technical/api-design.md`, `technical/search-system.md`, etc.).

### Documentation Issues
- Missing source-of-truth SEO implementation guide for Angular SPA deployment.

---

## Recommendations

### Strategic Recommendations
- Decide whether Recipes is a crawlable public content product or private authenticated utility first; SEO architecture depends on this.
- Establish SEO ownership and release gates in CI/release checklist.

### Technical Recommendations
- Implement public crawlable recipe pages/API access pattern.
- Add route-level metadata service (`Title`, `Meta`, canonical, OG/Twitter).
- Add `robots.txt` + sitemap generation/publishing.
- Add recipe structured data for detail pages.
- Define i18n SEO rules (localized routes + hreflang) before multilingual rollout.

### Learning Resources
- Google Search Central: JavaScript SEO and rendering
- schema.org Recipe structured data guidelines
- Angular SEO patterns for SPA + prerender/SSR strategies

---

## Next Steps

### Immediate Actions (This Week)
1. Publish `robots.txt` and `sitemap.xml`.
2. Implement dynamic route titles/descriptions for top routes (`/recipes`, `/recipes/:id`, `/meal-plan`).
3. Decide and document public crawlability model for recipe content.

### Short-term Actions (This Month)
1. Add canonical + OG/Twitter metadata generation.
2. Add Recipe schema JSON-LD on recipe detail pages.
3. Align PRD/architecture SEO sections with Angular + Slim implementation.

### Medium-term Actions (This Quarter)
1. Implement SSR/prerender or equivalent strategy for public recipe routes.
2. Roll out slug-based URLs and canonicalization.
3. Add SEO monitoring (index coverage, CTR, top landing pages, CWV trends).

### Long-term Actions (Backlog)
1. Launch multilingual SEO framework (`hreflang`, localized metadata, localized sitemaps).
2. Expand content strategy for long-tail recipe queries and internal linking clusters.

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
- Improvement: 6
- New Feature: 1
- Refactor: 1
- Documentation: 2
- Testing: 0
- Tech Debt: 1
- Compliance: 0
- UX: 1
- Design: 0
- Dependency: 0
- Configuration: 1
- Deployment: 1
- i18n: 1
- Mobile: 0
- API: 1
- Database: 0
- Architecture: 2
- DevOps: 0
- SEO: 9
- PRD: 1

**Issue Distribution by Priority**:
- P1 (Do Now): 3
- P2 (Do Soon): 1
- P3 (Do Later): 3
- P4 (Backlog): 2

**Issue Distribution by Business Impact**:
- High Impact: 3
- Medium Impact: 4
- Low Impact: 2

---

## Review Methodology

This SEO review covered documentation and implementation artifacts for crawlability, metadata, technical SEO, and growth readiness. I reviewed:
- Project docs (`PRD_OVERVIEW.md`, `ARCHITECTURE.md`, `INDEX.md`) for SEO requirements and architectural assumptions.
- Frontend app shell/routing/page components (`index.html`, routes, recipe pages, manifest, build config).
- Backend route access controls and API exposure relevant to indexing (`routes.php`).

Scope is limited to repository and docs artifacts available at review time.

---

*This review was conducted by Steven Taylor on 2026-02-18. For questions or clarifications, refer to `.cursor/rules/experts/seo_expert.mdc`.*
