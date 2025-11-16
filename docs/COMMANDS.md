# Gieß den Kiez - Command Reference

**Last Updated:** 2025-11-16
**Project Version:** 3.0.0-beta.0

---

## Overview

This document provides a comprehensive reference of all commands used in the Gieß den Kiez project, organized by category with practical examples and common use cases.

---

## Table of Contents

1. [Setup Commands](#setup-commands)
2. [Development Commands](#development-commands)
3. [Build Commands](#build-commands)
4. [Testing Commands](#testing-commands)
5. [Code Quality Commands](#code-quality-commands)
6. [Database Commands](#database-commands)
7. [Data Harvester Commands](#data-harvester-commands)
8. [Deployment Commands](#deployment-commands)
9. [CI/CD Commands](#cicd-commands)
10. [Debugging Commands](#debugging-commands)
11. [Maintenance Commands](#maintenance-commands)

---

## Setup Commands

### Initial Repository Setup

```bash
# Create project directory
mkdir gdk-setup && cd gdk-setup

# Clone all repositories
git clone git@github.com:technologiestiftung/giessdenkiez-de.git
git clone git@github.com:technologiestiftung/giessdenkiez-de-postgres-api.git
git clone git@github.com:technologiestiftung/giessdenkiez-de-dwd-harvester.git
git clone git@github.com:technologiestiftung/giessdenkiez-de-osm-pumpen-harvester.git
```

### Node.js Setup

```bash
# Install and use correct Node version
cd giessdenkiez-de
nvm install  # Reads from .nvmrc (Node 18+)
nvm use

# Install dependencies (clean install for CI/CD)
npm ci

# Alternative: Regular install (updates package-lock.json)
npm install
```

### Environment Configuration

```bash
# Copy sample environment file
cp .env.sample .env

# Edit environment variables
# macOS
open .env

# Linux
nano .env
# or
vim .env

# Load environment with direnv (if using direnv)
direnv allow
```

**Required Environment Variables:**
```bash
# .env
VITE_MAPBOX_API_KEY=pk.eyJ1...
VITE_MAPBOX_TREES_TILESET_URL=mapbox://username.tileset_id
VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_MAP_PUMPS_SOURCE_URL=https://...
VITE_BEZIRKE_URL=https://...
```

---

## Development Commands

### Start Development Server

```bash
# Frontend (giessdenkiez-de)
npm run dev

# Opens at: http://localhost:5173
```

**Output:**
```
VITE v5.4.8  ready in 324 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Common Options:**
```bash
# Specify custom port
VITE_PORT=3000 npm run dev

# Expose to network
npm run dev -- --host

# Open browser automatically
npm run dev -- --open
```

### Development Workflow

```bash
# 1. Start local Supabase (in postgres-api directory)
cd giessdenkiez-de-postgres-api
npx supabase start

# 2. Start frontend (in separate terminal)
cd giessdenkiez-de
npm run dev

# 3. Make changes to code
# Files auto-reload via Vite HMR

# 4. View in browser
open http://localhost:5173/map
```

### Hot Module Replacement (HMR)

Vite automatically reloads changed files:

```bash
# Edit a component
vim src/components/tree-detail/tree-detail.tsx

# Save file → Browser updates instantly (< 100ms)
```

**No HMR (full reload required):**
- `.env` file changes
- `vite.config.ts` changes
- `package.json` changes

**Fix:** Restart dev server with `npm run dev`

---

## Build Commands

### Production Build

```bash
# Type check + build
npm run build
```

**Steps Executed:**
1. TypeScript compilation (`tsc`)
2. Vite build (bundling, minification, tree-shaking)

**Output:**
```
vite v5.4.8 building for production...
✓ 1247 modules transformed.
dist/index.html                   0.89 kB │ gzip:  0.51 kB
dist/assets/index-a3b2c1d4.css   15.23 kB │ gzip:  4.12 kB
dist/assets/index-e5f6g7h8.js   498.45 kB │ gzip: 178.23 kB
✓ built in 8.42s
```

**Build Artifacts:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].css
│   ├── index-[hash].js
│   └── vendor-[hash].js
└── images/
```

### Preview Production Build

```bash
# Build and preview
npm run build
npm run preview

# Opens at: http://localhost:4173
```

**Use Case:** Test production build locally before deploying.

### Analyze Bundle Size

```bash
# Build with stats
npm run build -- --mode analyze

# Or use vite-bundle-visualizer plugin
npm install -D vite-bundle-visualizer
```

**vite.config.ts:**
```typescript
import { visualizer } from 'vite-bundle-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true })
  ]
});
```

---

## Testing Commands

### Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test:unit

# Run in watch mode
npm run test:unit -- --watch

# Run specific test file
npm run test:unit -- baby-tree-water-needs.test.ts

# Run with coverage
npm run test:unit -- --coverage
```

**Output:**
```
 ✓ tests/unit/baby-tree-water-needs.test.ts (6)
   ✓ should calculate correct water needs
   ✓ should handle over-watered trees
   ✓ should handle missing rainfall data

 Test Files  6 passed (6)
      Tests  24 passed (24)
   Start at  10:23:45
   Duration  1.42s
```

**Unit Test Structure:**
```typescript
// tests/unit/example.test.ts
import { describe, it, expect } from 'vitest';
import { calculateWaterNeeds } from '@/utils/water';

describe('Water Needs Calculation', () => {
  it('should calculate correctly for baby tree', () => {
    const result = calculateWaterNeeds({ age: 5, rainfall: 50 });
    expect(result.referenceAmount).toBe(100);
  });
});
```

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test
npm run test:e2e -- tests/e2e/auth/login.test.ts

# Run with UI mode
npm run test:e2e -- --ui

# Debug mode
npm run test:e2e -- --debug
```

**Prerequisites:**
```bash
# Must have local Supabase running
cd giessdenkiez-de-postgres-api
npx supabase start

# Must have frontend running
cd giessdenkiez-de
npm run dev
```

**Output:**
```
Running 12 tests using 3 workers

✓ tests/e2e/base/base.test.ts:5:1 › should load homepage (2.3s)
✓ tests/e2e/auth/login.test.ts:8:1 › should login successfully (3.1s)
✓ tests/e2e/tree-details/tree-detail.test.ts:12:1 › should display tree info (1.8s)

12 passed (15.2s)
```

### Run All Tests

```bash
# Unit + E2E tests
npm test

# Equivalent to:
npm run test:unit && npm run test:e2e
```

### Continuous Testing (Watch Mode)

```bash
# Watch unit tests
npm run test:unit -- --watch

# Auto-run tests on file change
```

---

## Code Quality Commands

### Linting (ESLint)

```bash
# Lint all files
npm run lint

# Auto-fix issues
npm run lint -- --fix

# Lint specific directory
npm run lint -- src/components/tree-detail/

# Lint specific file
npm run lint -- src/app.tsx
```

**Output:**
```
/src/components/tree-detail/tree-detail.tsx
  23:7  warning  Unexpected console statement  no-console
  45:12 error    'data' is assigned but never used  @typescript-eslint/no-unused-vars

✖ 2 problems (1 error, 1 warning)
```

**Common Fixes:**
```bash
# Remove unused variables
npm run lint -- --fix

# Disable rule for specific line
// eslint-disable-next-line no-console
console.log('Debug info');

# Disable rule for file
/* eslint-disable no-console */
```

### Formatting (Prettier)

```bash
# Format all files
npm run prettier

# Check formatting without changing files
npm run prettier:ci

# Format specific directory
npx prettier --write "src/components/tree-detail/**/*.{ts,tsx}"

# Format specific file
npx prettier --write src/app.tsx
```

**IDE Integration:**
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### TypeScript Type Checking

```bash
# Type check without emitting files
npx tsc --noEmit

# Watch mode for continuous type checking
npx tsc --noEmit --watch

# Type check specific file
npx tsc --noEmit src/app.tsx
```

**Output:**
```
src/components/tree-detail/tree-detail.tsx:45:12 - error TS2322: Type 'string' is not assignable to type 'number'.

45   const age: number = "10";
              ^^^

Found 1 error in src/components/tree-detail/tree-detail.tsx:45
```

### Pre-commit Hook (Recommended)

```bash
# Install husky
npm install -D husky

# Initialize git hooks
npx husky init

# Add pre-commit hook
echo "npm run lint && npm run prettier:ci && npm run test:unit" > .husky/pre-commit
```

---

## Database Commands

### Supabase Local Development

```bash
# Start local Supabase (Docker)
cd giessdenkiez-de-postgres-api
npx supabase start

# Stop Supabase
npx supabase stop

# Stop and delete data
npx supabase stop --no-backup

# Restart with fresh data
npx supabase db reset
```

**Output:**
```
Started supabase local development setup.

         API URL: http://localhost:54321
          DB URL: postgresql://postgres:postgres@localhost:54322/postgres
      Studio URL: http://localhost:54323
    Inbucket URL: http://localhost:54324
        anon key: eyJhbGc...
service_role key: eyJhbGc...
```

### Check Supabase Status

```bash
# View all service URLs and credentials
npx supabase status

# Output includes:
# - Database URL
# - API URL
# - Studio URL
# - anon key
# - service_role key
```

### Database Migrations

```bash
# Create new migration
npx supabase migration new add_tree_species_column

# Apply migrations
npx supabase db reset

# Generate types from database schema
npx supabase gen types typescript --local > types/database.ts
```

**Example Migration:**
```sql
-- supabase/migrations/20231116000000_add_tree_species_column.sql
ALTER TABLE trees
ADD COLUMN species_category TEXT;

UPDATE trees
SET species_category = 'deciduous'
WHERE art_dtsch IN ('Linde', 'Ahorn', 'Eiche');
```

### Access Supabase Studio

```bash
# Open Studio UI in browser
npx supabase start
open http://localhost:54323

# Features:
# - Browse tables
# - Run SQL queries
# - View logs
# - Manage storage
```

### Database Backup & Restore

```bash
# Backup local database
npx supabase db dump -f backup.sql

# Restore from backup
psql postgresql://postgres:postgres@localhost:54322/postgres < backup.sql

# Backup production (requires credentials)
pg_dump $DATABASE_URL > production_backup.sql
```

---

## Data Harvester Commands

### DWD Weather Harvester

**Setup:**
```bash
cd giessdenkiez-de-dwd-harvester/harvester

# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements-mac.txt  # macOS
pip install -r requirements.txt      # Linux
```

**Run Preparation Steps:**
```bash
cd prepare

# Generate shapefile buffer (required once)
SHAPE_RESTORE_SHX=YES python create-buffer.py

# Generate RADOLAN grid (required once)
python create-grid.py
```

**Run Main Harvester:**
```bash
cd ..  # Back to harvester directory

# Run DWD RADOLAN harvester
python src/run_harvester.py

# Expected duration: 20-30 minutes
```

**Output:**
```
[2025-11-16 10:23:45] INFO: Starting DWD RADOLAN harvester
[2025-11-16 10:23:47] INFO: Downloading RADOLAN data for last 30 days
[2025-11-16 10:28:15] INFO: Processing 720 hourly files
[2025-11-16 10:35:22] INFO: Clipping to Berlin boundaries
[2025-11-16 10:42:18] INFO: Joining with tree locations
[2025-11-16 10:48:45] INFO: Updating PostgreSQL database
[2025-11-16 10:51:12] INFO: Exporting to GeoJSON (500MB)
[2025-11-16 10:53:34] INFO: Running Tippecanoe
[2025-11-16 10:58:21] INFO: Uploading tileset to Mapbox
[2025-11-16 11:02:15] INFO: Harvester completed successfully
```

**Run Daily Weather Harvester:**
```bash
# Fetch historical weather from BrightSky API
python src/run_daily_weather.py

# Expected duration: 3-5 minutes
```

### OSM Pump Harvester

**Setup:**
```bash
cd giessdenkiez-de-osm-pumpen-harvester

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements-mac.txt
```

**Run Harvester:**
```bash
# Generate pumps GeoJSON
python harvester/main.py pumps.geojson

# Output: pumps.geojson (public water pumps in Berlin)
```

**Upload to Supabase:**
```bash
# Manual upload via Supabase Studio
open http://localhost:54323/project/default/storage/buckets/data_assets

# Or use Supabase CLI
npx supabase storage upload data_assets pumps.geojson
```

---

## Deployment Commands

### Vercel Deployment (Frontend)

**Prerequisites:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login
```

**Deploy:**
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy with specific environment
vercel --prod --env VITE_MAPBOX_API_KEY=pk.xxx
```

**Output:**
```
🔍  Inspect: https://vercel.com/username/giessdenkiez-de/xxx
✅  Preview: https://giessdenkiez-de-xxx.vercel.app
```

**Configure Environment Variables:**
```bash
# Set environment variable
vercel env add VITE_MAPBOX_API_KEY

# Pull environment variables locally
vercel env pull .env.local

# List all environment variables
vercel env ls
```

### Supabase Deployment (Backend)

**Link to Project:**
```bash
cd giessdenkiez-de-postgres-api

# Link to remote project
npx supabase link --project-ref your-project-id

# Enter database password when prompted
```

**Deploy Database:**
```bash
# Push migrations
npx supabase db push

# Push and reset
npx supabase db push --reset
```

**Deploy Edge Functions:**
```bash
# Deploy all functions
npx supabase functions deploy

# Deploy specific function
npx supabase functions deploy gdk_stats

# With environment variables
npx supabase functions deploy --env-file supabase/.env
```

**Serve Edge Functions Locally:**
```bash
# Start local edge functions
npx supabase functions serve --env-file supabase/.env

# Access at: http://localhost:54321/functions/v1/gdk_stats
```

### Docker Deployment (Harvesters)

**Build Docker Image:**
```bash
# Build DWD harvester image
cd giessdenkiez-de-dwd-harvester
docker build -t gdk-dwd-harvester:latest .

# Build OSM harvester image
cd giessdenkiez-de-osm-pumpen-harvester
docker build -t gdk-osm-harvester:latest .
```

**Run Container:**
```bash
# Run DWD harvester
docker run --env-file .env gdk-dwd-harvester:latest

# Run with volume mount
docker run -v $(pwd)/output:/app/output gdk-dwd-harvester:latest
```

**Push to Registry:**
```bash
# Tag for Docker Hub
docker tag gdk-dwd-harvester:latest username/gdk-dwd-harvester:v2.9.2

# Push to registry
docker push username/gdk-dwd-harvester:v2.9.2
```

---

## CI/CD Commands

### GitHub Actions

**Trigger Workflow Manually:**
```bash
# Via GitHub CLI
gh workflow run rain.yml

# With inputs
gh workflow run rain.yml --field environment=production

# List workflows
gh workflow list

# View workflow runs
gh run list --workflow=rain.yml
```

**Repository Dispatch (Webhook):**
```bash
# Trigger via API (used by Pipedream)
curl -X POST \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/repos/technologiestiftung/giessdenkiez-de/dispatches \
  -d '{"event_type":"radolan_cron","client_payload":{"environment":"production"}}'
```

**View Logs:**
```bash
# View latest run logs
gh run view

# View specific run
gh run view 1234567890

# Download logs
gh run download 1234567890
```

### Semantic Release

**Create Release:**
```bash
# Run semantic-release locally (for testing)
npx semantic-release --dry-run

# Create release (normally via GitHub Actions)
npx semantic-release
```

**Output:**
```
[semantic-release] › ✔  Loaded plugin "commit-analyzer"
[semantic-release] › ✔  Loaded plugin "release-notes-generator"
[semantic-release] › ✔  Analyzed 15 commits
[semantic-release] › ℹ  The next release version is 3.1.0
[semantic-release] › ✔  Created tag v3.1.0
[semantic-release] › ✔  Published GitHub release
```

**Commit Message Format:**
```bash
# Feature (minor version bump)
git commit -m "feat: add tree sharing functionality"

# Bug fix (patch version bump)
git commit -m "fix: correct water calculation for baby trees"

# Breaking change (major version bump)
git commit -m "feat!: redesign tree detail panel

BREAKING CHANGE: Tree detail component API has changed"
```

---

## Debugging Commands

### Frontend Debugging

**Enable Debug Mode:**
```bash
# Add to .env
VITE_DEBUG=true

# View verbose logs in browser console
```

**React DevTools:**
```bash
# Install browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools
# Firefox: https://addons.mozilla.org/firefox/addon/react-devtools/

# Inspect component tree, props, state
```

**Network Debugging:**
```bash
# Check API calls in browser DevTools
# Network tab → Filter by "Fetch/XHR"

# Common issues:
# - 401 Unauthorized → Check VITE_SUPABASE_ANON_KEY
# - 404 Not Found → Check API endpoint URL
# - CORS errors → Check Supabase CORS settings
```

### Backend Debugging

**View Supabase Logs:**
```bash
# All logs
npx supabase logs

# API logs only
npx supabase logs api

# Database logs
npx supabase logs db

# Realtime logs
npx supabase logs realtime
```

**SQL Debugging:**
```bash
# Connect to database
psql postgresql://postgres:postgres@localhost:54322/postgres

# Enable query logging
SET log_statement = 'all';

# Explain query plan
EXPLAIN ANALYZE SELECT * FROM trees WHERE id = '00008100:001f2573';
```

### Harvester Debugging

**Enable Verbose Logging:**
```bash
# In .env
LOGGING=DEBUG

# Run harvester
python src/run_harvester.py

# Output includes detailed step-by-step logs
```

**Test Specific Components:**
```python
# Test RADOLAN download only
python -c "
from src.download import download_radolan
download_radolan('2025111600')
"

# Test shapefile processing
python -c "
import geopandas as gpd
berlin = gpd.read_file('assets/berlin.shp')
print(berlin.head())
"
```

---

## Maintenance Commands

### Dependency Updates

**Check for Updates:**
```bash
# Check outdated packages
npm outdated

# Output:
# Package       Current  Wanted  Latest
# react           18.2.0  18.3.1  19.0.0
# vite             5.4.0   5.4.8   6.0.0
```

**Update Dependencies:**
```bash
# Update all to latest within semver range
npm update

# Update specific package
npm update react

# Update to latest (ignoring semver)
npm install react@latest

# Interactive update
npx npm-check-updates -i
```

**Security Audit:**
```bash
# Check for vulnerabilities
npm audit

# Auto-fix vulnerabilities
npm audit fix

# Force fix (may introduce breaking changes)
npm audit fix --force
```

### Database Maintenance

**Vacuum Database:**
```bash
psql $DATABASE_URL -c "VACUUM ANALYZE;"

# Reclaim space and update statistics
```

**Reindex:**
```bash
psql $DATABASE_URL -c "REINDEX DATABASE postgres;"

# Rebuild all indexes
```

**Check Database Size:**
```bash
psql $DATABASE_URL -c "
SELECT
  pg_size_pretty(pg_database_size('postgres')) as size;
"
```

### Clean Up Commands

**Remove Node Modules:**
```bash
# Delete node_modules
rm -rf node_modules

# Reinstall
npm ci
```

**Clean Build Artifacts:**
```bash
# Remove dist directory
rm -rf dist

# Remove test coverage
rm -rf coverage

# Remove Vite cache
rm -rf node_modules/.vite
```

**Clean Supabase:**
```bash
# Stop and remove all data
npx supabase stop --no-backup

# Remove Docker volumes
docker volume prune
```

**Clean Python Environment:**
```bash
# Deactivate virtual environment
deactivate

# Remove virtual environment
rm -rf venv

# Recreate
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Logs and Monitoring

**View Application Logs:**
```bash
# Vercel logs (requires Vercel CLI)
vercel logs

# Supabase logs
npx supabase logs

# GitHub Actions logs
gh run view --log
```

**Monitor Build Performance:**
```bash
# Build with timing info
npm run build -- --profile

# Analyze bundle with source maps
npm run build -- --sourcemap

# Check bundle size
ls -lh dist/assets/
```

---

## Advanced Commands

### Generate Types from Database

```bash
# Generate TypeScript types from Supabase schema
cd giessdenkiez-de-postgres-api
npx supabase gen types typescript --local > ../giessdenkiez-de/src/types/database.ts
```

**Usage:**
```typescript
import type { Database } from '@/types/database';

type Tree = Database['public']['Tables']['trees']['Row'];
type TreeInsert = Database['public']['Tables']['trees']['Insert'];
```

### Create Custom Mapbox Style

```bash
# Export current style
curl "https://api.mapbox.com/styles/v1/username/style-id?access_token=$MAPBOX_TOKEN" > style.json

# Modify locally
vim style.json

# Upload new style
curl -X POST "https://api.mapbox.com/styles/v1/username?access_token=$MAPBOX_TOKEN" \
  -d @style.json
```

### Batch Operations

**Batch Update Trees:**
```sql
-- Update multiple trees
UPDATE trees
SET radolan_sum = (
  SELECT SUM(value) FROM unnest(radolan_days) as value
)
WHERE radolan_sum IS NULL;
```

**Batch Delete Old Waterings:**
```sql
-- Delete waterings older than 90 days
DELETE FROM trees_watered
WHERE timestamp < NOW() - INTERVAL '90 days';
```

---

## Quick Reference

### Most Common Commands

```bash
# Daily development
npm run dev                    # Start dev server
npm run lint                   # Check code quality
npm run test:unit              # Run tests

# Before committing
npm run lint -- --fix          # Fix linting issues
npm run prettier               # Format code
npm run build                  # Ensure build works

# Database
npx supabase start             # Start local DB
npx supabase status            # Check DB status
npx supabase db reset          # Reset DB with migrations

# Deployment
vercel --prod                  # Deploy frontend
npx supabase db push           # Deploy database
npx supabase functions deploy  # Deploy edge functions
```

### Emergency Commands

```bash
# Frontend broken
rm -rf node_modules package-lock.json
npm install
npm run dev

# Database broken
npx supabase stop --no-backup
npx supabase start
npx supabase db reset

# Harvester broken
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Build broken
rm -rf dist node_modules/.vite
npm ci
npm run build
```

---

## Command Aliases (Optional)

Add to `~/.bashrc` or `~/.zshrc`:

```bash
# Gieß den Kiez aliases
alias gdk-dev='cd ~/gdk-setup/giessdenkiez-de && npm run dev'
alias gdk-db='cd ~/gdk-setup/giessdenkiez-de-postgres-api && npx supabase start'
alias gdk-test='cd ~/gdk-setup/giessdenkiez-de && npm run test:unit'
alias gdk-lint='cd ~/gdk-setup/giessdenkiez-de && npm run lint -- --fix'
alias gdk-harvest='cd ~/gdk-setup/giessdenkiez-de-dwd-harvester/harvester && source venv/bin/activate && python src/run_harvester.py'
```

**Usage:**
```bash
# Start development with one command
gdk-db && gdk-dev
```

---

## Platform-Specific Commands

### macOS

```bash
# Install GDAL
brew install gdal

# Install PostgreSQL client
brew install postgresql@15

# Open in default editor
open .env
```

### Linux (Ubuntu/Debian)

```bash
# Install GDAL
sudo apt-get update
sudo apt-get install gdal-bin libgdal-dev

# Install PostgreSQL client
sudo apt-get install postgresql-client-15

# Edit file
nano .env
```

### Windows

```powershell
# Install GDAL (requires OSGeo4W)
# Download from: https://trac.osgeo.org/osgeo4w/

# Or use conda
conda install -c conda-forge gdal

# Edit file
notepad .env
```

---

## Troubleshooting Commands

### Check Versions

```bash
# Node.js
node --version

# npm
npm --version

# Python
python3 --version

# GDAL
gdal-config --version
ogrinfo --version

# PostgreSQL client
psql --version

# Docker
docker --version
```

### Verify Installation

```bash
# Verify all tools
command -v node && echo "✓ Node.js installed"
command -v npm && echo "✓ npm installed"
command -v python3 && echo "✓ Python installed"
command -v gdal-config && echo "✓ GDAL installed"
command -v psql && echo "✓ PostgreSQL client installed"
command -v docker && echo "✓ Docker installed"
```

### Test Database Connection

```bash
# Test Supabase connection
psql postgresql://postgres:postgres@localhost:54322/postgres -c "SELECT version();"

# Test with Supabase CLI
npx supabase db ping
```

---

**End of Command Reference**

For more information, see:
- [Documentation Index](./INDEX.md)
- [Architecture Analysis](../claude.md)
- [Development Setup](../README_DEV.md)
