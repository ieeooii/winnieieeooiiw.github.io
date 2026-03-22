---
thumbnail: /images/projects/202105-global-banner.png
gradient: linear-gradient(135deg, #fde8e8, #fbc8c8)
---

# Notification Global Banner System

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query |
| Period | 2021.05 |
| Team | Frontend 1 (owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

![Usage Limit Exceeded Banner — among Global Banners/Modals](/images/projects/202105-global-banner.png)

Designed and implemented a priority-based banner queue system to handle complex scenarios where multiple banners — email verification, marketing consent, announcements, etc. — can simultaneously meet their display conditions.

## Key Implementations

### Async liveSteps Queue Design

- **Problem**: Each banner's display condition depended on async API data, making synchronous calculation at mount time impossible. The legacy structure managed Enterprise-exclusive steps in a separate array, requiring updates in two places when adding a new banner type.
- **Solve**: Refactored `liveSteps` to be calculated as an `async` function returning a Promise. `GlobalRootTopBanner` waits for async data before determining `currentStep`. Enterprise-specific branching is handled inside the `liveSteps` calculation logic, unifying the banner queue itself.
- **Result**: Adding a new banner type requires only inserting a single step into the `liveSteps` array; Enterprise / standard plan branching unified

### localStorage Per-Group State Management
- **Problem**: Using only the banner type as the localStorage key would cause a banner dismissed in group A to appear dismissed in group B as well (CLOSET users can belong to multiple groups). There was also a history of a hotfix immediately after deployment due to missing handling of localStorage values without a `value` key.
- **Solve**: Included `groupId` in the localStorage key, designing the format as `{bannerType}_{groupId}`. Added defensive code to check for the existence of `value` before the expiry check. Extracted the expiry check logic into a dedicated utility.
- **Result**: Independent banner dismissal state per group; edge cases in localStorage parsing handled defensively

## Retrospective / Lessons Learned

The hotfix happened right after deploying this system. This was a firsthand lesson that client storage must always be parsed defensively under the assumption that "data may be missing or malformed." After this, I made it a habit to always check for type and existence before accessing localStorage.
