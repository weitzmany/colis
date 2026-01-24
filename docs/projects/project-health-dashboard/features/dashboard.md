# Feature: Project List Dashboard

**Feature ID**: DASH-001  
**Priority**: P1 (MVP Must-Have)  
**Status**: Planning  
**Estimated Effort**: 3 weeks

---

## Overview

The Project List Dashboard is the central view of the application, providing a comprehensive, at-a-glance overview of all projects in the portfolio. It displays project cards with health scores, status indicators, and quick access to project details.

**User Benefit**: Portfolio managers can instantly assess the health of their entire portfolio without visiting multiple tools or manually checking each project.

**Business Value**: Reduces project health review time from 8 hours to <30 minutes weekly by providing centralized visibility.

---

## User Stories

### Primary User Story
**As a** portfolio manager  
**I want to** see all my projects with their health scores in one dashboard  
**So that** I can quickly identify which projects need attention

**Acceptance Criteria**:
- Display all connected projects as cards in a grid layout
- Show health score (0-100) with color coding (green>80, yellow 50-80, red<50)
- Show project status (Active, Inactive, Archived)
- Show last updated timestamp
- Support sorting by health score, name, or last updated
- Support filtering by status
- Dashboard loads in <2 seconds
- Responsive layout (grid adjusts to screen size)

### Secondary User Stories

**As a** development lead  
**I want to** filter projects by health score  
**So that** I can prioritize projects that need immediate attention

**As a** portfolio manager  
**I want to** search for projects by name  
**So that** I can quickly find a specific project

**As a** user  
**I want to** see recent activity across all projects  
**So that** I can understand what's happening in my portfolio

---

## Requirements

### Functional Requirements

#### FR-1: Project Card Display
- Display each project as a card with:
  - Project name (prominent)
  - Health score (large, color-coded number)
  - Status badge (Active/Inactive/Archived)
  - Last updated timestamp ("2 hours ago" format)
  - Repository link (GitHub/GitLab icon)
  - Quick action buttons (View Details, Refresh)

#### FR-2: Health Score Visualization
- Display health score as a large number (0-100)
- Color-code by threshold:
  - Green (healthy): 80-100
  - Yellow (warning): 50-79
  - Red (critical): 0-49
- Show visual indicator (progress circle or bar)
- Display trend arrow (up/down from previous check)

#### FR-3: Sorting & Filtering
- **Sort Options**:
  - Health Score (ascending/descending)
  - Name (A-Z, Z-A)
  - Last Updated (newest/oldest)
  - Status
- **Filter Options**:
  - Status: All, Active, Inactive, Archived
  - Health Score: All, Healthy (>80), Warning (50-80), Critical (<50)
  - Technology: Filter by detected tech stack (future)

#### FR-4: Search Functionality
- Search bar in dashboard header
- Real-time search as user types
- Search by project name
- Display "No results found" message if no matches

#### FR-5: Portfolio Statistics
- Display summary statistics at top of dashboard:
  - Total Projects count
  - Active Projects count
  - Average Health Score (portfolio-wide)
  - Critical Alerts count (red badge if >0)
- Update statistics in real-time

#### FR-6: Recent Activity Feed
- Display recent activity panel (right sidebar or below project grid)
- Show last 10 events across all projects:
  - Health score changes
  - Build status changes
  - New alerts
  - Project added/removed
- Auto-refresh every 30 seconds

#### FR-7: Empty State
- When no projects connected:
  - Display friendly empty state message
  - Show "Connect Your First Project" button
  - Provide quick start guide link

### Non-Functional Requirements

#### NFR-1: Performance
- Dashboard initial load: <2 seconds
- Project card render time: <100ms per card
- Search response: <200ms
- Real-time updates: <5 seconds from source change

#### NFR-2: Scalability
- Support displaying 50+ projects (MVP)
- Support displaying 200+ projects (Phase 2) with pagination
- Implement virtual scrolling for 500+ projects (Phase 3)

#### NFR-3: Accessibility
- Keyboard navigation support (Tab, Enter, Arrow keys)
- Screen reader support (ARIA labels, semantic HTML)
- Color contrast meets WCAG AA standards
- Focus indicators visible
- Color is not the only means of conveying information (use icons + text)

#### NFR-4: Responsiveness
- Desktop: 3-4 column grid (1200px+)
- Tablet: 2 column grid (768px-1199px)
- Mobile: 1 column list (< 768px)
- Touch-friendly targets (44x44px minimum)

---

## User Interface

### Dashboard Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Header: Logo | Search | Alerts | User Profile              │
├──────────────────────────────────────────────────────────────┤
│  Portfolio Stats:  📊 12 Projects | 💚 8.5 Avg Health | 🔴 3 Alerts
├──────────────────────────────────────────────────────────────┤
│  Sidebar │  Main Content Area                                │
│          │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐              │
│  Filter  │  │Card │  │Card │  │Card │  │Card │              │
│  Sort    │  │ 85  │  │ 72  │  │ 45  │  │ 91  │              │
│          │  └─────┘  └─────┘  └─────┘  └─────┘              │
│          │  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐              │
│          │  │Card │  │Card │  │Card │  │Card │              │
│          │  │ 88  │  │ 63  │  │ 55  │  │ 94  │              │
│          │  └─────┘  └─────┘  └─────┘  └─────┘              │
└──────────────────────────────────────────────────────────────┘
```

### Project Card Component

```
┌────────────────────────────────┐
│  GitHub Icon   ProjectName      │  ← Repository provider + name
├────────────────────────────────┤
│           85                    │  ← Large health score
│        ──────                   │  ← Progress circle
│        Healthy                  │  ← Status text
│        ↑ +3                     │  ← Trend (up 3 points)
├────────────────────────────────┤
│  🟢 Active                      │  ← Status badge
│  ⏰ Updated 2 hours ago         │  ← Last updated
├────────────────────────────────┤
│  [View Details]  [Refresh]     │  ← Action buttons
└────────────────────────────────┘
```

### Color Palette

**Health Score Colors**:
- Healthy (80-100): `#10b981` (Green)
- Warning (50-79): `#f59e0b` (Amber)
- Critical (0-49): `#ef4444` (Red)

**Status Colors**:
- Active: `#3b82f6` (Blue)
- Inactive: `#6b7280` (Gray)
- Archived: `#9ca3af` (Light Gray)

---

## API Specification

### Get Projects List

**Endpoint**: `GET /api/v1/projects`

**Query Parameters**:
```typescript
{
  sort?: 'health' | 'name' | 'updated' | 'status';
  order?: 'asc' | 'desc';
  status?: 'active' | 'inactive' | 'archived';
  healthMin?: number; // 0-100
  healthMax?: number; // 0-100
  search?: string;
  page?: number;
  limit?: number; // default 50
}
```

**Response**:
```typescript
{
  data: Array<{
    id: string;
    name: string;
    description?: string;
    repositoryUrl: string;
    provider: 'GITHUB' | 'GITLAB';
    healthScore: number; // 0-100
    previousHealthScore?: number; // For trend calculation
    status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
    lastCollectedAt: string; // ISO 8601
    createdAt: string;
    updatedAt: string;
  }>;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `500 Internal Server Error`: Server error

---

### Get Portfolio Statistics

**Endpoint**: `GET /api/v1/analytics/portfolio`

**Response**:
```typescript
{
  totalProjects: number;
  activeProjects: number;
  inactiveProjects: number;
  archivedProjects: number;
  averageHealthScore: number; // 0-100
  criticalAlertsCount: number;
  healthDistribution: {
    healthy: number; // count of projects with health > 80
    warning: number; // count of projects with health 50-80
    critical: number; // count of projects with health < 50
  };
}
```

---

### Get Recent Activity

**Endpoint**: `GET /api/v1/events?limit=10`

**Response**:
```typescript
{
  data: Array<{
    id: string;
    projectId?: string; // Null for portfolio-level events
    projectName?: string;
    type: EventType;
    data: any;
    timestamp: string; // ISO 8601
  }>;
}
```

---

## Database Schema

**No additional tables needed** - uses existing `Project`, `ProjectMetrics`, `Alert`, and `Event` models from main schema.

---

## Frontend Component Structure

### Component Hierarchy

```
DashboardPage
├── PortfolioStats
│   ├── StatCard (Total Projects)
│   ├── StatCard (Average Health)
│   └── StatCard (Critical Alerts)
├── DashboardControls
│   ├── SearchBar
│   ├── SortDropdown
│   └── FilterPanel
├── ProjectGrid
│   └── ProjectCard (repeated)
│       ├── ProjectHeader
│       ├── HealthScoreDisplay
│       │   ├── HealthScoreCircle
│       │   └── TrendIndicator
│       ├── StatusBadge
│       ├── LastUpdatedText
│       └── ActionButtons
└── RecentActivityPanel
    └── ActivityItem (repeated)
```

### Key Components

#### ProjectCard.tsx
```typescript
interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectId: string) => void;
  onRefresh: (projectId: string) => void;
}

export function ProjectCard({ project, onViewDetails, onRefresh }: ProjectCardProps) {
  const trend = calculateTrend(project.healthScore, project.previousHealthScore);
  
  return (
    <div className="project-card">
      <ProjectHeader name={project.name} provider={project.provider} />
      <HealthScoreDisplay 
        score={project.healthScore} 
        trend={trend}
      />
      <StatusBadge status={project.status} />
      <LastUpdatedText timestamp={project.lastCollectedAt} />
      <ActionButtons 
        onViewDetails={() => onViewDetails(project.id)}
        onRefresh={() => onRefresh(project.id)}
      />
    </div>
  );
}
```

#### HealthScoreDisplay.tsx
```typescript
interface HealthScoreDisplayProps {
  score: number; // 0-100
  trend?: number; // Change from previous score
}

export function HealthScoreDisplay({ score, trend }: HealthScoreDisplayProps) {
  const color = getHealthColor(score);
  const statusText = getHealthStatusText(score);
  
  return (
    <div className="health-score-display">
      <HealthScoreCircle score={score} color={color} />
      <span className="score-text">{score}</span>
      <span className="status-text">{statusText}</span>
      {trend && <TrendIndicator trend={trend} />}
    </div>
  );
}

function getHealthColor(score: number): string {
  if (score >= 80) return 'green';
  if (score >= 50) return 'yellow';
  return 'red';
}

function getHealthStatusText(score: number): string {
  if (score >= 80) return 'Healthy';
  if (score >= 50) return 'Warning';
  return 'Critical';
}
```

---

## State Management

### React Query Hooks

```typescript
// Fetch projects list with filters
export function useProjects(filters: ProjectFilters) {
  return useQuery({
    queryKey: ['projects', filters],
    queryFn: () => fetchProjects(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Auto-refetch every 5 minutes
  });
}

// Fetch portfolio statistics
export function usePortfolioStats() {
  return useQuery({
    queryKey: ['portfolio', 'stats'],
    queryFn: fetchPortfolioStats,
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch recent activity
export function useRecentActivity() {
  return useQuery({
    queryKey: ['events', 'recent'],
    queryFn: () => fetchRecentEvents(10),
    staleTime: 30 * 1000, // 30 seconds
    refetchInterval: 30 * 1000, // Auto-refetch every 30 seconds
  });
}
```

### Real-Time Updates

```typescript
export function useDashboardRealTime() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const eventSource = new EventSource('/api/v1/events');
    
    eventSource.addEventListener('health_score_updated', (event) => {
      const data = JSON.parse(event.data);
      // Invalidate projects query to trigger refetch
      queryClient.invalidateQueries(['projects']);
      // Show toast notification
      toast.info(`${data.projectName} health score updated to ${data.healthScore}`);
    });
    
    eventSource.addEventListener('critical_alert', (event) => {
      const data = JSON.parse(event.data);
      // Invalidate stats to update critical alerts count
      queryClient.invalidateQueries(['portfolio', 'stats']);
      // Show alert notification
      toast.error(`Critical alert for ${data.projectName}: ${data.message}`);
    });
    
    return () => eventSource.close();
  }, [queryClient]);
}
```

---

## Testing Strategy

### Unit Tests

**Component Tests** (React Testing Library):
```typescript
describe('ProjectCard', () => {
  it('should render project name and health score', () => {
    const project = createMockProject({ name: 'Test Project', healthScore: 85 });
    render(<ProjectCard project={project} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
  });
  
  it('should display green color for healthy project', () => {
    const project = createMockProject({ healthScore: 85 });
    render(<ProjectCard project={project} />);
    
    expect(screen.getByText('Healthy')).toHaveClass('text-green-600');
  });
  
  it('should call onViewDetails when View Details button clicked', () => {
    const onViewDetails = jest.fn();
    const project = createMockProject({ id: '123' });
    render(<ProjectCard project={project} onViewDetails={onViewDetails} />);
    
    fireEvent.click(screen.getByText('View Details'));
    expect(onViewDetails).toHaveBeenCalledWith('123');
  });
});
```

**Hook Tests**:
```typescript
describe('useProjects', () => {
  it('should fetch projects with filters', async () => {
    const { result, waitFor } = renderHook(() => 
      useProjects({ status: 'active' })
    );
    
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(5);
  });
});
```

### Integration Tests

**Dashboard Flow**:
```typescript
describe('Dashboard Integration', () => {
  it('should load dashboard and display projects', async () => {
    render(<DashboardPage />);
    
    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Test Project 1')).toBeInTheDocument();
      expect(screen.getByText('Test Project 2')).toBeInTheDocument();
    });
    
    // Verify statistics loaded
    expect(screen.getByText('12 Projects')).toBeInTheDocument();
    expect(screen.getByText('8.5 Avg Health')).toBeInTheDocument();
  });
  
  it('should filter projects by health score', async () => {
    render(<DashboardPage />);
    
    // Select "Critical" filter
    fireEvent.click(screen.getByText('Filter'));
    fireEvent.click(screen.getByText('Critical (<50)'));
    
    // Verify only critical projects displayed
    await waitFor(() => {
      expect(screen.queryByText('Healthy Project')).not.toBeInTheDocument();
      expect(screen.getByText('Critical Project')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests (Cypress/Playwright)

```typescript
describe('Dashboard E2E', () => {
  it('should navigate from dashboard to project detail', () => {
    cy.visit('/dashboard');
    cy.contains('Test Project').should('be.visible');
    cy.contains('View Details').click();
    cy.url().should('include', '/projects/');
    cy.contains('Project Health Breakdown').should('be.visible');
  });
  
  it('should search for projects', () => {
    cy.visit('/dashboard');
    cy.get('input[placeholder="Search projects"]').type('Frontend');
    cy.contains('Frontend App').should('be.visible');
    cy.contains('Backend API').should('not.exist');
  });
});
```

---

## Success Metrics

### Quantitative Metrics
- **Load Time**: Dashboard loads in <2 seconds (measured via Lighthouse)
- **Render Performance**: 60 FPS for scrolling and interactions
- **Data Accuracy**: 100% accuracy of displayed health scores vs. source data
- **Real-Time Latency**: Updates appear within 5 seconds of source change

### Qualitative Metrics
- **User Satisfaction**: 4.5/5 average rating for dashboard usability
- **Time Savings**: Users report 70% reduction in time to assess portfolio health
- **Adoption**: 100% of target users (5 portfolio managers) use dashboard daily

---

## Implementation Notes

### Phase 1 (MVP)
- Basic project card grid
- Health score display with color coding
- Simple sorting and filtering
- Portfolio statistics

### Phase 2 (Post-MVP)
- Advanced filters (technology stack, custom tags)
- Bulk actions (refresh all, archive multiple)
- Custom dashboard layouts (user preferences)
- Export to CSV/PDF

### Phase 3 (Future)
- Drag-and-drop card reordering
- Custom project grouping
- Dashboard widgets (configurable)
- Mobile app view

---

## Dependencies

**External**:
- React Query: Server state management
- Recharts: Health score circle visualization
- date-fns: Relative time formatting ("2 hours ago")

**Internal**:
- `/api/v1/projects` endpoint
- `/api/v1/analytics/portfolio` endpoint
- `/api/v1/events` SSE endpoint

---

## Related Documentation

- [PRD Overview](../PRD_OVERVIEW.md) - Overall project requirements
- [Architecture](../ARCHITECTURE.md) - Technical architecture
- [Health Monitoring Feature](health-monitoring.md) - Health score calculation details
- [Alerts Feature](alerts.md) - Critical alert system

---

**Feature Version**: 1.0  
**Last Updated**: 2026-01-20  
**Next Review**: 2026-02-20
