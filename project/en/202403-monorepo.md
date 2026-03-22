---
thumbnail: /images/projects/202305-monorepo-3d-viewer-renewal.webp
gradient: linear-gradient(135deg, #eaeaed, #d0d2d8)
---

# Monorepo Adoption and Platform Renewal Development

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js (App Router), Vite, React.js, TypeScript, TanStack Query, Jotai, Yarn Berry PnP, Rollup, esbuild, SWC, Emotion, i18next, Socket.io, ESLint, Husky, commitlint, axios |
| Period | 2023.05 ~ 2024.03 |
| Team | Frontend 1, DevOps 1, Product Designer 1, Backend 1 (Frontend sole lead) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |
| Blog | [Monorepo — Yarn vs Lerna vs Turbo](https://ieeooii.notion.site/Monorepo-Yarn-vs-Lerna-vs-Turbo-5fc49b69b2c54a18ac1d1bc7677af536?pvs=143) |

## Overview

Addressed increasing build times from the legacy One-Repo structure, excessive code dependencies, and deteriorating Core Web Vitals metrics. Led the entire process from initial design of the yarn workspaces-based monorepo for the CLO-SET v3 project, to building a shared API client package and redesigning the architecture with App Router. The monorepo transition achieved 40% loading speed improvement and 35% key performance metric enhancement.

![Monorepo 3D viewer renewal](/images/projects/202305-monorepo-3d-viewer-renewal.webp)

## Key Implementations

### Monorepo Environment Setup

- **Problem**: The legacy structure had long build times, excessively intertwined code dependencies, and deteriorating Core Web Vitals metrics due to page initial loading performance degradation.
- **Solve**:
  - Adopted Yarn Berry PnP to minimize build dependencies; patched PnP-unsupported libraries with packageExtensions
  - Designated .pnp.* as binary in .gitattributes with compressionLevel: mixed to minimize Git conflicts
  - Built cross-package type sharing with config-plugin setup; automated dependency-based build ordering with --topological-dev option
- **Result**: Approximately 40% page loading speed improvement over legacy / 35% average performance improvement across FCP/LCP/LT based on Datadog RUM
- **Insight**: After adopting Yarn Berry PnP, experienced increased Git conflict frequency and build orchestration limitations at scale. Determined that pnpm + Turborepo combination would have been more suitable.

### Shared Package Layer Design

- **Problem**: As apps multiplied, identical utility, hook, and API call code was copied to each app, increasing maintenance costs linearly. Unclear dependency direction between apps made it difficult to agree on sharing scope.
- **Solve**:
  - **Layer hierarchization**: Fixed dependency direction unidirectionally as `config` → `shared` → `ui` → `viewer` → `apps`. Upper layers are structurally prevented from referencing lower layers
  - **Purpose-based shared package separation**: Separated packages by domain — API client, custom hook collection, general utilities, global state atoms, React Query common config, i18n, socket client, cookie management — to prevent unnecessary bundle inclusion
  - **API client package design**: Centralized axios instances and abstracted per API version (v1/v2/v3) via factory functions. Designed with query/mutation hooks integrated with React Query to prevent duplicate implementations per app
  - **workspace protocol**: Internal packages use workspace references to directly consume local sources, while build artifacts are isolated to `dist/` so apps reference only built packages
- **Result**: Feature reuse with a single import line when adding apps. API version migration applies to all apps by changing only the API client package internals.
- **Insight**: As package count grows, owners and purposes become unclear, leading to duplicate packages. Recording purpose, owner, and usage in README when creating packages was the most important practice long-term.

### Build Tool Differentiation by Package Type

- **Problem**: Using a single build tool for all package types (apps, component libraries, utility libraries) forced compromises between build speed and output format optimization.
- **Solve**: Applied different build tools based on package characteristics:
  - **esbuild** (utility packages): Pure TypeScript utility packages built with esbuild outputting both Node.js and browser targets simultaneously. Tree-shaking, minification, and source maps all applied
  - **Rollup** (hooks, utilities, component libraries): CJS + ESM dual format output via Rollup. Babel, TypeScript, and PostCSS plugin combinations for accurate type declaration file generation
  - **Next.js** (SSR main app): Main app requiring SSR uses Next.js App Router build pipeline. Incremental builds and bundle analyzer built in
  - **Vite** (static SPA): SPAs not requiring server rendering switched to Vite for dev server cold start time reduction and build speed improvement
- **Result**: Utility packages leverage esbuild's speed advantage; component libraries leverage Rollup's precise output control; apps each use their optimal framework build pipeline.
- **Insight**: Build tool diversification increases pipeline complexity. Confusion arose during onboarding when tool selection criteria weren't documented. Recording decision rationale in the contribution guide was necessary.

### Code Quality Automation Pipeline

- **Problem**: Without enforcing consistent code style and commit message format in a monorepo with multiple apps and packages, review time is wasted on style discussions and CHANGELOG automation becomes impossible.
- **Solve**:
  - **pre-commit hook**: Auto-detects the package of staged files and runs only that package's lint. Doesn't run full monorepo lint, minimizing commit speed impact
  - **commitlint + Conventional Commits**: Blocks commits without `feat`, `fix`, `refactor`, etc. type prefixes at the `commit-msg` hook. Established foundation for release note and CHANGELOG automation
  - **Shared ESLint config package**: Managed team-common rules (TypeScript strict parser, `no-console` warning, function return type enforcement) in a single package inherited by each app
  - **Shared TypeScript config package**: Inherited base config into Next.js and general React variants, consistently applying type safety rules (`strict: true`, `noUnusedLocals`, `noUnusedParameters`) across all packages
- **Result**: Dramatically reduced style review comments; lint errors blocked at commit time; commit history standardization established release automation foundation.
- **Insight**: The key to quality automation in a monorepo was enforcing everything while not losing speed. The strategy of selectively linting only changed packages was decisive in maintaining developer experience.

### App Router-Based Rendering Architecture Design

- **Problem**: Pages Router structure caused layout remount on view type page transitions, SSR data fetching and client state were not separated, causing repeated waterfall requests and data inconsistencies.
- **Solve**:
  - **Rendering structure redesign**: Separated view type-specific slots with Parallel Routes to maintain layout during transitions; pre-fetched data in server components and passed to client via HydrationBoundary. Applied page-level code splitting via Next.js dynamic import to minimize initial loading resources
  - **App layer design**: Handled authentication and language routing in Next.js middleware to separate page components from authentication logic
- **Result**: Eliminated layout remount on view transitions and resolved initial data waterfall.
- **Insight**: App Router transition was not just a technical choice but a change requiring the entire team to understand a new rendering model. Organizing and presenting Pages Router's limitations with data to persuade was as important as the technical decision itself. I experienced that without codifying server/client component boundaries as conventions, the boundaries blur over time.

### URL Design — Path Variable / Query Parameter Role Separation

- **Problem**: During the App Router transition, some URLs were passing view state and filter conditions via Path Parameters. Including selection state in the path like `/items/category-id/sort-type` causes each sort/filter change to be handled as a separate route, triggering layout remounts or unnecessarily stacking history.
- **Solve**: Applied RESTful API design principles to URL structure — **use Path Variables only for identifying specific resource locations**, and **convert sort/filter conditions that show the same resource differently to Query Parameters**. Example: `/items/[id]` → specific item identification, `/items?category=X&sort=recent` → filtered list.
- **Result**: Filter/sort changes processed as query updates rather than route transitions, maintaining state without layout remount. View state reproducible from URL alone; unnecessary history pollution eliminated.
- **Insight**: Since URL structure directly connects to routing strategy, not clearly agreeing on Path/Query roles during initial design leads to repetitive refactoring during App Router migration. I realized that the later routing design is settled, the higher the modification cost.

### State Management Strategy Dualization (Jotai + TanStack Query)

- **Problem**: MobX's high degree of freedom made state mutation points easily scattered, making side effect tracking difficult and causing unpredictable re-renders. Client state and server state were also mixed together, requiring structural reorganization.
- **Solve**:
  - **Jotai transition**: Evaluated alternatives including Recoil and Zustand, but selected Jotai considering the team's need for fast development velocity — it has a low learning curve and minimal friction with existing React patterns. Converted global Observable dependency structures to domain-level atoms subscribing only to needed slices, suppressing unnecessary re-renders via derived atoms
  - **Client-server state dualization**: Clearly separated layers — UI interaction state in Jotai, API response data in TanStack Query — as a rule. Centralized query keys by domain to explicitly control cache invalidation scope
  - **Optimistic Update standardization**: Applied optimistic updates to UX-sensitive mutations to eliminate perceived response delay
- **Result**: Converted MobX structure where state mutation tracking was difficult to atom-level, clarifying side effect scope / Eliminated cache conflicts through client-server state separation; resolved UX-sensitive response delays.
- **Insight**: Selected Jotai prioritizing team development speed, but encountered limitations when needing to access atoms outside components. Should have more thoroughly examined the trade-off between development speed and flexibility; Zustand with its external access capability would have been more suitable.

### VAC Pattern Transition for Component Design

- **Problem**: Using Container/Presenter pattern, containers became cluttered with logic, API calls, and styles, degrading reusability. Duplicate implementations of the same UI repeated, and extensibility suffered.
- **Solve**:
  - **VAC (View-Accessory-Container) pattern adoption**: Fixed separation of all components into logic/state connection / pure rendering / style/types, codified as rules in convention documentation
  - **Data fetching dedicated component layer**: Separated components requiring data fetching to enable Suspense/ErrorBoundary boundaries to be wrapped outside containers for concern separation
  - **Domain-level hook separation**: Separated each hook to contain only single domain logic for improved cohesion
  - **Framework-agnostic module layer separation**: Isolated pure business logic that doesn't depend on React in `modules/`
- **Result**: Same View reused across multiple Containers / Error/loading concerns separated reducing component complexity / Business logic React dependency removed enabling independent testing.
- **Insight**: VAC pattern was effective for component-level separation, but as app scale grew, inter-feature dependencies and layer boundary clarity diminished. Introducing FSD (Feature-Sliced Design) alongside could have enforced layer-level dependency direction.

### Rendering Optimization (react-virtuoso + React DevTools Profiler)

- **Problem**: Pages handling heavy resources simultaneously experienced unnecessary re-renders and initial loading delays, degrading scroll performance during large list rendering.
- **Solve**:
  - **Measured-then-targeted optimization**: Used React DevTools Profiler to identify unnecessary re-render points, selectively applying React.memo, useMemo, useCallback only where costs were actually high
  - **react-virtuoso virtual scroll**: Introduced VirtuosoGrid for large lists to avoid mounting hundreds to thousands of items in the DOM
  - **Image optimization**: Applied common image loader and set loading priority for LCP images
  - **Font optimization**: Optimized external fonts with `next/font` to remove rendering blocking from font loading
  - **Third-party script lazy loading**: Switched external widget scripts to dynamic loading to eliminate initial rendering blocking
- **Result**: Prevented unnecessary re-renders and re-initialization; resolved large list scroll jank; dramatically reduced DOM node count; improved perceived initial page load speed.
- **Insight**: Performance optimization without measurement only complicates code. The order of first identifying bottlenecks with Profiler then narrowing the application scope was critical. I experienced that premature optimization can actually harm readability.


## Retrospective / Lessons Learned

- Approached the initial monorepo structure decisions carefully since they determine the direction of dozens of packages. This project demonstrated how much shared package version abstraction reduces migration costs.
- Every choice in the technical decision process — Yarn Berry PnP, Jotai, etc. — had trade-offs, and looking back there are some I would have chosen differently. However, because the team collectively recognized the rationale and limitations of each choice, the cost of agreeing on improvement directions afterward was low. I felt that sharing the rationale for choices is more important than the choices themselves.
