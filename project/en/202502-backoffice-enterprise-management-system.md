---
thumbnail: /images/projects/202501-backoffice-enterprise.svg
gradient: linear-gradient(135deg, #e8eaf0, #c8ccd8)
---

# Backoffice Enterprise Groups Domain Design

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | Internal Admin Tool |
| Service | CLO-SET Admin |
| Tech Stack | React 17, TypeScript 4.5, Redux, Redux-Saga, Styled Components, Axios, react-export-excel |
| Period | 2025.01 – 2025.02 |
| Team | Frontend 1 (owner), Backend 1+, PM 1 |
| Service Link | Internal admin (private) |

## Overview

Designed and built from scratch a Groups section in the admin for managing CLO-SET Enterprise plan customer accounts (Groups) — including account status, billing history, usage, and operational notes. Solely developed 7 sub-features and 40+ new components over 6 months, covering everything from group list search filters to the group detail page (info table, members, usage, plan history, billing history, comments). Led the entire frontend process from API design collaboration and component structure decisions through to deployment.

## Key Implementations — Groups List & Search Filter

### SearchFilter + AutocompleteInput Component Design

- **Problem**: Internal operations teams needed to filter hundreds of Enterprise groups by plan type, payment method, assigned CLO-SET manager, and keyword combinations. The Groups list page itself didn't exist in the existing admin, and the manager field required autocomplete with dynamically changing options.
- **Solve**: Designed a new `SearchFilter.tsx` component — plan type and payment method use `CheckboxFilterElement`, while manager uses `AutocompleteInput.tsx` that fetches candidate options from the API and filters based on typing. Serialized filter conditions into URL `searchParams` so state is preserved after refresh. Centralized filter option constants in `constants/groups/filter.ts` to avoid hardcoding options in UI code.
- **Result**: 4-type compound filtering — plan type, payment method, manager (autocomplete), keyword — with URL serialization enabling filter state sharing.

### GroupListTable Conditional Row Styling + Excel Export

- **Problem**: Short-term subscription groups nearing subscription end were hard to identify visually in the list. The operations team needed to export the currently displayed list as a spreadsheet for sharing, but no Excel export feature existed anywhere.
- **Solve**: Added `rowStyle` logic to `GroupListTable.tsx` applying conditional background color to rows where the subscription end date is within a certain period. Added exception handling so that styling is not applied when the subscription end date is `null` or the plan type is FREE. For Excel export, used `react-export-excel-xlsx-fix` — separated export-specific column definitions in `GroupListColumns.tsx` and implemented `.xlsx` file generation in `GroupList.tsx` based on current filter result data. Also added error handling for export failures.
- **Result**: Visual identification of at-risk short-term subscription groups; immediate Excel download of current filter results.

---

## Key Implementations — Group Detail Page

### Group Detail Layout & Routing Design

- **Problem**: There was no detail page to navigate to when clicking a specific group from the group list. The detail page was planned to have multiple tabs (Overview, Billing History, etc.), so URL changes needed to occur on tab navigation while the shared layout (group name, top info) remained stable.
- **Solve**: Separated `GroupDetail.tsx` (page), `GroupDetailContainer.tsx` (layout and data fetching), and `GroupOverviewTabContainer.tsx` (Overview tab content) hierarchically. Added nested routes under `/groups/:groupId` in the router so tab transitions are trackable via URL changes.

### GroupInformationTable + CLOSETManagerModal CRUD

- **Problem**: Group basic information (plan type, payment method, member count, manager, etc.) needed to be viewable on a single screen with the ability to change the manager. Managers required a multi-add/delete structure, but no reusable patterns existed in the existing admin components.
- **Solve**: Built `GroupInformationTable.tsx` based on a common `InformationTable.tsx` component, with the manager edit cell opening `CLOSETManagerModal.tsx` to add/remove managers via POST/DELETE APIs. Discovered a bug where the internal list state wasn't reset when the modal closed, and explicitly added state reset logic on `onClose`. Decoupled data fetching logic from UI by separating the manager list into a `useMembersManagersQuery.tsx` custom hook.
- **Result**: Group info viewing and manager CRUD handled from a single screen.

### Payment Currency Change Modal

- **Problem**: Operations cases arose where a specific Enterprise group's billing currency (KRW, USD, etc.) needed to be changed, but there was no way to do it in the admin — requiring direct requests to the backend each time.
- **Solve**: Developed `GroupPaymentCurrencyEditModal.tsx` (96 lines) and integrated it into `GroupInformationTable`. Designed to dynamically fetch the currency list from the Currency API to avoid hardcoding, and pre-filled the current currency value as the modal's initial state for improved UX.
- **Result**: Operations team can change group billing currency directly in the admin; backend dependency eliminated.

---

## Key Implementations — Billing History & Invoices

### GroupBillingHistoryTable + Invoice Modal

- **Problem**: Enterprise group billing history needed to be viewable in full, with individual invoices printable. Invoice layout required complex elements: CLO-SET brand stamp image, amount calculations, and a product details table.
- **Solve**: Developed `GroupBillingHistoryColumns.tsx` (145 lines), `GroupBillingHistoryTable.tsx` (177 lines), and `GroupBillingHistoryContainer.tsx`. The invoice modal was separated into role-specific components — `GroupBillingHistoryInvoiceModal.tsx`, `GroupInvoiceFigure.tsx`, `GroupInvoiceInformation.tsx`, `GroupInvoiceTable.tsx` — totaling 437 lines. Displayed a brand stamp SVG image on completed payment invoices and added common number utility functions for payment amount formatting.
- **Result**: Group billing history list view and single invoice detail functionality complete.

### Billing History Caption Dynamic Date Display + Data Bug Fix

- **Problem**: Billing history caption was hardcoded as a static string and wasn't refreshing based on the viewing date. Separately, a bug was found where group billing history data was fetched incorrectly, causing the operations team to see wrong history.
- **Solve**: Updated caption to display the current date dynamically using `new Date()`. Tracked down and fixed the billing history data bug by identifying an API parameter binding error.

---

## Key Implementations — Plan History & Usage

### GroupPlanHistoryTable + Pagination

- **Problem**: Group plan change history needed to be viewable chronologically. Rendering all data at once without pagination was expected to degrade performance for groups with a large history.
- **Solve**: Developed `GroupPlanHistoryTable.tsx` with a `NewDataTableBody`-based table, adding a page change handler and loading state propagation. Unified the plan history operator label as "CLO-SET Manager" for expression consistency.
- **Result**: Paginated plan change history viewing supported; operator filter label clarified.

### GroupUsageAccordionBox Usage Tracking

- **Problem**: There was no view for seeing a group's storage, rendering, and other usage at a glance. A timing issue occurred where other components couldn't recognize when usage data fetching had completed.
- **Solve**: Structured `GroupUsageAccordionBox.tsx` as an Accordion UI and separated usage data fetching logic into a `useCLOSETGroupsUsage.tsx` custom hook. Added an `onFetchComplete` interface that calls a callback after fetching completes, enabling parent components to recognize when usage loading is done. Also added unit conversion functions to the number utility for usage metric formatting.
- **Result**: Real-time group usage viewing provided; usage load completion event integration supported.

---

## Key Implementations — Group Comments CRUD

### Operations Notes (Comments) Feature Full Implementation

- **Problem**: The operations team had no way to leave internal notes about specific groups. The existing `CommentTable.tsx` was tightly coupled to the member detail page and couldn't be reused directly for the group domain.
- **Solve**: Developed `GroupComment.tsx`, `GroupCommentTable.tsx`, `GroupAddCommentModal.tsx`, and `GroupCommentListColumns.tsx` (535+ lines total). Encapsulated comment CRUD API integration in a `useCLOSETGroupsCommentsQuery.tsx` custom hook. Made `CommentList.tsx`'s `setIsEditing` prop optional to enable reuse in both member detail and group contexts. Discovered and fixed a bug where comment timestamps weren't displayed in KST, updating the date format logic accordingly.
- **Result**: Group-level operational note create/update/delete complete; KST-based date display corrected.

---

## Key Implementations — Common Design

### searchParams-Based Filter State Management Bug Fix

- **Problem**: A bug existed where after applying a manager filter in the group list and pressing the reset button, the manager filter key was not completely removed from URL searchParams.
- **Solve**: Updated the reset logic to explicitly remove the manager filter key, rather than batch-resetting all searchParams at once.

### API Custom Hook Design Pattern

- Designed 7+ custom hooks for Groups domain data fetching — group list, detail, comments, usage, members, managers — consistently structured under a `hooks/groups/` directory. API request functions are separated into their own layer so hooks don't depend on fetching implementation details. Types are centralized per domain in a single file, enabling single-point updates when API schemas change.

---

## Retrospective / Lessons Learned

Designing the entire Groups domain from scratch over 6 months made me realize what matters for "keeping the component structure stable as features accumulate." Experiencing `GroupInformationTable` accumulating growing responsibilities — manager CRUD, currency change — confirmed that separating each action into dedicated modal components with the container only handling orchestration is advantageous for maintainability. Using searchParams as a state store was a good decision for URL sharing and history management, but bugs arose as initialization and parsing logic scattered across multiple components — next time, abstracting URL state management into a single hook would be more appropriate.
