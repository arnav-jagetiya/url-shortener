# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-07-09

### Added
- **JWT Authentication Flow**: Stateful user registration and stateless token login. Filters incoming requests to extract and validate bearer tokens before granting controller access.
- **Cache-Aside Pattern with Redis**: Automatic URL lookups cached inside Redis. Configured active TTL eviction strategies calculated from remaining time-to-live to prevent stale cached redirects.
- **URL Management Dashboard**: Built a responsive client Dashboard featuring:
  - Form validation with inline format checks.
  - Custom alias validation checking allowed symbols and length constraints.
  - Analytics count metrics with numeric count-up animations.
  - URL lists with hover tooltips, copy success icons, and mobile card stacks.
- **Enforced Expiration & Custom Pages**: Centralized exception handling redirecting expired links (HTTP 410) and broken links (HTTP 404) to custom branded React error pages with search param code tracking.
- **Docker Compose & GHA Integration**: DevOps setup for quick local deployment with database dependencies (MySQL, Redis) and GitHub Action CI configuration with BuildKit caching.
