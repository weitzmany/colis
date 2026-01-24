# Template-Project PRD Templates

This directory contains Product Requirements Document (PRD) templates for planning new projects.

---

## Available Templates

### 1. 📋 Full PRD Template

**File**: [PRD_TEMPLATE.md](PRD_TEMPLATE.md)

**Use when**:
- Starting a new project from scratch
- Need comprehensive documentation
- Multiple stakeholders need alignment
- Complex project with many features

**Includes**:
- Executive summary
- Problem statement
- User personas
- Comprehensive MVP definition
- Post-MVP roadmap
- Technical requirements
- Business requirements
- Timeline & milestones
- Success criteria
- Risk assessment
- Approval sign-off

### 2. ⚡ Quick Start PRD

**File**: [PRD_QUICK_START.md](PRD_QUICK_START.md)

**Use when**:
- Need to start planning quickly
- Simple/straightforward project
- Early-stage exploration
- Want to iterate on requirements

**Includes**:
- Problem & solution (brief)
- Target users
- Core MVP features (3-5)
- Success metrics
- Tech stack
- Post-MVP priorities
- Key risks

---

## How to Use

### Option 1: Copy Template to Your Project

```bash
# For comprehensive planning
cp packages/template-project/templates/PRD_TEMPLATE.md docs/projects/my-project/PRD.md

# For quick start
cp packages/template-project/templates/PRD_QUICK_START.md docs/projects/my-project/PRD.md
```

### Option 2: Use with Task Master

If using Task Master AI:

```bash
# Initialize Task Master in your project
cd my-project
npx taskmaster-ai init

# Copy PRD template
cp ../packages/template-project/templates/PRD_TEMPLATE.md .taskmaster/docs/prd.txt

# Parse PRD to generate tasks
npx taskmaster-ai parse-prd .taskmaster/docs/prd.txt
```

### Option 3: Use with Plan-Project Command

```bash
# Create project documentation with PRD
/local/plan-project my-project
```

---

## PRD Best Practices

### 1. Start with MVP

**Always define MVP clearly**:
- What's the ONE core problem?
- Who's the ONE primary user?
- What are the 3-5 must-have features?

### 2. Be Specific

**Use concrete metrics**:
- ❌ "Improve user engagement"
- ✅ "70% of users return weekly"

### 3. Prioritize Ruthlessly

**Everything can't be priority 1**:
- MVP: Core features only
- Phase 2: High-value additions
- Phase 3: Nice-to-haves

### 4. Update Regularly

**PRDs are living documents**:
- Update as you learn
- Track changes
- Maintain version history

### 5. Get Sign-Off

**Ensure alignment**:
- Product Manager
- Engineering Lead
- Design Lead
- Key Stakeholders

---

## Template Customization

### For Different Project Types

**Web Application**:
- Focus on user flows and interactions
- Include UI/UX requirements
- Define responsive design needs

**API/Backend Service**:
- Focus on API design and endpoints
- Include performance requirements
- Define integration points

**Mobile Application**:
- Focus on mobile-specific features
- Include platform considerations (iOS/Android)
- Define offline capabilities

**Full-Stack Application**:
- Include both frontend and backend requirements
- Define API contract
- Include deployment strategy

---

## Common Sections Explained

### Executive Summary
High-level overview for executives and stakeholders who need quick understanding without reading the entire document.

### MVP Definition
**Critical section** - defines what you're building FIRST. Keep it focused and minimal.

### Success Criteria
Define how you'll measure success. Use SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound).

### Risks & Mitigation
Identify potential issues early and plan how to address them.

### Tech Stack
Document technology choices and rationale. This guides architecture decisions.

---

## Integration with Other Tools

### Task Master AI
Parse PRD to automatically generate implementation tasks:
```bash
taskmaster-ai parse-prd prd.txt --tag=my-feature
```

### Plan-Project Command
Generate comprehensive project documentation:
```bash
/local/plan-project my-project
```

### Template-Project
Use PRD to guide project creation:
```bash
create-project my-project
# Select stack based on PRD tech stack section
```

---

## Examples

See real PRD examples in:
- `docs/projects/chore-allowance-manager/PRD_OVERVIEW.md`
- `docs/projects/pet-care-manager/PRD.md`
- `docs/projects/project-health-dashboard/PRD_OVERVIEW.md`

---

## Additional Resources

### Internal Documentation
- [Plan-Project Command](../../.cursor/commands/local/plan-project.md)
- [Feature Review Process](../../.cursor/commands/local/feature-review.md)
- [Documentation Standards](../../.cursor/rules/cursor_rules.mdc)

### External Resources
- [Product Requirements Document Best Practices](https://www.productplan.com/glossary/product-requirements-document/)
- [How to Write a PRD](https://www.atlassian.com/agile/product-management/requirements)
- [MVP Definition Guide](https://www.productplan.com/glossary/minimum-viable-product/)

---

## Contributing

To improve these templates:

1. **Identify gaps**: What's missing for your use case?
2. **Propose changes**: Update template with improvements
3. **Test**: Use updated template for a real project
4. **Document**: Add examples and rationale
5. **Share**: Submit improvements for others to use

---

## Questions?

If you have questions about using these templates or need guidance on PRD creation, consult:
- Product Manager expert (Patricia Martinez)
- Documentation expert (Dorothy Clark)
- Architecture expert (Marcus Johnson)

---

**Last Updated**: 2026-01-21  
**Maintained By**: Template-Project Package Team
