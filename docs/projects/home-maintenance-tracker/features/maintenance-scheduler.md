# Feature: Maintenance Scheduler

**Status**: MVP Feature  
**Priority**: P0 (Must-Have)  
**Last Updated**: 2026-01-20

---

## Overview

### Feature Description
The Maintenance Scheduler enables users to create, manage, and track recurring maintenance tasks for their home. Users can create custom tasks or use pre-built templates for common maintenance needs (HVAC filters, gutter cleaning, etc.), set recurring schedules, and view all tasks in calendar or list format.

### User Benefit
- **Never Forget Maintenance**: Automated recurring schedules ensure tasks are never missed
- **Quick Setup**: Pre-built templates reduce setup time from hours to minutes
- **Visual Planning**: Calendar view provides clear visibility of upcoming maintenance
- **Prevent Costly Repairs**: Timely maintenance prevents expensive emergency repairs

### Business Value
- **Core Value Proposition**: This is the primary reason users adopt the platform
- **Retention Driver**: Recurring schedules create ongoing engagement and habit formation
- **Foundation Feature**: Enables all other features (reminders, service history, cost tracking)
- **Competitive Differentiation**: Pre-built templates demonstrate maintenance expertise

---

## User Stories

### Primary User Story (MVP)
**As a homeowner**, I want to create maintenance tasks with recurring schedules so that I don't forget important home maintenance and can prevent costly emergency repairs.

**Acceptance Criteria**:
- I can create a new maintenance task with title, description, and category
- I can set a recurring schedule (monthly, quarterly, annually, or custom)
- I can assign the task to a specific home system/area
- I can view all my tasks in a list view sorted by due date
- I can view all my tasks in a calendar view
- I can mark tasks as complete when done
- When I complete a task, the next occurrence is automatically scheduled

### Secondary User Stories

**As a new homeowner**, I want to use pre-built maintenance templates so that I know what maintenance my home needs and how often.

**Acceptance Criteria**:
- I can browse a library of 20+ pre-built maintenance task templates
- Templates are organized by category (HVAC, Plumbing, Roof, etc.)
- Each template includes recommended frequency and brief description
- I can add a template to my schedule with one click
- After adding, I can customize the template to fit my needs

**As a busy homeowner**, I want to view my upcoming maintenance in a calendar so that I can see what needs to be done at a glance.

**Acceptance Criteria**:
- I can view tasks in a month calendar view
- Days with tasks are visually highlighted
- I can click a day to see all tasks due that day
- I can navigate between months
- The calendar is responsive and works on mobile devices

---

## Requirements

### Functional Requirements

#### Core Task Management
1. **Create Task**
   - Input: Title (required), Description (optional), Category (dropdown), Due Date
   - Validation: Title max 100 chars, Description max 500 chars
   - Category options: HVAC, Plumbing, Electrical, Appliance, Landscaping, Roof, Gutter, Paint, Flooring, Pest Control, General, Other

2. **Recurring Schedule**
   - Options: Monthly, Quarterly (3 months), Semi-Annual (6 months), Annual, Custom
   - Custom: Allow user to specify interval (e.g., every 45 days)
   - First due date manually set by user
   - Subsequent dates calculated automatically

3. **Task Completion**
   - User marks task as complete
   - System records completion date
   - System calculates next due date based on recurrence pattern
   - Option to create service history log entry on completion

4. **Task Editing**
   - Edit title, description, category
   - Edit recurrence pattern (affects future occurrences, not past)
   - Edit next due date
   - Delete task (with confirmation)

#### Pre-Built Templates
5. **Template Library**
   - Minimum 20 templates covering common maintenance tasks
   - Template data: Title, Description, Category, Recommended Frequency, Estimated Cost Range
   - Examples:
     - HVAC Filter Change (Monthly)
     - HVAC Professional Inspection (Annual)
     - Gutter Cleaning (Quarterly)
     - Water Heater Flush (Annual)
     - Smoke Detector Testing (Monthly)
     - Roof Inspection (Semi-Annual)

6. **Apply Template**
   - User selects template
   - System creates new task pre-filled with template data
   - User reviews and can customize before saving
   - First due date required from user

#### Views & Navigation
7. **List View**
   - Display all tasks sorted by next due date (soonest first)
   - Visual indicators: Overdue (red), Due Soon (yellow), Upcoming (green)
   - Filters: By category, by status (pending, completed, overdue)
   - Quick actions: Mark complete, Edit, Delete

8. **Calendar View**
   - Month view with tasks displayed on due dates
   - Visual density: Show task count on days with multiple tasks
   - Click day to see all tasks for that day
   - Navigate between months (prev/next buttons)
   - Responsive: Mobile displays single week view

### Non-Functional Requirements

#### Performance
- **List View Load Time**: < 500ms for up to 100 tasks
- **Calendar View Load Time**: < 800ms for monthly view with up to 100 tasks
- **Task Creation**: < 300ms from submit to confirmation
- **Search/Filter**: Results appear < 200ms

#### Usability
- **Task Creation Time**: New users can create first task in < 3 minutes
- **Template Discovery**: Users find relevant template in < 1 minute
- **Mobile Experience**: All features work seamlessly on mobile (iOS/Android)
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigable

#### Reliability
- **Data Integrity**: No tasks lost, recurrence calculations always accurate
- **Concurrent Users**: Support 1,000 concurrent users without performance degradation
- **Offline Support** (Mobile): View tasks offline, sync when online

#### Scalability
- **Tasks per User**: Support up to 200 active tasks per user
- **Template Library**: Easily expandable to 50+ templates post-MVP
- **User Growth**: Architecture supports 10,000 users

---

## User Interface

### Screens & Components

#### 1. Task List View
```
┌─────────────────────────────────────────────────────┐
│  Home Maintenance Tracker          [+ New Task]     │
├─────────────────────────────────────────────────────┤
│  Filters: [All ▼] [Category ▼] [Status ▼]          │
├─────────────────────────────────────────────────────┤
│  📅 Overdue (2)                                      │
│  ┌───────────────────────────────────────────────┐ │
│  │ 🔧 HVAC Filter Change                OVERDUE  │ │
│  │ Due: Jan 15, 2026 | Every month     [✓] [✏] │ │
│  └───────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────┐ │
│  │ 🏠 Gutter Cleaning                  OVERDUE  │ │
│  │ Due: Jan 10, 2026 | Every 3 months [✓] [✏] │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  📆 Upcoming (5)                                     │
│  ┌───────────────────────────────────────────────┐ │
│  │ 🚿 Water Heater Flush              Jan 25     │ │
│  │ Every year                          [✓] [✏]  │ │
│  └───────────────────────────────────────────────┘ │
│  ...                                                 │
└─────────────────────────────────────────────────────┘
```

**Key Elements**:
- Header with "New Task" button (prominent, top-right)
- Filters for quick access (All Tasks, by Category, by Status)
- Tasks grouped by status (Overdue, Due Soon, Upcoming)
- Each task card shows: Title, Due Date, Recurrence, Quick Actions
- Visual indicators: Red (overdue), Yellow (due soon), Green (upcoming)
- Checkmark icon to mark complete, Pencil icon to edit

#### 2. Calendar View
```
┌─────────────────────────────────────────────────────┐
│  Home Maintenance Tracker        [List] [Calendar]  │
├─────────────────────────────────────────────────────┤
│  ◀ January 2026 ▶                                   │
├─────────────────────────────────────────────────────┤
│  Sun  Mon  Tue  Wed  Thu  Fri  Sat                 │
│              1    2    3 •  4    5                  │
│   6    7    8    9 •• 10   11   12                  │
│  13   14   15 •  16   17   18   19                  │
│  20   21   22   23   24   25 • 26                   │
│  27   28   29   30   31                             │
│                                                      │
│  • = 1 task   •• = 2+ tasks                         │
│                                                      │
│  [Today: Jan 20] - No tasks                         │
└─────────────────────────────────────────────────────┘
```

**Key Elements**:
- Toggle between List and Calendar views (top-right)
- Month navigation (prev/next arrows)
- Visual indicators for days with tasks (dots)
- Click day to see task details
- Mobile: Shows single week view for better readability

#### 3. New Task Form
```
┌─────────────────────────────────────────────────────┐
│  Create Maintenance Task                     [✕]    │
├─────────────────────────────────────────────────────┤
│  Task Title *                                       │
│  [HVAC Filter Change                         ]     │
│                                                      │
│  Description (optional)                             │
│  [Replace HVAC filter with new 16x20x1 filter]     │
│                                                      │
│  Category *                                         │
│  [HVAC                                       ▼]     │
│                                                      │
│  First Due Date *                                   │
│  [01/25/2026                              📅]      │
│                                                      │
│  Recurrence *                                       │
│  ○ One-time                                         │
│  ● Recurring                                        │
│    [Monthly                                 ▼]     │
│                                                      │
│  Estimated Cost (optional)                          │
│  [$15                                        ]     │
│                                                      │
│               [Cancel]        [Create Task]         │
└─────────────────────────────────────────────────────┘
```

**Key Elements**:
- Clear field labels with required indicators (*)
- Category dropdown with all maintenance categories
- Date picker for first due date
- Recurrence options: One-time or Recurring with frequency dropdown
- Optional estimated cost field
- Cancel and Create Task buttons (Create Task is primary, blue)

#### 4. Template Library
```
┌─────────────────────────────────────────────────────┐
│  Maintenance Templates                       [✕]    │
├─────────────────────────────────────────────────────┤
│  Search: [                                  🔍]     │
│  Filter by: [All Categories                 ▼]     │
├─────────────────────────────────────────────────────┤
│  🔧 HVAC & Air Quality (4)                          │
│  ┌───────────────────────────────────────────────┐ │
│  │ HVAC Filter Change                            │ │
│  │ Replace air filter • Every month              │ │
│  │ Est. Cost: $10-20                   [Add]     │ │
│  └───────────────────────────────────────────────┘ │
│  ┌───────────────────────────────────────────────┐ │
│  │ HVAC Professional Inspection                  │ │
│  │ Annual inspection and tune-up • Every year    │ │
│  │ Est. Cost: $100-200                 [Add]     │ │
│  └───────────────────────────────────────────────┘ │
│                                                      │
│  🏠 Roof & Gutters (3)                              │
│  ┌───────────────────────────────────────────────┐ │
│  │ Gutter Cleaning                               │ │
│  │ Clean gutters and downspouts • Every 3 months │ │
│  │ Est. Cost: $100-150                 [Add]     │ │
│  └───────────────────────────────────────────────┘ │
│  ...                                                 │
└─────────────────────────────────────────────────────┘
```

**Key Elements**:
- Search bar for finding specific templates
- Category filter dropdown
- Templates grouped by category with counts
- Each template card shows: Title, Description, Frequency, Estimated Cost
- "Add" button to apply template
- Responsive: Mobile shows stacked cards

### User Flow

**Flow 1: Create Custom Task**
1. User clicks "+ New Task" button
2. New Task Form modal appears
3. User enters title (required)
4. User selects category (required)
5. User sets first due date (required)
6. User selects recurrence (one-time or recurring with frequency)
7. User clicks "Create Task"
8. System validates inputs
9. System creates task and calculates next due date if recurring
10. System closes modal and refreshes task list
11. Success message appears: "Task created successfully!"

**Flow 2: Apply Template**
1. User clicks "+ New Task" button
2. New Task Form modal appears
3. User clicks "Browse Templates" link at top of form
4. Template Library modal appears
5. User browses or searches for template
6. User clicks "Add" on desired template
7. New Task Form is pre-filled with template data (title, description, category, recurrence)
8. User sets first due date (required)
9. User can customize any pre-filled fields
10. User clicks "Create Task"
11. System creates task
12. Success message appears: "Task created from template!"

**Flow 3: Mark Task Complete**
1. User views task list
2. User sees overdue or upcoming task
3. User clicks checkmark icon on task card
4. Confirmation modal appears: "Mark as complete?"
5. User clicks "Yes"
6. System updates task: lastCompletedDate = today, calculates next due date
7. Task moves to completed section (temporarily)
8. Success message: "Task marked complete! Next due: [date]"
9. Optional: "Add service log?" prompt with link

---

## API Specification

### Endpoints

#### 1. Create Task
```http
POST /api/v1/tasks
Authorization: Bearer {jwt_token}
Content-Type: application/json

Request Body:
{
  "propertyId": "clxxx123",
  "title": "HVAC Filter Change",
  "description": "Replace 16x20x1 air filter",
  "category": "HVAC",
  "isRecurring": true,
  "recurrenceType": "MONTHLY",
  "recurrenceValue": 1,
  "nextDueDate": "2026-02-01T00:00:00Z",
  "estimatedCost": 15.00
}

Response (201 Created):
{
  "id": "clyyy456",
  "userId": "clzzz789",
  "propertyId": "clxxx123",
  "title": "HVAC Filter Change",
  "description": "Replace 16x20x1 air filter",
  "category": "HVAC",
  "status": "PENDING",
  "isRecurring": true,
  "recurrenceType": "MONTHLY",
  "recurrenceValue": 1,
  "nextDueDate": "2026-02-01T00:00:00Z",
  "lastCompletedDate": null,
  "estimatedCost": 15.00,
  "createdAt": "2026-01-20T10:00:00Z",
  "updatedAt": "2026-01-20T10:00:00Z"
}
```

#### 2. Get Tasks (with filters)
```http
GET /api/v1/tasks?propertyId={id}&status={status}&category={category}&limit=50&offset=0
Authorization: Bearer {jwt_token}

Response (200 OK):
{
  "data": [
    {
      "id": "clyyy456",
      "title": "HVAC Filter Change",
      "category": "HVAC",
      "status": "PENDING",
      "nextDueDate": "2026-02-01T00:00:00Z",
      "isRecurring": true,
      "recurrenceType": "MONTHLY"
    },
    // ... more tasks
  ],
  "meta": {
    "total": 15,
    "limit": 50,
    "offset": 0
  }
}
```

#### 3. Mark Task Complete
```http
POST /api/v1/tasks/{id}/complete
Authorization: Bearer {jwt_token}
Content-Type: application/json

Request Body:
{
  "completedDate": "2026-01-20T00:00:00Z"
}

Response (200 OK):
{
  "id": "clyyy456",
  "status": "COMPLETED",
  "lastCompletedDate": "2026-01-20T00:00:00Z",
  "nextDueDate": "2026-02-20T00:00:00Z"  // Automatically calculated
}
```

#### 4. Get Templates
```http
GET /api/v1/templates?category={category}
Authorization: Bearer {jwt_token}

Response (200 OK):
{
  "data": [
    {
      "id": "tmpl_001",
      "title": "HVAC Filter Change",
      "description": "Replace air filter to maintain air quality and HVAC efficiency",
      "category": "HVAC",
      "recurrenceType": "MONTHLY",
      "recurrenceValue": 1,
      "estimatedCost": 15.00
    },
    // ... more templates
  ]
}
```

### Error Handling

**400 Bad Request**:
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    },
    {
      "field": "nextDueDate",
      "message": "nextDueDate must be a valid date"
    }
  ]
}
```

**401 Unauthorized**:
```json
{
  "statusCode": 401,
  "message": "Unauthorized. Invalid or expired token."
}
```

**404 Not Found**:
```json
{
  "statusCode": 404,
  "message": "Task not found"
}
```

---

## Database Schema

### Task Table (Relevant Fields)

```prisma
model Task {
  id              String    @id @default(cuid())
  userId          String
  propertyId      String
  
  title           String    @db.VarChar(100)
  description     String?   @db.VarChar(500)
  category        TaskCategory
  status          TaskStatus  @default(PENDING)
  
  isRecurring     Boolean   @default(false)
  recurrenceType  RecurrenceType?
  recurrenceValue Int?
  nextDueDate     DateTime?
  lastCompletedDate DateTime?
  
  estimatedCost   Float?
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId, status])
  @@index([nextDueDate])
}

enum TaskCategory {
  HVAC
  PLUMBING
  ELECTRICAL
  APPLIANCE
  LANDSCAPING
  ROOF
  GUTTER
  PAINT
  FLOORING
  PEST_CONTROL
  GENERAL
  OTHER
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
  OVERDUE
  CANCELLED
}

enum RecurrenceType {
  DAILY
  WEEKLY
  MONTHLY
  QUARTERLY
  SEMI_ANNUAL
  ANNUAL
  CUSTOM
}
```

### Template Table

```prisma
model MaintenanceTemplate {
  id              String    @id @default(cuid())
  
  title           String    @db.VarChar(100)
  description     String    @db.VarChar(500)
  category        TaskCategory
  
  recurrenceType  RecurrenceType
  recurrenceValue Int
  
  estimatedCost   Float?
  
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}
```

---

## Testing Strategy

### Unit Tests

**Backend (Task Service)**:
- Test task creation with valid data
- Test task creation with invalid data (missing required fields)
- Test recurrence calculation logic (monthly, quarterly, annual)
- Test task completion and next due date calculation
- Test task filtering (by status, category, property)
- **Coverage Target**: 90%+

**Frontend (Task Components)**:
- Test TaskList component renders tasks correctly
- Test TaskForm component validates inputs
- Test TaskForm submission calls API correctly
- Test Calendar component displays tasks on correct dates
- Test task completion flow
- **Coverage Target**: 85%+

### Integration Tests

**API Endpoint Tests**:
- Test POST /tasks creates task and returns 201
- Test GET /tasks returns all user's tasks with filters
- Test POST /tasks/:id/complete marks task complete and calculates next date
- Test PATCH /tasks/:id updates task correctly
- Test DELETE /tasks/:id deletes task and returns 204
- Test GET /templates returns all templates with filters

**Database Integration**:
- Test task CRUD operations with real database
- Test recurrence calculation with various patterns
- Test task queries with indexes for performance

### End-to-End Tests (Playwright)

**Critical User Flows**:
1. **Create First Task**: New user creates custom task from scratch
2. **Apply Template**: User applies pre-built template and customizes it
3. **Mark Task Complete**: User marks task complete, verifies next due date
4. **Calendar Navigation**: User views tasks in calendar, navigates months
5. **Filter Tasks**: User filters tasks by category and status

**Mobile E2E Tests (Detox)**:
1. **Mobile Task Creation**: Create task on mobile device
2. **Mobile Task Completion**: Mark task complete on mobile
3. **Mobile Calendar View**: View and interact with calendar on mobile

---

## Success Metrics

### Feature-Specific KPIs

**Adoption Metrics**:
- **Task Creation Rate**: 80% of new users create at least one task within first session
- **Template Usage**: 60% of users apply at least one pre-built template
- **Task Count per User**: Average 5+ tasks per active user

**Engagement Metrics**:
- **Task Completion Rate**: 70% of tasks marked complete on or before due date
- **Feature Usage**: 80% of users view calendar view at least once per week
- **Return Rate**: 50% of users return weekly to view or manage tasks

**Performance Metrics**:
- **Task Creation Time**: Average < 2 minutes for new users to create first task
- **Template Discovery**: Users find relevant template in < 1 minute

### Success Criteria for MVP Launch

- ✅ 500+ users have created at least 3 tasks
- ✅ 350+ users have applied at least 1 template
- ✅ 70%+ task completion rate (on time)
- ✅ 50%+ weekly return rate
- ✅ < 1% error rate on task creation/completion
- ✅ 4.5+ star rating in app stores (if mobile launched)

---

## Dependencies

**Depends On** (Must be complete first):
- ✅ User Authentication (login/registration)
- ✅ Property Management (single property setup)
- ✅ Database Schema (tasks and templates tables)
- ✅ Backend API (task and template endpoints)

**Enables** (This feature unlocks):
- Reminder System (reminders trigger based on task due dates)
- Service History (completed tasks can create service logs)
- Cost Tracking (estimated costs feed into budget tracking)
- Dashboard (displays upcoming tasks from scheduler)

---

## Future Enhancements (Post-MVP)

1. **Smart Scheduling**: AI-powered recommendations for task frequency based on home age, climate, usage patterns
2. **Seasonal Checklists**: Pre-built seasonal maintenance lists (winterization, spring prep)
3. **Bulk Operations**: Mark multiple tasks complete at once, bulk edit recurrence
4. **Task Templates by Home Type**: Customized template sets for condos, townhouses, single-family homes
5. **Collaborative Tasks**: Assign tasks to family members, track who completes what
6. **Task Dependencies**: Link tasks (e.g., "Clean gutters" → "Inspect roof while up there")
7. **Weather Integration**: Suggest outdoor tasks based on weather forecast

---

**Feature Owner**: Patricia Martinez (Product Manager), Samuel Rodriguez (Backend), Thomas Anderson (Frontend)  
**Last Updated**: 2026-01-20  
**Status**: Ready for Development (MVP)
