# Sports Results Tracker - Frontend Architecture

## Framework and Libraries

### Core Stack

**React 18 + TypeScript**:
- Component-based UI framework
- Type safety and developer experience
- Vite for fast build tool and dev server
- React Router v6 for client-side routing

**UI & Styling**:
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Headless UI**: Accessible UI components (modals, dropdowns, etc.)
- **Lucide React**: Modern icon library
- **clsx**: Conditional class name utility

**State Management**:
- **Zustand**: Lightweight global state management
- **TanStack Query (React Query v5)**: Server state management and caching
- **Zod**: Runtime type validation and schema validation

**Progressive Web App**:
- **Vite PWA Plugin**: Service worker generation and PWA manifest
- **Workbox**: Runtime caching strategies for offline support

## State Management Strategy

### Local UI State (Zustand)

Used for client-side UI state that persists across sessions:

- User preferences (theme, language)
- Followed teams (localStorage persistence)
- UI state (modals, filters, selected tabs, drawer open/closed)
- View preferences (compact vs expanded)

**Store Structure**:
```typescript
interface AppStore {
  // Followed teams
  followedTeams: Team[];
  addTeam: (team: Team) => void;
  removeTeam: (teamId: string) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  
  // UI state
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  
  // Filters
  selectedLeague: string | null;
  setSelectedLeague: (leagueId: string | null) => void;
}

// Usage
const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      followedTeams: [],
      theme: 'light',
      isSidebarOpen: false,
      selectedLeague: null,
      
      addTeam: (team) => set((state) => ({
        followedTeams: [...state.followedTeams, team]
      })),
      
      removeTeam: (teamId) => set((state) => ({
        followedTeams: state.followedTeams.filter(t => t.id !== teamId)
      })),
      
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      
      toggleSidebar: () => set((state) => ({
        isSidebarOpen: !state.isSidebarOpen
      })),
      
      setSelectedLeague: (leagueId) => set({ selectedLeague: leagueId }),
    }),
    { name: 'app-storage' }
  )
);
```

### Server State (React Query)

Used for remote data that's fetched from the backend API:

- Live scores
- League standings
- Match fixtures
- Team details
- Player statistics (Phase 2)

**Query Configuration**:
```typescript
// Live scores with automatic refetch
const { data: liveScores, isLoading, error } = useQuery({
  queryKey: ['scores', 'live'],
  queryFn: fetchLiveScores,
  refetchInterval: 30000,      // Refetch every 30 seconds
  staleTime: 25000,             // Consider stale after 25 seconds
  cacheTime: 60000,             // Keep in cache for 60 seconds
  retry: 3,                     // Retry failed requests 3 times
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

// Standings with longer cache time
const { data: standings } = useQuery({
  queryKey: ['standings', leagueId],
  queryFn: () => fetchStandings(leagueId),
  refetchInterval: false,       // Manual refetch only
  staleTime: 3600000,           // 1 hour (standings change slowly)
  cacheTime: 7200000,           // 2 hours in cache
});

// Fixtures for specific date
const { data: fixtures } = useQuery({
  queryKey: ['fixtures', date],
  queryFn: () => fetchFixtures(date),
  staleTime: 3600000,           // 1 hour
  enabled: !!date,              // Only fetch when date is provided
});
```

## Component Structure

```
src/
├── components/
│   ├── scores/
│   │   ├── LiveScoreCard.tsx         # Individual live score card
│   │   ├── ScoreList.tsx             # List of scores
│   │   ├── MatchDetails.tsx          # Detailed match view
│   │   └── ScoreFilter.tsx           # Filter controls
│   ├── standings/
│   │   ├── StandingsTable.tsx        # League standings table
│   │   ├── TeamRow.tsx               # Individual team row
│   │   └── StandingsHeader.tsx       # Table header
│   ├── fixtures/
│   │   ├── FixtureList.tsx           # List of upcoming matches
│   │   ├── FixtureCard.tsx           # Individual fixture card
│   │   └── FixtureCalendar.tsx       # Calendar view (Phase 2)
│   ├── teams/
│   │   ├── TeamCard.tsx              # Team card component
│   │   ├── TeamList.tsx              # List of teams
│   │   ├── FollowButton.tsx          # Follow/unfollow button
│   │   └── TeamBadge.tsx             # Team logo + name badge
│   ├── layout/
│   │   ├── Header.tsx                # App header with navigation
│   │   ├── Navigation.tsx            # Mobile/desktop navigation
│   │   ├── Footer.tsx                # App footer
│   │   ├── Sidebar.tsx               # Desktop sidebar
│   │   └── MobileMenu.tsx            # Mobile menu drawer
│   └── common/
│       ├── Button.tsx                # Button component
│       ├── Card.tsx                  # Card container
│       ├── Loading.tsx               # Loading spinners
│       ├── ErrorBoundary.tsx         # Error boundary
│       ├── EmptyState.tsx            # Empty state message
│       └── Badge.tsx                 # Status badge
├── pages/
│   ├── Home.tsx                      # Landing page
│   ├── LiveScores.tsx                # Live scores page
│   ├── Standings.tsx                 # League standings page
│   ├── Fixtures.tsx                  # Upcoming fixtures page
│   ├── Following.tsx                 # Followed teams page
│   ├── TeamDetails.tsx               # Team details (Phase 2)
│   ├── MatchDetails.tsx              # Match details (Phase 2)
│   └── NotFound.tsx                  # 404 page
├── hooks/
│   ├── useScores.ts                  # Live scores hook
│   ├── useStandings.ts               # Standings hook
│   ├── useFixtures.ts                # Fixtures hook
│   ├── useFollowedTeams.ts           # Followed teams hook
│   ├── useTheme.ts                   # Theme hook
│   └── useMediaQuery.ts              # Responsive hook
├── api/
│   ├── client.ts                     # Axios client setup
│   ├── endpoints.ts                  # API endpoint definitions
│   └── types.ts                      # API response types
├── stores/
│   └── appStore.ts                   # Zustand store
├── types/
│   ├── index.ts                      # Shared types
│   ├── team.ts                       # Team types
│   ├── match.ts                      # Match types
│   ├── league.ts                     # League types
│   └── standing.ts                   # Standing types
└── utils/
    ├── formatters.ts                 # Date/time/score formatters
    ├── constants.ts                  # App constants
    ├── classNames.ts                 # Class name utilities
    └── validators.ts                 # Form validators
```

## Routing

### Route Configuration

```typescript
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'scores',
        element: <LiveScores />,
      },
      {
        path: 'standings',
        element: <Standings />,
      },
      {
        path: 'fixtures',
        element: <Fixtures />,
      },
      {
        path: 'following',
        element: <Following />,
      },
      // Phase 2 routes
      {
        path: 'teams/:teamId',
        element: <TeamDetails />,
      },
      {
        path: 'matches/:matchId',
        element: <MatchDetails />,
      },
      {
        path: 'players/:playerId',
        element: <PlayerDetails />,
      },
      // Auth routes (Phase 2)
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
]);
```

### Navigation Structure

- `/` - Home page with featured matches
- `/scores` - Live and recent scores
- `/standings` - League standings tables
- `/fixtures` - Upcoming matches
- `/following` - Followed teams dashboard
- `/teams/:teamId` - Team details (Phase 2)
- `/matches/:matchId` - Match details with stats (Phase 2)
- `/players/:playerId` - Player profile (Phase 2)

## Performance Optimization

### Code Splitting

**Route-based Splitting**:
```typescript
const LiveScores = lazy(() => import('./pages/LiveScores'));
const Standings = lazy(() => import('./pages/Standings'));
const Fixtures = lazy(() => import('./pages/Fixtures'));

// Wrap with Suspense
<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/scores" element={<LiveScores />} />
    <Route path="/standings" element={<Standings />} />
    <Route path="/fixtures" element={<Fixtures />} />
  </Routes>
</Suspense>
```

**Component Lazy Loading**:
```typescript
// Heavy components loaded on demand
const MatchDetails = lazy(() => import('./components/MatchDetails'));
const PlayerStats = lazy(() => import('./components/PlayerStats'));

// Modal components loaded when opened
const ShareModal = lazy(() => import('./components/ShareModal'));
```

### Image Optimization

**Team Logos**:
- Served via Vercel CDN
- WebP format with PNG fallback
- Lazy loading for off-screen images
- Size: 64x64px (small), 128x128px (large)

```typescript
<img
  src={`${CDN_URL}/teams/${teamId}.webp`}
  alt={teamName}
  loading="lazy"
  width={64}
  height={64}
  onError={(e) => {
    e.currentTarget.src = `${CDN_URL}/teams/${teamId}.png`;
  }}
/>
```

### Caching Strategy

**React Query Caching**:
- Live scores: 25 second stale time, 30 second refetch interval
- Standings: 1 hour stale time, manual refetch
- Fixtures: 1 hour stale time, manual refetch
- Team details: 24 hour stale time
- Cache persisted to localStorage (optional)

**Service Worker Caching** (PWA):
- Static assets: Cache-first strategy
- API responses: Network-first with cache fallback
- Images: Cache-first with network fallback
- HTML: Network-first

### Bundle Optimization

**Target Sizes**:
- Initial bundle: <200KB gzipped
- Route chunks: <100KB each
- Vendor chunk: <150KB

**Optimization Techniques**:
- Tree shaking (Vite automatic)
- Minification (Terser)
- Gzip compression
- Dead code elimination
- Import cost analysis (webpack-bundle-analyzer)

**Example Vite Config**:
```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@headlessui/react', 'lucide-react'],
          state: ['zustand', '@tanstack/react-query'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
      },
    },
  },
});
```

## Progressive Web App (PWA)

### Service Worker

**Caching Strategies**:
```typescript
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST);

// Static assets (images, fonts, CSS, JS)
registerRoute(
  ({ request }) => request.destination === 'image' ||
                   request.destination === 'font' ||
                   request.destination === 'style' ||
                   request.destination === 'script',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 }), // 30 days
    ],
  })
);

// API responses (network-first for fresh data)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 5 * 60 }), // 5 minutes
    ],
  })
);

// HTML (network-first)
registerRoute(
  ({ request }) => request.destination === 'document',
  new NetworkFirst({
    cacheName: 'html-cache',
  })
);
```

### Offline Support

**Offline Capabilities**:
- View cached scores (last 5 minutes)
- View cached standings (last 1 hour)
- View followed teams
- Browse previously viewed pages
- Offline indicator UI

**Offline Detection**:
```typescript
const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  return isOnline;
};
```

### PWA Manifest

```json
{
  "name": "Sports Results Tracker",
  "short_name": "Sports Tracker",
  "description": "Fast, mobile-first sports results tracking",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

## Mobile Optimization

### Responsive Design

**Breakpoints** (Tailwind):
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (desktop)
- `xl`: 1280px (large desktop)

**Mobile-First Approach**:
```tsx
// Default styles for mobile
<div className="p-4 text-sm">
  {/* Mobile content */}
</div>

// Larger screens
<div className="p-4 md:p-6 lg:p-8 text-sm md:text-base lg:text-lg">
  {/* Responsive content */}
</div>
```

### Touch Optimization

**Touch Targets**:
- Minimum size: 44x44px (WCAG AA compliance)
- Spacing between targets: 8px minimum
- Larger targets for primary actions (48x48px)

**Touch Gestures**:
- Swipe to refresh (pull-to-refresh)
- Swipe between tabs
- Long press for context menu
- Double tap to favorite/follow

### Performance Targets

**Mobile Performance**:
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.0s
- Cumulative Layout Shift (CLS): <0.1

**Optimization Techniques**:
- Lazy load images below the fold
- Prefetch critical resources
- Minimize JavaScript execution
- Use CSS containment
- Avoid layout shifts

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-25  
**Status**: Planning - Technical Specification  
**Related**: [Backend Architecture](backend-architecture.md), [Database Schema](database-schema.md), [Real-Time Architecture](realtime-architecture.md)
