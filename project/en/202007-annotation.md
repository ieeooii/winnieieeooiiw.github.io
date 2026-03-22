---
thumbnail: /images/projects/202007-annotation.webp
gradient: linear-gradient(135deg, #d4e8ec, #a8cdd2)
---

# Viewer Position-Based Comment & Thread Collaboration Feature

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion.js, Jest, Enzyme |
| Period | 2020.05 ~ 2020.07 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend in charge) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

Developed two types of comment systems simultaneously as collaboration features. Annotation is a system where users pin comments to specific positions on the 3D viewer canvas, while Comment is a general thread-based system on content pages. Both systems support text + image attachments, @mentions, and replies. The editor and mention components were shared as common modules, with each system composing them as needed.

<div class="img-row-2">

![Annotation button](/images/projects/202005-comment-annotation-button.webp)
![Annotation copy modal](/images/projects/202005-comment-annotation-modal.webp)
![Annotation copying in progress](/images/projects/202005-comment-annotation-copying.webp)
![Annotation copy complete](/images/projects/202005-comment-annotation-copied.webp)

</div>

## Key Implementations

### Annotation Pin Coordinate Normalization — 3-Step Coordinate Transformation

- **Problem**: The 3D viewer's rendering area changes dynamically based on container size and image scale. Saving raw mouse click coordinates would cause pin positions to shift when viewport size changes, and pins wouldn't point to the same location on other users' screens.
- **Solve**: Designed a three-step coordinate transformation structure. (1) Convert mouse event client coordinates to canvas-relative coordinates by subtracting the viewer container offset. (2) Track viewport scale offset as a MobX observable to reactively respond to viewport size changes. (3) Divide canvas coordinates by scale to convert to normalized Model Space coordinates before saving to the server. During rendering, the reverse transformation calculates screen coordinates for the current viewport. The coordinate transformation functions were passed through the component tree via props, managing transformation logic from a single point.
- **Result**: Pins always point to the same 3D garment position regardless of viewport size or scale changes. No pin position inconsistencies between users.

### Annotation Cross-Version Copy — MobX Nested Observables

- **Problem**: A feature was needed to copy annotations from a previous version to a specific version. The copy modal required reactive management of checkbox states for version-specific annotation lists, but MobX doesn't observe nested field changes within array objects by default, causing checkbox state changes not to reflect in the UI.
- **Solve**: Explicitly wrapped the annotation arrays within each version entry with `observable()` to create nested observable arrays. Declared derived state using `@computed` to filter only selected items, so derived state automatically updates on selection changes. Assigned sequence numbers to selected items and renumbered the entire selection list on each select/deselect to maintain display order consistency. Wrote behavior-driven tests with Enzyme to verify the copy flow. After copy completion, newly created pins were visually highlighted with a flash effect.
- **Result**: Checkbox state and selection order synchronized in real-time. Target pin positions immediately visually confirmable upon copy completion.

### Pin Drag and Undo/Redo Integration

- **Problem**: When users drag pins to change positions and want to undo mistakes, pre- and post-drag coordinates needed to be managed as history. Pin creation and drag movement had to be managed together in the same undo/redo stack.
- **Solve**: Designed the undo/redo history as functional callback pairs (`undo: () => void`, `redo: () => void`) stored in a history stack. At drag end, the pre-move and post-move coordinates are captured in closures to restore the previous position on undo and the new position on redo. Pin creation was integrated using the same interface.
- **Result**: Pin creation and drag movement can be consistently undone/redone within a single history stack.

### Image Drag & Drop and Keyboard Shortcuts

- **Problem**: A UX requirement to attach images by dragging them directly into the editor area. A `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows) shortcut for submitting comments was also needed. Since Enter needed to serve as both line break and submit within the editor, modifier key combinations had to be precisely distinguished.
- **Solve**: Separated drag-and-drop handling into a dedicated component that processes `dragover` / `drop` events, checking dropped file MIME types to block non-`image/*` files. Implemented a keyboard handler that detects `metaKey` for Mac and `ctrlKey` for Windows/Linux via OS detection (`navigator.userAgent`) to precisely separate Enter and submit. Clipboard paste was also connected to the same file processing pipeline.
- **Result**: Image drag-and-drop attachment supported; platform-specific keyboard shortcut submission enabled.

### Mention (@mention) Dropdown Position Calculation Bug Fix

- **Problem**: When the mention list was activated in an editor positioned at the bottom of the screen, the dropdown would extend below the viewport and get clipped. The library always fixed the dropdown display direction downward regardless of editor position. Additionally, already-mentioned members would reappear in the dropdown candidate list.
- **Solve**: Calculated the current position using the editor component's `getBoundingClientRect()`, compared the remaining space to the viewport bottom with the dropdown height, and added dynamic switching logic to display the dropdown upward when space was insufficient. The mention candidate list was filtered by analyzing the Quill editor's current Delta content to prevent duplicate mentions.
- **Result**: Mention dropdown displays correctly at any screen position without clipping. Already-mentioned members are excluded from the candidate list.

### Two-Level Comment Hierarchy Event Handling

- **Problem**: Annotation Comments have a two-level hierarchy of Thread and Reply, where ESC (cancel) / Enter (submit) keyboard events must work independently at each level. Pressing ESC while typing a reply should only close the reply input without affecting the parent Thread, but events were bubbling up to the parent component, closing the parent Thread as well.
- **Solve**: Separated the hierarchy into Thread level and Reply level, calling `event.stopPropagation()` in the Reply level's keyboard handler to block bubbling to the Thread level. Each level's open/close state was managed as independent local state. Hover flickering caused by the pointer briefly leaving the gap between pin and tooltip was resolved by deferring the leave of the previously hovered object until the next entry point.
- **Result**: Independent keyboard interaction at each level of the two-level comment hierarchy. ESC events do not unintentionally propagate between levels. No hover flickering.

## Retrospective / Lessons Learned

The editor component is an area with rich UX requirements and abundant edge cases. In particular, this project helped me clearly understand that "event delegation and `stopPropagation` work in opposite directions." Event delegation leverages bubbling while `stopPropagation` breaks it, so when using both patterns together, you must determine at the component hierarchy design stage which level should break the chain.
