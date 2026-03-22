---
thumbnail: /images/projects/202207-drive-view-mode-colorway.png
gradient: linear-gradient(135deg, #e8f0e8, #c8d8c8)
---

# Color Variant View Mode

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query, MobX, Emotion.js |
| Period | 2022.05 – 2022.07 |
| Team | Frontend 1, Backend 1, Product Designer 1, PM 1 (Frontend owner) |
| Service Link | style.clo-set.com |

## Overview

A feature for managing color variants (Colorways — color-specific versions of the same design) of a 3D garment item. The 1:N relationship of a single style item to N colorways was consistently represented across content list View Mode switching, Line Sheet row spanning, and inline colorway workflow status editing.

## Key Implementations

### Colorway View Mode (2022.05–2022.07)
- **Problem**: The content page only supported item-level viewing, making it difficult for fashion MDs to compare colorway thumbnails side by side. Mode switching needed to happen instantly without reloading the page (to avoid duplicate API calls for the content list), and the selected mode needed to persist after page refresh.
- **Solve**: Implemented View Mode toggle UI in `ContentViewModeSettingBar.tsx`. Re-composed already-loaded data at the component level into colorway units for display (no API re-calls). Saved the selected mode to a `cookie` for restoration after refresh or page navigation. Managed per-colorway checkbox selection state separately in `StyleItem.tsx`.
- **Result**: View Mode switching without additional API calls; mode state restored after refresh; colorway-by-colorway thumbnail comparison enabled

### Colorway Multi-Select & Context Menu Integration
- **Problem**: Multiple colorways needed to be selectable for bulk download/delete/etc. via Context Menu actions. The existing style item multi-select logic didn't account for colorway units, causing incorrect selection range calculations. A missing tooltip exception also caused abnormal tooltip display on some items.
- **Solve**: Passed colorway mode state to the Context Menu logic to recalculate selection ranges in colorway units. Added `isColorwayMode` branching to tooltip display conditions.
- **Result**: Multi-select + Context Menu working correctly in colorway mode; tooltip display fixed

### Colorway Workflow Inline Editing Integration (2023.08–2023.09)
- **Problem**: The workflow status editing feature from Line Sheet needed to be available on the content detail page as well. `ColorwayInfoItem.tsx` needed an inline dropdown UX to edit workflow status and immediately sync with the server. There was also a list retrieval bug from a `getRangePlanSelection` API parameter mismatch.
- **Solve**: Developed new `ColorwayItemTextField.tsx` (colorway name inline editing). Added a Select dropdown UI to `ColorwayInfoItem.tsx`. Integrated with the status change API via `useLineSheetColorwayStatusMutation.tsx` hook. Fixed the API parameter bug.
- **Result**: Colorway workflow inline editing available on the content detail page; API error resolved

## Retrospective / Lessons Learned

The hardest part was "presenting the same data in different ways." Style item view and colorway view use the same API data but are represented entirely differently. This made me think carefully about where to transform data — the API layer, the store, or the component. I chose component-level transformation, which had the advantage of enabling instant switching without API re-calls, but at the cost of increased component complexity. In similar situations going forward, I'd also consider handling data transformation at the query layer via React Query's `select` option.
