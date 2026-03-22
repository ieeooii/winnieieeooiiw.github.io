---
thumbnail: /images/projects/202007-closet-upload-form.webp
gradient: linear-gradient(135deg, #e0e7ff, #c7d2fe)
---

# Marketplace Product Listing Feature Development (deprecated)

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, SCSS |
| Period | 2020.07 – 2021.03 (deprecated) |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

A feature for CLO-SET users to upload and list 3D clothing content for sale across two channels: the CLO marketplace (CLOSET) or the MD-exclusive store (MD_STORE). Deprecated in March 2021 when CONNECT, an open market store, launched.

Structured as a **2-step modal flow**, with Step 1 for basic info (title, code, description, tags, thumbnail, additional images) and Step 2 for category, clothing style, and pricing information.

<div class="img-row-2">

![Marketplace listing](/images/projects/202007-closet-marketplace.webp)
![Product listing form](/images/projects/202007-closet-upload-form.webp)

</div>

## Key Implementations

### Computed-Based Step Transition with Auto-Reflecting Progress Button Activation

- **Problem**: Marketplace uploads have many input fields, creating high cognitive load if displayed all at once on a single screen. The steps needed to be separated, but data sharing between steps and validation for each step had to be handled consistently.
- **Solve**: Managed the current step in the upload store via an enum. Declared each step's completion condition as a MobX computed property, deriving per-step validation from the store. Changing only the step value on transition causes the modal component to automatically switch to that step's UI.
- **Result**: Per-step validation managed declaratively; progress button activation automatically determined by computed values.

### Channel-Specific API Branching Encapsulated in Store

- **Problem**: The CLOSET market and MD_STORE channels each used different category APIs and upload endpoints. Branching by market type was required, and the category hierarchy also differed per channel.
- **Solve**: Branched category fetch API calls based on market type enum. Encapsulated upload form data construction and API call into a single store action so that market type branching logic is not exposed in components.
- **Result**: Components call only a single store action regardless of market type; market type branching is handled internally in the store.

### File Attachment Store Separation to Remove Form State Coupling

- **Problem**: Thumbnail images and additional product images have different lifecycles from the upload flow. Thumbnails are uploaded immediately with preview in Step 1, while product images support reordering in Step 2. Mixing this file state in the main store increases complexity.
- **Solve**: Separated file attachment state (thumbnail, image list, upload progress, reorder logic) into a dedicated store. The main store handles form data, step, and upload state, and references the attachment store to integrate file data at final submission.
- **Result**: Structure enables independent testing and modification of file attachment logic.

### Real-Time Computation of Mutually Dependent Original Price, Sales Price, and Discount Rate via Observable

- **Problem**: Three values — original price, sales price, and discount percentage — are mutually dependent. A UX was needed where entering a discount automatically calculates the sales price, and directly entering a sales price back-calculates the discount.
- **Solve**: Managed the three values as MobX observables, with each input handler immediately updating the related values. Included validation for abnormal inputs (e.g., sales price > original price) in the submission condition computed to block submission entirely.
- **Result**: Mutual calculation of the three values is automatically derived in the store; abnormal inputs automatically disable the submit button.

### Conditional UI Design Based on Review Status Enum + Computed

- **Problem**: Context menu options and guidance messages needed to differ based on marketplace upload status (pending review, approved, rejected, withdrawn, etc.).
- **Solve**: Defined upload status (pending, approved, rejected, withdrawn, etc.) as an enum. Context menu visibility and guidance messages are derived as store computed values. After withdrawal completes, upload info is immediately cleared to synchronize UI state.
- **Result**: Status-based UI branching centralized in store computeds, eliminating conditional branching in components.

## Retrospective / Lessons Learned

This feature was effectively deprecated when removed from the context menu in March 2021. The store-level encapsulation of the 2-step flow and market type branching itself worked well during development, but ultimately the service direction changed and the feature was withdrawn. Through the experience of **removing UI components and the store while retaining the API layer when a feature is deprecated**, I learned that evaluating dependency scope by layer is important when deleting features.
