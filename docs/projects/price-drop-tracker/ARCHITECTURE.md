# Price Drop Tracker - Architecture

**Status**: Planning  
**Last Updated**: 2026-01-22

---

## System Overview

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
├──────────────────────────────────────────────────────────────────┤
│  Web Dashboard (Next.js)          Mobile App (React Native)      │
│  - Item list view                 - Barcode scanner              │
│  - Price history charts           - Push notifications           │
│  - User settings                  - Offline access               │
└───────────────────┬──────────────────────────────┬───────────────┘
                    │                              │
                    ▼                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                               │
│                      (NestJS Backend)                            │
├──────────────────────────────────────────────────────────────────┤
│  RESTful API Endpoints:                                          │
│  - /auth (register, login, JWT)                                  │
│  - /items (add, delete, list)                                    │
│  - /prices (history, current)                                    │
│  - /alerts (configure, view)                                     │
│  - /watchlists (create, share)                                   │
└───────────────────┬──────────────────────────────┬───────────────┘
                    │                              │
         ┌──────────▼─────────┐        ┌──────────▼──────────┐
         │  PostgreSQL        │        │  Redis Cache        │
         │  - Users           │        │  - Price data       │
         │  - Items           │        │  - Session cache    │
         │  - Prices          │        │  - Job queue        │
         │  - Alerts          │        └─────────────────────┘
         │  - Watchlists      │
         └────────────────────┘
                    │
         ┌──────────▼─────────────────────────────────────────────┐
         │           BACKGROUND JOB PROCESSOR                      │
         │                  (Bull + Redis)                         │
         ├─────────────────────────────────────────────────────────┤
         │  Scheduled Jobs:                                        │
         │  - Price monitoring (daily checks)                      │
         │  - Alert processing (email, push, SMS)                  │
         │  - Data cleanup (old price history)                     │
         │  - Retailer health checks                               │
         └───────────────────┬─────────────────────────────────────┘
                             │
                  ┌──────────▼──────────┐
                  │  Web Scraping       │
                  │  - Amazon           │
                  │  - AliExpress       │
                  │  - Shein            │
                  │  - eBay (Phase 3)   │
                  └─────────────────────┘
```

### System Components

1. **Client Layer**: Web dashboard (Next.js) and mobile app (React Native)
2. **API Gateway**: NestJS backend with RESTful API
3. **Database Layer**: PostgreSQL (primary data), Redis (cache/queue)
4. **Background Jobs**: Bull job processor for scheduled tasks
5. **External Integrations**: Web scraping for retailer price data

### Data Flow

**Item Tracking Flow**:
1. User submits product URL via web/mobile
2. API extracts product data (name, image, price, retailer)
3. Item saved to PostgreSQL
4. Background job scheduled for daily price check
5. User sees item in dashboard

**Price Monitoring Flow**:
1. Scheduled job triggers (6 AM daily)
2. Job fetches item URLs from database
3. Web scraping extracts current prices
4. Prices compared to previous prices (in database)
5. If price drop detected (>10%), alert triggered
6. Alert sent via email/push notification
7. Price history updated in database

---

## Frontend Architecture

### Web Dashboard (Next.js 15)

**Framework**: Next.js 15 (React) with TypeScript

**Pages Structure**:
```
/app
  /page.tsx                    # Homepage (landing page)
  /dashboard
    /page.tsx                  # Main dashboard (item list)
    /item/[id]/page.tsx        # Item detail (price history)
  /auth
    /login/page.tsx            # Login page
    /register/page.tsx         # Registration page
  /settings
    /page.tsx                  # User settings (alert preferences)
  /watchlists
    /page.tsx                  # Watchlist management
```

**Component Structure**:
```
/components
  /ui                          # shadcn/ui components
    /button.tsx
    /card.tsx
    /chart.tsx
  /features
    /ItemCard.tsx              # Item card (name, image, price)
    /PriceChart.tsx            # Price history chart (Recharts)
    /AlertSettings.tsx         # Alert configuration
    /WatchlistManager.tsx      # Watchlist CRUD
  /layout
    /Header.tsx                # Navigation header
    /Sidebar.tsx               # Dashboard sidebar
    /Footer.tsx                # Site footer
```

**State Management**:
- **React Context**: Global state (user, auth)
- **SWR**: Data fetching, caching, revalidation
- **Local Storage**: User preferences (theme, alert settings)

**Styling**:
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Pre-built accessible components
- **Responsive Design**: Mobile-first approach

**Data Fetching**:
```typescript
// Example: Fetching user items with SWR
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function Dashboard() {
  const { data: items, error, mutate } = useSWR('/api/items', fetcher);

  if (error) return <div>Failed to load items</div>;
  if (!items) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}
```

### Mobile App (React Native + Expo)

**Framework**: React Native with Expo

**Screen Structure**:
```
/screens
  /HomeScreen.tsx              # Dashboard (item list)
  /ItemDetailScreen.tsx        # Item detail (price history)
  /BarcodeScreen.tsx           # Barcode scanner
  /AlertsScreen.tsx            # Alert history
  /SettingsScreen.tsx          # User settings
```

**Navigation**:
- **React Navigation**: Tab navigation (bottom tabs)
- **Stack Navigation**: Screen transitions

**Key Features**:
```typescript
// Barcode Scanning
import { BarCodeScanner } from 'expo-barcode-scanner';

function BarcodeScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    // Lookup product by barcode UPC
    const product = await fetch(`/api/products/barcode/${data}`).then(res => res.json());
    // Add to tracking
  };

  return <BarCodeScanner onBarCodeScanned={handleBarCodeScanned} />;
}
```

**Push Notifications**:
```typescript
// Firebase Cloud Messaging (FCM)
import * as Notifications from 'expo-notifications';

async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    alert('Failed to get push token for notifications!');
    return;
  }
  
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  // Send token to backend for storage
  await fetch('/api/users/push-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token })
  });
}
```

**Offline Support**:
- **AsyncStorage**: Cache item data for offline access
- **Background Sync**: Sync changes when online

---

## Backend Architecture

### NestJS Framework

**Module Structure**:
```
/src
  /auth
    /auth.module.ts            # Authentication module
    /auth.controller.ts        # Auth endpoints (login, register)
    /auth.service.ts           # Auth logic (JWT, bcrypt)
    /jwt.strategy.ts           # JWT validation strategy
  /users
    /users.module.ts           # User management
    /users.controller.ts       # User endpoints
    /users.service.ts          # User CRUD operations
  /items
    /items.module.ts           # Item tracking
    /items.controller.ts       # Item endpoints (add, delete, list)
    /items.service.ts          # Item business logic
  /prices
    /prices.module.ts          # Price monitoring
    /prices.service.ts         # Price history logic
    /scraper.service.ts        # Web scraping logic
  /alerts
    /alerts.module.ts          # Alert system
    /alerts.controller.ts      # Alert configuration
    /alerts.service.ts         # Alert processing
    /email.service.ts          # Email sending (SendGrid)
    /push.service.ts           # Push notifications (FCM)
  /jobs
    /jobs.module.ts            # Background jobs
    /price-monitor.processor.ts # Price monitoring job
    /alert.processor.ts        # Alert sending job
  /watchlists
    /watchlists.module.ts      # Watchlist management
    /watchlists.controller.ts  # Watchlist CRUD
    /watchlists.service.ts     # Watchlist logic
```

### API Design (REST)

**Authentication Endpoints**:
```
POST   /api/auth/register      # User registration
POST   /api/auth/login         # User login (returns JWT)
POST   /api/auth/logout        # User logout
GET    /api/auth/profile       # Get current user profile
```

**Item Endpoints**:
```
GET    /api/items              # List user's tracked items
POST   /api/items              # Add new item to track
GET    /api/items/:id          # Get item details
DELETE /api/items/:id          # Delete tracked item
PATCH  /api/items/:id/check    # Manually trigger price check
```

**Price Endpoints**:
```
GET    /api/items/:id/prices   # Get price history for item
GET    /api/items/:id/prices/current # Get current price
```

**Alert Endpoints**:
```
GET    /api/alerts             # List user's alerts
POST   /api/alerts             # Create alert configuration
PATCH  /api/alerts/:id         # Update alert settings
DELETE /api/alerts/:id         # Delete alert
```

**Watchlist Endpoints**:
```
GET    /api/watchlists         # List user's watchlists
POST   /api/watchlists         # Create watchlist
GET    /api/watchlists/:id     # Get watchlist items
PATCH  /api/watchlists/:id     # Update watchlist
DELETE /api/watchlists/:id     # Delete watchlist
POST   /api/watchlists/:id/share # Share watchlist
```

### Authentication Flow

**JWT-Based Authentication**:

```typescript
// auth.service.ts
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string) {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await this.usersService.create({
      email,
      password: hashedPassword
    });
    
    // Generate JWT
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    
    return { user, token };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    
    return { user, token };
  }
}
```

**Protected Routes**:
```typescript
// items.controller.ts
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('items')
@UseGuards(JwtAuthGuard)  // Protect all routes
export class ItemsController {
  @Get()
  async findAll(@Request() req) {
    return this.itemsService.findByUserId(req.user.id);
  }
}
```

### Business Logic

**Item Tracking Service**:
```typescript
// items.service.ts
@Injectable()
export class ItemsService {
  constructor(
    private prisma: PrismaService,
    private scraperService: ScraperService,
    private jobQueue: PriceMonitorQueue
  ) {}

  async addItem(userId: string, url: string) {
    // Extract product data from URL
    const productData = await this.scraperService.extractProductData(url);
    
    // Save item to database
    const item = await this.prisma.item.create({
      data: {
        userId,
        url,
        name: productData.name,
        image: productData.image,
        retailer: productData.retailer,
        currentPrice: productData.price
      }
    });
    
    // Create initial price history record
    await this.prisma.price.create({
      data: {
        itemId: item.id,
        price: productData.price,
        timestamp: new Date()
      }
    });
    
    // Schedule daily price monitoring job
    await this.jobQueue.add('monitor-price', {
      itemId: item.id
    }, {
      repeat: { cron: '0 6 * * *' }  // Daily at 6 AM
    });
    
    return item;
  }
}
```

**Price Monitoring Service**:
```typescript
// prices.service.ts
@Injectable()
export class PricesService {
  constructor(
    private prisma: PrismaService,
    private scraperService: ScraperService,
    private alertsService: AlertsService
  ) {}

  async checkPrice(itemId: string) {
    const item = await this.prisma.item.findUnique({ where: { id: itemId } });
    
    // Scrape current price
    const currentPrice = await this.scraperService.getPrice(item.url);
    
    // Get last price
    const lastPrice = await this.prisma.price.findFirst({
      where: { itemId },
      orderBy: { timestamp: 'desc' }
    });
    
    // Save new price
    await this.prisma.price.create({
      data: {
        itemId,
        price: currentPrice,
        timestamp: new Date()
      }
    });
    
    // Check for price drop (>10% drop threshold)
    if (lastPrice && currentPrice < lastPrice.price * 0.9) {
      await this.alertsService.sendPriceDropAlert(item, lastPrice.price, currentPrice);
    }
    
    // Update item current price
    await this.prisma.item.update({
      where: { id: itemId },
      data: { currentPrice }
    });
  }
}
```

---

## Infrastructure

### Hosting & Deployment

**MVP (DigitalOcean)**:
- **App Platform**: Automatic deployment from GitHub
- **Managed PostgreSQL**: Database hosting with automated backups
- **Managed Redis**: Cache and job queue
- **Spaces (S3)**: Product image storage

**Post-MVP (AWS)**:
- **ECS (Elastic Container Service)**: Docker container orchestration
- **RDS (PostgreSQL)**: Scalable database
- **ElastiCache (Redis)**: High-performance caching
- **S3**: Object storage
- **CloudFront**: CDN for static assets

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
        with:
          node-version: '20'
      - run: npm install
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to DigitalOcean
        uses: digitalocean/app_action@v1
        with:
          app_name: price-drop-tracker
          token: ${{ secrets.DIGITALOCEAN_TOKEN }}
```

### Monitoring & Logging

**Error Tracking**: Sentry
```typescript
// main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Logging**: Winston
```typescript
// logger.service.ts
import * as winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

**Monitoring**: DigitalOcean Monitoring Dashboard
- CPU usage
- Memory usage
- Request rate
- Response time
- Error rate

---

## Security Architecture

### Authentication

**JWT (JSON Web Tokens)**:
- **Algorithm**: HS256 (HMAC with SHA-256)
- **Expiration**: 7 days
- **Refresh**: Automatic refresh on API requests
- **Storage**: httpOnly cookies (web), SecureStore (mobile)

**Password Security**:
- **Hashing**: bcrypt with salt rounds = 10
- **Validation**: Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number
- **Reset**: Email-based password reset flow

### Authorization

**Role-Based Access Control (RBAC)**:
```typescript
enum Role {
  USER = 'user',
  ADMIN = 'admin'
}

// Roles stored in user table
// Middleware checks role before allowing access to admin endpoints
```

### Data Encryption

**In Transit**: TLS 1.3 (HTTPS)
**At Rest**: 
- Database encryption (managed by DigitalOcean/AWS)
- API keys encrypted with AES-256

### Security Best Practices

1. **Input Validation**: Validate all user inputs (joi, class-validator)
2. **SQL Injection Prevention**: Prisma ORM with parameterized queries
3. **CSRF Protection**: CSRF tokens for state-changing operations
4. **Rate Limiting**: Prevent abuse (10 requests/minute per IP)
5. **CORS**: Restrict origins to known domains
6. **Secrets Management**: Environment variables, never commit secrets

---

## Data Architecture

### Database Schema (PostgreSQL)

**Users Table**:
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  subscription_tier VARCHAR(50) DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Items Table**:
```sql
CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  image TEXT,
  retailer VARCHAR(100) NOT NULL,
  current_price DECIMAL(10, 2),
  target_price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_retailer (retailer)
);
```

**Prices Table** (Price History):
```sql
CREATE TABLE prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  price DECIMAL(10, 2) NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_item_id_timestamp (item_id, timestamp DESC)
);
```

**Alerts Table**:
```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'price_drop', 'target_price', 'stock'
  threshold DECIMAL(10, 2),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id),
  INDEX idx_item_id (item_id)
);
```

**Watchlists Table**:
```sql
CREATE TABLE watchlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  
  INDEX idx_user_id (user_id)
);

CREATE TABLE watchlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  added_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(watchlist_id, item_id)
);
```

### Prisma Schema

```prisma
model User {
  id                String   @id @default(uuid())
  email             String   @unique
  password          String
  role              String   @default("user")
  subscriptionTier  String   @default("free") @map("subscription_tier")
  items             Item[]
  alerts            Alert[]
  watchlists        Watchlist[]
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Item {
  id           String   @id @default(uuid())
  userId       String   @map("user_id")
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  url          String
  name         String
  image        String?
  retailer     String
  currentPrice Decimal? @map("current_price") @db.Decimal(10, 2)
  targetPrice  Decimal? @map("target_price") @db.Decimal(10, 2)
  prices       Price[]
  alerts       Alert[]
  watchlistItems WatchlistItem[]
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")

  @@index([userId])
  @@index([retailer])
  @@map("items")
}

model Price {
  id        String   @id @default(uuid())
  itemId    String   @map("item_id")
  item      Item     @relation(fields: [itemId], references: [id], onDelete: Cascade)
  price     Decimal  @db.Decimal(10, 2)
  timestamp DateTime @default(now())

  @@index([itemId, timestamp])
  @@map("prices")
}

model Alert {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  itemId    String   @map("item_id")
  item      Item     @relation(fields: [itemId], references: [id], onDelete: Cascade)
  type      String   // 'price_drop', 'target_price', 'stock'
  threshold Decimal? @db.Decimal(10, 2)
  enabled   Boolean  @default(true)
  createdAt DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@index([itemId])
  @@map("alerts")
}

model Watchlist {
  id        String   @id @default(uuid())
  userId    String   @map("user_id")
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name      String
  items     WatchlistItem[]
  createdAt DateTime @default(now()) @map("created_at")

  @@index([userId])
  @@map("watchlists")
}

model WatchlistItem {
  id           String    @id @default(uuid())
  watchlistId  String    @map("watchlist_id")
  watchlist    Watchlist @relation(fields: [watchlistId], references: [id], onDelete: Cascade)
  itemId       String    @map("item_id")
  item         Item      @relation(fields: [itemId], references: [id], onDelete: Cascade)
  addedAt      DateTime  @default(now()) @map("added_at")

  @@unique([watchlistId, itemId])
  @@map("watchlist_items")
}
```

### Data Relationships

```
users (1) ──────── (many) items
users (1) ──────── (many) alerts
users (1) ──────── (many) watchlists

items (1) ──────── (many) prices (price history)
items (1) ──────── (many) alerts

watchlists (1) ─── (many) watchlist_items ─── (many) items (many-to-many)
```

---

## Integration Architecture

### Web Scraping (Price Extraction)

**Cheerio** (Lightweight HTML Parsing):
```typescript
// scraper.service.ts
import axios from 'axios';
import * as cheerio from 'cheerio';

@Injectable()
export class ScraperService {
  async getPrice(url: string): Promise<number> {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PriceDropTracker/1.0)'
      }
    });
    
    const $ = cheerio.load(html);
    
    // Amazon price selector
    if (url.includes('amazon.com')) {
      const priceText = $('#priceblock_ourprice').text() || $('.a-price-whole').first().text();
      return parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }
    
    // AliExpress price selector
    if (url.includes('aliexpress.com')) {
      const priceText = $('.product-price-value').text();
      return parseFloat(priceText.replace(/[^0-9.]/g, ''));
    }
    
    throw new Error('Unsupported retailer');
  }

  async extractProductData(url: string) {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    
    // Extract name, image, price based on retailer
    // ... (retailer-specific logic)
    
    return {
      name: 'Product Name',
      image: 'https://...',
      price: 99.99,
      retailer: 'Amazon'
    };
  }
}
```

**Puppeteer** (For JavaScript-Rendered Pages):
```typescript
// scraper.service.ts
import puppeteer from 'puppeteer';

async function getPriceWithPuppeteer(url: string): Promise<number> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  const price = await page.$eval('.price-selector', el => el.textContent);
  
  await browser.close();
  
  return parseFloat(price.replace(/[^0-9.]/g, ''));
}
```

### Third-Party Integrations

**SendGrid** (Email Alerts):
```typescript
// email.service.ts
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendPriceDropAlert(user: User, item: Item, oldPrice: number, newPrice: number) {
    const msg = {
      to: user.email,
      from: 'alerts@pricedroptracker.com',
      subject: `Price Drop Alert: ${item.name}`,
      html: `
        <h2>Price Drop Detected!</h2>
        <p><strong>${item.name}</strong> has dropped in price:</p>
        <p>Old Price: $${oldPrice.toFixed(2)}</p>
        <p>New Price: $${newPrice.toFixed(2)}</p>
        <p>Savings: $${(oldPrice - newPrice).toFixed(2)} (${((1 - newPrice/oldPrice) * 100).toFixed(0)}% off)</p>
        <a href="${item.url}">View Product</a>
      `
    };
    
    await sgMail.send(msg);
  }
}
```

**Firebase Cloud Messaging** (Push Notifications):
```typescript
// push.service.ts
import * as admin from 'firebase-admin';

@Injectable()
export class PushService {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(process.env.FIREBASE_CREDENTIALS)
    });
  }

  async sendPriceDropNotification(userToken: string, item: Item, newPrice: number) {
    const message = {
      token: userToken,
      notification: {
        title: 'Price Drop Alert!',
        body: `${item.name} is now $${newPrice.toFixed(2)}`
      },
      data: {
        itemId: item.id,
        url: item.url
      }
    };
    
    await admin.messaging().send(message);
  }
}
```

**Stripe** (Payment Processing - Premium Tier):
```typescript
// stripe.service.ts
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });
  }

  async createSubscription(userId: string, email: string) {
    const customer = await this.stripe.customers.create({ email });
    
    const subscription = await this.stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PRICE_ID }] // $9.99/month
    });
    
    return subscription;
  }
}
```

---

## Scaling Strategy

### Vertical Scaling (MVP → 10K Users)
- Increase server resources (CPU, RAM)
- Optimize database queries (indexing)
- Implement caching (Redis)

### Horizontal Scaling (10K+ Users)
- Load balancing (multiple API instances)
- Database read replicas
- Redis cluster (distributed cache)
- CDN for static assets (CloudFront)

### Performance Optimization
- **Database**: Connection pooling, query optimization, indexes
- **Caching**: Redis cache for hot data (price data, user sessions)
- **Background Jobs**: Parallel processing, job prioritization
- **API**: Response compression, pagination, lazy loading

---

**Last Updated**: 2026-01-22  
**Status**: Planning (Comprehensive Architecture Complete)  
**Next Steps**: Expert review, database setup, API implementation
