---
thumbnail: /images/projects/202007-move.png
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

Developed the full Move UI for relocating 3D clothing content items to other spaces (Workroom / Season). A composite flow supporting single-item moves, multi-select (MultiSelect) bulk moves, and workroom/season-level moves. Designed a 3-step modal chain of **"Select Space → Confirm Move → Complete"**, with the core technical challenge being real-time validation of permissions and depth limits while navigating a space hierarchy via a lazy-loaded tree. The `SelectSpaceTree` component was designed from the start to be reusable for Copy functionality as well, ensuring UI consistency between both features.

## Key Features

![Content Move](/images/projects/202007-move.png)

## Key Implementations

### 3-Step Modal Chain Architecture Design

- **Problem**: Moving items wasn't a simple "confirm button click" — it required three distinct steps: ① browsing and selecting the destination space, ② confirming the move result (an irreversible action), and ③ navigating directly to the moved location after completion. Putting all three steps in a single modal component would tangle state and UI together; separating each as independent modals would complicate inter-step data transfer and open/close state control.
- **Solve**: Separated each step as an independent modal component, with `ItemMoveModal` acting as a controller orchestrating the overall state flow. Selected destination space data is passed between steps via React `useState`. Each step's open/close state is managed as an independent boolean state, with a dedicated `onCloseAllModal` common handler designed to close specific steps or all at once.
- **Result**: Single-responsibility structure where each step component focuses only on its own role; modal state consistently cleaned up across all exit paths — complete, cancel, and error.

### Lazy-Loading Space Tree (`SelectSpaceTree`) Design

- **Problem**: CLOSET's space structure has multi-level hierarchy (Workroom → Season → Content). Loading the entire space hierarchy at once in the move-target tree UI would result in slow API responses and unnecessary data loading. Spaces the user must not move to (no permissions, maximum nesting depth exceeded) also needed to be preemptively blocked in the tree.
- **Solve**: Implemented a lazy-loading pattern that fetches child nodes via API only when a tree node is clicked to expand. Already-fetched nodes are saved in a memoization cache for immediate display on re-expansion without re-fetching. The maximum nesting depth limit is applied at the tree rendering stage so that nodes exceeding the allowed depth are non-selectable. Spaces without upload permissions are filtered out at the server level during the tree fetch, blocking them from appearing at all.
- **Result**: Fast initial load even with large hierarchies; spaces users cannot select are preemptively blocked at the tree navigation stage, reducing move failure cases.

### Move Type Branching (Content / Workroom / Multi-Select)

- **Problem**: The API endpoint to call and the allowable destination space types varied depending on the move target (content item / workroom / assignment). Content could only be moved to workrooms and assignments only to seasons, and bulk multi-select moves required yet another API. Hard-coding these branches inside component internals would widen the change scope whenever a new space type is added.
- **Solve**: Defined the mapping between space type (SpaceType) and valid destination types as a mapping table (object literal) for declarative branching logic. Separated single move / room move / multi-move into individual mutation functions, with `ItemMoveModal` selecting the appropriate function based on type.
- **Result**: Extensible structure where only the mapping table needs updating when a new space type is added.

### Post-Move State Synchronization (List Refresh + Selection Reset + Navigation)

- **Problem**: Three side effects needed to be handled after move completion: ① refreshing the source list so moved items disappear, ② resetting the selection state when moved from a multi-select context, and ③ routing to the correct space path when "Go to moved location" is clicked in the completion modal. The initial implementation had a bug where moved items still appeared in their original location because the list wasn't refreshed after move completion.
- **Solve**: Designed a structure where the `reloadItems` callback prop calls the parent component's list refresh function when the completion modal closes. The `unselectAll` callback resets multi-select state on completion. The "Go to moved location" button in the completion modal uses a utility function that generates the correct path based on the move type (SpaceType) for dynamic routing.
- **Result**: All three post-move side effects handled in order without omission; users can immediately confirm the move result.

### `SelectSpaceTree` Sharing with Copy Flow

- Both Move and Copy share the common UX of "selecting a target from the space tree." `SelectSpaceTree` was designed as an independent module from the start, reused identically in both `ItemMoveModal` and `ItemCopyModal`.
- The tree component is dynamically imported via `next/dynamic` with SSR disabled — the tree menu's scrollbar and position calculations operate based on the browser DOM.
- The recently moved spaces list ("Recent" tab) is asynchronously loaded from the store for quick access to frequently used locations.

## Retrospective / Lessons Learned

The most complex part of this feature was "state management in the modal chain." Each step needed to be independent, yet the overall flow had to be orchestrated by a single controller. Initially tried managing all step state in the parent component, but as steps increased, props multiplied and it became hard to track which state was used at which step. The structure became simpler once each step component owned its own open/close state and only data needed between steps (selected space info) was lifted up. Fixing the "list not refreshing after move complete" bug also reaffirmed that **side effects occurring in components separated from their parent (like modals) must be explicitly surfaced via callback props**.
