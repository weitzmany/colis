# Component Structure Patterns Review

This document lists useful component structure patterns found in other projects.

**Last Updated**: 2025-01-05

## Component Structure Patterns Found

### ✅ Angular Component Structure (games/frontend/)

#### 1. **Angular Component Organization** (games/frontend/src/app/)
- **Location**: `/Users/yoavweitzman/Documents/games/frontend/src/app/components/`
- **Pattern**: Feature-based component organization
- **Structure**:
  ```
  components/
  ├── breadcrumb/
  │   ├── breadcrumb.html
  │   ├── breadcrumb.scss
  │   ├── breadcrumb.spec.ts
  │   └── breadcrumb.ts
  ├── cta/
  │   ├── cta.component.html
  │   ├── cta.component.scss
  │   ├── cta.component.spec.ts
  │   └── cta.component.ts
  └── ...
  ```
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for Angular components
- **Key Features**:
  - One directory per component
  - Component files (`.ts`, `.html`, `.scss`, `.spec.ts`)
  - Co-located tests
  - Consistent naming
  - Feature-based organization

#### 2. **Angular Component Files** (games/frontend/)
- **Pattern**: Component with template, styles, tests
- **Structure**:
  - `component-name.component.ts` - Component class
  - `component-name.component.html` - Template
  - `component-name.component.scss` - Styles
  - `component-name.component.spec.ts` - Tests
- **Usefulness**: ⭐⭐⭐⭐⭐ Standard Angular pattern
- **Key Features**:
  - Separate files for template, styles, tests
  - Consistent naming convention
  - Co-located files
  - Clear organization

### ✅ Angular Library Component (keel/packages/)

#### 3. **Library Component Structure** (keel/packages/primitives/src/button/)
- **Location**: `/Users/yoavweitzman/Documents/sandbox/keel/packages/primitives/src/button/`
- **Pattern**: Library component with interface, README
- **Structure**:
  ```
  button/
  ├── button.component.ts
  ├── button.component.html
  ├── button.component.scss
  ├── button.component.spec.ts
  ├── button.interface.ts
  ├── index.ts
  └── README.md
  ```
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for library components
- **Key Features**:
  - Interface file for types
  - `index.ts` for public API
  - README.md for documentation
  - Complete component structure
  - Library-ready organization

### ✅ Feature-Based Organization (games/frontend/)

#### 4. **Feature Modules** (games/frontend/src/app/)
- **Pattern**: Features organized in directories
- **Structure**:
  ```
  app/
  ├── auth/
  │   ├── login/
  │   └── register/
  ├── components/
  ├── pages/
  ├── services/
  └── guards/
  ```
- **Usefulness**: ⭐⭐⭐⭐⭐ Good pattern for feature organization
- **Key Features**:
  - Feature-based directories
  - Shared components in `components/`
  - Services in `services/`
  - Guards in `guards/`
  - Pages in `pages/`

## Recommended Component Structure Patterns

### For Angular Components:

1. ✅ **File Organization**:
   - One directory per component
   - Component files (`.ts`, `.html`, `.scss`, `.spec.ts`)
   - Consistent naming (`component-name.component.*`)
   - Co-located tests

2. ✅ **Naming Conventions**:
   - `component-name.component.ts`
   - `component-name.component.html`
   - `component-name.component.scss`
   - `component-name.component.spec.ts`

3. ✅ **Directory Structure**:
   - Feature-based organization
   - Shared components in `components/`
   - Feature components in feature directories

### For Library Components:

1. ✅ **Additional Files**:
   - `component.interface.ts` - Type definitions
   - `index.ts` - Public API exports
   - `README.md` - Component documentation

2. ✅ **Structure**:
   - Complete component files
   - Interface for props/inputs
   - README for usage
   - Public API via index.ts

### For Feature Organization:

1. ✅ **Structure**:
   - Feature directories (`auth/`, `quiz/`, etc.)
   - Shared components (`components/`)
   - Services (`services/`)
   - Guards (`guards/`)
   - Pages (`pages/`)

2. ✅ **Separation**:
   - Feature-specific components in features
   - Shared components in `components/`
   - Services for business logic
   - Guards for route protection

## Component Structure Best Practices

1. **Organization**:
   - One directory per component
   - Co-located files (template, styles, tests)
   - Feature-based organization

2. **Naming**:
   - Consistent naming convention
   - Descriptive component names
   - Match file names to component names

3. **Tests**:
   - Co-located test files
   - `*.spec.ts` naming
   - Test next to source

4. **Documentation**:
   - README for library components
   - Inline comments for complex logic
   - Interface files for types

5. **Structure**:
   - Separate template and styles files
   - Clear component class
   - Public API via exports

## Notes

- Component structure patterns are framework-specific
- Angular patterns are well-established
- Library components need more files (interface, README)
- Feature-based organization scales well
- Co-located tests are preferred
- Consistent naming is important
- Documentation helps with maintenance

