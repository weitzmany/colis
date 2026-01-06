# Projects Ports Reference

This document lists all ports used by applications across all projects in `~/Documents/`.

**Last Updated**: 2026-01-05

## Port Usage Table

| Project Name | App | Port | Notes |
|-------------|-----|------|-------|
| **games** | Frontend (Angular) | 4200 | Configured in `angular.json` |
| **games** | Backend (PHP) | 8080 | Docker container port mapping (host:8080 → container:80) |
| **games** | Database (MySQL) | 3306 | Default MySQL port, exposed via Docker |
| **games** | phpMyAdmin | 8081 | Database management UI |
| **discord-story-bot** | Web Server (Express) | 3000 | Default port (can be overridden via PORT env) |
| **spoon-me** | Frontend (Next.js) | 3000 | Next.js default dev server port |
| **bots** | Web Panel (Express) | PORT env | Uses `process.env.PORT` (no default in code; typically 3000 or 5000) |
| **sandbox/keel** | Frontend (Angular) | 4200 | Angular CLI default dev server port |
| **find-hidden-files** | N/A | N/A | Obsidian plugin (no server) |
| **packages** | N/A | N/A | Documentation only (no server) |

## Summary by Port

### Port 3000
- **discord-story-bot** - Web Server (Express)
- **spoon-me** - Frontend (Next.js)
- **bots** - Web Panel (Express) - if PORT env not set

### Port 4200
- **games** - Frontend (Angular)
- **sandbox/keel** - Frontend (Angular)

### Port 3306
- **games** - Database (MySQL)

### Port 8080
- **games** - Backend (PHP)

### Port 8081
- **games** - phpMyAdmin

## Configuration Details

### games Project

**Frontend (Angular)**
- **Port**: 4200
- **Configuration**: `frontend/angular.json`
- **Config Location**: `serve.options.port: 4200`
- **Default**: Angular CLI default is 4200
- **Override**: Can be changed via `ng serve --port <port>` or in `angular.json`

**Backend (PHP)**
- **Port**: 8080 (host) → 80 (container)
- **Configuration**: `docker-compose.yml`
- **Config Location**: `services.php.ports: "8080:80"`
- **Access**: `http://localhost:8080`

**Database (MySQL)**
- **Port**: 3306
- **Configuration**: `docker-compose.yml`
- **Config Location**: `services.mysql.ports: "3306:3306"`
- **Default**: MySQL standard port
- **Access**: `localhost:3306`

**phpMyAdmin**
- **Port**: 8081 (host) → 80 (container)
- **Configuration**: `docker-compose.yml`
- **Config Location**: `services.phpmyadmin.ports: "8081:80"`
- **Access**: `http://localhost:8081`

### discord-story-bot Project

**Web Server (Express)**
- **Port**: 3000
- **Configuration**: `web-server.mjs`
- **Config Location**: `const PORT = process.env.PORT || 3000;`
- **Default**: 3000 (if PORT env not set)
- **Override**: Set `PORT` environment variable
- **Access**: `http://localhost:3000`

### spoon-me Project

**Frontend (Next.js)**
- **Port**: 3000
- **Configuration**: Next.js default
- **Default**: Next.js dev server default is 3000
- **Override**: Can be changed via `next dev -p <port>` or `PORT` environment variable
- **Access**: `http://localhost:3000`

### bots Project

**Web Panel (Express)**
- **Port**: Uses `process.env.PORT` (no default in code)
- **Configuration**: `web.js`
- **Config Location**: `server.listen(process.env.PORT, ...)`
- **Typical Defaults**: 3000 or 5000 (common Express defaults)
- **Override**: Must set `PORT` environment variable
- **Access**: `http://localhost:${PORT}`

### sandbox/keel Project

**Frontend (Angular)**
- **Port**: 4200
- **Configuration**: Angular CLI default
- **Default**: Angular CLI default is 4200
- **Override**: Can be changed via `ng serve --port <port>`
- **Access**: `http://localhost:4200`

## Port Conflicts and Recommendations

### Potential Conflicts

1. **Port 3000** is used by multiple projects:
   - discord-story-bot (web server)
   - spoon-me (Next.js)
   - bots (web panel - if PORT not set)
   
   **Recommendation**: Only run one of these projects at a time, or configure different ports.

2. **Port 4200** is used by multiple Angular projects:
   - games (frontend)
   - sandbox/keel (frontend)
   
   **Recommendation**: Only run one Angular project at a time, or configure different ports.

### Port Range Recommendations

- **3000-3099**: Web applications (Next.js, Express, etc.)
- **4200-4299**: Angular development servers
- **8000-8099**: Backend services (PHP, APIs, etc.)
- **3306**: MySQL databases (standard)
- **5432**: PostgreSQL databases (standard, if used)
- **6379**: Redis (standard, if used)

## Environment Variables

Projects that use environment variables for port configuration:

1. **discord-story-bot**: `PORT` (defaults to 3000)
2. **bots**: `PORT` (no default, must be set)
3. **spoon-me**: `PORT` (Next.js respects this, defaults to 3000)

## Docker Port Mappings

The **games** project uses Docker with the following port mappings:

- **PHP Backend**: Host `8080` → Container `80`
- **MySQL**: Host `3306` → Container `3306`
- **phpMyAdmin**: Host `8081` → Container `80`

## Notes

1. **bots** web panel: Uses `process.env.PORT` with no default in code. Common defaults are 3000 or 5000 for Express applications.

2. **Next.js** (spoon-me): Defaults to port 3000, but can be changed via `-p` flag or `PORT` environment variable.

3. **Angular** (games, sandbox/keel): Defaults to port 4200, but can be changed in `angular.json` or via `--port` flag.

4. **MySQL** (games): Uses standard port 3306.

5. **PHP** (games): Container exposes port 80 internally, mapped to 8080 on the host.

6. All ports are configurable via environment variables or configuration files.

## Quick Reference

### Start Projects on Specific Ports

**Angular (games)**:
```bash
cd games/frontend
ng serve --port 4200
```

**Angular (sandbox/keel)**:
```bash
cd sandbox/keel
ng serve --port 4200
```

**Next.js (spoon-me)**:
```bash
cd spoon-me
PORT=3000 npm run dev
# or
npm run dev -- -p 3000
```

**Express (discord-story-bot)**:
```bash
cd discord-story-bot
PORT=3000 node web-server.mjs
```

**Express (bots)**:
```bash
cd bots
PORT=3000 node web.js
```

**Docker (games)**:
```bash
cd games
docker-compose up
# Ports are configured in docker-compose.yml
```

---

## Review/Contribution

**Last Updated**: 2026-01-05  
**Source**: Scanned all projects in `~/Documents/` directory for port configurations

