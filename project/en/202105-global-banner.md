---
thumbnail: /images/projects/202105-global-banner.webp
gradient: linear-gradient(135deg, #fde8e8, #fbc8c8)
---

# Notification Global Banner System Development

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query |
| Period | 2021.05 |
| Team | Frontend 1 (in charge) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

![Global banner/modal usage limit notification banner](/images/projects/202105-global-banner.webp)

Designed and implemented a priority-based banner queue system to handle situations where multiple banners (email unverified, usage limit approaching, announcements, etc.) may simultaneously meet display conditions. Banners are displayed one at a time in sequence; closing one automatically advances to the next. Each banner's display status depends on API data.

## Key Implementations

### Priority Array Queue + Async Condition Check for Sequential Multi-Banner Display

- **Problem**: Multiple banners like email unverified and usage limit approaching can satisfy conditions simultaneously. Each banner's display condition depends on async API data, making it impossible to synchronously calculate priority at mount time. Managing Enterprise-specific banners in a separate array also meant modifying multiple places when adding new banner types.
- **Solve**: Constructed a queue as an array of banner types sorted by priority. Designed the queue calculation function as async to check each banner's display condition asynchronously before returning the actual list of banners to display. Closing a banner dequeues it from the front and auto-displays the next. In Enterprise environments, queue entry is blocked at the plan condition check stage.
- **Result**: Extensible structure where adding a banner type requires only adding one entry to the queue array; Enterprise / general plan branching unified.

### groupId Scope Key + Expiration-Based localStorage for Banner Dismissal State Isolation

- **Problem**: Constructing localStorage keys with only banner type (without group ID) caused banners dismissed in Group A to appear dismissed in Group B as well (users can belong to multiple groups). Also, an edge case where the `value` key was missing from localStorage data was not handled, causing a hotfix immediately after deployment.
- **Solve**: Included group ID in localStorage keys for independent keys per group. Added defensive code to check for required field existence before expiration checking. Extracted expiration check logic into a separate utility.
- **Result**: Independent banner dismissal state per group; localStorage parsing edge cases defended.

### Custom localStorage Wrapper with Expiration Time for Safe Client State Management

- **Problem**: The banner's "dismiss for today" feature needs to expire exactly after one day. The browser's native localStorage doesn't provide expiration functionality and requires separate implementation. If expired items aren't automatically removed, stale state persists and banners never display again.
- **Solve**: Implemented a custom localStorage wrapper that stores values along with expiration timestamps. On read, it automatically checks expiration and immediately deletes expired items while returning the default value. Banner dismissal state is configured with 1-day expiration.
- **Result**: Abstracted expiration functionality over browser-native localStorage; expired banner dismissal states auto-reset ensuring banner re-display the next day.

### next/dynamic Lazy Loading to Exclude Banner Components from Initial Bundle

- **Problem**: Banner components are conditional UI that only display when conditions are met, yet static imports include them in the initial bundle at all times.
- **Solve**: Dynamically imported each banner component with `next/dynamic` so they load only at actual render time.
- **Result**: Banner components excluded from initial bundle, preventing unnecessary bundle size increase.

## Retrospective / Lessons Learned

The post-deployment hotfix occurred because the required field absence in localStorage stored data was not handled. I learned firsthand that client storage must always be parsed defensively under the premise that "data might not exist, and the format might be wrong." After this, I developed a habit of always adding type checks and existence verification first when accessing localStorage code.
