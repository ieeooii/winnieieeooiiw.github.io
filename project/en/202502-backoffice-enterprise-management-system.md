---
thumbnail: /images/projects/202501-backoffice-enterprise.svg
gradient: linear-gradient(135deg, #e8eaf0, #c8ccd8)
---

# Backoffice Enterprise Groups Domain Design and Construction

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | Internal Admin Tool |
| Service | CLO-SET Admin |
| Tech Stack | React 17, TypeScript 4.5, Redux, Redux-Saga, Styled Components, Axios, react-export-excel |
| Period | 2025.01 ~ 2025.02 |
| Team | Frontend 1 (in charge), Backend 1+, PM 1 |
| Service Link | Internal Admin (Private) |

## Overview

Designed and built the Groups section from scratch for unified management of CLO-SET Enterprise plan client accounts (Groups) — including account status, payment history, usage, and operational notes — in the admin panel. From group list query and search filters to group detail pages (info table, members, usage, plan history, billing history, comments), a total of 7 sub-features and 40+ new components were developed solo over approximately 1 month. Led the entire frontend process from API design coordination, component structure decisions, to deployment.

## Key Implementations — Groups List & Search Filter

### Compound Search Filter — URL State Serialization

- **Problem**: The internal operations team needed to narrow down hundreds of Enterprise groups by combinations of plan type, payment method, assigned manager, and keywords. The admin previously had no Groups list page at all, and the manager field required an autocomplete approach with dynamically changing options.
- **Solve**: Newly designed the search filter component with plan type and payment method as checkbox filters, and manager as an autocomplete input that filters candidates from an API on typing. Serialized filter conditions to `searchParams` in the URL for state persistence after refresh. Centralized filter option constants in a separate module to avoid hardcoding options in UI code.
- **Result**: 4-type compound filter (plan type, payment method, manager autocomplete, keyword); filter state shareable via URL serialization.

### Conditional Row Styling and Excel Export

- **Problem**: Short-term subscription groups approaching subscription end were difficult to visually identify in the list. The operations team needed to extract the currently displayed list as a spreadsheet for sharing, but no Excel export feature existed anywhere.
- **Solve**: Added conditional background color logic for rows with subscription end dates within a certain period. Applied exception handling to not apply styling when subscription end date is `null` or plan type is FREE. For Excel export, utilized `react-export-excel-xlsx-fix` with export-specific column definitions separated, generating `.xlsx` files based on current filter result data. Added error handling for export failures.
- **Result**: Visual identification of at-risk short-term subscription groups; immediate Excel download of current filtered results.

## Key Implementations — Group Detail Page

### Detail Page Layout and Nested Routing

- **Problem**: No detail page existed when clicking a specific group from the list. The detail page was planned to consist of multiple tabs (Overview, Billing History, etc.), requiring URL changes on tab navigation while maintaining the common layout (group name, top info).
- **Solve**: Hierarchically separated page, layout, and tab content. Added nested routes under `/groups/:groupId` in the router so tab switching is trackable via URL changes.

### Group Info Table and Manager CRUD

- **Problem**: Group basic information (plan type, payment method, member count, manager, etc.) needed to be viewed on a single screen with the ability to change managers. Manager required multi-add/delete capability, but no reusable patterns existed among existing admin components.
- **Solve**: Composed the group info table using a common info table component base, with a modal opening from the manager edit cell for adding/deleting managers via POST/DELETE APIs. Discovered a bug where the internal list state wasn't reset when closing the modal and explicitly added state initialization logic on `onClose`. Decoupled manager list data fetching into a custom hook from the UI.
- **Result**: Group info view and manager CRUD processable on a single screen.

### Billing Currency Change Modal

- **Problem**: Operational cases arose requiring billing currency changes (KRW, USD, etc.) for specific Enterprise groups, but no admin method existed for direct modification, requiring backend requests each time.
- **Solve**: Newly developed a currency change modal integrated into the group info table. Currency list is dynamically queried from a Currency API to avoid hardcoding, and pre-filled the modal initial state with the current currency value for improved UX.
- **Result**: Operations team can directly change group billing currency in the admin; backend dependency removed.

## Key Implementations — Billing History & Invoice

### Billing History Table and Invoice Modal

- **Problem**: Enterprise groups' complete billing history needed to be queryable, with individual invoices outputtable in a printable format. Invoice layout required complex composition including brand stamp images, amount calculations, and product specification tables.
- **Solve**: Developed billing history table and invoice modal as role-separated components. Displayed brand stamp SVG image on completed invoices and added common number utility functions for payment amount formatting.
- **Result**: Completed group billing history list query and individual invoice detail view functionality.

### Billing History Dynamic Date Display and Data Bug

- **Problem**: Billing history caption was hardcoded as a static string and didn't update based on query date. Separately, a bug was causing group billing history data to be incorrectly queried, with the operations team viewing incorrect records.
- **Solve**: Modified caption to dynamically display current date with `new Date()`. Traced and fixed an API parameter binding error for the billing history data bug.

## Key Implementations — Plan History & Usage

### Plan History Pagination

- **Problem**: Group plan change history needed to be viewable chronologically. For groups with many history records, rendering all data at once without pagination would degrade performance.
- **Solve**: Developed the plan history table with page change handlers and loading state propagation. Unified plan history operator labels for expression consistency.
- **Result**: Plan change history pagination query supported; operator labels clarified.

### Usage Query and Load Complete Event Integration

- **Problem**: No view existed for quick overview of group storage, rendering, and other usage metrics. After fetching usage data, other components couldn't recognize the completion timing, causing timing issues.
- **Solve**: Composed usage in Accordion UI and separated data fetching logic into a custom hook. Added a callback interface invoked after fetch completion so parent components can recognize usage loading completion. Added unit conversion functions to number utilities for usage value formatting.
- **Result**: Real-time group usage query provided; usage load complete event integration enabled.

## Key Implementations — Group Comment CRUD

### Operations Memo CRUD Full Implementation

- **Problem**: No functionality existed for operations team to leave internal memos on specific groups. The existing comment component was tightly coupled to the member detail page and couldn't be directly reused for the group domain.
- **Solve**: Newly developed comment list, registration modal, and column definitions. Encapsulated comment CRUD API integration in custom hooks. Adjusted the existing comment component's edit prop to optional, enabling interface reuse for both member detail and group contexts. Discovered and fixed a bug where comment registration timestamps weren't displayed in KST.
- **Result**: Group-level operations memo create/edit/delete completed; KST-based date display corrected.

## Key Implementations — Common Design

### URL searchParams Filter Reset Bug

- **Problem**: After applying a manager filter on the group list, pressing the reset button didn't completely remove the manager filter from URL searchParams.
- **Solve**: Modified the reset logic to batch-reset all searchParams, explicitly removing the manager filter key.

### API Custom Hook Design Pattern Establishment

Designed 7+ custom hooks for group list, detail, comments, usage, members, and manager queries across the entire Groups domain with a consistent structure. Separated API request functions into a separate layer so hooks don't depend on data fetching implementation details. Centralized types in per-domain single files so API schema changes can be modified at a single point.

## Retrospective / Lessons Learned

Designing the entire Groups domain from scratch over approximately 1 month, I realized what's important for "component structure not to waver as features grow." Experiencing responsibilities increasingly accumulating on the group info table — manager CRUD, currency changes, etc. — confirmed that separating each action into a separate modal component with the container handling only orchestration is advantageous for maintainability. Also, using searchParams as a state store was a good choice for URL sharing and history management, but bugs arose as initialization and parsing logic scattered across multiple components — next time, abstracting URL state management into a single hook would be more appropriate.
