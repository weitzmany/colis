# Documentation Index

This directory contains all documentation organized by feature and topic.

## 🎯 Project Purpose

**Main Goal**: Create packages for broad use across all existing and future projects.

Packages can be:
- **Actual tools & features** - Reusable functionality to embed in projects
- **Rules & consistency packages** - Standards, templates, and patterns to maintain consistency

See [Project Purpose](./reference/PROJECT_PURPOSE.md) for complete details.

## ⚠️ PLANNING MODE ACTIVE

**Currently in PLANNING/DOCUMENTATION ONLY mode**

Planning mode rules are enforced by `.cursor/rules/user/planning_mode.mdc`.

Planning mode is controlled by `.PLANNING_MODE` file in `docs/` directory.

See [Planning Mode Workflow](./guides/PLANNING_MODE_WORKFLOW.md) for details.

## 📁 Structure

Documentation structure rules are enforced by `.cursor/rules/user/documentation_structure.mdc`.

**Summary**: All documentation files (except this README.md) must be organized in subdirectories:
- **Features** go in `features/<feature-name>/`
- **Other docs** go in topic-based directories (e.g., `guides/`, `reference/`, `architecture/`)

See [Documentation Structure Guide](./guides/DOCUMENTATION_STRUCTURE.md) for complete details.

## 🏗️ Architecture

**Package Strategy**: Core + Asset Packages (Hybrid Placement)
- **Core package** (`@colis/rig`): Orchestrates initialization and lifecycle management
- **Asset packages**: Provide hooks, templates, rules, and tooling consumed by core
- **Monorepo**: Single repository with clear package boundaries, optimized for shared tooling

**Key Decisions**:
- Git workflow uses hybrid placement: core orchestrates, logbook package provides assets
- Monorepo for all packages with extraction path if needed
- Lifecycle management: init, verify, repair, update commands

See [Package Architecture Strategy](./architecture/PACKAGE_ARCHITECTURE.md) for complete details.

## 🎯 Features

All feature documentation is located in the `features/` directory.

### Feature PRDs

**Core Features** (part of `@colis/rig` package):
- [Project Initialization](./features/commissioning/PRD.md) - Automated project setup with lifecycle management (verify, repair, refit)
- [Port Manager](./features/port-manager/PRD.md) - Automated port management with central registry (MySQL/SQLite)
- [Domain Manager](./features/domain-manager/PRD.md) - Local domain management with Caddy reverse proxy and automatic service detection

**Asset & Workflow Packages** (consumed by core):
- [Git Workflow](./features/logbook/PRD.md) - Standardized git hooks, templates, and lifecycle tools
- [Cursor Standards](./features/compass/PRD.md) - Main package for all Cursor rules, commands, and experts
- [Cursor Standards Rules](./features/compass-rules/PRD.md) - Rules-only package
- [Cursor Standards Commands](./features/compass-commands/PRD.md) - Commands-only package
- [Full Review](./features/full-review/PRD.md) - Comprehensive review routine command
- [Experts](./features/experts/PRD.md) - Expert personas package

**Tool Packages:**
- [Tasks](./features/tasks/PRD.md) - Task management and tracking utilities
- [Certification](./features/certification/PRD.md) - Documentation validation tools (formerly: documentation-validation)
- [Authentication Tool](./features/anchorage-tool/PRD.md) - Reusable authentication system
- [Database Migration Tool](./features/database-migration-tool/PRD.md) - Database migration utilities
- [API Client Library](./features/api-client-library/PRD.md) - HTTP client library
- [Validation Tool](./features/validation-tool/PRD.md) - Input and schema validation
- [Testing Utilities](./features/testing-utilities/PRD.md) - Testing helpers and utilities
- [Tide](./features/tide/PRD.md) - Animation and motion system utilities, components, and patterns (formerly: animations-with-gsap)
- [Error Handling & Recovery](./features/error-handling-recovery/PRD.md) - Standardized error handling, recovery strategies, and error monitoring

**Template & Configuration Packages:**
- [Project Template](./features/project-template/PRD.md) - Project starter templates
- [TypeScript Config](./features/typescript-config/PRD.md) - Standardized TypeScript configuration
- [Shipyard](./features/shipyard/PRD.md) - CI/CD workflow templates (formerly: cicd-templates)

_Note: These are placeholder PRDs with basic ideas. More details will be added as ideas develop._

## 📚 Documentation by Topic

### Project Overview
- [Project Purpose](./reference/PROJECT_PURPOSE.md) - Main goal and purpose of this packages project
- [Project Vision](./guides/PROJECT_VISION.md) - Long-term vision as central repository for all tools and helpers

### Guides
- [Documentation Structure Guide](./guides/DOCUMENTATION_STRUCTURE.md) - How to organize documentation
- [Documentation Standards Enforcement](./guides/DOCUMENTATION_STANDARDS_ENFORCEMENT.md) - How to ensure all projects follow documentation standards
- [Command vs Script](./guides/COMMAND_VS_SCRIPT.md) - Decision guide for when to use commands vs scripts
- [NPM Package Distribution](./guides/NPM_PACKAGE_DISTRIBUTION.md) - How npm packages can distribute rules, commands, and docs
- [NPM Package Organization](./guides/NPM_PACKAGE_ORGANIZATION.md) - Strategies for organizing multiple related packages (monorepo, scoped packages)
- [Cursor Package NPM](./guides/CURSOR_PACKAGE_NPM.md) - How to package Cursor rules and commands as an npm package
- [Cursor Package Setup](./guides/CURSOR_PACKAGE_SETUP.md) - Step-by-step setup guide for the npm package
- [Planning Mode Workflow](./guides/PLANNING_MODE_WORKFLOW.md) - How to work in planning mode
- [.cursor Directory](./guides/CURSOR_DIRECTORY.md) - Cursor IDE configuration directory
- [Security and Secrets](./guides/SECURITY_AND_SECRETS.md) - Rules for handling passwords, keys, tokens, and secrets
- [Port Management Strategy](./guides/PORT_MANAGEMENT_STRATEGY.md) - Strategy for managing ports across projects to ensure consistency and prevent conflicts
- [Project Commands](./guides/PROJECT_COMMANDS.md) - Command definitions for New Project and Kill Project

### Reference
- [Projects List](./reference/PROJECTS_LIST.md) - List of all projects in ~/Documents/
- [MCP Configurations](./reference/MCP_CONFIGURATIONS.md) - MCP configurations from other projects
- [Generic Rules Review](./reference/GENERIC_RULES_REVIEW.md) - Generic/useful rules from other projects for review
- [Generic Commands Review](./reference/GENERIC_COMMANDS_REVIEW.md) - Generic/useful commands from other projects for review
- [Generic Experts Review](./reference/GENERIC_EXPERTS_REVIEW.md) - Generic/useful complement from other projects for review
- [Generic Features Review](./reference/GENERIC_FEATURES_REVIEW.md) - Generic/reusable features from other projects for review
- [Additional Resources Review](./reference/ADDITIONAL_RESOURCES_TO_REVIEW.md) - Other useful resources and patterns to review
- [Scripts Review](./reference/SCRIPTS_REVIEW.md) - Generic/useful scripts from other projects
- [Project Structure Patterns Review](./reference/PROJECT_STRUCTURE_REVIEW.md) - Project organization patterns
- [CI/CD Workflows Review](./reference/CICD_WORKFLOWS_REVIEW.md) - GitHub Actions CI/CD patterns
- [Configuration Files Review](./reference/CONFIGURATION_FILES_REVIEW.md) - package.json, tsconfig, docker patterns
- [Documentation Patterns Review](./reference/DOCUMENTATION_PATTERNS_REVIEW.md) - Documentation structure and templates
- [Testing Structure Review](./reference/TESTING_STRUCTURE_REVIEW.md) - Test organization patterns
- [Environment Setup Review](./reference/ENVIRONMENT_SETUP_REVIEW.md) - Docker, .env setup patterns
- [API Structure Patterns Review](./reference/API_STRUCTURE_REVIEW.md) - RESTful API organization
- [Component Structure Review](./reference/COMPONENT_STRUCTURE_REVIEW.md) - Component organization patterns
- [Build & Deployment Review](./reference/BUILD_DEPLOYMENT_REVIEW.md) - Build and deployment automation
- [Git Hooks Review](./reference/GIT_HOOKS_REVIEW.md) - Git hooks patterns
- [Database Schemas Review](./reference/DATABASE_SCHEMAS_REVIEW.md) - Database migration patterns
- [Projects Ports Reference](./reference/PROJECTS_PORTS.md) - Port assignments and configurations for all projects
- [Project Selection Criteria](./reference/PROJECT_SELECTION_CRITERIA.md) - Criteria for selecting new or least wanted projects

_Additional topic directories will be created as needed._

---

## Creating New Documentation

When creating new documentation:

See [Documentation Structure Guide](./guides/DOCUMENTATION_STRUCTURE.md) for complete details and workflow.

Documentation structure rules are enforced by `.cursor/rules/user/documentation_structure.mdc`.

## 🔍 Search Engine Optimization (SEO) for Documentation

This documentation site should be optimized for search engine discoverability to help developers and users find relevant information quickly. The following SEO best practices apply to all documentation files.

### On-Page SEO Best Practices

#### 1. Title Tags and Headings
- **Use descriptive, keyword-rich titles**: Each documentation page should have a clear, descriptive title that includes relevant keywords
- **Follow heading hierarchy**: Use H1 for main page title, H2 for major sections, H3 for subsections
- **Include target keywords naturally**: Integrate relevant search terms (e.g., "documentation structure", "planning mode", "expert review") in headings and content
- **Keep titles concise**: Aim for 50-60 characters for optimal display in search results

**Example**:
```markdown
# Documentation Structure Guide - Best Practices for Organizing Project Docs
## Planning Mode Workflow - How to Work in Documentation-Only Mode
```

#### 2. Meta Descriptions
- **Write compelling descriptions**: Each page should have a meta description (150-160 characters) that summarizes the content
- **Include call-to-action**: Encourage clicks with action-oriented language
- **Use relevant keywords**: Naturally incorporate target keywords in descriptions

**Example**:
```html
<meta name="description" content="Learn how to organize project documentation with our comprehensive structure guide. Best practices for features, guides, and reference documentation.">
```

#### 3. Content Optimization
- **Use semantic HTML**: Structure content with proper HTML5 semantic elements (`<article>`, `<section>`, `<nav>`, `<header>`)
- **Include alt text for images**: All images should have descriptive alt text for accessibility and SEO
- **Optimize internal linking**: Link to related documentation pages using descriptive anchor text
- **Use descriptive anchor text**: Instead of "click here", use "see Documentation Structure Guide"

**Example**:
```markdown
For more information, see the [Documentation Structure Guide](./guides/DOCUMENTATION_STRUCTURE.md) 
for complete details on organizing documentation.
```

#### 4. Keyword Strategy
- **Primary keywords**: "documentation structure", "project documentation", "development guides", "technical documentation"
- **Long-tail keywords**: "how to organize project documentation", "documentation best practices", "technical writing guidelines"
- **Natural keyword usage**: Integrate keywords naturally in content, headings, and links
- **Topic clusters**: Group related documentation to create topic clusters (e.g., all guides together, all reference docs together)

### Technical SEO

#### 1. URL Structure
- **Use descriptive URLs**: File names should be descriptive and include keywords
  - ✅ Good: `documentation-structure-guide.md`
  - ❌ Bad: `doc1.md`, `guide.md`
- **Use hyphens, not underscores**: Search engines treat hyphens as word separators
- **Keep URLs short**: Aim for concise but descriptive paths
- **Maintain consistent structure**: Follow the directory structure (guides/, reference/, features/)

#### 2. Sitemap Generation
- **Create XML sitemap**: Generate a sitemap.xml file listing all documentation pages
- **Include last modified dates**: Help search engines understand content freshness
- **Set priority levels**: Homepage and key guides should have higher priority (1.0), reference docs lower (0.7-0.8)
- **Update regularly**: Keep sitemap updated when new documentation is added

**Example sitemap structure**:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://docs.example.com/</loc>
    <lastmod>2026-01-05</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://docs.example.com/guides/documentation-structure</loc>
    <lastmod>2026-01-05</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

#### 3. Robots.txt Configuration
- **Allow search engine crawling**: Ensure documentation is accessible to search engines
- **Disallow private/admin areas**: Block access to internal-only documentation if applicable
- **Reference sitemap**: Include sitemap location in robots.txt

**Example robots.txt**:
```txt
User-agent: *
Allow: /
Disallow: /private/
Disallow: /admin/

Sitemap: https://docs.example.com/sitemap.xml
```

#### 4. Structured Data (Schema.org)
- **Use DocumentationPage schema**: Mark up documentation pages with appropriate schema
- **Add breadcrumb navigation**: Implement breadcrumb schema for better search result display
- **Include organization schema**: Add organization information for brand recognition

**Example structured data**:
```json
{
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Documentation Structure Guide",
  "description": "Best practices for organizing project documentation",
  "author": {
    "@type": "Organization",
    "name": "Project Name"
  },
  "datePublished": "2026-01-05",
  "dateModified": "2026-01-05",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://docs.example.com/guides/documentation-structure"
  }
}
```

### Internal Linking Strategy

#### 1. Hub and Spoke Model
- **Create topic hubs**: Use main index pages (like this README) as hubs
- **Link to related content**: Each page should link to 3-5 related pages
- **Use descriptive anchor text**: Anchor text should describe the linked content
- **Maintain link freshness**: Regularly review and update internal links

#### 2. Navigation Structure
- **Clear navigation hierarchy**: Make it easy for users and search engines to understand site structure
- **Breadcrumb navigation**: Implement breadcrumbs for better UX and SEO
- **Related content sections**: Add "Related Documentation" sections to guide users to relevant content

**Example internal linking**:
```markdown
## Related Documentation

- [Planning Mode Workflow](./guides/PLANNING_MODE_WORKFLOW.md) - Learn how to work in planning mode
- [Documentation Patterns Review](./reference/DOCUMENTATION_PATTERNS_REVIEW.md) - Review documentation patterns from other projects
- [Security and Secrets](./guides/SECURITY_AND_SECRETS.md) - Best practices for handling sensitive information
```

### Content Quality and Freshness

#### 1. Content Depth
- **Comprehensive coverage**: Each documentation page should thoroughly cover its topic
- **Include examples**: Provide practical examples and code snippets
- **Answer common questions**: Anticipate and answer frequently asked questions
- **Update regularly**: Keep documentation current with project changes

#### 2. Content Freshness Signals
- **Last updated dates**: Include "Last Updated" dates on documentation pages
- **Version information**: Include version numbers for versioned documentation
- **Change logs**: Maintain changelogs for significant documentation updates
- **Regular reviews**: Schedule periodic documentation reviews and updates

### Performance SEO

#### 1. Page Load Speed
- **Optimize images**: Compress and optimize images used in documentation
- **Minimize file size**: Keep markdown files focused and avoid unnecessary content
- **Use CDN**: Serve documentation from a content delivery network if possible
- **Enable caching**: Configure appropriate cache headers for documentation

#### 2. Mobile Optimization
- **Responsive design**: Ensure documentation renders well on mobile devices
- **Readable font sizes**: Use appropriate font sizes for mobile reading
- **Touch-friendly navigation**: Make navigation elements easily tappable on mobile
- **Fast mobile load times**: Optimize for mobile Core Web Vitals

### Search Functionality

#### 1. Site Search Implementation
- **Add search functionality**: Implement site search to help users find content quickly
- **Search result optimization**: Ensure search results display relevant titles and descriptions
- **Search analytics**: Track search queries to identify content gaps
- **Search suggestions**: Provide search suggestions and autocomplete

#### 2. Search Engine Integration
- **Google Search Console**: Set up Google Search Console to monitor search performance
- **Bing Webmaster Tools**: Submit documentation to Bing Webmaster Tools
- **Monitor search queries**: Track which queries bring users to documentation
- **Optimize for featured snippets**: Structure content to potentially appear in featured snippets

### SEO Checklist for New Documentation

When creating new documentation, ensure:

- [ ] **Descriptive title**: Page has a clear, keyword-rich title (H1)
- [ ] **Meta description**: Page has a compelling meta description (150-160 characters)
- [ ] **Heading hierarchy**: Proper H1-H6 hierarchy is used
- [ ] **Internal links**: Page links to 3-5 related documentation pages
- [ ] **Descriptive URLs**: File name is descriptive and uses hyphens
- [ ] **Alt text**: All images have descriptive alt text
- [ ] **Structured data**: Appropriate schema markup is included
- [ ] **Keywords**: Relevant keywords are naturally integrated
- [ ] **Content depth**: Topic is comprehensively covered
- [ ] **Last updated**: Date of last update is included
- [ ] **Related content**: Links to related documentation are provided

### SEO Tools and Resources

#### Recommended Tools
- **Google Search Console**: Monitor search performance and indexing
- **Google Analytics**: Track user behavior and content performance
- **PageSpeed Insights**: Measure and improve page load speed
- **Schema.org Validator**: Validate structured data markup
- **Screaming Frog SEO Spider**: Crawl and analyze documentation site

#### Key Metrics to Monitor
- **Organic search traffic**: Track visitors from search engines
- **Keyword rankings**: Monitor rankings for target keywords
- **Click-through rate (CTR)**: Measure how often search results are clicked
- **Bounce rate**: Identify pages with high bounce rates
- **Average session duration**: Measure engagement with documentation
- **Pages per session**: Track how many pages users visit

### Best Practices Summary

1. **Optimize for users first**: SEO should enhance, not compromise, user experience
2. **Focus on quality content**: High-quality, comprehensive content ranks better
3. **Maintain consistency**: Use consistent structure, formatting, and terminology
4. **Update regularly**: Fresh, updated content signals relevance to search engines
5. **Monitor and iterate**: Track performance and continuously improve SEO
6. **Mobile-first**: Ensure documentation works well on all devices
7. **Fast loading**: Optimize for speed to improve user experience and rankings
8. **Internal linking**: Create a strong internal linking structure
9. **Structured data**: Use schema markup to help search engines understand content
10. **Analytics**: Track performance and make data-driven improvements

---

## Review/Contribution

**Expert**: Steven Taylor  
**Expertise**: SEO (Search Engine Optimization)  
**Date**: 2026-01-05  
**Changes**: Added comprehensive SEO considerations section covering on-page SEO best practices (title tags, meta descriptions, content optimization, keyword strategy), technical SEO (URL structure, sitemap generation, robots.txt configuration, structured data), internal linking strategy (hub and spoke model, navigation structure), content quality and freshness (content depth, freshness signals), performance SEO (page load speed, mobile optimization), search functionality (site search implementation, search engine integration), SEO checklist for new documentation, SEO tools and resources, and best practices summary. This addition ensures the documentation site is optimized for search engine discoverability, helping developers and users find relevant information quickly through search engines.

