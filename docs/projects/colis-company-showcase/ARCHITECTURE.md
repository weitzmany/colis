# Colis Company Showcase - Architecture

## System Overview

The Colis Company Showcase is a full-stack web application with a clear separation between public-facing marketing pages and an administrative CMS. The architecture follows a modern client-server model with Angular frontend and Slim PHP backend.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Public Users / Clients                  │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Web Server (Nginx/Apache)                 │
│                         with SSL/TLS                         │
└───────────┬──────────────────────────────────┬──────────────┘
            │                                  │
            ▼                                  ▼
┌─────────────────────┐              ┌──────────────────────┐
│  Angular Frontend    │              │   Static Assets      │
│  (Public Site)       │              │   (Images, CSS, JS)  │
│                      │              │                      │
│  - Homepage          │              │  - Project Images    │
│  - Portfolio         │              │  - Team Photos       │
│  - Services          │              │  - Company Logos     │
│  - Team              │              │                      │
│  - Contact           │              └──────────────────────┘
│  - CMS Admin UI      │
└──────────┬───────────┘
           │ REST API Calls
           ▼
┌─────────────────────────────────────────────────────────────┐
│              Slim PHP 4 Backend (REST API)                   │
│                                                              │
│  ┌──────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │ Public API   │  │   CMS API     │  │   Auth API      │  │
│  │ (Read-only)  │  │ (Auth Reqd)   │  │   (Login)       │  │
│  │              │  │               │  │                 │  │
│  │ - Projects   │  │ - Create/Edit │  │ - JWT Auth      │  │
│  │ - Team       │  │   Projects    │  │ - Session Mgmt  │  │
│  │ - Services   │  │ - Create/Edit │  │                 │  │
│  │ - Contact    │  │   Team        │  │                 │  │
│  │              │  │ - Upload      │  │                 │  │
│  │              │  │   Images      │  │                 │  │
│  └──────────────┘  └───────────────┘  └─────────────────┘  │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   MySQL Database                             │
│                                                              │
│  ┌────────────┐  ┌──────────┐  ┌─────────┐  ┌───────────┐  │
│  │  projects  │  │   team   │  │ services│  │   users   │  │
│  │            │  │          │  │         │  │  (admin)  │  │
│  │  blog_posts│  │ testim.  │  │ contact │  │  sessions │  │
│  └────────────┘  └──────────┘  └─────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────┘

External Integrations:
- Email Service (SendGrid/Mailgun) for contact forms
- Google Analytics for web analytics
- docs/projects/ directory for project data integration
```

### System Components

1. **Frontend (Angular)**
   - Public website pages
   - CMS admin interface
   - Responsive design (mobile-first)
   - Client-side routing

2. **Backend (Slim PHP 4)**
   - RESTful API
   - Business logic
   - Authentication and authorization
   - File upload handling

3. **Database (MySQL)**
   - Persistent data storage
   - Relational data model
   - Full-text search capabilities

4. **File Storage**
   - Local filesystem or cloud storage (S3)
   - Image uploads for projects and team
   - Document storage

5. **Email Service**
   - Transactional emails (contact form submissions)
   - SMTP or API-based (SendGrid, Mailgun)

---

## Frontend Architecture

### Framework and Libraries

**Core**:
- Angular 18 (TypeScript)
- RxJS for reactive programming
- Angular Router for navigation

**UI Components**:
- Angular Material (option 1) - Material Design components
- Custom UI library (option 2) - Fully branded components
- SCSS for styling

**Forms**:
- Angular Reactive Forms
- Custom validators
- Form error handling

**HTTP**:
- HttpClient for API communication
- Interceptors for authentication and error handling

**Rich Text Editor** (CMS):
- TinyMCE or CKEditor for WYSIWYG editing

### Application Structure

```
src/
├── app/
│   ├── core/                    # Core module (singleton services)
│   │   ├── services/
│   │   │   ├── api.service.ts
│   │   │   ├── auth.service.ts
│   │   │   └── project.service.ts
│   │   ├── guards/
│   │   │   └── auth.guard.ts
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts
│   │   └── core.module.ts
│   │
│   ├── shared/                  # Shared module (reusable components)
│   │   ├── components/
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── project-card/
│   │   │   └── team-card/
│   │   ├── directives/
│   │   └── pipes/
│   │
│   ├── features/                # Feature modules (lazy-loaded)
│   │   ├── home/
│   │   │   ├── home.component.ts
│   │   │   └── home.module.ts
│   │   ├── portfolio/
│   │   │   ├── portfolio-list/
│   │   │   ├── project-detail/
│   │   │   └── portfolio.module.ts
│   │   ├── services/
│   │   │   ├── services-list/
│   │   │   └── services.module.ts
│   │   ├── team/
│   │   │   ├── team-list/
│   │   │   └── team.module.ts
│   │   ├── contact/
│   │   │   └── contact.module.ts
│   │   └── cms/                 # CMS Admin Module
│   │       ├── login/
│   │       ├── dashboard/
│   │       ├── projects-manager/
│   │       ├── team-manager/
│   │       └── cms.module.ts
│   │
│   ├── app-routing.module.ts
│   ├── app.component.ts
│   └── app.module.ts
│
├── assets/
│   ├── images/
│   ├── styles/
│   └── icons/
│
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

### State Management

**Approach**: Service-based state management (no NgRx for MVP)

**Rationale**: 
- Simple, clear data flow
- Sufficient for current complexity
- Can add NgRx post-MVP if needed

**Services**:
- `ProjectService`: Manages project data and API calls
- `TeamService`: Manages team member data
- `AuthService`: Manages authentication state
- `CMSService`: Manages CMS operations

### Routing Strategy

**Public Routes** (no auth required):
- `/` - Homepage
- `/portfolio` - Project portfolio list
- `/portfolio/:id` - Project detail page
- `/services` - Services page
- `/team` - Team page
- `/contact` - Contact page

**Admin Routes** (auth required):
- `/admin/login` - CMS login
- `/admin/dashboard` - CMS dashboard
- `/admin/projects` - Project management
- `/admin/projects/create` - Create project
- `/admin/projects/:id/edit` - Edit project
- `/admin/team` - Team management
- `/admin/team/create` - Add team member
- `/admin/team/:id/edit` - Edit team member
- `/admin/services` - Edit services
- `/admin/settings` - CMS settings

**Route Guards**:
- `AuthGuard` - Protects admin routes, redirects to login if not authenticated

### Component Architecture

**Smart Components** (Container):
- Fetch data from services
- Handle business logic
- Pass data to dumb components

**Dumb Components** (Presentational):
- Receive data via `@Input()`
- Emit events via `@Output()`
- No direct service calls
- Reusable across app

**Example**:
```typescript
// Smart Component
@Component({
  selector: 'app-portfolio-list',
  template: `
    <app-project-card 
      *ngFor="let project of projects$ | async"
      [project]="project"
      (click)="onProjectClick($event)">
    </app-project-card>
  `
})
export class PortfolioListComponent {
  projects$ = this.projectService.getProjects();
  
  constructor(private projectService: ProjectService) {}
  
  onProjectClick(project: Project) {
    this.router.navigate(['/portfolio', project.id]);
  }
}

// Dumb Component
@Component({
  selector: 'app-project-card',
  template: `
    <div class="project-card">
      <img [src]="project.thumbnail" [alt]="project.title">
      <h3>{{ project.title }}</h3>
      <p>{{ project.description }}</p>
      <div class="tech-tags">
        <span *ngFor="let tech of project.technologies">{{ tech }}</span>
      </div>
    </div>
  `
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Output() click = new EventEmitter<Project>();
}
```

---

## Backend Architecture

### Framework: Slim PHP 4

**Why Slim PHP**:
- Lightweight, fast, simple
- Perfect for RESTful APIs
- Easy to understand and maintain
- Same stack as other company projects
- No unnecessary overhead

### API Architecture

**RESTful API Design**:
- Resource-based endpoints
- HTTP verbs (GET, POST, PUT, DELETE)
- JSON request/response format
- Standard HTTP status codes

**API Structure**:
```
api/
├── public/
│   └── index.php              # Entry point
│
├── src/
│   ├── Controllers/
│   │   ├── ProjectController.php
│   │   ├── TeamController.php
│   │   ├── ServiceController.php
│   │   ├── ContactController.php
│   │   └── AuthController.php
│   │
│   ├── Models/
│   │   ├── Project.php
│   │   ├── TeamMember.php
│   │   ├── Service.php
│   │   ├── ContactSubmission.php
│   │   └── User.php
│   │
│   ├── Middleware/
│   │   ├── AuthMiddleware.php
│   │   ├── CorsMiddleware.php
│   │   └── ValidationMiddleware.php
│   │
│   ├── Services/
│   │   ├── DatabaseService.php
│   │   ├── EmailService.php
│   │   ├── FileUploadService.php
│   │   └── AuthService.php
│   │
│   ├── Repositories/
│   │   ├── ProjectRepository.php
│   │   ├── TeamRepository.php
│   │   └── UserRepository.php
│   │
│   └── Utils/
│       ├── Validator.php
│       ├── ImageProcessor.php
│       └── Sanitizer.php
│
├── config/
│   ├── database.php
│   ├── routes.php
│   └── settings.php
│
└── composer.json
```

### API Endpoints

#### Public API (No Auth Required)

**Projects**:
- `GET /api/projects` - List all projects (with pagination, filtering)
- `GET /api/projects/{id}` - Get single project details

**Team**:
- `GET /api/team` - List all team members
- `GET /api/team/{id}` - Get single team member

**Services**:
- `GET /api/services` - List all services

**Contact**:
- `POST /api/contact` - Submit contact form

#### CMS API (Auth Required)

**Authentication**:
- `POST /api/auth/login` - Admin login (returns JWT)
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify JWT token

**Projects Management**:
- `POST /api/cms/projects` - Create new project
- `PUT /api/cms/projects/{id}` - Update project
- `DELETE /api/cms/projects/{id}` - Delete project
- `POST /api/cms/projects/{id}/upload` - Upload project image

**Team Management**:
- `POST /api/cms/team` - Add team member
- `PUT /api/cms/team/{id}` - Update team member
- `DELETE /api/cms/team/{id}` - Delete team member
- `POST /api/cms/team/{id}/upload` - Upload team photo

**Services Management**:
- `PUT /api/cms/services/{id}` - Update service description

### Request/Response Examples

**GET /api/projects** (Public):
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": 1,
        "title": "Chore Allowance Manager",
        "description": "Family chore tracking and allowance management app",
        "thumbnail": "/uploads/projects/chore-allowance-thumb.jpg",
        "technologies": ["Angular", "Slim PHP", "MySQL"],
        "category": "Web App",
        "status": "Live",
        "url": "https://example.com",
        "created_at": "2025-01-15"
      },
      // ... more projects
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "per_page": 12,
      "total_pages": 3
    }
  }
}
```

**POST /api/contact** (Public):
```json
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "company": "Acme Corp",
  "project_type": "Web Application",
  "message": "I'd like to discuss a project..."
}

// Response
{
  "success": true,
  "message": "Thank you for your message. We'll get back to you within 24 hours.",
  "data": {
    "submission_id": 123,
    "submitted_at": "2026-01-25T10:30:00Z"
  }
}
```

**POST /api/cms/projects** (CMS - Auth Required):
```json
// Request
{
  "title": "New Project",
  "description": "Project description here",
  "technologies": ["React", "Node.js", "MongoDB"],
  "category": "Web App",
  "status": "Live",
  "url": "https://project-url.com",
  "long_description": "Detailed project description...",
  "client": "Client Name",
  "duration": "3 months",
  "team_size": 4
}

// Response
{
  "success": true,
  "message": "Project created successfully",
  "data": {
    "project": {
      "id": 26,
      "title": "New Project",
      // ... full project data
      "created_at": "2026-01-25T10:35:00Z"
    }
  }
}
```

### Authentication Flow

1. Admin visits `/admin/login`
2. Enters credentials (username/password)
3. Frontend sends `POST /api/auth/login` with credentials
4. Backend validates credentials
5. If valid, backend generates JWT token
6. Backend returns JWT token and admin user data
7. Frontend stores JWT in localStorage or sessionStorage
8. Frontend includes JWT in Authorization header for all CMS API requests
9. Backend validates JWT on each CMS request via `AuthMiddleware`

**JWT Payload**:
```json
{
  "user_id": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1706182800,
  "exp": 1706269200  // 24 hour expiry
}
```

### Business Logic Layer

**Controllers**: Handle HTTP requests/responses, coordinate services
**Services**: Business logic, orchestration
**Repositories**: Database interactions, queries
**Models**: Data structures and validation

**Example Flow**:
```
Request → Controller → Service → Repository → Database
                     ↓
                  Validation
                  Email Send
                  File Upload
```

---

## Database Architecture

### Database: MySQL

**Why MySQL**:
- Relational data model fits well
- Robust, mature, widely supported
- Good performance for read-heavy workload
- Full-text search capabilities
- Company familiarity

### Database Schema

#### Table: `projects`
```sql
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  long_description TEXT,
  thumbnail VARCHAR(255),
  images JSON,  -- Array of image URLs
  technologies JSON,  -- Array of tech stack
  category VARCHAR(100),
  status VARCHAR(50),  -- 'Live', 'In Progress', 'Completed'
  url VARCHAR(255),
  client_name VARCHAR(255),
  duration VARCHAR(100),
  team_size INT,
  display_order INT DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_featured (featured),
  INDEX idx_display_order (display_order),
  FULLTEXT idx_search (title, description, long_description)
);
```

#### Table: `team_members`
```sql
CREATE TABLE team_members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(255) NOT NULL,
  bio TEXT,
  photo VARCHAR(255),
  expertise JSON,  -- Array of skills/expertise
  linkedin_url VARCHAR(255),
  github_url VARCHAR(255),
  email VARCHAR(255),
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active (active),
  INDEX idx_display_order (display_order)
);
```

#### Table: `services`
```sql
CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon VARCHAR(255),  -- Icon identifier
  technologies JSON,  -- Array of technologies
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_display_order (display_order)
);
```

#### Table: `contact_submissions`
```sql
CREATE TABLE contact_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  project_type VARCHAR(100),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new',  -- 'new', 'read', 'replied', 'archived'
  ip_address VARCHAR(45),
  user_agent TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_submitted_at (submitted_at)
);
```

#### Table: `users` (CMS Admin Users)
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',  -- 'admin', 'editor'
  active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);
```

#### Table: `blog_posts` (Post-MVP)
```sql
CREATE TABLE blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  thumbnail VARCHAR(255),
  author_id INT,
  category VARCHAR(100),
  tags JSON,
  status VARCHAR(50) DEFAULT 'draft',  -- 'draft', 'published', 'archived'
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES team_members(id),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  FULLTEXT idx_search (title, excerpt, content)
);
```

#### Table: `testimonials` (Post-MVP)
```sql
CREATE TABLE testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_position VARCHAR(255),
  client_company VARCHAR(255),
  testimonial TEXT NOT NULL,
  project_id INT,
  rating INT,  -- 1-5 stars
  photo VARCHAR(255),
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id),
  INDEX idx_active (active),
  INDEX idx_display_order (display_order)
);
```

### Data Relationships

```
projects (1) ←→ (0..n) testimonials
team_members (1) ←→ (0..n) blog_posts (author)
```

### Indexes Strategy

- **Primary Keys**: Auto-incrementing INT
- **Unique Indexes**: slug fields for URL-friendly identifiers
- **Performance Indexes**: category, status, display_order for filtering/sorting
- **Full-text Search**: title, description for search functionality

### Migration Strategy

**Development**:
- Use migration scripts for schema changes
- Version-controlled migrations
- Rollback capability

**Migration Files** (example structure):
```
migrations/
├── 001_create_projects_table.sql
├── 002_create_team_members_table.sql
├── 003_create_services_table.sql
├── 004_create_contact_submissions_table.sql
├── 005_create_users_table.sql
└── README.md
```

---

## Security Architecture

### Authentication System

**Method**: JWT (JSON Web Tokens)

**Flow**:
1. Admin login with username/password
2. Backend validates credentials against `users` table
3. Password verification using `password_verify()` (bcrypt)
4. Generate JWT with user ID and expiration
5. Return JWT to frontend
6. Frontend stores JWT (localStorage or sessionStorage)
7. Frontend includes JWT in `Authorization: Bearer <token>` header
8. Backend validates JWT on protected routes

**JWT Configuration**:
- Secret key: Stored in environment variable
- Expiration: 24 hours
- Algorithm: HS256

### Password Security

- **Hashing**: bcrypt via `password_hash()` in PHP
- **Salt**: Automatically handled by bcrypt
- **Cost Factor**: 12 (configurable)
- **Never store plain text passwords**

### Authorization Model

**Roles**:
- `admin`: Full CMS access (create, edit, delete)
- `editor`: Limited CMS access (create, edit only)

**Permissions** (MVP: single admin role, post-MVP: role-based):
```php
if ($user->role === 'admin') {
  // Full access
} elseif ($user->role === 'editor') {
  // Limited access (no delete)
}
```

### Input Validation & Sanitization

**Server-Side Validation** (all inputs):
- Required field validation
- Type validation (string, int, email, URL)
- Length validation
- Format validation (email, URL)
- Whitelist validation for enums (status, category)

**Sanitization**:
- HTML escaping for output
- SQL injection prevention via prepared statements
- XSS prevention via input sanitization

**Example**:
```php
// Validation
$validator = new Validator();
$validator->required('title')->string()->maxLength(255);
$validator->required('email')->email();

// Sanitization
$cleanTitle = htmlspecialchars($input['title'], ENT_QUOTES, 'UTF-8');
```

### SQL Injection Prevention

- **Prepared Statements**: Always use PDO prepared statements
- **Never concatenate SQL**: No string concatenation for queries
- **Parameterized Queries**: Bind parameters separately

**Example**:
```php
// ✅ CORRECT
$stmt = $pdo->prepare("SELECT * FROM projects WHERE id = :id");
$stmt->execute(['id' => $projectId]);

// ❌ NEVER DO THIS
$query = "SELECT * FROM projects WHERE id = " . $projectId;
```

### XSS Prevention

- **Output Escaping**: Escape all user-generated content
- **Content Security Policy**: Set CSP headers
- **HttpOnly Cookies**: If using cookies for sessions

**Frontend** (Angular):
- Angular's built-in XSS protection via sanitization
- Use `DomSanitizer` for trusted HTML

### CSRF Protection

**Token-Based Protection**:
- Generate CSRF token on form render
- Include token in form submission
- Validate token on backend

**Example**:
```php
// Generate token
$csrfToken = bin2hex(random_bytes(32));
$_SESSION['csrf_token'] = $csrfToken;

// Validate token
if ($input['csrf_token'] !== $_SESSION['csrf_token']) {
  throw new SecurityException('Invalid CSRF token');
}
```

### File Upload Security

**Validation**:
- File type whitelist (jpg, png, gif, webp)
- File size limit (5MB for images)
- MIME type validation
- Filename sanitization

**Storage**:
- Store outside web root or with .htaccess protection
- Rename files (UUID-based names)
- Image processing/re-encoding to remove malicious code

**Example**:
```php
$allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
$maxSize = 5 * 1024 * 1024; // 5MB

if (!in_array($file['type'], $allowedTypes)) {
  throw new ValidationException('Invalid file type');
}

if ($file['size'] > $maxSize) {
  throw new ValidationException('File too large');
}

// Rename and store
$newFilename = uniqid() . '.' . $extension;
move_uploaded_file($file['tmp_name'], $uploadDir . $newFilename);
```

### HTTPS/SSL

- **Enforce HTTPS**: Redirect all HTTP to HTTPS
- **SSL Certificate**: Let's Encrypt or managed SSL
- **HSTS Header**: Enforce HTTPS in browsers

### Security Headers

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

---

## Infrastructure Architecture

### Hosting Environment

**Option 1: DigitalOcean Droplet**
- Ubuntu 22.04 LTS
- 2GB RAM, 1 vCPU (basic tier)
- Nginx web server
- MySQL database
- SSL via Let's Encrypt

**Option 2: AWS**
- EC2 instance (t3.small)
- RDS for MySQL
- S3 for static assets/uploads
- CloudFront CDN

**Option 3: Shared Hosting** (if cost-sensitive)
- cPanel with PHP support
- MySQL database included
- Limited control but simple

### Web Server: Nginx

**Configuration**:
```nginx
server {
    listen 80;
    server_name colis.com www.colis.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name colis.com www.colis.com;

    ssl_certificate /etc/letsencrypt/live/colis.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/colis.com/privkey.pem;

    root /var/www/colis/public;
    index index.html;

    # Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API routing
    location /api {
        try_files $uri $uri/ /index.php?$query_string;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        include fastcgi_params;
    }

    # Static assets with caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### CI/CD Pipeline

**Tools**: GitHub Actions

**Workflow**:
1. Developer pushes to `main` branch
2. GitHub Actions triggered
3. Run tests (unit, integration)
4. Build Angular production bundle
5. Deploy to server via SSH/rsync
6. Run database migrations
7. Restart services

**Example GitHub Actions**:
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
      
      - name: Build Angular
        run: |
          cd frontend
          npm install
          npm run build --prod
      
      - name: Deploy to Server
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          source: "frontend/dist/*,backend/*"
          target: "/var/www/colis"
      
      - name: Run Migrations
        run: |
          ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} \
          'cd /var/www/colis && php migrate.php'
```

### Monitoring & Logging

**Application Monitoring**:
- Error logging to file
- Email alerts for critical errors
- Uptime monitoring (UptimeRobot, Pingdom)

**Web Analytics**:
- Google Analytics for user tracking
- Google Search Console for SEO

**Server Monitoring**:
- Server resource monitoring (CPU, RAM, disk)
- MySQL performance monitoring

**Log Files**:
```
/var/log/nginx/access.log  - Web server access logs
/var/log/nginx/error.log   - Web server errors
/var/www/colis/logs/app.log - Application logs
/var/www/colis/logs/error.log - Application errors
```

### Backup Strategy

**Database Backups**:
- Daily automated backups
- Retention: 30 days
- Store off-server (S3, Dropbox)

**File Backups**:
- Weekly backups of uploaded files
- Retention: 90 days

**Code Backups**:
- Git repository (GitHub) serves as code backup
- Tagged releases for versions

### Scaling Strategy (Future)

**Phase 1 (MVP)**: Single server, no scaling needed
**Phase 2 (Growth)**: Vertical scaling (larger server)
**Phase 3 (High Traffic)**: Horizontal scaling (load balancer, multiple servers)

---

## Performance Architecture

### Performance Targets

- **Page Load**: <2s desktop, <3s mobile
- **Time to Interactive**: <3s
- **First Contentful Paint**: <1.5s
- **Lighthouse Score**: 90+

### Frontend Performance

**Build Optimization**:
- Angular AOT compilation
- Tree shaking (remove unused code)
- Minification (CSS, JS, HTML)
- Bundle splitting (lazy loading)

**Image Optimization**:
- WebP format with fallbacks
- Responsive images (srcset)
- Lazy loading images
- Image compression (80% quality)

**Code Splitting**:
- Lazy load feature modules
- Separate vendor bundles

**Caching**:
- Browser caching headers
- Service Worker for offline (optional, post-MVP)

### Backend Performance

**Database Optimization**:
- Indexed queries
- Query optimization (EXPLAIN)
- Connection pooling
- Prepared statements (cache query plans)

**API Caching**:
- Cache GET responses (projects list, team list)
- Cache duration: 5-15 minutes
- Cache invalidation on CMS updates

**Example**:
```php
// Cache projects list
$cacheKey = 'projects_list_' . $page;
$projects = $cache->get($cacheKey);

if (!$projects) {
  $projects = $projectRepository->getAll($page);
  $cache->set($cacheKey, $projects, 600); // 10 min
}
```

**Response Compression**:
- Gzip compression enabled
- Minified JSON responses

### CDN Strategy (Optional, Post-MVP)

- Cloudflare for static assets
- Image CDN for optimized delivery
- Edge caching for API responses

---

## Integration Architecture

### docs/projects/ Integration

**Goal**: Automatically display projects from internal documentation

**Approach**:
- Parse `docs/projects/` directory structure
- Extract project metadata from INDEX.md or PRD files
- Sync to database or display dynamically

**Implementation Options**:

**Option 1: Database Sync**
- PHP script reads `docs/projects/` directory
- Parses INDEX.md files for project info
- Inserts/updates projects in database
- Run via cron job (daily sync)

**Option 2: Dynamic Read**
- CMS reads `docs/projects/` directory on demand
- No database storage, always fresh
- May be slower, requires file system access

**Recommended: Option 1 (Database Sync)** for performance

**Sync Script** (pseudo-code):
```php
function syncProjects() {
  $projectDirs = scandir('docs/projects/');
  
  foreach ($projectDirs as $dir) {
    $indexPath = "docs/projects/{$dir}/INDEX.md";
    if (file_exists($indexPath)) {
      $metadata = parseProjectMetadata($indexPath);
      $project = [
        'title' => $metadata['title'],
        'description' => $metadata['description'],
        'technologies' => $metadata['tech_stack'],
        'status' => $metadata['status'],
      ];
      
      // Upsert project
      $projectRepository->upsert($project);
    }
  }
}
```

### Email Service Integration

**Purpose**: Send contact form submissions to company email

**Service Options**:
- **SendGrid**: Transactional email API
- **Mailgun**: Email API
- **SMTP**: Direct SMTP (Gmail, company mail server)

**Implementation**:
```php
$emailService = new EmailService();
$emailService->send([
  'to' => 'contact@colis.com',
  'from' => $submission['email'],
  'subject' => 'New Contact Form Submission',
  'body' => $emailTemplate->render($submission),
]);
```

### Google Analytics Integration

**Setup**:
- Add GA4 tracking code to Angular app
- Track page views automatically
- Custom events for conversions (contact form submit)

**Example**:
```typescript
// Track contact form submission
gtag('event', 'contact_form_submit', {
  'event_category': 'engagement',
  'event_label': 'Contact Form'
});
```

---

## Deployment Architecture

### Deployment Process

1. **Local Development**
   - Angular dev server: `ng serve` (http://localhost:4200)
   - Slim PHP dev server: `php -S localhost:8000`
   - MySQL local instance

2. **Staging Environment** (Optional)
   - Separate server or subdomain (staging.colis.com)
   - Test deployments before production

3. **Production Environment**
   - Main server (colis.com)
   - Automated deployment via CI/CD

### Deployment Checklist

- [ ] Build Angular for production (`ng build --prod`)
- [ ] Run backend tests
- [ ] Run database migrations
- [ ] Update environment variables
- [ ] Deploy frontend files
- [ ] Deploy backend files
- [ ] Clear caches
- [ ] Test key functionality
- [ ] Monitor error logs

---

## Technology Stack Summary

### Frontend
- **Framework**: Angular 18
- **Language**: TypeScript
- **UI**: Angular Material or custom components
- **Styling**: SCSS
- **State**: Service-based (RxJS)
- **Forms**: Reactive Forms
- **HTTP**: HttpClient
- **Rich Text**: TinyMCE or CKEditor

### Backend
- **Framework**: Slim PHP 4
- **Language**: PHP 8.2+
- **API**: RESTful
- **Authentication**: JWT
- **File Handling**: Native PHP
- **Email**: SendGrid or SMTP

### Database
- **Database**: MySQL 8.0+
- **ORM**: Custom or lightweight
- **Migrations**: Version-controlled SQL scripts

### Infrastructure
- **Web Server**: Nginx
- **Hosting**: DigitalOcean / AWS
- **SSL**: Let's Encrypt
- **Domain**: Custom domain
- **CI/CD**: GitHub Actions
- **Monitoring**: UptimeRobot, Google Analytics

### Development Tools
- **Version Control**: Git (GitHub)
- **Package Management**: npm (frontend), Composer (backend)
- **Testing**: Jasmine/Karma (frontend), PHPUnit (backend)
- **Linting**: ESLint (frontend), PHP_CodeSniffer (backend)
- **Code Formatting**: Prettier

---

**Document Version**: 1.0  
**Last Updated**: 2026-01-25  
**Owner**: Marcus Johnson (Architecture Expert) / Samuel Rodriguez (Backend) / Thomas Anderson (Frontend)
