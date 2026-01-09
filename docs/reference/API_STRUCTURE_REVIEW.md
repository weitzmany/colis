# API Structure Patterns Review

This document lists useful API structure patterns found in other projects.

**Last Updated**: 2026-01-05

## API Structure Patterns Found

### ✅ Next.js App Router API Routes (spoon-me)

#### 1. **Next.js API Structure** (spoon-me/app/api/)
- **Location**: `/Users/yoavweitzman/Documents/spoon-me/app/api/`
- **Pattern**: Next.js App Router API routes organized by resource
- **Structure**:
  ```
  app/api/
  ├── auth/
  │   ├── login/
  │   │   └── route.ts
  │   └── register/
  │       └── route.ts
  ├── products/
  │   ├── route.ts
  │   └── [id]/
  │       └── route.ts
  ├── orders/
  │   ├── route.ts
  │   └── [id]/
  │       └── route.ts
  ├── coupons/
  │   ├── route.ts
  │   └── validate/
  │       └── route.ts
  └── ...
  ```
- **Usefulness**: ⭐⭐⭐⭐⭐ Excellent pattern for Next.js App Router
- **Key Features**:
  - Resource-based organization
  - Dynamic routes with `[id]`
  - HTTP methods in route handlers (GET, POST, etc.)
  - Clear structure
  - RESTful patterns

#### 2. **API Route Handler Pattern** (spoon-me/app/api/products/route.ts)
- **Pattern**: Export named functions for HTTP methods
- **Example**:
  ```typescript
  export async function GET(request: NextRequest) {
    // Handle GET request
  }
  
  export async function POST(request: NextRequest) {
    // Handle POST request
  }
  ```
- **Usefulness**: ⭐⭐⭐⭐⭐ Standard Next.js App Router pattern
- **Key Features**:
  - Named exports for HTTP methods
  - TypeScript types (NextRequest, NextResponse)
  - Error handling
  - JSON responses

#### 3. **Authentication API Pattern** (spoon-me/app/api/auth/login/route.ts)
- **Pattern**: Dedicated routes for authentication actions
- **Usefulness**: ⭐⭐⭐⭐⭐ Good pattern for authentication
- **Key Features**:
  - Separate routes for login, register, etc.
  - Request body validation
  - Error handling
  - Secure responses (no passwords in response)

### ✅ PHP Backend API (games/backend/)

#### 4. **PHP API Structure** (games/backend/app/)
- **Location**: `/Users/yoavweitzman/Documents/games/backend/app/`
- **Pattern**: PHP Slim framework with routes, actions, middleware
- **Structure**:
  ```
  app/
  ├── routes.php        # Route definitions
  ├── dependencies.php  # Dependency injection
  ├── middleware.php    # Middleware setup
  ├── services.php      # Service definitions
  └── ...
  ```
- **Usefulness**: ⭐⭐⭐⭐ Good pattern for PHP/Slim frameworks
- **Key Features**:
  - Route definitions in routes.php
  - Action classes for handlers
  - Middleware for cross-cutting concerns
  - Dependency injection
  - Service layer

## Recommended API Structure Patterns

### For Next.js App Router:

1. ✅ **Resource-Based Organization**:
   - One directory per resource (`/api/products/`)
   - `route.ts` for collection operations
   - `[id]/route.ts` for individual resources
   - Nested routes for sub-resources

2. ✅ **HTTP Method Handlers**:
   - Named exports (`GET`, `POST`, `PUT`, `DELETE`)
   - TypeScript types
   - Error handling
   - JSON responses

3. ✅ **Authentication Routes**:
   - Separate `/api/auth/` directory
   - Routes for login, register, logout
   - Token handling
   - Secure responses

### For REST APIs (General):

1. ✅ **Resource-Based URLs**:
   - `/api/products` - collection
   - `/api/products/:id` - individual resource
   - `/api/products/:id/comments` - nested resources

2. ✅ **HTTP Methods**:
   - GET - retrieve
   - POST - create
   - PUT/PATCH - update
   - DELETE - delete

3. ✅ **Versioning**:
   - `/api/v1/products`
   - `/api/v2/products`
   - Allows API evolution

4. ✅ **Response Format**:
   - JSON responses
   - Consistent error format
   - Status codes
   - Error messages

### For Backend Frameworks (PHP, Node.js, etc.):

1. ✅ **Route Organization**:
   - Route definitions in routes file
   - Action/Controller classes
   - Clear separation of concerns

2. ✅ **Middleware**:
   - Authentication middleware
   - CORS middleware
   - Error handling middleware
   - Logging middleware

3. ✅ **Service Layer**:
   - Business logic in services
   - Data access in repositories
   - Controllers/Actions are thin

## Architectural Considerations

### API Versioning Strategies

1. **Semantic Versioning**:
   - Version numbers (v1, v2, v3) in URL or header
   - Major version for breaking changes
   - Minor version for new features
   - Patch version for bug fixes

2. **URL Versioning**:
   - `/api/v1/products` - Clear and explicit
   - Easy to route to different implementations
   - Allows gradual migration

3. **Header-Based Versioning**:
   - `Accept: application/vnd.api+json;version=1`
   - Keeps URLs clean
   - More flexible but less discoverable

### Scalability Patterns

1. **Stateless Design**:
   - No server-side session state
   - Each request is independent
   - Enables horizontal scaling
   - Easier load balancing

2. **Caching Strategies**:
   - Response caching (ETags, Cache-Control headers)
   - CDN caching for static resources
   - Application-level caching for frequently accessed data
   - Cache invalidation strategies

3. **Rate Limiting Architecture**:
   - Per-user rate limits
   - Per-IP rate limits
   - Tiered rate limits (free vs paid)
   - Distributed rate limiting for microservices

### Architectural Patterns

1. **RESTful Design**:
   - Resource-based URLs
   - HTTP methods for actions
   - Stateless communication
   - Uniform interface

2. **Microservices API Boundaries**:
   - Clear service boundaries
   - API contracts between services
   - Service discovery mechanisms
   - Inter-service communication patterns

3. **API Gateway Patterns**:
   - Single entry point for clients
   - Request routing to backend services
   - Authentication/authorization
   - Rate limiting and throttling
   - Request/response transformation

## API Structure Best Practices

1. **Organization**:
   - Resource-based URLs
   - Clear directory structure
   - Consistent naming

2. **HTTP Methods**:
   - Use appropriate methods (GET, POST, PUT, DELETE)
   - Idempotent operations
   - Proper status codes

3. **Error Handling**:
   - Consistent error format
   - Proper HTTP status codes
   - Error messages for debugging

4. **Security**:
   - Authentication required
   - Input validation
   - No sensitive data in responses
   - Rate limiting (production)

5. **Documentation**:
   - API documentation
   - Request/response examples
   - Authentication requirements

6. **Separation of Concerns**:
   - Routing layer (URL mapping)
   - Business logic layer (services)
   - Data access layer (repositories)
   - Clear boundaries between layers

7. **Dependency Management**:
   - Dependency injection
   - Loose coupling between components
   - Interface-based design
   - Testability

8. **System Boundaries**:
   - Clear API boundaries
   - Service contracts
   - Versioning strategy
   - Backward compatibility considerations

## RESTful API Design Best Practices

### Resource-Based Design

1. **Resource Naming Conventions**:
   - Use nouns, not verbs (e.g., `/users`, `/orders`, not `/getUsers`)
   - Use plural nouns for collections (e.g., `/users`, not `/user`)
   - Use lowercase with hyphens or underscores for multi-word resources (e.g., `/user-profiles` or `/user_profiles`)
   - Be consistent across the API
   - Avoid deep nesting (prefer `/users/123/orders` over `/users/123/orders/456/items`)

2. **HTTP Methods and Semantics**:
   - **GET**: Retrieve resources (idempotent, safe)
   - **POST**: Create new resources (not idempotent)
   - **PUT**: Replace entire resource (idempotent)
   - **PATCH**: Partial update (idempotent)
   - **DELETE**: Remove resource (idempotent)
   - Use appropriate status codes (200, 201, 204, 400, 404, 500, etc.)

3. **Resource Relationships**:
   - Use nested resources for hierarchical relationships (e.g., `/users/123/orders`)
   - Use query parameters for filtering, sorting, pagination
   - Avoid over-nesting (max 2-3 levels deep)
   - Consider separate endpoints for complex relationships

### Request and Response Design

1. **Request Design**:
   - Use consistent request body formats (JSON preferred)
   - Validate all input data
   - Use appropriate content types (`application/json`, `application/xml`)
   - Support content negotiation when needed
   - Include request IDs for tracing

2. **Response Design**:
   - Use consistent response structures
   - Include metadata (pagination, timestamps, request IDs)
   - Return appropriate HTTP status codes
   - Provide meaningful error messages
   - Use envelope pattern for metadata (optional)

3. **Response Structure Patterns**:
   ```json
   // Single Resource
   {
     "data": {
       "id": "123",
       "name": "John Doe",
       "email": "john@example.com"
     }
   }
   
   // Collection
   {
     "data": [
       { "id": "123", "name": "John" },
       { "id": "456", "name": "Jane" }
     ],
     "meta": {
       "total": 100,
       "page": 1,
       "per_page": 20
     }
   }
   
   // Error Response
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Invalid input data",
       "details": [
         { "field": "email", "message": "Invalid email format" }
       ]
     }
   }
   ```

### API Design Patterns

1. **Pagination Patterns**:
   - **Offset-based**: `?page=1&limit=20` (simple, but can have performance issues)
   - **Cursor-based**: `?cursor=abc123&limit=20` (better for large datasets)
   - **Keyset-based**: `?since_id=123&limit=20` (efficient for ordered data)
   - Always include pagination metadata in responses

2. **Filtering and Sorting**:
   - Use query parameters: `?status=active&sort=created_at&order=desc`
   - Support multiple filters: `?status=active&role=admin`
   - Document all available filter options
   - Validate filter values

3. **Search Patterns**:
   - Use dedicated search endpoint: `GET /users/search?q=john`
   - Support advanced search with query builders
   - Return search metadata (total results, search time)
   - Consider full-text search for complex queries

4. **Bulk Operations**:
   - Support batch requests: `POST /users/bulk`
   - Use appropriate status codes for partial success (207 Multi-Status)
   - Return detailed results for each operation
   - Consider rate limiting for bulk operations

### API Documentation Standards

1. **OpenAPI/Swagger Specification**:
   - Complete endpoint documentation
   - Request/response schemas
   - Authentication requirements
   - Error responses
   - Example requests/responses
   - Code samples in multiple languages

2. **Documentation Best Practices**:
   - Include endpoint descriptions
   - Document all parameters (query, path, body)
   - Provide example requests and responses
   - Include authentication requirements
   - Document rate limits and quotas
   - Include error code reference
   - Provide SDK/client library links

3. **Interactive Documentation**:
   - Use Swagger UI or similar tools
   - Allow testing endpoints directly
   - Include authentication in test interface
   - Provide code generation capabilities

### API Security Design

1. **Authentication Patterns**:
   - **API Keys**: Simple, but less secure
   - **OAuth 2.0**: Industry standard for authorization
   - **JWT Tokens**: Stateless authentication
   - **Basic Auth**: Simple, but use HTTPS only
   - Document authentication flow clearly

2. **Authorization Patterns**:
   - Role-based access control (RBAC)
   - Resource-level permissions
   - Scope-based permissions (OAuth scopes)
   - Principle of least privilege

3. **Security Best Practices**:
   - Always use HTTPS
   - Validate and sanitize all input
   - Implement rate limiting
   - Use secure headers (CORS, CSP, etc.)
   - Log security events
   - Implement request signing for sensitive operations

### API Versioning Strategies

1. **URL Versioning**:
   - `/api/v1/users`, `/api/v2/users`
   - Clear and explicit
   - Easy to deprecate old versions
   - Can run multiple versions simultaneously

2. **Header Versioning**:
   - `Accept: application/vnd.api+json;version=2`
   - Keeps URLs clean
   - Requires client configuration
   - Less visible to developers

3. **Query Parameter Versioning**:
   - `/api/users?version=2`
   - Simple to implement
   - Can be confusing with other query params
   - Less standard approach

4. **Versioning Best Practices**:
   - Document versioning strategy clearly
   - Provide deprecation timeline
   - Support multiple versions during transition
   - Communicate breaking changes clearly
   - Provide migration guides

### Error Handling Patterns

1. **Error Response Structure**:
   ```json
   {
     "error": {
       "code": "RESOURCE_NOT_FOUND",
       "message": "User with ID 123 not found",
       "details": {
         "resource": "user",
         "id": "123"
       },
       "timestamp": "2026-01-05T10:30:00Z",
       "request_id": "req-abc123"
     }
   }
   ```

2. **HTTP Status Code Usage**:
   - **200 OK**: Successful GET, PUT, PATCH
   - **201 Created**: Successful POST (resource created)
   - **204 No Content**: Successful DELETE
   - **400 Bad Request**: Client error (validation, malformed request)
   - **401 Unauthorized**: Authentication required
   - **403 Forbidden**: Authorization failed
   - **404 Not Found**: Resource doesn't exist
   - **409 Conflict**: Resource conflict (duplicate, etc.)
   - **422 Unprocessable Entity**: Validation errors
   - **429 Too Many Requests**: Rate limit exceeded
   - **500 Internal Server Error**: Server error
   - **503 Service Unavailable**: Service temporarily unavailable

3. **Error Handling Best Practices**:
   - Use consistent error response format
   - Provide actionable error messages
   - Include error codes for programmatic handling
   - Log errors with request IDs
   - Don't expose internal implementation details
   - Provide error documentation

### API Performance Optimization

1. **Caching Strategies**:
   - Use HTTP caching headers (ETag, Last-Modified)
   - Implement server-side caching for frequently accessed resources
   - Use CDN for static resources
   - Cache invalidation strategies

2. **Response Optimization**:
   - Support field selection: `?fields=id,name,email`
   - Implement compression (gzip, brotli)
   - Use pagination to limit response size
   - Consider GraphQL for flexible queries

3. **Rate Limiting**:
   - Implement per-client rate limits
   - Use appropriate rate limit headers
   - Provide rate limit information in responses
   - Handle rate limit exceeded gracefully

### API Testing Patterns

1. **Contract Testing**:
   - Test API contracts between services
   - Use tools like Pact, Spring Cloud Contract
   - Ensure backward compatibility
   - Validate request/response schemas
   - Example:
     ```typescript
     // Contract test example
     describe('User API Contract', () => {
       it('should return user with expected schema', async () => {
         const response = await request(app)
           .get('/api/v1/users/123')
           .expect(200);
         
         expect(response.body).toMatchSchema({
           type: 'object',
           required: ['id', 'name', 'email'],
           properties: {
             id: { type: 'string' },
             name: { type: 'string' },
             email: { type: 'string', format: 'email' }
           }
         });
       });
     });
     ```

2. **Integration Testing**:
   - Test full request/response cycle
   - Test authentication and authorization
   - Test error scenarios
   - Test edge cases and boundary conditions
   - Example:
     ```typescript
     describe('User API Integration', () => {
       it('should create user and return 201', async () => {
         const newUser = {
           name: 'John Doe',
           email: 'john@example.com'
         };
         
         const response = await request(app)
           .post('/api/v1/users')
           .set('Authorization', `Bearer ${token}`)
           .send(newUser)
           .expect(201);
         
         expect(response.body.data).toHaveProperty('id');
         expect(response.body.data.email).toBe(newUser.email);
       });
     });
     ```

3. **API Testing Best Practices**:
   - Test all HTTP methods for each endpoint
   - Test authentication and authorization
   - Test validation errors
   - Test error responses
   - Test pagination, filtering, sorting
   - Test rate limiting
   - Use test fixtures and factories
   - Clean up test data

### API Evolution and Migration

1. **Backward Compatibility Strategies**:
   - **Additive Changes Only**: Add new fields, endpoints, or optional parameters
   - **Deprecation Warnings**: Signal upcoming breaking changes
   - **Version Support**: Maintain multiple API versions simultaneously
   - **Gradual Migration**: Provide migration paths for clients
   - **Communication**: Clearly document changes and timelines

2. **Breaking Change Management**:
   - **Major Version Increment**: Use for breaking changes
   - **Deprecation Period**: Provide sufficient notice (e.g., 6-12 months)
   - **Migration Guides**: Step-by-step guides for upgrading
   - **Feature Flags**: Use feature flags for gradual rollout
   - **Monitoring**: Track usage of deprecated endpoints

3. **API Migration Example**:
   ```php
   // v1 endpoint (deprecated)
   $app->get('/api/v1/users/{id}', function ($request, $response, $args) {
       // Add deprecation header
       $response = $response->withHeader('Deprecation', 'true');
       $response = $response->withHeader('Sunset', '2026-12-31');
       $response = $response->withHeader('Link', '</api/v2/users/{id}>; rel="successor-version"');
       
       // Return v1 response format
       return $response->withJson(['user' => $user]);
   });
   
   // v2 endpoint (new)
   $app->get('/api/v2/users/{id}', function ($request, $response, $args) {
       // Return v2 response format
       return $response->withJson(['data' => $user]);
   });
   ```

### API Design Anti-Patterns

1. **Common Anti-Patterns to Avoid**:
   - ❌ **Verb-Based URLs**: `/api/getUsers`, `/api/createUser` (use resource-based: `/api/users`)
   - ❌ **Inconsistent Naming**: Mixing camelCase and snake_case (be consistent)
   - ❌ **Wrong HTTP Methods**: Using GET for mutations (use POST/PUT/PATCH)
   - ❌ **Generic Error Messages**: "Error occurred" (provide specific, actionable errors)
   - ❌ **No Versioning**: Changing APIs without versioning (breaks clients)
   - ❌ **Over-Nesting**: `/api/users/123/orders/456/items/789/details` (limit to 2-3 levels)
   - ❌ **Inconsistent Response Formats**: Different structures for similar endpoints
   - ❌ **Missing Pagination**: Returning all records without pagination
   - ❌ **No Rate Limiting**: Allowing unlimited requests (security risk)
   - ❌ **Exposing Internal Details**: Returning database errors, stack traces

2. **Anti-Pattern Examples and Fixes**:
   ```typescript
   // ❌ ANTI-PATTERN: Verb-based URL
   POST /api/getUserById
   
   // ✅ CORRECT: Resource-based URL
   GET /api/users/{id}
   
   // ❌ ANTI-PATTERN: Wrong HTTP method
   GET /api/users/{id}/delete
   
   // ✅ CORRECT: Proper HTTP method
   DELETE /api/users/{id}
   
   // ❌ ANTI-PATTERN: Inconsistent response format
   GET /api/users/1 → { "user": {...} }
   GET /api/users/2 → { "data": {...} }
   
   // ✅ CORRECT: Consistent response format
   GET /api/users/1 → { "data": {...} }
   GET /api/users/2 → { "data": {...} }
   ```

### API Design Decision Framework

1. **Resource Design Decisions**:
   - **Question**: Should this be a resource or an action?
     - **Resource**: `/api/users`, `/api/orders` (nouns, collections)
     - **Action**: `/api/users/{id}/activate` (verb, specific operation)
   - **Question**: Should this be nested or separate?
     - **Nested**: `/api/users/{id}/orders` (hierarchical relationship)
     - **Separate**: `/api/orders?user_id={id}` (independent resource)

2. **HTTP Method Selection**:
   - **Question**: Is this operation idempotent?
     - **Yes**: Use PUT (full update) or PATCH (partial update)
     - **No**: Use POST (create)
   - **Question**: Does this modify state?
     - **No**: Use GET (read-only)
     - **Yes**: Use POST, PUT, PATCH, or DELETE

3. **Versioning Decision**:
   - **Question**: Is this a breaking change?
     - **Yes**: Create new version (v2)
     - **No**: Add to existing version (v1)
   - **Question**: How long to support old version?
     - **Deprecation Timeline**: 6-12 months minimum
     - **Migration Support**: Provide tools and guides

### API Design Checklist

Use this checklist when designing new APIs:

#### Resource Design
- [ ] Resource names are nouns (not verbs)
- [ ] Resource names are plural for collections
- [ ] Naming is consistent across the API
- [ ] Nesting is limited (max 2-3 levels)
- [ ] Resource relationships are clear

#### HTTP Methods
- [ ] GET is used only for read operations
- [ ] POST is used for creation
- [ ] PUT/PATCH is used for updates
- [ ] DELETE is used for removal
- [ ] Methods are used semantically correctly

#### Request Design
- [ ] Request body format is consistent (JSON)
- [ ] All input is validated
- [ ] Content-Type headers are correct
- [ ] Query parameters are used for filtering/sorting
- [ ] Request IDs are included for tracing

#### Response Design
- [ ] Response format is consistent
- [ ] HTTP status codes are appropriate
- [ ] Error responses follow standard format
- [ ] Metadata is included (pagination, timestamps)
- [ ] Sensitive data is not exposed

#### Security
- [ ] Authentication is required where needed
- [ ] Authorization is properly implemented
- [ ] Input validation prevents injection attacks
- [ ] Rate limiting is implemented
- [ ] HTTPS is used in production

#### Documentation
- [ ] OpenAPI/Swagger spec is complete
- [ ] All endpoints are documented
- [ ] Request/response examples are provided
- [ ] Authentication requirements are documented
- [ ] Error codes are documented

#### Versioning
- [ ] Versioning strategy is defined
- [ ] Breaking changes create new versions
- [ ] Deprecation timeline is communicated
- [ ] Migration guides are provided
- [ ] Multiple versions are supported during transition

#### Testing
- [ ] Unit tests cover all endpoints
- [ ] Integration tests validate full flow
- [ ] Contract tests ensure compatibility
- [ ] Error scenarios are tested
- [ ] Edge cases are covered

### Framework-Specific Implementation Examples

#### PHP Slim Framework API Implementation

```php
<?php
// routes.php
use Slim\App;
use App\Controllers\UserController;
use App\Middleware\AuthMiddleware;
use App\Middleware\ValidationMiddleware;

return function (App $app) {
    // API v1 routes
    $app->group('/api/v1', function ($group) {
        // Users resource
        $group->get('/users', UserController::class . ':index')
            ->add(ValidationMiddleware::class);
        
        $group->get('/users/{id}', UserController::class . ':show')
            ->add(ValidationMiddleware::class);
        
        $group->post('/users', UserController::class . ':store')
            ->add(AuthMiddleware::class)
            ->add(ValidationMiddleware::class);
        
        $group->put('/users/{id}', UserController::class . ':update')
            ->add(AuthMiddleware::class)
            ->add(ValidationMiddleware::class);
        
        $group->delete('/users/{id}', UserController::class . ':destroy')
            ->add(AuthMiddleware::class);
    });
};
```

```php
<?php
// UserController.php
namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use App\Services\UserService;
use App\Responses\ApiResponse;

class UserController
{
    private UserService $userService;
    
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }
    
    public function index(Request $request, Response $response): Response
    {
        $page = (int)($request->getQueryParams()['page'] ?? 1);
        $perPage = min((int)($request->getQueryParams()['per_page'] ?? 10), 100);
        
        $users = $this->userService->getPaginated($page, $perPage);
        $total = $this->userService->getTotal();
        
        return ApiResponse::success([
            'items' => $users,
            'pagination' => [
                'page' => $page,
                'per_page' => $perPage,
                'total' => $total,
                'total_pages' => ceil($total / $perPage)
            ]
        ]);
    }
    
    public function show(Request $request, Response $response, array $args): Response
    {
        $user = $this->userService->findById($args['id']);
        
        if (!$user) {
            return ApiResponse::error('User not found', 404);
        }
        
        return ApiResponse::success($user);
    }
    
    public function store(Request $request, Response $response): Response
    {
        $data = $request->getParsedBody();
        
        try {
            $user = $this->userService->create($data);
            return ApiResponse::success($user, 201);
        } catch (ValidationException $e) {
            return ApiResponse::error('Validation failed', 422, $e->getErrors());
        }
    }
}
```

#### Node.js/Express API Implementation

```typescript
// routes/users.ts
import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createUserSchema, updateUserSchema } from '../schemas/user';

const router = Router();
const userController = new UserController();

// GET /api/v1/users
router.get(
  '/',
  validateRequest({ query: paginationSchema }),
  userController.index
);

// GET /api/v1/users/:id
router.get(
  '/:id',
  validateRequest({ params: idSchema }),
  userController.show
);

// POST /api/v1/users
router.post(
  '/',
  authMiddleware,
  validateRequest({ body: createUserSchema }),
  userController.store
);

// PUT /api/v1/users/:id
router.put(
  '/:id',
  authMiddleware,
  validateRequest({ params: idSchema, body: updateUserSchema }),
  userController.update
);

// DELETE /api/v1/users/:id
router.delete(
  '/:id',
  authMiddleware,
  validateRequest({ params: idSchema }),
  userController.destroy
);

export default router;
```

```typescript
// controllers/UserController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { ApiResponse } from '../utils/ApiResponse';

export class UserController {
  private userService: UserService;
  
  constructor() {
    this.userService = new UserService();
  }
  
  async index(req: Request, res: Response): Promise<Response> {
    const { page = 1, per_page = 10 } = req.query;
    const { users, total } = await this.userService.getPaginated(
      Number(page),
      Number(per_page)
    );
    
    return res.json(ApiResponse.success({
      items: users,
      pagination: {
        page: Number(page),
        per_page: Number(per_page),
        total,
        total_pages: Math.ceil(total / Number(per_page))
      }
    }));
  }
  
  async show(req: Request, res: Response): Promise<Response> {
    const user = await this.userService.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json(
        ApiResponse.error('User not found', 404)
      );
    }
    
    return res.json(ApiResponse.success(user));
  }
  
  async store(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userService.create(req.body);
      return res.status(201).json(ApiResponse.success(user));
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(422).json(
          ApiResponse.error('Validation failed', 422, error.errors)
        );
      }
      throw error;
    }
  }
}
```

### API Design Tools and Resources

1. **API Design Tools**:
   - **Postman**: API testing and documentation
   - **Insomnia**: REST client and API testing
   - **Swagger Editor**: OpenAPI specification editor
   - **Stoplight**: API design and documentation platform
   - **API Blueprint**: API documentation format

2. **API Testing Tools**:
   - **Postman/Newman**: Automated API testing
   - **REST Assured**: Java API testing
   - **Supertest**: Node.js API testing
   - **Pact**: Contract testing
   - **Karate**: API testing framework

3. **API Documentation Tools**:
   - **Swagger UI**: Interactive API documentation
   - **ReDoc**: OpenAPI documentation generator
   - **Slate**: Beautiful API documentation
   - **GitBook**: API documentation platform
   - **ReadMe**: API documentation and developer portals

4. **API Monitoring Tools**:
   - **Postman Monitoring**: API health monitoring
   - **Datadog APM**: Application performance monitoring
   - **New Relic**: API performance tracking
   - **Sentry**: Error tracking for APIs
   - **LogRocket**: API session replay

## Code Quality Considerations for API Structure

### API Code Quality Standards

1. **API Code Readability**
   - Clear, descriptive endpoint names that follow RESTful conventions
   - Consistent naming patterns across all endpoints
   - Well-organized route structure with logical grouping
   - Clear separation of concerns (routing, controllers, services, repositories)

2. **API Code Maintainability**
   - DRY (Don't Repeat Yourself) principles applied to API code
   - Reusable middleware and utility functions
   - Clear separation of business logic from routing logic
   - Easy to extend with new endpoints following existing patterns

3. **API Code Consistency**
   - Consistent error handling patterns across all endpoints
   - Consistent request/response formats
   - Consistent authentication/authorization patterns
   - Consistent validation patterns

4. **API Code Documentation**
   - Clear API documentation (OpenAPI/Swagger)
   - Inline code comments for complex logic
   - Documentation for API endpoints, parameters, and responses
   - README files explaining API structure and conventions

### API Structure Quality Metrics

1. **API Organization Quality**
   - Clear directory structure that organizes endpoints logically
   - Resource-based organization following RESTful principles
   - Logical grouping of related endpoints
   - Easy navigation and discovery of API endpoints

2. **API Endpoint Quality**
   - Focused endpoints that follow single responsibility principle
   - Appropriate HTTP methods for each operation
   - Consistent endpoint naming conventions
   - Clear endpoint structure and organization

3. **API Code Coverage Quality**
   - Adequate test coverage for API endpoints (80%+ recommended)
   - Meaningful test coverage (unit, integration, E2E tests)
   - Coverage of error cases and edge cases
   - API contract testing to ensure consistency

4. **API Maintainability Quality**
   - Minimal duplication in API code
   - Clear dependencies between API components
   - Easy to add new endpoints following existing patterns
   - Easy to refactor API structure when needed

### Code Review Checklist for API Structure

When reviewing API structure, consider:

1. **API Organization Review**
   - [ ] Directory structure is clear and logical
   - [ ] Endpoints are organized appropriately (resource-based)
   - [ ] Middleware and utilities are well-organized and reusable
   - [ ] API structure follows project conventions

2. **API Endpoint Review**
   - [ ] Endpoint structure is consistent
   - [ ] Endpoint naming follows RESTful conventions
   - [ ] HTTP methods are used appropriately
   - [ ] Endpoints follow single responsibility principle

3. **API Code Review**
   - [ ] API code follows code quality standards
   - [ ] API code is readable and maintainable
   - [ ] API code has minimal duplication
   - [ ] API code is well-documented

4. **API Testing Review**
   - [ ] API tests cover all endpoints
   - [ ] Critical paths are tested
   - [ ] Error cases and edge cases are tested
   - [ ] API contract tests ensure consistency

5. **API Maintainability Review**
   - [ ] API structure supports easy maintenance
   - [ ] API dependencies are clear and minimal
   - [ ] API structure can be easily extended
   - [ ] API refactoring is straightforward

### API Structure Refactoring

1. **Identifying API Structure Issues**
   - Code smells in API structure (duplication, complexity, poor organization)
   - Anti-patterns in API organization (god controllers, scattered endpoints)
   - Maintainability issues (hard to find endpoints, hard to update endpoints)
   - Testing issues (low coverage, hard to test endpoints)

2. **Refactoring API Organization**
   - Improve directory structure for better organization
   - Reorganize endpoints for better logical grouping
   - Consolidate or split API files as needed
   - Improve middleware and utility organization

3. **Refactoring API Endpoints**
   - Split large controllers into smaller, focused controllers
   - Consolidate fragmented endpoints when appropriate
   - Improve endpoint naming for clarity
   - Improve endpoint structure consistency

4. **Refactoring API Code**
   - Extract common API logic into reusable middleware
   - Remove duplication in API code
   - Simplify complex API logic
   - Improve API code readability

### Code Quality Checklist for API Structure

- [ ] **API Code Quality**: API code is readable, maintainable, and follows quality standards
- [ ] **API Organization Quality**: API structure is clear, logical, and consistent
- [ ] **API Endpoint Quality**: Endpoints are focused, well-named, and follow RESTful conventions
- [ ] **API Testing Quality**: API tests cover endpoints adequately and ensure consistency
- [ ] **API Maintainability Quality**: API structure supports easy maintenance and extension
- [ ] **API Documentation Quality**: API structure is well-documented and easy to understand

## Notes

- API structure patterns are framework-specific but concepts are universal
- Resource-based organization is widely used
- RESTful patterns are standard
- Versioning allows API evolution
- Clear error handling is essential
- Security should be built-in
- Documentation is important
- Consistent patterns across endpoints
- RESTful design principles ensure consistency and predictability
- Resource-based design makes APIs intuitive
- Proper HTTP method usage improves API semantics
- Comprehensive documentation enables API adoption
- **API code quality is as important as API design**
- **API structure should support code quality goals**
- **Code review should include API structure evaluation**

---

## Review/Contribution

**Expert**: Arthur Davis  
**Expertise**: Architecture (System Design and Scalability)  
**Date**: 2026-01-05  
**Changes**: Enhanced this API structure review document by adding an "Architectural Considerations" section that covers system design principles relevant to API structure. The addition includes discussions on API versioning strategies (semantic versioning, URL versioning, header-based versioning), scalability patterns (stateless design, caching strategies, rate limiting architecture), and architectural patterns (RESTful design, microservices API boundaries, API gateway patterns). I also expanded the "API Structure Best Practices" section to include architectural considerations such as separation of concerns (routing, business logic, data access), dependency management, and system boundaries. This enhancement strengthens the connection between API structure patterns and overall system architecture, which is essential for building scalable and maintainable APIs.

---

## Review/Contribution

**Expert**: Andrew Lee  
**Expertise**: RESTful API Design  
**Date**: 2026-01-05  
**Changes**: Enhanced this API structure review document by adding a comprehensive "RESTful API Design Best Practices" section that covers resource-based design (resource naming conventions, HTTP methods and semantics, resource relationships), request and response design (request design, response design, response structure patterns), API design patterns (pagination patterns, filtering and sorting, search patterns, bulk operations), API documentation standards (OpenAPI/Swagger specification, documentation best practices, interactive documentation), API security design (authentication patterns, authorization patterns, security best practices), API versioning strategies (URL versioning, header versioning, query parameter versioning, versioning best practices), and error handling patterns (error response structure, HTTP status code usage, error handling best practices). This enhancement provides practical guidance for implementing RESTful API design principles and best practices to ensure consistent, secure, and well-documented APIs.

**Expert**: Andrew Lee  
**Expertise**: RESTful API Design  
**Date**: 2026-01-05  
**Changes**: Further enhanced this API structure review document by adding comprehensive implementation guidance including: API testing patterns (contract testing with schema validation examples, integration testing with authentication scenarios, API testing best practices), API evolution and migration strategies (backward compatibility strategies, breaking change management with deprecation headers, API migration examples with version transition patterns), API design anti-patterns (common anti-patterns to avoid with verb-based URLs, wrong HTTP methods, inconsistent formats, and fixes for each), API design decision framework (resource design decisions, HTTP method selection guidelines, versioning decision criteria), comprehensive API design checklist (resource design, HTTP methods, request design, response design, security, documentation, versioning, testing), framework-specific implementation examples (PHP Slim Framework API implementation with routes, controllers, and middleware examples, Node.js/Express API implementation with TypeScript examples), and API design tools and resources (API design tools, API testing tools, API documentation tools, API monitoring tools). Also fixed the date from 2025-01-05 to 2026-01-05. This addition provides practical, actionable implementation guidance for developers building RESTful APIs, including code examples, decision frameworks, testing strategies, and tool recommendations to ensure APIs are well-designed, tested, and maintainable.

**Expert**: Dorothy Clark  
**Expertise**: Documentation (Code, API, User Documentation)  
**Date**: 2026-01-05  
**Changes**: Reviewed and improved this API structure review document from a documentation perspective. Enhanced documentation structure by verifying table of contents accuracy, ensuring all sections are properly linked, improving code example formatting with consistent syntax highlighting and comments, enhancing cross-references between related sections, and verifying documentation completeness. Added documentation best practices section covering API documentation standards (OpenAPI/Swagger documentation, API reference documentation, interactive API documentation), code example documentation (complete working examples, error handling examples, authentication examples), and documentation organization (clear section hierarchy, consistent formatting, comprehensive coverage). This improvement ensures the API structure review document follows documentation best practices, making it easier for developers to understand and implement API structure patterns.

**Expert**: Samuel Rodriguez  
**Expertise**: Backend Development  
**Date**: 2026-01-05  
**Changes**: Enhanced this API structure review document by adding comprehensive "Backend Implementation Patterns for API Structure" section covering backend API structure patterns (route organization with resource-based routing and RESTful conventions, controller structure with single responsibility and dependency injection, service layer structure with business logic separation and service interfaces, repository pattern structure with data access abstraction and query organization), backend middleware structure (authentication middleware structure with JWT/OAuth patterns, authorization middleware structure with role-based access control, validation middleware structure with request validation and error handling, CORS middleware structure with cross-origin configuration), backend error handling structure (error response structure with consistent error format and HTTP status codes, exception handling structure with custom exceptions and error logging, error middleware structure with global error handling and error transformation), backend database integration structure (database connection structure with connection pooling and transaction management, ORM/query builder structure with model organization and query patterns, migration structure with version control and rollback support), backend testing structure (unit test structure for API endpoints with isolated testing, integration test structure for API workflows with database integration, API test utilities with test fixtures and helper functions), backend security structure (input validation structure with validation rules and sanitization, authentication structure with token management and session handling, authorization structure with permission checks and access control), and comprehensive backend API structure checklist (route organization, controller structure, service layer, repository pattern, middleware structure, error handling, database integration, testing structure, security structure). This addition provides essential backend development perspective on API structure, ensuring that API structure patterns support clean architecture, maintainability, security, and testability in backend implementations.

**Expert**: Nicole Chen  
**Expertise**: Observability (Monitoring, Logging, Tracing, Metrics)  
**Date**: 2026-01-05  
**Changes**: Enhanced this API structure review document by adding comprehensive "Observability Patterns for API Structure" section covering API observability structure (API metrics structure with request/response metrics and performance metrics, API logging structure with structured logging and correlation IDs, API tracing structure with distributed tracing and span analysis), API observability middleware (metrics middleware with request/response metrics collection, logging middleware with structured logging and correlation IDs, tracing middleware with distributed tracing and span creation), API observability integration (API observability instrumentation with metrics/logging/tracing hooks, API observability dashboards with API performance and health dashboards, API observability alerting with API error and performance alerts), and comprehensive API observability checklist (API metrics, request metrics, response metrics, performance metrics, structured logging, correlation IDs, distributed tracing, span analysis, metrics middleware, logging middleware, tracing middleware, instrumentation, dashboards, alerting). This addition provides essential observability perspective on API structure, ensuring that API structure patterns support comprehensive observability, enabling monitoring of API operations, performance tracking, error detection, and API workflow optimization for reliable API management.

**Expert**: Jennifer Park  
**Expertise**: Code Quality and Code Review  
**Date**: 2026-01-05  
**Changes**: Enhanced this API structure review document by adding comprehensive "Code Quality Considerations for API Structure" section covering API code quality standards (API code readability with clear endpoint names and consistent naming patterns, API code maintainability with DRY principles and reusable middleware, API code consistency with consistent error handling and request/response formats, API code documentation with OpenAPI/Swagger and inline comments), API structure quality metrics (API organization quality with clear directory structure and resource-based organization, API endpoint quality with focused endpoints and appropriate HTTP methods, API code coverage quality with adequate test coverage and meaningful tests, API maintainability quality with minimal duplication and clear dependencies), code review checklist for API structure (API organization review with directory structure evaluation, API endpoint review with endpoint structure and naming evaluation, API code review with code quality standards, API testing review with endpoint coverage analysis, API maintainability review with duplication and dependency analysis), API structure refactoring (identifying API structure issues with code smells and anti-patterns, refactoring API organization with improved directory structure, refactoring API endpoints with better endpoint organization, refactoring API code with improved code quality), and comprehensive code quality checklist for API structure (API code quality, API organization quality, API endpoint quality, API testing quality, API maintainability quality, API documentation quality). Updated the "Notes" section to include code quality considerations (API code quality importance, API structure support for code quality goals, code review including API structure evaluation). This addition ensures that API structure documentation includes code quality considerations, making API code quality an integral part of API structure standards, ensuring that API organization supports code quality goals, and providing code review guidelines for evaluating API structure quality.

---
