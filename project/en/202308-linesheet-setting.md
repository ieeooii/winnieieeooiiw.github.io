---
thumbnail: /images/projects/202408-linesheet-setting-status.png
gradient: linear-gradient(135deg, #e8eaf0, #c8ccd8)
---

# Line Sheet Settings — Master Data Management

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion |
| Period | 2023.07 – 2023.08 |
| Service Link | style.clo-set.com |

## Overview

A settings page where fashion brand administrators register, edit, delete, and reorder 4 types of master data (Status / Customer Type / Sales Channel / Store Type) used in Line Sheets. Although all 4 types share the same structure, each has independent APIs and state. Designed a **`SegmentControl`-based tab switching + `next/dynamic` lazy loading + shared store sub-module** pattern to manage all 4 domains without code duplication.

<div class="img-row-2">

![Line Sheet Settings — Status](/images/projects/202408-linesheet-setting-status.png)
![Line Sheet Settings — Customer Type](/images/projects/202408-linesheet-setting-customer-type.png)
![Line Sheet Settings — Sales Channel](/images/projects/202408-linesheet-setting-sales-channel.png)
![Line Sheet Settings — Store Type](/images/projects/202408-linesheet-setting-store-type.png)
![Line Sheet Settings — Colorway](/images/projects/202408-linesheet-setting-colorway.png)

</div>

## Key Implementations

### SegmentControl + next/dynamic Lazy Loading Structure

- **Problem**: The 4 setting types (Status / Customer Type / Sales Channel / Store Type) have nearly identical UI and behavior, but each uses different API endpoints and store sub-modules. Statically importing all 4 at once would include unnecessary code in the initial bundle and initialize data for tabs the user hasn't accessed.
- **Solve**: Dynamically imported each tab component (`StatusSetting`, `CustomerTypeSetting`, `SalesChannelSetting`, `StoreTypeSetting`) via `next/dynamic`. Only the relevant chunk loads at tab switch time. Tab configuration declared as a `segments` array — each item includes `value`, `label`, `setInitData` (initialization function), and `component` (dynamic component). `SettingCircleSpinner` calls `setInitData` based on `deps` (tab switch timing), automatically initializing the corresponding domain data on tab switch.
- **Result**: Only the currently selected tab's code and data are loaded; initial bundle size optimized.

### Shared Drag and Drop Setting Component Reuse

- Reused the `SettingDraggableLayout` / `SettingDraggableItem` common components — built for Workflow / Range Plan settings — across all 4 types.
- Each domain component (StatusSetting, etc.) only needs to inject data and CRUD handlers; the common component handles drag and drop logic, item rendering, and order change API integration.
- New setting types can immediately reuse the common layout component when added.

### MobX Sub-Store Modularization (rangePlan)

- **Problem**: If state for all 4 types (list, selected item, loading, CRUD actions) is mixed in a single store, different types' state gets entangled and hard to track, with the risk that the previous tab's state could affect the next tab on switching.
- **Solve**: Designed 4 independent sub-modules under the `rangePlan` store: `status`, `customerType`, `salesChannel`, `storeType`. Each sub-module owns only its own `initList`, `addItem`, `updateItem`, `deleteItem`, and `changeOrder` actions. The `LineSheetSetting` component calls the appropriate sub-module's `setInitData` based on `selectedSegment`.
- **Result**: State isolation between tabs; each domain's CRUD logic managed independently.

## Retrospective / Lessons Learned

The fact that all 4 types share the same structure naturally led to "building the common component first and having each domain layer on top." When the structure was complete — where a single `segments` array declaration connects the SegmentControl UI, dynamic component loading, and tab-switch data initialization — I got a real feel for the **advantages of data-driven design**. Adding a new type works simply by adding one item to the array.
