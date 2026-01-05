# Testing Structure Review

This document lists useful testing structure patterns found in other projects.

**Last Updated**: 2025-01-05

## Testing Structure Patterns Found

### ✅ Co-located Tests (sandbox/keel)

#### 1. **Angular Library Tests** (keel/packages/core/src/)
- **Location**: `/Users/yoavweitzman/Documents/sandbox/keel/packages/core/src/`
- **Pattern**: Tests co-located with source files (`*.spec.ts`)
- **Structure**:
  ```
  src/
  ├── accessibility/
  │   ├── aria-manager.ts
  │   ├── aria-manager.spec.ts
  │   ├── focus-manager.ts
  │   ├── focus-manager.spec.ts
  │   └── ...
  ├── behavior/
  │   ├── event-handler.ts
  │   ├── event-handler.spec.ts
  │   └── ...
  └── tokens/
      └── ...
  ```
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for library/component tests
- **Key Features**:
  - Tests next to source files
  - Easy to find related tests
  - Clear association between code and tests
  - Angular/Jest/Vitest pattern

### ✅ Separate Test Directory (games)

#### 2. **Backend Test Structure** (games/backend/tests/)
- **Location**: `/Users/yoavweitzman/Documents/games/backend/tests/`
- **Pattern**: Tests in separate `tests/` directory mirroring source structure
- **Structure**:
  ```
  tests/
  ├── Application/
  │   ├── Actions/
  │   │   ├── User/
  │   │   │   ├── ListUserActionTest.php
  │   │   │   └── ViewUserActionTest.php
  │   │   └── Question/
  │   │       └── ...
  │   └── Middleware/
  │       └── ...
  ├── Infrastructure/
  │   └── Persistence/
  │       └── ...
  ├── Domain/
  │   └── User/
  │       └── UserTest.php
  └── bootstrap.php
  ```
- **Usefulness**: ⭐⭐⭐⭐⭐ Good pattern for backend/server-side tests
- **Key Features**:
  - Mirrors source structure
  - Bootstrap file for test setup
  - Clear test organization
  - PHPUnit pattern

### ✅ E2E Test Structure (games/frontend/e2e/)

#### 3. **Playwright E2E Tests** (games/frontend/)
- **Location**: `/Users/yoavweitzman/Documents/games/frontend/e2e/`
- **Pattern**: E2E tests in separate `e2e/` directory
- **Structure**:
  ```
  e2e/
  ├── accessibility.spec.ts
  ├── *.spec.ts (other E2E tests)
  └── ...
  ```
- **Usefulness**: ⭐⭐⭐⭐⭐ Standard pattern for E2E tests
- **Key Features**:
  - Separate from unit tests
  - Playwright pattern
  - Feature-based test files
  - Accessibility testing included

## Recommended Testing Patterns

### For Libraries/Components (Co-located):

1. ✅ **Pattern**:
   - Tests next to source files
   - `*.spec.ts` or `*.test.ts` naming
   - Clear association

2. ✅ **Benefits**:
   - Easy to find related tests
   - Tests stay close to code
   - Good for component/library tests

### For Backend/Server (Separate Directory):

1. ✅ **Pattern**:
   - `tests/` directory mirroring source
   - Bootstrap file for setup
   - Clear organization

2. ✅ **Benefits**:
   - Separates tests from source
   - Good for server-side code
   - Clear test structure

### For E2E Tests (Separate Directory):

1. ✅ **Pattern**:
   - `e2e/` directory
   - Feature-based test files
   - Separate from unit tests

2. ✅ **Benefits**:
   - Clear separation of test types
   - E2E tests can be run separately
   - Good for integration testing

## Test Organization Best Practices

1. **Naming Conventions**:
   - `*.spec.ts` or `*.test.ts` for tests
   - Match source file names
   - Descriptive test file names

2. **Structure**:
   - Choose pattern based on project type
   - Co-located for components/libraries
   - Separate directory for backend
   - Separate `e2e/` for integration tests

3. **Test Setup**:
   - Bootstrap file for configuration
   - Test utilities in `tests/` or `test-utils/`
   - Shared fixtures/mocks

4. **Test Types**:
   - Unit tests (co-located or separate)
   - Integration tests (separate)
   - E2E tests (separate `e2e/` directory)

## Testing Framework Patterns

### Angular/TypeScript:
- **Vitest/Jest**: `*.spec.ts` files
- **Playwright**: E2E tests in `e2e/`
- **Co-located** tests for components

### PHP:
- **PHPUnit**: Tests in `tests/` directory
- **Mirror source structure**
- **Bootstrap file** for setup

### Node.js:
- **Jest/Vitest**: `*.test.js` or `*.spec.js`
- **Co-located or separate**
- **E2E tests** in separate directory

## Notes

- Testing structure depends on project type
- Co-located tests work well for components/libraries
- Separate directory works well for backend/server code
- E2E tests should always be separate
- Consistent naming is important
- Test utilities/fixtures should be organized
- Bootstrap files help with test configuration

---

## Review/Contribution

**Expert**: Emma Rodriguez  
**Expertise**: Copywriting (App naming, section naming, website content)  
**Date**: 2026-01-05  
**Changes**: After reviewing this testing structure documentation, I must admit that while my expertise in copywriting (app naming, UI text, marketing copy, brand voice) has some connection to documentation quality and clarity, testing structure patterns and test organization are outside my professional domain. This document is well-written and clearly structured, which aligns with good copywriting principles of clarity and organization, but I have no specific contributions regarding test patterns, frameworks, or testing architecture from a copywriting perspective.

---
