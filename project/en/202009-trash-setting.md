---
thumbnail: /images/projects/202007-trash-setting.webp
gradient: linear-gradient(135deg, #e8e8e8, #c8c8c8)
---

# Trash — Deleted Item Restore Feature React Migration

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

The Trash tab in Company Settings, where administrators can view deleted content items in a paginated list and perform multi-select bulk restore. Includes deleted item browsing, checkbox multi-select and bulk restore, conversion error item selection disabling, and per-status modal feedback for completion and errors. Consistently handling list refresh, selection state reset, and modal feedback after restore completion were the key design elements. The design system's `Table` component was controlled via an **imperative ref pattern** to trigger deselection externally.

![Trash settings](/images/projects/202007-trash-setting.webp)

## Key Implementations

### Post-Restore Table Selection State Reset via useImperativeHandle Ref Pattern

- **Problem**: The table's checkbox selection state needed to be reset after restore completion. In React's unidirectional data flow, a parent component cannot directly manipulate the internal selection state of a child table. Passing selected items as a prop is an option, but this doubles up the checkbox state managed internally by the table component with external state, creating a synchronization burden.
- **Solve**: Held the table handle ref exposed by the design system's `Table` component via `useImperativeHandle`, received via `useRef`. On restore completion, explicitly called the ref's deselect method to reset the table's internal selection state. Called the same on page transition to prevent leftover selections from the previous page.
- **Result**: Table selection state cleanly reset after restore and page transitions; no duplication of table internal state and external state.

### Cross-Page Selection Contamination Prevention via Page Navigation Reset

- **Problem**: Loading everything at once when there are many deleted items results in slow API responses. In the flow of loading page-by-page while selecting multiple items for bulk restore, if previous page selections remain when navigating pages, restore requests would include items from other pages. Additionally, items with conversion errors cannot be restored, so selection itself needed to be blocked.
- **Solve**: Managed current page, total count, and other page info along with selected items as MobX `@observable`. On page navigation, list re-fetch and selection state reset are executed together to prevent cross-page selection contamination. Items with conversion error status are treated as row-level non-selectable conditions to block invalid restore requests at the source. The restore button is `disabled` when no items are selected.
- **Result**: Safe bulk restore operation without cross-page selection contamination; selection of non-restorable items prevented.

### Initial Bundle Optimization via next/dynamic Lazy Loading

- **Problem**: The restore flow has five possible states: loading, restore in progress, no selection, API error, and complete. Each state requires a different modal, and all related state must be reset when closing a modal. Handling state reset individually for each case makes omissions likely.
- **Solve**: Declared all five UI states (loading, restore in progress, no selection, error, complete) as MobX `@observable`, resettable via a single reset action. Completion and warning modals are lazy-loaded via `next/dynamic` to exclude them from the initial bundle — since error and completion states are infrequent cases.
- **Result**: Consistent state reset via a single action call from all entry points; initial bundle made lighter.

## Retrospective

The Trash feature looks simple, but "how cleanly to clean up state after restore completion" determines UX quality. The table handle ref pattern seems contrary to React's declarative paradigm, but it is a useful escape hatch when selection reset for a component that manages its own internal state (like a table) must be triggered externally. This taught me that the design system component must expose an appropriate imperative API via `useImperativeHandle` for such control to be possible — meaning **when designing a component, you must also consider in advance "what external commands might be needed."**
