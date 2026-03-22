---
thumbnail: /images/projects/202011-connect-upload-step0.png
gradient: linear-gradient(135deg, #c8d8f8, #a0b8f0)
---

# Open Market Launch — Product Listing Feature

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | E-Commerce |
| Service | CONNECT |
| Tech Stack | Next.js, TypeScript, Redux (Toolkit + Saga), Emotion.js, Jest, React Testing Library |
| Period | 2020.11 – 2021.05 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend owner) |
| Service Link | https://connect.clo-set.com/ko/upload |
| Blog | [Emotion.js](https://ieeooii.notion.site/Emotion-js-361f27a6ae014131b770b8341b46cbde?pvs=143) |

## Overview

Fully designed and developed the new upload page for CONNECT — a global digital fashion community service for sharing, communicating, selling, and buying 3D garments. Structured as a multi-step flow: basic info → file attachments → category → pricing → market info. The same components were later reused on the Edit page.

## Key Features

<div class="img-row-2">

![Upload Step 0](/images/projects/202011-connect-upload-step0.png)
![Upload Step 1](/images/projects/202011-connect-upload-step1.png)
![Upload Step 2](/images/projects/202011-connect-upload-step2.png)
![Upload Step 2 Pricing](/images/projects/202011-connect-upload-step2-price.png)
![Upload Edit Mode](/images/projects/202011-connect-upload-edit-mode.png)

</div>

## Key Implementations

### Project Architecture Decisions
- Adopted Presentational and Container Pattern to separate view from business logic
- Introduced Redux and Redux-toolkit with Flux Pattern for consistent structure
- Introduced CSS-in-JS with Emotion.js
  - SCSS module CSS creates maintenance overhead from managing many separate CSS files — led internal discussion and company study (presentation) on CSS-in-JS adoption
  - Delivered an internal tech talk to justify Emotion.js adoption [Link](https://ieeooii.notion.site/Emotion-js-361f27a6ae014131b770b8341b46cbde?source=copy_link)

### Upload Form UI and Functionality
- **Problem**: Complex state flows involving drag-and-drop file attachments, a Quill-based rich text editor, and pricing settings needed to be handled reliably. Categories came from the server as a flat array but needed to be rendered as a tree structure. The nested loop-based conversion logic caused browser freezes as data grew.
- **Solve**: Managed per-step state with Redux Slice + Saga, and shared file type validation logic via `isAcceptFile`/`getFilterAcceptsFiles` utilities. Customized the Quill editor with character limits and onBlur error state handling. Partially improved the category conversion logic by refactoring from `reduce` to `map`/`filter` combinations.
- **Result**: Full new upload flow completed. Same components later reused on the Edit page.
- **Insight**: At the time, I lacked the skill to solve this fundamentally and asked the BE to restructure the data. In retrospect, a `new Map` for O(1) `id → node` lookup would have enabled O(n) flat-to-tree conversion instead of O(n²) nested traversal.

### Upload Page Test Coverage (~80 tests)
- **Problem**: As a core service feature, the full upload flow — file attachment, drag-and-drop, category changes, pricing options — needed verification, but there were zero tests, making regression risk high.
- **Solve**: Wrote ~80 test files with Jest + React Testing Library covering component units and full flow scenarios step by step. Replaced `title` attributes with `data-testid`, and migrated from `wrapper.rerender` → `rerender` and `wrapper` → `screen` to align with modern RTL patterns.
- **Result**: Introduced behavior-driven tests with react-testing-library; achieved ~70% test coverage
- **Insight**: Tests were written depending on implementation details and kept breaking on every refactor. I later realized RTL's core is user behavior-based verification, and tests should be designed from the user's interaction perspective, not the internal implementation.

## Retrospective / Lessons Learned

Identifying the reuse scope before building components and designing them as shared components was effective in reducing later maintenance costs. Shared UI atom components like `BackgroundLayout`, `Tag`, `EditableTextArea`, and `ToastsBox` applied consistent styles across the entire form — this was a key outcome of this project.

I also have lingering regrets about the category data structure. Dealing with the server's tree-structured response as-is led to performance issues from nested traversal. In hindsight, designing the data as a flat array with only a `depth` field would have been better. Even when the UI needs to look like a tree, keeping the underlying data flat and using `depth` to represent indentation level would have offered meaningful performance benefits for both rendering and state management.
