# 3D Viewer Pin Annotation & Thread Comment Collaboration

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion.js, Jest, Enzyme |
| Period | 2023.12 – 2024.02 |
| Team | Frontend (sole owner) |
| Service Link | style.clo-set.com |

## Overview

Developed two comment systems simultaneously as collaboration features. Annotation pins are placed on the 3D viewer canvas to attach comments to specific positions, while Comment is a general thread system on content pages. Both systems support text + image attachments, @mentions, and nested replies. The editor (`CommentEditor.tsx`) and mention components are shared, with each system composing them as needed.

## Key Implementations

### Copy 3D Annotations from One Version to Another
- Collaborated with graphics and backend engineers on CRUD design for the feature
- Wrote behavior-driven tests with Enzyme
- **Problem**: Deep state references were not being observed, and there were duplicate state conflicts caused by conditionally separated states
- **Solve**: Applied MobX Observer pattern — reassigned observable state references within `@observable` state and used `@computed` decorators to expose only the necessary state, ensuring `@observable` dependencies of `@computed` are properly triggered on update

### CommentEditor Image Drag & Drop and Keyboard Shortcuts
- **Problem**: The UX required dragging images directly into the editor to attach them. `Cmd+Enter` (Mac) / `Ctrl+Enter` (Windows) shortcuts to submit comments were also needed. Since Enter had dual roles (newline vs. submit) inside the editor, modifier key combinations had to be precisely distinguished.
- **Solve**: Separated `CommentEditorDragAndDrop.tsx` as a standalone component handling `dragover` / `drop` events, blocking non-`image/*` files by checking MIME type. Implemented `onKeydownToEditor` handler detecting `metaKey` for Mac and `ctrlKey` for Windows/Linux via `navigator.platform`, cleanly separating Enter from submit.
- **Result**: Image drag-and-drop attachment enabled; platform-specific keyboard shortcut submission supported

### Mention (@mention) Dropdown Position Bug Fix
- **Problem**: When a mention list was activated in an editor near the bottom of the screen, the dropdown was clipped below the viewport. The library always positioned the dropdown downward regardless of editor position.
- **Solve**: Calculated the current editor position using `getBoundingClientRect()`, compared the remaining space to the bottom of the viewport against the dropdown height, and added dynamic switching logic to display the dropdown upward when there is insufficient space below.
- **Result**: Mention dropdown always fully visible regardless of screen position

### Annotation Comment Two-Level Hierarchy Event Handling
- **Problem**: Annotation Comments have a two-level hierarchy of Thread and Reply. ESC (cancel) and Enter (submit) keyboard events needed to operate independently at each level. Pressing ESC while writing a reply should close only the reply input, not the parent Thread — but events were bubbling up to the parent, closing both.
- **Solve**: Separated into `AnnotationCommentReplyItem.tsx` (Thread level) and `AnnotationCommentChildItem.tsx` (Reply level). Added `event.stopPropagation()` in the Reply-level keyboard handler to prevent bubbling to the Thread level. Managed open/close state independently at each level with local state.
- **Result**: Independent keyboard interactions at both comment hierarchy levels; ESC events no longer unintentionally propagate across levels

## Retrospective

Editor components have abundant UX requirements and edge cases. This work gave me a clear understanding that "event delegation and `stopPropagation` work in opposite directions" — delegation leverages bubbling while `stopPropagation` breaks it. When using both patterns together, which level should break the chain must be decided during component hierarchy design.
