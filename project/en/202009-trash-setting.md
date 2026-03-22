---
thumbnail: /images/projects/202007-trash-setting.png
gradient: linear-gradient(135deg, #e8e8e8, #c8c8c8)
---

# Trash — Deleted Item Restore Feature Development

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion (migrated from jQuery → React) |
| Period | 2020.07 – 2020.09 |
| Team | Frontend 1, Backend 1 (Frontend owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

The Trash tab in Company Settings, where administrators can view deleted content items in a paginated list and restore them individually or in bulk. Consistently handling list refresh, selection state reset, and modal feedback after restore completion were the key design elements. Implemented a pattern where the design system's `Table` component is controlled via an **imperative ref pattern** to trigger deselection externally.

## Key Features

![Trash Setting](/images/projects/202007-trash-setting.png)

## Key Implementations

### Imperative Selection State Control via TableHandle Ref

- **Problem**: The table's checkbox selection state needed to be reset after restore completion. In React's unidirectional data flow, a parent component cannot directly manipulate the internal selection state of a child table. Passing `selectedRows` as a prop is an option, but this doubles up the checkbox state managed internally by the table component with external state, creating a synchronization burden.
- **Solve**: Held the `TableHandle<TrashItem>` ref exposed by the design system's `Table` component via `useImperativeHandle`, received via `useRef`. On restore completion event (`restoreTrashItems()` success), explicitly called `handleTableRef.current.deselectAllRows()` to reset the table's internal selection state. Called the same on page transition (`onPaginate`) to prevent leftover selections from the previous page.
- **Result**: Table selection state cleanly reset after restore and page transitions; no duplication of table internal state and external state.

### Pagination + Multi-Select + Bulk Restore Flow

- **Problem**: When there are many deleted items, loading everything at once results in slow API responses. In the flow of loading page-by-page while selecting multiple items for bulk restore, if previous page selections remain when navigating to a new page, those items would be sent in the restore request along with items from the current page.
- **Solve**: Managed `pagingInfo` (current page, total count) and `selectedTrashItems` as MobX observables in `TrashStore`. On `fetchTrashItems(page)` call, always called `deselectAllRows()` and `setSelectedTrashItems([])` together to automatically reset selection state on page navigation. The restore button is `disabled` when `selectedTrashItems.length === 0`, completely blocking empty-selection API calls.
- **Result**: Safe bulk restore operation without cross-page selection contamination.

### Per-State Modal Feedback & next/dynamic Lazy Loading for Error/Completion Components

- Restore button clicked with no selection: displays a "no items selected" warning modal (`PermissionDeleteNoSelectedModal`) via `isBlank` state.
- API error: displays `WarningModal` via `isError` state.
- Restore complete: displays completion modal via `isCompleteModalOpen` state, then resets all feedback state at once via `clearStatus()`.
- Completion modal and warning modal are lazy-loaded via `next/dynamic` to exclude them from the initial bundle — most users rarely encounter error or completion states.

## Retrospective / Lessons Learned

The Trash feature looks simple, but "how cleanly to clean up state after restore completion" determines UX quality. The `TableHandle` ref pattern seems contrary to React's declarative paradigm, but it is a useful escape hatch when selection reset for a component that manages its own internal state (like a table) must be triggered externally. This taught me that the design system component must expose an appropriate imperative API via `useImperativeHandle` for such control to be possible — meaning **when designing a component, you must also consider in advance what external commands might be needed**.
