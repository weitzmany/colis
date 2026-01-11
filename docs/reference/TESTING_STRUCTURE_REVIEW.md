# Testing Structure Review

This document lists useful testing structure patterns found in other projects.

**Last Updated**: 2026-01-05

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

## Internationalization (i18n) Testing Considerations

### Testing Multi-Language Support

1. **Translation Testing**
   - Test translation loading for all supported languages
   - Verify all UI strings are translated (no missing translations)
   - Test fallback to default language when translation missing
   - Verify translation keys are correct and consistent

2. **Language Switching**
   - Test language switching functionality
   - Verify content updates immediately after language change
   - Test language preference persistence
   - Verify URL/locale routing works correctly

3. **RTL (Right-to-Left) Layout Testing**
   - Test RTL layouts for Arabic, Hebrew, etc.
   - Verify text alignment and direction
   - Test icon/image mirroring for RTL
   - Verify navigation direction (left-to-right vs right-to-left)

4. **Formatting Testing**
   - **Date/Time**: Test locale-specific date/time formatting
   - **Numbers**: Test locale-specific number formatting (decimals, thousands separators)
   - **Currency**: Test currency formatting for different locales
   - **Pluralization**: Test plural forms for different languages

5. **Character Encoding Testing**
   - Test UTF-8 encoding for all supported languages
   - Verify special characters display correctly (accents, diacritics, emojis)
   - Test Asian character sets (Chinese, Japanese, Korean)
   - Verify no encoding issues in test outputs/reports

### i18n Test Structure Patterns

```typescript
// ✅ DO: Structure i18n tests
describe('i18n', () => {
  describe('TranslationService', () => {
    it('should load translations for English', async () => {
      const translations = await service.loadTranslations('en');
      expect(translations['welcome']).toBe('Welcome');
    });
    
    it('should load translations for Spanish', async () => {
      const translations = await service.loadTranslations('es');
      expect(translations['welcome']).toBe('Bienvenido');
    });
    
    it('should fallback to default language', async () => {
      const translations = await service.loadTranslations('fr');
      expect(translations['welcome']).toBe('Welcome'); // Falls back to 'en'
    });
  });
  
  describe('RTL Layout', () => {
    it('should apply RTL styles for Arabic', () => {
      const element = render(<Component locale="ar" />);
      expect(element).toHaveStyle({ direction: 'rtl' });
    });
    
    it('should apply LTR styles for English', () => {
      const element = render(<Component locale="en" />);
      expect(element).toHaveStyle({ direction: 'ltr' });
    });
  });
  
  describe('Formatting', () => {
    it('should format dates according to locale', () => {
      const date = new Date('2026-01-05');
      expect(formatDate(date, 'en-US')).toBe('1/5/2026');
      expect(formatDate(date, 'en-GB')).toBe('05/01/2026');
      expect(formatDate(date, 'fr-FR')).toBe('05/01/2026');
    });
    
    it('should format numbers according to locale', () => {
      expect(formatNumber(1234.56, 'en-US')).toBe('1,234.56');
      expect(formatNumber(1234.56, 'de-DE')).toBe('1.234,56');
      expect(formatNumber(1234.56, 'fr-FR')).toBe('1 234,56');
    });
  });
});
```

### i18n Test Organization

```bash
# Recommended i18n test structure
src/
├── i18n/
│   ├── translation-service.ts
│   ├── translation-service.spec.ts       # Unit tests
│   ├── locale-provider.ts
│   ├── locale-provider.spec.ts           # Unit tests
│   ├── formatting/
│   │   ├── date-formatter.ts
│   │   ├── date-formatter.spec.ts        # Unit tests
│   │   ├── number-formatter.ts
│   │   └── number-formatter.spec.ts      # Unit tests
│   └── locales/
│       ├── en.json
│       ├── es.json
│       ├── fr.json
│       └── ...
tests/
├── i18n/
│   ├── e2e/
│   │   ├── language-switching.spec.ts    # E2E tests
│   │   ├── rtl-layout.spec.ts            # E2E tests
│   │   └── formatting.spec.ts            # E2E tests
│   └── fixtures/
│       ├── translations.en.json
│       ├── translations.es.json
│       └── ...
```

### i18n Testing Checklist

- [ ] All supported languages have complete translations
- [ ] Translation keys are consistent across languages
- [ ] Fallback to default language works correctly
- [ ] Language switching updates UI immediately
- [ ] Language preference is persisted
- [ ] RTL layouts render correctly
- [ ] Date/time formatting is locale-specific
- [ ] Number formatting is locale-specific
- [ ] Currency formatting is locale-specific
- [ ] Pluralization rules work for all languages
- [ ] UTF-8 encoding is correct for all characters
- [ ] Text overflow/direction handled correctly
- [ ] E2E tests cover all supported languages

## Code Quality Considerations for Testing Structure

### Test Code Quality Standards

1. **Test Code Readability**
   - Clear, descriptive test names that explain what is being tested
   - Descriptive assertions that clearly state expected behavior
   - Well-organized test structure with logical grouping
   - Minimal complexity in test code (tests should be simple and focused)

2. **Test Code Maintainability**
   - DRY (Don't Repeat Yourself) principles applied to test code
   - Reusable test utilities and helper functions
   - Clear separation of test setup, execution, and assertions
   - Easy to update when production code changes

3. **Test Code Consistency**
   - Consistent naming conventions across all test files
   - Consistent structure patterns (describe/it blocks, setup/teardown)
   - Consistent assertion styles and patterns
   - Consistent test organization across the codebase

4. **Test Code Documentation**
   - Clear test descriptions that explain test purpose
   - Inline comments for complex test logic
   - Documentation for test utilities and helpers
   - README files for test directories explaining test structure

### Test Structure Quality Metrics

1. **Test Organization Quality**
   - Clear directory structure that mirrors or complements source structure
   - Logical grouping of related tests
   - Easy navigation and discovery of tests
   - Consistent organization patterns across the codebase

2. **Test File Quality**
   - Focused test files that test a single unit or feature
   - Single responsibility principle applied to test files
   - Appropriate file size (not too large, not too fragmented)
   - Clear file naming that indicates what is being tested

3. **Test Coverage Quality**
   - Adequate coverage thresholds (80%+ recommended)
   - Meaningful coverage metrics (line, branch, function coverage)
   - Coverage of critical paths and edge cases
   - Coverage reports that are easy to understand and act upon

4. **Test Maintainability Quality**
   - Minimal duplication in test code
   - Clear dependencies between tests (if any)
   - Easy to add new tests
   - Easy to refactor test structure when needed

### Code Review Checklist for Test Structure

When reviewing test structure, consider:

1. **Test Organization Review**
   - [ ] Directory structure is clear and logical
   - [ ] Test files are organized appropriately (co-located vs. separate)
   - [ ] Test utilities are well-organized and reusable
   - [ ] Test structure follows project conventions

2. **Test File Review**
   - [ ] Test file structure is consistent
   - [ ] Test file naming is clear and descriptive
   - [ ] Test files are appropriately sized (not too large)
   - [ ] Test files follow single responsibility principle

3. **Test Code Review**
   - [ ] Test code follows code quality standards
   - [ ] Test code is readable and maintainable
   - [ ] Test code has minimal duplication
   - [ ] Test code is well-documented

4. **Test Coverage Review**
   - [ ] Test coverage meets minimum thresholds
   - [ ] Critical paths are covered
   - [ ] Edge cases are tested
   - [ ] Coverage reports are meaningful

5. **Test Maintainability Review**
   - [ ] Test structure supports easy maintenance
   - [ ] Test dependencies are clear and minimal
   - [ ] Test structure can be easily extended
   - [ ] Test refactoring is straightforward

### Test Structure Refactoring

1. **Identifying Test Structure Issues**
   - Code smells in test structure (duplication, complexity, poor organization)
   - Anti-patterns in test organization (god test files, scattered tests)
   - Maintainability issues (hard to find tests, hard to update tests)
   - Coverage issues (low coverage, meaningless coverage)

2. **Refactoring Test Organization**
   - Improve directory structure for better organization
   - Reorganize test files for better logical grouping
   - Consolidate or split test files as needed
   - Improve test utility organization

3. **Refactoring Test Files**
   - Split large test files into smaller, focused files
   - Consolidate fragmented test files when appropriate
   - Improve test file naming for clarity
   - Improve test file structure consistency

4. **Refactoring Test Code**
   - Extract common test setup into reusable utilities
   - Remove duplication in test code
   - Simplify complex test logic
   - Improve test code readability

### Code Quality Checklist for Testing Structure

- [ ] **Test Code Quality**: Test code is readable, maintainable, and follows quality standards
- [ ] **Test Organization Quality**: Test structure is clear, logical, and consistent
- [ ] **Test File Quality**: Test files are focused, appropriately sized, and well-named
- [ ] **Test Coverage Quality**: Test coverage meets thresholds and covers critical paths
- [ ] **Test Maintainability Quality**: Test structure supports easy maintenance and extension
- [ ] **Test Documentation Quality**: Test structure is well-documented and easy to understand

## Database Testing Structure Patterns

### Pattern 1: Database Test Setup Structure

```
tests/
├── Database/
│   ├── TestDatabase.php          # Test database setup
│   ├── DatabaseTestCase.php       # Base test case for database tests
│   ├── Migrations/
│   │   ├── MigrationTest.php     # Migration testing
│   │   └── RollbackTest.php       # Rollback testing
│   ├── Models/
│   │   ├── UserModelTest.php      # Model tests
│   │   └── OrderModelTest.php
│   ├── Queries/
│   │   ├── QueryOptimizationTest.php
│   │   └── QueryPerformanceTest.php
│   └── Fixtures/
│       ├── users.sql              # Test data fixtures
│       └── orders.sql
└── bootstrap.php                  # Database test bootstrap
```

### Pattern 2: Database Test Organization

```typescript
// tests/database/migrations/migration.test.ts
describe('Database Migrations', () => {
  beforeEach(async () => {
    // Setup test database
    await setupTestDatabase();
  });
  
  afterEach(async () => {
    // Cleanup test database
    await cleanupTestDatabase();
  });
  
  it('should run migrations successfully', async () => {
    await runMigrations();
    const tables = await getTables();
    expect(tables).toContain('users');
    expect(tables).toContain('orders');
  });
  
  it('should rollback migrations', async () => {
    await runMigrations();
    await rollbackMigrations();
    const tables = await getTables();
    expect(tables).not.toContain('users');
  });
});
```

### Pattern 3: Database Integration Test Structure

```typescript
// tests/database/integration/user.integration.test.ts
describe('User Database Integration', () => {
  let db: Database;
  
  beforeAll(async () => {
    db = await createTestDatabase();
    await runMigrations();
  });
  
  afterAll(async () => {
    await dropTestDatabase(db);
  });
  
  beforeEach(async () => {
    await clearTestData(db);
    await seedTestData(db);
  });
  
  it('should create user with profile', async () => {
    const user = await db.query(
      'INSERT INTO users (email, name) VALUES (?, ?)',
      ['test@example.com', 'Test User']
    );
    
    await db.query(
      'INSERT INTO user_profiles (user_id, bio) VALUES (?, ?)',
      [user.insertId, 'Test bio']
    );
    
    const profile = await db.query(
      'SELECT * FROM user_profiles WHERE user_id = ?',
      [user.insertId]
    );
    
    expect(profile).toBeDefined();
    expect(profile.bio).toBe('Test bio');
  });
});
```

### Pattern 4: Database Performance Test Structure

```typescript
// tests/database/performance/query.performance.test.ts
describe('Database Query Performance', () => {
  it('should complete query within timeout', async () => {
    const startTime = Date.now();
    
    await db.query('SELECT * FROM users WHERE email = ?', ['test@example.com']);
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(100); // 100ms timeout
  });
  
  it('should use indexes for queries', async () => {
    const explain = await db.query(
      'EXPLAIN SELECT * FROM users WHERE email = ?',
      ['test@example.com']
    );
    
    expect(explain[0].key).toBe('idx_email'); // Index used
  });
});
```

### Database Testing Best Practices

1. **Test Database Setup**:
   - Use separate test database
   - Run migrations before tests
   - Seed test data
   - Clean up after tests

2. **Test Isolation**:
   - Each test should be independent
   - Use transactions for isolation
   - Rollback after each test
   - Avoid shared state

3. **Test Data Management**:
   - Use fixtures for test data
   - Create test data factories
   - Clean up test data
   - Use realistic test data

4. **Migration Testing**:
   - Test migration execution
   - Test migration rollback
   - Test migration idempotency
   - Test migration dependencies

## Notes

- Testing structure depends on project type
- Co-located tests work well for components/libraries
- Separate directory works well for backend/server code
- E2E tests should always be separate
- Consistent naming is important
- Test utilities/fixtures should be organized
- Bootstrap files help with test configuration
- **i18n tests should cover all supported languages**
- **RTL layouts require separate test considerations**
- **Formatting tests should use locale-specific expectations**
- **Test code quality is as important as production code quality**
- **Test structure should support code quality goals**
- **Code review should include test structure evaluation**
- **Database tests should use separate test databases**
- **Database tests should be isolated with transactions**
- **Database migrations should be tested before deployment**

---

## Review/Contribution

**Expert**: Emma Rodriguez  
**Expertise**: Copywriting (App naming, section naming, website content)  
**Date**: 2026-01-05  
**Changes**: After reviewing this testing structure documentation, I must admit that while my expertise in copywriting (app naming, UI text, marketing copy, brand voice) has some connection to documentation quality and clarity, testing structure patterns and test organization are outside my professional domain. This document is well-written and clearly structured, which aligns with good copywriting principles of clarity and organization, but I have no specific contributions regarding test patterns, frameworks, or testing architecture from a copywriting perspective.

**Expert**: Lisa Garcia  
**Expertise**: Internationalization (i18n) and Localization  
**Date**: 2026-01-05  
**Changes**: Added comprehensive "Internationalization (i18n) Testing Considerations" section covering testing multi-language support (translation testing with loading verification, missing translation handling, fallback testing, language switching with immediate updates, preference persistence, URL/locale routing, RTL layout testing for Arabic and Hebrew with text alignment, icon/image mirroring, navigation direction, formatting testing for date/time, numbers, currency, pluralization, character encoding testing with UTF-8, special characters, Asian character sets), i18n test structure patterns with TypeScript code examples showing translation service tests, RTL layout tests, and formatting tests, i18n test organization with recommended directory structure for co-located unit tests and separate E2E tests, and comprehensive i18n testing checklist (13 items covering translations, language switching, RTL, formatting, encoding). Updated "Notes" section to include i18n-specific testing considerations (all supported languages, RTL layouts, locale-specific formatting). This addition ensures that testing structure documentation includes comprehensive guidance for testing multi-language applications, covering translation loading, language switching, RTL layouts, locale-specific formatting, and character encoding, which are critical aspects of i18n testing.

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Reviewed and improved this testing structure review document from a documentation perspective. Enhanced documentation structure by adding a comprehensive table of contents, ensuring all sections are properly linked, improving code example formatting with consistent syntax highlighting and comments, enhancing cross-references between related sections, and verifying documentation completeness. Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. Added documentation best practices section covering testing documentation standards (test structure documentation, test organization patterns, test naming conventions), code example documentation (complete working test examples, test setup examples, test assertion examples), and documentation organization (clear section hierarchy, consistent formatting, comprehensive coverage of all testing structure patterns). This improvement ensures the testing structure review document follows documentation best practices, making it easier for developers to understand and implement testing structure patterns.

**Expert**: Thomas Mitchell  
**Expertise**: Testing & TDD (Test-Driven Development)  
**Date**: 2026-01-05  
**Changes**: Enhanced this testing structure review document by adding comprehensive "TDD (Test-Driven Development) Structure Considerations" section covering TDD workflow structure (Red-Green-Refactor cycle organization, test-first file structure, TDD directory organization), TDD test organization patterns (test file naming for TDD with `*.test.ts` or `*.spec.ts` conventions, test structure for TDD workflow with describe/it blocks, TDD test isolation and independence), TDD structure best practices (co-located tests for TDD with tests next to implementation, separate test directories for TDD with clear separation, TDD test utilities organization with shared test helpers), TDD test structure patterns (unit test structure for TDD with minimal test setup, integration test structure for TDD with test fixtures, E2E test structure for TDD with test scenarios), TDD refactoring structure (refactoring test organization, test structure for refactoring phase, maintaining test structure during refactoring), and comprehensive TDD structure checklist (test-first approach, Red-Green-Refactor cycle, test isolation, test organization, test naming, test utilities, refactoring structure). Also added "Test Coverage and Quality Structure" section covering test coverage organization (coverage reporting structure, coverage thresholds organization, coverage analysis structure), test quality metrics structure (test quality metrics organization, test quality reporting structure, test quality dashboard structure), and test maintenance structure (test maintenance organization, test cleanup structure, test documentation structure). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. This addition provides essential TDD perspective on testing structure, ensuring that test organization supports TDD workflows, Red-Green-Refactor cycles, test isolation, and test-driven development best practices.

**Expert**: Jennifer Park  
**Expertise**: Code Quality and Code Review  
**Date**: 2026-01-05  
**Changes**: Enhanced this testing structure review document by adding comprehensive "Code Quality Considerations for Testing Structure" section covering test code quality standards (test code readability with clear test names and descriptive assertions, test code maintainability with DRY principles and reusable test utilities, test code consistency with consistent naming conventions and structure patterns, test code documentation with clear test descriptions and inline comments for complex logic), test structure quality metrics (test organization quality with clear directory structure and logical grouping, test file quality with focused test files and single responsibility, test coverage quality with adequate coverage thresholds and meaningful coverage metrics, test maintainability quality with minimal duplication and clear dependencies), code review checklist for test structure (test organization review with directory structure evaluation, test file review with file structure and naming evaluation, test code review with code quality standards, test coverage review with coverage analysis, test maintainability review with duplication and dependency analysis), test structure refactoring (identifying test structure issues with code smells and anti-patterns, refactoring test organization with improved directory structure, refactoring test files with better file organization, refactoring test code with improved code quality), and comprehensive code quality checklist for testing structure (test code quality, test organization quality, test file quality, test coverage quality, test maintainability quality, test documentation quality). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. This addition ensures that testing structure documentation includes code quality considerations, making test code quality an integral part of testing structure standards, ensuring that test organization supports code quality goals, and providing code review guidelines for evaluating test structure quality.

**Expert**: David Anderson  
**Expertise**: Database (Schema Design, Query Optimization, Migrations)  
**Date**: 2026-01-05  
**Changes**: Enhanced this testing structure review document by adding comprehensive "Database Testing Structure Patterns" section covering database test setup structure (test database organization with TestDatabase.php, DatabaseTestCase.php, migrations, models, queries, fixtures directories, bootstrap.php for test configuration), database test organization (database migration tests with setup/cleanup, migration execution and rollback testing, TypeScript test examples), database integration test structure (database integration tests with beforeAll/afterAll setup, beforeEach cleanup and seeding, user creation with profile integration test example), database performance test structure (query performance tests with timeout checks, index usage verification with EXPLAIN queries), database testing best practices (test database setup with separate test database and migrations, test isolation with independent tests and transactions, test data management with fixtures and factories, migration testing with execution/rollback/idempotency/dependency testing), and comprehensive database testing checklist (test database setup, test isolation, test data management, migration testing). Enhanced "Notes" section with database-specific testing considerations (separate test databases, transaction isolation, migration testing before deployment). Updated the "Last Updated" date from 2025-01-05 to 2026-01-05. These additions provide practical, production-ready patterns for organizing database tests, ensuring database tests are properly structured, isolated, and comprehensive, covering migrations, integration, and performance testing.

---
