---
thumbnail: /images/projects/202305-monorepo-3d-viewer-renewal.png
gradient: linear-gradient(135deg, #eaeaed, #d0d2d8)
---

# Multi-App Codebase Consolidation & Web Platform Performance Improvement

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js (App Router), React.js, TypeScript, TanStack Query, Jotai, Yarn Berry PnP, ESLint, Husky, commitlint, esbuild, axios |
| Period | 2023.05 – 2024.03 |
| Team | Frontend 1, DevOps 1 (Frontend sole lead) |

## Overview

Resolved increasing build times, excessive code dependencies, and deteriorating Core Web Vitals from the legacy One-Repo structure. Solely led the entire process: initial design of CLO-SET v3's yarn workspaces-based monorepo, building a shared API client package, and redesigning the App Router-based architecture. The monorepo migration achieved 40% loading speed improvement and 35% Core Web Vitals improvement.

## Key Features

![Monorepo 3D Viewer Renewal](/images/projects/202305-monorepo-3d-viewer-renewal.png)

## Key Implementations

### Monorepo Environment Setup
- **Problem**: Legacy structure caused long build times, overly entangled code dependencies, and degraded Core Web Vitals from slow initial page load
- **Solve**:
  - Adopted Yarn Berry PnP to minimize build dependencies; patched PnP-unsupported libraries via packageExtensions
  - Designated `.pnp.*` as binary in `.gitattributes` and set `compressionLevel: mixed` to minimize Git conflicts
  - Built type-sharing across packages via config-plugin configuration; automated dependency-ordered builds via `--topological-dev` option
- **Result**: ~40% page loading speed improvement vs. legacy / Comprehensive 35% performance improvement across FCP/LCP/LT averages measured by Datadog RUM
- **Insight**: After adopting Yarn Berry PnP, experienced increased Git conflict frequency and orchestration limitations at scale. pnpm + Turborepo combination would have been more appropriate.

### Shared API Package Design
- **Problem**: API call patterns varied across apps, creating high maintenance costs. Duplicate per-app implementations needed to be prevented, and a consistent request interface for API versions (v1/v2) was needed.
- **Solve**: Centralized axios instances and abstracted v1/v2 APIs as factory functions. Designed query/mutation hooks integrated with React Query. Separated the shared API client into an independent package to prevent per-app duplication.
- **Result**: Apps can use the API client with a simple import; subsequent v3 migration was limited to internal package changes only.

### Bundle Optimization & Routing Structure Improvements
- **Solve**:
  - Applied per-page code splitting via Next.js dynamic import, minimizing initial load resources
  - Designed flexible nested page structures by separating routing hierarchy and layouts with App Router

### State Management Bifurcation & API Caching Strategy Redesign
- **Solve**:
  - Bifurcated to Jotai for local state and TanStack Query for server state, simultaneously improving rendering efficiency and maintainability
  - Redesigned TanStack Query-based API caching strategy to minimize unnecessary network requests

### Development Convention Automation (commitlint + Husky + ESLint)
- **Problem**: As the team grew, consistency in commit messages and code style needed to be enforced.
- **Solve**: Enforced commit conventions via commitlint + Husky. Applied consistent lint rules across packages via a shared ESLint config package. Configured esbuild-based package builds and Slack webhook build notifications.
- **Result**: Style-related comments in PR reviews decreased; automated CI verification enabled.

## Retrospective / Lessons Learned

- Initial monorepo structural decisions determined the direction for tens of packages, so I approached this carefully. This project made it tangible just how much the version abstraction of shared packages reduces migration costs.
- Getting the shared API package interface right upfront meant the subsequent v2→v3 API migration required only internal package changes with no app code changes — an impressive outcome.
- After adopting Yarn Berry PnP, experienced increased Git conflict frequency and build orchestration limitations at scale. pnpm + Turborepo combination would have been more appropriate.
