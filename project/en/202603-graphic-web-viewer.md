---
thumbnail: /images/projects/graphic-web-viewer-thumb.svg
gradient: linear-gradient(135deg, #e0f2fe, #bae6fd)
---

# React Abstraction Layer for 3D Engine API & Viewer Renewal

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | React 19, TypeScript, Vite, Jotai, TanStack React Query, Emotion, Socket.io, 3D Engine API |
| Period | 2025.07 – 2026.03 |
| Team | Frontend 1, Backend 2, Graphics Engineer 1, Product Designer 2 (Frontend owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

Completely rebuilt the 3D viewer, CLO-SET's core feature. Solely designed and implemented an abstraction package for using the CLO3D engine in React, and was responsible for the full viewer feature scope: image viewer, 3D engine viewer, render viewer, ETC viewer, video viewer, render executor, version management, and environment settings.

The CLO3D API provided by the engine team was a flat list of functions with no definition of React integration. Using it directly in the app would scatter engine usage across app code, so a hook layer abstracting the lifecycle into React was designed as an independent package.

**Key implemented components**: `CLO3DViewer` (panzoom integration) / `CLO3DEngineViewer` (colorway/strain map/exploded view/pattern render) / `CLO3DRenderViewer` / `TurntablePlayer` / `CLO3DRenderExecutor` (render executor) / `Environment` (ChromePicker/PhotoPicker) / `ETCImageViewer` / `ETCDocViewer` / video viewer (socket stream) / `ViewerVersionSelect`

## Key Implementations

### Double Canvas Creation in React StrictMode
- **Problem**: React 18 StrictMode intentionally runs mount → unmount → mount twice in development. This caused the engine init to be called twice, creating two canvases — one empty canvas and one normally rendered canvas coexisting in the DOM.
- **Solve**: Called `destroyCanvas()` first when entering the engine init function (`initViewer`) to remove any existing canvas before starting. Added `if (engineInstance) return` to prevent re-initialization when an instance already exists. Managed the engine instance via external handlers (`engineInstanceHandler.set/reset`) rather than hook-internal state, so the cleanup-on-unmount → recreate-on-remount flow works precisely in sync with React's lifecycle.
- **Result**: Only a single canvas renders even in StrictMode; engine init/cleanup cycle perfectly synchronized with React lifecycle.
- **Insight**: There was a temptation to solve this by disabling StrictMode, but solving it through proper design made a significant difference in long-term maintainability.

### Engine API → React Hook Abstraction
Separated the package structure into three concerns:
- **Initialization** (`useInitReactEngine3DViewer`): Engine instance creation and canvas mounting
- **Content Loading** (`useReactEngine3DViewerLoadSRest`): Async 3D file loading
- **Resize** (`useReactEngine3DViewerResize`): ResizeObserver + 30ms throttle for canvas size synchronization
- **Problem**: The API provided by the engine team was a flat function list with no defined usage order (init → data load → viewer option apply), async timing, or error handling approach.
- **Solve**: Separated each function into role-specific hooks with a unified interface (`ReactEngine3DViewingOptionItem`). Implemented viewer options (Avatar/Garment display, Strain Map, Exploded View, pattern render, magnifier) as independent hooks each. Grouped keyboard shortcuts into `useReactEngine3DViewerShortcut` hook. Distinguished and handled the 8 error types the engine throws. Wrapped everything in a composition hook (`useReactEngine3DViewer`) so usage sites only need a single hook call to use the engine.
- **Result**: Usage sites can use all viewer features via the hook alone without knowing the engine API directly. Extensible structure where adding new viewer options only requires matching the interface.

### `CLO3DRenderExecutor` — Render Executor
- **Problem**: A single UI needed to manage complex workflows: render options (quality, image size, video/GIF), preset save/load, render server status display, and render cancellation.
- **Solve**: Centralized render-related state as Jotai atoms and separated UI into settings → execute → status monitoring phases. Render server status is received in real-time via socket and reflected.
- **Result**: Complex render workflows can be handled intuitively step by step.

### `TurntablePlayer` Implementation
- **Problem**: Turntable (rotation animation) playback required smooth image sequence loading, playback speed control, and frame transitions.
- **Solve**: Controlled image sequences using `requestAnimationFrame`, starting playback after preloading completes. Connected speed slider and frame indicator UI.
- **Result**: Smooth turntable playback with loading state feedback.

### Restore Viewing Options After Colorway Change
- **Problem**: Viewing options set by the user (strain map, pattern, etc.) were being reset when changing the colorway.
- **Solve**: Preserved the current viewing option state in an atom during colorway change, and re-applied after engine re-initialization completes.
- **Result**: User settings maintained after colorway changes.

## Retrospective / Lessons Learned

This is the project I contributed to the longest and across the widest scope. The core of this project was designing the abstraction layer aligned with React paradigms rather than using the engine team's API directly. It was also the first project where I introduced Jotai — for viewer-like cases where state is distributed across many components, I found atom-based state management to be far more flexible than Context.
