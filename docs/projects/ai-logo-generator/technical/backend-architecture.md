# AI Logo Generator - Backend Architecture

## Framework and Dependencies
### Core
- Slim PHP 4
- PHP 8.2+
- Composer

### Key Dependencies
- firebase/php-jwt (JWT auth)
- guzzlehttp/guzzle (HTTP client)
- stripe/stripe-php (payments)
- vlucas/phpdotenv (env config)
- monolog/monolog (logging)

## Service Pattern
```
src/
├── Controllers/
│   ├── AuthController.php
│   ├── LogoController.php
│   ├── PaymentController.php
│   └── UserController.php
├── Services/
│   ├── AuthService.php
│   ├── LogoGenerationService.php
│   ├── AIPromptService.php
│   ├── PaymentService.php
│   └── StorageService.php
├── Repositories/
│   ├── UserRepository.php
│   ├── LogoRepository.php
│   └── PaymentRepository.php
├── Models/
│   ├── User.php
│   ├── Logo.php
│   └── Payment.php
└── Middleware/
    ├── JwtAuthMiddleware.php
    ├── RateLimitMiddleware.php
    └── ValidationMiddleware.php
```

## Business Logic Summary
- Optimize prompt
- Generate images via AI API
- Upload to S3
- Save records to database
- Return URLs to client
