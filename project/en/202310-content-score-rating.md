---
thumbnail: /images/projects/202310-content-score-rating-panel.webp
gradient: linear-gradient(135deg, #f0f0e8, #d8d8c0)
---

# Content Completeness Score & Rating Feature Development

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query, Emotion |
| Period | 2023.09 ~ 2023.10 |
| Team | Frontend 1, Backend 1, Product Designer 1, PM 1 (Frontend in charge) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

A Score/Rating feature for evaluating 3D garment content quality with star ratings and scores. Supports fashion MDs in quantitatively recording content completeness and sharing quality criteria in team review workflows. **Permission-based access control** was the core design element — interactive editing UI for authorized users and read-only views for unauthorized users. Implemented React Query-based server state synchronization and Optimistic Update.

<div class="img-row-2">

![Content score panel](/images/projects/202310-content-score-rating-panel.webp)
![Score input modal](/images/projects/202310-content-score-rating-modal.webp)

</div>

## Key Implementations

### Permission-Based Dual Rendering Mode

- **Problem**: The Rating UI needed to provide completely different interactions based on permission. Simply `disabled`-ing buttons is poor UX — showing unclickable elements to unauthorized users causes confusion. Meanwhile, mixing read-only and editable modes within the same component complicates conditional branching and creates side effects when only one mode needs modification.
- **Solve**: Branched the star rating component into two rendering paths based on an edit permission prop. When editable, renders interactive UI with hover/click event bindings; when read-only, renders a pure display component with the same visual design but no event handlers. Blocked with `pointer-events: none` to also handle screen reader and keyboard accessibility. The edit button is activated only after data loading completes (`isFetched`) to block the edge case of opening a modal in an unloaded state.
- **Result**: Clearly differentiated UX per permission level; minimized conditional branching within components.

### Optimistic Update — onMutate / onError / onSettled Cycle

- **Problem**: Star rating changes require immediate feedback to users, but API calls have network latency. Waiting for API responses on each click makes the UI feel laggy, while updating only client state risks data inconsistency with the server on save failure.
- **Solve**: In the mutation's `onMutate`, immediately replaces the query cache to reflect UI before the API response. In `onError`, rolls back to the previously saved cache value and displays an error toast. In `onSettled`, calls `invalidateQueries` to re-fetch the latest server state for final synchronization. The modal maintains independent local draft state, so cancel restores original values without affecting the cache.
- **Result**: Immediate star rating change feedback without network latency; automatic rollback on API failure guarantees data consistency.

### Rating UX Edge Case Handling

- **Problem**: In a 10-point rating scale, re-selecting an already selected value should allow "deselection." Adding a separate reset button complicates the UI, and while re-clicking for deselection is intuitive, the implementation needs to distinguish between 1-point re-click and regular clicks. Additionally, hover preview and final confirmed values needed separate management.
- **Solve**: Separated hover preview state and final confirmed value state within the rating component. `onMouseOver` displays preview and `onMouseLeave` restores to confirmed value. Re-clicking when 1 is already selected toggles to 0 (unselected) via separate condition handling. Portal rendering safely queries the DOM in `useEffect` for SSR safety, falling back to `document.body` when the target container doesn't exist.
- **Result**: Natural deselection via 1-point re-click without a separate delete button; interaction stabilized through separated hover preview and confirmed value states.

## Retrospective / Lessons Learned

Optimistic Update greatly improves UX, but without careful rollback logic, data inconsistency occurs in failure cases. In this project, I fully implemented React Query's `onMutate → onError → onSettled` cycle for the first time, learning that **optimistic updates are only complete when both "success path" and "failure path" are designed together**. I also confirmed that permission-based UI branching works much better for maintainability when approached as "component mode switching" rather than "conditional processing."
