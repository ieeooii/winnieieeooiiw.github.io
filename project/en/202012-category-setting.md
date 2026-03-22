---
thumbnail: /images/projects/202007-category-filter.png
gradient: linear-gradient(135deg, #f0fdf4, #dcfce7)
---

# Brand Category Settings — Multi-Level Hierarchy Management

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, react-sortablejs, Emotion |
| Period | 2020.07 – 2020.12 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend owner) |
| Service Link | style.clo-set.com |

## Overview

A settings page for fashion brand administrators to manage clothing categories in a hierarchical structure up to 4 levels deep. Users can navigate by clicking from root categories down to sub-categories, adding, editing, and deleting nodes, and reordering within each level via drag and drop. Designed a **column-based tree navigation UI** where the number and content of visible columns are dynamically determined by which category the user has selected. The MobX `Map`-based flat data structure and column computing logic were the core design challenges of this feature.

<div class="img-row-2">

![Category Settings Page](/images/projects/202007-category-setting.png)
![Category Filter](/images/projects/202007-category-filter.png)

</div>

## Key Implementations

### Column-Based Tree Navigation UI Design

- **Problem**: When representing a 4-level category tree as a UI, the traditional indentation approach takes up a lot of horizontal space as depth increases and makes it hard to see the current selection path at a glance. CLOSET needed a structure similar to macOS Finder's column view, where the children of the selected node expand in a new column to the right.
- **Solve**: Managed the currently selected path (the selected index at each depth) as a MobX observable using an `openedCategoryIdxes` array. In `useEffect`, traversed this array with `reduce` to compute the list of columns to display (`groupList`) — filtered child nodes from `categoryMap` based on the selected node's `CategoryId` to generate the next column's data. Rendering maps the `groupList` array to display column-unit components (`CategoryTreeColumn`).
- **Result**: Implemented a column tree UI where the selection path is always visually highlighted; current position clearly displayed even at 4 levels deep.

### MobX Map-Based Flat Data Structure + Filtering

- **Problem**: Managing a 4-level hierarchy as a nested tree object requires recursive traversal for finding or updating specific nodes, increasing performance cost and code complexity. It was also necessary to quickly determine whether the total category count (up to several hundred) had been exceeded.
- **Solve**: Stored all categories flat as `Map<CategoryId, Category>`. Node lookups are O(1) via `Map.get(id)`. Per-column display data is dynamically computed via `filterCategoryMap(categoryMap, ({ ParentId }) => ParentId === targetId)`. Total count exceeded check is handled instantly via `categoryMap.size`, displaying `CategoryTotalFullError` message when threshold is exceeded.
- **Result**: Consistent lookup/update performance regardless of depth increase; immediate UI feedback when total count limit is exceeded.

### Drag and Drop Reordering (react-sortablejs)

- **Problem**: Categories needed to be reorderable via drag and drop within each column. `react-beautiful-dnd` had React Strict Mode compatibility issues at the time, and there was a requirement to synchronize the selection state (selected index) to the new position after drag completion.
- **Solve**: Configured each column as a draggable list using `react-sortablejs` (`ReactSortable`). On drag completion event, saved the new order to the server via the `changeCategoryOrder({ categories })` store action. Called `selectCategory(newIndex, depth)` together to update the selected index to the new position after dragging. Defined drag animation CSS classes as global constants for consistent drag UX across all columns.
- **Result**: Drag and drop within columns works correctly; selection state and server data synchronized after drag completion.

### Category Activation / Reset / Copy from Another Company

- Designed a toggle to activate/deactivate the category feature itself — displays the `ActivateCategory` screen when inactive, exposes the tree editing UI only when active.
- Developed full category reset (`CategoryResetOption`) and copy category structure from another company (`CategoryResetOption`) features — supports fashion brands in reusing existing structures during initial setup.
- Implemented a confirmation modal including a warning message (multilingual emphasis via `Trans` component) that deleting a category will cascade-delete all sub-categories.

## Retrospective / Lessons Learned

The key to the column tree was how concisely "the currently open path" could be represented. A single `openedCategoryIdxes` array represents the entire tree's open state, and the logic that traverses this array with `reduce` produces the column list to display. Initially tried managing separate state per depth, but ultimately realized that the unidirectional transformation structure of "path array → column calculation" is much simpler and more predictable. This work taught me that **representing UI state with the minimum information of "current selection path" and deriving everything else is valid even for complex tree UIs**.
