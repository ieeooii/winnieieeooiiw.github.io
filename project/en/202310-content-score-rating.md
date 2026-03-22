# Content Completeness Score & Rating Feature

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query, Emotion |
| Period | 2023.09 – 2023.10 |
| Team | Frontend 1, Backend 1, Product Designer 1, PM 1 (Frontend owner) |
| Service Link | style.clo-set.com |

## Overview

A Score/Rating feature for evaluating the quality of 3D clothing content with star ratings and scores. Supports fashion MDs in quantitatively recording content completeness and sharing quality standards within team review workflows. **Permission-based access control (`canEdit`)** was the core design element — users with edit permission receive an interactive editing UI, while those without receive a read-only view. Implemented Optimistic Update via React Query-based server state synchronization and a MutationObserver pattern.

## Key Implementations

### Permission-Based Dual Rendering Modes (canEdit)

- **Problem**: The Rating UI needed to provide completely different interactions based on permission. Simply `disabled`-ing buttons is poor UX — showing users non-clickable elements creates confusion. At the same time, if read-only and editable modes are mixed within the same component, conditional branching becomes complex and side effects arise when only one mode needs to change later.
- **Solve**: Branched the star rating component into two rendering paths based on the edit permission prop. When editable, renders an interactive UI with hover/click events bound; when read-only, renders a purely display component with identical visual design but no event handlers. Used CSS `pointer-events: none` so both screen reader and keyboard users clearly understand the non-editable state.
- **Result**: Clearly differentiated UX per permission; conditional branching inside components minimized.

### React Query-Based Server State Synchronization

- **Problem**: Star rating changes need immediate feedback for users, but API calls have network latency. Waiting for an API response on every star click makes the UI feel sluggish; updating only client state without confirmation risks UI-actual data mismatch on save failure.
- **Solve**: Used a score query hook to fetch the current score from the server, and a score update mutation hook for updates. Applied Optimistic Update in the mutation's `onMutate` callback to reflect the UI immediately before the API call. On `onError` callback, rolled back to the previous state and displayed an error toast to the user. On `onSettled`, called `invalidateQueries` to refetch the latest server state for final synchronization.
- **Result**: Immediate star rating change feedback without network latency; data integrity ensured via automatic rollback on API failure.

### Score Detail Modal

- Developed a detail modal visualizing score components (per-item scores, total score).
- Designed a drill-down hierarchy where clicking the summary score display component opens the per-item score detail modal.
- Represented per-item weights and calculation methods in breakdown form for user comprehension.

## Retrospective / Lessons Learned

Optimistic Update significantly improves UX, but failing to handle rollback logic carefully causes data inconsistency in failure cases. Implementing React Query's `onMutate → onError → onSettled` cycle fully for the first time in this work taught me that **optimistic update is only complete when both the "success path" and "failure path" are designed together**. It also confirmed that permission-based UI branching is far better for maintainability when approached as "component mode switching" rather than "conditional handling."
