---
thumbnail: /images/projects/202007-move.webp
gradient: linear-gradient(135deg, #d8eef8, #b0d4ec)
---

# Content Move Feature Development

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion |
| Period | 2020.07 – 2020.09 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

Developed the full Move UI for relocating 3D clothing content files to other storages (parent storage / child storage). A composite flow supporting single-item moves, multi-select bulk moves, and storage-level moves. Designed a **"Select Space -> Confirm Move -> Complete"** 3-step modal chain, with the core technical challenge being real-time validation of permissions and depth limits while navigating a space hierarchy via a lazy-loaded tree. The Copy feature was also designed to reuse the same space selection tree component, ensuring UI consistency between both features.

![Content move](/images/projects/202007-move.webp)

## Key Implementations

### Modal Chain Orchestration — Independent Step Components with a Single Controller

- **Problem**: Moving items wasn't a simple "confirm button click" — it required three distinct steps: (1) browsing and selecting the destination space, (2) confirming the move result (an irreversible action), and (3) navigating directly to the moved location after completion. Putting all three steps in a single modal component would tangle state and UI; separating each as independent modals would complicate inter-step data transfer and open/close state control.
- **Solve**: Separated each step as an independent modal component, with a parent controller component orchestrating the overall state flow. Selected destination space data is passed between steps via React `useState`. Each step's open/close state is managed as an independent boolean state, with a dedicated common handler designed to close specific steps or all at once.
- **Result**: Single-responsibility structure where each step component focuses only on its own role; modal state consistently cleaned up across all exit paths — complete, cancel, and error.

### Lazy-Loading Tree Navigation via Click-Time Fetch with Memoization

- **Problem**: The storage structure has multi-level hierarchy like parent storage, child storage, and files. Loading the entire hierarchy at once in the move-target tree UI would result in slow API responses and unnecessary data loading. Spaces the user must not move to (no permissions, maximum nesting depth exceeded) also needed to be preemptively blocked in the tree.
- **Solve**: Implemented a lazy-loading pattern that fetches child nodes via API only when a tree node is clicked to expand. Already-fetched nodes are saved in a memoization cache for immediate display on re-expansion without API re-fetch. The maximum nesting depth limit is applied at the tree rendering stage so nodes exceeding the allowed depth are non-selectable. Spaces without upload permissions are filtered at the server level during tree fetch, blocking them from appearing entirely.
- **Result**: Fast initial load even with large hierarchies; spaces users cannot select are preemptively blocked at the tree navigation stage, reducing move failure cases at the source.

### Extensible Structure Design via Mapping Table-Based Move Type Branching

- **Problem**: The API to call and the allowable destination types varied depending on the move target (file / parent storage / child storage). Files could only move to child storage, child storage only to parent storage, and bulk multi-select moves required yet another API. Hard-coding these branches inside components would widen the change scope whenever a new space type is added.
- **Solve**: Defined the mapping between space types and valid destination types as a mapping table (object literal) for declarative branching logic. Separated single move / room move / multi-move into individual mutation functions, with the controller selecting the appropriate function based on type.
- **Result**: Extensible structure where only the mapping table needs updating when a new space type is added.

### Explicit Side Effect Delegation to Parent via Callback Props After Move Completion

- **Problem**: Three side effects needed handling after move completion: (1) refreshing the source list so moved items disappear, (2) resetting selection state when moved from a multi-select context, and (3) routing to the correct space path when "Go to moved location" is clicked in the completion modal. The initial implementation had a bug where moved items still appeared in their original location because the list wasn't refreshed after completion.
- **Solve**: Designed a structure where list refresh and selection reset callback props call the parent component's functions when the completion modal closes. The "Go to moved location" button in the completion modal uses a utility function that generates the correct path based on the move type for dynamic routing.
- **Result**: All three post-move side effects handled in order without omission; users can immediately confirm the move result.

### Move/Copy Shared Tree Component Reuse and dynamic import SSR Disabling

- **Problem**: Both Move and Copy share the common UX of "selecting a target from the space tree." Building tree UI separately for each would duplicate code and require simultaneous changes in both places when modifying tree behavior. The tree component also contains logic dependent on browser DOM (scrollbar position calculations, etc.) that must not run in an SSR environment.
- **Solve**: Designed the space selection tree component as an independent module from the start, reused identically in both Move and Copy. Dynamically imported via `next/dynamic` to disable SSR and prevent server execution of DOM-dependent logic. The recently moved spaces list ("Recent" tab) is loaded asynchronously for quick access to frequently used locations.
- **Result**: Single management point for tree UI logic; SSR execution errors for DOM-dependent code prevented.

## Retrospective / Lessons Learned

The most complex part of this feature was "state management in the modal chain." Each step needed to be independent, yet the overall flow had to be orchestrated by a single controller. Initially managed all step state in the parent component, but as steps increased, props multiplied and it became hard to track which state was used at which step. The structure became simpler once each step component owned its own open/close state and only data needed between steps (selected space info) was lifted up. Fixing the "list not refreshing after move complete" bug also reaffirmed that **side effects occurring in components separated from their parent (like modals) must be explicitly surfaced via callback props**.
