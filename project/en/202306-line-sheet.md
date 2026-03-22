---
thumbnail: /images/projects/202209-line-sheet-list-view.webp
gradient: linear-gradient(135deg, #e8f0fc, #c8d8f8)
---

# AG Grid-Based Interactive Line Sheet Development

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, AG Grid, React Query, Emotion.js |
| Period | 2022.09 ~ 2023.06 (Beta → Phase 1 → Phase 2) |
| Team | 프론트엔드 1, 백엔드 1, 프로덕트 디자이너 1, 기획자 1 (프론트엔드 담당) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

Implemented an interactive Line Sheet (seasonal product listing document) inside CLOSET, linking 3D fashion assets with the spreadsheet-style documents fashion MDs (Merchandisers) use for seasonal product planning and management. Developed in three phases: Beta (thumbnail grid + infinite scroll) → Phase 1 (AG Grid inline editing) → Phase 2 (Excel Export).

<div class="img-row-2">

![Line Sheet list view](/images/projects/202209-line-sheet-list-view.webp)
![Line Sheet thumbnail view](/images/projects/202209-line-sheet-thumbnail-detail.webp)
![Line Sheet loading state](/images/projects/202209-line-sheet-loading.webp)
![Company Library](/images/projects/202209-line-sheet-company-library.webp)

</div>

## Key Implementations

### Custom Cell Editor / Renderer by Cell Type

- **Problem**: The data fashion MDs edit isn't simple text. There are 8+ different cell types — workflow status, date, quantity, sales channels (multi-checkbox), tags, carryover status, etc. — each requiring different UI and validation logic. Editable and non-editable cells also needed to be visually distinguished. Fields like colorway number that must be unique required asynchronous validation.
- **Solve**: Built independent components for each cell type (text, single select, multi-checkbox, tag, date, price, etc.) using AG Grid's `cellEditor` / `cellRenderer` interfaces. Colorway number duplicate validation uses AbortController to cancel previous requests, validating only against the last input on the server. Deleted workflows are shown with a deletion indicator in cells but prevented from being reselected.
- **Result**: Spreadsheet-level interactive editing UX implemented. Cell type separation into independent components enables new cell types to be added without affecting existing code.

### Infinite Scroll — Scroll Position Preservation via Manual Cache Update

- **Problem**: Duplicate request bug with `useInfiniteQuery` and Intersection Observer combination. The observer triggered immediately on mount, causing a next-page request while already loading. Additionally, invalidating the entire query after a cell edit would re-fetch hundreds of rows from the beginning, resetting the scroll position.
- **Solve**: Separated into a custom hook and added `isFetching` state check inside the observer callback to block duplicate requests. On successful cell edit, instead of invalidating the entire query, re-sliced the changed row data to match the original page structure and directly replaced the cache via `queryClient.setQueryData()`. On thumbnail/list mode switch, cache is reset to maintain data consistency.
- **Result**: Stable infinite scroll without duplicate requests; scroll position and page state preserved after edits.

### Row Spanning and Virtual Scroll Row Index Mismatch Resolution

- **Problem**: The Line Sheet data structure is a 1:N relationship of a single style item to N colorways. Style-level common attributes (thumbnail, name, etc.) need to be merged across the number of colorway rows. In AG Grid's virtual scroll environment, two issues arose. First, CSS height for merged cells wasn't auto-calculated when Row Spanning was applied, breaking the layout. Second, during cell editing, `rowIndex` was provided as a viewport-relative index rather than the absolute index of the full data array, causing the logic to batch-update all colorway rows of the same style to modify the wrong rows.
- **Solve**: Calculated the merge range based on colorway count via a `rowSpan` callback, and directly calculated and applied merged cell height in CSS based on colorway count and row height. For the row index mismatch, corrected the absolute index using a colorway offset, then forward-scanned to batch-update all rows belonging to the same style item.
- **Result**: 1:N colorway structure visually merged naturally; batch update of all colorway rows works correctly even in virtual scroll environment.

### Mutation Dispatcher — API Routing by Field Type

- **Problem**: Among 35 columns, each editable field had different request parameter structures and API endpoints. Special fields like workflow, category, tags, and colorway name required dedicated APIs while the rest used a generic modification API. Handling all branching in a single function would bloat the code and widen the modification scope when adding new fields.
- **Solve**: Defined special-handling field types as a TypeScript discriminated union and built a mutation handler map keyed by each type. On edit events, the dispatcher looks up and executes the corresponding mutation from the handler map based on field type. Generic fields use a single API call, with a data transformation layer inside the dispatcher that extracts IDs for single-select and converts to ID arrays for multi-select.
- **Result**: Adding a new field type only requires adding one entry to the handler map. Missing field type handlers are caught at compile time.

## Retrospective / Lessons Learned

AG Grid's low abstraction level enables fine-grained customization, but I repeatedly encountered cases where React's unidirectional data flow conflicted with AG Grid's internal state. In particular, `forwardRef` handling and `next/dynamic` duplicate import issues when rendering React components (Select, Datepicker, etc.) inside AG Grid cells were more complex than expected. When integrating third-party libraries with a framework, the key lesson is to first understand how each library's lifecycle may conflict.
