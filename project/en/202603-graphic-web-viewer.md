---
thumbnail: /images/projects/graphic-web-viewer-thumb.svg
gradient: linear-gradient(135deg, #e0f2fe, #bae6fd)
---

# 3D Engine API React Abstraction Layer Design and Viewer Renewal

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | React 19, TypeScript, Vite, Jotai, TanStack React Query, Emotion, Socket.io, 3D Engine API |
| Period | 2025.07 ~ 2026.03 |
| Team | Frontend 1, Backend 2, Graphics Engineer 1, Product Designer 2 (Frontend in charge) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

Fully rebuilt CLO-SET's core 3D viewer feature. Solely designed and implemented the viewer engine package that abstracts the CLO3D engine for React usage, and was responsible for various viewer types including image viewer, 3D engine viewer, render viewer, and video viewer, as well as the render executor, version management, environment settings, and overall viewer functionality.

The CLO3D API provided by the engine team was in the form of a listed function catalog, with no definitions for call order or React integration approach. Relevant information was scattered across multiple locations, and more time was spent understanding the API than actually developing. Since using it directly in apps would clearly result in engine usage knowledge being scattered throughout app code, I designed a hook layer abstracting it to match React lifecycle as an independent package.

## Key Implementations

### React StrictMode Canvas Double-Creation Issue

- **Problem**: React 18 StrictMode intentionally executes mount → unmount → mount twice in development. This caused the engine init to be called twice, creating two canvases — one empty and one properly rendered coexisting in the DOM.
- **Solve**: On engine initialization entry, processes removal of existing canvas first. Added a guard to prevent re-initialization if an instance already exists. Managed the engine instance via an external handler rather than hook internal state, designing clear cleanup on unmount → recreation on remount flow.
- **Result**: Only a single canvas renders even in StrictMode; engine initialization/disposal cycle precisely synchronized with React lifecycle.
- **Insight**: The temptation to solve it by disabling StrictMode existed, but solving it through fundamental design made a significant difference in later maintainability.

### Abstracting Engine API into React Lifecycle Hooks

- **Problem**: The API provided by the engine team was in enumerated function form with no definitions for usage order (initialization → data load → viewer option application), async timing, or error handling approaches.
- **Solve**: Separated the package structure into three concerns — engine instance creation and canvas mounting (initialization), async 3D file loading (content loading), and ResizeObserver + throttle canvas size synchronization (resize). Separated each functionality into role-specific hooks with unified common interfaces. Implemented viewer options (Avatar/Garment display, Strain Map, Exploded View, magnifier) as individual independent hooks, with keyboard shortcuts also in a separate hook. Distinguished and handled 8 error types thrown by the engine. Combined these into a single composition hook so consumers can use all viewer features with a single hook call.
- **Result**: Consumers can use all viewer features through hooks alone without knowing the engine API directly. Extensible structure secured where new viewer options only need to implement the interface.

### Next.js SSR → Vite CSR Transition Decision

- **Problem**: The previous app was Next.js-based SSR. Datadog RUM data analysis revealed that due to the global service nature, accumulated server-side rendering delays during page transitions in regions with poor network environments (India, China, etc.) created significant perceived response gaps. For 3D viewers that already execute the engine on the client, SSR benefits were minimal while server response wait costs remained.
- **Solve**: Transitioned the content app to a Vite + React Router-based CSR SPA. Initial HTML + static assets served directly from CDN; data fetched via client-side API calls. Designed deployment structure with static files uploaded to cloud storage and served from CDN edge, providing resources as close to users as possible without server roundtrips.
- **Result**: Eliminated server response wait on page transitions. Reduced initial asset loading gap in slow-network regions through increased CDN cache hit rates.
- **Insight**: It's important to distinguish between pages needing SSR's SEO and initial rendering benefits versus interaction-heavy pages more suited to CSR. Content viewers — entered after authentication with no SEO requirements and heavy client state — are more suited to CSR. Meanwhile, SSR still has strengths for cases like unified login where APIs need to be called server-side or authentication/redirects handled in middleware, avoiding sending unnecessary dependencies to the client. This CSR transition was a decision made for the viewer app's characteristics while cognizant of these trade-offs.

### Viewer Engine Package — Source-Only Distribution Design

- **Problem**: Separately building and distributing the package complicates type synchronization within the monorepo, and tree-shaking may not apply properly per consuming app.
- **Solve**: Designed as a source-only package sharing TypeScript source directly via workspace protocol without a build step. Both `main` and `types` point to `index.ts`, delegating to the consuming app's Vite bundler to tree-shake only actually used hooks. 3D engine instance and React declared as peer dependencies forcing consuming apps to provide them directly, preventing the package from carrying runtime.
- **Result**: Types always stay in sync without separate build/distribution. Only hooks actually used by consuming apps are included in bundles.

### Viewing Option Hooks Common Interface Design

- **Problem**: As viewing options (Avatar display, Strain Map, Exploded View, magnifier, etc.) grow, differing return types per hook proportionally increase UI layer implementation costs.
- **Solve**: Unified all viewing option hooks to return the same interface — feature existence (`isExist`), current active state (`active`), manipulation disabled status (`disabled`), `toggle`, `reset`. Added optional `select` only for options requiring multi-selection beyond simple on/off for extensibility.
- **Result**: UI components can render using an identical interface without knowing hook internals. New option additions reuse existing UI by just implementing the interface.

### Render Executor — Complex Workflow Step-by-Step Separation

- **Problem**: Complex workflow including render options (quality, image size, video/GIF), preset save/load, render server status display, and render cancellation needed management in a single UI.
- **Solve**: Centralized render-related state in Jotai atoms and separated UI into settings → execution → status monitoring stages. Render server status received and reflected in real-time via socket.
- **Result**: Complex render workflow processable intuitively step by step.

### Turntable Image Sequence Playback

- **Problem**: Turntable (rotation animation) playback required smooth image sequence loading, playback speed control, and frame transitions.
- **Solve**: Controlled image sequence via `requestAnimationFrame`, starting playback after preload completion. Speed slider and frame indicator UI integration.
- **Result**: Smooth turntable playback with loading state feedback.

### Viewing Option Restoration After Colorway Change

- **Problem**: Bug where user-configured viewing options (strain map, pattern, etc.) were reset on colorway change.
- **Solve**: Preserved current viewing option state in atoms during colorway change and re-applied after engine re-initialization completion.
- **Result**: User settings maintained after colorway change.

### Rendering Error Prevention During Resize — Dual Resize Strategy

- **Problem**: During rapid container size changes, alignment errors occurred in Depth Peeling-based transparency rendering. Simple debounce alone caused the viewer to appear distorted during resize, while immediate reflection caused render errors — a trade-off.
- **Solve**: Applied a dual strategy to the ResizeObserver callback. A short throttle first issues 'fast resize mode' to immediately reflect only canvas size, followed by a debounced precision resize to confirm final dimensions. The precision resize includes a brief wait for depth peeling synchronization. Used ResizeObserver instead of window resize events for container-level tracking.
- **Result**: No render errors during resize with canvas size naturally following; correct operation even in quality render (depth peeling) state.

### Vite Chunk Splitting Strategy

- **Problem**: Bundling all dependencies into a single vendor chunk reduces cache efficiency; conversely, splitting everything increases HTTP request count excessively.
- **Solve**: Applied selective manual chunk splitting based on weight and change frequency. Separated 3D engine, UI styling, data fetching, rich editor, and React core into independent chunks so app code changes don't invalidate vendor chunk caches. Static files uploaded to cloud storage at production build with base URL dynamically injected at build time for CDN caching efficiency. Source maps activated in production for Datadog error tracking.
- **Result**: Vendor chunks reuse cache between deployments when unchanged. App code changes don't affect vendor cache.

### Custom i18n — Promise Caching-Based Dictionary Pattern

- **Problem**: General-purpose i18n libraries have high bundle cost relative to features, and didn't align with the approach of extracting language from URL parameters to dynamically load translation files.
- **Solve**: Designed a custom Dictionary pattern that reads the language parameter from the URL and asynchronously fetches the corresponding language's translation JSON. Introduced Map-based Promise caching to prevent duplicate requests for the same language. Showed Suspense fallback during loading and injected translation values via Context after completion.
- **Result**: Implemented only needed functionality without unnecessary dependencies. Cached data instantly reused on language switch.

### Screenshot — Canvas Compositing Module

- **Problem**: Simple `canvas.toBlob()` couldn't combine background color, logo overlay, and resolution settings into the final image. SVG logos in particular couldn't be used directly with `drawImage()` due to CORS restrictions.
- **Solve**: Drew background first (solid color fill or image contain/fill mode) on an offscreen canvas then composited the 3D viewer canvas. Converted SVG logos via `Blob → ObjectURL` then overlaid with `drawImage()` to bypass CORS errors. Designed to accept resolution (scale), quality, and format (png/jpg/webp) as parameters for flexible composition.
- **Result**: High-quality screenshot download with freely configurable background, logo, and resolution combinations.

### Viewer Engine State — Global Access and Item Transition Reset

- **Problem**: Engine instance and viewing option state need simultaneous read/write from multiple components (toolbar, settings panel, viewer container). Prop drilling is too deep, and a single Context causes unnecessarily wide re-render scope.
- **Solve**:
  - **Engine instance as atoms**: Separated engine instance, viewing options, loading state, and progress into individual atoms. Each component subscribes only to needed atoms suppressing unnecessary re-renders
  - **Per-atom reset design**: Designed reset utilities alongside each atom for clean initialization when navigating between items. Structurally prevents memory leaks and residual previous state
  - **Conservative refetch strategy**: Disabled auto-refetch on tab focus return and network reconnection. Configured for viewer characteristics where already-loaded 3D data should not be replaced in the background
- **Result**: Engine state accessible via atom subscription regardless of component hierarchy. Clean reset without residual state on item transition.
- **Insight**: Jotai was well-suited for UI interaction state like viewing options, but limitations appeared when needing atom access outside components (event handlers, module layers, etc.). If these cases increase, Zustand with its external access capability would have been more suitable.

### Component Design — Viewer Type Dispatcher Pattern

- **Problem**: CLO-SET items have various types — 3D files, images, renderings, turntables, others. Handling all types in a single viewer component nests conditional branches, with per-type initialization logic mixing to hinder maintainability.
- **Solve**:
  - **Type dispatcher pattern**: Top-level viewer component only determines content type, completely delegating actual rendering to per-type independent components. Each type component lazy-split for loading only when needed
  - **Secondary branching within CLO3D**: Within the 3D type, additionally branches 3D engine view, 2D pattern view, image view, and rendering view based on URL parameters. View switching processed as query updates not route changes, with no layout remount
  - **Layer separation**: Data fetching container (API calls, Suspense responsibility) → type determination dispatcher → engine props assembly hook → actual engine rendering separated into individual layers. Each layer designed for single responsibility only
  - **Partial error boundary wrapping**: Each viewer type component wrapped in independent error boundaries so errors in specific viewer types don't block the entire page
  - **isMounted guard**: Detects when components are already unmounted after async operations like 3D data load or colorway change complete, skipping state updates
- **Result**: Per-type code completely isolated; adding new viewer types requires only adding a case to the dispatcher without modifying existing code. Each type's errors independently isolated so partial failures don't affect other viewer functions.
- **Insight**: The dispatcher pattern becomes more effective as types increase, but continuous decisions were needed about which layer to place common logic (progress display, error UI, etc.). Not defining common wrappers early results in the same code repeatedly added to each type component.

### Rendering Optimization

- **Problem**: The 3D viewer page simultaneously renders engine initialization, large 3D file loading, and numerous viewing option components, making both initial bundle size and memory usage problematic.
- **Solve**:
  - **Per-viewer-type code splitting**: Lazy-split 3D viewer, image viewer, render viewer, and turntable viewer to exclude from initial bundle. Settings overlay, viewing option panels, and other auxiliary UI also lazy-split
  - **React Query cache strategy**: Cached 3D data with item ID + version composite keys for instant render on same-version revisits without network requests. Viewer metadata with short staleTime to minimize repeated requests
  - **Explicit engine resource release**: On page navigation, calls engine instance dispose API then directly removes canvas DOM node. Compensated for the engine characteristic that GPU resources aren't released by React unmount alone, with explicit cleanup preventing memory leaks
  - **ResizeObserver-based size tracking**: Used ResizeObserver instead of `window.resize` events to detect only viewer container size changes. Scoped so resizes of other elements unrelated to the viewer don't trigger engine updates
  - **Initial value ref pinning**: Pinned initial values like colorway index at initial render time via ref to prevent effect re-execution from external state changes
- **Result**: Viewer code excluded from initial bundle via lazy splitting; no GPU memory leaks after page navigation; unnecessary engine resize calls eliminated.
- **Insight**: When handling resources external to React like 3D engines, not trusting React's unmount alone and directly designing explicit cleanup is safer. GPU memory leaks don't immediately surface in DevTools and are easily discovered late.

## Retrospective / Lessons Learned

This was the project I contributed to the longest and across the broadest scope.

Instead of directly exposing all engine team-provided APIs to components, abstracting them into feature-level hooks so only needed APIs are called from usage points was the core of this project. Thanks to this, engine API knowledge doesn't scatter throughout app code, and features can be composed by knowing only the hook interface without engine implementation details.

Mid-development, a decision was made to completely deprecate the existing design system and batch-migrate to a company-wide common design system built together by all frontend teams. This was an unexpected wholesale replacement, and the project timeline extended as viewer-wide UI components were reconstructed to the new design system standards. I experienced that quickly assessing change scope and re-prioritizing is as important as technical implementation.

This was also the first project to introduce CSR (Vite) to the app, and the experience of making the SSR vs CSR trade-off decision based on Datadog RUM data rather than simple technical preference was impressive. CSR has the downside of slower initial load, but other metrics like page transition speed and interaction responsiveness improved significantly. I realized that making architecture decisions based on measurements is much clearer both for persuasion and for subsequent retrospection.
