# 🌕 MoonForge - Step-by-Step Setup Guide

## 📋 Quick Reference

**Total Setup Time:** ~30-45 minutes  
**Difficulty Level:** Intermediate  
**Prerequisites:** Node.js 18+, Docker, Git

---

## Phase 1: Environment Setup (5 minutes)

### Step 1.1: Install Global Dependencies

```bash
# Check Node.js version (should be 18.x or 20.x)
node --version

# Install pnpm (latest)
npm install -g pnpm

# Verify pnpm installation
pnpm --version

# Install Moon CLI (optional, for advanced usage)
curl -fsSL https://moon.tools/install.sh | bash
```

### Step 1.2: Verify Docker Installation

```bash
# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# If not installed:
# macOS: brew install docker docker-compose
# Windows: Download Docker Desktop
# Linux: sudo apt-get install docker.io docker-compose
```

### Step 1.3: Clone Repository

```bash
# Clone the repository
git clone https://github.com/moonforge/moonforge.git
cd moonforge

# Verify git setup
git log --oneline -1
```

---

## Phase 2: Environment Configuration (5 minutes)

### Step 2.1: Copy Environment File

```bash
# From project root
cp .env.example .env

# Verify file was created
cat .env
```

### Step 2.2: Edit .env File

**Add these values:**

```env
# Database Configuration
DATABASE_URL="postgresql://moonforge:moonforge@localhost:5432/moonforge"
POSTGRES_DB=moonforge
POSTGRES_USER=moonforge
POSTGRES_PASSWORD=moonforge

# Claude API (Get from https://console.anthropic.com)
ANTHROPIC_API_KEY="sk-ant-YOUR_KEY_HERE"

# Application Settings
NODE_ENV="development"
API_PORT=3000
PLATFORM_PORT=3001
ADMIN_PORT=3002

# Optional: Logging
LOG_LEVEL="debug"
```

**On macOS/Linux:**
```bash
nano .env  # or vim, code, etc.
```

**On Windows:**
```bash
notepad .env
```

### Step 2.3: Get Claude API Key

1. Go to https://console.anthropic.com
2. Sign up or log in
3. Navigate to API Keys section
4. Create new API key
5. Copy the key (starts with `sk-ant-`)
6. Paste into `.env` file as `ANTHROPIC_API_KEY`

---

## Phase 3: Database Setup (10 minutes)

### Step 3.1: Start PostgreSQL with Docker

```bash
# Start PostgreSQL service (background)
docker-compose -f docker-compose.dev.yaml up -d postgres

# Verify it's running
docker-compose -f docker-compose.dev.yaml ps

# Expected output:
# NAME                COMMAND                  STATUS
# moonforge-postgres  "docker-entrypoint..."   Up 2 minutes
```

### Step 3.2: Wait for Database to be Ready

```bash
# Check logs to ensure startup is complete
docker-compose -f docker-compose.dev.yaml logs postgres

# Look for: "database system is ready to accept connections"
# This takes about 5-10 seconds

# If it fails, check your .env DATABASE_URL
```

### Step 3.3: Verify Database Connection

```bash
# Test connection using psql (if available)
psql postgresql://moonforge:moonforge@localhost:5432/moonforge -c "SELECT 1"

# Or use Docker exec
docker-compose -f docker-compose.dev.yaml exec postgres psql -U moonforge -d moonforge -c "SELECT 1"

# Expected: 
# ?column?
#    1
```

---

## Phase 4: Install Dependencies (10 minutes)

### Step 4.1: Install Root Dependencies

```bash
# From project root
pnpm install

# Expected output:
# added 500+ packages in X seconds
```

### Step 4.2: Install Workspace Dependencies

```bash
# Install all dependencies for all workspaces
pnpm install --recursive

# This installs:
# - root dependencies
# - apps/api dependencies
# - apps/platform dependencies
# - apps/admin dependencies
# - packages/types dependencies
# - packages/ui dependencies (if exists)
```

### Step 4.3: Verify Installation

```bash
# Check pnpm-lock.yaml was generated
ls -la pnpm-lock.yaml

# List installed workspaces
pnpm ls --depth=0

# Expected output should show:
# moonforge@1.0.0
# ├── apps/api
# ├── apps/platform
# ├── apps/admin
# └── packages/types
```

---

## Phase 5: Prisma Database Setup (10 minutes)

### Step 5.1: Navigate to API Workspace

```bash
# Go to API directory
cd apps/api

# Verify you're in the right place
pwd  # should end with /apps/api
```

### Step 5.2: Create Initial Migration

```bash
# Create migration from schema
pnpm prisma migrate dev --name init

# You'll be prompted:
# ✔ Enter a name for the new migration: › init

# Expected output:
# ✔ Created migration files
# ✔ Ran all pending migrations
# ✔ Generated Prisma Client in X seconds
```

### Step 5.3: Generate Prisma Client

```bash
# Generate Prisma Client (should already be done above)
pnpm prisma generate

# Verify client was generated
ls -la node_modules/.prisma/client

# Expected: index.js, index.d.ts, and other files
```

### Step 5.4: Verify Database Schema

```bash
# Open Prisma Studio (optional but useful)
pnpm prisma studio

# Browser will open at http://localhost:5555
# You should see the database tables:
# - users
# - projects
# - project_versions
# - project_files
# - chat_messages

# Press Ctrl+C to close
```

### Step 5.5: Return to Root

```bash
# Go back to project root
cd ../..

# Verify
pwd  # should end with /moonforge
```

---

## Phase 6: Code Quality Setup (5 minutes)

### Step 6.1: Run Type Check

```bash
# Check TypeScript compilation
pnpm type-check

# Expected:
# ✔ 0 errors, 0 warnings
```

### Step 6.2: Run Linter

```bash
# Lint all files
pnpm lint

# Expected:
# No errors (or warnings you can ignore in dev)
```

### Step 6.3: Format Code

```bash
# Auto-format all files
pnpm format

# This uses Biome to format TypeScript, JSON, etc.
```

### Step 6.4: Verify Git Hooks

```bash
# Install Husky hooks
pnpm husky install

# Verify hooks are installed
ls -la .husky

# Expected: pre-commit, commit-msg files
```

---

## Phase 7: Start Development Servers (5 minutes)

### Option A: Start All Services (Recommended)

```bash
# From project root
pnpm run dev

# This starts all services:
# - API (Hono) on http://localhost:3000
# - Platform (TanStack Start) on http://localhost:3001
# - Admin (TanStack Start) on http://localhost:3002

# You should see output like:
# ✔ API server running at http://localhost:3000
# ✔ Platform app running at http://localhost:3001
# ✔ Admin app running at http://localhost:3002

# Press Ctrl+C to stop all services
```

### Option B: Start Services Individually

**Terminal 1 - API Server:**
```bash
cd apps/api
pnpm dev

# Expected:
# Server is running at http://localhost:3000
```

**Terminal 2 - Platform Frontend:**
```bash
cd apps/platform
pnpm dev

# Expected:
# ✔ Ready in X ms
# ➜ Local: http://localhost:3001
```

**Terminal 3 - Admin Frontend:**
```bash
cd apps/admin
pnpm dev

# Expected:
# ✔ Ready in X ms
# ➜ Local: http://localhost:3002
```

---

## Phase 8: Verify Everything Works (5 minutes)

### Step 8.1: Check API Health

```bash
# In a new terminal (keep dev servers running)
curl http://localhost:3000/api/health

# Expected response:
# {"status":"ok"}
```

### Step 8.2: Access Platform UI

```bash
# Open in browser
open http://localhost:3001

# Or paste in browser address bar:
# http://localhost:3001

# Expected:
# - Dashboard page loads
# - No console errors
```

### Step 8.3: Access Admin UI

```bash
# Open in browser
open http://localhost:3002

# Expected:
# - Admin page loads
# - No console errors
```

### Step 8.4: Check Database with Prisma Studio

```bash
# In a new terminal
cd apps/api
pnpm prisma studio

# Browser opens at http://localhost:5555
# You can browse:
# - users table (empty initially)
# - projects table (empty initially)
# - etc.
```

### Step 8.5: Check Docker Services

```bash
# Verify all services running
docker-compose -f docker-compose.dev.yaml ps

# Expected:
# NAME                COMMAND                  STATUS
# moonforge-postgres  docker-entrypoint...     Up X minutes
```

---

## Phase 9: Project Structure Verification (2 minutes)

### Step 9.1: Verify File Structure

```bash
# From project root, check key directories exist
tree -L 2 -d

# Or using ls:
ls -la apps/
ls -la packages/
ls -la .moon/

# Expected structure:
# moonforge/
# ├── .moon/ (Moon config files)
# ├── apps/
# │   ├── api/ (Hono backend)
# │   ├── platform/ (TanStack Start frontend)
# │   └── admin/ (TanStack Start admin)
# ├── packages/
# │   └── types/ (Shared TypeScript types)
# ├── .env (environment variables)
# ├── docker-compose.dev.yaml
# ├── package.json
# ├── pnpm-lock.yaml
# └── tsconfig.json
```

### Step 9.2: Verify Key Files Exist

```bash
# Check that template files are present
[ -f apps/api/src/index.ts ] && echo "✓ API entry" || echo "✗ API entry"
[ -f apps/platform/vite.config.ts ] && echo "✓ Platform vite" || echo "✗ Platform vite"
[ -f apps/admin/vite.config.ts ] && echo "✓ Admin vite" || echo "✗ Admin vite"
[ -f packages/types/src/index.ts ] && echo "✓ Types" || echo "✗ Types"
```

---

## Phase 10: Build for Production (Optional)

### Step 10.1: Build All Packages

```bash
# From project root
pnpm build

# Expected:
# Building api...
# ✓ Build complete
# Building platform...
# ✓ Build complete
# Building admin...
# ✓ Build complete
```

### Step 10.2: Verify Build Outputs

```bash
# Check that build directories were created
ls -la apps/api/dist/
ls -la apps/platform/dist/
ls -la apps/admin/dist/

# Each should contain built files
```

---

## Phase 11: Docker Production Setup (Optional)

### Step 11.1: Build Docker Images

```bash
# Build API image
docker build -f Dockerfile.api -t moonforge-api:latest .

# Verify image was created
docker image ls | grep moonforge

# Expected:
# moonforge-api  latest  <image-id>  X seconds ago
```

### Step 11.2: Run with Production Docker Compose

```bash
# Make sure development services are stopped
docker-compose -f docker-compose.dev.yaml down

# Start production services
docker-compose up -d

# Verify all services are running
docker-compose ps

# Expected:
# moonforge-api-1     moonforge-api:latest  Up X seconds
# moonforge-postgres-1  postgres:15-alpine   Up X seconds
```

---

## 🎯 Verification Checklist

Before proceeding with development, verify all items:

- [ ] Node.js v18+ installed (`node --version`)
- [ ] Docker & Docker Compose running
- [ ] `.env` file created with all required variables
- [ ] PostgreSQL container running
- [ ] Database connection verified
- [ ] All dependencies installed (`pnpm install`)
- [ ] Prisma migrations ran successfully
- [ ] Type check passes (`pnpm type-check`)
- [ ] Linter passes (`pnpm lint`)
- [ ] Development servers start (`pnpm run dev`)
- [ ] API responds to health check
- [ ] Platform UI loads at http://localhost:3001
- [ ] Admin UI loads at http://localhost:3002
- [ ] Prisma Studio shows correct tables
- [ ] File structure matches expected layout

---

## 🚀 Common Commands Reference

### Development Commands

```bash
# Start all dev servers
pnpm run dev

# Type check
pnpm type-check

# Lint code
pnpm lint

# Format code
pnpm format

# Build all packages
pnpm build

# Clean build artifacts
pnpm clean

# View database with Prisma Studio
cd apps/api && pnpm prisma studio
```

### Database Commands

```bash
# Run migration
pnpm db:migrate

# Push schema to database
pnpm db:push

# Reset database (development only)
cd apps/api && pnpm prisma migrate reset

# Seed database
pnpm db:seed
```

### Docker Commands

```bash
# Start services
docker-compose -f docker-compose.dev.yaml up -d

# Stop services
docker-compose -f docker-compose.dev.yaml down

# View logs
docker-compose -f docker-compose.dev.yaml logs -f postgres

# Access PostgreSQL CLI
docker-compose -f docker-compose.dev.yaml exec postgres psql -U moonforge -d moonforge
```

### Workspace Commands

```bash
# List all workspaces
pnpm ls -r

# Run script in specific workspace
pnpm --filter apps/api run dev

# Run script in all workspaces
pnpm --filter '*' run build
```

---

## 🐛 Troubleshooting Guide

### Issue: `DATABASE_URL is not set`

**Solution:**
```bash
# Check .env file exists
cat .env

# Verify DATABASE_URL line
grep DATABASE_URL .env

# Should output:
# DATABASE_URL="postgresql://moonforge:moonforge@localhost:5432/moonforge"
```

### Issue: `PostgreSQL connection refused`

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose -f docker-compose.dev.yaml ps

# If not running, start it
docker-compose -f docker-compose.dev.yaml up -d postgres

# Check logs
docker-compose -f docker-compose.dev.yaml logs postgres

# Verify credentials in .env match docker-compose config
```

### Issue: `Prisma Client not generated`

**Solution:**
```bash
# Regenerate Prisma Client
cd apps/api
pnpm prisma generate

# Or use migrate to auto-generate
pnpm prisma migrate dev --name fix
```

### Issue: `Port already in use`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different ports by editing docker-compose
```

### Issue: `npm ERR! code ERESOLVE`

**Solution:**
```bash
# Clear cache and reinstall
pnpm store prune
rm -rf node_modules
pnpm install
```

### Issue: `TypeScript errors in IDE`

**Solution:**
```bash
# Regenerate Prisma types
cd apps/api && pnpm prisma generate

# Restart TypeScript server in IDE (Ctrl+Shift+P → "TypeScript: Restart TS Server")
```

---

## 📚 Additional Resources

### Documentation
- [Moon Docs](https://moonrepo.dev)
- [Prisma Docs](https://www.prisma.io/docs)
- [Hono Docs](https://hono.dev)
- [TanStack Router Docs](https://tanstack.com/router/latest)
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [Tailwind CSS Docs](https://tailwindcss.com)

### Getting Help
- Check GitHub Issues: https://github.com/moonforge/moonforge/issues
- Discussions: https://github.com/moonforge/moonforge/discussions
- Discord (if available)

---

## 🎉 You're All Set!

Once you've completed all steps:

1. ✅ Development environment is ready
2. ✅ All services are running
3. ✅ Database is initialized
4. ✅ Type checking passes

**Next Steps:**
- Review the `OPENSPEC_MOONFORGE.md` for detailed architecture
- Create your first project by visiting http://localhost:3001
- Read API specifications in the OpenSpec
- Start implementing features!

---

**Setup Date:** [Your Date]  
**Environment:** Development  
**Status:** ✅ Ready for Development
