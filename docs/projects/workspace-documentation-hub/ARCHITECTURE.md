# Workspace Documentation Hub - Architecture

## System Overview

The Workspace Documentation Hub is a static Next.js application that extracts documentation data from the workspace at build time and presents it through a fast, searchable interface.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                        │
├─────────────────────────────────────────────────────────┤
│              Next.js App (Frontend)                     │
│  • Package Catalog UI                                   │
│  • Command Browser UI                                   │
│  • Search UI                                            │
│  • Static Pages (SSG)                                   │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ Static Data (JSON)
                 │
┌────────────────▼────────────────────────────────────────┐
│           Data Extraction Layer                         │
│  • Package Parser (package.json → data)                 │
│  • CLI Parser (bin files + docs → commands)             │
│  • Command Parser (.cursor/commands → data)             │
│  • Search Indexer (all content → search index)          │
└────────────────┬────────────────────────────────────────┘
                 │
                 │ File System Access
                 │
┌────────────────▼────────────────────────────────────────┐
│              Workspace Files                            │
│  • packages/**/*                                        │
│  • .cursor/commands/**/*.md                             │
│  • docs/**/*.md                                         │
│  • package.json files                                   │
└─────────────────────────────────────────────────────────┘
```

### Architecture Principles

1. **Build-Time Data Generation**: Extract all data during build, not runtime
2. **Static Site Generation**: Pre-render pages for maximum performance
3. **Client-Side Search**: Use lightweight MiniSearch for fast, offline search
4. **Zero Backend**: Pure frontend application with no server dependencies
5. **Automated Updates**: Rebuild automatically when workspace changes

---

## Frontend Architecture

### Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS (utility-first)
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Search**: MiniSearch (client-side full-text search)
- **Code Highlighting**: Prism.js or Shiki
- **Animations**: Framer Motion (optional, for polish)

### Component Structure

```
src/app/
├── layout.tsx                 # Root layout (header, sidebar, footer)
├── page.tsx                   # Dashboard (home page)
├── packages/
│   ├── page.tsx               # Package catalog (list view)
│   └── [id]/page.tsx          # Package detail page
├── cli/
│   ├── page.tsx               # CLI command reference (list view)
│   └── [tool]/page.tsx        # CLI tool detail page
├── signals/
│   ├── page.tsx               # Cursor command browser
│   └── [id]/page.tsx          # Command detail page
└── search/
    └── page.tsx               # Search results page

src/components/
├── ui/                        # shadcn/ui components (Button, Card, etc.)
├── layout/
│   ├── header.tsx             # App header with search
│   ├── sidebar.tsx            # Navigation sidebar
│   └── footer.tsx             # App footer
├── package-card.tsx           # Package display card
├── command-card.tsx           # Command display card
├── search-bar.tsx             # Global search input
├── code-block.tsx             # Syntax-highlighted code
└── stats-card.tsx             # Statistics display card

src/lib/
├── parsers/                   # Data extraction
│   ├── package-parser.ts
│   ├── cli-parser.ts
│   └── command-parser.ts
├── search/
│   ├── indexer.ts             # Build search index
│   └── searcher.ts            # Client-side search
└── utils.ts                   # Shared utilities

src/data/                      # Generated data (build-time)
├── packages.json
├── commands.json
├── signals.json
└── search-index.json
```

### State Management

**No global state management needed** - All data is static and loaded at build time.

- **Component State**: React useState/useReducer for UI state
- **URL State**: Next.js router for navigation and search queries
- **Local Storage**: For user preferences (theme, view mode, favorites - post-MVP)

### Routing

```
/                              # Dashboard (home)
/packages                      # Package catalog
/packages/[id]                 # Package detail
/cli                           # CLI command reference
/cli/[tool]                    # CLI tool detail
/signals               # Cursor command browser
/signals/[id]          # Command detail
/search?q=...                  # Search results
```

### Responsive Design

- **Desktop-first**: Primary use case is desktop development
- **Mobile-responsive**: Ensure usability on mobile devices
- **Breakpoints**: Tailwind default (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)

---

## Data Architecture

### Data Models

#### Package

```typescript
interface Package {
  id: string;                    // Unique identifier (package name)
  name: string;                  // Display name
  version: string;               // Current version
  description: string;           // Brief description
  path: string;                  // Relative path in workspace
  type: 'cli' | 'library' | 'template';
  status: 'active' | 'deprecated' | 'experimental';
  categories: string[];          // E.g., ['tooling', 'workflow']
  keywords: string[];            // For search
  cli?: {                        // If type === 'cli'
    commands: Command[];
    binName: string;             // E.g., 'task-master'
  };
  dependencies: {
    name: string;
    version: string;
  }[];
  relatedPackages: string[];     // Package IDs
  documentation: {
    readme: string;              // Markdown content
    architecture?: string;       // Markdown content
    gettingStarted?: string;     // Markdown content
  };
  metadata: {
    lastUpdated: string;         // ISO date string
    author?: string;
    license?: string;
  };
}
```

#### CLI Command

```typescript
interface Command {
  id: string;                    // Unique identifier
  tool: string;                  // E.g., 'task-master'
  command: string;               // E.g., 'list'
  fullCommand: string;           // E.g., 'task-master list'
  description: string;
  usage: string;                 // E.g., 'task-master list [options]'
  options: {
    flag: string;                // E.g., '-s, --status'
    description: string;
    required: boolean;
    default?: string;
  }[];
  examples: {
    command: string;
    description: string;
  }[];
  relatedCommands: string[];     // Command IDs
  category: string;              // E.g., 'task-management'
}
```

#### Cursor Command

```typescript
interface CursorCommand {
  id: string;                    // Unique identifier
  trigger: string;               // E.g., '/expert/accessibility'
  name: string;                  // Display name
  description: string;
  category: 'experts' | 'local' | 'general';
  content: string;               // Full command content
  keywords: string[];            // For search
  usageCount?: number;           // Post-MVP
  lastUsed?: string;             // Post-MVP
}
```

### Data Storage

**Build-Time Generated JSON Files**:
- `src/data/packages.json` - All package data
- `src/data/commands.json` - All CLI command data
- `src/data/signals.json` - All Cursor command data
- `src/data/search-index.json` - MiniSearch index

**Accessed at Runtime**:
- Import JSON files statically in components
- Next.js bundles data into JavaScript chunks
- No API calls needed

---

## Data Extraction Strategy

### Build Process

```bash
# During build (npm run build)
1. Run data extraction scripts
2. Generate JSON data files
3. Build search index
4. Build Next.js app (SSG)
5. Output static site
```

### Package Extraction

**Source**: `packages/*/package.json`

**Script**: `scripts/parse-packages.ts`

**Process**:
1. Scan `packages/` directory for all subdirectories
2. Read `package.json` from each package
3. Extract: name, version, description, dependencies, scripts
4. Determine package type:
   - Has `bin` field → CLI tool
   - Has `templates/` folder → Template
   - Otherwise → Library
5. Parse `README.md` for documentation
6. Check for `ARCHITECTURE.md`, `GETTING_STARTED.md`
7. Determine status (active by default, check for deprecation notices)
8. Generate `packages.json`

**Output**: `src/data/packages.json`

### CLI Command Extraction

**Source**: `packages/*/bin/*` and README files

**Script**: `scripts/parse-cli.ts`

**Process**:
1. Find all CLI tools (packages with `bin` field)
2. Parse bin files to extract command structure
3. Parse README.md for command documentation
4. Extract command options from documentation
5. Parse examples from README
6. Build command hierarchy (tool → commands → subcommands)
7. Generate `commands.json`

**Output**: `src/data/commands.json`

### Cursor Command Extraction

**Source**: `.cursor/commands/**/*.md`

**Script**: `scripts/parse-signals.ts`

**Process**:
1. Recursively scan `.cursor/commands/` directory
2. Parse each `.md` file
3. Extract:
   - Category from folder name (experts, local, general)
   - Command trigger from frontmatter or first heading
   - Description from frontmatter or content
   - Full content for preview
4. Index commands for search
5. Generate `signals.json`

**Output**: `src/data/signals.json`

### Search Index Building

**Script**: `scripts/build-search-index.ts`

**Process**:
1. Collect all data (packages, commands, docs)
2. Create MiniSearch index with fields:
   - `id`: Unique identifier
   - `title`: Primary searchable text (weighted 2x)
   - `description`: Secondary searchable text
   - `content`: Full content text
   - `type`: 'package' | 'command' | 'cursor-command'
   - `category`: For filtering
3. Configure search options:
   - Fuzzy matching (typo tolerance)
   - Prefix matching (autocomplete)
   - Boost fields (title > description > content)
4. Generate optimized index
5. Write to `search-index.json`

**Output**: `src/data/search-index.json`

---

## Search Implementation

### Search Library

**MiniSearch**: Lightweight, full-text search for JavaScript
- **Why**: Client-side, offline, fast, small bundle size (~10KB gzipped)
- **Alternatives considered**: Algolia (requires backend), Lunr.js (larger, slower)

### Search Configuration

```typescript
import MiniSearch from 'minisearch';

const searchIndex = new MiniSearch({
  fields: ['title', 'description', 'content'], // Searchable fields
  storeFields: ['id', 'type', 'category'],     // Fields to return
  searchOptions: {
    boost: { title: 2, description: 1.5 },     // Field weights
    fuzzy: 0.2,                                 // Typo tolerance
    prefix: true,                               // Prefix matching
  }
});
```

### Search Features

1. **Full-Text Search**: Search across all fields
2. **Fuzzy Matching**: Handle typos automatically
3. **Prefix Matching**: Autocomplete as you type
4. **Field Boosting**: Title matches rank higher
5. **Filtering**: Filter by type (package, command, etc.)
6. **Highlighting**: Show matched text in results

### Search Performance

- **Index Size**: ~100KB (estimated for 100+ items)
- **Search Speed**: <100ms for typical queries
- **Load Time**: Index loads with initial page (SSG)

---

## UI/UX Architecture

### Design System

**Color Palette**:
- Primary: `#2563eb` (Blue) - Links, actions
- Secondary: `#10b981` (Green) - Success, active
- Accent: `#8b5cf6` (Purple) - Highlights
- Neutral: Gray scale (white, light gray, dark gray)
- Semantic: Success (green), warning (amber), error (red), info (blue)

**Typography**:
- Font: Inter (body), JetBrains Mono (code)
- Scale: 48px (hero), 32px (h1), 24px (h2), 20px (h3), 16px (body), 14px (small)

**Spacing**:
- Tailwind default scale (4px base unit)
- Consistent padding/margin across components

**Components**:
- Use shadcn/ui for consistency and accessibility
- Customize with Tailwind classes
- Maintain design system in `src/styles/design-tokens.css`

### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo, Search Bar, User/Settings               │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │  Main Content Area                           │
│          │                                              │
│ • Home   │  ┌────────────────────────────────────────┐ │
│ • Packages│  │                                        │ │
│ • CLI    │  │   Page Content                         │ │
│ • Cursor │  │   (Dynamic based on route)             │ │
│          │  │                                        │ │
│          │  └────────────────────────────────────────┘ │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### Accessibility

- **WCAG AA Compliance**: Minimum 4.5:1 contrast, keyboard navigation
- **Screen Reader Support**: Semantic HTML, ARIA labels
- **Keyboard Navigation**: Tab order, focus indicators, shortcuts
- **Touch Targets**: Minimum 44x44px for all interactive elements

**See [technical/ui-components.md](technical/ui-components.md) for component details**

---

## Infrastructure

### Hosting

**Vercel** (Recommended):
- **Why**: Optimized for Next.js, zero-config deployment, automatic builds
- **Alternatives**: Netlify, GitHub Pages, AWS S3 + CloudFront

### CI/CD Pipeline

**Auto-rebuild on Changes**:
1. Git hook or GitHub Action watches workspace files
2. Trigger rebuild when files change (package.json, commands, docs)
3. Deploy updated site automatically

**Build Pipeline**:
```
1. Install dependencies (npm install)
2. Run data extraction scripts
3. Build Next.js app (npm run build)
4. Deploy static files to hosting
```

### Monitoring

**Post-MVP**:
- **Performance**: Vercel Analytics (page load times, Core Web Vitals)
- **Errors**: Sentry or LogRocket (error tracking)
- **Usage**: Optional analytics (Google Analytics, Plausible)

### Performance Optimization

**Build-Time**:
- Static Site Generation (SSG) for all pages
- Image optimization (next/image)
- Code splitting (automatic with Next.js)
- Bundle analysis (next-bundle-analyzer)

**Runtime**:
- Lazy loading for large content
- Virtual scrolling for long lists (optional)
- Debounced search input
- Memoized components (React.memo)

---

## Security Considerations

### Data Security

- **No Sensitive Data**: Hub only exposes public workspace information
- **No User Data**: No authentication, no user-generated content (MVP)
- **No Backend**: Pure static site, no server vulnerabilities

### Content Security

- **Sanitize Markdown**: Use secure Markdown parser (remark/rehype)
- **No XSS**: Sanitize all user input (search queries)
- **HTTPS**: Always serve over HTTPS

---

## Deployment Architecture

### Build & Deploy

```
┌─────────────────────────────────────────────────────────┐
│                Development Workflow                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Make changes to workspace (packages, commands, etc.)│
│  2. Trigger rebuild (manual or automatic)               │
│  3. Data extraction runs                                │
│  4. Next.js build generates static site                 │
│  5. Deploy to Vercel/hosting                            │
│  6. New version live (1-2 minutes)                      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Environments

- **Development**: Local development server (`npm run dev`)
- **Preview**: Deploy previews for pull requests (Vercel automatic)
- **Production**: Main branch deploys to production (automatic)

---

## Scalability

### Current Scale

- **Packages**: ~20 packages (current), up to 100+ (future)
- **Commands**: ~50-100 CLI commands + Cursor commands
- **Documents**: ~100-500 markdown files
- **Users**: 10-50 developers (internal team)

### Scaling Considerations

**Data Volume**:
- **Current**: <1MB total data
- **Future**: Up to 10MB (still manageable for static site)
- **Solution**: Lazy loading, pagination if needed

**Search Performance**:
- **Current**: MiniSearch handles <1000 documents easily
- **Future**: If >5000 documents, consider server-side search (Algolia)
- **Solution**: Profile and optimize if needed

**Build Time**:
- **Current**: <2 minutes expected
- **Future**: May increase with more data
- **Solution**: Incremental builds, caching

---

## Technology Decisions

### Why Next.js 14 (App Router)?

- **Static Site Generation**: Pre-render pages for speed
- **File-based Routing**: Simple, intuitive routing
- **TypeScript Support**: Built-in, excellent DX
- **Image Optimization**: Automatic optimization
- **Zero Config**: Works out of the box

### Why Tailwind CSS?

- **Utility-First**: Fast development, small bundle
- **Customizable**: Easy to match design system
- **Responsive**: Built-in responsive utilities
- **Developer Experience**: Great VS Code support

### Why MiniSearch?

- **Client-Side**: No backend needed
- **Fast**: Sub-100ms search
- **Small**: ~10KB gzipped
- **Flexible**: Full-text search, fuzzy, prefix matching
- **Offline**: Works without network

### Why shadcn/ui?

- **Accessible**: Built on Radix UI (WCAG compliant)
- **Customizable**: Copy components, modify as needed
- **Modern**: Beautiful, professional design
- **TypeScript**: Full type safety

---

## Future Architecture Considerations

### Post-MVP Enhancements

**Usage Analytics**:
- Add lightweight analytics (Plausible or similar)
- Track popular packages/commands
- Identify unused tools

**User Preferences**:
- Store in localStorage
- Dark mode, view preferences, favorites
- Sync across devices (optional, requires backend)

**Backend Integration** (Optional):
- Add API for dynamic data (usage stats, comments)
- User authentication (if needed)
- Real-time updates (WebSocket)

---

## Appendix

### File Structure (Complete)

```
workspace-documentation-hub/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── packages/
│   │   ├── cli/
│   │   ├── signals/
│   │   └── search/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── package-card.tsx
│   │   ├── command-card.tsx
│   │   └── search-bar.tsx
│   ├── lib/
│   │   ├── parsers/
│   │   ├── search/
│   │   └── utils.ts
│   ├── data/
│   │   ├── packages.json
│   │   ├── commands.json
│   │   ├── signals.json
│   │   └── search-index.json
│   └── styles/
│       └── globals.css
├── scripts/
│   ├── generate-data.ts
│   ├── parse-packages.ts
│   ├── parse-cli.ts
│   ├── parse-signals.ts
│   └── build-search-index.ts
├── public/
│   └── icons/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## Review/Contribution

**Created**: 2026-01-24  
**Status**: Complete Architecture Design  
**Next Steps**: Expert reviews, implementation planning
