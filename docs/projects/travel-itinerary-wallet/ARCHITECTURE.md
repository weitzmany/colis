# Travel Itinerary & Document Wallet - Architecture

**Status**: Planning  
**Last Updated**: 2026-01-21

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
├──────────────────────────┬──────────────────────────────────────┤
│   Web App (Next.js)      │   Mobile App (React Native + Expo)   │
│   - Responsive UI        │   - iOS & Android                     │
│   - Dashboard            │   - Offline-first                     │
│   - Trip Management      │   - Push Notifications                │
└──────────────────────────┴──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API Layer                               │
│                   NestJS Backend (RESTful API)                   │
│   - Authentication (JWT)                                         │
│   - Trip Management                                              │
│   - Document Management                                          │
│   - Alert Management                                             │
└─────────────────────────────────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    ▼                     ▼
┌─────────────────────────┐   ┌──────────────────────────────┐
│   Data Layer             │   │   Background Jobs             │
│   - PostgreSQL           │   │   - Bull + Redis              │
│   - Prisma ORM           │   │   - Alert Scheduler           │
│   - Trips, Documents,    │   │   - Email Notifications       │
│     Users, Reservations  │   │   - Push Notifications        │
└─────────────────────────┘   └──────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                        File Storage                              │
│                  AWS S3 / DigitalOcean Spaces                    │
│   - Document files (passports, visas, tickets, insurance)       │
│   - AES-256 encryption at rest                                  │
│   - Secure pre-signed URLs for access                           │
└─────────────────────────────────────────────────────────────────┘
```

### System Components

**Frontend**:
- **Web App**: Next.js 15 (React) with TypeScript for desktop/mobile web
- **Mobile App**: React Native with Expo for native iOS/Android apps
- **UI Components**: shadcn/ui for consistent design system

**Backend**:
- **API Server**: NestJS framework with RESTful API endpoints
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Business Logic**: Trip management, document management, alert management

**Data Storage**:
- **Database**: PostgreSQL 16 for structured data (trips, users, documents metadata)
- **File Storage**: AWS S3 or DigitalOcean Spaces for document files
- **Cache**: Redis for background job queue and caching

**Background Services**:
- **Job Queue**: Bull + Redis for scheduled alerts and background tasks
- **Notifications**: Email (SendGrid/SES) and Push (FCM) for alerts

### Data Flow

**Trip Creation Flow**:
1. User creates trip via web/mobile app
2. Frontend sends POST request to `/api/trips`
3. Backend validates data and saves to PostgreSQL
4. Backend schedules alert jobs in Bull queue
5. Response sent back to frontend
6. Mobile app syncs data to AsyncStorage for offline access

**Document Upload Flow**:
1. User uploads document (passport, visa, etc.)
2. Frontend sends file to `/api/documents/upload`
3. Backend encrypts file (AES-256)
4. Backend uploads encrypted file to S3/Spaces
5. Backend saves document metadata to PostgreSQL
6. Backend generates secure pre-signed URL
7. Response sent to frontend with document metadata

**Alert Flow**:
1. Bull scheduler checks for upcoming events (every 5 minutes)
2. Identifies trips with events in next 24 hours
3. Creates alert jobs (email, push notification)
4. Email sent via SendGrid/SES
5. Push notification sent via FCM
6. Alert status logged in database

---

## Frontend Architecture

### Web Application (Next.js)

**Technology Stack**:
- Next.js 15 (App Router) with TypeScript
- React 18 with Server Components and Client Components
- Tailwind CSS for styling
- shadcn/ui for UI components
- React Hook Form + Zod for form validation
- SWR for data fetching and caching
- Date-fns for date manipulation

**Project Structure**:
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── trips/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── documents/
│   │   │   └── page.tsx
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   └── [...routes]/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn/ui components)
│   ├── trips/
│   │   ├── TripCard.tsx
│   │   ├── TripItinerary.tsx
│   │   └── TripForm.tsx
│   ├── documents/
│   │   ├── DocumentUpload.tsx
│   │   └── DocumentList.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/
│   ├── api.ts (API client)
│   ├── auth.ts (Auth helpers)
│   └── utils.ts
├── hooks/
│   ├── useTrips.ts
│   ├── useDocuments.ts
│   └── useAuth.ts
└── types/
    ├── trip.ts
    ├── document.ts
    └── user.ts
```

**State Management**:
- **Server State**: SWR for data fetching, caching, revalidation
- **Client State**: React Context for global state (user, theme)
- **Form State**: React Hook Form for complex forms
- **URL State**: Next.js router for navigation state

**Key Features**:
- **Server-Side Rendering (SSR)**: Trip list page, trip detail page
- **Client-Side Rendering (CSR)**: Interactive itinerary builder
- **Optimistic Updates**: Instant UI feedback for actions (create trip, upload document)
- **Responsive Design**: Mobile-first design, works on all screen sizes

**Authentication Flow**:
1. User submits login form
2. Frontend sends POST to `/api/auth/login`
3. Backend validates credentials, returns JWT token
4. Frontend stores token in httpOnly cookie
5. Subsequent requests include token in Authorization header

**API Integration**:
```typescript
// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = getToken(); // From httpOnly cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Mobile Application (React Native + Expo)

**Technology Stack**:
- React Native with Expo (managed workflow)
- TypeScript for type safety
- React Navigation for routing
- AsyncStorage for offline data storage
- Firebase Cloud Messaging (FCM) for push notifications
- React Query for data fetching and caching
- React Native Paper for UI components

**Project Structure**:
```
mobile/
├── app/
│   ├── (tabs)/
│   │   ├── trips.tsx
│   │   ├── documents.tsx
│   │   └── settings.tsx
│   ├── trip/
│   │   └── [id].tsx
│   └── _layout.tsx
├── components/
│   ├── TripCard.tsx
│   ├── DocumentItem.tsx
│   └── ItineraryDay.tsx
├── lib/
│   ├── api.ts
│   ├── storage.ts (AsyncStorage helpers)
│   └── notifications.ts (FCM helpers)
├── hooks/
│   ├── useTrips.ts
│   ├── useDocuments.ts
│   └── useOfflineSync.ts
└── types/
    ├── trip.ts
    └── document.ts
```

**Offline-First Architecture**:

1. **Data Storage Strategy**:
   - AsyncStorage for user data, trips, documents metadata
   - FileSystem API for cached document files
   - Sync queue for pending changes

2. **Sync Logic**:
   ```typescript
   // hooks/useOfflineSync.ts
   export function useOfflineSync() {
     useEffect(() => {
       const syncData = async () => {
         if (isOnline) {
           // Upload pending changes from sync queue
           await uploadPendingChanges();
           
           // Fetch latest data from server
           const trips = await api.get('/trips');
           await AsyncStorage.setItem('trips', JSON.stringify(trips));
           
           // Download new document files
           await downloadNewDocuments();
         }
       };
       
       syncData();
     }, [isOnline]);
   }
   ```

3. **Conflict Resolution**:
   - Last-write-wins strategy with timestamp comparison
   - User is notified if conflict occurs
   - User can choose to keep local or remote version

**Push Notifications**:
```typescript
// lib/notifications.ts
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';

// Register for push notifications
export async function registerForPushNotifications() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;
  
  const token = await messaging().getToken();
  return token;
}

// Handle notification received
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

**Key Features**:
- **Offline Access**: Full app functionality without internet
- **Background Sync**: Sync data when internet is available
- **Push Notifications**: Flight reminders, document expiration alerts
- **Biometric Authentication**: Face ID / Touch ID support

---

## Backend Architecture

### API Server (NestJS)

**Technology Stack**:
- Node.js 20 LTS
- NestJS framework (Express under the hood)
- Prisma ORM for database operations
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing
- Bull for background job queue
- class-validator for request validation

**Project Structure**:
```
backend/
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts
│   │   └── guards/
│   │       └── jwt-auth.guard.ts
│   ├── trips/
│   │   ├── trips.controller.ts
│   │   ├── trips.service.ts
│   │   ├── trips.module.ts
│   │   └── dto/
│   │       ├── create-trip.dto.ts
│   │       └── update-trip.dto.ts
│   ├── documents/
│   │   ├── documents.controller.ts
│   │   ├── documents.service.ts
│   │   ├── documents.module.ts
│   │   └── dto/
│   │       └── upload-document.dto.ts
│   ├── reservations/
│   │   ├── reservations.controller.ts
│   │   ├── reservations.service.ts
│   │   └── reservations.module.ts
│   ├── alerts/
│   │   ├── alerts.controller.ts
│   │   ├── alerts.service.ts
│   │   ├── alerts.module.ts
│   │   └── alerts.processor.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── common/
│   │   ├── filters/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── storage.config.ts
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── schema.prisma
│   ├── app.module.ts
│   └── main.ts
├── test/
└── package.json
```

**Authentication Flow**:

```typescript
// auth/auth.service.ts
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !await bcrypt.compare(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateTokens(user);
  }

  private generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

**API Endpoints**:

**Authentication**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get current user profile

**Trips**:
- `GET /api/trips` - Get all user trips
- `GET /api/trips/:id` - Get trip by ID
- `POST /api/trips` - Create new trip
- `PATCH /api/trips/:id` - Update trip
- `DELETE /api/trips/:id` - Delete trip

**Itinerary**:
- `GET /api/trips/:id/itinerary` - Get trip itinerary
- `POST /api/trips/:id/itinerary` - Add itinerary entry
- `PATCH /api/trips/:id/itinerary/:entryId` - Update entry
- `DELETE /api/trips/:id/itinerary/:entryId` - Delete entry

**Reservations**:
- `GET /api/trips/:id/reservations` - Get trip reservations
- `POST /api/trips/:id/reservations` - Add reservation
- `PATCH /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Delete reservation

**Documents**:
- `GET /api/documents` - Get all user documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Get document metadata
- `GET /api/documents/:id/download` - Download document file
- `DELETE /api/documents/:id` - Delete document

**Alerts**:
- `GET /api/alerts` - Get user alert preferences
- `PATCH /api/alerts` - Update alert preferences
- `POST /api/alerts/test` - Send test notification

**Request Validation**:
```typescript
// trips/dto/create-trip.dto.ts
import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateTripDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  startDate: Date;

  @IsDate()
  endDate: Date;

  @IsString()
  @IsOptional()
  destination?: string;
}
```

---

## Database Architecture

### PostgreSQL Schema

**Schema Design (Prisma)**:

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id            String      @id @default(uuid())
  email         String      @unique
  password      String
  firstName     String?
  lastName      String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  trips         Trip[]
  documents     Document[]
  alertSettings AlertSettings?
  
  @@map("users")
}

model Trip {
  id            String      @id @default(uuid())
  userId        String
  name          String
  description   String?
  startDate     DateTime
  endDate       DateTime
  destination   String?
  status        TripStatus  @default(UPCOMING)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  user          User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  itinerary     ItineraryEntry[]
  reservations  Reservation[]
  documents     Document[]
  
  @@index([userId])
  @@index([startDate])
  @@map("trips")
}

enum TripStatus {
  UPCOMING
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model ItineraryEntry {
  id            String      @id @default(uuid())
  tripId        String
  type          EntryType
  title         String
  description   String?
  date          DateTime
  time          String?
  location      String?
  notes         String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  trip          Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  @@index([tripId])
  @@index([date])
  @@map("itinerary_entries")
}

enum EntryType {
  FLIGHT
  HOTEL
  ACTIVITY
  RESTAURANT
  TRANSPORTATION
  OTHER
}

model Reservation {
  id                String      @id @default(uuid())
  tripId            String
  type              ReservationType
  title             String
  confirmationNumber String?
  bookingReference  String?
  notes             String?
  fileUrl           String?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
  
  trip              Trip        @relation(fields: [tripId], references: [id], onDelete: Cascade)
  
  @@index([tripId])
  @@map("reservations")
}

enum ReservationType {
  FLIGHT
  HOTEL
  CAR_RENTAL
  ACTIVITY
  OTHER
}

model Document {
  id              String      @id @default(uuid())
  userId          String
  tripId          String?
  type            DocumentType
  name            String
  fileUrl         String
  fileSize        Int
  mimeType        String
  expirationDate  DateTime?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  trip            Trip?       @relation(fields: [tripId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([tripId])
  @@index([expirationDate])
  @@map("documents")
}

enum DocumentType {
  PASSPORT
  VISA
  INSURANCE
  TICKET
  VOUCHER
  ID_CARD
  VACCINATION
  OTHER
}

model AlertSettings {
  id                    String      @id @default(uuid())
  userId                String      @unique
  emailEnabled          Boolean     @default(true)
  pushEnabled           Boolean     @default(true)
  departureReminder     Boolean     @default(true)
  checkinReminder       Boolean     @default(true)
  documentExpiration    Boolean     @default(true)
  scheduleChanges       Boolean     @default(true)
  reminderTimingHours   Int         @default(24)
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
  
  user                  User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("alert_settings")
}
```

### Database Relationships

**User → Trips** (One-to-Many):
- One user can have multiple trips
- Cascade delete: If user is deleted, all trips are deleted

**Trip → ItineraryEntry** (One-to-Many):
- One trip can have multiple itinerary entries
- Cascade delete: If trip is deleted, all itinerary entries are deleted

**Trip → Reservations** (One-to-Many):
- One trip can have multiple reservations
- Cascade delete: If trip is deleted, all reservations are deleted

**User → Documents** (One-to-Many):
- One user can have multiple documents
- Documents can optionally be linked to a trip
- Set null on trip delete: If trip is deleted, document remains but tripId is set to null

**User → AlertSettings** (One-to-One):
- One user has one set of alert preferences

### Query Optimization

**Indexes**:
- `users.email` (unique index for fast login lookup)
- `trips.userId` (index for fast user trips retrieval)
- `trips.startDate` (index for date-based queries)
- `itinerary_entries.tripId` (index for trip itinerary retrieval)
- `itinerary_entries.date` (index for date-based queries)
- `reservations.tripId` (index for trip reservations retrieval)
- `documents.userId` (index for user documents retrieval)
- `documents.tripId` (index for trip documents retrieval)
- `documents.expirationDate` (index for expiration alert queries)

**Common Queries**:

```typescript
// Get upcoming trips with itinerary
const upcomingTrips = await prisma.trip.findMany({
  where: {
    userId: user.id,
    startDate: { gte: new Date() },
    status: 'UPCOMING',
  },
  include: {
    itinerary: {
      orderBy: { date: 'asc' },
    },
    reservations: true,
  },
  orderBy: { startDate: 'asc' },
});

// Get documents expiring soon
const expiringDocuments = await prisma.document.findMany({
  where: {
    userId: user.id,
    expirationDate: {
      gte: new Date(),
      lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  },
  orderBy: { expirationDate: 'asc' },
});
```

---

## File Storage Architecture

### Document Storage (AWS S3 / DigitalOcean Spaces)

**Storage Strategy**:
- All document files stored in S3/Spaces (not in database)
- Database stores metadata (filename, fileUrl, fileSize, mimeType)
- Files encrypted at rest (AES-256)
- Pre-signed URLs for secure access

**File Upload Flow**:
```typescript
// documents/documents.service.ts
@Injectable()
export class DocumentsService {
  constructor(
    private prisma: PrismaService,
    private s3: S3Client,
  ) {}

  async uploadDocument(userId: string, file: Express.Multer.File, dto: UploadDocumentDto) {
    // 1. Encrypt file
    const encryptedBuffer = await this.encryptFile(file.buffer);
    
    // 2. Upload to S3/Spaces
    const key = `users/${userId}/documents/${uuidv4()}-${file.originalname}`;
    await this.s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Body: encryptedBuffer,
      ContentType: file.mimetype,
    }));
    
    // 3. Generate file URL
    const fileUrl = `https://${process.env.S3_BUCKET}.${process.env.S3_REGION}.digitaloceanspaces.com/${key}`;
    
    // 4. Save metadata to database
    const document = await this.prisma.document.create({
      data: {
        userId,
        type: dto.type,
        name: file.originalname,
        fileUrl,
        fileSize: file.size,
        mimeType: file.mimetype,
        expirationDate: dto.expirationDate,
        notes: dto.notes,
      },
    });
    
    return document;
  }

  private async encryptFile(buffer: Buffer): Promise<Buffer> {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
    
    // Prepend IV to encrypted data
    return Buffer.concat([iv, encrypted]);
  }
}
```

**File Download Flow**:
```typescript
// Generate pre-signed URL for secure download
async getDownloadUrl(documentId: string, userId: string): Promise<string> {
  const document = await this.prisma.document.findFirst({
    where: { id: documentId, userId },
  });
  
  if (!document) {
    throw new NotFoundException('Document not found');
  }
  
  // Generate pre-signed URL (valid for 1 hour)
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: this.extractKeyFromUrl(document.fileUrl),
  });
  
  const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
  return url;
}
```

**Security Considerations**:
- Files encrypted before upload (AES-256)
- Pre-signed URLs expire after 1 hour
- User authentication required for all file operations
- User can only access their own documents
- No direct S3/Spaces access from frontend

---

## Background Jobs & Alerts

### Job Queue (Bull + Redis)

**Alert Types**:
1. **Departure Reminders**: 24 hours before flight/train/bus departure
2. **Check-in Reminders**: 24 hours before flight check-in opens
3. **Document Expiration**: 30 days before passport/visa expiration
4. **Schedule Changes**: Real-time alerts (future integration)

**Alert Scheduler**:
```typescript
// alerts/alerts.processor.ts
@Processor('alerts')
export class AlertsProcessor {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
    private pushService: PushService,
  ) {}

  @Process('check-upcoming-events')
  async checkUpcomingEvents() {
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    // Find itinerary entries in next 24 hours
    const upcomingEntries = await this.prisma.itineraryEntry.findMany({
      where: {
        date: {
          gte: now,
          lte: tomorrow,
        },
        type: { in: ['FLIGHT', 'TRAIN', 'BUS'] },
      },
      include: {
        trip: {
          include: {
            user: {
              include: {
                alertSettings: true,
              },
            },
          },
        },
      },
    });
    
    // Send alerts for each entry
    for (const entry of upcomingEntries) {
      const { user, alertSettings } = entry.trip;
      
      if (alertSettings?.departureReminder) {
        // Send email
        if (alertSettings.emailEnabled) {
          await this.emailService.sendDepartureReminder(user.email, entry);
        }
        
        // Send push notification
        if (alertSettings.pushEnabled) {
          await this.pushService.sendDepartureReminder(user.id, entry);
        }
      }
    }
  }

  @Process('check-document-expirations')
  async checkDocumentExpirations() {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    // Find documents expiring in next 30 days
    const expiringDocuments = await this.prisma.document.findMany({
      where: {
        expirationDate: {
          gte: now,
          lte: thirtyDaysFromNow,
        },
      },
      include: {
        user: {
          include: {
            alertSettings: true,
          },
        },
      },
    });
    
    // Send alerts for each document
    for (const document of expiringDocuments) {
      const { user, alertSettings } = document;
      
      if (alertSettings?.documentExpiration) {
        // Send email
        if (alertSettings.emailEnabled) {
          await this.emailService.sendExpirationReminder(user.email, document);
        }
        
        // Send push notification
        if (alertSettings.pushEnabled) {
          await this.pushService.sendExpirationReminder(user.id, document);
        }
      }
    }
  }
}
```

**Job Scheduling**:
```typescript
// alerts/alerts.service.ts
@Injectable()
export class AlertsService {
  constructor(
    @InjectQueue('alerts') private alertsQueue: Queue,
  ) {}

  async onModuleInit() {
    // Schedule recurring jobs
    await this.alertsQueue.add(
      'check-upcoming-events',
      {},
      {
        repeat: { cron: '*/5 * * * *' }, // Every 5 minutes
      },
    );
    
    await this.alertsQueue.add(
      'check-document-expirations',
      {},
      {
        repeat: { cron: '0 9 * * *' }, // Daily at 9 AM
      },
    );
  }
}
```

---

## Security Architecture

### Authentication & Authorization

**JWT Authentication**:
- JWT tokens issued on login
- Tokens expire after 7 days
- Tokens include user ID and email in payload
- Tokens validated on every authenticated request

**Password Security**:
- Passwords hashed with bcrypt (salt rounds: 10)
- Passwords never stored or transmitted in plain text
- Password strength requirements enforced

**Authorization**:
- Users can only access their own trips, documents, reservations
- Row-level security enforced in service layer
- Guards used to protect routes

### Data Encryption

**At Rest**:
- Document files encrypted with AES-256 before upload
- Database encryption (managed by PostgreSQL)
- Encryption key stored in environment variables

**In Transit**:
- All API communication over HTTPS (TLS 1.2/1.3)
- SSL/TLS certificates (Let's Encrypt)
- Secure pre-signed URLs for document downloads

### Security Best Practices

**OWASP Top 10 Mitigations**:
- SQL Injection: Prevented by Prisma ORM (parameterized queries)
- XSS: React escapes output by default, Content Security Policy headers
- CSRF: SameSite cookies, CSRF tokens for state-changing operations
- Authentication: Strong password hashing, JWT tokens, secure session management
- Sensitive Data Exposure: HTTPS only, encrypted file storage, no sensitive data in logs
- XXE: JSON API only, no XML parsing
- Broken Access Control: Row-level security, authorization guards
- Security Misconfiguration: Environment-based configuration, minimal exposed services
- Insufficient Logging: Comprehensive logging with Winston, no sensitive data in logs
- Insecure Deserialization: Input validation with class-validator

**Additional Security Measures**:
- Rate limiting (100 requests per 15 minutes per IP)
- Input validation on all endpoints
- CORS configuration (whitelist allowed origins)
- Helmet.js for security headers
- Regular security audits and penetration testing

---

## Infrastructure

### Deployment Architecture (MVP)

**DigitalOcean Setup**:
- **Droplet**: 4 GB RAM, 2 vCPUs ($24/month)
- **Database**: Managed PostgreSQL (1 GB RAM, $15/month)
- **Spaces**: Object storage for documents (250 GB, $5/month)
- **Load Balancer**: For future scaling ($12/month)

**Docker Compose (MVP)**:
```yaml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/tripvault
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - ENCRYPTION_KEY=${ENCRYPTION_KEY}
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=tripvault

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

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
      - run: npm run test
      - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to DigitalOcean
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/tripvault
            git pull origin main
            docker-compose down
            docker-compose up -d --build
```

### Monitoring & Logging

**Logging**:
- Winston for structured logging
- Log levels: error, warn, info, debug
- Logs stored in files and sent to monitoring service

**Monitoring**:
- Uptime monitoring (UptimeRobot or similar)
- Error tracking (Sentry)
- Performance monitoring (Application metrics)

**Backups**:
- Automated daily database backups (DigitalOcean managed)
- 7-day backup retention
- Document storage backups (S3/Spaces versioning)

---

## Performance Optimization

### Caching Strategy

**Client-Side Caching**:
- SWR for API response caching (web app)
- React Query for data caching (mobile app)
- AsyncStorage for offline data (mobile app)

**Server-Side Caching**:
- Redis for frequently accessed data (user sessions, trip lists)
- Cache invalidation on data updates

### Database Optimization

**Query Optimization**:
- Indexes on frequently queried fields
- Selective fetching (only load required fields)
- Pagination for large datasets

**Connection Pooling**:
- Prisma connection pool (10 connections for MVP)
- Connection timeout: 30 seconds

### Mobile Performance

**Offline-First Strategy**:
- Data cached in AsyncStorage
- Background sync when online
- Optimistic UI updates

**Bundle Size Optimization**:
- Code splitting with Expo Router
- Lazy loading of screens
- Optimized images (compressed, WebP format)

---

*This architecture document defines the technical design, system components, data flow, and implementation details for Travel Itinerary & Document Wallet.*

---

## Review/Contribution

**Expert**: Marcus Johnson (Architecture)  
**Date**: 2026-01-21  
**Changes**: Created comprehensive architecture document covering system overview (high-level architecture diagram, system components, data flow), frontend architecture (Next.js web app with SSR/CSR, React Native mobile app with offline-first design), backend architecture (NestJS API with authentication, request validation, RESTful endpoints), database architecture (PostgreSQL schema with Prisma ORM, complete data models for users/trips/itinerary/reservations/documents/alerts, database relationships, query optimization with indexes), file storage architecture (AWS S3/DigitalOcean Spaces with AES-256 encryption, secure pre-signed URLs, upload/download flows), background jobs & alerts (Bull + Redis job queue, alert types, job scheduling), security architecture (JWT authentication, password hashing, data encryption at rest and in transit, OWASP Top 10 mitigations, security best practices), infrastructure (DigitalOcean deployment with Docker Compose, CI/CD pipeline with GitHub Actions, monitoring and logging, automated backups), and performance optimization (caching strategy with Redis/SWR/AsyncStorage, database optimization with indexes and connection pooling, mobile performance with offline-first strategy and bundle optimization). This architecture provides comprehensive technical design for implementing Travel Itinerary & Document Wallet with focus on security, scalability, and offline-first mobile experience.

**Status**: ⏳ Pending review by other technical experts

---
