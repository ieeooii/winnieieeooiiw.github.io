---
thumbnail: /images/projects/202409-drive-search-before.webp
gradient: linear-gradient(135deg, #e8f0e8, #c8d8c8)
---

# Content Search & Folder List Virtual Scroll Performance Optimization

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query, Virtuoso |
| Period | 2024.08 ~ 2024.09 |
| Team | Frontend (in charge) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

<div class="img-row-3">

![Before search](/images/projects/202409-drive-search-before.webp)
![Search loading](/images/projects/202409-drive-search-loading.webp)
![After search](/images/projects/202409-drive-search-after.webp)

</div>

Fixed two bugs caused by the combination of the Virtuoso virtual scroll library and React Query Infinite Scroll on CLOSET's content search page and Room (workspace units for storing and sharing files and work) list page. Virtuoso renders only currently visible items based on the actual DOM rendering area (`visibleRange`) instead of IntersectionObserver, ensuring large list performance.

## Key Implementations

### Infinite Re-render Bug — Windows HiDPI Display

- **Problem**: On Windows HiDPI environments, opening the Room list page caused the next page request function to call repeatedly without stopping, resulting in infinite API requests and re-renders. The issue was completely unreproducible on Mac + standard resolution, making root cause identification difficult. It was only reproducible on a team member's Windows machine with a HiDPI display, making the first challenge establishing the debugging environment itself.
- **Solve**: The root cause was the DOM height measurement approach misaligning with the HiDPI environment's browser repaint cycle, causing repeated "content doesn't fill the container" judgments. The original code directly referenced the `clientHeight` of a specific CSS class element. Fixed by aligning DOM measurement timing to after the browser repaint using `requestAnimationFrame` and switching to `scrollHeight` of the scroll container as the reference. Added an `isFetching` guard to also block duplicate calls during requests.
- **Result**: Infinite loop completely resolved in Windows HiDPI environments.

### Copy Optimistic Update — Order Guarantee and Count Synchronization

- **Problem**: Executing content copy from the Context Menu caused two issues. First, after copy completion, originals and copies appeared duplicated in the list or the count didn't match actual server data. Second, a skeleton loader displayed infinitely immediately after copying. The cause was that the optimistic update added a copy to the front of the list without simultaneously incrementing the total count, causing "there are still items to load" judgment, and cache invalidation and temporary item removal executed without order guarantee causing state inconsistency.
- **Solve**: In the optimistic update, immediately incremented the total count along with adding the copy to the front of the list so the skeleton loader disappears. In the copy success callback, explicitly guaranteed order by performing temporary item rollback first, then invalidating list cache to re-fetch the latest state from the server.
- **Result**: Resolved duplicate display after copy; resolved infinite skeleton display; count consistency secured.

### Pagination Race Condition Prevention

- **Problem**: In virtual scroll environments, when the page load function was called rapidly in succession, it would duplicate-request the same page, or page numbers would incorrectly increment on API errors. Additionally, when filter changes started new requests before previous page requests completed, uncancelled previous responses could mix into the list.
- **Solve**: Tracked the currently requesting page number separately from the confirmed page number. Used `isFetching` state as a guard to block duplicate calls during requests. On API errors, rolled back the requesting page number so the next attempt re-requests the same page. On filter changes, cancelled previous page requests with AbortController to prevent response mixing. Applied ID-based deduplication during list merging to prevent duplicates in environments like colorway view where the same item renders multiple times.
- **Result**: No duplicate requests even during fast scrolling/filter switching with page order guaranteed; retry after API error works correctly.

## Retrospective / Lessons Learned

"Bugs that don't appear on Mac" are always difficult to debug. The Virtuoso bug was completely unreproducible without a HiDPI environment, so I once again felt that securing the reproduction environment is the prerequisite for debugging. UI logic involving pixel-level calculations can differ subtly across OS/resolution/browser combinations, and I learned that rather than relying on integer comparisons based on assumptions, defensive measures like explicit `Math.floor/ceil` or fetch state guards should be used.
