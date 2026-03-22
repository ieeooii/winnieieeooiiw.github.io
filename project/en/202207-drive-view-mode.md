---
thumbnail: /images/projects/202207-drive-view-mode-colorway.webp
gradient: linear-gradient(135deg, #e8f0e8, #c8d8c8)
---

# Colorway View Mode Feature Development

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query, MobX, Emotion.js |
| Period | 2022.05 ~ 2022.07 |
| Team | Frontend 1, Backend 1, Product Designer 1, PM 1 (Frontend in charge) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

<div class="img-row-2">

![Colorway view mode](/images/projects/202207-drive-view-mode-colorway.webp)
![Workroom view](/images/projects/202207-drive-view-mode-workroom.webp)

</div>

A feature for managing color variations (Colorway — color-specific versions of the same design) of 3D garment items. The 1:N relationship between one style item and N colorways was consistently expressed through View Mode switching on the content list page, Line Sheet (seasonal product catalog) row spanning, and colorway-level workflow status inline editing.

## Key Implementations

### Client-Side Data Recombination Switching and Cookie State Restoration
- **Problem**: The content page only supported style item-level viewing, making it difficult for fashion MDs to compare thumbnails of each color variation at a glance. Mode switching needed to happen instantly without page reload (to avoid duplicate content list API calls), and the mode selection state needed to persist after refresh.
- **Solve**: Implemented View Mode toggle UI. Recombined already-loaded data at the component level for colorway-level display (no API re-calls). Saved the selected mode in a Cookie for restoration after refresh or page navigation. Per-colorway checkbox selection state is independently managed within item components.
- **Result**: View Mode switching without additional API calls; mode state restored after refresh; colorway-level thumbnail comparison enabled.

### Colorway Multi-Selection and Context Menu Support
- **Problem**: In colorway mode, multiple colorways needed to be selected for bulk Context Menu actions like download and delete. The existing style item-level multi-selection logic didn't account for colorway-level selection, causing incorrect selection range calculations. Missing tooltip exception handling also caused abnormal tooltip display on some items.
- **Solve**: Passed colorway mode status to Context Menu logic to recalculate selection ranges at the colorway level. Added colorway mode exception handling to tooltip display conditions.
- **Result**: Multi-selection and Context Menu work correctly in colorway mode; tooltip display issues resolved.

### Colorway Workflow Status Inline Editing
- **Problem**: The ability to edit per-colorway workflow status in Line Sheets needed to be provided on the content detail page as well. An inline UX was required for editing workflow status via dropdown and immediately reflecting changes to the server. API parameter mismatches were also causing list query errors.
- **Solve**: Newly developed a colorway name inline editing component. Added workflow status Select dropdown UI. Immediately reflects changes to the server through status change mutation hooks. Fixed API parameter errors.
- **Result**: Colorway workflow inline editing possible on content detail page; API errors resolved.

## Retrospective / Lessons Learned

The hardest part was "displaying the same data in different ways." The style item view and colorway view use the same API data but have completely different representations. I had to consider where to transform the data — API layer, store, or component. I chose component-level transformation, which had the advantage of switching without API re-calls but the disadvantage of increased component complexity. For similar situations in the future, I would also consider using React Query's `select` option to handle data transformation at the query layer.
