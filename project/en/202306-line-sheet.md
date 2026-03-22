---
thumbnail: /images/projects/202209-line-sheet-list-view.webp
gradient: linear-gradient(135deg, #e8f0fc, #c8d8f8)
---

# AG Grid-based Interactive Line Sheet

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, AG Grid, React Query, Emotion.js |
| Period | 2022.09 – 2023.06 (Beta → Phase 1 → Phase 2) |
| Team | Frontend 1, Backend 1, Product Designer 1, PM 1 (Frontend owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

Implemented an interactive Line Sheet (seasonal product listing document) inside CLOSET, linking 3D fashion assets with the spreadsheet-style documents fashion MDs (Merchandisers) use for seasonal product planning and management. Developed in three phases: Beta (thumbnail grid + infinite scroll) → Phase 1 (AG Grid inline editing) → Phase 2 (Excel Export).

## Key Features

<div class="img-row-2">

![Line Sheet List View](/images/projects/202209-line-sheet-list-view.webp)
![Line Sheet Thumbnail View](/images/projects/202209-line-sheet-thumbnail-detail.webp)
![Line Sheet Loading State](/images/projects/202209-line-sheet-loading.webp)
![Company Library](/images/projects/202209-line-sheet-company-library.webp)

</div>

## Key Implementations

### Custom Cell Editor / Renderer by Cell Type (Phase 1 Core)

- **Problem**: The data fashion MDs edit isn't simple text. There are 8+ different cell types — workflow status, date, quantity, sales channels (multi-checkbox), tags, carryover status, etc. — each requiring different UI and validation logic. Editable and non-editable cells also needed to be visually distinguished.
- **Solve**: Built independent components for each cell type using AG Grid's `cellEditor` / `cellRenderer` interfaces:
  - `LineSheetTextCellEditor` — inline text editing with `checkDuplicate` prop for duplicate value validation
  - `LineSheetDateCellEditor` — date picker (Retail Date, etc.)
  - `LineSheetWorkflowCellEditor` / `LineSheetStatusCellEditor` — Select dropdowns, shared via `LineSheetSelectCellEditor`
  - `LineSheetCheckboxCellEditor` — multi-select for sales channels and stores, with auto width calculation via `getSelectControlCellWidth` utility
  - `TagCellEditor` — API integration via `useLineSheetTagMutation` hook
  - `LineSheetCarryoverCellEditor` — carryover status toggle
  - `LineSheetThumbnailCellRenderer` — includes tooltip for turntable-unsupported cases
- **Result**: Spreadsheet-level interactive editing UX implemented. Cell type separation into independent components enables new cell types to be added without affecting existing components.

### React Query + Intersection Observer Infinite Scroll Stabilization
- **Problem**: Duplicate request bug with `useInfiniteQuery` and Intersection Observer combination. The observer triggered immediately on mount, causing `fetchNextPage` to be called once more while already loading. Data state also got corrupted when switching between thumbnail/list modes.
- **Solve**: Separated into `useThumbnailModeInfinityScroll` custom hook and added `isFetching` state check inside the observer callback to block duplicate requests. Added React Query cache reset logic on mode switching.
- **Result**: Stable infinite scroll without duplicate requests; data consistency maintained on mode switching

### Cell Row Spanning — Style 1 : Colorway N Structure
- **Problem**: The Line Sheet data structure is a 1:N relationship of a single style item to N colorways. Style-level common attributes (thumbnail, name, etc.) need to be merged across the number of colorway rows. AG Grid's Row Spanning caused styling to not behave as intended.
- **Solve**: Added `rowSpan` callback to column definitions and dynamically assigned `.show-cell` CSS class to spanning target cells so only merged cells are visible. Separately adjusted background and border styles to align with merged cells.
- **Result**: The 1:N colorway structure is visually merged naturally, achieving spreadsheet-level readability

## Retrospective / Lessons Learned

AG Grid's low abstraction level enables fine-grained customization, but I repeatedly encountered cases where React's unidirectional data flow conflicted with AG Grid's internal state. In particular, `forwardRef` handling and `next/dynamic` duplicate import issues when rendering React components (Select, Datepicker, etc.) inside AG Grid cells were more complex than expected. When integrating third-party libraries with a framework, the key lesson is: understand how each library's lifecycle may conflict before starting.
