# Technical: Search System

## Overview

Client-side full-text search system using MiniSearch library. Provides fast (<100ms), offline search across all documentation content.

---

## Search Architecture

```
Search Query → MiniSearch → Ranked Results → UI Display
```

---

## MiniSearch Configuration

### Library Choice

**MiniSearch**: Lightweight, client-side full-text search
- **Bundle Size**: ~10KB gzipped
- **Performance**: <100ms search speed
- **Features**: Fuzzy matching, prefix matching, field boosting
- **Offline**: Works without backend

### Index Configuration

```typescript
import MiniSearch from 'minisearch';

const searchIndex = new MiniSearch({
  // Fields to index for search
  fields: ['title', 'description', 'content'],
  
  // Fields to return in results
  storeFields: ['id', 'type', 'category', 'path'],
  
  // Search options
  searchOptions: {
    boost: { 
      title: 2,         // Title matches ranked higher
      description: 1.5  // Description matches ranked medium
    },
    fuzzy: 0.2,         // Typo tolerance (20%)
    prefix: true,       // Enable prefix matching (autocomplete)
  }
});
```

---

## Search Features

### 1. Fuzzy Matching

Handles typos automatically:
- "packge" → "package"
- "taks-master" → "task-master"
- Tolerance: 20% (configurable)

### 2. Prefix Matching

Autocomplete as you type:
- "pack" → matches "package", "package-catalog"
- "task" → matches "task-master", "tasks"

### 3. Field Boosting

Prioritize matches by field:
- **Title matches**: 2x weight
- **Description matches**: 1.5x weight
- **Content matches**: 1x weight

### 4. Type Filtering

Filter results by type:
- Packages
- CLI Commands
- Cursor Commands
- Documentation

### 5. Relevance Ranking

Results sorted by:
1. Field weight (title > description > content)
2. Match quality (exact > prefix > fuzzy)
3. Term frequency

---

## Implementation

### Search Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import MiniSearch from 'minisearch';
import searchIndexData from '@/data/search-index.json';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searchIndex, setSearchIndex] = useState<MiniSearch | null>(null);

  useEffect(() => {
    // Load search index on mount
    const index = MiniSearch.loadJSON(JSON.stringify(searchIndexData), {
      fields: ['title', 'description', 'content'],
      storeFields: ['id', 'type', 'category'],
    });
    setSearchIndex(index);
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!searchIndex || !q) {
      setResults([]);
      return;
    }
    
    // Perform search
    const searchResults = searchIndex.search(q, {
      boost: { title: 2, description: 1.5 },
      fuzzy: 0.2,
      prefix: true,
    });
    
    setResults(searchResults);
  };

  return (
    <input
      type="search"
      value={query}
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search packages, commands, docs..."
    />
  );
}
```

---

## Performance Optimization

### 1. Debouncing

Debounce search input to reduce unnecessary searches:
```typescript
const debouncedSearch = debounce(handleSearch, 150); // 150ms delay
```

### 2. Result Limiting

Limit displayed results to prevent UI slowdown:
```typescript
const displayResults = results.slice(0, 50); // Show top 50
```

### 3. Lazy Loading

Load search index only when needed:
```typescript
// Option 1: Load on mount (faster initial search)
useEffect(() => { loadSearchIndex(); }, []);

// Option 2: Load on first search (smaller initial bundle)
const handleFirstSearch = () => {
  if (!searchIndex) {
    loadSearchIndex();
  }
  performSearch();
};
```

---

## Search Index Generation

### Build-Time Process

**Script**: `scripts/build-search-index.ts`

```typescript
import MiniSearch from 'minisearch';
import packages from './packages.json';
import commands from './commands.json';
import cursorCommands from './signals.json';

const documents = [
  ...packages.map(pkg => ({
    id: `pkg-${pkg.id}`,
    title: pkg.name,
    description: pkg.description,
    content: pkg.documentation.readme,
    type: 'package',
    category: pkg.type,
  })),
  ...commands.map(cmd => ({
    id: `cmd-${cmd.id}`,
    title: cmd.fullCommand,
    description: cmd.description,
    content: cmd.usage,
    type: 'command',
    category: cmd.category,
  })),
  // ... cursor commands
];

const searchIndex = new MiniSearch({
  fields: ['title', 'description', 'content'],
  storeFields: ['id', 'type', 'category'],
});

searchIndex.addAll(documents);

// Export as JSON
const indexData = JSON.stringify(searchIndex.toJSON());
fs.writeFileSync('src/data/search-index.json', indexData);
```

---

## Testing

### Unit Tests

- Test search with exact matches
- Test fuzzy matching with typos
- Test prefix matching
- Test field boosting
- Test type filtering

### Performance Tests

- Measure search speed with 100+ documents
- Measure index load time
- Test with large queries

---

## Success Metrics

- **Search Speed**: <100ms response time
- **Accuracy**: 90%+ relevant results
- **Coverage**: 100% of content indexed
- **Typo Handling**: 80%+ typos corrected
- **Usage**: 100% of users use search

---

**See [features/unified-search.md](../features/unified-search.md) for feature details**  
**See [ARCHITECTURE.md](../ARCHITECTURE.md) for system architecture**
