# Learning Games - Technical Architecture

**Status**: Planning  
**Last Updated**: 2026-01-22  
**Version**: 2.0

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Architecture](#database-architecture)
5. [Security Architecture](#security-architecture)
6. [Infrastructure Architecture](#infrastructure-architecture)
7. [API Design](#api-design)
8. [Data Flow](#data-flow)
9. [Mobile Architecture (Phase 2)](#mobile-architecture-phase-2)
10. [Integration Architecture](#integration-architecture)
11. [Performance Considerations](#performance-considerations)
12. [Scalability Strategy](#scalability-strategy)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Angular Web App (MVP)  │  React Native Mobile (Phase 2)   │
└─────────────┬───────────────────────────────────┬───────────┘
              │                                   │
              │         HTTPS/REST API            │
              │                                   │
┌─────────────▼───────────────────────────────────▼───────────┐
│                     API Gateway Layer                        │
├──────────────────────────────────────────────────────────────┤
│           PHP (Slim 4) RESTful API Backend                   │
│  ┌────────────┬────────────┬──────────┬──────────────────┐  │
│  │   Auth     │ Questions  │ Progress │  Analytics       │  │
│  │  Service   │  Service   │ Service  │  Service         │  │
│  └────────────┴────────────┴──────────┴──────────────────┘  │
└─────────────┬────────────────────────────────────────────────┘
              │
              │         MySQL Connection
              │
┌─────────────▼────────────────────────────────────────────────┐
│                      Data Layer                              │
├──────────────────────────────────────────────────────────────┤
│                    MySQL 8.0 Database                        │
│  ┌────────┬────────────┬──────────────┬──────────────────┐  │
│  │ Users  │ Questions  │ User Progress│  User Sessions   │  │
│  └────────┴────────────┴──────────────┴──────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend**:
- Angular 18 (TypeScript)
- Angular Material (UI components)
- RxJS (reactive programming)
- Angular Router (navigation)

**Backend**:
- PHP 8.2+
- Slim 4 (micro-framework)
- illuminate/database (Eloquent ORM)
- firebase/php-jwt (JWT authentication)
- vlucas/phpdotenv (environment management)

**Database**:
- MySQL 8.0
- Persistent Docker volume

**Infrastructure**:
- Docker + Docker Compose
- Nginx (web server)
- GitHub Actions (CI/CD)

---

## Frontend Architecture

### Angular Application Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/                    # Core services and guards
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── api.service.ts
│   │   │   │   └── storage.service.ts
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts
│   │   │   ├── interceptors/
│   │   │   │   ├── auth.interceptor.ts
│   │   │   │   └── error.interceptor.ts
│   │   │   └── models/
│   │   │       ├── user.model.ts
│   │   │       ├── question.model.ts
│   │   │       └── progress.model.ts
│   │   │
│   │   ├── features/                # Feature modules
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── reset-password/
│   │   │   ├── practice/
│   │   │   │   ├── practice-home/
│   │   │   │   ├── question-display/
│   │   │   │   ├── feedback-modal/
│   │   │   │   └── practice.service.ts
│   │   │   ├── progress/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── topic-breakdown/
│   │   │   │   └── progress.service.ts
│   │   │   └── profile/
│   │   │       ├── profile-view/
│   │   │       └── profile-edit/
│   │   │
│   │   ├── shared/                  # Shared components
│   │   │   ├── components/
│   │   │   │   ├── navbar/
│   │   │   │   ├── loading-spinner/
│   │   │   │   └── error-message/
│   │   │   ├── pipes/
│   │   │   │   └── time-ago.pipe.ts
│   │   │   └── directives/
│   │   │
│   │   └── app-routing.module.ts    # Main routing
│   │
│   ├── assets/                      # Static assets
│   ├── environments/                # Environment configs
│   └── styles/                      # Global styles
└── angular.json
```

### State Management Strategy (MVP)

**Approach**: Angular Services with RxJS (Simple for MVP)

```typescript
// practice.service.ts
@Injectable({ providedIn: 'root' })
export class PracticeService {
  private currentQuestionSubject = new BehaviorSubject<Question | null>(null);
  public currentQuestion$ = this.currentQuestionSubject.asObservable();
  
  private practiceProgressSubject = new BehaviorSubject<PracticeProgress | null>(null);
  public practiceProgress$ = this.practiceProgressSubject.asObservable();
  
  constructor(private api: ApiService) {}
  
  loadNextQuestion(topic: string, difficulty: string): Observable<Question> {
    return this.api.get<Question>(`/questions/next?topic=${topic}&difficulty=${difficulty}`)
      .pipe(
        tap(question => this.currentQuestionSubject.next(question))
      );
  }
  
  submitAnswer(questionId: number, answer: string): Observable<FeedbackResponse> {
    return this.api.post<FeedbackResponse>('/questions/submit', { questionId, answer })
      .pipe(
        tap(feedback => this.updateProgress(feedback))
      );
  }
}
```

**Future**: Consider NgRx for state management in Phase 2 if complexity increases.

### Component Architecture

**Smart Components** (Container Components):
- Handle business logic
- Connect to services
- Pass data to presentational components

**Presentational Components** (Dumb Components):
- Pure UI rendering
- Receive data via @Input()
- Emit events via @Output()
- No direct service dependencies

**Example**:
```typescript
// Smart Component: practice-home.component.ts
@Component({
  selector: 'app-practice-home',
  template: `
    <app-question-display 
      [question]="currentQuestion$ | async"
      [loading]="loading$ | async"
      (answerSubmitted)="onAnswerSubmitted($event)">
    </app-question-display>
  `
})
export class PracticeHomeComponent {
  currentQuestion$ = this.practiceService.currentQuestion$;
  loading$ = this.practiceService.loading$;
  
  constructor(private practiceService: PracticeService) {}
  
  onAnswerSubmitted(answer: string): void {
    this.practiceService.submitAnswer(answer).subscribe();
  }
}

// Presentational Component: question-display.component.ts
@Component({
  selector: 'app-question-display',
  template: `
    <div *ngIf="!loading; else loadingTemplate">
      <h2>{{ question?.text }}</h2>
      <div class="options">
        <button *ngFor="let option of question?.options" 
                (click)="selectAnswer(option)">
          {{ option }}
        </button>
      </div>
    </div>
  `
})
export class QuestionDisplayComponent {
  @Input() question: Question | null = null;
  @Input() loading = false;
  @Output() answerSubmitted = new EventEmitter<string>();
  
  selectAnswer(answer: string): void {
    this.answerSubmitted.emit(answer);
  }
}
```

### Routing Strategy

```typescript
// app-routing.module.ts
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) 
  },
  { 
    path: 'practice', 
    loadChildren: () => import('./features/practice/practice.module').then(m => m.PracticeModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'progress', 
    loadChildren: () => import('./features/progress/progress.module').then(m => m.ProgressModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'profile', 
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  },
  { path: '**', component: NotFoundComponent }
];
```

**Strategy**: Lazy loading for all feature modules to improve initial load time.

---

## Backend Architecture

### PHP Slim 4 API Structure

```
backend/
├── public/
│   └── index.php              # Entry point
├── src/
│   ├── Application/
│   │   ├── Handlers/          # Error handlers
│   │   ├── Middleware/        # Custom middleware
│   │   │   ├── JwtAuthMiddleware.php
│   │   │   ├── CorsMiddleware.php
│   │   │   └── ValidationMiddleware.php
│   │   └── Settings/          # Configuration
│   │
│   ├── Domain/                # Business logic
│   │   ├── Auth/
│   │   │   ├── AuthService.php
│   │   │   └── JwtTokenService.php
│   │   ├── Questions/
│   │   │   ├── QuestionService.php
│   │   │   ├── AdaptiveDifficultyService.php
│   │   │   └── QuestionRepository.php
│   │   ├── Progress/
│   │   │   ├── ProgressService.php
│   │   │   └── ProgressRepository.php
│   │   └── User/
│   │       ├── UserService.php
│   │       └── UserRepository.php
│   │
│   ├── Infrastructure/        # Data access
│   │   ├── Persistence/
│   │   │   ├── Database.php
│   │   │   └── Models/        # Eloquent models
│   │   │       ├── User.php
│   │   │       ├── Question.php
│   │   │       ├── UserProgress.php
│   │   │       └── UserSession.php
│   │   └── Repositories/
│   │
│   └── Presentation/          # API controllers
│       ├── Controllers/
│       │   ├── AuthController.php
│       │   ├── QuestionController.php
│       │   ├── ProgressController.php
│       │   └── UserController.php
│       └── Routes/
│           ├── auth.php
│           ├── questions.php
│           ├── progress.php
│           └── users.php
│
├── config/
│   ├── database.php
│   └── routes.php
├── migrations/                # Database migrations
├── composer.json
└── .env
```

### Service Layer Pattern

```php
// QuestionService.php
class QuestionService {
    private QuestionRepository $questionRepo;
    private AdaptiveDifficultyService $difficultyService;
    private ProgressRepository $progressRepo;
    
    public function __construct(
        QuestionRepository $questionRepo,
        AdaptiveDifficultyService $difficultyService,
        ProgressRepository $progressRepo
    ) {
        $this->questionRepo = $questionRepo;
        $this->difficultyService = $difficultyService;
        $this->progressRepo = $progressRepo;
    }
    
    public function getNextQuestion(int $userId, string $topic): Question {
        // Get user's recent performance
        $recentPerformance = $this->progressRepo->getRecentPerformance($userId, $topic, 10);
        
        // Calculate adaptive difficulty
        $difficulty = $this->difficultyService->calculateDifficulty($recentPerformance);
        
        // Get next question at calculated difficulty
        return $this->questionRepo->getRandomQuestion($topic, $difficulty, $userId);
    }
    
    public function submitAnswer(int $userId, int $questionId, string $answer): FeedbackResponse {
        $question = $this->questionRepo->findById($questionId);
        
        $isCorrect = $this->validateAnswer($question, $answer);
        
        // Record progress
        $this->progressRepo->recordAttempt($userId, $questionId, $answer, $isCorrect);
        
        return new FeedbackResponse(
            $isCorrect,
            $question->getCorrectAnswer(),
            $question->getExplanation()
        );
    }
}
```

### Repository Pattern

```php
// QuestionRepository.php (using Eloquent)
class QuestionRepository {
    public function getRandomQuestion(string $topic, string $difficulty, int $userId): ?Question {
        return Question::where('topic', $topic)
            ->where('difficulty', $difficulty)
            ->whereNotIn('id', function($query) use ($userId) {
                $query->select('question_id')
                    ->from('user_progress')
                    ->where('user_id', $userId)
                    ->where('created_at', '>', now()->subDays(7));
            })
            ->inRandomOrder()
            ->first();
    }
    
    public function findById(int $id): ?Question {
        return Question::find($id);
    }
}
```

### Adaptive Difficulty Algorithm (MVP)

```php
// AdaptiveDifficultyService.php
class AdaptiveDifficultyService {
    public function calculateDifficulty(array $recentPerformance): string {
        if (empty($recentPerformance)) {
            return 'medium'; // Default for new users
        }
        
        $correctCount = count(array_filter($recentPerformance, fn($attempt) => $attempt['is_correct']));
        $accuracy = $correctCount / count($recentPerformance);
        
        if ($accuracy > 0.8) {
            return 'hard';
        } elseif ($accuracy < 0.5) {
            return 'easy';
        } else {
            return 'medium';
        }
    }
}
```

**Future Enhancement (Phase 2)**: Multi-dimensional difficulty based on concept mastery, spaced repetition, and optimal challenge zone.

---

## Database Architecture

### Schema Design

#### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    role ENUM('student', 'admin') DEFAULT 'student',
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);
```

#### Questions Table
```sql
CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject ENUM('physics', 'calculus') NOT NULL,
    topic VARCHAR(100) NOT NULL,
    question_text TEXT NOT NULL,
    question_type ENUM('multiple_choice', 'numeric', 'true_false') NOT NULL,
    options JSON,  -- For multiple choice: ["A", "B", "C", "D"]
    correct_answer VARCHAR(255) NOT NULL,
    explanation TEXT NOT NULL,
    difficulty ENUM('easy', 'medium', 'hard') NOT NULL,
    concept_tags JSON,  -- ["newton_laws", "kinematics"]
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_subject_topic (subject, topic),
    INDEX idx_difficulty (difficulty),
    INDEX idx_active (is_active)
);
```

#### User Progress Table
```sql
CREATE TABLE user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    question_id INT NOT NULL,
    user_answer VARCHAR(255) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    time_spent_seconds INT,  -- Time to answer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_question_id (question_id),
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_user_correct (user_id, is_correct)
);
```

#### User Sessions Table
```sql
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL,
    questions_attempted INT DEFAULT 0,
    questions_correct INT DEFAULT 0,
    topic VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_session_start (session_start)
);
```

### Database Indexing Strategy

**Primary Indexes**:
- All primary keys (auto-indexed)
- Email on users table (unique index for fast login lookups)

**Performance Indexes**:
- `user_progress(user_id, created_at)` - For recent performance queries
- `questions(subject, topic, difficulty)` - For question retrieval
- `user_progress(user_id, is_correct)` - For accuracy calculations

**Query Optimization**:
- Use composite indexes for common query patterns
- Avoid full table scans with proper WHERE clause indexing
- Use EXPLAIN to analyze slow queries

### Data Migration Strategy

```php
// migrations/001_create_users_table.php
class CreateUsersTable {
    public function up(PDO $pdo): void {
        $sql = "
            CREATE TABLE users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_email (email)
            )
        ";
        $pdo->exec($sql);
    }
    
    public function down(PDO $pdo): void {
        $pdo->exec("DROP TABLE IF EXISTS users");
    }
}
```

**Migration Execution**: Custom PHP script to run migrations in order.

---

## Security Architecture

### Authentication Flow

```
┌─────────┐                  ┌─────────┐                  ┌─────────┐
│ Client  │                  │   API   │                  │Database │
└────┬────┘                  └────┬────┘                  └────┬────┘
     │                            │                             │
     │  POST /auth/login          │                             │
     │  { email, password }       │                             │
     ├───────────────────────────>│                             │
     │                            │  SELECT * FROM users        │
     │                            │  WHERE email = ?            │
     │                            ├────────────────────────────>│
     │                            │                             │
     │                            │  User record                │
     │                            │<────────────────────────────┤
     │                            │                             │
     │                            │  Verify password            │
     │                            │  (bcrypt)                   │
     │                            │                             │
     │                            │  Generate JWT token         │
     │                            │  (user_id, role, exp)       │
     │                            │                             │
     │  { token, user }           │                             │
     │<───────────────────────────┤                             │
     │                            │                             │
     │  Store token in localStorage                            │
     │                            │                             │
     │  GET /questions/next       │                             │
     │  Header: Authorization:    │                             │
     │          Bearer <token>    │                             │
     ├───────────────────────────>│                             │
     │                            │  Verify JWT token           │
     │                            │  Extract user_id            │
     │                            │                             │
     │                            │  SELECT * FROM questions... │
     │                            ├────────────────────────────>│
     │                            │                             │
     │  { question }              │  Question data              │
     │<───────────────────────────┤<────────────────────────────┤
```

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": 123,
    "email": "student@example.com",
    "role": "student",
    "iat": 1706000000,  // Issued at
    "exp": 1706086400   // Expires (24 hours)
  },
  "signature": "..."
}
```

### Authorization Strategy

**Role-Based Access Control (RBAC)**:

```php
// Middleware: JwtAuthMiddleware.php
class JwtAuthMiddleware {
    public function __invoke(Request $request, RequestHandler $handler): Response {
        $token = $this->extractTokenFromHeader($request);
        
        try {
            $decoded = JWT::decode($token, new Key($this->secretKey, 'HS256'));
            
            // Add user info to request attributes
            $request = $request->withAttribute('user_id', $decoded->user_id);
            $request = $request->withAttribute('user_role', $decoded->role);
            
            return $handler->handle($request);
        } catch (Exception $e) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }
    }
}

// Controller: QuestionController.php
class QuestionController {
    public function getNext(Request $request, Response $response): Response {
        $userId = $request->getAttribute('user_id');  // From JWT
        
        // Only students can access practice questions
        $userRole = $request->getAttribute('user_role');
        if ($userRole !== 'student') {
            return new JsonResponse(['error' => 'Forbidden'], 403);
        }
        
        // ... get next question for user
    }
}
```

### Password Security

```php
// Registration
$hashedPassword = password_hash($plainPassword, PASSWORD_BCRYPT, ['cost' => 12]);

// Login
$isValid = password_verify($plainPassword, $hashedPassword);
```

**Security Best Practices**:
- Use bcrypt with cost factor 12
- Never store plain-text passwords
- Use prepared statements to prevent SQL injection
- Validate and sanitize all user input

### Data Protection

**Encryption**:
- HTTPS for all traffic (TLS 1.2+)
- Encrypted passwords (bcrypt)
- Secure JWT secret key (environment variable)

**Input Validation**:
```php
// Validation Middleware
class ValidationMiddleware {
    public function validateRegistration(array $data): array {
        $errors = [];
        
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'Invalid email format';
        }
        
        if (strlen($data['password']) < 8) {
            $errors[] = 'Password must be at least 8 characters';
        }
        
        return $errors;
    }
}
```

### Compliance

**COPPA (Children's Online Privacy Protection Act)**:
- Age-gate registration: Must be 13+ to register
- If under 13, require parental consent
- Store minimal data for users under 13

**FERPA (Family Educational Rights and Privacy Act)**:
- Protect student educational records
- Allow students to view their own data
- Restrict access to authorized users only

---

## Infrastructure Architecture

### Docker Compose Setup

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "4200:80"
    depends_on:
      - backend
    environment:
      - API_URL=http://backend:80
  
  backend:
    build: ./backend
    ports:
      - "8080:80"
    depends_on:
      - mysql
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_DATABASE=learning_games
      - DB_USERNAME=app_user
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./backend:/var/www/html
  
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=learning_games
      - MYSQL_USER=app_user
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
  
volumes:
  mysql_data:
```

### Deployment Architecture

**MVP Deployment**:
- Single DigitalOcean Droplet (2 CPU, 4GB RAM)
- Docker Compose for orchestration
- Nginx reverse proxy for routing
- Let's Encrypt for HTTPS

**Future Scaling** (Phase 3+):
- Load balancer for multiple backend instances
- Managed MySQL (DigitalOcean Managed Databases)
- CDN for static assets (CloudFlare)
- Redis for caching (session, question cache)

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Backend Tests
        run: |
          cd backend
          composer install
          ./vendor/bin/phpunit
      - name: Run Frontend Tests
        run: |
          cd frontend
          npm install
          npm run test
  
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Server
        run: |
          ssh user@server 'cd /app && git pull && docker-compose up -d --build'
```

---

## API Design

### RESTful API Endpoints

#### Authentication Endpoints

```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login user (returns JWT)
POST   /api/auth/logout       Logout user (invalidate token)
POST   /api/auth/refresh      Refresh JWT token
POST   /api/auth/reset        Request password reset
POST   /api/auth/reset/:token Reset password with token
```

#### Question Endpoints

```
GET    /api/questions/next?topic={topic}&difficulty={difficulty}
       Get next question for user
       
POST   /api/questions/:id/submit
       Submit answer for question
       Body: { answer: string }
       
GET    /api/questions/:id
       Get question details
       
GET    /api/questions/topics
       Get list of available topics
```

#### Progress Endpoints

```
GET    /api/progress/dashboard
       Get user progress dashboard data
       
GET    /api/progress/history?limit=50
       Get recent practice history
       
GET    /api/progress/topics
       Get progress breakdown by topic
       
GET    /api/progress/streak
       Get current practice streak
```

#### User Endpoints

```
GET    /api/users/me          Get current user profile
PUT    /api/users/me          Update user profile
DELETE /api/users/me          Delete account
```

### API Response Format

**Success Response**:
```json
{
  "status": "success",
  "data": {
    "question": {
      "id": 123,
      "text": "A ball is thrown upward...",
      "type": "multiple_choice",
      "options": ["5 m/s", "10 m/s", "15 m/s", "20 m/s"]
    }
  }
}
```

**Error Response**:
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_INPUT",
    "message": "Answer cannot be empty",
    "details": {}
  }
}
```

### API Versioning

**Approach**: URL-based versioning (e.g., `/api/v1/questions`)

**MVP**: Start with `/api/v1/`  
**Future**: Maintain v1 for backward compatibility when introducing v2

---

## Data Flow

### Practice Session Flow

```
1. User selects topic (e.g., "Kinematics")
   ↓
2. Frontend: GET /api/questions/next?topic=kinematics
   ↓
3. Backend:
   - Get user's recent performance (last 10 questions)
   - Calculate adaptive difficulty
   - Fetch random question at calculated difficulty
   - Exclude recently answered questions (last 7 days)
   ↓
4. Frontend: Display question
   ↓
5. User submits answer
   ↓
6. Frontend: POST /api/questions/:id/submit { answer }
   ↓
7. Backend:
   - Validate answer
   - Record progress (user_progress table)
   - Update session stats (user_sessions table)
   - Generate feedback with explanation
   ↓
8. Frontend: Display feedback (correct/incorrect, explanation)
   ↓
9. User clicks "Next Question"
   ↓
10. Repeat from step 2
```

---

## Mobile Architecture (Phase 2)

### React Native + Expo

**Rationale**: Cross-platform (iOS + Android) with single codebase, fast development.

**Tech Stack**:
- React Native with Expo
- TypeScript
- React Navigation (routing)
- Axios (API calls)
- AsyncStorage (offline data)
- Expo Notifications (push notifications)

**Features**:
- Quick practice sessions (5-10 min)
- Offline mode (download question sets)
- Push notifications (practice reminders)
- Progress sync across devices

**Offline Architecture**:
```
1. User downloads question set (while online)
   ↓
2. Questions stored in AsyncStorage
   ↓
3. User practices offline
   ↓
4. Answers stored locally with timestamp
   ↓
5. When online, sync answers to backend
   ↓
6. Backend updates progress and recalculates difficulty
```

---

## Integration Architecture

### Third-Party Integrations (Future)

**Payment Processing** (Phase 2):
- Stripe for premium subscriptions
- Webhook for subscription events

**Email Service** (Phase 2):
- SendGrid for transactional emails
- Password resets, welcome emails

**Analytics** (Phase 2):
- Google Analytics for user behavior
- Mixpanel for event tracking

**Error Tracking** (Phase 2):
- Sentry for backend error monitoring
- Sentry for frontend error monitoring

---

## Performance Considerations

### Frontend Performance

**Strategies**:
- Lazy loading for feature modules (reduce initial bundle size)
- OnPush change detection for components
- Virtual scrolling for long lists (question history)
- Image optimization (WebP format)
- Code splitting and tree shaking

**Target Metrics**:
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3.5s
- Lighthouse score: 90+

### Backend Performance

**Strategies**:
- Database query optimization (proper indexing)
- Connection pooling for MySQL
- Caching frequent queries (Phase 2 - Redis)
- API response compression (gzip)
- Pagination for list endpoints (limit 50 items)

**Target Metrics**:
- API response time (95th percentile): < 200ms
- Database query time: < 100ms
- Concurrent users: 1,000 (MVP), 10,000 (Phase 3)

### Database Performance

**Optimization**:
- Index frequently queried columns
- Use EXPLAIN to analyze slow queries
- Avoid N+1 queries (eager loading with Eloquent)
- Regular ANALYZE TABLE to update statistics

---

## Scalability Strategy

### Current Architecture (MVP)

- Single server (monolithic)
- All services on one machine
- Suitable for 1,000-5,000 users

### Phase 2 Scaling (5,000-25,000 users)

- Separate frontend and backend servers
- Managed MySQL database
- CDN for static assets
- Redis for session caching

### Phase 3 Scaling (25,000+ users)

- Load balancer with multiple backend instances
- Database read replicas
- Question caching layer (Redis)
- Microservices for analytics (separate service)
- Queue system for async tasks (email sending)

### Horizontal Scaling Strategy

**Stateless API**: Backend is stateless (JWT tokens, no server-side sessions)  
**Database**: Scale reads with replicas, writes can use master-slave replication  
**Caching**: Redis for frequently accessed data (question cache, user sessions)  
**CDN**: CloudFlare for static assets and global distribution

---

## Appendix

### Related Documents

- [PRD_OVERVIEW.md](PRD_OVERVIEW.md) - Product requirements and MVP definition
- [EXPERTS.md](EXPERTS.md) - Expert team contributions
- [Projects List Entry](../../reference/PROJECTS_LIST.md#3-learning-games)

### Technology Decisions

| Decision | Rationale |
|----------|-----------|
| Angular | University students likely familiar, TypeScript for type safety |
| PHP/Slim | Lightweight, fast for API, good for MVP |
| MySQL | Relational data (users, questions, progress), mature ecosystem |
| Docker | Consistent dev/prod environments, easy deployment |
| JWT | Stateless authentication, scales horizontally |

---

**Last Updated**: 2026-01-22  
**Version**: 2.0 (Comprehensive Architecture)
