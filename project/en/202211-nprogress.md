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

![Page Transition Loading Indicator](/images/projects/202211-nprogress.webp)

Introduced nProgress to display a thin progress bar at the top of the screen when Next.js client-side routing begins a page transition. Next.js CSR (Client Side Routing) transitions pages without a traditional full page reload, so the browser's default loading indicator does not appear. This created a **"Feedback Gap"** where users felt nothing was happening after clicking — nProgress was implemented to immediately communicate that a page transition is in progress.

## Key Implementations

### Router Event Binding — Shallow Routing Exclusion and Zombie State Prevention on Error

- **Problem**: Simply starting/completing nProgress globally causes two problems. First, Shallow routing (transitions where only the URL changes without re-requesting the entire page) also triggers the progress bar, creating unnecessary visual noise. Second, when a routing error (`routeChangeError`) occurs, the progress bar gets stuck incomplete — a **zombie state**.
- **Solve**: Bound nProgress to three Next.js Router events:
  - `routeChangeStart` → checks `shallow` parameter; skips if shallow route transition, otherwise calls `NProgress.start()`
  - `routeChangeComplete` → `NProgress.done()` — end progress bar when transition completes
  - `routeChangeError` → `NProgress.done()` — ensure progress bar ends even on error

  Configured `NProgress.configure({ showSpinner: false })` to disable the spinner, showing only the top progress bar.
- **Result**: Progress bar displayed only on actual page transitions; no zombie state on routing errors.

### Independent Component Separation and Emotion Theme Color Dynamic Integration

- **Problem**: Registering Router event handlers without cleanup on every render causes duplicate handler registration, potentially making nProgress called multiple times or creating memory leaks. Also, hardcoding the progress bar color requires separate modification when the design system theme changes.
- **Solve**: Separated nProgress into a dedicated component placed at the top of the global layout for common application across all layout types. Set `useEffect` dependency array to `[]` (mount once) so handlers are registered only once, with cleanup explicitly removing handlers via `router.events.off()`. Used Emotion's `Global` component and `useTheme()` hook to inject `theme.colors.PRIMARY` as a CSS variable, dynamically linking the progress bar color to the design system theme.
- **Result**: Stable operation without duplicate event handler registration; progress bar color automatically reflects design system Primary Color changes.

## Retrospective / Lessons Learned

Introducing nProgress is small in code volume, but it directly implements the UI/UX principle that "users must be able to see the current state of the system" (Nielsen's Heuristic #1: **Visibility of System Status**). This work in particular made it clear that client-side routing in SPAs (Single Page Applications) bypasses the browser's default feedback mechanism, and that **the application layer must compensate for this**. A small improvement with a tangible effect on the perceived performance of the entire service.
