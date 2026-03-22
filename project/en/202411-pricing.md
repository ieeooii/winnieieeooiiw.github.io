---
thumbnail: /images/projects/202505-pricing.webp
gradient: linear-gradient(135deg, #e8f0e8, #c8d8c8)
---

# Plan-Based Pricing & Usage Limit System Development

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLOSET |
| Tech Stack | Next.js, TypeScript, React Query, MobX |
| Period | 2024.09 ~ 2024.11 |
| Team | Frontend 4, Backend 3, Product Designer 2, PM 3 (Usage limit system in charge) |
| Service Link | [style.clo-set.com/service/pricing](https://style.clo-set.com/service/pricing) |

## Overview

![Pricing page](/images/projects/202505-pricing.webp)

Divided into Phase 1 (2022) which solved the paid conversion rate decline problem during pricing policy reform using a data-driven approach, and Phase 2 (2024 ~ 2025) which implemented 5+ independent usage limit systems including embed counts, rendering capacity, file uploads, Workroom creation, and API tokens across the Free / Academic / Pro / Enterprise 4-plan structure. Includes upgrade-inducing flows on limit exceedance and funnel analysis logging.

## Key Implementations

### Conversion Funnel Logging Design

- **Solve**: Coordinated event specs with DE/DA. Implemented event tracking logging at key conversion funnel points including clicks, views, and CTAs.

### Funnel Analysis-Based Conversion Rate Improvement

- **Solve**: Identified low-conversion segments through funnel analysis and developed and applied improved UX/UI.
- **Result**: Achieved approximately +10% paid conversion rate at pricing policy reform launch. Additional +4% improvement through funnel analysis-based UX improvements (total 14% increase).
- **Insight**: Implemented by directly calling tracking functions per event; abstracting into HOC or Custom Hook-based logging modules would be more suitable for concern separation and maintainability.

### Global Unification of Limit Exceeded Modals

- **Problem**: Initially, each feature (embed, rendering, workroom, etc.) had separate limit modal components. UI/UX differed per feature, and upgrade button links were incorrectly connected in some features. The same guidance text was duplicated across 5+ locations.
- **Solve**: Leveraged the common error response returned by the server on limit exceedance to extract the upgrade-inducing modal as a global component. Receives limit exceedance context via props to display appropriate guidance text and links. Unified upgrade button links as common constants.
- **Result**: Modal components consolidated from 5 to 1; consistent upgrade-inducing UX across all features; incorrect link bugs resolved.

### Academic Plan Exception Handling

- **Problem**: The Academic plan had cases where it wasn't processed identically to Pro in API responses. Existing code used a binary branching of Enterprise vs. non-Enterprise only, causing incorrect limits applied to Academic users or wrong plan upgrade guidance displayed.
- **Solve**: Added plan type parameter to all usage-related API calls. Separately branched Academic conditions to reprocess rendering limits, embed limits, and API token availability to Academic-specific standards.
- **Result**: Accurate usage limits applied across all 4 plans: Free / Academic / Pro / Enterprise.

### Space Copy Flow Limit Exceedance Handling

- **Problem**: Space structure copying is a flow that sequentially processes multiple API calls, but when workroom creation limits were exceeded mid-flow, the copy silently failed without any user notification. New items also weren't reflected in the list state after copy completion, leaving the UI un-updated.
- **Solve**: Triggered upgrade-inducing modal on limit exceedance response detection at each copy flow step. Added the created item ID to the list state after copy so UI reflects immediately.
- **Result**: Clear guidance provided on limit exceedance during copy; UI consistency secured after copy completion.

### Conditional Component next/dynamic Lazy Loading

- **Problem**: Usage limit approaching notification banners are displayed to only a minority of users but were included in all users' initial bundles via static import.
- **Solve**: Switched to dynamic import using `next/dynamic`, loading chunks only when banners are actually needed.
- **Result**: Initial bundle size reduced; most users don't load unnecessary code.

### Pricing Page Plan Feature Comparison Section

- **Problem**: The existing Pricing page only had a plan price comparison table, making it difficult for users to understand feature differences between plans. Important information like rendering capacity limits and additional fee policies were inaccurately expressed across multiple languages.
- **Solve**: Newly developed a "Main Features for All Plans" section. Defined plan-specific features as card data structures with support article link connections. Accurately corrected rendering capacity limit and additional fee policy text across 6-language JSON files.
- **Result**: Plan feature comparison available on the Pricing page; self-service enabled through direct support document links.

### Next.js API Route Proxy — Type-Safe Funnel Logging

- **Problem**: (1) Multiple events had different payload structures, causing parameter errors discovered only at runtime. (2) Session ID generation used the `shortid` library with collision potential and deprecation issues. (3) Log API call failures propagated errors upstream, redirecting users to error pages.
- **Solve**: Designed Next.js API Route as a proxy layer to avoid CORS issues and auth token exposure from direct client external API calls. Explicitly defined per-event payload types so client and API Route share identical types. Replaced `shortid` → `uuid` v4. Wrapped log calls in `try-catch` for fire-and-forget handling.
- **Result**: Funnel event type contracts typed; no main UX impact even during log server outages.
- **Insight**: The payment/plan domain has complex business rules and many exception cases. This project clearly demonstrated the need for a design that manages plan policies as data (config) rather than hardcoding plan types in UI code.

## Retrospective / Lessons Learned

When plans that don't fit the existing binary (Enterprise / non-Enterprise) approach — like Academic — are added, the cost of finding and modifying scattered conditional statements throughout the code was high. Building a global interceptor pattern for common limit exceedance handling and a funnel analysis proxy log system together enabled closing the "feature implementation → conversion measurement → improvement" cycle.
