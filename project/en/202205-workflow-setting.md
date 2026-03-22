---
thumbnail: /images/projects/202008-content-filter-workflow.png
gradient: linear-gradient(135deg, #e8eaf0, #c8ccd8)
---

# Brand Admin Settings — Workflow & Season Planning Configuration

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query, Emotion.js |
| Period | 2022.04 – 2022.05 |
| Team | Frontend (sole owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

An Admin settings page where fashion brand managers can create, edit, delete, and reorder the workflow statuses (Draft / In Review / Approved, etc.), Range Plans (season/line collection planning units like SS24 / FW24), and customer types for their Line Sheet. Recognizing that Workflow and Range Plan settings were structurally nearly identical, I first designed a shared draggable Setting component layer and had each domain build on top of it.

## Key Implementations

### Reusable Drag-and-Drop Setting Component
- **Problem**: Building a sortable list UI from scratch for each settings domain would cause code duplication and require repeated implementation each time a similar settings pattern was added. `react-beautiful-dnd` was mainstream at the time but had compatibility issues with React Strict Mode, and integration with the design system's drag handle icon was also needed.
- **Solve**: Designed a full list container and individual item as independent components. Each domain component only injects data into this layer. Added a drag handle icon to the design system for consistent interaction.
- **Result**: Same component reused across Workflow / Range Plan / Customer Type settings (3 places). New settings domains can reuse the layout component.

### Settings Page Tab Switch Speed: 2000ms → 250ms

- **Problem**: Each settings tab switch triggered a full SSR request, causing tab navigation to take over 2000ms.
- **Solve**: Converted data GET APIs from SSR to CSR with caching. Applied Shallow Route on tab (URL path) transitions to avoid full page remount. Applied dynamic import per tab component to drastically reduce initial bundle download size. Implemented lazy loading with Intersection Observer API.
- **Result**: Tab switch speed improved from 2000ms to 250ms / Initial download size reduced by 1GB and speed improved by 200%

### Input Validation Edge Case Handling
- **Problem**: ① Missing validation on empty input allowed empty items to be saved to the server. ② Canceling after editing didn't reset the input component's state, leaving previous content visible when reopening. ③ Invalid date formats were being sent to the server from the Range Plan date input.
- **Solve**: ① Added empty value validation. ② Added input state reset logic to the cancel button event. ③ Implemented date validation and applied it to the input field.
- **Result**: Invalid data transmission to server blocked; UI state properly reset after canceling edits

## Retrospective / Lessons Learned

Admin settings pages carry the misconception of being technically simple, but in practice there were more edge cases than expected — input validation, state resets, order change API synchronization, etc. Designing the shared component first meant that when Customer Type settings were added, the layout code was almost entirely reusable. This project reinforced the lesson: when you see a repeating pattern, abstract it before the third usage site appears.
