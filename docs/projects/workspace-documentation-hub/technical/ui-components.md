# Technical: UI Components

## Overview

Component architecture using Next.js App Router, TypeScript, Tailwind CSS, and shadcn/ui (Radix UI primitives). Focus on accessibility, performance, and maintainability.

---

## Component Library

### shadcn/ui

**Why**: Accessible, customizable, copy-paste components built on Radix UI

**Key Components Used**:
- `Button` - Actions, navigation
- `Card` - Package cards, command cards
- `Input` - Search input, form inputs
- `Tabs` - Package detail tabs, category tabs
- `Badge` - Status badges, type badges
- `Dialog` - Modal dialogs, command previews
- `Separator` - Visual dividers
- `DropdownMenu` - Filter menus, actions

**Installation**:
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input tabs badge dialog
```

---

## Layout Components

### 1. App Layout (`app/layout.tsx`)

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
```

### 2. Header (`components/layout/header.tsx`)

- Logo (link to home)
- Global search bar
- Navigation links
- User menu (post-MVP)

### 3. Sidebar (`components/layout/sidebar.tsx`)

- Navigation menu:
  - Dashboard
  - Packages
  - CLI Commands
  - Cursor Commands
  - (Workflows - post-MVP)
- Active state highlighting
- Collapsible on mobile

---

## Feature Components

### 1. Package Card (`components/package-card.tsx`)

```tsx
interface PackageCardProps {
  package: Package;
}

export function PackageCard({ package }: PackageCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <PackageIcon type={package.type} />
          <CardTitle>{package.name}</CardTitle>
          <Badge>{package.version}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {package.description}
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="outline">{package.type}</Badge>
          <Badge variant={package.status === 'active' ? 'success' : 'default'}>
            {package.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. Search Bar (`components/search-bar.tsx`)

```tsx
export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleSearch = useDebouncedCallback((q: string) => {
    // Perform search with MiniSearch
    const searchResults = performSearch(q);
    setResults(searchResults);
  }, 150);

  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search packages, commands, docs..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleSearch(e.target.value);
        }}
        className="w-full"
      />
      {results.length > 0 && (
        <SearchResults results={results} onClose={() => setResults([])} />
      )}
    </div>
  );
}
```

### 3. Command Card (`components/command-card.tsx`)

```tsx
interface CommandCardProps {
  command: Command | CursorCommand;
  type: 'cli' | 'cursor';
}

export function CommandCard({ command, type }: CommandCardProps) {
  const copyTrigger = () => {
    navigator.clipboard.writeText(command.trigger || command.fullCommand);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono text-sm">
            {command.trigger || command.fullCommand}
          </CardTitle>
          <Button size="sm" variant="ghost" onClick={copyTrigger}>
            <CopyIcon />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{command.description}</p>
        <Badge className="mt-2">{command.category}</Badge>
      </CardContent>
    </Card>
  );
}
```

### 4. Code Block (`components/code-block.tsx`)

```tsx
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const highlighted = Prism.highlight(
    code,
    Prism.languages[language],
    language
  );

  return (
    <div className="relative">
      <pre className="p-4 bg-slate-900 rounded-lg overflow-x-auto">
        <code 
          className={`language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2"
        onClick={() => navigator.clipboard.writeText(code)}
      >
        Copy
      </Button>
    </div>
  );
}
```

---

## Design Tokens

### Colors (Tailwind Config)

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',       // Blue
        secondary: '#10b981',     // Green
        accent: '#8b5cf6',        // Purple
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      }
    }
  }
}
```

### Typography

```css
/* globals.css */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

code, pre {
  font-family: 'JetBrains Mono', monospace;
}
```

---

## Accessibility

### WCAG AA Compliance

- **Contrast Ratios**: Minimum 4.5:1 for text
- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Focus Indicators**: Visible focus rings on all focusable elements
- **Touch Targets**: Minimum 44x44px for all buttons/links
- **Screen Readers**: Semantic HTML, ARIA labels where needed

### Implementation

```tsx
// Accessible button example
<Button
  aria-label="Copy command"
  onClick={handleCopy}
  className="min-h-[44px] min-w-[44px]" // Touch target size
>
  <CopyIcon aria-hidden="true" />
</Button>

// Accessible search with ARIA
<Input
  type="search"
  role="searchbox"
  aria-label="Search documentation"
  aria-describedby="search-description"
/>
<span id="search-description" className="sr-only">
  Search packages, commands, and documentation
</span>
```

---

## Performance Optimization

### 1. Code Splitting

Next.js automatic code splitting per route

### 2. Component Memoization

```tsx
import { memo } from 'react';

export const PackageCard = memo(({ package }: PackageCardProps) => {
  // Component implementation
});
```

### 3. Virtual Scrolling (if needed)

For large lists (100+ items), use `react-window`:
```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={packages.length}
  itemSize={200}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      <PackageCard package={packages[index]} />
    </div>
  )}
</FixedSizeList>
```

---

## Responsive Design

### Breakpoints (Tailwind Default)

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Mobile Adaptations

- Collapsible sidebar on mobile
- Grid → List on small screens
- Touch-friendly buttons (44x44px)
- Simplified navigation

---

**See [ARCHITECTURE.md](../ARCHITECTURE.md) for complete system architecture**
