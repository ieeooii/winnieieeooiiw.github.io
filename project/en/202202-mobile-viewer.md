---
thumbnail: /images/projects/202202-mobile-viewer-3d.png
gradient: linear-gradient(135deg, #dde8f0, #b8ccd8)
---

# Mobile Viewer Page

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

A mobile-dedicated viewer page for 3D garments, providing basic 3D garment info, color switching, and avatar/garment visibility toggle. Separated from the desktop viewer into a `/mobile/content.tsx` route with touch-based interactions, Bottom Sheet navigation, and a portrait layout. User-Agent-based redirects ensure mobile users receive the optimized bundle. Separated from the desktop viewer into a `/mobile/content.tsx` route with touch-based interactions, Bottom Sheet navigation, and a portrait layout. User-Agent-based redirects ensure mobile users receive the optimized bundle.

## Key Features

<div class="img-row-3">

![Full-screen 3D Viewer](/images/projects/202202-mobile-viewer-3d.png)
![Content Info Panel](/images/projects/202202-mobile-viewer-info.png)
![Colorway Selection UI](/images/projects/202202-mobile-viewer-colorway.png)

</div>

## Key Implementations

### 3D Viewer Initial Load Size Bug & Loading UX
- **Problem**: When loading a 3D file for the first time on mobile, the viewer canvas wasn't initializing to the correct size. The resize calculation ran before the DOM size was finalized right after the viewer mounted, causing the 3D model to render squished or clipped. Additionally, just a blank screen was shown during 3D file loading, leaving users unable to tell whether the page was loading or had errored.
- **Solve**: Fixed the resize event timing to trigger on the next tick after viewer mount using `requestAnimationFrame`. Developed a new `CircleProgress.tsx` circular progress indicator to visually show 3D file loading progress.
- **Result**: Initial render size bug resolved; loading state clearly displayed

### Canvas Resize on Orientation Change
- **Problem**: The 3D canvas didn't resize correctly when switching between portrait and landscape on mobile. Canvas dimensions are calculated from browser client dimensions, requiring recalculation on orientation change. `Screen.orientation` API had no Safari support, and CSS `orientation` media query couldn't be applied since the 3D canvas size is controlled via inline styles.
- **Solve**: Used `window.resize` event to detect orientation changes and trigger canvas recalculation.
- **Result**: 3D canvas resizes correctly on portrait/landscape switch

### Bottom Sheet Mobile Navigation
- **Problem**: On desktop, content and colorway lists are shown in a side panel. On mobile, there wasn't enough screen space to display both the 3D viewer and the list without the viewer becoming too small.
- **Solve**: Developed new `BottomSheetNavigation.tsx` (slide-up bottom sheet) and `ContentNavigationContainer.tsx`. Added touch-optimized colorway selection UI to `ContentColorwayContainer.tsx`. Added `BaseAppBar.tsx` to the design system for shared mobile app bar.
- **Result**: Full-screen 3D viewer with on-demand list access via Bottom Sheet pattern

### Tab Switch Performance — Memory Leak & Reflow Fix
- **Problem**: After extended use, the browser would slow down or forcefully close the tab. Traced via `debugger` and Chrome DevTools Memory Sampling Profile, two root causes were found. First, a Heap Memory Leak from event listeners accumulating after unmount — handlers were declared outside `useEffect`, creating a new function instance on every render that cleanup couldn't remove. Second, repeated Reflow on tab switching degraded rendering performance.
- **Solve**: Moved event handlers inside `useEffect` for consistent reference on register/remove. Added explicit `removeEventListener` in cleanup. Instead of unmounting components on tab switch, managed data in the parent component and used `display: none` to hide panels, preventing Reflow.
- **Result**: Memory leak resolved; tab switch performance improved; forced tab closure eliminated

## Retrospective / Lessons Learned

Debugging the memory leak was the first time I properly used Chrome DevTools' Memory tab. I learned that comparing Heap snapshots across time points reveals which objects are accumulating without being GC'd. This experience cemented just how important it is to "always write `useEffect` cleanup functions" as a rule.
