# Technical: Data Extraction System

## Overview

Automated system for extracting documentation data from workspace files at build time. Parsers convert raw workspace files (package.json, bin files, .md files) into structured JSON data for the documentation hub.

---

## Architecture

```
Workspace Files → Parsers → JSON Data → Next.js Build → Static Site
```

---

## Parsers

### 1. Package Parser (`parse-packages.ts`)

**Source**: `packages/*/package.json`

**Output**: `src/data/packages.json`

**Process**:
1. Scan `packages/` directory
2. Read `package.json` from each package
3. Extract metadata (name, version, description, dependencies)
4. Determine type (CLI, library, template)
5. Parse README.md for documentation
6. Determine status (active, deprecated, experimental)

**Data Extracted**:
- Package metadata (name, version, description)
- Package type and status
- Dependencies and related packages
- Documentation (README, ARCHITECTURE, GETTING_STARTED)
- CLI commands (if applicable)

---

### 2. CLI Command Parser (`parse-cli.ts`)

**Source**: `packages/*/bin/*` and README files

**Output**: `src/data/commands.json`

**Process**:
1. Find packages with `bin` field
2. Parse bin files for command structure
3. Extract command documentation from README
4. Parse command options and examples
5. Build command hierarchy

**Data Extracted**:
- Command syntax and usage
- Command options (flags, defaults)
- Command examples
- Related commands

---

### 3. Cursor Command Parser (`parse-signals.ts`)

**Source**: `.cursor/commands/**/*.md`

**Output**: `src/data/signals.json`

**Process**:
1. Recursively scan `.cursor/commands/`
2. Parse each `.md` file
3. Extract category from folder structure
4. Extract trigger and description
5. Index for search

**Data Extracted**:
- Command trigger and name
- Category (experts, local, general)
- Description and content
- Keywords for search

---

### 4. Search Indexer (`build-search-index.ts`)

**Source**: All generated data files

**Output**: `src/data/search-index.json`

**Process**:
1. Load all data (packages, commands)
2. Create MiniSearch index
3. Configure search options (fuzzy, prefix, field weighting)
4. Generate optimized index
5. Write to JSON file

**Index Configuration**:
```typescript
const searchIndex = new MiniSearch({
  fields: ['title', 'description', 'content'],
  storeFields: ['id', 'type', 'category'],
  searchOptions: {
    boost: { title: 2, description: 1.5 },
    fuzzy: 0.2,
    prefix: true,
  }
});
```

---

## Build Process

### Development

```bash
npm run dev
# Runs data extraction, then starts Next.js dev server
```

### Production

```bash
npm run build
# 1. Run data extraction scripts
# 2. Generate search index
# 3. Build Next.js app (SSG)
# 4. Output static site to `out/`
```

### Scripts

**package.json**:
```json
{
  "scripts": {
    "extract-data": "node scripts/generate-data.ts",
    "prebuild": "npm run extract-data",
    "build": "next build",
    "dev": "npm run extract-data && next dev"
  }
}
```

---

## Error Handling

### Parser Resilience

- **Missing Fields**: Use defaults, don't fail
- **Invalid JSON**: Log error, skip file, continue
- **Missing Files**: Warn, continue with available data
- **Parse Errors**: Catch, log, continue

### Validation

- Validate data structure after parsing
- Ensure required fields exist
- Type-check with TypeScript
- Log warnings for incomplete data

---

## Performance

### Build Time

- **Target**: <2 minutes for full build
- **Optimization**: Cache parsed data when possible
- **Parallelization**: Parse files concurrently

### Output Size

- **Estimated Total**: <1MB JSON data
- **Per File**: packages.json (~500KB), commands.json (~300KB), search-index.json (~200KB)

---

## Future Enhancements

- Incremental parsing (only changed files)
- Parallel processing for large workspaces
- Caching mechanism to speed up rebuilds
- Watch mode for development

---

**See [ARCHITECTURE.md](../ARCHITECTURE.md) for complete technical architecture**
