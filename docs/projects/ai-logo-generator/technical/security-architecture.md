# AI Logo Generator - Security Architecture

## Authentication Flow
### User Registration
1. User submits email and password
2. Backend hashes password (bcrypt, cost 12)
3. User record created
4. JWT token generated and returned

### User Login
1. User submits credentials
2. Backend verifies credentials
3. JWT token generated (RS256, 1-hour expiry)
4. Token stored by frontend

### Token Refresh
- Short-lived access tokens (1 hour)
- Long-lived refresh tokens (30 days)
- Refresh endpoint for new access tokens

## Authorization Model
**Role-Based Access Control (RBAC)**
- Free User: 1 free generation, watermarked downloads
- Paid User: Purchased logos, high-res downloads
- Subscriber (post-MVP): Subscription benefits
- Admin (internal): User management, analytics

## Data Encryption
### In Transit
- HTTPS/TLS 1.3 only
- HSTS header enabled

### At Rest
- Encrypted database fields (user email, payment info)
- Encrypted S3 buckets (AES-256)

## API Security
- Rate limiting: 10 req/min (free), 100 req/min (paid)
- Input sanitization (XSS prevention)
- Prepared statements to prevent SQL injection
- CSRF protection (token-based)

## API Key Management
- OpenAI API keys stored in environment variables
- Stripe keys separated (public vs secret)
- Never expose keys in frontend code
