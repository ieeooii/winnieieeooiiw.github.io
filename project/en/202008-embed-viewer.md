---
thumbnail: /images/projects/202007-embed-viewer.webp
gradient: linear-gradient(135deg, #e8e8e8, #c8c8c8)
---

# Embed Viewer Development

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, SCSS, CLO 3D Engine SDK, Emotion |
| Period | 2020.07 ~ 2020.08 |
| Team | Frontend 2, Backend 2, Designer 1, PM 1 (Frontend in charge) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |
| Blog | support.clo-set.com/hc/en-us/articles/45303195817497-Embed-Viewer |

## Overview

An Embed Viewer feature that allows fashion brands and retailers to embed CLO-SET's 3D garment viewer via iframe into their own webstores. It supports various content formats including 3D files (.zpac, .zprj, etc.), rendered images, and turntables. Users can customize viewer UI, background color, logo, auto-rotation and other detailed options, then distribute via embed URL or iframe code. Designed for enterprise customers to manage domain whitelist-based access control policies directly, with complex viewer state managed through MobX-based stores.

## Key Features

- **Multi View Types**: Support for 4 view types — 3D, Rendering, Turntable, 2D Image
- **Option Customization**: Real-time preview of detailed options including background color, logo, auto-rotation, and quality
- **Two Sharing Methods**: Embed URL + QR code / iframe code selection
- **Domain Access Control**: Private Embed Viewer where enterprise admins directly manage allowed domains
- **Plan-Based Usage Limits**: View count tracking and notification screen branching when exceeded

<div class="img-row-2">

![Embed Viewer option settings](/images/projects/202007-embed-viewer.webp)
![Embed Viewer iframe code](/images/projects/202007-embed-viewer-iframe.webp)
![Embed Viewer publish confirmation modal](/images/projects/202007-embed-viewer-publish.webp)

</div>

## Key Implementations

### Conditional Multi-Viewer Type Mounting via Computed Subscription

- **Problem**: A single Embed URL needs to support multiple view types (3D / Rendering / Turntable / 2D Image), but each type has completely different rendering engines (WebGL 3D viewer vs image viewer) and data fetching strategies. The combinations of file types (CLO native / external 3D / image) and view types grow non-linearly if handled through component-internal conditionals. Also, the list of available options (colorway, turntable, etc.) needed to auto-update when the view type changes.
- **Solve**: A single `@computed` value in the store determines whether the current view type is 3D, and the viewer container conditionally mounts either the 3D engine component or image viewer component based on this value alone. Display options activated per view type are declared as an object map, with MobX `reaction()` detecting view type changes and automatically swapping the option list to the corresponding map values.
- **Result**: The viewer container subscribes to a single computed value without conditional branching; display options auto-update on view type switch.

### Responsibility-Based Store Class Separation with Independent Reset Design

- **Problem**: When viewer state (colorway index, view type, loading progress, etc.), display options (background color, logo, auto-rotation, etc.), and publish flow state are mixed in a single class, responsibility boundaries become unclear and it becomes difficult to control initialization scope during viewer type transitions.
- **Solve**: Separated viewer core state / display options / publish process state into independent classes, with the main store holding them via composition. Each class has its own `reset()` action, enabling clear control of initialization scope at the class level.
- **Result**: Initialization scope can be independently controlled per class; components receive state through store subscriptions alone.

### Colorway Switching Across View Types and Texture Quality Optimization

- **Problem**: Colorway switching works differently per view type. The 3D viewer swaps textures via the engine API, while rendering/turntable views need to fetch new image sequences per colorway. Additionally, embed environments (external webstores) cannot predict device performance and network bandwidth, so loading heavy high-quality textures by default is not acceptable.
- **Solve**: The colorway change action executes either engine API calls or image sequence fetches depending on the current view type. Texture quality is controlled in two levels (high quality / optimized), with a separate toggle for Depth Peeling for accurate rendering of translucent materials (sheer, lace, etc.).
- **Result**: Consistent colorway switching UX regardless of view type; stable playback guaranteed even in low-spec environments.

### Query Parameter Serialization for Viewer State Restoration on URL Sharing

- **Problem**: 8+ options (background color, logo, UI visibility, auto-rotation, quality, depth peeling, etc.) need to be encoded in the URL, but including all options at all times makes the URL unnecessarily long. Conversely, if query parameters aren't restored as initial values on the viewer page, settings are lost when sharing links.
- **Solve**: Minimized URLs by including only options that differ from defaults when serializing with the `qs` library. On viewer page entry, query parameters are parsed and restored as store initial values, after which only store state is trusted in a unidirectional flow. In the Embed Modal's real-time preview, the `@computed` URL updates immediately on option changes and is reflected in the copy button.
- **Result**: Complete viewer state reproduction from a single embed URL; URL minimized without unnecessary parameters.

### Domain Whitelist-Based Private Embed Viewer Implementation

- **Problem**: Enterprise customers wanted to restrict embeds to work only on their own domains, but due to iframe characteristics, the client cannot verify the origin, and the server cannot reliably verify origin with just standard Referer headers. There was also no admin UI for registering, editing, and deleting allowed domains.
- **Solve**: The embed origin domain is sent to the server via a custom header during viewer data API requests, and the server checks against the whitelist to determine whether to block. Access policies were designed as three types: "Public / Disabled / Allowed Domains Only," with a domain CRUD UI implemented in the admin console. Client-side format validation is performed on domain input before saving, and server response error codes (duplicate, format error) are displayed as errors on the corresponding items. Unsaved new input items are distinguished by temporary identifiers and immediately removed on cancel via optimistic UI handling.
- **Result**: Embed requests from unauthorized domains are blocked at the server; complete access control flow where admins directly manage the whitelist.

### Differentiated Block Reason Guidance via HTTP Status Code + Error Code Combination

- **Problem**: Embed viewer view counts need to be limited per plan, but multiple API requests within the viewer could result in duplicate counting. Also, blocks due to usage limit exceeded and blocks due to unauthorized domains needed to be distinguished at the server response level so the UI could branch appropriately.
- **Solve**: Controlled counting with a flag so only the initial data fetch is counted. Combined HTTP status codes and error codes from server responses to classify into three cases: "Usage Exceeded / Domain Blocked / Other Error," branching to different notification screens for each.
- **Result**: Accurate usage tracking; clear guidance provided based on block reason.

## Retrospective

The requirement that "a single URL must fully reproduce various states" influenced the overall design. Simplifying the structure by using query parameters only for initialization and then trusting only the store in a unidirectional flow — this principle was repeatedly applied in other URL-based state management scenarios afterward. For features like domain whitelist verification where the trust boundary clearly exists between client and server, I reconfirmed that no matter how well the client blocks, server-side verification must be the prerequisite.
