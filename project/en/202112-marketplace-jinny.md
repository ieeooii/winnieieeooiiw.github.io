---
thumbnail: /images/projects/202112-connect-jinny-landing-hero.png
gradient: linear-gradient(135deg, #fce0ea, #f8b8cc)
---

# Fitting Software Introduction Landing Page

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | E-Commerce |
| Service | CONNECT |
| Tech Stack | Next.js, TypeScript, Emotion.js, Swiper |
| Period | 2021.12 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend owner) |
| Service Link | https://connect.clo-set.com/ko/jinny |

## Overview

Developed a service introduction page for the Jinny software launch, comprising Introduction, section list, download, and channel areas. Recognizing that Swiper was used repeatedly across the main banner, image viewer, and related items list, extracted `CarouselSwiper`, `BaseSwiperNavigation`, and `SwiperNavigation` as shared components for reuse.

## Key Features

<div class="img-row-3">

![Jinny Landing Hero](/images/projects/202112-connect-jinny-landing-hero.png)
![Jinny Slider](/images/projects/202112-connect-jinny-slider.png)
![Jinny Landing Footer](/images/projects/202112-connect-jinny-landing-footer.png)

</div>

## Key Implementations

### Jinny Page UI and API Integration
- **Problem**: The page needed various interactive elements including an auto-play loop banner, download CTA, YouTube channel integration, and responsive UI. Initial loading was slow because all images and videos loaded at once. Manual slide changes didn't reset the autoPlay timer, causing playback timing mismatches. The CSR implementation prevented search engine crawlers from properly recognizing page content, and OG metadata wasn't applied dynamically on SNS shares — both SEO issues.
- **Solve**: Separated `MainBannerContainer` and implemented CarouselSwiper-based autoPlay + loop banner, resetting the timer on slide events to fix manual navigation timing issues. Implemented a custom `IntersectionObserver` to load images and videos only when entering the viewport, improving initial load performance. Added jinnyApi integration and login page redirect for unauthenticated users in `JinnyDownload.tsx`. Also handled 768px responsive UI and high-resolution image/video swaps.
- **Result**: Deployed on schedule for Jinny launch. The shared CarouselSwiper was later reused on other pages.

### SEO Optimization
- **Problem**: Securing initial traffic channels for the product launch
- **Solve**: Configured sitemap, structured HTML semantics, and applied SSR for search engine indexing and initial traffic acquisition
- **Result**: Page indexed on Google search for "Jinny" [Link](https://www.google.com/search?q=Jinny&rlz=1C5MACD_enKR1139KR1139&oq=Jin&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIGCAEQRRg5Mg0IAhAAGIMBGLEDGIAEMgwIAxAuGEMYgAQYigUyEwgEEC4YgwEYxwEYsQMY0QMYgAQyBwgFEAAYgAQyDAgGEC4YQxiABBiKBTIGCAcQRRg80gEIMTg2MWowajGoAgCwAgA&sourceid=chrome&ie=UTF-8)

## Retrospective / Lessons Learned
- The SEO issue was partially addressed by adding meta tags via `next/head`, but fundamental limitations of the CSR structure prevented a complete fix. Applying SSG (Static Site Generation) would have pre-generated HTML for crawlers to properly read content, and per-page OG metadata would have been reliably provided.
- Identifying the reuse scope before building components and designing them as shared components was effective in reducing later maintenance costs.
