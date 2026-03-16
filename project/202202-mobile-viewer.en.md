# 3D Garment Mobile Viewer Page

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion.js |
| Period | 2022.02 – 2022.04 |
| Team | Frontend (sole owner) |
| Service Link | style.clo-set.com |

## Overview

A dedicated viewer page for viewing 3D content and browsing colorways on mobile devices. Separated from the desktop viewer into a `/mobile/content.tsx` route with touch-based interactions, Bottom Sheet navigation, and a portrait layout. User-Agent-based redirects ensure mobile users receive the optimized bundle.

## Key Implementations

### 3D Viewer Initial Load Size Bug & Loading UX
- **Problem**: When loading a 3D file for the first time on mobile, the viewer canvas wasn't initializing to the correct size. The resize calculation ran before the DOM size was finalized right after the viewer mounted, causing the 3D model to render squished or clipped. Additionally, just a blank screen was shown during 3D file loading, leaving users unable to tell whether the page was loading or had errored.
- **Solve**: Fixed the resize event timing to trigger on the next tick after viewer mount using `requestAnimationFrame`. Developed a new `CircleProgress.tsx` circular progress indicator to visually show 3D file loading progress.
- **Result**: Initial render size bug resolved; loading state clearly displayed

### Bottom Sheet Mobile Navigation
- **Problem**: On desktop, content and colorway lists are shown in a side panel. On mobile, there wasn't enough screen space to display both the 3D viewer and the list without the viewer becoming too small.
- **Solve**: Developed new `BottomSheetNavigation.tsx` (slide-up bottom sheet) and `ContentNavigationContainer.tsx`. Added touch-optimized colorway selection UI to `ContentColorwayContainer.tsx`. Added `BaseAppBar.tsx` to the design system for shared mobile app bar.
- **Result**: Full-screen 3D viewer with on-demand list access via Bottom Sheet pattern

### JavaScript Heap Memory Leak Fix
- **Problem**: After extended use of the mobile viewer, the browser would slow down or forcefully close the tab. Comparing Heap snapshots in Chrome DevTools Memory tab revealed that event listeners were accumulating after component unmount without being removed. Event handlers were declared outside `useEffect`, creating a new function instance as an event listener on every render. Cleanup functions tried to remove a different function reference and therefore weren't actually removing anything.
- **Solve**: Moved event handlers inside `useEffect` so the same function reference is both registered and removed. Explicitly called `removeEventListener` in cleanup functions to ensure complete cleanup on unmount.
- **Result**: Memory leak on extended use resolved; forced tab closure issue eliminated

## Retrospective

Debugging the memory leak was the first time I properly used Chrome DevTools' Memory tab. I learned that comparing Heap snapshots across time points reveals which objects are accumulating without being GC'd. This experience cemented just how important it is to "always write `useEffect` cleanup functions" as a rule.
