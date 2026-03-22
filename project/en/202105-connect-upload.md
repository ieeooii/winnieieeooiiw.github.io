---
thumbnail: /images/projects/202011-connect-upload-step0.webp
gradient: linear-gradient(135deg, #c8d8f8, #a0b8f0)
---

# Open Market Launch — Product Registration Feature

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | E-Commerce |
| Service | CONNECT |
| Tech Stack | Next.js, TypeScript, Redux (Toolkit + Saga), Emotion.js, Jest, React Testing Library |
| Period | 2020.11 ~ 2021.05 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend in charge) |
| Service Link | [connect.clo-set.com/ko/upload](https://connect.clo-set.com/ko/upload) |
| Blog | [Emotion.js](https://ieeooii.notion.site/Emotion-js-361f27a6ae014131b770b8341b46cbde?pvs=143) |

## Overview

Fully designed and developed the new upload page for CONNECT, a global digital garment community service for 3D garment sharing, communication, selling, and purchasing. Designed as a multi-step structure: Basic Info → File Attachment → Category → Price Settings → Market Info. The same components were later reused for the Edit page.

<div class="img-row-2">

![Upload Step 0](/images/projects/202011-connect-upload-step0.webp)
![Upload Step 1](/images/projects/202011-connect-upload-step1.webp)
![Upload Step 2](/images/projects/202011-connect-upload-step2.webp)
![Upload Step 2 price settings](/images/projects/202011-connect-upload-step2-price.webp)
![Upload edit mode](/images/projects/202011-connect-upload-edit-mode.webp)

</div>

## Key Implementations

### View-Business Logic Separation with Presentational/Container Pattern and Redux Slice

- **Problem**: Complex input elements such as drag-and-drop, rich text editor, file attachment, and price settings coexist within a multi-step form, causing view code and business logic to become entangled and making modification scope unpredictable. The SCSS module approach also increased style maintenance costs as files grew.
- **Solve**: Separated view and business logic using the Presentational/Container pattern. Managed each step's state independently with domain-specific Redux Slices, maintaining unidirectional data flow via the Flux pattern. State synchronization in the Next.js SSR environment was handled via `HYDRATE` action. Adopted CSS-in-JS (Emotion.js) to manage styles and components in the same file.
- **Result**: Clear modification scope for each area through view-logic separation; established Emotion.js-based style management system.

### Independent Multi-Step Form State Management with Redux Saga

- **Problem**: Complex input flows including drag-and-drop file attachment, rich text editor, and price settings needed to be stably managed within a multi-step structure.
- **Solve**: Managed each step's state independently using Redux Slice + Saga. Customized the rich text editor with character limit and onBlur error state handling, and shared file type validation utility functions across multiple upload areas.
- **Result**: Completed the entire new upload flow. Same components reused for the Edit page.

### Client-Side Pre-Validation to Block Invalid 3D File Server Transmission

- **Problem**: 3D garment files are proprietary binary formats. Without client-side pre-validation at file selection for format issues, version compatibility, and duplicate registration, invalid files would be transmitted to the server, incurring unnecessary API costs and user wait time.
- **Solve**: Directly parsed file binaries to extract internal metadata (material structure, avatar compatibility, creation date, etc.). On parse failure (old version files, corrupted files), immediately stopped via Saga `cancel` effect to block subsequent API requests. Differentiated duplicate registration validation by file type — garment files allow re-registration of the same file while other types enforce duplicate checks. Avatar files auto-set category initial values by looking up a predefined preset map based on parsed identifiers. On file replacement in edit mode, distinguished change-not-allowed vs. extension mismatch by server response code to show different error messages. Separated FormData construction for new registration and edit mode, optimizing to send only newly added files during edits.
- **Result**: Invalid file server transmission blocked; avatar category auto-setting reduces user input steps; unnecessary file re-transmission prevented during edits.

### Category Selection State Management via Type-Specific Selection Rule Mapping

- **Problem**: Categories are divided into 5 types — Garment, Fabric, Trim, Avatar, Scene — each with different maximum selection counts, mutual exclusion rules, and submission inclusion rules, making it difficult to design consistent processing logic.
- **Solve**: Managed type-specific selection limits uniformly via a selection upper-bound map keyed by category type. Garment's Single/Outfits mutual exclusion was implemented in the reducer. Avatar's Motion/Pose intermediate nodes are used only for UI display and excluded from submission values via a derived state separated as a selector. Added defensive logic to remove duplicate IDs before FormData assembly.
- **Result**: Type-specific selection rules managed declaratively via map; submission logic and UI logic separated.

### Behavior-Driven Testing with RTL for Upload Flow Regression Prevention

- **Problem**: As upload is a core service feature, the entire flow including file attachment, drag-and-drop, category changes, and price options needed verification, but there was zero test code, creating high regression bug risk.
- **Solve**: Wrote approximately 80 tests with Jest + React Testing Library, incrementally covering component-level and flow scenarios. Organized queries based on `data-testid` and unified to the latest RTL patterns using the `screen` API.
- **Result**: Behavior-driven test code written; achieved 70% test coverage.

## Retrospective / Lessons Learned

Identifying reuse scope before component development and designing shared components was effective in reducing subsequent maintenance costs. Sharing UI atomic components such as layout, tags, text input, and toast across the entire form to apply consistent styles was also a key part of this project.

There are also regrets regarding the category data structure. At the time, working directly with tree-structured data from the server caused performance issues from nested traversal. In retrospect, designing with a flat array from the beginning would have been better. Looking back, implementing a flat → tree conversion with a `Map` for O(1) `id → node` lookup could have processed everything in O(n) instead of O(n²) nested traversal.

Tests were written in a way that depended on implementation details, causing them to break with every refactoring. I later realized that RTL's core principle is user-behavior-based verification, and tests should have been designed based on user-perspective interactions rather than internal implementation.
