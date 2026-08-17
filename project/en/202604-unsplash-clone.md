---
thumbnail: /images/projects/202604-unsplash-clone-home.webp
gradient: linear-gradient(135deg, #ececec, #c4c4c4)
---

# Unsplash Clone — Responsive Design & Performance Optimization Study

| Field | Details |
|-------|---------|
| Company | Personal Project |
| Category | Side Project |
| Service | Unsplash Clone |
| Tech Stack | React 19, TypeScript, Vite 8 (rolldown), TanStack Query v5, React Router v6, Emotion, Vitest, Playwright |
| Period | 2026.04 ~ 2026.04 |
| Team | Frontend 1 (solo) |

## Purpose

Unsplash was chosen as the clone target to **practice responsive layout and performance optimization in depth**, using a production-grade UI as the benchmark.

- **Responsive design** — lay out a grid of arbitrarily-proportioned photos across viewports (1/2/3 columns) without libraries, including responsive UX where even the entry mode differs (modal on desktop vs full page on mobile)
- **Performance optimization** — measure against the original Unsplash site under identical Lighthouse conditions and iterate on image loading, code splitting, and bundle caching
- **Quality foundations** — apply production-grade quality practices to a personal project: FSD architecture, Suspense/Error Boundary design, and unit + E2E tests

## Overview

A SPA clone of Unsplash's core browsing experience — home feed, photo detail, and search — built on the Unsplash Open API. The Feature-Sliced Design architecture enforces one-way dependencies between layers, and the Masonry grid, background-location modal, and infinite scroll are all implemented from scratch without libraries. With Suspense-based loading, layered error boundaries, and Blurhash image placeholders, the clone outscored the original Unsplash site on Lighthouse performance (Desktop 98 vs 93, Mobile 82 vs 74). Fifty unit tests and 43 E2E tests cover the main user flows.

![Home — Masonry grid feed](/images/projects/202604-unsplash-clone-home.webp)

## Key Features

<div class="img-row-3">

![Photo detail modal](/images/projects/202604-unsplash-clone-detail-modal.webp)
![Search results page](/images/projects/202604-unsplash-clone-search.webp)
![Fullscreen image portal](/images/projects/202604-unsplash-clone-detail-fullscreen.webp)

</div>

<div class="img-row-3">

![Detail full-page entry](/images/projects/202604-unsplash-clone-detail-page.webp)
![Responsive — tablet, 2 columns](/images/projects/202604-unsplash-clone-home-tablet.webp)
![Responsive — mobile, 1 column](/images/projects/202604-unsplash-clone-home-mobile.webp)

</div>

- **Home feed** — dynamically loaded Topics tabs, Masonry grid + infinite scroll, hover overlay with author info and download
- **Photo detail** — modal when entered from the gallery, full page on direct URL access; view counts, EXIF, and tags, plus a fullscreen portal on image click
- **Search** — URL-driven search via `/s/photos/:query`, empty state for zero results, tag click routes into search
- **Download** — calls the tracking API first per Unsplash guidelines, then downloads the file; failures surface as a toast

## Key Implementations

### Hand-rolled Masonry grid

- **Problem**: CSS `column-count` redistributes every item vertically when infinite scroll appends a new batch, so existing items visibly jump. `display: masonry` lacks browser support, and TanStack Virtualizer would require pre-measuring item heights and absolute positioning — high complexity with a real risk of scroll jumps.
- **Solve**: Built a `useMasonryColumns` hook that renders each column as a flex column and places every item into the currently shortest column. Item height is estimated as `(columnWidth × height) / width` with no DOM measurement, memoized with `useMemo`. Column width comes from a `ResizeObserver`, and column count updates only on `matchMedia` breakpoint transitions — far fewer calls than a `resize` listener.
- **Result**: New batches only append to the bottom of existing columns, so infinite scroll never shifts placed items. Placement runs in O(n), shortest-column lookup in O(1)

### Background-location modal pattern

- **Problem**: Clicking a photo had to change the URL to `/photos/:id` while keeping the gallery visible behind a modal. React Router's official `location.state` recipe loses the state on refresh, making the background impossible to restore.
- **Solve**: Kept the background path in memory via a `useState`-based context. When entering from the gallery, the background path is set, `<Routes location>` is swapped, and a parallel modal `<Routes>` renders on top; on direct access or refresh the state is absent, so the detail renders as a full page. On mobile (≤768px) the background is almost entirely covered, so clicks navigate straight to the full page based on viewport size at entry time.
- **Result**: One URL behaves consistently — click → modal, direct access/refresh → full page — and the same detail component serves both entry paths

### Cache strategy for API rate limits

- **Problem**: The Unsplash API allows 50 requests per hour. TanStack Query's defaults (`staleTime: 0` plus automatic refetch on focus/reconnect) could burn through the limit from tab switching alone.
- **Solve**: Since feed, search, and topic data rarely change within a session, every query uses `staleTime: Infinity` with all automatic refetching disabled. Duplicate photo ids across pages are deduped with a `Map` in `select`. Transient failures recover via `retry: 3`, then escalate to the error boundary.
- **Result**: Zero refetches while a cache entry exists — revisiting the same query or navigating back renders instantly, staying comfortably within the rate limit

### Layered error handling

- **Problem**: A single failed image or one failed infinite-scroll page must not take down the whole screen. Recovery granularity had to match the blast radius of each error.
- **Solve**: Split boundaries into a global `RoutesErrorBoundary` and per-area `PartialErrorBoundary`, with `throwOnError: true` delegating query errors to the nearest boundary. Image errors re-throw from `onError` so only that card swaps to a fallback UI; `fetchNextPage` failures — outside Suspense scope — show an inline retry button at the list bottom. Fire-and-forget calls like download tracking go through a lightweight `useFetchQuery` hook and surface failures as a toast only.
- **Result**: Recovery units established per error scope — a single card, the list footer, a section, or the full page fail and recover independently

### Image loading optimization — zero CLS

- **Problem**: A feed of photos with arbitrary aspect ratios is prone to blank gaps and layout shifts before images load.
- **Solve**: Decoded the API-provided `blur_hash` into a placeholder that fades out on load. The detail page layers two placeholders: dominant-color background → Blurhash → the real image. Explicit `width`/`height` reserve layout space, and multi-step `srcset`+`sizes` plus `fetchpriority="high"` on the first photo optimize LCP.
- **Result**: CLS of 0, desktop LCP of 1.0s (vs 1.8s on the original Unsplash site)

### Bundle and code-splitting optimization

- **Problem**: Vite's default single-bundle output invalidates the vendor cache on every app-code change and ships unvisited pages in the initial load.
- **Solve**: Split react / router / query / emotion vendors via `manualChunks` (function form, required by rolldown), and applied `React.lazy` both per page and per component for error/empty sections and other non-critical UI.
- **Result**: Initial bundle down from 61.81 KiB to 4.92 KiB; Lighthouse Performance of 98 (desktop) and 82 (mobile), beating the original site's 93 and 74

<div class="img-row-2">

![Lighthouse desktop score 98](/images/projects/202604-unsplash-clone-lighthouse-desktop.webp)
![Lighthouse mobile score 82](/images/projects/202604-unsplash-clone-lighthouse-mobile.webp)

</div>

### Testing — 50 unit + 43 E2E

- **Problem**: Flows with many state combinations — modal vs full-page entry, infinite scroll, error recovery — can't be protected from regressions by manual checks alone.
- **Solve**: Pure logic (formatters, blurhash, download utils) and custom hooks (`useDebounce`, `useFetchQuery`, etc.) are covered by Vitest unit tests; the home, detail, and search flows by Playwright E2E. Scenarios include edge cases like closing the modal (ESC, outside click, close button), refresh-to-full-page transition, Korean query encoding, and error handling for nonexistent photo ids.
- **Result**: 50 unit tests across 7 files and 43 E2E tests across 3 specs, all passing — main user flows are guarded against regressions automatically

<div class="img-row-2">

![Unit test results](/images/projects/202604-unsplash-clone-unit-test.webp)
![E2E test results](/images/projects/202604-unsplash-clone-e2e-test.webp)

</div>

## Retrospective / Lessons Learned

The responsive breakpoints (`768px`, `990px`) are hardcoded in both the Emotion styles and the `matchMedia` logic. Extracting them into a shared constant would have kept CSS and JS in sync, but time constraints left that undone. Despite the short timeline, the project was good practice in justifying the decision *not* to use a library — documenting why Virtualizer, `column-count`, and `display: masonry` were each evaluated and rejected drove home that the reasoning behind what you don't adopt shapes design quality as much as what you do.
