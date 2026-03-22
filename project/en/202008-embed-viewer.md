---
thumbnail: /images/projects/202007-embed-viewer.png
gradient: linear-gradient(135deg, #e8e8e8, #c8c8c8)
---

# Embed Viewer

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, SCSS, CLO 3D Engine SDK, Emotion |
| Period | 2020.07 – 2020.08 |
| Team | Frontend 2, Backend 2, Designer 1, PM 1 (Frontend owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

An Embed Viewer feature that allows garment content in various formats — 3D clothing files (.zpac, .zprj, etc.), rendered images, turntables — to be embedded via iframe in external websites. Designed beyond simple iframe insertion: enterprise customers can directly manage domain whitelist-based access control policies and customize detailed viewer options including UI display, background color, logo, auto-rotation, and more. The complex structure where the rendering pipeline and data fetching strategy differ depending on viewer type (3D / Rendering / Turntable / 2D Image) was integrated and managed through a single MobX-based store.

## Key Implementations

### Multi-Viewer Type Architecture Design

- Designed routing and component branching so a single Embed URL supports 5 view types: 3D, rendering, turntable, 2D image, and pattern.
- Designed a viewer container that determines the rendering strategy by crossing file type (CLO3D / Turntable / External 3D / Other) with view type, conditionally mounting either a 3D viewer or an image viewer internally.
- Established a file type system that handles both external 3D formats (fbx, obj, glb, dae, etc.) and CLO native formats.

### MobX-Based EmbedStore Design

- **Problem**: Viewer state (colorway index, view type, loading progress, background color, etc.) and options (UI display, logo, auto-rotation, render quality, etc.) were being passed between components via prop-drilling 4+ levels deep, and controlling the state reset timing during viewer type transitions was difficult.
- **Solve**: Separated the viewer core state / display options / async process state into three hierarchical classes. Parsed options from URL query parameters to set initial state, and built a unidirectional flow where subsequent user interactions change only through the store.
- **Result**: Components receive state via store subscription only, eliminating deep prop-drilling. View type transitions can be handled with a single store method for consistent initialization.

### Domain Whitelist-Based Private Embed Viewer (PEV)

- **Problem**: Enterprise customers wanted to restrict embed functionality to their own domains only, but the iframe nature made it difficult for the server to verify request origins, and there was no admin UI for managing domains directly.
- **Solve**: Transmitted the embed source domain to the server via custom headers on API requests. Collaborated with the backend to design a three-tier access policy system: public / disabled / allowlisted sites only. Implemented an allowed-domain CRUD UI in the admin console.
- **Result**: Enterprise customers can directly manage allowed domains, and embed requests from non-allowed domains are blocked server-side — a complete access control flow.

### Embed Option Query Parameter Serialization / Deserialization

- Serialized 8 viewer options set by the user in the Embed Modal — background color, logo color, UI display, auto-rotation, texture quality, depth peeling, skybox, etc. — into URL query strings reflected in the iframe src.
- Parsed query parameters to restore them as store initial values, enabling complete viewer reproduction from the embed URL alone.
- Implemented real-time URL updates in the Embed Modal's live preview as options change.

### Usage Tracking & Plan Limit Handling

- **Problem**: Embed viewer views needed to be limited per plan, but API requests made within the iframe could be double-counted.
- **Solve**: Implemented flag control logic so counts are only tallied on the initial data fetch. Mapped the error response the server returns on usage limit exceedance to a separate case and branched to a limit notification screen.
- **Result**: Accurate usage tracking alongside clear limit guidance for users.

### Colorway Switching & Texture Quality Control

- On colorway change in the 3D viewer, called the viewer engine API to swap textures; in render view type, branched to fetch a new image sequence per colorway.
- Controlled texture quality at two levels — high-quality / optimized — to ensure stable playback even in embed environments (low-spec devices, low bandwidth).
- Offered Depth Peeling technique as an option for accurate rendering of translucent materials (see-through, lace, etc.).

## Retrospective / Lessons Learned

The requirement that "a single URL must completely reproduce various states" influenced the overall design. Using query parameters simply as initial values versus maintaining the store state and URL as a synchronized single source of truth (SSoT) is vastly different in implementation complexity. Initially mixed the two approaches, but the structure became simpler once parameters were read only at initialization and the store was trusted thereafter. Features like domain whitelist validation where a "trust boundary" clearly exists between client and server were a reminder that no matter how well the client blocks, server-side verification must be the foundation.
