# Feature: Chore Assignment & Management

**Feature Name**: Chore Assignment & Management  
**Priority**: P1 (MVP)  
**Status**: Planning  
**Last Updated**: 2026-01-20

---

## Overview

### Feature Description

Chore Assignment & Management is the core feature that allows parents to create chores, assign them to family members, set due dates and frequencies, and track completion status. Kids can view their assigned chores, mark them complete, and see upcoming tasks.

### User Benefit

**For Parents**:
- Easy chore creation and assignment
- Clear visibility into household responsibilities
- Reduced time spent tracking and reminding

**For Kids**:
- Clear expectations and responsibilities
- Simple chore completion workflow
- Visibility into upcoming tasks

### Business Value

- **Core Feature**: Essential for MVP - the foundation of the entire platform
- **User Engagement**: Frequent use (daily chore check-off)
- **Retention Driver**: Routine-building feature increases stickiness
- **Differentiation**: Family-specific chore management vs generic to-do apps

---

## User Stories

### Parent User Stories

**As a parent, I want to**:
1. Create a new chore with a title, description, and due date
2. Assign a chore to one or more family members
3. Set a chore to recur (daily, weekly, monthly, custom)
4. Set a point value or allowance amount for completing a chore
5. View all chores (active, completed, overdue)
6. Edit or delete chores
7. See which chores are completed and which are pending
8. Mark a chore as complete on behalf of a child (if needed)

**So that I can**:
- Manage household responsibilities efficiently
- Distribute tasks fairly across family members
- Track completion and accountability

### Kid User Stories

**As a kid, I want to**:
1. View my assigned chores for today
2. See upcoming chores for the week
3. Mark a chore as complete with one tap
4. See how many points/allowance I earned
5. Get reminders about upcoming and overdue chores
6. See my completed chore history

**So that I can**:
- Know what's expected of me
- Complete my chores efficiently
- Earn rewards and allowance

---

## Requirements

### Functional Requirements

#### Chore Creation (Parent)

1. **Create Chore Form**:
   - Title (required, max 100 characters)
   - Description (optional, max 500 characters)
   - Assigned to (required, one or more family members)
   - Due date/time (optional, defaults to today)
   - Recurrence (none, daily, weekly, monthly, custom)
   - Points value (optional, integer 1-100)
   - Allowance amount (optional, decimal, e.g., $2.50)

2. **Chore Types**:
   - One-time chore (no recurrence)
   - Recurring chore (daily, weekly, monthly, custom)
   - Custom recurrence (e.g., "every Monday, Wednesday, Friday")

3. **Assignment Options**:
   - Single family member
   - Multiple family members (separate instances)
   - Rotating assignment (future feature)

#### Chore Management (Parent)

1. **View Chores**:
   - List view with filters (all, today, week, month)
   - Filter by status (pending, completed, overdue)
   - Filter by assignee (all, specific family member)
   - Sort by due date, created date, status

2. **Edit Chore**:
   - Update any chore field
   - Change assignment
   - Modify recurrence
   - Adjust points/allowance

3. **Delete Chore**:
   - Soft delete (archive, not permanent deletion)
   - Confirmation prompt
   - Option to delete single instance or all recurring instances

4. **Mark Complete (Parent)**:
   - Parent can mark chore complete on behalf of kid
   - Includes reason/note field (optional)

#### Chore Viewing (Kid)

1. **Chore List View**:
   - Today's chores (default view)
   - Upcoming chores (this week)
   - Overdue chores (highlighted)
   - Completed chores (last 30 days)

2. **Chore Details View**:
   - Title and description
   - Due date/time
   - Points/allowance earned for completion
   - Completion status

#### Chore Completion (Kid)

1. **Mark Complete**:
   - Single tap to mark complete
   - Immediate visual feedback (checkmark animation)
   - Optimistic UI update (instant UI change, sync in background)
   - Confirmation message with points/allowance earned

2. **Undo Complete** (within 5 minutes):
   - Accidental completion can be undone
   - Button available for 5 minutes after completion
   - Points/allowance reversed if undone

### Non-Functional Requirements

#### Performance

- **Chore List Load Time**: < 500ms for list of up to 100 chores
- **Chore Completion**: Optimistic UI update (instant), background sync within 2 seconds
- **Chore Creation**: Form submission < 300ms

#### Usability

- **Parent Interface**: Clean, functional dashboard with power-user features
- **Kid Interface**: Simple, visual, large touch targets (minimum 44x44px)
- **Mobile-First**: All chore operations possible on mobile
- **Offline Support**: Chore check-off works offline, syncs when online

#### Accessibility

- **WCAG 2.1 AA Compliance**: All interactive elements keyboard accessible
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 for text, 3:1 for UI components
- **Touch Targets**: Minimum 44x44px for all interactive elements

#### Security

- **Authorization**: Kids can only view and complete their own chores
- **Data Validation**: All inputs validated server-side
- **Rate Limiting**: Prevent rapid-fire chore completion abuse

---

## User Interface

### Parent Interface

#### Chore List View (Desktop/Mobile Web)

```
┌──────────────────────────────────────────────────────┐
│  [+ New Chore]      [Filter: All ▼]  [Today ▼]      │
├──────────────────────────────────────────────────────┤
│  Today's Chores (5)                                  │
│  ┌───────────────────────────────────────────────┐  │
│  │ ☐ Clean bedroom                               │  │
│  │   Alex • Due today, 5pm • $2.50                │  │
│  │   [Edit] [Delete]                              │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │ ✓ Feed the dog                                 │  │
│  │   Jamie • Completed today, 8am • 10 points     │  │
│  └───────────────────────────────────────────────┘  │
│  ...                                                 │
│                                                      │
│  This Week's Chores (12)                            │
│  ┌───────────────────────────────────────────────┐  │
│  │ ☐ Wash dishes                                  │  │
│  │   Alex • Due tomorrow, 6pm • $1.50             │  │
│  │   [Edit] [Delete]                              │  │
│  └───────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

#### New Chore Form

```
┌──────────────────────────────────────────────────────┐
│  Create New Chore                            [Close] │
├──────────────────────────────────────────────────────┤
│  Title *                                             │
│  [_______________________________________________]   │
│                                                      │
│  Description                                         │
│  [_______________________________________________]   │
│  [_______________________________________________]   │
│                                                      │
│  Assign to *                                         │
│  [ ] Alex  [ ] Jamie  [✓] Select All               │
│                                                      │
│  Due Date                                            │
│  [MM/DD/YYYY ▼]  [HH:MM ▼]                          │
│                                                      │
│  Recurrence                                          │
│  ( ) None  ( ) Daily  ( ) Weekly  ( ) Monthly       │
│  ( ) Custom: [_______]                              │
│                                                      │
│  Reward                                              │
│  Points: [__] (1-100)  OR  Allowance: [$__.__]     │
│                                                      │
│              [Cancel]  [Create Chore]               │
└──────────────────────────────────────────────────────┘
```

### Kid Interface

#### Chore List View (Mobile App)

```
┌────────────────────────────────────┐
│  My Chores               [Profile] │
├────────────────────────────────────┤
│  Today (3)                         │
│  ┌──────────────────────────────┐ │
│  │ ☐ Clean bedroom              │ │
│  │   Due today, 5pm              │ │
│  │   💰 $2.50                    │ │
│  │                               │ │
│  │         [Mark Done]           │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │ ✓ Feed the dog               │ │
│  │   Completed today, 8am        │ │
│  │   ⭐ 10 points                │ │
│  └──────────────────────────────┘ │
│  ┌──────────────────────────────┐ │
│  │ ☐ Take out trash              │ │
│  │   Due today, 7pm              │ │
│  │   💰 $1.00                    │ │
│  │                               │ │
│  │         [Mark Done]           │ │
│  └──────────────────────────────┘ │
│                                    │
│  [Today] [This Week] [Completed]  │
└────────────────────────────────────┘
```

#### Chore Completion Animation

```
┌────────────────────────────────────┐
│                                    │
│          ✓                         │
│      Great Job!                    │
│                                    │
│   You earned $2.50!                │
│                                    │
│  Total this week: $8.50            │
│                                    │
└────────────────────────────────────┘
```

---

## API Specification

### Endpoints

#### GET /api/v1/chores

**Description**: List chores with filters

**Authorization**: Required (JWT)

**Query Parameters**:
- `familyId` (required): Family ID
- `status` (optional): `pending`, `completed`, `overdue`, `all` (default: `all`)
- `assignedTo` (optional): User ID to filter by assignee
- `startDate` (optional): Start date for date range filter
- `endDate` (optional): End date for date range filter
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50, max: 100)

**Response** (200 OK):
```json
{
  "chores": [
    {
      "id": "chore_123",
      "title": "Clean bedroom",
      "description": "Make bed, pick up clothes, vacuum",
      "assignedTo": ["user_456"],
      "assignedToNames": ["Alex"],
      "dueDate": "2026-01-20T17:00:00Z",
      "recurrence": "weekly",
      "pointsValue": 0,
      "allowanceAmount": 2.50,
      "status": "pending",
      "createdBy": "user_789",
      "createdAt": "2026-01-15T10:00:00Z",
      "updatedAt": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 15,
    "totalPages": 1
  }
}
```

#### POST /api/v1/chores

**Description**: Create a new chore

**Authorization**: Required (JWT, parent role)

**Request Body**:
```json
{
  "familyId": "family_123",
  "title": "Clean bedroom",
  "description": "Make bed, pick up clothes, vacuum",
  "assignedTo": ["user_456"],
  "dueDate": "2026-01-20T17:00:00Z",
  "recurrence": "weekly",
  "pointsValue": 0,
  "allowanceAmount": 2.50
}
```

**Response** (201 Created):
```json
{
  "chore": {
    "id": "chore_123",
    "title": "Clean bedroom",
    ...
  }
}
```

#### GET /api/v1/chores/:id

**Description**: Get chore details

**Authorization**: Required (JWT)

**Response** (200 OK):
```json
{
  "chore": {
    "id": "chore_123",
    "title": "Clean bedroom",
    ...
  }
}
```

#### PUT /api/v1/chores/:id

**Description**: Update chore

**Authorization**: Required (JWT, parent role)

**Request Body**: Same as create, all fields optional

**Response** (200 OK): Same as GET /api/v1/chores/:id

#### DELETE /api/v1/chores/:id

**Description**: Delete chore (soft delete)

**Authorization**: Required (JWT, parent role)

**Response** (204 No Content)

#### POST /api/v1/chores/:id/complete

**Description**: Mark chore as complete

**Authorization**: Required (JWT)

**Request Body**:
```json
{
  "completedBy": "user_456",
  "note": "Optional completion note"
}
```

**Response** (200 OK):
```json
{
  "completion": {
    "id": "completion_789",
    "choreId": "chore_123",
    "completedBy": "user_456",
    "completedAt": "2026-01-20T14:30:00Z",
    "pointsEarned": 0,
    "allowanceEarned": 2.50,
    "note": "Optional completion note"
  }
}
```

#### POST /api/v1/chores/:id/uncomplete

**Description**: Undo chore completion (within 5 minutes)

**Authorization**: Required (JWT)

**Response** (200 OK):
```json
{
  "chore": {
    "id": "chore_123",
    "status": "pending",
    ...
  }
}
```

---

## Database Schema

### Tables

#### `chores` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique chore ID |
| family_id | UUID | FOREIGN KEY (families) | Family this chore belongs to |
| title | VARCHAR(100) | NOT NULL | Chore title |
| description | TEXT | NULL | Chore description |
| created_by | UUID | FOREIGN KEY (users) | User who created chore |
| due_date | TIMESTAMP | NULL | Due date/time |
| recurrence | VARCHAR(20) | NULL | Recurrence pattern |
| points_value | INTEGER | DEFAULT 0 | Points earned for completion |
| allowance_amount | DECIMAL(10,2) | DEFAULT 0.00 | Allowance earned for completion |
| status | VARCHAR(20) | NOT NULL | pending, completed, archived |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | NOT NULL | Last update timestamp |

**Indexes**:
- `idx_chores_family_id` on `family_id`
- `idx_chores_status` on `status`
- `idx_chores_due_date` on `due_date`

#### `chore_assignments` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique assignment ID |
| chore_id | UUID | FOREIGN KEY (chores) | Chore being assigned |
| assigned_to | UUID | FOREIGN KEY (users) | User chore is assigned to |
| created_at | TIMESTAMP | NOT NULL | Assignment timestamp |

**Indexes**:
- `idx_chore_assignments_chore_id` on `chore_id`
- `idx_chore_assignments_assigned_to` on `assigned_to`

#### `chore_completions` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | UUID | PRIMARY KEY | Unique completion ID |
| chore_id | UUID | FOREIGN KEY (chores) | Chore that was completed |
| completed_by | UUID | FOREIGN KEY (users) | User who completed chore |
| completed_at | TIMESTAMP | NOT NULL | Completion timestamp |
| points_earned | INTEGER | DEFAULT 0 | Points earned |
| allowance_earned | DECIMAL(10,2) | DEFAULT 0.00 | Allowance earned |
| note | TEXT | NULL | Completion note |

**Indexes**:
- `idx_chore_completions_chore_id` on `chore_id`
- `idx_chore_completions_completed_by` on `completed_by`
- `idx_chore_completions_completed_at` on `completed_at`

---

## Testing Strategy

### Unit Tests

1. **Chore Service Tests**:
   - Create chore (valid data)
   - Create chore (invalid data, should fail)
   - Update chore (parent role, should succeed)
   - Update chore (kid role, should fail)
   - Delete chore (parent role, should succeed)
   - Delete chore (kid role, should fail)
   - Calculate points/allowance for completion

2. **Chore Assignment Tests**:
   - Assign chore to single user
   - Assign chore to multiple users
   - Validate assignment (user belongs to family)

3. **Chore Completion Tests**:
   - Mark chore complete (valid user)
   - Mark chore complete (unauthorized user, should fail)
   - Undo chore completion (within 5 minutes)
   - Undo chore completion (after 5 minutes, should fail)

### Integration Tests

1. **API Endpoint Tests**:
   - GET /api/v1/chores (with filters)
   - POST /api/v1/chores (create chore)
   - PUT /api/v1/chores/:id (update chore)
   - DELETE /api/v1/chores/:id (delete chore)
   - POST /api/v1/chores/:id/complete (mark complete)
   - POST /api/v1/chores/:id/uncomplete (undo complete)

2. **Authorization Tests**:
   - Parent can create/edit/delete chores
   - Kid cannot create/edit/delete chores
   - Kid can only complete own chores
   - Parent can complete chores on behalf of kid

### E2E Tests

1. **Parent Workflow**:
   - Log in as parent
   - Create a new chore
   - Assign chore to kid
   - View chore list
   - Edit chore
   - Delete chore

2. **Kid Workflow**:
   - Log in as kid
   - View assigned chores
   - Mark chore complete
   - Verify points/allowance earned
   - View completed chores

### User Acceptance Criteria

1. ✅ Parent can create a chore and assign it to a kid
2. ✅ Kid can see assigned chore in their list
3. ✅ Kid can mark chore complete with one tap
4. ✅ Completion awards points or allowance as specified
5. ✅ Parent can view completion status in dashboard
6. ✅ Recurring chores create new instances automatically
7. ✅ Chore completion works offline and syncs when online

---

## Success Metrics

### Feature-Specific KPIs

1. **Chore Creation Rate**: Average chores created per family per week
   - Target: > 5 chores per family per week

2. **Chore Completion Rate**: Percentage of chores completed on time
   - Target: > 70% completion rate

3. **Feature Usage**: Percentage of families actively using chore feature
   - Target: > 90% of active families

4. **Mobile Adoption**: Percentage of chore completions via mobile app
   - Target: > 60% via mobile

### Tracking Plan

- Track chore creation events (parent)
- Track chore completion events (kid)
- Track chore completion time (time from creation to completion)
- Track chore edit/delete events
- Track mobile vs web usage

---

**End of Feature PRD**

→ [Return to Documentation Index](../INDEX.md)  
→ [View PRD Overview](../PRD_OVERVIEW.md)  
→ [View Other Features](README.md)
