# Meal Planner & Grocery List - Architecture

**Project Name**: MealFlow  
**Status**: Planning  
**Last Updated**: 2026-01-21

## System Overview

MealFlow is a full-stack web and mobile application with a client-server architecture. The system consists of:
- **Frontend**: Angular 21 web application for meal planning and management
- **Backend**: PHP 8.1 with Slim Framework 4 API server for business logic and data operations
- **Database**: PostgreSQL 16 for persistent data storage
- **Mobile** (Phase 2+): React Native apps for iOS and Android
- **Infrastructure**: Docker containerization, CI/CD pipeline, cloud hosting

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Angular 21)                     │
│  - Meal Planning Calendar (Drag & Drop)                      │
│  - Recipe Management UI                                       │
│  - Grocery List Interface                                     │
│  - Pantry Tracking Dashboard                                  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS (REST API)
┌────────────────────▼────────────────────────────────────────┐
│             Backend (PHP 8.1 + Slim Framework 4)              │
│  - Authentication & Authorization (JWT)                       │
│  - Meal Planning Service                                      │
│  - Recipe Service                                             │
│  - Grocery List Service                                       │
│  - Pantry Service                                             │
│  - Notification Service (Phase 2+)                            │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL Queries (PDO)
┌────────────────────▼────────────────────────────────────────┐
│              Database (PostgreSQL 16)                         │
│  - Users                                                      │
│  - Recipes (ingredients, instructions)                        │
│  - Meal Plans (weekly/monthly)                                │
│  - Grocery Lists                                              │
│  - Pantry Items (inventory, expiration)                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│             Mobile (React Native - Phase 2+)                  │
│  - Offline Grocery Lists                                      │
│  - Barcode Scanner                                            │
│  - Push Notifications                                         │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS (REST API)
                     │
                     └──────────► Backend (NestJS API)
```

### System Components

1. **Frontend (Angular 21)**:
   - Single Page Application (SPA) with client-side routing
   - Standalone components for modularity
   - State management (RxJS + Services)
   - HttpClient for backend communication
   - Reactive forms for user input

2. **Backend (PHP 8.1 + Slim Framework 4)**:
   - RESTful API endpoints
   - Business logic (meal planning, grocery list generation)
   - Database operations (PDO with prepared statements)
   - Authentication & authorization (JWT)
   - Background jobs (Phase 2+: scheduled tasks)

3. **Database (PostgreSQL)**:
   - User accounts and profiles
   - Recipe storage (ingredients, instructions, metadata)
   - Meal plans (weekly/monthly calendars)
   - Grocery lists (generated and custom)
   - Pantry inventory (items, quantities, expiration dates)

4. **Mobile (React Native - Phase 2+)**:
   - Native iOS and Android apps
   - Offline-first grocery lists (AsyncStorage)
   - Barcode scanning for pantry items
   - Push notifications for expiration alerts

### Data Flow

**Meal Planning Flow**:
1. User selects recipes for the week in the meal planning calendar
2. Frontend sends meal plan to backend API
3. Backend validates meal plan and saves to database
4. User clicks "Generate Grocery List"
5. Backend aggregates ingredients from all planned meals
6. Backend consolidates duplicate ingredients
7. Backend returns organized grocery list
8. User can edit list and check off items while shopping

## Frontend Architecture

### Framework and Libraries

**Angular 21**:
- Single Page Application (SPA) architecture
- Standalone components (no NgModules required)
- TypeScript 5.9 for type safety
- RxJS for reactive programming

**UI Libraries**:
- SCSS for styling with custom design system
- Angular CDK for drag-and-drop meal planning
- date-fns for date handling
- Angular Material (optional for UI components)

### State Management

**Services + RxJS**:
- AuthService (authentication state with BehaviorSubject)
- MealPlanService (current week/month plan)
- GroceryListService (active grocery list)
- PantryService (pantry inventory)
- All state managed with RxJS Observables

**HTTP Client**:
- Angular HttpClient for API communication with interceptors

### Routing

**Angular Router Structure**:
```
app/
├── auth/
│   ├── login.component.ts
│   └── register.component.ts
├── dashboard/
│   └── dashboard.component.ts (Main dashboard)
├── meal-planner/
│   ├── meal-planner.component.ts (Calendar view)
│   └── meal-detail.component.ts (Meal detail)
├── recipes/
│   ├── recipe-list.component.ts (Recipe list)
│   ├── recipe-detail.component.ts (Recipe detail)
│   └── recipe-form.component.ts (Add/edit recipe)
├── grocery-list/
│   └── grocery-list.component.ts (Grocery list view)
├── pantry/
│   └── pantry.component.ts (Pantry inventory)
└── app.routes.ts (Route definitions)
```

### Component Structure

**Component Hierarchy**:
```
App (Standalone)
├── Navigation (header, sidebar) - Standalone
├── Dashboard - Standalone
│   ├── MealPlanSummary
│   ├── GroceryListWidget
│   └── PantryAlertsWidget
├── MealPlanner - Standalone
│   ├── MealCalendar (weekly/monthly view)
│   ├── RecipeSearchPanel
│   └── MealCard (draggable)
├── RecipeManager - Standalone
│   ├── RecipeList
│   ├── RecipeCard
│   └── RecipeForm
├── GroceryList - Standalone
│   ├── GroceryListHeader
│   ├── GrocerySection (grouped by store section)
│   └── GroceryItem (checkable)
└── Pantry - Standalone
    ├── PantryList
    ├── PantryItem
    └── ExpirationAlerts
```

## Backend Architecture

### API Design

**RESTful API** with resource-based endpoints using Slim Framework 4:

**Authentication**:
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/refresh` - Refresh JWT token
- `GET /api/auth/me` - Get current user

**Recipes**:
- `GET /api/recipes` - List recipes (pagination, search, filters)
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create new recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

**Meal Plans**:
- `GET /api/meal-plans` - Get meal plans (query by date range)
- `POST /api/meal-plans` - Create/update meal plan
- `DELETE /api/meal-plans/:id` - Delete meal plan

**Grocery Lists**:
- `GET /api/grocery-lists` - Get grocery lists
- `POST /api/grocery-lists/generate` - Generate list from meal plan
- `PUT /api/grocery-lists/:id` - Update grocery list
- `DELETE /api/grocery-lists/:id` - Delete grocery list

**Pantry**:
- `GET /api/pantry` - Get pantry items
- `POST /api/pantry` - Add pantry item
- `PUT /api/pantry/:id` - Update pantry item
- `DELETE /api/pantry/:id` - Remove pantry item

### Database Design

**Database**: PostgreSQL 16 with PDO (PHP Data Objects)

**Entity-Relationship Diagram** (Simplified):

```
Users (1) ──── (Many) Recipes
Users (1) ──── (Many) MealPlans
Users (1) ──── (Many) GroceryLists
Users (1) ──── (Many) PantryItems

Recipes (Many) ──── (Many) MealPlans (through MealPlanRecipes)
Recipes (1) ──── (Many) Ingredients
GroceryLists (1) ──── (Many) GroceryListItems
```

**Core Tables**:

**Users**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Recipes**:
```sql
CREATE TABLE recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  instructions TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER,
  category VARCHAR(100), -- breakfast, lunch, dinner, snack
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Ingredients** (nested within recipes):
```sql
CREATE TABLE ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2),
  unit VARCHAR(50), -- cup, tbsp, oz, etc.
  sort_order INTEGER
);
```

**Meal Plans**:
```sql
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  meal_date DATE NOT NULL,
  meal_type VARCHAR(50), -- breakfast, lunch, dinner, snack
  recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Grocery Lists**:
```sql
CREATE TABLE grocery_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE grocery_list_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grocery_list_id UUID REFERENCES grocery_lists(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2),
  unit VARCHAR(50),
  category VARCHAR(100), -- produce, dairy, meat, etc.
  is_checked BOOLEAN DEFAULT FALSE,
  sort_order INTEGER
);
```

**Pantry Items**:
```sql
CREATE TABLE pantry_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  quantity DECIMAL(10, 2),
  unit VARCHAR(50),
  location VARCHAR(100), -- pantry, fridge, freezer
  expiration_date DATE,
  purchased_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Authentication/Authorization

**JWT Authentication** (using Firebase JWT library for PHP):
- User registers with email/password
- Password hashed with password_hash() using bcrypt (cost 10)
- User logs in, receives JWT token (15-minute expiry)
- Refresh token (7-day expiry) for token renewal
- JWT payload: `{ userId, email, iat, exp }`

**Authorization**:
- All API endpoints (except `/api/auth/*`) require JWT
- Users can only access their own data (meal plans, recipes, etc.)
- Slim middleware validates JWT on each request
- Row-level security: All PDO queries filter by `user_id`

### Business Logic

**Meal Planning Service** (PHP classes):
- Create/update meal plans for specific dates
- Query meal plans by date range (week, month)
- Validate meal plan dates (prevent past dates in MVP)

**Recipe Service** (PHP classes):
- CRUD operations for recipes using PDO
- Recipe search (by title, category, ingredients)
- Recipe categorization (breakfast, lunch, dinner, snack)
- Calculate ingredient quantities for custom servings (Phase 2+)

**Grocery List Service** (PHP classes):
- **Auto-Generate Algorithm**:
  1. Query all meal plans for selected date range via PDO
  2. Extract ingredients from all planned meals
  3. Consolidate duplicate ingredients (sum quantities)
  4. Group ingredients by category (produce, dairy, meat, etc.)
  5. Sort by category and alphabetically within category
  6. Return organized grocery list
- Manual grocery list editing (add/remove/update items)
- Check off items while shopping

**Pantry Service** (PHP classes):
- Add/update/remove pantry items using PDO
- Track quantities and expiration dates
- Query items expiring soon (within 7 days)
- Low-stock alerts (quantity below threshold - Phase 2+)

**Notification Service** (Phase 2+):
- Email notifications for expiring pantry items
- Email reminders for meal planning
- SMS alerts for grocery list sharing (Phase 3+)

## Infrastructure

### Hosting/Deployment

**MVP (DigitalOcean)**:
- **Droplet**: 2 vCPU, 4GB RAM ($24/month)
- **Managed PostgreSQL**: 1GB RAM ($15/month)
- **Domain**: Custom domain with SSL (Let's Encrypt)
- **Total Cost**: ~$40/month

**Post-MVP (AWS)**:
- **Frontend**: AWS Amplify or Vercel
- **Backend**: AWS ECS (Docker containers)
- **Database**: AWS RDS PostgreSQL
- **Storage**: AWS S3 for recipe images (Phase 2+)
- **CDN**: CloudFront for asset delivery

### CI/CD Pipeline

**GitHub Actions Workflow**:

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Install dependencies
      - Run linter (ESLint)
      - Run tests (Jest)
      - Run type checking (TypeScript)
  
  build:
    runs-on: ubuntu-latest
    needs: test
    steps:
      - Build Docker images (frontend, backend)
      - Push to Docker Hub or AWS ECR
  
  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - Deploy to production (DigitalOcean/AWS)
      - Run database migrations
      - Health check
```

### Monitoring/Logging

**MVP**:
- Basic logging with Winston (backend)
- Error tracking with Sentry
- Uptime monitoring with UptimeRobot

**Post-MVP**:
- Application monitoring: DataDog or New Relic
- Log aggregation: ELK Stack (Elasticsearch, Logstash, Kibana)
- Performance monitoring: Google Analytics + custom events

### Scaling Strategy

**Vertical Scaling** (MVP → 1,000 users):
- Increase Droplet size (4 vCPU, 8GB RAM)
- Increase database size (2GB RAM)

**Horizontal Scaling** (1,000+ users):
- Multiple backend instances behind load balancer
- Database read replicas for read-heavy operations
- Redis caching for frequently accessed data
- CDN for static assets

**Database Scaling**:
- Connection pooling (10 connections MVP, 20-30 production)
- Database indexing (see Data Architecture section)
- Query optimization (use EXPLAIN ANALYZE)
- Materialized views for complex queries (Phase 3+)

## Security Architecture

### Authentication Flow

```
User → [Login Form] → POST /api/auth/login
                     → Backend: Validate credentials
                     → Backend: Generate JWT + Refresh Token
                     → Return { accessToken, refreshToken }
User → Store tokens in httpOnly cookies
User → [Protected Route] → GET /api/meal-plans (JWT in cookie)
                         → Backend: Validate JWT
                         → Backend: Extract userId from JWT
                         → Backend: Query meal plans WHERE user_id = userId
                         → Return meal plans
```

### Authorization Model

**Row-Level Security**:
- All user data queries include `WHERE user_id = currentUserId`
- Prisma middleware enforces user_id filtering on all queries
- Users cannot access other users' data

**API Security**:
- All API endpoints (except `/auth/*`) require valid JWT
- JWT expires after 15 minutes (short-lived)
- Refresh tokens expire after 7 days
- Refresh tokens stored in httpOnly cookies (secure, not accessible by JS)

### Data Encryption

**At Rest**:
- Database encryption: PostgreSQL disk encryption
- Password hashing: bcrypt with 10 rounds
- Sensitive data: Encrypted before storage (Phase 2+ if needed)

**In Transit**:
- HTTPS only (TLS 1.2/1.3)
- Strict Transport Security (HSTS) headers
- SSL certificate from Let's Encrypt

### Security Best Practices

1. **Input Validation**: Validate all user input (backend + frontend)
2. **SQL Injection Prevention**: Use Prisma ORM (parameterized queries)
3. **XSS Prevention**: React automatically escapes output
4. **CSRF Protection**: SameSite cookies, CSRF tokens (Phase 2+)
5. **Rate Limiting**: API rate limiting (100 req/min per user - Phase 2+)
6. **Dependency Scanning**: Dependabot for vulnerability alerts

## Data Architecture

### Database Schema

See "Database Design" section for detailed schema.

**Key Design Decisions**:
- UUID primary keys (better for distributed systems)
- Soft deletes with `deleted_at` column (Phase 2+)
- Timestamps: `created_at`, `updated_at` on all tables
- Foreign keys with CASCADE/SET NULL for referential integrity

### Data Models

**User Model**:
```typescript
interface User {
  id: string; // UUID
  email: string;
  passwordHash: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

**Recipe Model**:
```typescript
interface Recipe {
  id: string; // UUID
  userId: string;
  title: string;
  description?: string;
  instructions: string;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  servings?: number;
  category?: string; // breakfast, lunch, dinner, snack
  ingredients: Ingredient[];
  createdAt: Date;
  updatedAt: Date;
}

interface Ingredient {
  id: string;
  recipeId: string;
  name: string;
  quantity?: number;
  unit?: string;
  sortOrder: number;
}
```

**Meal Plan Model**:
```typescript
interface MealPlan {
  id: string;
  userId: string;
  mealDate: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId?: string;
  recipe?: Recipe; // populated via JOIN
  notes?: string;
  createdAt: Date;
}
```

**Grocery List Model**:
```typescript
interface GroceryList {
  id: string;
  userId: string;
  name: string;
  isActive: boolean;
  items: GroceryListItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface GroceryListItem {
  id: string;
  groceryListId: string;
  name: string;
  quantity?: number;
  unit?: string;
  category?: string; // produce, dairy, meat, etc.
  isChecked: boolean;
  sortOrder: number;
}
```

### Data Relationships

**One-to-Many**:
- User → Recipes (one user has many recipes)
- User → Meal Plans (one user has many meal plans)
- User → Grocery Lists (one user has many grocery lists)
- User → Pantry Items (one user has many pantry items)
- Recipe → Ingredients (one recipe has many ingredients)
- Grocery List → Grocery List Items

**Many-to-One**:
- Meal Plans → Recipes (many meal plans reference one recipe)

### Data Flow

**Meal Planning Flow**:
```
User (Frontend) → POST /api/meal-plans
                → Backend: MealPlanService.create()
                → Backend: Prisma.mealPlan.create()
                → Database: INSERT INTO meal_plans
                → Response: Created meal plan
```

**Grocery List Generation Flow**:
```
User (Frontend) → POST /api/grocery-lists/generate?startDate=2026-01-20&endDate=2026-01-26
                → Backend: GroceryListService.generateFromMealPlan()
                → Backend: Query meal plans WHERE meal_date BETWEEN startDate AND endDate
                → Backend: Extract ingredients from all recipes
                → Backend: Consolidate duplicate ingredients
                → Backend: Group by category
                → Backend: Create grocery list with items
                → Response: Generated grocery list
```

## Integration Architecture

### External APIs

**Recipe Import API** (Phase 2+):
- Scrape recipes from popular recipe sites
- Use libraries: `recipe-scrapers` (Python) or custom Node.js scraper
- Parse recipe HTML → extract title, ingredients, instructions
- Store in database

**Grocery Store APIs** (Phase 4):
- Integrate with grocery store APIs for pricing/inventory (if available)
- Partners: Instacart API, Kroger API, Walmart API
- Fetch real-time prices for grocery list items

### Third-Party Services

**Authentication** (Phase 3+):
- OAuth 2.0: Google Sign-In, Facebook Login
- Social authentication for easier onboarding

**Push Notifications** (Phase 2+):
- Firebase Cloud Messaging (FCM) for push notifications
- Send expiration alerts, meal reminders

**Image Storage** (Phase 2+):
- AWS S3 for recipe images
- Cloudinary for image optimization and CDN

### Webhooks

**Future Integrations**:
- Budget Manager webhook: Sync meal costs with budget tracking
- Recipes Project webhook: Sync recipes between projects

### Event-Driven Architecture

**Phase 3+: Event Bus** (Redis Pub/Sub or RabbitMQ):
- Event: `MealPlanCreated` → Trigger: Update grocery list suggestions
- Event: `PantryItemExpiringSoon` → Trigger: Send push notification
- Event: `GroceryListGenerated` → Trigger: Send email notification

---

**End of Architecture Document**

For product requirements and MVP definition, see [PRD Overview](PRD_OVERVIEW.md).  
For expert contributions and sign-offs, see [Expert Contributions](EXPERTS.md).
