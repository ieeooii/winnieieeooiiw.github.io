---
thumbnail: /images/projects/202211-nprogress.webp
gradient: linear-gradient(135deg, #f1f3f7, #e2e6ed)
---

# Page Transition Loading Indicator

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, nprogress |
| Period | 2022.11 |
| Team | Frontend 1, Product Designer 1 (Frontend owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

Introduced nProgress to display a thin progress bar at the top of the screen when Next.js client-side routing begins a page transition. Next.js CSR (Client Side Routing) transitions pages without a traditional full page reload, so the browser's default loading indicator does not appear. This created a **"Feedback Gap"** where users felt nothing was happening after clicking — nProgress was implemented to immediately communicate that a page transition is in progress.

## Key Implementations

### Next.js Router Event Lifecycle Binding

- **Problem**: Simply starting/completing nProgress globally causes two problems. First, when a page transition is very fast (cache hit, etc.), the progress bar flickers briefly — a **Flash effect**. Second, when a routing error (`routeChangeError`) occurs, the progress bar gets stuck incomplete — a **zombie state**.
- **Solve**: Bound nProgress to three Next.js Router events:
  - `routeChangeStart` → `NProgress.start()` — show progress bar immediately when transition begins
  - `routeChangeComplete` → `NProgress.done()` — end progress bar when transition completes
  - `routeChangeError` → `NProgress.done()` — ensure progress bar ends even on error

  Configured `NProgress.configure({ minimum: 0.08, speed: 400, trickleSpeed: 200 })` to adjust minimum display time and animation speed to prevent Flash effects. Tuned so that the progress bar is barely noticeable for sub-100ms instant transitions.
- **Result**: Immediate visual feedback on all page transitions; no zombie state on routing errors.

### `_app.tsx` Global Lifecycle Management & Memory Leak Prevention

- **Problem**: When registering Router event handlers in `_app.tsx` without cleanup, each render registers new handlers, potentially causing nProgress to be called multiple times or creating memory leaks.
- **Solve**: Set `useEffect`'s dependency array to `[]` (mount once) so handlers are registered only once. Cleanup function explicitly removes handlers via `router.events.off()` for complete cleanup on unmount. Added nProgress style customization to `globals.css` to match service brand colors (Primary Color).
- **Result**: Stable operation without duplicate event handler registration; consistent visual experience with brand colors.

## Retrospective / Lessons Learned

Introducing nProgress is small in code volume, but it directly implements the UI/UX principle that "users must be able to see the current state of the system" (Nielsen's Heuristic #1: **Visibility of System Status**). This work in particular made it clear that client-side routing in SPAs (Single Page Applications) bypasses the browser's default feedback mechanism, and that **the application layer must compensate for this**. A small improvement with a tangible effect on the perceived performance of the entire service.
