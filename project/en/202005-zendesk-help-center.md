---
thumbnail: /images/projects/202003-zendesk-helpcenter.webp
gradient: linear-gradient(135deg, #d8d8d8, #b0b0b0)
---

# Help Center Build — Custom Theme for External CMS

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | ETC |
| Service | CLO-SET Help Center |
| Tech Stack | Zendesk Guide, Handlebars.js, HTML, CSS, JavaScript |
| Period | 2020.03 – 2020.05 |
| Team | Frontend (owner) |
| Service Link | [support.clo-set.com](https://support.clo-set.com) |

## Overview

Built a self-service help center for CLO-SET's global customers on Zendesk Guide, and designed and implemented a custom theme aligned with CLO-SET brand identity. Fully customized Zendesk's default Copenhagen theme to deliver a help center with a Getting Started · Feature Manual · CLO-SET News · FAQ category structure and a hero search UI. The help center served as the primary self-service support channel for fashion brand customers worldwide to resolve CLO-SET usage questions on their own.

## Key Features

![Help Center Main](/images/projects/202003-zendesk-helpcenter.webp)

## Key Implementations

### Brand-Exclusive Custom Theme Design
- **Problem**: Zendesk's default theme had a generic design that made it difficult to express CLO-SET's brand identity (dark header, tiffany green accent color, 3D fashion image backgrounds). It was also necessary to understand in advance Zendesk Guide's Handlebars-based template structure and the scope of CSS variable customization.
- **Solve**: Defined customizable variables (colors, fonts, layouts) via Zendesk Guide Theming API's `manifest.json`, and directly modified Handlebars templates (`home_page.hbs`, `article_page.hbs`, etc.) to place a hero area with background image and search bar. Applied CLO-SET logo, brand colors (cyan palette), and dark navigation bar to deliver an experience consistent with the service UI.
- **Result**: Completed a help center unified with CLO-SET branding. Established a self-service channel where customers can browse help content without separate inquiries.

### Category Structure & Content Architecture Design
- **Problem**: Diverse content types — Getting Started, Feature Manual, CLO-SET News, FAQ — needed to be navigated consistently within a single help center. Mapping Zendesk's three-tier category → section → article structure to service content was required.
- **Solve**: Divided into 4 top-level categories by purpose and implemented a home layout with description text and SEE MORE entry points on each category card, using Handlebars custom helpers and CSS Grid. Created a dedicated Promoted Articles area to surface key help articles directly on the home page.
- **Result**: Completed category structure with clear user navigation paths. Established an operating structure where the CS team can manage articles directly.

### Multilingual (i18n) Support
- **Problem**: CLO-SET targets global fashion brand customers, so the help center also needed multilingual support with English as the default. Zendesk Guide's locale-based multilingual structure needed to be handled correctly at the theme level.
- **Solve**: Used Zendesk Guide's `{{t 'key'}}` helper to separate UI strings into locale files. Utilized Zendesk's built-in i18n structure so the language auto-switches based on URL structure (`/hc/en-us`, `/hc/ko`, etc.).
- **Result**: Built with English as default and extensible to additional languages. Established foundation for serving a global customer base.

## Retrospective / Lessons Learned

Zendesk Guide is a platform with limited flexibility, so the key was to first understand "how far can customization go." Once the Handlebars template and manifest variable system were understood, the implementation itself wasn't much different from standard HTML/CSS work — but implementing design intent within platform constraints was a different kind of problem-solving from typical web development. Working through this taught me that delivering a consistent brand experience across the service UI and the help center directly impacts customer trust, and that the UI/UX of support channels is also part of the product.
