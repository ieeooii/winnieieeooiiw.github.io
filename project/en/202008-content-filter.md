---
thumbnail: /images/projects/202008-content-filter.png
gradient: linear-gradient(135deg, #f1f5f9, #e2e8f0)
---

# Content Filter System Development

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion |
| Period | 2020.08 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend owner) |
| Service Link | style.clo-set.com |

## Overview

A filter system for the 3D clothing content list page that lets users combine content type, workflow, category, search scope, sorting, and other filters to find desired content. Designed to use **URL query parameters as the single source of truth (SSoT)**, serializing filter state into the URL so that sharing the page reproduces the same filter state. State is distributed across three layers — URL / LocalStorage / Cookie — each according to its purpose, and managed centrally by MobX `FilterStore`. After the initial implementation, features such as category AND/OR logical operators, colorway view mode, and workflow V3 API migration were incrementally added.

## Key Features

<div class="img-row-2">

![Content Filter System](/images/projects/202008-content-filter.png)
![Workflow Settings](/images/projects/202008-content-filter-workflow.png)

</div>

## Key Implementations

### URL-Based Filter State Serialization / Deserialization

- **Problem**: Filters have 7 or more independent states: content type, workflow (multi-select), category, search scope, keyword, sort method, and sort direction. Managing these as component-local state resets them on page refresh and prevents URL sharing. On the other hand, keeping all state only in MobX store separates state from the URL, which conflicts with browser back/forward navigation.
- **Solve**: Used `FilterStore.parseQuery(router.query)` to type-safely parse URL query parameters for setting store initial values. On filter change, applied **shallow routing** via `Router.push(newQuery, undefined, { shallow: true })` to update only the URL without remounting the entire page. Arrays of values like workflow IDs are serialized/deserialized as comma-separated strings. Missing parameters fall back to LocalStorage values or defaults via `getDefaultXXX()` methods.
- **Result**: Identical filter state reproduced on URL sharing; browser history-based filter navigation; unnecessary page remounts prevented via shallow routing.

### Multi-Layer State Persistence (URL / LocalStorage / Cookie)

- **Problem**: Persistence requirements differed per filter state. Category, workflow, and keyword are session-level state adequately stored in the URL, but sort method and direction are user-preferred values that should persist across sessions. View mode (content-level / colorway-level) is a per-user UI preference that should be retained long-term.
- **Solve**: Separated storage layers by filter type:
  - **URL query parameters**: Search conditions (category, workflow, keyword, etc.) — shareable, history-trackable
  - **LocalStorage**: Sort method/direction preferences — persisted even after tab close, shared across all sessions in the same browser
  - **Cookie**: View mode (content / colorway), viewer mode (2D / 3D) — long-term retention, expiration set far in the future for virtually permanent storage
- **Result**: Each filter state placed in the appropriate storage layer; user experience remains consistent across page navigation, refresh, and session restart.

### Category AND / OR Logical Operators (2022.03)

- **Problem**: Fashion MDs selecting multiple categories needed both "content that includes ALL selected categories" (AND) and "content that includes ANY of the selected categories" (OR). The server API also needed to handle these two logics separately, and users needed to intuitively understand which mode was active.
- **Solve**: Defined a `CategoryFilterOperator` enum (AND / OR) and implemented an operator switch UI with `SegmentControl` above the category picker. The selected operator is included in URL query for shareability. Passed via `categoryOperator` parameter on API calls for server-level AND/OR set operation processing.
- **Result**: Users can directly control AND/OR mode for complex category filtering; operator state also reproduced on URL sharing.

### Sort Context-Based Auto-Switching

- **Problem**: Different sort options have naturally different default directions. Most recently modified is naturally descending; by name is naturally ascending. Relevance sorting is most useful during keyword search but meaningless without a keyword. Certain sort options are also unsupported in some page contexts, and incompatible values left in LocalStorage would cause errors.
- **Solve**: Sort change handler automatically applies the natural direction for each option. Auto-switches to relevance sort on keyword input, restores to most recently modified on keyword removal. Added validation to reset unsupported LocalStorage sort values to default (most recently modified) when loaded in a context that doesn't support them.
- **Result**: UX where users don't need to manually adjust sort direction each time; runtime errors from LocalStorage incompatible values prevented.

### Deleted Workflow Filter Display Bug Fix

- **Problem**: Deleted workflow states continued to appear in the filter list. Selecting a deleted workflow returned empty results with no content, leaving users unable to understand the cause.
- **Solve**: Extracted a utility function (`getWorkflowListWithOutDeleted()`) that filters by the `isDeleted` flag before rendering the workflow list. Applied at the point of setting the list in the store to completely block deleted items from appearing in the UI.
- **Result**: Only valid workflows displayed in the filter list; confusion from selecting deleted items eliminated.

### MobX Map-Based Category O(1) Lookup

- Converted and stored the category list as `Map<CategoryId, Category>`. When rendering selected category object names and hierarchy info, immediate lookup (O(1)) is possible without linear traversal (O(n)).
- Implemented logic to sort selected categories by hierarchy depth for selection order display — parent categories always appear first for intuitive selection path comprehension.

### TypeScript + Emotion Migration (2022.05)

- Fully migrated filter components initially implemented in JavaScript + SCSS (`FilterCategory.tsx`, etc.) to TypeScript + Emotion.js.
- Replaced with design system's `PickerFrame` / `PickerDropdown` common components to centralize dropdown open/close state management and outside click detection.
- Discovered implicit dependencies between filter components during migration and explicitly redefined the props interface.

## Retrospective / Lessons Learned

The most critical decision in filter system design was **"using the URL as the single source of truth."** Placing filter state in the URL makes sharing, history tracking, and refresh restoration all naturally work — but requires a serialization/deserialization layer that updates the URL on every state change and restores state on URL changes. Judging that the UX benefits justified this complexity, shallow routing resolved the performance concern. This work also taught me through hands-on practice that state like sort method and view mode that represents "personal user preference" is better suited for LocalStorage/Cookie rather than URL.
