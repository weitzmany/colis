# Technical: Database Schema

## Overview
PostgreSQL stores users, packages, status history, and notification preferences. Prisma manages schema and migrations.

## Tables

### users
- `id` (UUID, primary key)
- `email` (unique)
- `password_hash`
- `email_verified`
- `tier` (free, premium)
- `created_at`, `updated_at`

### packages
- `id` (UUID)
- `user_id` (FK)
- `tracking_number`
- `carrier`
- `status`
- `estimated_delivery`
- `note`
- `archived`
- `created_at`, `updated_at`

### status_history
- `id` (UUID)
- `package_id` (FK)
- `status`
- `message`
- `location`
- `timestamp`

### notification_preferences
- `id` (UUID)
- `user_id` (unique FK)
- `email_alerts`
- `out_for_delivery_alert`
- `delivered_alert`
- `delay_alert`

## Prisma Schema (Excerpt)
```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String   @map("password_hash")
  emailVerified Boolean  @default(false) @map("email_verified")
  tier          Tier     @default(FREE)
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  packages    Package[]
  preferences NotificationPreferences?

  @@map("users")
}
```

## Indexes
- `users.email` (unique)
- `packages.user_id`
- `packages.status`
- `status_history.package_id`
- `status_history.timestamp`

## Data Retention
- Delivered packages: 90 days (free), unlimited (premium)
- Status history: 90 days (free), unlimited (premium)
- Archived packages: 1 year

## Backups
- Daily automated backups
- 30-day retention policy
