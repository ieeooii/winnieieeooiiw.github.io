# Content Search & Folder List Virtual Scroll Performance Optimization

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query, Virtuoso |
| Period | 2024.08 – 2024.09 |
| Team | Frontend (sole owner) |
| Service Link | style.clo-set.com |

## Overview

Fixed two bugs in the CLOSET content search page and Room (workspace unit for storing and sharing files and work) list page arising from the combination of the Virtuoso virtual scroll library and React Query Infinite Scroll. Virtuoso is a library that secures large-list performance by rendering only currently visible items based on actual DOM rendering area (`visibleRange`) rather than IntersectionObserver.

## Key Implementations

### Infinite Re-render Bug — Windows 11 HiDPI Display
- **Problem**: Opening the Space/Room list page on Windows 11 HiDPI caused `getNextPageFn` to call repeatedly without stopping, triggering infinite API requests and re-renders. It was difficult to identify the cause because it couldn't be reproduced at all on Mac + standard resolution monitors. The first challenge was establishing a debugging environment, as it was only reproducible on a team member's Windows machine with a HiDPI display.
- **Solve**: Tracking the pixel values returned by Virtuoso's `visibleRange` revealed that on HiDPI environments, the browser returned `endIndex` values with decimal points during CSS pixel to physical pixel conversion. These values weren't handled correctly in integer comparisons, causing "needs next page" judgments to loop. Fixed by adding an `isFetching` guard to the `getNextPageFn` call condition and using `Math.floor()` to convert `visibleRange`-based index comparisons to integers.
- **Result**: Infinite loop fully resolved in Windows HiDPI environments

### Content Copy Duplicate List Issue
- **Problem**: When executing a single content copy from the Context Menu, the original and copy would show as duplicates in the list after copying completed, or the count wouldn't match actual server data. The cause was that React Query's optimistic update added a temporary item to the list on copy API call, but cache invalidation and temporary item removal ran without order guarantees after copy completion, causing state inconsistency.
- **Solve**: In the copy mutation's `onSuccess` callback, explicitly ordered: first rollback the temporary item inserted by optimistic update, then `queryClient.invalidateQueries` to invalidate the list cache and refetch the latest state from the server.
- **Result**: List duplicates after copying fully resolved; count accuracy maintained

## Retrospective / Lessons Learned

"Bugs that don't reproduce on Mac" are always hard to debug. The Virtuoso bug was impossible to reproduce without a HiDPI environment, reinforcing that establishing a reproduction environment is a prerequisite for debugging. I learned that UI logic involving pixel-level calculations can vary subtly across OS/resolution/browser combinations, and that explicit `Math.floor/ceil` or fetch state guards are better defenses than integer comparisons that rely on assumptions.
