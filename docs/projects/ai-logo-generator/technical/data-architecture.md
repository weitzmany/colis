# AI Logo Generator - Data Architecture

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  subscription_tier ENUM('free', 'paid', 'subscriber') DEFAULT 'free',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
);
```

### Logo Generations Table
```sql
CREATE TABLE logo_generations (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  prompt_data JSON NOT NULL,
  optimized_prompt TEXT,
  image_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500),
  status ENUM('generating', 'completed', 'failed') DEFAULT 'generating',
  ai_model VARCHAR(50) DEFAULT 'dalle3',
  generation_time_ms INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_created (user_id, created_at DESC)
);
```

### Payments Table
```sql
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  logo_id VARCHAR(36),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  amount_cents INT NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (logo_id) REFERENCES logo_generations(id) ON DELETE SET NULL,
  INDEX idx_user_status (user_id, status),
  INDEX idx_stripe_id (stripe_payment_intent_id)
);
```

### Subscription Plans Table (Post-MVP)
```sql
CREATE TABLE subscription_plans (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price_cents INT NOT NULL,
  billing_interval ENUM('monthly', 'yearly') NOT NULL,
  logo_limit INT,
  features JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Data Relationships
```
users (1) --------< (M) logo_generations
  |
  |--------------< (M) payments
  |
  |--------------< (1) user_subscriptions (post-MVP)
```

## Data Flow
### Logo Generation
1. User submits description (frontend)
2. API validates and optimizes prompt (backend)
3. AI generates images (OpenAI/Stability)
4. Images stored in S3 (backend)
5. Generation record saved (database)
6. URLs returned to frontend

### Payments
1. User initiates purchase (frontend)
2. API creates payment intent (Stripe)
3. User completes payment (Stripe checkout)
4. Stripe webhook updates backend
5. Payment status updated in database
6. High-res access granted
