---
thumbnail: /images/projects/202007-closet-upload-form.png
gradient: linear-gradient(135deg, #e0e7ff, #c7d2fe)
---

# Marketplace Garment Listing Feature

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, SCSS |
| Period | 2020.07 – 2021.03 (deprecated) |
| Service Link | style.clo-set.com |

## Overview

A feature for CLO-SET users to upload and list 3D clothing content for sale across two channels:

## Key Features

<div class="img-row-2">

![Marketplace Listing](/images/projects/202007-closet-marketplace.png)
![Upload Form](/images/projects/202007-closet-upload-form.png)

</div> the CLO marketplace (CLOSET) or the MD-exclusive store (MD_STORE). Structured as a **2-step modal flow** — Step 1 captures basic information (title, code, description, tags, thumbnail, additional images), and Step 2 captures category, clothing style, and pricing information. Removed from the context menu in March 2021 and currently deprecated.

## Key Implementations

### 2-Step Modal Upload Flow

- **Problem**: Marketplace uploads have many input fields, creating high cognitive load if displayed all at once on a single screen. The steps needed to be separated, but data sharing between steps and validation for each step had to be handled consistently.
- **Solve**: Managed the current step in `UploadMarketplaceStore` via a `Step` enum (STEP1 / STEP2). Declared Step 1 completion condition (`isNextButton` computed) and Step 2 completion condition (`isConfirmButton` computed) as MobX computed properties, deriving per-step validation logic from the store. Changing only the store's `stepNumber` on step transition causes the modal component to automatically switch to that step's UI.
- **Result**: Per-step validation managed declaratively; progress button activation automatically determined by computed values.

### Dual API Handling per Market Type

- **Problem**: The CLOSET market and MD_STORE channels each used different category APIs and upload endpoints. Branching on a `MarketType` enum (CLOSET / MD_STORE) was required, and the category hierarchy also differed per channel.
- **Solve**: Branched category fetch API calls based on `MarketType` (`getMarketplaceCategory` / `getMdStoreCategory`). Encapsulated upload form data construction (`IReqUploadMarketplace`) and API call into a single `UploadMarketplaceStore` action so that market type branching logic is not exposed in components.
- **Result**: Components call only a single store action regardless of market type; market type branching is handled internally in the store.

### File Attachment Store Separation (UploadMarketplaceAttachStore)

- **Problem**: Thumbnail images and additional product images have different lifecycles from the upload flow. Thumbnails are uploaded immediately with preview in Step 1, while product images support reordering in Step 2. Mixing this file state in the main store increases complexity.
- **Solve**: Separated file attachment state (`thumbnails`, `images`, upload progress, reorder logic) into `UploadMarketplaceAttachStore`. The main store (`UploadMarketplaceStore`) handles form data, step, and upload state, and references the attachment store to integrate file data at final submission.
- **Result**: Structure enables independent testing and modification of file attachment logic.

### Automatic Price Calculation & State Management

- **Problem**: Three values — original price, sales price, and discount percentage — are mutually dependent. A UX was needed where entering a discount automatically calculates the sales price, and directly entering a sales price back-calculates the discount.
- **Solve**: Managed the three values as MobX observables, with each input handler immediately updating the related values. Included validation for abnormal inputs (e.g., sales price > original price) in the `isConfirmButton` computed to block submission entirely.

### Upload Status-Based UI Branching

- Managed marketplace upload status via a `Status` enum (PENDING / CONFIRMED / REJECTED / WITHDRAW / UPDATED / WAITING_AGAIN). Context menu visibility (`isWithdraw`, etc.) and guidance messages vary per status, derived from `item-store`.
- After withdrawal (`withdrawMarketPlace`) completes, immediately clears `marketPlaceInfo` to synchronize UI state.

## Retrospective / Lessons Learned

This feature was effectively deprecated when removed from the context menu in March 2021. The store-level encapsulation of the 2-step flow and market type branching itself worked well during development, but ultimately the service direction changed and the feature was withdrawn. This experience with **completely removing UI components and the store while retaining the API layer when a feature is deprecated** taught me that evaluating dependency scope by layer is important when deleting features.
