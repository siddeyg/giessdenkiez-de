# Gieß den Kiez - Documentation Index

**Last Updated:** 2025-11-16
**Project Version:** 3.0.0-beta.0

---

## Overview

This documentation provides a comprehensive guide to understanding, deploying, and maintaining Gieß den Kiez. Whether you're a developer looking to set up the project locally, a city official considering adoption, or a contributor wanting to understand the architecture, you'll find the information you need here.

---

## Documentation Structure

### Core Documentation

| Document | Description | Audience | Reading Time |
|----------|-------------|----------|--------------|
| [README.md](../README.md) | Project overview and quick start | Everyone | 5 min |
| [README_DEV.md](../README_DEV.md) | Detailed development setup guide | Developers | 30 min |
| [claude.md](../claude.md) | Deep architectural analysis and deployment improvements | Technical Leads, DevOps | 45 min |
| [COMMANDS.md](./COMMANDS.md) | Command reference with usage examples | Developers | 15 min |

### Specialized Documentation

| Document | Description | Audience |
|----------|-------------|----------|
| [ARCHITEKTUR_ANALYSE.md](./ARCHITEKTUR_ANALYSE.md) | German article on project findings (2000 words) | German-speaking stakeholders |
| [Wiki](https://github.com/technologiestiftung/giessdenkiez-de/wiki) | Higher-level project documentation | All |

---

## Quick Navigation

### For New Developers

Start here to get up and running:

1. Read [README.md](../README.md) for project context (5 min)
2. Follow [README_DEV.md](../README_DEV.md) Step 1 for local setup (2-4 hours)
3. Review [COMMANDS.md](./COMMANDS.md) for common development tasks (15 min)
4. Browse [claude.md - Architecture Deep Dive](../claude.md#architecture-deep-dive) for component overview (20 min)

**Estimated time to first successful local run:** 3-5 hours

### For City Officials / Decision Makers

Understand the project and deployment requirements:

1. Read [README.md](../README.md) for mission and features (5 min)
2. Review [claude.md - Executive Summary](../claude.md#executive-summary) for technical overview (10 min)
3. Review [claude.md - Deployment Challenges](../claude.md#deployment-challenges) to understand complexity (15 min)
4. Review [claude.md - Proposed Improvements](../claude.md#proposed-improvements) for modernization options (15 min)
5. Read [ARCHITEKTUR_ANALYSE.md](./ARCHITEKTUR_ANALYSE.md) for German-language analysis (25 min)

**Total time:** ~70 minutes

### For DevOps Engineers

Deploy to production:

1. Complete local setup via [README_DEV.md](../README_DEV.md) Steps 1-2 (4-8 hours)
2. Review [claude.md - Deployment Architecture](../claude.md#deployment-architecture) (20 min)
3. Follow [README_DEV.md](../README_DEV.md) Step 3 for production deployment (4-6 hours)
4. Set up monitoring using [claude.md - Recommendations](../claude.md#recommendations) (2-4 hours)
5. Configure scheduled jobs via [COMMANDS.md - CI/CD](./COMMANDS.md#cicd-commands) (1 hour)

**Estimated time to production deployment:** 12-20 hours

### For Contributors

Contribute code or features:

1. Read [README.md](../README.md) for project overview (5 min)
2. Set up local environment via [README_DEV.md](../README_DEV.md) Step 1 (3-5 hours)
3. Review [claude.md - Architecture Deep Dive](../claude.md#architecture-deep-dive) (30 min)
4. Study [COMMANDS.md](./COMMANDS.md) for development workflow (15 min)
5. Check [GitHub Issues](https://github.com/technologiestiftung/giessdenkiez-de/issues) for contribution opportunities

**Time to first contribution:** 4-6 hours + development time

---

## Documentation by Topic

### Architecture & Design

| Topic | Location | Description |
|-------|----------|-------------|
| **Frontend Architecture** | [claude.md § Architecture Deep Dive](../claude.md#architecture-deep-dive) | Component structure, state management, routing |
| **Backend Architecture** | [claude.md § Backend Architecture](../claude.md#backend-architecture) | Supabase schema, API design, Edge Functions |
| **Data Processing Pipeline** | [claude.md § Data Flow](../claude.md#data-flow--algorithms) | Weather harvesting, tileset generation |
| **Technology Stack** | [claude.md § Technology Stack Analysis](../claude.md#technology-stack-analysis) | Detailed analysis of all dependencies |
| **Multi-Repo Structure** | [README.md § Repositories](../README.md#repositories) | Overview of 4 repositories |

### Deployment & Operations

| Topic | Location | Description |
|-------|----------|-------------|
| **Local Setup** | [README_DEV.md § Step 1](../README_DEV.md#step-1-setup-with-demo-trees-in-berlin) | Complete local development setup |
| **City Adaptation** | [README_DEV.md § Step 2](../README_DEV.md#step-2-adapt-to-your-city) | Customize for different cities |
| **Production Deployment** | [README_DEV.md § Step 3](../README_DEV.md#step-3-deploy-and-automate) | Deploy to Vercel, Supabase, Mapbox |
| **Deployment Challenges** | [claude.md § Deployment Challenges](../claude.md#deployment-challenges) | Critical pain points and their impact |
| **Environment Variables** | [claude.md § Environment Configuration](../claude.md#environment-configuration) | All 35+ required variables |
| **CI/CD Pipelines** | [claude.md § DevOps Stack](../claude.md#devops-stack) | GitHub Actions workflows |

### Development

| Topic | Location | Description |
|-------|----------|-------------|
| **Common Commands** | [COMMANDS.md](./COMMANDS.md) | CLI reference for all operations |
| **Component Guide** | [claude.md § Component Structure](../claude.md#component-structure-168-components) | Overview of 168+ React components |
| **State Management** | [claude.md § State Management Pattern](../claude.md#state-management-pattern) | Zustand stores explanation |
| **Testing** | [COMMANDS.md § Testing](./COMMANDS.md#testing-commands) | Unit and E2E test commands |
| **Code Quality** | [COMMANDS.md § Linting & Formatting](./COMMANDS.md#code-quality-commands) | ESLint and Prettier usage |

### Domain Knowledge

| Topic | Location | Description |
|-------|----------|-------------|
| **Project Mission** | [README.md § About](../README.md#about-gieß-den-kiez) | Purpose and goals |
| **Domain Concepts** | [claude.md § Domain Concepts](../claude.md#domain-concepts) | Tree age classification, water sources |
| **Water Calculation Algorithm** | [claude.md § Water Needs Calculation](../claude.md#water-needs-calculation-algorithm) | Detailed algorithm specification |
| **RADOLAN Data** | [claude.md § RADOLAN Data Processing](../claude.md#radolan-data-processing) | Weather data integration |

### Improvements & Roadmap

| Topic | Location | Description |
|-------|----------|-------------|
| **Proposed Improvements** | [claude.md § Proposed Improvements](../claude.md#proposed-improvements) | 7 solutions to deployment challenges |
| **Short-term Roadmap** | [claude.md § Short-Term Improvements](../claude.md#short-term-improvements-1-4-weeks) | Quick wins (1-4 weeks) |
| **Medium-term Roadmap** | [claude.md § Medium-Term Improvements](../claude.md#medium-term-improvements-1-3-months) | Strategic improvements (1-3 months) |
| **Long-term Vision** | [claude.md § Long-Term Improvements](../claude.md#long-term-improvements-3-6-months) | Major initiatives (3-6 months) |
| **Alternative Architecture** | [claude.md § Alternative Tech Stack](../claude.md#solution-6-alternative-tech-stack-complete-redesign) | Complete redesign proposal |

---

## Related Repositories

### Core Repositories

| Repository | Purpose | Documentation | Primary Language |
|------------|---------|---------------|------------------|
| [giessdenkiez-de](https://github.com/technologiestiftung/giessdenkiez-de) | Frontend application | README.md, README_DEV.md | TypeScript/React |
| [giessdenkiez-de-postgres-api](https://github.com/technologiestiftung/giessdenkiez-de-postgres-api) | Database & API | README.md | SQL/TypeScript |
| [giessdenkiez-de-dwd-harvester](https://github.com/technologiestiftung/giessdenkiez-de-dwd-harvester) | Weather data processor | README.md | Python |
| [giessdenkiez-de-osm-pumpen-harvester](https://github.com/technologiestiftung/giessdenkiez-de-osm-pumpen-harvester) | Pump data harvester | README.md | Python |
| [giessdenkiez-de-tree-data](https://github.com/technologiestiftung/giessdenkiez-de-tree-data) | Tree data import utilities | README.md | Python |

### Setup Sequence

When setting up the project, clone repositories in this order:

```bash
# 1. Database/API (must be first for local Supabase)
git clone git@github.com:technologiestiftung/giessdenkiez-de-postgres-api.git

# 2. Data harvesters (needed to populate database)
git clone git@github.com:technologiestiftung/giessdenkiez-de-dwd-harvester.git
git clone git@github.com:technologiestiftung/giessdenkiez-de-osm-pumpen-harvester.git

# 3. Frontend (last, depends on data from other repos)
git clone git@github.com:technologiestiftung/giessdenkiez-de.git
```

---

## Key Concepts & Terminology

### Technical Terms

| Term | Definition | Learn More |
|------|------------|------------|
| **RADOLAN** | German weather radar network providing hourly precipitation data | [Wikipedia](https://de.wikipedia.org/wiki/RADOLAN) |
| **PostGIS** | PostgreSQL extension for spatial/geographic data | [PostGIS.net](https://postgis.net/) |
| **Supabase** | Open-source Firebase alternative (PostgreSQL + Auth + Storage) | [Supabase.com](https://supabase.com/) |
| **Mapbox GL** | JavaScript library for interactive vector maps | [Mapbox Docs](https://docs.mapbox.com/mapbox-gl-js/) |
| **Vector Tiles** | Map data format delivering geographic data as vector geometries | [Mapbox Vector Tiles](https://docs.mapbox.com/data/tilesets/guides/vector-tiles-introduction/) |
| **Zustand** | Lightweight React state management library | [Zustand GitHub](https://github.com/pmndrs/zustand) |
| **Vite** | Fast frontend build tool with HMR | [Vitejs.dev](https://vitejs.dev/) |
| **Tippecanoe** | Tool for creating vector tilesets from GeoJSON | [Mapbox Tippecanoe](https://github.com/felt/tippecanoe) |

### Domain Terms

| Term | German | Definition |
|------|--------|------------|
| **Tree Age Classification** | Baumaltersklassifizierung | BABY (0-10y), JUNIOR (11-40y), SENIOR (40+y) |
| **Vegetation Period** | Vegetationsperiode | Growing season when trees need water (April-October) |
| **Water Need** | Wasserbedarf | Required liters per 30 days based on age |
| **Adopted Tree** | Adoptierter Baum | Tree that a user has committed to care for |
| **District** | Bezirk | Administrative division of Berlin |
| **Street Tree** | Straßenbaum | Tree planted in public street space |

---

## Troubleshooting Guide

### Common Issues

| Problem | Documentation | Quick Solution |
|---------|---------------|----------------|
| **GDAL installation fails** | [claude.md § GDAL Installation Complexity](../claude.md#2-gdal-installation-complexity) | Use Docker: `docker run osgeo/gdal` |
| **Supabase connection errors** | [README_DEV.md](../README_DEV.md) | Run `npx supabase status` to check services |
| **Map not loading** | [COMMANDS.md § Debugging](./COMMANDS.md#debugging-commands) | Verify `VITE_MAPBOX_API_KEY` and tileset URL |
| **No trees showing** | [README_DEV.md § Step 1](../README_DEV.md#step-1-setup-with-demo-trees-in-berlin) | Run DWD harvester to populate data |
| **Build errors** | [COMMANDS.md § Build](./COMMANDS.md#build-commands) | Run `npm ci` to reinstall dependencies |
| **TypeScript errors** | [COMMANDS.md § TypeScript](./COMMANDS.md#typescript-commands) | Run `npm run build` to see all errors |

---

## Learning Paths

### Path 1: Frontend Developer (Focus on UI)

1. **Setup** (3 hours)
   - Clone `giessdenkiez-de` and `giessdenkiez-de-postgres-api`
   - Start local Supabase: `npx supabase start`
   - Start frontend: `npm run dev`

2. **Study** (4 hours)
   - [claude.md § Frontend Architecture](../claude.md#frontend-architecture)
   - [claude.md § Component Structure](../claude.md#component-structure-168-components)
   - Browse `src/components/` directory

3. **Practice** (ongoing)
   - Modify existing components
   - Add new UI features
   - Improve accessibility
   - Optimize performance

**Key Files to Understand:**
- `src/components/tree-detail/tree-detail.tsx` - Main tree panel
- `src/components/map/map.tsx` - Map component
- `src/components/filter/filter-store.tsx` - Filter logic
- `src/auth/auth-store.tsx` - Authentication

### Path 2: Backend Developer (Focus on Data)

1. **Setup** (4 hours)
   - Clone all repositories
   - Set up Supabase locally
   - Configure Python harvesters
   - Import sample tree data

2. **Study** (4 hours)
   - [claude.md § Backend Architecture](../claude.md#backend-architecture)
   - [claude.md § Data Processing Pipeline](../claude.md#data-processing-pipeline)
   - Review PostgreSQL schema in `postgres-api/supabase/migrations/`

3. **Practice** (ongoing)
   - Add database functions
   - Optimize queries
   - Write new harvesters
   - Improve data processing

**Key Files to Understand:**
- `postgres-api/supabase/migrations/*.sql` - Database schema
- `postgres-api/supabase/functions/gdk_stats/index.ts` - Edge function
- `dwd-harvester/src/run_harvester.py` - Weather data processor

### Path 3: DevOps Engineer (Focus on Deployment)

1. **Setup** (6 hours)
   - Complete full local setup
   - Set up all environment variables
   - Run all harvesters successfully
   - Deploy to staging environment

2. **Study** (4 hours)
   - [claude.md § Deployment Architecture](../claude.md#deployment-architecture)
   - [claude.md § Deployment Challenges](../claude.md#deployment-challenges)
   - [README_DEV.md § Step 3](../README_DEV.md#step-3-deploy-and-automate)

3. **Practice** (ongoing)
   - Optimize CI/CD pipelines
   - Implement monitoring
   - Improve deployment automation
   - Reduce infrastructure costs

**Key Files to Understand:**
- `.github/workflows/*.yml` - All CI/CD workflows
- `vercel.json` - Vercel deployment config
- `postgres-api/supabase/config.toml` - Supabase config
- `dwd-harvester/harvester/.env` - Harvester configuration

---

## External Resources

### Official Documentation

- [Supabase Documentation](https://supabase.com/docs)
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/)

### Related Projects

- [DeineStadt Gießt](https://deinestadt.giessdenkiez.de/) - White-label version for other cities
- [Technologiestiftung Berlin](https://www.technologiestiftung-berlin.de/) - Parent organization
- [CityLAB Berlin](https://citylab-berlin.org/) - Civic tech lab

### Community

- [GitHub Issues](https://github.com/technologiestiftung/giessdenkiez-de/issues) - Bug reports and feature requests
- [GitHub Discussions](https://github.com/technologiestiftung/giessdenkiez-de/discussions) - Community questions
- [Contributors](../README.md#contributors-) - All contributors

---

## Contribution Guidelines

### How to Contribute

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/my-feature`
3. **Develop** your changes with tests
4. **Run** linting and tests: `npm run lint && npm test`
5. **Commit** with conventional commits: `feat: add new feature`
6. **Push** to your fork: `git push origin feature/my-feature`
7. **Open** a pull request

### Code Style

- Follow TypeScript strict mode
- Use Prettier for formatting (automatic on save)
- Write descriptive component names
- Add JSDoc comments for complex functions
- Write tests for new features

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Example:**
```
feat(tree-detail): add sharing functionality

- Add share button to tree detail panel
- Implement social media sharing via react-share
- Add copy-to-clipboard for tree URL

Closes #123
```

---

## Version History

### Current Version: 3.0.0-beta.0

See [GitHub Releases](https://github.com/technologiestiftung/giessdenkiez-de/releases) for full changelog.

---

## Support & Contact

### Getting Help

1. **Search** [existing documentation](https://github.com/technologiestiftung/giessdenkiez-de/wiki)
2. **Check** [GitHub Issues](https://github.com/technologiestiftung/giessdenkiez-de/issues)
3. **Ask** in [GitHub Discussions](https://github.com/technologiestiftung/giessdenkiez-de/discussions)
4. **Contact** [Technologiestiftung Berlin](https://www.technologiestiftung-berlin.de/)

### Commercial Support

For cities interested in deploying Gieß den Kiez with professional support, visit:
[DeineStadt Gießt](https://deinestadt.giessdenkiez.de/)

---

## License

This project is open source. See [LICENSE](../LICENSE) file for details.

---

**Happy coding! Together we're making cities greener. 🌳**
