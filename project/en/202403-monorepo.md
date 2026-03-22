---
thumbnail: /images/projects/202305-monorepo-3d-viewer-renewal.png
gradient: linear-gradient(135deg, #eaeaed, #d0d2d8)
---

# Monorepo Migration & Platform Renewal

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js (App Router), Vite, React.js, TypeScript, TanStack Query, Jotai, Yarn Berry PnP, Rollup, esbuild, Emotion, i18next, Socket.io, ESLint, Husky, commitlint, axios |
| Period | 2023.05 – 2024.03 |
| Team | Frontend 1, DevOps 1, Product Designer 1, Backend 1 (Frontend sole lead) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |
| Blog | [Monorepo — Yarn vs Lerna vs Turbo](https://ieeooii.notion.site/Monorepo-Yarn-vs-Lerna-vs-Turbo-5fc49b69b2c54a18ac1d1bc7677af536?pvs=143) |

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

### App Router-Based Rendering Architecture Design

- **Problem**: In the Pages Router-based structure, layout remounts occurred on view-type page transitions. SSR data fetching and client state were not separated, causing repeated waterfall requests and data inconsistencies.
- **Solve**:
  - **Rendering structure redesign**: Used Parallel Routes to separate per-view-type slots, preserving layout on transitions. Pre-fetched data in Server Components and passed it to the client via HydrationBoundary. Applied per-page code splitting via Next.js dynamic import to minimize initial load resources.
  - **App layer design**: Handled auth and locale routing in Next.js middleware so page components are unaware of auth logic, removing auth logic dependencies from page components.
- **Result**: Eliminated layout remounts on view transitions and resolved initial data waterfall
- **Insight**: The App Router migration was not just a technology choice — it required the entire team to understand a new rendering model. Presenting Pages Router limitations with data and persuading the team was as important as the technical decision itself. Without formalizing server/client component boundaries as conventions, the boundaries blur over time.

### URL Design — Path Variable / Query Parameter Role Separation

- **Problem**: During the App Router migration, some URLs passed view state and filter conditions via Path Parameters. Embedding selection state in the path like `/items/category-id/sort-type` caused layout remounts or unnecessary history accumulation every time sort or filter changed, since each combination became a separate route.
- **Solve**: Applied RESTful API design principles to URL structure — **Path Variables only for identifying the location of a specific resource**, and **Query Parameters for showing the same resource in different ways** (sort, filter, etc.). e.g., `/items/[id]` → identifies a specific item; `/items?category=X&sort=recent` → filtered list.
- **Result**: Filter and sort changes are handled as query updates rather than route transitions, preserving layout without remounts. The current view state is fully reproducible from the URL alone, and unnecessary history pollution eliminated.

### State Management Strategy Bifurcation (Jotai + TanStack Query)

- **Problem**: MobX's high freedom made state mutation points easy to scatter across the codebase, causing difficult side-effect tracking and unpredictable re-renders. Client and server state were also mixed together, requiring structural reorganization.
- **Solve**:
  - **Jotai migration**: Evaluated Recoil, Zustand, and others, but chose Jotai for its low learning curve and natural fit with existing React patterns given the team's fast development pace. Replaced global Observable dependency structure with domain-level atoms — subscribing only to necessary slices and declaring derived atoms to suppress unnecessary re-renders.
  - **Client/server state bifurcation**: Formalized UI interaction state in Jotai and API response data in TanStack Query with clear layer separation. Centralized query keys by domain to explicitly control cache invalidation scope.
  - **Optimistic Update standardization**: Applied optimistic updates to UX-sensitive mutations to eliminate perceived response delays.
- **Result**: Converted the hard-to-trace MobX structure to atom units, clarifying side-effect scope / Eliminated cache conflicts from client-server state separation, resolved response delays in UX-sensitive flows
- **Insight**: Prioritized team development speed by choosing Jotai, but encountered inconvenience when needing to access atoms from outside components. Should have evaluated the speed-vs-flexibility tradeoff more thoroughly upfront; Zustand with its external access capability would have been more appropriate.

### Component Design VAC Pattern Migration

- **Problem**: During Container/Presenter pattern usage, logic, API calls, and styles were mixed in containers, degrading reusability. Repeated duplicate implementations of the same UI and declining extensibility.
- **Solve**:
  - **VAC (View-Accessory-Container) pattern adoption**: Established fixed separation of all components into logic/state connection (`{Component}.tsx`) / pure rendering (`{Component}View.tsx`) / styles and types, formalized as rules in CONVENTION.md.
  - **SuspenseQuery component layer addition**: Separated data-fetching components to wrap Suspense/ErrorBoundary boundaries outside containers, separating concerns.
  - **Domain-level hook separation**: Separated hooks by feature unit so each hook contains only single-domain logic, improving cohesion.
  - **Framework-agnostic module layer separation**: Isolated pure business logic with no React dependency into `modules/`.
- **Result**: Same View reusable across multiple Containers / Component complexity reduced via error/loading concern separation / Business logic decoupled from React for independent testing
- **Insight**: VAC pattern was effective for component-level separation, but as app scale grew, dependencies between features and layer boundaries became unclear. Introducing FSD (Feature-Sliced Design) together would have enforced layer-level dependency direction.

### Rendering Optimization (react-virtuoso + React DevTools Profiler)

- **Problem**: Pages handling heavy resources simultaneously suffered from unnecessary re-renders and initial load delays, with scroll performance degrading during large list rendering.
- **Solve**:
  - **Targeted optimization after profiling bottlenecks**: Used React DevTools Profiler to identify unnecessary re-render points, then selectively applied React.memo/useMemo/useCallback only to genuinely expensive sections.
  - **react-virtuoso virtual scrolling**: Introduced VirtuosoGrid for large lists so hundreds to thousands of items are not all mounted in the DOM simultaneously.
  - **Image optimization**: Applied a shared image loader and set loading priority on LCP images.
- **Result**: Prevented unnecessary re-renders and re-initialization, resolved scroll stutter on large lists, dramatically reduced DOM node count


## Retrospective / Lessons Learned

- Initial monorepo structural decisions determined the direction for tens of packages, so I approached this carefully. This project made it tangible just how much the version abstraction of shared packages reduces migration costs.
- Getting the shared API package interface right upfront meant the subsequent v2→v3 API migration required only internal package changes with no app code changes — an impressive outcome.
- After adopting Yarn Berry PnP, experienced increased Git conflict frequency and build orchestration limitations at scale. pnpm + Turborepo combination would have been more appropriate.
