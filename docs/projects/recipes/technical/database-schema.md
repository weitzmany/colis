# Database Schema - Recipes

## Overview

Complete PostgreSQL database schema for the Recipes application, including all tables, relationships, indexes, and Prisma schema definition.

## Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// USER MANAGEMENT
// ============================================

model User {
  id            Int      @id @default(autoincrement())
  email         String   @unique @db.VarChar(255)
  passwordHash  String   @map("password_hash") @db.VarChar(255)
  name          String?  @db.VarChar(255)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  recipes       Recipe[]
  collections   Collection[]
  mealPlans     MealPlan[]

  @@index([email])
  @@map("users")
}

// ============================================
// RECIPES
// ============================================

model Recipe {
  id            Int      @id @default(autoincrement())
  userId        Int      @map("user_id")
  title         String   @db.VarChar(500)
  description   String?  @db.Text
  servings      Int?
  prepTime      Int?     @map("prep_time") // minutes
  cookTime      Int?     @map("cook_time") // minutes
  totalTime     Int?     @map("total_time") // minutes
  isFavorite    Boolean  @default(false) @map("is_favorite")
  imageUrl      String?  @map("image_url") @db.VarChar(1000)
  metadata      Json?    @db.JsonB // Flexible storage for nutrition, source URL, etc.
  searchVector  Unsupported("tsvector")? @map("search_vector") // Full-text search
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  ingredients   Ingredient[]
  instructions  Instruction[]
  tags          RecipeTag[]
  collections   RecipeCollection[]
  mealPlans     MealPlan[]

  @@index([userId])
  @@index([userId, isFavorite])
  @@map("recipes")
}

// ============================================
// INGREDIENTS
// ============================================

model Ingredient {
  id        Int      @id @default(autoincrement())
  recipeId  Int      @map("recipe_id")
  name      String   @db.VarChar(255)
  amount    String?  @db.VarChar(50) // "1", "1.5", "1/2"
  unit      String?  @db.VarChar(50) // "cup", "tbsp", "oz"
  order     Int      // Display order
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  recipe    Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@index([recipeId])
  @@map("ingredients")
}

// ============================================
// INSTRUCTIONS
// ============================================

model Instruction {
  id          Int      @id @default(autoincrement())
  recipeId    Int      @map("recipe_id")
  stepNumber  Int      @map("step_number")
  instruction String   @db.Text
  timeMinutes Int?     @map("time_minutes") // Optional timer for step
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  recipe      Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@index([recipeId])
  @@map("instructions")
}

// ============================================
// TAGS
// ============================================

model Tag {
  id        Int      @id @default(autoincrement())
  name      String   @unique @db.VarChar(100)
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  recipes   RecipeTag[]

  @@index([name])
  @@map("tags")
}

// Many-to-Many: Recipes <-> Tags
model RecipeTag {
  recipeId  Int      @map("recipe_id")
  tagId     Int      @map("tag_id")
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  recipe    Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([recipeId, tagId])
  @@index([recipeId])
  @@index([tagId])
  @@map("recipe_tags")
}

// ============================================
// COLLECTIONS
// ============================================

model Collection {
  id          Int      @id @default(autoincrement())
  userId      Int      @map("user_id")
  name        String   @db.VarChar(255)
  description String?  @db.Text
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  recipes     RecipeCollection[]

  @@index([userId])
  @@map("collections")
}

// Many-to-Many: Recipes <-> Collections
model RecipeCollection {
  recipeId     Int      @map("recipe_id")
  collectionId Int      @map("collection_id")
  order        Int      // Display order within collection
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  recipe       Recipe     @relation(fields: [recipeId], references: [id], onDelete: Cascade)
  collection   Collection @relation(fields: [collectionId], references: [id], onDelete: Cascade)

  @@id([recipeId, collectionId])
  @@index([collectionId])
  @@map("recipe_collections")
}

// ============================================
// MEAL PLANS
// ============================================

model MealPlan {
  id            Int      @id @default(autoincrement())
  userId        Int      @map("user_id")
  recipeId      Int      @map("recipe_id")
  scheduledDate DateTime @map("scheduled_date") @db.Date
  mealType      String   @map("meal_type") @db.VarChar(50) // "breakfast", "lunch", "dinner", "snack"
  servings      Int?
  notes         String?  @db.Text
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Relations
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  recipe        Recipe   @relation(fields: [recipeId], references: [id], onDelete: Cascade)

  @@index([userId, scheduledDate])
  @@index([recipeId])
  @@map("meal_plans")
}
```

## SQL Schema (Raw PostgreSQL)

### Create Tables

```sql
-- ============================================
-- USER MANAGEMENT
-- ============================================

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- RECIPES
-- ============================================

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

-- Full-text search trigger
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

-- ============================================
-- INGREDIENTS
-- ============================================

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

-- ============================================
-- INSTRUCTIONS
-- ============================================

CREATE TABLE instructions (
  id SERIAL PRIMARY KEY,
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  instruction TEXT NOT NULL,
  time_minutes INTEGER, -- Optional timer for step
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_instructions_recipe_id ON instructions(recipe_id);

-- ============================================
-- TAGS
-- ============================================

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tags_name ON tags(name);

-- Many-to-Many: Recipes <-> Tags
CREATE TABLE recipe_tags (
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (recipe_id, tag_id)
);

CREATE INDEX idx_recipe_tags_recipe_id ON recipe_tags(recipe_id);
CREATE INDEX idx_recipe_tags_tag_id ON recipe_tags(tag_id);

-- ============================================
-- COLLECTIONS
-- ============================================

CREATE TABLE collections (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_collections_user_id ON collections(user_id);

-- Many-to-Many: Recipes <-> Collections
CREATE TABLE recipe_collections (
  recipe_id INTEGER NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  collection_id INTEGER NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  "order" INTEGER NOT NULL, -- Display order within collection
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (recipe_id, collection_id)
);

CREATE INDEX idx_recipe_collections_collection_id ON recipe_collections(collection_id);

-- ============================================
-- MEAL PLANS
-- ============================================

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

## Sample Data

```sql
-- Insert sample user
INSERT INTO users (email, password_hash, name) VALUES
('sarah@example.com', '$2b$12$hashed_password_here', 'Sarah Johnson');

-- Insert sample recipe
INSERT INTO recipes (user_id, title, description, servings, prep_time, cook_time, total_time, is_favorite, image_url) VALUES
(1, 'Chicken Alfredo', 'Creamy Alfredo pasta with grilled chicken', 4, 15, 25, 40, true, 'https://example.com/chicken-alfredo.jpg');

-- Insert ingredients
INSERT INTO ingredients (recipe_id, name, amount, unit, "order") VALUES
(1, 'chicken breast', '1', 'lb', 1),
(1, 'fettuccine pasta', '1', 'lb', 2),
(1, 'heavy cream', '2', 'cups', 3),
(1, 'Parmesan cheese, grated', '1', 'cup', 4),
(1, 'garlic, minced', '2', 'cloves', 5),
(1, 'olive oil', '2', 'tbsp', 6),
(1, 'salt and pepper', '', 'to taste', 7);

-- Insert instructions
INSERT INTO instructions (recipe_id, step_number, instruction, time_minutes) VALUES
(1, 1, 'Bring a large pot of salted water to a boil. Cook fettuccine according to package directions.', 10),
(1, 2, 'Heat olive oil in a large skillet over medium-high heat. Add garlic and cook until fragrant, about 1 minute.', 1),
(1, 3, 'Add chicken and season with salt and pepper. Cook until golden and cooked through, about 6-8 minutes per side.', 15),
(1, 4, 'Remove chicken and let rest. Add heavy cream to skillet and bring to a simmer.', 3),
(1, 5, 'Stir in Parmesan cheese until melted and smooth.', 2),
(1, 6, 'Slice chicken and toss pasta with Alfredo sauce. Top with chicken and serve.', NULL);

-- Insert tags
INSERT INTO tags (name) VALUES ('dinner'), ('italian'), ('pasta'), ('chicken'), ('family-friendly');

-- Link recipe to tags
INSERT INTO recipe_tags (recipe_id, tag_id) VALUES (1, 1), (1, 2), (1, 3), (1, 4), (1, 5);

-- Insert collection
INSERT INTO collections (user_id, name, description) VALUES
(1, 'Family Favorites', 'Recipes the whole family loves');

-- Link recipe to collection
INSERT INTO recipe_collections (recipe_id, collection_id, "order") VALUES (1, 1, 1);

-- Insert meal plan
INSERT INTO meal_plans (user_id, recipe_id, scheduled_date, meal_type, servings) VALUES
(1, 1, '2026-01-25', 'dinner', 4);
```

## Common Queries

### Get User's Recipes with Tags

```sql
SELECT 
  r.id,
  r.title,
  r.servings,
  r.total_time,
  r.is_favorite,
  r.image_url,
  ARRAY_AGG(t.name) AS tags
FROM recipes r
LEFT JOIN recipe_tags rt ON r.id = rt.recipe_id
LEFT JOIN tags t ON rt.tag_id = t.id
WHERE r.user_id = $1
GROUP BY r.id
ORDER BY r.created_at DESC
LIMIT 20 OFFSET $2;
```

### Full-Text Search Recipes

```sql
SELECT 
  id,
  title,
  description,
  ts_rank(search_vector, query) AS rank
FROM recipes,
  to_tsquery('english', 'chicken & pasta') query
WHERE user_id = $1 AND search_vector @@ query
ORDER BY rank DESC
LIMIT 20;
```

### Get Recipe with Ingredients and Instructions

```sql
SELECT 
  r.*,
  json_agg(DISTINCT jsonb_build_object(
    'id', i.id,
    'name', i.name,
    'amount', i.amount,
    'unit', i.unit,
    'order', i.order
  ) ORDER BY i.order) AS ingredients,
  json_agg(DISTINCT jsonb_build_object(
    'id', inst.id,
    'stepNumber', inst.step_number,
    'instruction', inst.instruction,
    'timeMinutes', inst.time_minutes
  ) ORDER BY inst.step_number) AS instructions
FROM recipes r
LEFT JOIN ingredients i ON r.id = i.recipe_id
LEFT JOIN instructions inst ON r.id = inst.recipe_id
WHERE r.id = $1 AND r.user_id = $2
GROUP BY r.id;
```

### Get User's Meal Plan for Week

```sql
SELECT 
  mp.id,
  mp.scheduled_date,
  mp.meal_type,
  mp.servings,
  mp.notes,
  r.id AS recipe_id,
  r.title AS recipe_title,
  r.image_url AS recipe_image
FROM meal_plans mp
JOIN recipes r ON mp.recipe_id = r.id
WHERE mp.user_id = $1 
  AND mp.scheduled_date BETWEEN $2 AND $3
ORDER BY mp.scheduled_date, 
  CASE mp.meal_type
    WHEN 'breakfast' THEN 1
    WHEN 'lunch' THEN 2
    WHEN 'dinner' THEN 3
    WHEN 'snack' THEN 4
  END;
```

---

**Last Updated**: 2026-01-23
**Status**: Schema Complete - Ready for Implementation
**Prisma Version**: 5.x

## Review/Contribution

**Reviewed by**:
- Benjamin Lee (Database) - ✅ Schema design, indexes, relationships - 2026-01-23
- Samuel Rodriguez (Backend) - ✅ Prisma schema, API compatibility - 2026-01-23
- James Martinez (Performance) - ✅ Index optimization, query performance - 2026-01-23

**Status**: ✅ Approved - 2026-01-23
