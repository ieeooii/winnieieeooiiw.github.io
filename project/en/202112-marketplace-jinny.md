---
thumbnail: /images/projects/202112-connect-jinny-landing-hero.webp
gradient: linear-gradient(135deg, #fce0ea, #f8b8cc)
---

# Fitting Software New Service Introduction Landing Page

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | E-Commerce |
| Service | CONNECT |
| Tech Stack | Next.js, TypeScript, Emotion.js, Swiper |
| Period | 2021.12 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend in charge) |
| Service Link | [connect.clo-set.com/ko/jinny](https://connect.clo-set.com/ko/jinny) |

## Overview

Developed a service introduction page for the Jinny software launch, consisting of Introduction, Section List, Download, and Channel areas. Identified that Swiper was being used repeatedly across multiple areas including the main banner, detail image viewer, and related item list, and extracted a Swiper-based shared component designed for reusability.

<div class="img-row-3">

![Jinny landing hero](/images/projects/202112-connect-jinny-landing-hero.webp)
![Jinny slider](/images/projects/202112-connect-jinny-slider.webp)
![Jinny landing footer](/images/projects/202112-connect-jinny-landing-footer.webp)

</div>

## Key Implementations

### Swiper Shared Component Extraction and Viewport-Based Lazy Loading for Initial Load Optimization
- **Problem**: Various interaction elements were required including auto-play loop banners, download CTAs, YouTube channel integration, and responsive UI. Loading all images and videos at once on first page load caused slow initial loading, and when manually swiping, the autoPlay timer wasn't reset, causing playback timing misalignment.
- **Solve**: Separated the main banner container and implemented an autoPlay + loop banner using a Swiper-based shared component. Reset the timer on slide events to resolve the manual swipe timing issue. Images and videos are lazy-loaded only when entering the viewport via `IntersectionObserver`, improving initial load performance. High-quality image and video replacement was also handled based on responsive breakpoints.
- **Result**: Deployed on schedule for the Jinny launch. The shared Swiper component was later reused on other pages.

### forwardRef and scrollIntoView for Cross-Container Scroll Navigation

- **Problem**: Multiple buttons (download CTA, mode switch buttons, etc.) needed to navigate to specific sections within the page, but each Container component was independently separated, making it difficult to control scroll targets externally.
- **Solve**: Managed refs for each section centrally at the page root and passed `scrollIntoView({ behavior: 'smooth' })` handlers to each button via props. Child container components accept external refs via `forwardRef`, allowing the page root to control scroll behavior from a single point. Used Emotion `Global` component to inject page-specific background color at the body level, applying page-specific styles without modifying the common layout.
- **Result**: Scroll control logic centralized at the page root with each container only responsible for ref acceptance; page-specific style isolation possible without layout component changes.

### Bidirectional Horizontal Scroll Anchor Synchronization via IntersectionObserver Custom Hook

- **Problem**: In the horizontal scroll area, the item at the center of the screen needed to be tracked without scroll events, and synchronized with the active state of anchor buttons at the top.
- **Solve**: Abstracted IntersectionObserver into a custom hook and attached refs to each element. In the detection callback, calculated the absolute difference between the scroll container center coordinates and each element's center coordinates to update the closest item as the active tab. Applied thresholds differently for mobile/desktop via a responsive custom hook. Completed bidirectional linking — button → scroll via `scrollIntoView({ inline: 'center' })`, and scroll → button. Scrollbar hidden via cross-browser CSS.
- **Result**: Horizontal scroll position tracked without scroll events; bidirectional synchronization between buttons and scroll position.

### Query Parameter Preservation for Auto-Resume Download After Login

- **Problem**: Software download requires login, but non-authenticated users had to re-click the download button after logging in, creating a UX disconnection.
- **Solve**: On download click in unauthenticated state, preserves the selected OS as a URL query parameter and redirects to the login page. On return after login completion, detects the query parameter, validates the OS value with a type guard, and auto-resumes download if valid. On mobile, a responsive custom hook disables the button to indicate the software is desktop-only via UI.
- **Result**: Flow automatically restored after login without re-clicking the download button; mobile environment malfunction prevention.

### Responsive Gallery with CSS Grid and next/dynamic

- **Problem**: The user gallery required breakpoint-specific column count adjustment, detail modal lazy loading, and layout stability during loading.
- **Solve**: Dynamically determined the number of exposed items per breakpoint via a responsive custom hook. Configured a CSS Grid layout where column count automatically adjusts based on screen width. Detail modal lazy-loaded with `next/dynamic` to exclude from initial bundle. Skeleton loader displayed during React Query loading to prevent layout shift.
- **Result**: Optimal column count automatically applied per screen size; detail modal bundle separated; layout stability secured during loading.

### getServerSideProps SSR and Multilingual OG Meta Tags for SEO
- **Problem**: Initial traffic channel acquisition was needed for product launch. In CSR structure, crawlers that don't execute JS can't recognize content, and OG metadata isn't dynamically applied when sharing on social media.
- **Solve**: Applied SSR via `getServerSideProps` so HTML is delivered pre-rendered from the server. Used a pattern where Redux Saga is fully exhausted within `getServerSideProps` before returning props to guarantee server-side async task completion. Injected i18n-translated title and description into layout components for language-specific OG meta tags, and organized Sitemap configuration and HTML semantic markup.
- **Result**: Google search for 'Jinny' [Link](https://www.google.com/search?q=Jinny&rlz=1C5MACD_enKR1139KR1139&oq=Jin&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIGCAEQRRg5Mg0IAhAAGIMBGLEDGIAEMgwIAxAuGEMYgAQYigUyEwgEEC4YgwEYxwEYsQMY0QMYgAQyBwgFEAAYgAQyDAgGEC4YQxiABBiKBTIGCAcQRRg80gEIMTg2MWowajGoAgCwAgA&sourceid=chrome&ie=UTF-8)

## Retrospective / Lessons Learned
- Applied SSR via `getServerSideProps` for SEO, but since it generates HTML on the server for every request, SSG (Static Site Generation) would have been more suitable for a landing page that is mostly static content. SSG could have improved both crawling stability and response speed by pre-generating HTML at build time.
- Identifying reuse scope before component development and designing shared components was effective in reducing subsequent maintenance costs.
