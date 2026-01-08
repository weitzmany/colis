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

---
