# Technical: Infrastructure Architecture

## Hosting
- **Frontend**: Vercel or Netlify
- **Backend**: DigitalOcean or AWS
- **Database**: Managed PostgreSQL
- **Cache/Queue**: Managed Redis

## Environments
- Development
- Staging
- Production

## CI/CD
- GitHub Actions for tests, build, deploy
- Automated linting and unit tests
- E2E tests in staging

## Deployment
- Dockerized backend services
- Nginx reverse proxy
- CDN for static assets
