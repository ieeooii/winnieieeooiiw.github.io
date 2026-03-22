---
thumbnail: /images/projects/202008-content-filter.webp
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
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

A filter system for the 3D clothing content list page that combines content type, workflow, category, search scope, sorting, and other filters to find desired content. **URL query parameters are used as the single source of truth (SSoT)**, serializing filter state into the URL so that sharing a page reproduces the same filter state. State is distributed across three layers — URL / LocalStorage / Cookie — each according to its purpose, with MobX store managing them centrally. After the initial implementation, features such as category AND/OR logical operators, colorway view mode, and workflow V3 API migration were incrementally added.

<div class="img-row-2">

![Content filter system](/images/projects/202008-content-filter.webp)

</div>

## Key Implementations

### Filter State Serialization into URL Query Parameters as SSoT with Share/Restore

- **Problem**: Filters have 7 or more independent states: content type, workflow (multi-select), category, search scope, keyword, sort method, and sort direction. Managing these as component-local state resets them on page refresh and prevents URL sharing. On the other hand, keeping all state only in MobX store separates it from the URL, conflicting with browser back/forward navigation.
- **Solve**: Type-safely parsed URL query parameters to set store initial values. On filter change, used shallow routing to update only the URL without remounting the entire page. Arrays like workflow IDs are serialized/deserialized as comma-separated strings. Missing parameters fall back to LocalStorage values or defaults.
- **Result**: Identical filter state reproduced on URL sharing; browser history-based filter navigation; unnecessary page remounts prevented via shallow routing.

### Storage Layer Separation by Filter Characteristic: URL / LocalStorage / Cookie

- **Problem**: Persistence requirements differed per filter state. Category, workflow, and keyword are session-level state adequately stored in the URL, but sort method and direction are user-preferred values that should persist across sessions. View mode (content-level / colorway-level) is a per-user UI preference that should be retained even longer-term.
- **Solve**: Separated storage layers by filter characteristic:
  - **URL query parameters**: Search conditions (category, workflow, keyword, etc.) — shareable, history-trackable
  - **LocalStorage**: Sort method/direction preferences — persisted even after tab close, shared across all sessions in the same browser
  - **Cookie**: View mode (content / colorway), viewer mode (2D / 3D) — long-term retention, virtually permanent
- **Result**: Each filter state placed in the appropriate storage layer; user experience remains consistent across page navigation, refresh, and session restart.

### Category AND/OR Operator Toggle for Complex Filtering (2022.03)

- **Problem**: When fashion MDs selected multiple categories, they needed both "content that includes ALL selected categories" (AND) and "content that includes ANY of the selected categories" (OR). The server API also needed to handle these two logics separately, and users needed to intuitively understand which mode was active.
- **Solve**: Defined a category operator enum (AND / OR) and implemented an operator toggle UI above the category picker. The selected operator is included in URL query for shareability. Passed as a parameter on API calls for server-level AND/OR set operation processing.
- **Result**: Users can directly switch AND/OR mode for complex category filtering; operator state also reproduced on URL sharing.

### Sort Direction Auto-Switching by Context with Incompatible Value Fallback

- **Problem**: Different sort options have naturally different default directions. Most recently modified is naturally descending; by name is naturally ascending. Relevance sorting is most useful during keyword search but meaningless without a keyword. Certain sort options are unsupported in some page contexts, and incompatible values left in LocalStorage would cause errors.
- **Solve**: Auto-applied the natural direction for each option on sort change. Auto-switched to relevance sort on keyword input, restored to most recently modified on keyword removal. Added validation to reset unsupported LocalStorage sort values to defaults when loaded in an incompatible context.
- **Result**: UX where users don't need to manually adjust sort direction each time; runtime errors from incompatible LocalStorage values prevented.

### Deleted Workflow Filter List Display Bug Fix

- **Problem**: Deleted workflow states continued to appear in the filter list. Selecting a deleted workflow returned empty results with no content, leaving users unable to understand the cause.
- **Solve**: Extracted a utility function that filters by the deletion flag to keep only valid items before rendering the workflow list. Applied at the point of setting the list in the store to completely block deleted items from appearing in the UI.
- **Result**: Only valid workflows displayed in the filter list; confusion from selecting deleted items eliminated.

### Category O(1) Lookup Optimization with MobX Map Structure

- **Problem**: Traversing the entire category array (O(n)) every time selected category names and hierarchy info needed rendering would increase rendering cost linearly as selected items grew. Selected categories also needed to be displayed in hierarchy order, but selection order didn't always match hierarchy order.
- **Solve**: Converted and stored the category list as a `Map<id, category>` structure for id-based O(1) immediate lookup. Sorted selected categories by hierarchy depth so parent categories always appear first.
- **Result**: Eliminated linear traversal during category rendering; selection path displayed consistently in hierarchy order.

### TypeScript + Emotion Migration for Design System Integration (2022.05)

- **Problem**: Filter components initially implemented in JavaScript + SCSS couldn't apply design system tokens, and reusing common dropdown components was difficult. Before migration, implicit dependencies between filter components made it hard to predict modification scope.
- **Solve**: Fully migrated to TypeScript + Emotion.js. Replaced with design system common dropdown components to centralize open/close state management and outside click detection. Discovered implicit dependencies between components during migration and explicitly redefined the props interfaces.
- **Result**: Design system tokens applicable; dropdown behavior consistency secured; inter-component dependencies made explicit.

## Retrospective / Lessons Learned

The most critical decision in filter system design was **"using the URL as the single source of truth."** Placing filter state in the URL makes sharing, history tracking, and refresh restoration all naturally work — but requires a serialization/deserialization layer that updates the URL on every state change and restores state on URL changes. Judging that the UX benefits justified this complexity, shallow routing resolved the performance concern. This work also taught me through hands-on practice that state like sort method and view mode that represents "personal user preference" is better suited for LocalStorage/Cookie rather than the URL.
