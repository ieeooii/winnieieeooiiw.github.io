# Brand Admin Settings — Workflow & Range Plan Configuration

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query, Emotion.js |
| Period | 2022.04 – 2022.05 |
| Team | Frontend (sole owner) |
| Service Link | style.clo-set.com |

## Overview

An Admin settings page where fashion brand managers can create, edit, delete, and reorder the workflow statuses (Draft / In Review / Approved, etc.), Range Plans (season/line collection planning units like SS24 / FW24), and customer types for their Line Sheet. Recognizing that Workflow and Range Plan settings were structurally nearly identical, I first designed a shared draggable Setting component layer and had each domain build on top of it.

## Key Implementations

### Reusable Drag-and-Drop Setting Component
- **Problem**: Building a sortable list UI from scratch for each settings domain would cause code duplication and require repeated implementation each time a similar settings pattern was added. `react-beautiful-dnd` was mainstream at the time but had compatibility issues with React Strict Mode, and integration with the design system's `HandleOrderIcon` was needed.
- **Solve**: Designed `SettingDraggableLayout.tsx` (full list container) and `SettingDraggableItem.tsx` (individual item) as independent components. Each domain component (`WorkflowSettingList`, `RangePlanItemList`) only injects data into this layer. Added `HandleOrderIcon` to the design system for consistent interaction.
- **Result**: Same component reused across Workflow / Range Plan / Customer Type settings (3 places). New settings domains can reuse the layout component.

### Input Validation Edge Case Handling
- **Problem**: ① Missing validation for `None` type input (clicking add with empty input) allowed empty items to be saved to the server. ② Canceling after editing didn't reset the `SettingInputNewItem.tsx` input state, leaving previous content visible when reopening. ③ Invalid date formats were being sent to the server from the Retail Intro Date input in Range Plan.
- **Solve**: ① Added a dedicated valid check function for `None` type. ② Added `SettingInputNewItem` state reset logic to the cancel button click event. ③ Implemented a date validation function and applied it to the input field.
- **Result**: Invalid data transmission to server blocked; UI state properly reset after canceling edits

## Retrospective

Admin settings pages carry the misconception of being technically simple, but in practice there were more edge cases than expected — input validation, state resets, order change API synchronization, etc. Designing the shared component first meant that when Customer Type settings were added, the layout code was almost entirely reusable. This project reinforced the lesson: when you see a repeating pattern, abstract it before the third usage site appears.
