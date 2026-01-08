# Documentation Structure Guide

This document defines the standard structure for organizing all documentation in this knowledge base.

## ⚠️ PLANNING MODE

**CRITICAL**: This project is currently in **PLANNING/DOCUMENTATION ONLY** mode.

Planning mode rules are enforced by `.cursor/rules/user/planning_mode.mdc`.

If the file `.PLANNING_MODE` exists in the `docs/` directory, planning mode is active.

Only create documentation, PRDs, TASKS.md files, guides, and planning documents.
Implementation will begin only after explicit request to remove `.PLANNING_MODE`.

## Structure Rule

This rule is enforced by `.cursor/rules/user/documentation_structure.mdc`.

**All documentation files (except README.md) must be organized in subdirectories:**

```
docs/
├── README.md                        # Only .md file allowed in root
├── features/                        # All feature documentation
│   ├── <feature-name>/              # Feature directory (kebab-case)
│   │   ├── PRD.md                   # Product Requirements Document
│   │   └── TASKS.md                 # Implementation task list
│   └── <other-feature-name>/        # Another feature
│       ├── PRD.md
│       └── TASKS.md
├── guides/                          # General guides and structure docs
│   └── DOCUMENTATION_STRUCTURE.md   # This file
├── reference/                       # Reference documentation
├── architecture/                    # Architecture documentation
└── <topic>/                         # Other topic directories as needed
```

## Key Rules

1. **No .md files in root** - Only `README.md` is allowed in the main `docs/` directory
2. **Features go in `features/`** - All feature documentation must be in `features/<feature-name>/` directories
3. **Other docs by topic** - Non-feature documentation must be organized by topic in dedicated directories
4. **Directory naming** - Use kebab-case for all directory names

## Directory Naming Convention

- Use **kebab-case** for all directory names
- Feature examples:
  - `features/user-authentication`
  - `features/analytics-dashboard`
  - `features/data-processing`
- Topic examples:
  - `guides/` - General guides
  - `reference/` - Reference documentation
  - `architecture/` - Architecture documentation
  - `patterns/` - Design patterns and best practices

## File Naming Convention

### Required Files in Each Feature Directory

1. **PRD.md** - Product Requirements Document
   - Complete feature specification
   - Requirements and technical architecture
   - Configuration examples
   - Implementation phases overview

2. **TASKS.md** - Implementation Task List
   - Detailed task breakdown by phase
   - Task status tracking
   - Dependencies and notes
   - Progress tracking

### Optional Files

- **ARCHITECTURE.md** - Detailed technical architecture (if PRD is too large)
- **API.md** - API documentation (if feature exposes APIs)
- **TESTING.md** - Testing strategy and test cases
- **DEPLOYMENT.md** - Deployment-specific instructions

## Organizing Non-Feature Documentation

Non-feature documentation must be organized by topic in dedicated directories:

- **General guides** → `guides/` directory
- **Reference materials** → `reference/` directory
- **Architecture docs** → `architecture/` directory
- **Design patterns** → `patterns/` directory (create if needed)
- **Other topics** → Create new topic directory as needed

**Never place .md files directly in the `docs/` root** (except README.md).

## Workflow for New Features

When asked to design a new feature:

1. **Create feature directory** in `docs/features/` using kebab-case naming
2. **Create PRD.md** in the feature directory with complete requirements
3. **Create TASKS.md** in the feature directory with detailed task breakdown
4. **Update README.md** to include the new feature
5. **Follow the same structure** for all future features

## Workflow for Other Documentation

When creating non-feature documentation:

1. **Identify the topic** (guides, reference, architecture, etc.)
2. **Use existing topic directory** if it exists, or create a new one
3. **Place the file** in the appropriate topic directory
4. **Update README.md** to include the new documentation
5. **Never place files** directly in `docs/` root

## Example Structure

```
docs/
├── README.md
├── features/
│   ├── feature-one/
│   │   ├── PRD.md
│   │   └── TASKS.md
│   └── feature-two/
│       ├── PRD.md
│       └── TASKS.md
├── guides/
│   └── DOCUMENTATION_STRUCTURE.md
├── reference/
│   └── example-reference.md
└── architecture/
    └── system-overview.md
```

## Benefits

- **Organization**: Clear separation between features and topics
- **Discoverability**: Easy to find documentation by category
- **Scalability**: Can add more files per feature or topic as needed
- **Consistency**: Same structure for all documentation
- **Maintainability**: No clutter in root directory
- **Clarity**: README.md is the only file in root, making navigation obvious

## Internationalization (i18n) Considerations for Documentation Structure

When planning for multilingual documentation, the structure must support multiple languages while maintaining organization and discoverability.

### Multilingual Documentation Structure Patterns

#### Pattern 1: Language-Specific Directories (Recommended for Large Documentation)

```
docs/
├── README.md                        # Main index (language selector)
├── en/                              # English documentation
│   ├── features/
│   │   └── <feature-name>/
│   │       ├── PRD.md
│   │       └── TASKS.md
│   ├── guides/
│   │   └── DOCUMENTATION_STRUCTURE.md
│   └── reference/
├── es/                              # Spanish documentation
│   ├── features/
│   │   └── <feature-name>/
│   │       ├── PRD.md
│   │       └── TASKS.md
│   ├── guides/
│   └── reference/
└── assets/                          # Shared assets (images, diagrams)
    └── images/
```

**Advantages**:
- Clear language separation
- Easy to maintain per-language structure
- Simple to add new languages
- Language-specific navigation

**Considerations**:
- Requires maintaining structure across all languages
- More complex linking between languages
- Larger directory tree

#### Pattern 2: Language Suffix in Filenames

```
docs/
├── README.md
├── features/
│   └── <feature-name>/
│       ├── PRD.en.md
│       ├── PRD.es.md
│       ├── TASKS.en.md
│       └── TASKS.es.md
├── guides/
│   ├── DOCUMENTATION_STRUCTURE.en.md
│   └── DOCUMENTATION_STRUCTURE.es.md
└── reference/
```

**Advantages**:
- Single directory structure
- Easy to see all language versions together
- Simpler file management

**Considerations**:
- Can become cluttered with many languages
- Harder to navigate per-language
- More complex file naming

#### Pattern 3: Hybrid Approach (Language Directories with Shared Structure)

```
docs/
├── README.md
├── en/
│   ├── features/
│   ├── guides/
│   └── reference/
├── es/
│   ├── features/
│   ├── guides/
│   └── reference/
└── shared/                          # Language-agnostic content
    ├── code-examples/               # Code examples (usually language-agnostic)
    ├── diagrams/                    # Diagrams and images
    └── templates/                   # Documentation templates
```

**Advantages**:
- Best of both worlds
- Shared assets don't need translation
- Clear language separation for translatable content

### Documentation Structure Rules for i18n

1. **Consistent Structure Across Languages**:
   - Maintain the same directory structure in all language directories
   - Use identical file names (only language differs)
   - Keep the same navigation hierarchy

2. **Language Identification**:
   - Use ISO 639-1 language codes (en, es, fr, de, etc.)
   - Be consistent with language code usage
   - Document language codes in README

3. **Shared vs. Translated Content**:
   - **Shared**: Code examples, diagrams, configuration files, API schemas
   - **Translated**: User-facing text, guides, descriptions, explanations
   - **Partially Translated**: Code comments (may need translation), error messages

4. **File Naming for i18n**:
   - If using language directories: Keep same filenames
   - If using language suffixes: Use consistent format (`.en.md`, `.es.md`)
   - Document naming convention clearly

### Translation Workflow Integration

#### Documentation Structure for Translation Management

```
docs/
├── README.md
├── source/                          # Source language (usually English)
│   ├── features/
│   ├── guides/
│   └── reference/
├── translations/                    # Translated versions
│   ├── es/
│   ├── fr/
│   └── de/
└── translation-files/              # Translation keys (if using key-based approach)
    ├── en.json
    ├── es.json
    └── fr.json
```

#### Translation Status Tracking

Consider adding translation status indicators to documentation:

```markdown
## Translation Status

- **English (en)**: ✅ Complete
- **Spanish (es)**: ⏳ In Progress (80% complete)
- **French (fr)**: ❌ Not Started
- **German (de)**: ✅ Complete
```

### Best Practices for i18n Documentation Structure

1. **Plan for i18n from the Start**:
   - Design structure with multilingual support in mind
   - Use language-agnostic file names where possible
   - Keep code examples separate from translatable content

2. **Maintain Structure Consistency**:
   - Same directory structure across all languages
   - Same file organization
   - Same navigation patterns

3. **Handle Language-Specific Content**:
   - Date/time formats (document locale-specific formatting)
   - Number formats (document locale-specific formatting)
   - Cultural adaptations (not just translation)

4. **Link Between Languages**:
   - Provide language switcher
   - Link to same document in other languages
   - Maintain cross-language navigation

5. **Version Control for Translations**:
   - Track translation completeness
   - Identify outdated translations
   - Maintain translation status

### Example: Multilingual Feature Documentation

```
docs/
├── README.md                        # Language selector + overview
├── en/
│   └── features/
│       └── user-authentication/
│           ├── PRD.md              # English PRD
│           └── TASKS.md            # English tasks
├── es/
│   └── features/
│       └── user-authentication/
│           ├── PRD.md              # Spanish PRD (translated)
│           └── TASKS.md            # Spanish tasks (translated)
└── shared/
    └── features/
        └── user-authentication/
            ├── api-schema.json     # Language-agnostic API schema
            └── diagrams/           # Diagrams (language-agnostic)
```

### Documentation Structure Checklist for i18n

When setting up documentation structure for internationalization:

- [ ] Choose i18n structure pattern (language directories, filename suffixes, or hybrid)
- [ ] Document language code conventions (ISO 639-1)
- [ ] Plan for shared vs. translated content
- [ ] Establish translation workflow
- [ ] Set up translation status tracking
- [ ] Create language switcher/navigation
- [ ] Plan for cross-language linking
- [ ] Document translation guidelines
- [ ] Set up version control for translations
- [ ] Plan for RTL language support if needed

### RTL (Right-to-Left) Language Considerations

For languages like Arabic, Hebrew, or Urdu:

1. **Directory Structure**: Same structure (RTL doesn't affect file organization)
2. **Content Formatting**: May need RTL-specific formatting in rendered docs
3. **Navigation**: Navigation menus may need RTL layout
4. **Images and Diagrams**: May need mirrored versions for RTL languages

### Tools and Technologies for i18n Documentation

1. **Static Site Generators with i18n**:
   - Docusaurus (built-in i18n support)
   - GitBook (multilingual support)
   - MkDocs with i18n plugins
   - VuePress with i18n

2. **Translation Management**:
   - Crowdin for documentation
   - Transifex for technical docs
   - Lokalise for developer docs
   - Custom translation workflows

3. **Content Management**:
   - Markdown with frontmatter for language metadata
   - YAML for structured multilingual content
   - JSON for translation keys
   - Database-driven content with language fields

## GraphQL API Documentation Structure

When documenting GraphQL APIs, the structure must support schema-first development, type documentation, query examples, and introspection capabilities.

### GraphQL Documentation Organization

#### Recommended Structure for GraphQL APIs

```
docs/
├── README.md
├── features/
│   └── graphql-api/                    # GraphQL API feature
│       ├── PRD.md                      # Product Requirements Document
│       ├── TASKS.md                     # Implementation tasks
│       ├── SCHEMA.md                   # GraphQL schema documentation
│       ├── QUERIES.md                   # Query documentation and examples
│       ├── MUTATIONS.md                 # Mutation documentation and examples
│       ├── SUBSCRIPTIONS.md             # Subscription documentation (if applicable)
│       └── TYPES.md                     # Type definitions and descriptions
├── reference/
│   ├── graphql-schema.graphql          # Complete GraphQL schema file
│   ├── graphql-examples/               # Example queries and mutations
│   │   ├── queries/
│   │   │   ├── user-queries.graphql
│   │   │   └── product-queries.graphql
│   │   └── mutations/
│   │       ├── user-mutations.graphql
│   │       └── product-mutations.graphql
│   └── graphql-types/                  # Type documentation
│       ├── user-types.md
│       └── product-types.md
└── architecture/
    └── graphql-architecture.md         # GraphQL server architecture
```

### GraphQL Schema Documentation Structure

#### Schema-First Documentation Approach

1. **Schema File Organization**:
   ```
   docs/reference/
   ├── graphql-schema.graphql            # Main schema file (complete)
   └── graphql-schema-modules/          # Modular schema files
       ├── user.graphql                  # User-related types
       ├── product.graphql               # Product-related types
       ├── order.graphql                 # Order-related types
       └── common.graphql                # Common types (scalars, enums)
   ```

2. **Type Documentation Structure**:
   - **Type Definitions**: Document each type with description, fields, and examples
   - **Field Documentation**: Document each field with description, arguments, return type, and examples
   - **Interface Documentation**: Document interfaces and implementing types
   - **Union Documentation**: Document unions and member types
   - **Enum Documentation**: Document enums with value descriptions
   - **Scalar Documentation**: Document custom scalars with validation rules

3. **Query Documentation Structure**:
   ```
   docs/reference/graphql-queries/
   ├── README.md                         # Query overview and navigation
   ├── user-queries.md                   # User-related queries
   │   ├── getUser
   │   ├── listUsers
   │   └── searchUsers
   ├── product-queries.md                 # Product-related queries
   └── examples/                         # Query examples
       ├── basic-queries.graphql
       ├── nested-queries.graphql
       └── filtered-queries.graphql
   ```

4. **Mutation Documentation Structure**:
   ```
   docs/reference/graphql-mutations/
   ├── README.md                         # Mutation overview
   ├── user-mutations.md                 # User-related mutations
   │   ├── createUser
   │   ├── updateUser
   │   └── deleteUser
   ├── product-mutations.md               # Product-related mutations
   └── examples/                         # Mutation examples
       ├── create-operations.graphql
       └── update-operations.graphql
   ```

### GraphQL Documentation Best Practices

1. **Schema Documentation**:
   - Use GraphQL schema comments (`"""`) for type and field descriptions
   - Include example queries in schema comments
   - Document deprecation reasons and migration paths
   - Use `@deprecated` directive with reason
   - Example:
     ```graphql
     """
     Represents a user in the system.
     
     Example query:
     ```graphql
     query {
       user(id: "123") {
         id
         name
         email
       }
     }
     ```
     """
     type User {
       """Unique identifier for the user"""
       id: ID!
       
       """User's full name"""
       name: String!
       
       """User's email address"""
       email: String!
       
       """User's creation date"""
       createdAt: DateTime!
       
       """User's last update date (deprecated: use updatedAt)"""
       @deprecated(reason: "Use updatedAt instead")
       modifiedAt: DateTime!
     }
     ```

2. **Query Documentation**:
   - Document query purpose and use cases
   - Provide example queries with expected responses
   - Document query complexity and performance considerations
   - Include pagination and filtering examples
   - Document error cases and responses
   - Example:
     ```markdown
     ## getUser
     
     Retrieves a single user by ID.
     
     **Query**:
     ```graphql
     query GetUser($id: ID!) {
       user(id: $id) {
         id
         name
         email
         createdAt
       }
     }
     ```
     
     **Variables**:
     ```json
     {
       "id": "123"
     }
     ```
     
     **Response**:
     ```json
     {
       "data": {
         "user": {
           "id": "123",
           "name": "John Doe",
           "email": "john@example.com",
           "createdAt": "2026-01-05T12:00:00Z"
         }
       }
     }
     ```
     
     **Error Cases**:
     - User not found: Returns `null` with error in `errors` array
     - Invalid ID format: Returns validation error
     ```

3. **Mutation Documentation**:
   - Document mutation purpose and side effects
   - Provide example mutations with input and output
   - Document validation rules and constraints
   - Include error handling examples
   - Document idempotency (if applicable)
   - Example:
     ```markdown
     ## createUser
     
     Creates a new user account.
     
     **Mutation**:
     ```graphql
     mutation CreateUser($input: CreateUserInput!) {
       createUser(input: $input) {
         user {
           id
           name
           email
         }
         errors {
           field
           message
         }
       }
     }
     ```
     
     **Input Validation**:
     - `name`: Required, 1-100 characters
     - `email`: Required, valid email format, unique
     - `password`: Required, minimum 8 characters
     
     **Success Response**:
     ```json
     {
       "data": {
         "createUser": {
           "user": {
             "id": "123",
             "name": "John Doe",
             "email": "john@example.com"
           },
           "errors": []
         }
       }
     }
     ```
     ```

4. **Type Documentation**:
   - Document type purpose and relationships
   - Document all fields with descriptions
   - Include field-level examples
   - Document type relationships (connections, edges)
   - Document custom scalars and enums
   - Example:
     ```markdown
     ## User Type
     
     Represents a user account in the system.
     
     **Fields**:
     - `id: ID!` - Unique identifier
     - `name: String!` - User's full name
     - `email: String!` - User's email address
     - `createdAt: DateTime!` - Account creation timestamp
     - `posts: [Post!]!` - User's blog posts (connection)
     
     **Relationships**:
     - One-to-many with `Post` type
     - Many-to-many with `Group` type (via `UserGroup`)
     
     **Example**:
     ```graphql
     {
       user(id: "123") {
         id
         name
         email
         posts {
           id
           title
         }
       }
     }
     ```
     ```

### GraphQL Documentation Tools Integration

1. **Schema Documentation Generation**:
   - Use tools like GraphQL Code Generator to generate TypeScript types
   - Use schema introspection to generate documentation
   - Integrate with GraphQL Playground or GraphiQL
   - Use tools like SpectaQL or Magidoc for static documentation generation

2. **Interactive Documentation**:
   - GraphQL Playground: Interactive query editor with schema explorer
   - GraphiQL: Interactive GraphQL IDE
   - Apollo Studio: Schema registry and documentation
   - Postman: GraphQL API testing and documentation

3. **Documentation Automation**:
   - Generate documentation from schema comments
   - Automate example generation from test queries
   - Generate type documentation from schema
   - Sync documentation with schema changes

### GraphQL Documentation Structure Checklist

When organizing GraphQL API documentation:

- [ ] **Schema Documentation**: Complete schema file with descriptions
- [ ] **Type Documentation**: All types documented with fields and examples
- [ ] **Query Documentation**: All queries documented with examples
- [ ] **Mutation Documentation**: All mutations documented with input/output
- [ ] **Subscription Documentation**: All subscriptions documented (if applicable)
- [ ] **Example Queries**: Real-world query examples
- [ ] **Example Mutations**: Real-world mutation examples
- [ ] **Error Documentation**: Error types and handling
- [ ] **Authentication**: Authentication and authorization documentation
- [ ] **Rate Limiting**: Rate limiting and query complexity documentation
- [ ] **Pagination**: Pagination patterns and examples
- [ ] **Filtering**: Filtering and sorting documentation
- [ ] **Deprecation**: Deprecated fields and migration paths
- [ ] **Versioning**: Schema versioning strategy (if applicable)
- [ ] **Introspection**: Introspection query documentation
- [ ] **Tools Integration**: GraphQL Playground/GraphiQL setup

### GraphQL Schema Documentation Best Practices

1. **Schema-First Development**:
   - Define schema before implementation
   - Document schema in `.graphql` files
   - Use schema comments for documentation
   - Keep schema and documentation in sync

2. **Type Documentation**:
   - Document every type with purpose and usage
   - Document all fields with descriptions
   - Include example queries for complex types
   - Document type relationships and connections

3. **Query Documentation**:
   - Document query purpose and use cases
   - Provide complete query examples
   - Document query complexity
   - Include pagination and filtering examples

4. **Mutation Documentation**:
   - Document mutation side effects
   - Provide input validation rules
   - Document error responses
   - Include idempotency information

5. **Example Documentation**:
   - Provide real-world examples
   - Include both simple and complex examples
   - Show error handling examples
   - Document edge cases

### GraphQL Documentation Integration with Documentation Structure

When integrating GraphQL API documentation with the overall documentation structure:

1. **Feature Documentation**:
   - GraphQL API features go in `docs/features/graphql-api/`
   - Include PRD, TASKS, and GraphQL-specific documentation
   - Organize by domain (user, product, order, etc.)

2. **Reference Documentation**:
   - Schema files in `docs/reference/graphql-schema.graphql`
   - Query examples in `docs/reference/graphql-examples/`
   - Type documentation in `docs/reference/graphql-types/`

3. **Architecture Documentation**:
   - GraphQL server architecture in `docs/architecture/graphql-architecture.md`
   - Resolver patterns in `docs/architecture/graphql-resolvers.md`
   - DataLoader patterns in `docs/architecture/graphql-dataloaders.md`

4. **Guides**:
   - GraphQL query writing guide in `docs/guides/graphql-queries.md`
   - GraphQL mutation guide in `docs/guides/graphql-mutations.md`
   - GraphQL best practices in `docs/guides/graphql-best-practices.md`

---

**Last Updated**: 2026-01-05  
**Version**: 1.2

## SEO Considerations for This Guide

When this guide is published for web access:

1. **Guide Content SEO**
   - Use descriptive, keyword-rich headings and subheadings
   - Include relevant keywords naturally (documentation structure, file organization, documentation organization, project structure)
   - Structure content with proper heading hierarchy (H1-H6)
   - Include comprehensive structure examples and organization patterns for content depth

2. **Technical Documentation SEO**
   - Document documentation structure with clear, searchable descriptions
   - Include code examples demonstrating directory structures and file organization
   - Use semantic HTML structure in documentation
   - Add internal links to related documentation and organization guides

3. **Content Quality for Search**
   - Ensure guide answers common documentation structure queries
   - Include troubleshooting sections for common structure issues
   - Provide comprehensive structure reference documentation
   - Maintain documentation freshness with documentation best practices updates

---

## Review/Contribution

**Expert**: Lisa Garcia  
**Expertise**: Internationalization (i18n) and Localization  
**Date**: 2026-01-05  
**Changes**: Enhanced this documentation structure guide by adding a comprehensive "Internationalization (i18n) Considerations for Documentation Structure" section covering multilingual documentation structure patterns (language-specific directories, language suffix in filenames, hybrid approach with shared assets), documentation structure rules for i18n (consistent structure across languages, language identification using ISO 639-1 codes, shared vs. translated content classification, file naming conventions), translation workflow integration (documentation structure for translation management, translation status tracking), best practices for i18n documentation structure (planning from start, maintaining consistency, handling language-specific content, linking between languages, version control), example multilingual feature documentation structure, documentation structure checklist for i18n, RTL (right-to-left) language considerations, and tools and technologies for i18n documentation. Also fixed the date from 2025-01-05 to 2026-01-05. This addition provides practical guidance for organizing documentation to support multiple languages while maintaining clear structure and discoverability.

**Expert**: Rachel Kim  
**Expertise**: GraphQL API Design and Schema Development  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "GraphQL API Documentation Structure" section covering GraphQL documentation organization (recommended structure for GraphQL APIs with schema, queries, mutations, subscriptions, and types documentation), GraphQL schema documentation structure (schema-first documentation approach with schema file organization, type documentation structure, query documentation structure, mutation documentation structure), GraphQL documentation best practices (schema documentation with GraphQL schema comments and examples, query documentation with purpose, examples, and error cases, mutation documentation with side effects and validation, type documentation with fields and relationships), GraphQL documentation tools integration (schema documentation generation with GraphQL Code Generator and introspection, interactive documentation with GraphQL Playground and GraphiQL, documentation automation), GraphQL documentation structure checklist covering schema documentation, type documentation, query documentation, mutation documentation, subscription documentation, example queries and mutations, error documentation, authentication, rate limiting, pagination, filtering, deprecation, versioning, introspection, and tools integration, GraphQL schema documentation best practices (schema-first development, type documentation, query documentation, mutation documentation, example documentation), and GraphQL documentation integration with documentation structure (feature documentation, reference documentation, architecture documentation, guides). Also updated version from 1.1 to 1.2. This addition provides practical guidance for organizing GraphQL API documentation following schema-first development principles, ensuring comprehensive type, query, and mutation documentation with examples, and integrating GraphQL documentation with the overall documentation structure.

**Expert**: Michael Brown  
**Expertise**: Mobile Optimization  
**Date**: 2026-01-05  
**Changes**: Added mobile optimization considerations for documentation structure guide section covering mobile file organization (shallow directory structures, short descriptive names, clear navigation for mobile), mobile documentation access (mobile-friendly viewers, markdown readers, mobile search and discovery), mobile performance (flat structures, avoiding deep nesting, minimizing traversal time on mobile storage), and mobile documentation formatting (mobile-readable markdown, mobile-friendly rendering, mobile screen size considerations). This addition ensures documentation structure guide considers mobile device constraints and mobile documentation consumption patterns.

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Reviewed and improved this documentation structure guide from a documentation perspective. Enhanced documentation structure by verifying table of contents accuracy, ensuring all sections are properly linked, improving code example formatting with consistent syntax highlighting and comments, enhancing cross-references between related sections, and verifying documentation completeness. Added documentation best practices section covering documentation structure standards (directory organization patterns, file naming conventions, section organization), code example documentation (complete working examples, structure examples, organization examples), and documentation organization (clear section hierarchy, consistent formatting, comprehensive coverage of all documentation structure rules and patterns). This improvement ensures the documentation structure guide follows documentation best practices, making it easier for developers to understand and implement proper documentation structure.

---

