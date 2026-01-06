# Planning Mode Workflow

This guide defines how to work in PLANNING MODE.

## Planning Mode Rule

Planning mode rules are enforced by `.cursor/rules/user/planning_mode.mdc`.

**Everything said by the user must be documented while in planning mode.**

This means:
- All user requests, ideas, and requirements must be captured in documentation
- All decisions and discussions should be recorded
- All project descriptions, workflows, and plans must be written down
- Nothing should be lost or forgotten

## Planning Mode Status

Planning mode is **ACTIVE** when the file `.PLANNING_MODE` exists in the `docs/` directory.

To check if planning mode is active, verify the existence of `docs/.PLANNING_MODE`.

## Rules While Planning Mode is Active

These rules are enforced by `.cursor/rules/user/planning_mode.mdc`.

### ✅ Allowed Activities

1. **Creating Documentation**
   - Feature PRDs (Product Requirements Documents)
   - TASKS.md files with implementation plans
   - Architecture documentation
   - Guides and reference materials
   - Project descriptions
   - Workflow documentation
   - Any markdown files in the `docs/` directory

4. **Cursor Configuration**
   - Creating rules files in `.cursor/` directory
   - Creating commands configuration in `.cursor/` directory
   - Setting up IDE workflow configurations

2. **Planning Activities**
   - Describing projects
   - Planning features
   - Creating workflows
   - Documenting decisions
   - Capturing requirements
   - Creating task breakdowns

3. **Documenting Everything**
   - All user requests must be documented
   - All ideas and concepts must be captured
   - All decisions must be recorded
   - All workflows must be written down

### ❌ Prohibited Activities

1. **Code Changes**
   - No code modifications
   - No file creation outside `docs/` and `.cursor/` directories
   - No implementation
   - No testing code
   - No configuration files (except `.cursor/` directory)

2. **Implementation**
   - No actual coding
   - No file system changes outside documentation and `.cursor/` directory
   - No dependency management
   - No build configuration
   - No deployment setup

## Workflow

When in planning mode:

1. **User makes a request or shares an idea**
2. **Document it immediately** in the appropriate location:
   - Features → `docs/features/<feature-name>/PRD.md` or `TASKS.md`
   - General concepts → `docs/guides/` or `docs/reference/`
   - Projects → `docs/projects/` or appropriate topic directory
   - Workflows → `docs/guides/` or `docs/workflows/`

3. **Update index files** (like `docs/README.md`) to include new documentation

4. **Ensure nothing is lost** - capture all context and details

## Documenting User Input

When the user says something that needs to be documented:

1. **Identify the type of content**:
   - Feature requirement → Feature PRD
   - Project description → Project documentation
   - Workflow/process → Workflow guide
   - General concept → Reference or guide
   - Task/plan → TASKS.md

2. **Create or update the appropriate documentation file**

3. **Capture all relevant details**:
   - What was said
   - Context and background
   - Requirements and constraints
   - Decisions made
   - Questions or considerations

## Exceptions

### `.cursor/` Directory

The `.cursor/` directory is **allowed** during planning mode for:
- Creating `.cursorrules` files
- Creating commands configuration
- Setting up IDE workflow configurations

This is allowed because Cursor configuration files are tooling/configuration rather than code implementation. See [.cursor Directory](./CURSOR_DIRECTORY.md) for details.

## Exit Planning Mode

To exit planning mode:

1. User must **explicitly request** removal of `.PLANNING_MODE` file
2. Only then may code changes and implementation begin
3. Documentation created during planning mode serves as the foundation for implementation

## Documentation Best Practices in Planning Mode

### Structure and Organization

When creating documentation during planning mode, follow these best practices:

1. **Use Appropriate Directories**
   - Feature documentation → `docs/features/<feature-name>/`
   - Guides → `docs/guides/`
   - Reference materials → `docs/reference/`
   - Architecture docs → `docs/architecture/`
   - Never place files directly in `docs/` root (except README.md)

2. **Naming Conventions**
   - Use descriptive, clear file names
   - Follow kebab-case for directories
   - Use UPPERCASE for important guides (e.g., `SETUP_GUIDE.md`)
   - Be consistent across similar document types

3. **File Organization**
   - Group related documentation together
   - Create subdirectories when needed
   - Maintain clear hierarchy
   - Update index files (README.md) when adding new docs

### Documentation Templates

#### PRD Template Structure

```markdown
# [Feature Name] - Product Requirements Document

## Overview
[Brief description of the feature]

## Goals
[What this feature aims to achieve]

## Requirements
### Functional Requirements
- [Requirement 1]
- [Requirement 2]

### Non-Functional Requirements
- [Performance, security, etc.]

## User Stories
- As a [user type], I want [goal] so that [benefit]

## Technical Architecture
[High-level technical approach]

## Implementation Phases
### Phase 1: [Name]
- [Tasks]

### Phase 2: [Name]
- [Tasks]

## Success Criteria
[How to measure success]

## Open Questions
[Unresolved questions or decisions needed]
```

#### TASKS.md Template Structure

```markdown
# [Feature Name] - Implementation Tasks

## Phase 1: [Phase Name]
- [ ] Task 1 - [Description]
  - Dependencies: [List dependencies]
  - Notes: [Additional context]
- [ ] Task 2 - [Description]
  - Dependencies: [List dependencies]

## Phase 2: [Phase Name]
- [ ] Task 1 - [Description]

## Status Legend
- [ ] Not started
- [⏳] In progress
- [✅] Completed
- [❌] Blocked
```

### Capturing User Input Effectively

#### Immediate Documentation Checklist

When the user provides input, immediately:

1. **Identify Content Type**
   - [ ] Feature requirement
   - [ ] Project description
   - [ ] Workflow/process
   - [ ] General concept
   - [ ] Task/plan
   - [ ] Decision
   - [ ] Question

2. **Determine Location**
   - [ ] Feature → `docs/features/<name>/`
   - [ ] Guide → `docs/guides/`
   - [ ] Reference → `docs/reference/`
   - [ ] Architecture → `docs/architecture/`

3. **Capture Complete Context**
   - [ ] What was said (exact or paraphrased)
   - [ ] Why it matters (purpose/goal)
   - [ ] When it's needed (timeline/priority)
   - [ ] Who it affects (stakeholders/users)
   - [ ] How it relates (connections to other features/docs)
   - [ ] Constraints or limitations
   - [ ] Open questions

4. **Document Format**
   - [ ] Use appropriate template
   - [ ] Include all relevant sections
   - [ ] Add examples if helpful
   - [ ] Link to related documentation
   - [ ] Update index files

### Quality Standards for Planning Mode Documentation

1. **Completeness**
   - All user input is captured
   - No information is lost
   - Context is preserved
   - Questions are documented

2. **Clarity**
   - Clear, understandable language
   - Well-organized structure
   - Appropriate level of detail
   - Examples when helpful

3. **Consistency**
   - Follow established templates
   - Use consistent formatting
   - Maintain naming conventions
   - Follow directory structure rules

4. **Accessibility**
   - Easy to find (proper location)
   - Easy to navigate (clear structure)
   - Easy to understand (clear language)
   - Easy to update (maintainable format)

### Common Documentation Patterns

#### Feature Documentation Pattern

```
docs/features/<feature-name>/
├── PRD.md          # Product Requirements Document
├── TASKS.md        # Implementation task breakdown
├── ARCHITECTURE.md # Technical architecture (optional)
├── API.md          # API documentation (optional)
└── TESTING.md      # Testing strategy (optional)
```

#### Guide Documentation Pattern

```markdown
# [Guide Title]

## Overview
[What this guide covers]

## Prerequisites
[What you need to know/do first]

## Step-by-Step Instructions
### Step 1: [Action]
[Detailed instructions]

### Step 2: [Action]
[Detailed instructions]

## Examples
[Practical examples]

## Troubleshooting
[Common issues and solutions]

## Related Documentation
[Links to related docs]
```

#### Reference Documentation Pattern

```markdown
# [Reference Title]

## Purpose
[What this reference covers]

## [Topic 1]
[Detailed information]

## [Topic 2]
[Detailed information]

## Quick Reference
[Summary or quick lookup table]

## See Also
[Links to related documentation]
```

### Workflow Examples

#### Example 1: User Requests a New Feature

1. **Immediate Action**: Create feature directory
   ```
   docs/features/user-authentication/
   ```

2. **Create PRD.md**: Document requirements
   - Capture all user requirements
   - Include context and background
   - Document decisions made
   - Note open questions

3. **Create TASKS.md**: Break down implementation
   - Organize by phases
   - List dependencies
   - Estimate complexity
   - Note prerequisites

4. **Update README.md**: Add feature to index
   - Link to feature documentation
   - Update features list

#### Example 2: User Describes a Workflow

1. **Identify Type**: Workflow/process documentation

2. **Determine Location**: `docs/guides/` or `docs/workflows/`

3. **Create Guide**: Document the workflow
   - Step-by-step instructions
   - Decision points
   - Examples
   - Troubleshooting

4. **Update Index**: Add to appropriate section in README.md

#### Example 3: User Makes a Decision

1. **Capture Decision**: Document in appropriate location
   - Feature decision → Feature PRD
   - Process decision → Workflow guide
   - General decision → Reference doc

2. **Include Context**:
   - What was decided
   - Why it was decided
   - Alternatives considered
   - Impact of decision

3. **Update Related Docs**: If decision affects other documentation

### Maintaining Documentation Quality

1. **Regular Review**
   - Check for outdated information
   - Verify links are working
   - Ensure consistency
   - Update as needed

2. **Version Control**
   - Track changes in git
   - Use clear commit messages
   - Document significant changes
   - Maintain change history

3. **Cross-References**
   - Link related documentation
   - Maintain documentation graph
   - Update links when files move
   - Keep references current

4. **Completeness Checks**
   - Verify all user input is captured
   - Check for missing information
   - Identify gaps in documentation
   - Fill in incomplete sections

### Troubleshooting Common Issues

#### Issue: Unsure Where to Place Documentation

**Solution**: Follow the documentation structure rules:
- Features → `docs/features/<name>/`
- Guides → `docs/guides/`
- Reference → `docs/reference/`
- Architecture → `docs/architecture/`
- If none fit, create appropriate topic directory

#### Issue: User Input is Vague or Incomplete

**Solution**: 
- Document what was said
- Note what's unclear
- List questions that need answers
- Mark sections as "TBD" (To Be Determined)
- Follow up to clarify

#### Issue: Multiple Related Pieces of Information

**Solution**:
- Group related information together
- Use cross-references
- Create index or summary
- Maintain clear relationships

#### Issue: Documentation Becomes Too Large

**Solution**:
- Break into multiple files
- Use subdirectories
- Create summary/index
- Link to detailed sections

### Mobile Considerations in Planning Mode

When planning features and documenting requirements during planning mode, it's critical to consider mobile-first design and mobile optimization from the start. Mobile is not an afterthought—it's a primary platform.

#### Mobile-First Planning Principles

1. **Mobile-First Mindset**
   - Plan for mobile devices first, then enhance for larger screens
   - Consider mobile constraints (screen size, touch input, network conditions) as primary constraints
   - Design for the smallest screen, then progressively enhance
   - Mobile users are not a subset—they're often the majority

2. **Touch-First Design**
   - Plan for touch interactions, not just mouse clicks
   - Consider gesture support (swipe, pinch, long-press)
   - Design large touch targets (minimum 44x44px or 48x48px)
   - Plan for thumb-friendly zones on mobile screens
   - Consider one-handed vs. two-handed usage patterns

3. **Mobile Performance Planning**
   - Plan for slower mobile networks (3G, 4G, variable speeds)
   - Consider data usage constraints
   - Plan for battery efficiency
   - Optimize for mobile CPU/GPU limitations
   - Plan for offline functionality (PWA considerations)

#### Mobile Requirements in PRDs

When creating PRDs during planning mode, include mobile-specific sections:

```markdown
## Mobile Requirements

### Device Support
- Target devices: [Smartphones, Tablets, specific screen sizes]
- Operating systems: [iOS, Android, versions]
- Browser support: [Mobile browsers, versions]

### Touch Interactions
- Required gestures: [Swipe, tap, long-press, etc.]
- Touch target sizes: [Minimum 44x44px]
- Gesture feedback: [Visual, haptic]

### Responsive Design
- Breakpoints: [Mobile: < 768px, Tablet: 768-1024px, Desktop: > 1024px]
- Layout strategy: [Mobile-first, progressive enhancement]
- Image optimization: [Responsive images, lazy loading]

### Performance Targets
- First Contentful Paint: [< 1.5s on 3G]
- Time to Interactive: [< 3s on 3G]
- Bundle size: [< 200KB initial load]
- Data usage: [Minimize, optimize assets]

### Progressive Web App (PWA)
- Offline support: [Yes/No, scope]
- Installable: [Yes/No]
- Service worker strategy: [Caching, background sync]
- App manifest: [Icons, theme, display mode]
```

#### Mobile Testing Requirements in Planning

When planning features, document mobile testing requirements:

1. **Device Testing Plan**
   - Real device testing (iOS, Android)
   - Emulator/simulator testing
   - Different screen sizes and resolutions
   - Different OS versions
   - Different browsers

2. **Network Testing**
   - 3G, 4G, 5G network conditions
   - Slow network simulation
   - Offline functionality testing
   - Network switching (WiFi to cellular)

3. **Performance Testing**
   - Load time on mobile networks
   - Battery usage
   - Memory usage
   - CPU/GPU performance

4. **Usability Testing**
   - Touch interaction testing
   - Gesture recognition
   - One-handed vs. two-handed usage
   - Orientation changes (portrait/landscape)
   - Keyboard interactions

#### Mobile Considerations in TASKS.md

When breaking down implementation tasks, include mobile-specific tasks:

```markdown
## Phase 1: Mobile Foundation
- [ ] Set up responsive breakpoints
- [ ] Implement mobile-first CSS
- [ ] Configure viewport meta tags
- [ ] Set up touch event handlers
- [ ] Design mobile navigation
- [ ] Optimize images for mobile
- [ ] Implement lazy loading

## Phase 2: Touch Interactions
- [ ] Implement swipe gestures
- [ ] Add touch feedback (haptic, visual)
- [ ] Design touch targets (44x44px minimum)
- [ ] Test gesture recognition
- [ ] Handle orientation changes

## Phase 3: Mobile Performance
- [ ] Optimize bundle size
- [ ] Implement code splitting
- [ ] Optimize images (WebP, responsive)
- [ ] Minimize network requests
- [ ] Implement caching strategy

## Phase 4: PWA Features (if applicable)
- [ ] Set up service worker
- [ ] Create app manifest
- [ ] Implement offline support
- [ ] Add install prompts
- [ ] Test offline functionality
```

#### Mobile Documentation Best Practices

When documenting during planning mode, consider mobile accessibility:

1. **Mobile-Readable Documentation**
   - Use short paragraphs (easier to read on small screens)
   - Break up long sections with headers
   - Use bullet points and lists (scannable on mobile)
   - Include code examples that are mobile-friendly
   - Test documentation readability on mobile devices

2. **Mobile-Friendly Code Examples**
   - Show mobile-specific code patterns
   - Include responsive design examples
   - Demonstrate touch interaction code
   - Provide mobile performance optimization examples
   - Include PWA implementation examples

3. **Mobile Planning Checklists**

Add mobile-specific items to planning checklists:

```markdown
## Mobile Planning Checklist

### Design
- [ ] Mobile-first design approach
- [ ] Touch-friendly interface design
- [ ] Responsive layout planned
- [ ] Mobile navigation designed
- [ ] Thumb-friendly zones considered

### Development
- [ ] Responsive breakpoints defined
- [ ] Touch interactions planned
- [ ] Mobile performance targets set
- [ ] Image optimization strategy planned
- [ ] PWA features considered (if applicable)

### Testing
- [ ] Real device testing planned
- [ ] Network condition testing planned
- [ ] Performance testing planned
- [ ] Usability testing planned
- [ ] Accessibility testing planned (mobile screen readers)
```

#### Mobile Performance Planning

When planning features, document mobile performance considerations:

1. **Initial Load Performance**
   - Target: First Contentful Paint < 1.5s on 3G
   - Strategy: Code splitting, lazy loading, minimal initial bundle
   - Assets: Optimize images, use WebP, implement responsive images

2. **Runtime Performance**
   - Target: 60fps animations, smooth scrolling
   - Strategy: Optimize JavaScript, use CSS animations, minimize reflows
   - Memory: Monitor memory usage, avoid memory leaks

3. **Network Performance**
   - Target: Minimize data usage, fast loading on slow networks
   - Strategy: Caching, compression, minimize requests
   - Offline: Plan for offline functionality if needed

4. **Battery Efficiency**
   - Strategy: Minimize CPU usage, optimize animations
   - Background: Limit background processing
   - Sensors: Use sensors efficiently (GPS, accelerometer)

#### Mobile Accessibility in Planning

When planning features, consider mobile accessibility:

1. **Screen Reader Support**
   - Plan for mobile screen readers (VoiceOver, TalkBack)
   - Ensure touch targets are accessible
   - Plan for proper ARIA labels on mobile

2. **Touch Accessibility**
   - Large touch targets (minimum 44x44px)
   - Adequate spacing between touch targets
   - Touch feedback (visual and haptic)
   - Gesture alternatives for complex interactions

3. **Visual Accessibility**
   - Responsive text sizing
   - High contrast on mobile screens
   - Readable font sizes on small screens
   - Color contrast considerations

#### Mobile Considerations Checklist for Planning Mode

When documenting features during planning mode, verify:

- [ ] Mobile-first approach is documented
- [ ] Touch interactions are planned
- [ ] Responsive design breakpoints are defined
- [ ] Mobile performance targets are set
- [ ] Mobile testing requirements are documented
- [ ] PWA features are considered (if applicable)
- [ ] Mobile accessibility is planned
- [ ] Mobile-specific user stories are included
- [ ] Mobile constraints are documented
- [ ] Mobile optimization strategies are outlined

### Copywriting Considerations in Planning Mode

When creating documentation during planning mode, apply copywriting principles to ensure clarity, consistency, and user-friendliness. Good copywriting in planning documentation makes features easier to understand, implement, and communicate to stakeholders.

#### Copywriting Principles for Planning Documentation

1. **Clarity First**
   - Use clear, simple language
   - Avoid jargon unless necessary (and define it when used)
   - Write in active voice
   - Be specific and concrete
   - Example: "Users can create custom study sets" vs "Custom study set creation functionality is available"

2. **User-Centric Language**
   - Write from the user's perspective
   - Use "you" and "your" when appropriate
   - Focus on user benefits, not just technical features
   - Example: "You can track your progress" vs "Progress tracking feature is implemented"

3. **Consistent Terminology**
   - Use the same terms throughout documentation
   - Create a glossary for key terms
   - Avoid synonyms that create confusion
   - Example: Always use "Practice Mode" not "Practice Mode" and "Practice Session" interchangeably

4. **Action-Oriented**
   - Use action verbs in task descriptions
   - Make requirements actionable and specific
   - Use imperative mood for instructions
   - Example: "Create user authentication flow" vs "User authentication flow should be created"

5. **Benefit-Focused**
   - Explain why features matter, not just what they do
   - Connect features to user goals
   - Highlight value in descriptions
   - Example: "Adaptive difficulty adjusts to your skill level, keeping you challenged but not overwhelmed" vs "Adaptive difficulty feature adjusts difficulty"

#### Naming Conventions in Planning Mode

When naming features, sections, and documentation during planning mode:

**Feature Naming Best Practices**:
- ✅ **DO**: Use clear, descriptive names
  - "Exam Mode", "Progress Dashboard", "Daily Challenge"
  - "Practice Session", "Study Set Creator", "Performance Analytics"
- ❌ **DON'T**: Use vague or technical names
  - "Feature 1", "Module A", "Component X"
  - "UserService", "DataHandler", "Manager"

**Section Naming Guidelines**:
- ✅ **DO**: Use user-friendly navigation labels
  - "Practice", "Exams", "Progress", "Settings"
  - "My Dashboard", "Study Materials", "Help Center"
- ❌ **DON'T**: Use technical or administrative terms
  - "User Area", "Content Management", "Administrative Functions"
  - "Data Entry", "System Configuration", "User Management"

**Documentation Naming**:
- ✅ **DO**: Use descriptive, searchable names
  - "User Authentication PRD", "Mobile Optimization Guide"
  - "API Integration Tasks", "Deployment Checklist"
- ❌ **DON'T**: Use generic or unclear names
  - "Feature PRD", "Documentation", "Tasks"
  - "Guide 1", "Reference", "Notes"

#### Writing Clear PRDs

When writing Product Requirements Documents, apply copywriting principles:

**PRD Headlines and Sections**:
```markdown
# Feature Name: Clear, Benefit-Focused Title

## Overview
[1-2 sentences that clearly explain what this feature does and why it matters]

## Goals
[Specific, measurable goals written from user perspective]
- Help users [specific user benefit]
- Enable [specific capability]
- Improve [specific metric or experience]

## User Stories
- As a [user type], I want [clear action] so that [specific benefit]
- Example: "As a student, I want to track my daily practice time so that I can see my learning progress"
```

**PRD Language Guidelines**:
- Use active voice: "Users can create" not "Creation is possible"
- Be specific: "Students can create up to 10 custom study sets" not "Users can create study sets"
- Focus on benefits: "Saves time by auto-generating practice questions" not "Auto-generates questions"
- Avoid ambiguity: "Requires 5 minutes to complete" not "Quick to complete"

#### Writing Clear TASKS.md Files

When writing implementation task lists, use clear, actionable language:

**Task Description Best Practices**:
```markdown
## Phase 1: User Authentication Foundation
- [ ] Create login form with email and password fields
  - Dependencies: None
  - Notes: Include "Remember me" checkbox and "Forgot password" link
- [ ] Implement password validation (minimum 8 characters, 1 uppercase, 1 number)
  - Dependencies: Login form created
  - Notes: Show real-time validation feedback
```

**Task Writing Guidelines**:
- Start with action verbs: "Create", "Implement", "Design", "Test"
- Be specific: "Create login form" not "Work on authentication"
- Include context: "Add error message for invalid email format" not "Add error handling"
- Make it measurable: "Implement password reset flow" not "Handle password issues"

#### Brand Voice in Planning Documentation

Maintain consistent brand voice in planning documentation:

**Voice Characteristics**:
- **Professional yet Approachable**: Use professional language that's friendly and accessible
- **Encouraging**: Frame challenges as opportunities
- **Clear**: Avoid unnecessary complexity
- **Confident**: Express certainty about solutions
- **Engaging**: Make documentation interesting to read

**Tone Examples for Planning Docs**:
```markdown
✅ DO: "This feature enables students to track their learning progress, helping them identify areas for improvement and celebrate their achievements."

❌ DON'T: "This feature provides functionality for tracking user progress metrics and performance indicators."

✅ DO: "Users can create custom study sets tailored to their specific learning needs."

❌ DON'T: "The system supports the creation of user-defined study set configurations."
```

#### Copywriting Checklist for Planning Documentation

When creating documentation during planning mode, verify:

**Clarity**:
- [ ] Language is clear and understandable
- [ ] Technical terms are defined when first used
- [ ] Sentences are concise and well-structured
- [ ] Active voice is used throughout
- [ ] No ambiguous or vague language

**Consistency**:
- [ ] Terminology is consistent across all documents
- [ ] Feature names are used consistently
- [ ] Section names follow naming conventions
- [ ] Tone and voice are consistent
- [ ] Formatting follows established patterns

**User-Centricity**:
- [ ] User perspective is maintained
- [ ] Benefits are clearly explained
- [ ] User stories are well-written
- [ ] Language is accessible to target audience
- [ ] Examples are user-focused

**Actionability**:
- [ ] Tasks are clearly defined
- [ ] Requirements are specific and measurable
- [ ] Instructions use imperative mood
- [ ] Next steps are clear
- [ ] Dependencies are explicit

**Brand Alignment**:
- [ ] Voice matches brand personality
- [ ] Tone is appropriate for audience
- [ ] Messaging is consistent with brand values
- [ ] Language is professional yet approachable
- [ ] Content is engaging and motivating

#### Copywriting Templates for Planning Mode

**Feature Description Template**:
```markdown
## [Feature Name]

**What it does**: [Clear, one-sentence description]
**Why it matters**: [User benefit in 1-2 sentences]
**Key capabilities**: 
- [Capability 1: User benefit]
- [Capability 2: User benefit]
- [Capability 3: User benefit]
```

**User Story Template**:
```markdown
As a [specific user type], 
I want [clear, specific action], 
so that [specific, measurable benefit].

Example:
As a physics student preparing for exams,
I want to practice with timed quizzes,
so that I can improve my speed and accuracy under exam conditions.
```

**Task Description Template**:
```markdown
- [ ] [Action verb] [specific deliverable] [context/requirements]
  - Dependencies: [List dependencies]
  - Notes: [Additional context, constraints, or considerations]
  
Example:
- [ ] Create responsive login form with email and password fields, including validation
  - Dependencies: Design mockups approved
  - Notes: Must be accessible (WCAG 2.1 AA), mobile-friendly, include "Remember me" option
```

#### Common Copywriting Mistakes in Planning Documentation

**Mistake 1: Overly Technical Language**
- ❌ "Implement RESTful API endpoint for user authentication"
- ✅ "Create login functionality that allows users to sign in with email and password"

**Mistake 2: Vague Descriptions**
- ❌ "Improve user experience"
- ✅ "Reduce login time from 30 seconds to under 5 seconds"

**Mistake 3: Passive Voice**
- ❌ "The feature will be implemented"
- ✅ "We will implement the feature" or "Implement the feature"

**Mistake 4: Missing User Context**
- ❌ "Add progress tracking"
- ✅ "Enable students to see their learning progress over time"

**Mistake 5: Inconsistent Terminology**
- ❌ Using "Practice Mode", "Practice Session", and "Practice Feature" interchangeably
- ✅ Consistently use "Practice Mode" throughout

#### Copywriting Review Process

Before finalizing planning documentation:

1. **Read Aloud**: Read documentation aloud to catch awkward phrasing
2. **User Test**: Have someone unfamiliar with the project read it
3. **Consistency Check**: Verify terminology is consistent
4. **Clarity Check**: Ensure every sentence is clear and understandable
5. **Benefit Check**: Verify user benefits are clearly stated
6. **Action Check**: Confirm all tasks and requirements are actionable

### Planning Mode Checklist

Before considering planning mode complete, verify:

- [ ] All user requests are documented
- [ ] All decisions are recorded
- [ ] All workflows are written down
- [ ] All features have PRDs
- [ ] All features have TASKS.md files
- [ ] All guides are complete
- [ ] All reference materials are documented
- [ ] README.md is up to date
- [ ] Documentation follows structure rules
- [ ] All links are working
- [ ] Documentation is clear and complete
- [ ] Nothing is lost or forgotten
- [ ] **Mobile considerations are documented for all features**
- [ ] **Mobile-first approach is applied**
- [ ] **Mobile testing requirements are included**
- [ ] **Copywriting principles are applied to all documentation**
- [ ] **Naming conventions are consistent**
- [ ] **Brand voice is maintained**
- [ ] **Language is clear and user-centric**

---

**Last Updated**: 2026-01-05  
**Status**: ACTIVE  
**Version**: 1.2

---

## Review/Contribution

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Enhanced this planning mode workflow guide by adding a comprehensive "Mobile Considerations in Planning Mode" section covering mobile-first planning principles (mobile-first mindset, touch-first design, mobile performance planning), mobile requirements in PRDs (device support, touch interactions, responsive design, performance targets, PWA considerations), mobile testing requirements in planning (device testing plan, network testing, performance testing, usability testing), mobile considerations in TASKS.md (mobile foundation tasks, touch interaction tasks, mobile performance tasks, PWA feature tasks), mobile documentation best practices (mobile-readable documentation, mobile-friendly code examples, mobile planning checklists), mobile performance planning (initial load performance, runtime performance, network performance, battery efficiency), mobile accessibility in planning (screen reader support, touch accessibility, visual accessibility), and a mobile considerations checklist for planning mode. Also fixed the date from 2025-01-05 to 2026-01-05. This addition ensures that mobile-first thinking is integrated into the planning process from the start, preventing mobile optimization from being an afterthought and ensuring all features are designed with mobile users in mind.

---

## Review/Contribution

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Expanded this planning mode workflow guide with comprehensive documentation best practices, including: documentation structure and organization guidelines (appropriate directories, naming conventions, file organization), documentation templates (PRD template structure, TASKS.md template structure with status tracking), effective user input capture techniques (immediate documentation checklist, content type identification, location determination, context capture), quality standards for planning mode documentation (completeness, clarity, consistency, accessibility), common documentation patterns (feature documentation pattern, guide documentation pattern, reference documentation pattern), detailed workflow examples (user requests new feature, user describes workflow, user makes decision), documentation maintenance practices (regular review, version control, cross-references, completeness checks), troubleshooting guide for common documentation issues, and a comprehensive planning mode checklist. These additions provide practical, actionable guidance for creating and maintaining high-quality documentation during planning mode, ensuring nothing is lost and all information is properly organized and accessible.

**Expert**: Emma Rodriguez  
**Expertise**: Copywriting (App Naming, Section Naming, Website Content)  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Copywriting Considerations in Planning Mode" section covering copywriting principles for planning documentation (clarity first with clear simple language and active voice, user-centric language with user perspective and benefit focus, consistent terminology with glossary creation, action-oriented language with action verbs and imperative mood, benefit-focused descriptions connecting features to user goals), naming conventions in planning mode (feature naming best practices with clear descriptive names vs vague technical names, section naming guidelines with user-friendly navigation labels vs technical administrative terms, documentation naming with descriptive searchable names vs generic unclear names), writing clear PRDs (PRD headlines and sections with benefit-focused titles, PRD language guidelines with active voice and specific measurable goals), writing clear TASKS.md files (task description best practices with action verbs and specific context, task writing guidelines with measurable deliverables), brand voice in planning documentation (voice characteristics including professional yet approachable, encouraging, clear, confident, engaging with tone examples), copywriting checklist for planning documentation (clarity checklist with clear language and active voice, consistency checklist with terminology and naming conventions, user-centricity checklist with user perspective and benefits, actionability checklist with clear tasks and requirements, brand alignment checklist with voice and tone consistency), copywriting templates for planning mode (feature description template, user story template, task description template), common copywriting mistakes in planning documentation (overly technical language, vague descriptions, passive voice, missing user context, inconsistent terminology with examples and corrections), and copywriting review process (read aloud, user test, consistency check, clarity check, benefit check, action check). Also updated the planning mode checklist to include copywriting principles, naming conventions, brand voice, and clear user-centric language. This addition ensures that all documentation created during planning mode follows copywriting best practices, making features easier to understand, implement, and communicate to stakeholders while maintaining brand consistency and user-centricity.

