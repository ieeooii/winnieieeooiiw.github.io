---
thumbnail: /images/projects/202202-mobile-viewer-3d.webp
gradient: linear-gradient(135deg, #dde8f0, #b8ccd8)
---

# Mobile Viewer Page Development

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion.js |
| Period | 2022.02 – 2022.04 |
| Team | Frontend 1, Product Designer 1 (Frontend owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

A mobile-dedicated viewer page for 3D garments on the main page. Provides basic 3D garment info, color switching, and avatar/garment visibility toggle. Separated from the desktop viewer into a dedicated route with touch-based interactions, Bottom Sheet navigation, and a portrait layout. User-Agent-based redirects ensure mobile users receive only the optimized bundle.

<div class="img-row-3">

![3D viewer full screen](/images/projects/202202-mobile-viewer-3d.webp)
![Content info panel](/images/projects/202202-mobile-viewer-info.webp)
![Colorway selection UI](/images/projects/202202-mobile-viewer-colorway.webp)

</div>

## Key Implementations

### Initial Canvas Size Bug Fix and Loading Progress Visualization
- **Problem**: When loading a 3D file for the first time on mobile, the viewer canvas wasn't initializing to the correct size. The resize calculation ran before the DOM size was finalized right after the viewer mounted, causing the 3D model to render squished or clipped. Additionally, just a blank screen was shown during 3D file loading, leaving users unable to tell whether the page was loading or had errored.
- **Solve**: Fixed the resize event timing to trigger on the next tick after viewer mount using `requestAnimationFrame`. Developed a new circular progress indicator to visually show 3D file loading progress.
- **Result**: Initial render size bug resolved; loading state clearly displayed.

### Canvas Resize on Portrait/Landscape Orientation Change
- **Problem**: The 3D canvas didn't resize correctly when switching between portrait and landscape on mobile. Canvas dimensions are calculated from browser client dimensions, requiring recalculation on orientation change. `Screen.orientation` API had no Safari cross-browser support, and CSS `orientation` media query couldn't be applied since the 3D canvas size is controlled via inline styles.
- **Solve**: Used `window.resize` event to detect orientation changes and trigger canvas size recalculation.
- **Result**: 3D canvas resizes correctly on portrait/landscape switch.

### Full-Screen Viewer with Bottom Sheet Navigation
- **Problem**: On desktop, content and colorway lists are shown in a side panel. On mobile, there wasn't enough screen space to display both the 3D viewer and lists without the viewer becoming too small.
- **Solve**: Developed a new slide-up Bottom Sheet component to display lists as an overlay. Added touch-optimized colorway selection UI. Added a mobile app bar component to the design system for shared use.
- **Result**: Full-screen 3D viewer secured; on-demand list access available via Bottom Sheet.

### Memory Leak Elimination and Reflow Minimization for Long-Session Performance
- **Problem**: After extended use of the mobile viewer page, the browser would slow down or forcefully close the tab. Traced via `debugger` and Chrome DevTools Memory Sampling Profile, two root causes were found. First, a Heap Memory Leak from event listeners accumulating after component unmount — event handlers were declared outside `useEffect`, creating a new function instance on every render that was registered but never removed during cleanup. Second, repeated Reflow on bottom tab switching degraded rendering performance.
- **Solve**: Moved event handlers inside `useEffect` for consistent reference on register/remove. Added explicit `removeEventListener` in cleanup. Instead of unmounting components on tab switch, managed data in the parent component and used `display: none` to prevent Reflow.
- **Result**: Memory leak resolved during long-session use; tab switch performance improved; forced tab closure eliminated.

## Retrospective / Lessons Learned

Debugging the memory leak was the first time I properly used Chrome DevTools' Memory tab. I learned that comparing Heap snapshots across time points reveals which objects are accumulating without being GC'd. This experience cemented just how important it is to "always write `useEffect` cleanup functions" as a rule.
