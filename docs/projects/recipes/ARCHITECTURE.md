# Recipes - Architecture

## System Overview

**Recipes** is a full-stack web and mobile application with a three-tier architecture:

1. **Frontend Layer** - Next.js web app (PWA) + React Native mobile app (Phase 2)
2. **Backend Layer** - NestJS REST API with business logic
3. **Data Layer** - PostgreSQL database with full-text search

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Client Layer                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐      ┌────────────────────────┐  │
│  │  Next.js Web App    │      │ React Native App       │  │
│  │  (PWA)              │      │ (iOS + Android)        │  │
│  │  - TypeScript       │      │ Phase 2                │  │
│  │  - Tailwind CSS     │      │ - Offline-first        │  │
│  │  - React Query      │      │ - Push notifications   │  │
│  └─────────────────────┘      └────────────────────────┘  │
│           │                              │                  │
│           └──────────────┬───────────────┘                  │
│                          │                                  │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           │ HTTPS / REST API
                           │
┌──────────────────────────┼──────────────────────────────────┐
│                          ▼                                   │
│                  Backend Layer                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              NestJS REST API                           │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │ │
│  │  │   Auth      │  │  Recipes    │  │ Meal Plans   │  │ │
│  │  │   Module    │  │  Module     │  │ Module       │  │ │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │ │
│  │                                                        │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │ │
│  │  │Collections  │  │   Search    │  │   Import     │  │ │
│  │  │   Module    │  │   Module    │  │   Module     │  │ │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         Business Logic Layer                     │ │ │
│  │  │  - Recipe CRUD operations                        │ │ │
│  │  │  - Meal planning logic                           │ │ │
│  │  │  - Search and filtering                          │ │ │
│  │  │  - User authentication                           │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         Data Access Layer (Prisma ORM)           │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │
                           │ SQL Queries
                           │
┌──────────────────────────┼───────────────────────────────────┐
│                          ▼                                    │
│                    Data Layer                                 │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │              PostgreSQL Database                        │ │
│  │  ┌────────┐  ┌─────────┐  ┌──────────┐  ┌───────────┐ │ │
│  │  │ Users  │  │ Recipes │  │MealPlans │  │Collections│ │ │
│  │  └────────┘  └─────────┘  └──────────┘  └───────────┘ │ │
│  │  ┌────────┐  ┌─────────┐  ┌──────────┐  ┌───────────┐ │ │
│  │  │ Tags   │  │Ingred-  │  │Scheduled │  │RecipeColl │ │ │
│  │  │        │  │ ients   │  │  Meals   │  │ ections   │ │ │
│  │  └────────┘  └─────────┘  └──────────┘  └───────────┘ │ │
│  │                                                         │ │
│  │  Features:                                              │ │
│  │  - Full-text search (pg_trgm, tsvector)                │ │
│  │  - JSONB for flexible recipe data                      │ │
│  │  - Indexes for fast queries                            │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### System Components

1. **Web Frontend (Next.js)**
   - Server-side rendering for SEO
   - Progressive Web App (PWA) for offline access
   - Responsive design (mobile-first)
   - Real-time updates using React Query

2. **Mobile App (React Native)** - Phase 2
   - Native iOS and Android apps
   - Offline-first architecture with local SQLite
   - Push notifications for meal reminders
   - Camera integration for recipe scanning (future)

3. **Backend API (NestJS)**
   - RESTful API with OpenAPI documentation
   - JWT authentication with refresh tokens
   - Business logic for recipes, meal planning, search
   - Recipe import/scraping service (Phase 2)

4. **Database (PostgreSQL)**
   - Structured recipe data with relationships
   - Full-text search capabilities
   - JSONB for flexible recipe metadata
   - Optimized indexes for fast queries

### Data Flow

**Recipe Save Flow**:
```
User → Web/Mobile App → POST /api/recipes
  → NestJS Controller → Service Layer → Prisma ORM
  → PostgreSQL → Return Recipe → Update UI
```

**Meal Planning Flow**:
```
User → Drag Recipe to Calendar → PUT /api/meal-plans/{id}
  → NestJS Controller → Validate Recipe Exists
  → Update Meal Plan → Return Updated Plan → Update UI
```

**Cooking Mode Flow**:
```
User → Select Recipe → Navigate to Cooking Mode
  → Fetch Recipe Details (cached if offline)
  → Display Step-by-Step Instructions
  → Start Timers → Track Progress → Mark Complete
```

## Frontend Architecture

### Next.js Web App (MVP)

**Tech Stack**:
- Next.js 14+ (App Router)
- React 18 with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- Zustand for global state
- React Query for server state
- PWA with service workers

**Project Structure**:
```
/app
  /(auth)               # Auth pages (login, signup)
    /login
    /signup
  /(app)                # Main app pages
    /recipes            # Recipe library
      /[id]             # Recipe details
      /[id]/cook        # Cooking mode
    /meal-plan          # Meal planner
    /collections        # Recipe collections
    /settings           # User settings
  /api                  # API routes (if needed for SSR)
/components
  /ui                   # Shadcn UI components
  /recipes              # Recipe-specific components
  /meal-plan            # Meal planning components
  /cooking-mode         # Cooking mode components
/lib
  /api                  # API client (fetch wrapper)
  /hooks                # Custom React hooks
  /utils                # Utility functions
  /types                # TypeScript types
/public
  /images
  /icons
```

**State Management**:

**Server State** (React Query):
- Recipe data
- Meal plans
- Collections
- User profile

**Client State** (Zustand):
- UI state (modals, drawer open/closed)
- Cooking mode state (current step, timers)
- Filters and search state
- Theme preferences

**Routing Strategy**:
- App Router for file-based routing
- Server components for data fetching
- Client components for interactivity
- Dynamic routes for recipe details

**Performance Optimization**:
- Image optimization (Next.js Image component)
- Lazy loading for recipe lists
- Code splitting by route
- Service workers for offline access
- React Query caching strategies

### React Native Mobile App (Phase 2)

**Tech Stack**:
- React Native 0.73+
- Expo SDK 50+
- TypeScript
- React Navigation
- Zustand for state
- Tanstack Query (React Query)
- SQLite for offline storage
- Expo Notifications

**Offline-First Architecture**:
```
┌─────────────────────────────────────────┐
│         React Native App                │
├─────────────────────────────────────────┤
│                                         │
│  ┌────────────────────────────────────┐ │
│  │      UI Layer (Screens)            │ │
│  │  - Recipe List                     │ │
│  │  - Cooking Mode                    │ │
│  │  - Meal Planner                    │ │
│  └────────────────────────────────────┘ │
│                  │                       │
│  ┌────────────────────────────────────┐ │
│  │    State Management (Zustand)      │ │
│  │  - Local State                     │ │
│  │  - Sync Status                     │ │
│  └────────────────────────────────────┘ │
│                  │                       │
│  ┌────────────────────────────────────┐ │
│  │    Data Layer (Tanstack Query)     │ │
│  │  - API Fetching                    │ │
│  │  - Cache Management                │ │
│  └────────────────────────────────────┘ │
│                  │                       │
│  ┌────────────────────────────────────┐ │
│  │  Offline Sync Manager              │ │
│  │  - Queue offline actions           │ │
│  │  - Sync when online                │ │
│  └────────────────────────────────────┘ │
│                  │                       │
│  ┌────────────────────────────────────┐ │
│  │  Local Storage (SQLite)            │ │
│  │  - Recipes                         │ │
│  │  - Meal Plans                      │ │
│  │  - Sync Queue                      │ │
│  └────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
          │                    │
          │ Online             │ Offline
          ▼                    ▼
   Backend API           SQLite Only
```

**Offline Sync Strategy**:
1. **Read Operations**: Always read from local SQLite first
2. **Write Operations**: Write to SQLite immediately, queue for sync
3. **Sync on Connect**: When connection restored, sync queued actions
4. **Conflict Resolution**: Last-write-wins for simplicity

**Key Features**:
- Offline recipe access (recently viewed auto-cached)
- Cooking mode with timers works offline
- Queue actions (save recipe, update meal plan) for sync
- Push notifications for meal reminders

## Backend Architecture

### NestJS REST API

**Tech Stack**:
- Node.js 20+
- NestJS framework
- Prisma ORM
- PostgreSQL 16
- JWT for authentication
- Bcrypt for password hashing
- Class-validator for validation
- Winston for logging

**Project Structure**:
```
/src
  /auth                 # Authentication module
    auth.controller.ts  # Login, signup, refresh token
    auth.service.ts
    auth.guard.ts       # JWT guard
    jwt.strategy.ts
  /users                # User management
    users.controller.ts
    users.service.ts
    user.entity.ts
  /recipes              # Recipe CRUD
    recipes.controller.ts
    recipes.service.ts
    recipe.entity.ts
    dto/                # Data transfer objects
  /ingredients          # Ingredient management
    ingredients.controller.ts
    ingredients.service.ts
  /collections          # Recipe collections
    collections.controller.ts
    collections.service.ts
  /meal-plans           # Meal planning
    meal-plans.controller.ts
    meal-plans.service.ts
  /search               # Search functionality
    search.controller.ts
    search.service.ts
  /import               # Recipe import (Phase 2)
    import.controller.ts
    import.service.ts
  /prisma               # Database module
    prisma.service.ts   # Prisma client
  /common               # Shared code
    /decorators
    /filters
    /guards
    /interceptors
```

**Module Architecture**:

Each module follows the same pattern:
- **Controller**: Handle HTTP requests, validation
- **Service**: Business logic, database operations
- **Entity/DTO**: Data models and transfer objects
- **Guard/Interceptor**: Cross-cutting concerns

**Authentication Flow**:
```
1. User → POST /api/auth/signup (email, password)
   → Hash password with bcrypt
   → Save user to database
   → Return access token + refresh token

2. User → POST /api/auth/login (email, password)
   → Verify password
   → Generate JWT access token (15 min expiry)
   → Generate refresh token (7 days expiry)
   → Return tokens

3. Protected Routes → Include JWT in Authorization header
   → JWT Guard validates token
   → Extract user ID from token
   → Proceed to controller

4. Token Refresh → POST /api/auth/refresh (refresh token)
   → Validate refresh token
   → Generate new access token
   → Return new access token
```

**API Endpoints (MVP)**:

**Auth**:
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

**Recipes**:
- `GET /api/recipes` - List user's recipes (paginated, filtered)
- `GET /api/recipes/:id` - Get recipe details
- `POST /api/recipes` - Create recipe
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe
- `POST /api/recipes/:id/favorite` - Toggle favorite

**Collections**:
- `GET /api/collections` - List user's collections
- `GET /api/collections/:id` - Get collection with recipes
- `POST /api/collections` - Create collection
- `PUT /api/collections/:id` - Update collection
- `DELETE /api/collections/:id` - Delete collection
- `POST /api/collections/:id/recipes` - Add recipe to collection
- `DELETE /api/collections/:id/recipes/:recipeId` - Remove recipe

**Meal Plans**:
- `GET /api/meal-plans` - Get user's meal plan (date range)
- `POST /api/meal-plans/schedule` - Schedule recipe for date/meal
- `PUT /api/meal-plans/:id` - Update scheduled meal
- `DELETE /api/meal-plans/:id` - Remove scheduled meal

**Search**:
- `GET /api/search/recipes?q=chicken` - Search recipes by query
- `GET /api/search/recipes?tags=dinner,quick` - Filter by tags

**Error Handling**:
- Consistent error response format
- HTTP status codes (400, 401, 403, 404, 500)
- Validation errors with field details
- Logging for debugging

**Validation**:
- Use `class-validator` decorators on DTOs
- Validate all incoming requests
- Return clear validation error messages

## Database Architecture

### PostgreSQL Schema

**Entity-Relationship Diagram**:

```
┌──────────────────┐         ┌──────────────────┐
│      Users       │         │     Recipes      │
├──────────────────┤         ├──────────────────┤
│ id (PK)          │◄────────┤ id (PK)          │
│ email (unique)   │         │ userId (FK)      │
│ password_hash    │         │ title            │
│ name             │         │ description      │
│ created_at       │         │ servings         │
│ updated_at       │         │ prep_time        │
└──────────────────┘         │ cook_time        │
         │                   │ total_time       │
         │                   │ is_favorite      │
         │                   │ image_url        │
         │                   │ metadata (JSONB) │
         │                   │ created_at       │
         │                   │ updated_at       │
         │                   └──────────────────┘
         │                            │
         │                            │
         │                   ┌────────┴─────────┐
         │                   │                  │
         │                   ▼                  ▼
         │          ┌──────────────────┐ ┌──────────────────┐
         │          │   Ingredients    │ │  Instructions    │
         │          ├──────────────────┤ ├──────────────────┤
         │          │ id (PK)          │ │ id (PK)          │
         │          │ recipeId (FK)    │ │ recipeId (FK)    │
         │          │ name             │ │ step_number      │
         │          │ amount           │ │ instruction      │
         │          │ unit             │ │ time_minutes     │
         │          │ order            │ │ created_at       │
         │          │ created_at       │ └──────────────────┘
         │          └──────────────────┘
         │                   │
         │                   │
         │          ┌────────┴─────────┐
         │          │                  │
         │          ▼                  ▼
         │  ┌──────────────────┐ ┌──────────────────┐
         │  │  RecipeTags      │ │   Tags           │
         │  ├──────────────────┤ ├──────────────────┤
         │  │ recipeId (FK)    │ │ id (PK)          │
         │  │ tagId (FK)       │ │ name (unique)    │
         │  │ created_at       │ │ created_at       │
         │  └──────────────────┘ └──────────────────┘
         │
         │
         ├──────────────────────────────────────────┐
         │                                          │
         ▼                                          ▼
┌──────────────────┐                      ┌──────────────────┐
│   Collections    │                      │   MealPlans      │
├──────────────────┤                      ├──────────────────┤
│ id (PK)          │                      │ id (PK)          │
│ userId (FK)      │                      │ userId (FK)      │
│ name             │                      │ recipeId (FK)    │
│ description      │                      │ scheduled_date   │
│ created_at       │                      │ meal_type        │
│ updated_at       │                      │ servings         │
└──────────────────┘                      │ notes            │
         │                                │ created_at       │
         │                                │ updated_at       │
         │                                └──────────────────┘
         │
         │
         ▼
┌──────────────────┐
│RecipeCollections │
├──────────────────┤
│ recipeId (FK)    │
│ collectionId(FK) │
│ order            │
│ created_at       │
└──────────────────┘
```

**Tables**:

**users**:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
```

**recipes**:
```sql
CREATE TABLE recipes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  servings INTEGER,
  prep_time INTEGER, -- minutes
  cook_time INTEGER, -- minutes
  total_time INTEGER, -- minutes
  is_favorite BOOLEAN DEFAULT FALSE,
  image_url VARCHAR(1000),
  metadata JSONB, -- Flexible storage for nutrition, source URL, etc.
  search_vector TSVECTOR, -- Full-text search
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_recipes_user_id ON recipes(user_id);
CREATE INDEX idx_recipes_is_favorite ON recipes(user_id, is_favorite);
CREATE INDEX idx_recipes_search_vector ON recipes USING GIN(search_vector);
```

**ingredients**:
```sql
CREATE TABLE ingredients (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  amount VARCHAR(50), -- "1", "1.5", "1/2"
  unit VARCHAR(50), -- "cup", "tbsp", "oz", etc.
  "order" INTEGER NOT NULL, -- Display order
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_ingredients_recipe_id ON ingredients(recipe_id);
```

**instructions**:
```sql
CREATE TABLE instructions (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  time_minutes INTEGER, -- Optional timer for step
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_instructions_recipe_id ON instructions(recipe_id);
```

**tags**:
```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_tags_name ON tags(name);
```

**recipe_tags** (Many-to-Many):
```sql
CREATE TABLE recipe_tags (
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (recipe_id, tag_id)
);
CREATE INDEX idx_recipe_tags_recipe_id ON recipe_tags(recipe_id);
CREATE INDEX idx_recipe_tags_tag_id ON recipe_tags(tag_id);
```

**collections**:
```sql
CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_collections_user_id ON collections(user_id);
```

**recipe_collections** (Many-to-Many):
```sql
CREATE TABLE recipe_collections (
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL, -- Display order within collection
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (recipe_id, collection_id)
);
CREATE INDEX idx_recipe_collections_collection_id ON recipe_collections(collection_id);
```

**meal_plans**:
```sql
CREATE TABLE meal_plans (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  meal_type VARCHAR(50) NOT NULL, -- "breakfast", "lunch", "dinner", "snack"
  servings INTEGER,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_meal_plans_user_date ON meal_plans(user_id, scheduled_date);
CREATE INDEX idx_meal_plans_recipe_id ON meal_plans(recipe_id);
```

**Prisma Schema** (See `technical/database-schema.md` for complete Prisma schema file)

### Full-Text Search

**PostgreSQL Full-Text Search (MVP)**:
```sql
-- Add search_vector column to recipes table
ALTER TABLE recipes ADD COLUMN search_vector TSVECTOR;

-- Create GIN index for fast searching
CREATE INDEX idx_recipes_search_vector ON recipes USING GIN(search_vector);

-- Update search_vector on insert/update (trigger)
CREATE OR REPLACE FUNCTION recipes_search_vector_update() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER recipes_search_vector_update_trigger
  BEFORE INSERT OR UPDATE ON recipes
  FOR EACH ROW EXECUTE FUNCTION recipes_search_vector_update();

-- Search query
SELECT * FROM recipes
WHERE search_vector @@ to_tsquery('english', 'chicken & pasta');
```

**Search Strategy**:
- **Title**: Highest weight (A)
- **Description**: Medium weight (B)
- **Ingredients**: Add in Phase 2 (weight C)
- **Tags**: Separate filter (exact match)

**Elasticsearch (Phase 2+)**:
- Migrate to Elasticsearch for advanced features
- Fuzzy matching for typos
- Synonym support
- Relevance tuning
- Aggregations for filters

## Security Architecture

### Authentication Flow

**JWT Authentication with Refresh Tokens**:

```
┌─────────────────────────────────────────────────────────┐
│                    Authentication Flow                   │
└─────────────────────────────────────────────────────────┘

1. SIGNUP/LOGIN
   User → POST /api/auth/signup {email, password}
     → Backend hashes password (bcrypt, 12 rounds)
     → Save user to database
     → Generate Access Token (JWT, 15 min expiry)
        Payload: { userId, email, iat, exp }
     → Generate Refresh Token (JWT, 7 days expiry)
        Payload: { userId, iat, exp, tokenVersion }
     → Save refresh token hash to database
     → Return { accessToken, refreshToken, user }

2. AUTHENTICATED REQUESTS
   User → GET /api/recipes
     → Include Authorization: Bearer <accessToken>
     → JWT Guard validates token
        - Verify signature (secret key)
        - Check expiry
        - Extract userId from payload
     → Proceed to controller with userId

3. TOKEN REFRESH
   User → POST /api/auth/refresh { refreshToken }
     → Validate refresh token
        - Verify signature
        - Check expiry
        - Check token version (for revocation)
     → Generate new access token (15 min)
     → Return { accessToken }

4. LOGOUT
   User → POST /api/auth/logout { refreshToken }
     → Invalidate refresh token (increment token version)
     → Clear tokens from client
```

**Password Security**:
- Bcrypt hashing with 12 rounds
- Minimum password length: 8 characters
- Password requirements: letters + numbers recommended
- Rate limiting on auth endpoints (10 requests/min per IP)

**Token Security**:
- Access tokens: Short-lived (15 minutes)
- Refresh tokens: Longer-lived (7 days)
- Token rotation on refresh
- Token revocation via version check
- Secure HttpOnly cookies for tokens (production)

### Authorization Model

**Role-Based Access Control (Simple)**:

**MVP**: Single role (user)
- Users can only access their own recipes, collections, meal plans
- All operations validated against `userId`

**Future**: Multi-role system
- **User**: Standard user (default)
- **Premium**: Premium subscriber (additional features)
- **Admin**: Platform admin (manage users, content)

**Resource Ownership**:
```typescript
// Example: Check if user owns recipe
async getUserRecipe(userId: number, recipeId: number) {
  const recipe = await this.prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId: userId, // Ensures ownership
    },
  });
  if (!recipe) {
    throw new NotFoundException('Recipe not found');
  }
  return recipe;
}
```

### Data Protection

**Encryption**:
- HTTPS/TLS for all API communication
- Encrypted passwords (bcrypt)
- Encrypted tokens (JWT signed with secret)
- Database connection encrypted (SSL/TLS)

**Input Validation**:
- All inputs validated with `class-validator`
- SQL injection prevention (Prisma parameterized queries)
- XSS prevention (sanitize HTML inputs)
- CSRF protection (CSRF tokens for state-changing requests)

**Rate Limiting**:
- Auth endpoints: 10 requests/min per IP
- API endpoints: 100 requests/min per user
- Search endpoints: 30 requests/min per user

**CORS Configuration**:
- Whitelist frontend domains only
- Credentials allowed for authenticated requests
- Reject cross-origin requests from unknown domains

## Integration Architecture

### External APIs (Phase 2+)

**Recipe Import Service**:
- Use recipe-scraper library for structured extraction
- Support top 10 recipe websites (AllRecipes, Food Network, etc.)
- Fallback to manual import if scraping fails
- Cache parsed recipes to reduce scraping load

**Nutrition API** (Phase 3):
- Edamam Nutrition API or USDA FoodData Central
- Calculate nutrition per ingredient
- Aggregate to recipe-level nutrition
- Cache nutrition data to reduce API calls

**Push Notifications** (Phase 2):
- Expo Push Notifications for mobile
- Web Push API for PWA
- Send meal reminders
- Send cooking timer notifications

### Event-Driven Architecture (Future)

**Events**:
- `RecipeCreated` → Trigger search index update
- `MealPlanned` → Schedule notification
- `RecipeImported` → Parse nutrition data
- `UserUpgradedPremium` → Unlock features

**Event Bus**:
- Use NestJS Event Emitter (simple)
- Migrate to Redis/RabbitMQ for scale (future)

## Infrastructure

### Hosting & Deployment (MVP)

**Frontend (Next.js)**:
- **Platform**: Vercel
- **Features**: Auto-deploy on git push, edge caching, serverless functions
- **Custom Domain**: recipes.example.com
- **SSL**: Automatic (Vercel)

**Backend (NestJS)**:
- **Platform**: Railway or DigitalOcean App Platform
- **Compute**: 1 vCPU, 1GB RAM (scale as needed)
- **Auto-deploy**: On git push (main branch)
- **Environment Variables**: Managed in platform dashboard

**Database (PostgreSQL)**:
- **Platform**: Railway PostgreSQL or DigitalOcean Managed Database
- **Storage**: 10GB SSD (scale as needed)
- **Backups**: Daily automated backups
- **Connection**: SSL/TLS encrypted

**File Storage** (Future):
- Recipe images stored in cloud storage (AWS S3, Cloudflare R2)
- CDN for fast image delivery

### CI/CD Pipeline

**GitHub Actions Workflow**:

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test
      - run: npm run lint

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          token: ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railway/deploy@v1
        with:
          token: ${{ secrets.RAILWAY_TOKEN }}
```

**Deployment Process**:
1. Developer pushes to `main` branch
2. GitHub Actions runs tests and linting
3. If tests pass, deploy frontend to Vercel
4. Deploy backend to Railway
5. Run database migrations (Prisma migrate deploy)

### Monitoring & Logging

**Application Monitoring**:
- **Tool**: Sentry (error tracking)
- **Metrics**: Error rate, response times, user sessions
- **Alerts**: Email/Slack for critical errors

**Infrastructure Monitoring**:
- **Tool**: Vercel Analytics (frontend), Railway metrics (backend)
- **Metrics**: CPU, memory, request rate, response times
- **Alerts**: Email for high CPU/memory usage

**Logging**:
- **Tool**: Winston (structured logging in NestJS)
- **Levels**: Error, Warn, Info, Debug
- **Storage**: Console (development), Cloud logs (production)

**Health Checks**:
- `GET /api/health` - Returns 200 if API is healthy
- `GET /api/health/db` - Returns 200 if database is reachable

### Scaling Strategy

**Horizontal Scaling** (Phase 2+):
- Add more backend instances (load balancer)
- Stateless API design (no session affinity needed)
- Database connection pooling (Prisma)

**Vertical Scaling**:
- Increase CPU/RAM as user base grows
- Database: Increase storage and compute
- Monitor resource usage and scale proactively

**Caching** (Phase 2+):
- Redis for session caching
- CDN for static assets (images, CSS, JS)
- Database query caching (Prisma)

**Database Optimization**:
- Indexes for frequent queries
- Partitioning for large tables (future)
- Read replicas for read-heavy workloads (future)

---

**Last Updated**: 2026-01-23
**Status**: Architecture Defined - Ready for Implementation
**Next Steps**: Database schema implementation, API scaffolding, frontend setup

## Review/Contribution

_This architecture document was reviewed by the expert team. Sign-offs are documented in [EXPERTS.md](EXPERTS.md)._
