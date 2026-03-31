---
thumbnail: /images/projects/202003-about-us-video-color-after.webp
gradient: linear-gradient(135deg, #b3f0ee, #60ddd8)
---

# Company Introduction & Legal Document Responsive Pages

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, SCSS, MobX |
| Period | 2020.03 – 2020.04 |
| Team | Frontend 1, Product Designer 1 (Frontend owner) |
| Service Link | [style.clo-set.com/aboutus](https://style.clo-set.com/aboutus) |

## Overview

Developed static pages for CLO Virtual Fashion's B2B marketing and legal purposes — About Us, Support, Privacy Policy, and Terms of Service. Since these pages are accessible to external visitors without authentication, SEO, cross-device layout, and performance were the primary considerations.

<div class="img-row-3">

![Responsive — PC](/images/projects/202003-about-us-responsive-pc.webp)
![Responsive — Tablet](/images/projects/202003-about-us-responsive-tablet.webp)
![Responsive — Mobile](/images/projects/202003-about-us-responsive-mobile.webp)

</div>

<div class="img-row-2">

![Video background color mismatch — before fix](/images/projects/202003-about-us-video-color-before.webp)
![Video background color mismatch — after fix](/images/projects/202003-about-us-video-color-after.webp)

</div>

<div class="img-row-2">

![Query string id scroll — before click](/images/projects/202003-about-us-querystring-before.webp)
![Query string id scroll — after click (?id=application)](/images/projects/202003-about-us-querystring-after.webp)

</div>

![Privacy Policy Page](/images/projects/202003-tos-privacy.webp)

## Key Implementations

### About Us Scroll Animation & Cross-Device Support
- **Problem**: The About Us page required videos in viewport-entering sections to auto-play as the user scrolls. At the time, browser support for IntersectionObserver API was incomplete. Multiple layout issues were found across mobile (Galaxy Android Chrome), tablet (iPad Safari), and desktop (Chrome/Firefox/Safari).
- **Solve**: Developed `ScrollVideoContainer.tsx` using the `scrollMonitor` library to detect scroll positions and control video play/pause. Implemented smooth fade-in animation using CSS `transition` and opacity. Fixed the iPad Safari issue where `100vh` includes the address bar height by using CSS custom properties referencing `window.innerHeight` directly. Fixed Galaxy device layout collapse caused by missing Flexbox gap support using margin-based fallbacks.
- **Result**: Consistent layout across all resolutions (mobile/tablet/desktop), scroll-triggered video animation working correctly

### Cross-Device Color Rendering for Solid-Background Videos
- **Problem**: Videos with solid-color backgrounds displayed color inconsistencies across different displays
- **Solve**: Used `canvas` to extract the background color from solid-background videos, resolving color discrepancies [Reference](https://sansho.studio/blog/html-videos-correct-background-color)
- **Result**: Consistent layout and video animation across all resolutions

### Device-Optimized Video Delivery
- **Problem**: Background videos on the About Us page were too large to serve the same file across all devices. Mobile users were downloading desktop-resolution video files, causing unnecessary bandwidth consumption and loading delays.
- **Solve**: Monitored actual device distribution data, then prepared separate video files sized for each resolution tier (mobile / tablet / desktop). Used User Agent detection to identify the device type (mobile / tablet / desktop) and serve the appropriate video source accordingly.
- **Result**: Eliminated unnecessary video downloads per device; improved loading performance on mobile

### Privacy Policy / Terms of Service Multilingual Legal Document Structure
- **Problem**: Privacy Policy and Terms of Service needed to be provided in 6 languages to comply with GDPR and other regional regulations. Legal documents are long with many sections (15 sections in ToS), with different lengths and formats per language. Putting everything in one file would create excessive bundle size and make maintenance difficult.
- **Solve**: Split sections into individual components: `TermsOfServicePartOne.tsx` through `TermsOfServicePartFifteen.tsx`. Used i18next for independent multilingual text management per language. Each section component is loaded on demand via `dynamic import`.
- **Result**: 15 sections × 6 languages structured and complete; independent per-section edits now possible

## Retrospective / Lessons Learned

Static pages are not necessarily simple from a technical standpoint. Cross-device compatibility in particular is a domain where "looks good on my machine" means nothing. Issues like iOS Safari's `100vh` quirk and Android Chrome's Flexbox compatibility differences taught me to proactively learn environment-specific browser rendering differences and write defensively.
