---
thumbnail: /images/projects/202007-direct-upload.webp
gradient: linear-gradient(135deg, #d8d9dd, #b5b8c4)
---

# Graphic Software → Platform Direct File Upload Feature React Migration

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, React.js, TypeScript, MobX, Emotion.js, SCSS, jQuery, Jest, Enzyme |
| Period | 2020.07 ~ 2020.11 |
| Team | Frontend 1, Graphics Engineer 1, Backend 1, Product Designer 1 (Frontend in charge) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

A feature for directly uploading 3D garment files (`.zprj`, `.zpac`, etc.) created in CLO software to CLOSET. The multi-step flow consists of file selection → style item mapping → assembly grouping → rendering settings, processing multiple 3D files at once where users directly map which style item each file belongs to. Includes parallel file uploads with real-time progress display, client-side pre-validation of file type, size, resolution, and filename, and global drag-and-drop support.

<div class="img-row-2">

![Direct upload from CLO 3D software](/images/projects/202007-direct-upload-clo3d-sw.webp)
![Direct Upload main](/images/projects/202007-direct-upload.webp)
![File browse modal](/images/projects/202007-direct-upload-browse-modal.webp)
![Recent files modal](/images/projects/202007-direct-upload-recent-modal.webp)
![Upload dropdown](/images/projects/202005-upload-dropdown.webp)
![Upload modal](/images/projects/202005-upload-modal.webp)

</div>

## Key Implementations

### FormData-Based File Transfer Pipeline with Metadata

- **Problem**: To process raw 3D data exported from CLO/MD software on the web platform, a new file transfer specification between client and server needed to be defined. The software's file formats and the platform's content data model differed, requiring joint design of metadata mapping, file type classification, and rendering option transfer methods with the backend.
- **Solve**: Co-designed the file transfer specification and API interface with backend engineers. Constructed a pipeline where the client sends files along with metadata (style number, rendering options, group information) via FormData, and the server processes them into platform content.
- **Result**: Completed an end-to-end upload pipeline connecting CLO/MD software work directly to the platform.

### jQuery → React.js Migration

- **Problem**: The direct upload page was implemented in jQuery, with imperative DOM manipulation spread throughout the code. State management implicitly depended on DOM state, making side effects unpredictable when adding features. React-based shared components, MobX state management, and TypeScript type safety couldn't be applied.
- **Solve**: Rewrote the entire page as React.js component structure. Transitioned state management to MobX and replaced existing jQuery DOM manipulation logic with declarative React patterns.
- **Result**: Established foundation for React shared components, MobX, and TypeScript application; transitioned to a predictable structure for subsequent feature additions and refactoring.

### State Machine Pattern to Minimize Multi-Step Flow Branching

- **Problem**: Each step allows different branches (3D upload / turntable upload / empty item creation), and managing the current step with multiple boolean flags would cause combinatorial explosion. It was also unclear when and to what extent previous step state should be reset during step transitions.
- **Solve**: Applied a state machine pattern with the current step managed as a single observable and components to render per step declared as an object map. Invalid step transitions are blocked within store actions.
- **Result**: Step transition logic consolidated into a single state value minimizing branching; user settings preserved to reduce repetitive work burden.

### Per-File Map Identifier + Computed for Accurate Concurrent Upload Progress Tracking

- **Problem**: When uploading multiple files simultaneously, overall progress must be accurately displayed. Simply accumulating total bytes in a single counter would cause progress to jump or aggregate inaccurately as upload events from different files intermingle.
- **Solve**: Assigned unique identifiers to each file and recorded current transferred bytes in a Map keyed by identifier when receiving upload progress events. Overall progress is automatically derived via `@computed` by summing the Map values. Axios's `onUploadProgress` callback receives individual progress events per file to update the Map.
- **Result**: File-level progress tracked independently, displaying accurate overall progress even during concurrent uploads.

### Client-Side Pre-Validation Including Binary Header Parsing

- **Problem**: Allowed file types are diverse — 3D files, images, videos, documents — each with different size limits (general max 1GB, video 200MB, GIF 20MB). File extensions alone cannot guarantee actual file format (especially animated GIF/WebP), and image resolution exceedance and filename special characters also needed to be blocked before server processing.
- **Solve**: Performed filename special character checks, type-specific size limit comparisons, and image resolution validation on the client before upload. Animation detection was done by directly reading file binary headers. Failed checks classify the file with its error type and display specific guidance to the user.
- **Result**: Invalid files blocked on the client before server transmission; clear guidance provided by error cause.

### Group-Level Selection State Ownership Separation to Fix State Contamination Bug

- **Problem**: A single component managed selected file list, assembly grouping structure, selection state reset on group switch, and auto-numbering counter all together. Intertwined state dependencies caused repeated bugs where switching groups contaminated other groups' selection states.
- **Solve**: Migrated to TypeScript and separated state by role. Extracted assembly grouping logic into a separate module and clearly limited the scope so only the relevant group's selection state resets on group switch. Added "Keep current thumbnail" checkbox and auto-numbering tooltip. Rendering settings are saved to localStorage for restoration on revisit.
- **Result**: Resolved state contamination bugs on group switch; responsibility separation per state enables predictable modification scope for future feature additions.

### Behavior-Driven Testing for Multi-Step Interaction Scenarios with Enzyme

- **Problem**: No automated means to verify that various interaction scenarios — step transitions, file selection, error occurrence, group switching — work as expected in the multi-step flow. As state combinations grow complex, manual testing alone cannot prevent regressions.
- **Solve**: Wrote behavior-driven test code with Enzyme for user interaction scenarios. Composed test cases that automatically verify key behaviors such as step transitions, error states, and selection state reset after group switching.
- **Result**: Automated testing coverage for key interaction scenarios; regression prevention during subsequent refactoring.

### Emotion.js Migration for Design Token Integration and Accessibility Improvement (2023.04)

- **Problem**: Upload components were styled with SCSS modules, making design system token application impossible. Conditional styling was handled through `className` string concatenation, making it harder to track as conditions increased. A content name input label also pointed to the wrong element, causing an accessibility bug.
- **Solve**: Migrated entirely to Emotion.js. Conditional styles are handled with `css` prop and template literals so conditions are clearly identifiable. Fixed the label `htmlFor` attribute to resolve the accessibility bug.
- **Result**: Design system token application enabled, easier style condition tracking, accessibility improved.

## Retrospective

Direct Upload was the junction between CLO software and the CLOSET web service, so it was frequently affected by file format changes and rendering spec updates. The biggest lesson was that state "ownership" must be clearly defined. When multiple states coexist in a single component, changing one can cause unintended side effects on others. After this experience, I developed a habit of first designing "who owns this state and when should it be reset."
