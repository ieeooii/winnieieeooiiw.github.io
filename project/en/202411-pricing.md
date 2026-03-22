---
thumbnail: /images/projects/202505-pricing.png
gradient: linear-gradient(135deg, #e8f0e8, #c8d8c8)
---

# Pricing Plan & Usage Limit System

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, React Query, MobX |
| Period | 2024.09 – 2024.11 |
| Team | Frontend 4, Backend 3, Product Designer 2, PM 3 (Usage limit system owner) |
| Service Link | [style.clo-set.com/service/pricing](https://style.clo-set.com/service/pricing) |

## Overview

Divided into Phase 1 (2022) — data-driven resolution of paid conversion rate decline during pricing policy revision — and Phase 2 (2024–2025) — implementing five or more independent usage limit systems across the Free / Academic / Pro / Enterprise four-plan structure.

## Key Implementations — Paid Conversion Rate Improvement (Phase 1)

### FE Logging Design & Implementation
- **Solve**: Coordinated event specs with DE/DA. Implemented `trackEvent()`-based logging at key conversion funnel touchpoints — clicks, views, CTAs, etc.

### Funnel Analysis-Based UX Improvement
- **Solve**: Identified low-conversion segments via funnel analysis and developed/applied improved UX/UI.
- **Result**: Achieved ~+10% paid conversion rate at pricing policy rollout. Additional +4% improvement from funnel analysis-based UX improvements (total +14% increase).
- **Insight**: Implemented by calling `trackEvent()` directly per event. Abstracting into an HOC or Custom Hook-based logging module would be more appropriate for separation of concerns and maintainability.

## Key Implementations — Per-Plan Usage Limit System (Phase 2)

### Global UsageLimitExceededModal Unification

- **Problem**: Initially, each feature (embed, rendering, workroom, etc.) had its own separate limit modal component. UI/UX differed per feature, and some features had bugs with incorrect upgrade button links. The same guidance text was duplicated across 5+ locations.
- **Solve**: Leveraged the common error response pattern the server returns for all limit exceedances to extract the upgrade prompt modal as a global component. Receives limit-exceeded context via props to display appropriate guidance and links. Unified upgrade button links to shared constants.
- **Result**: 5 modal components → 1 unified modal; consistent upgrade prompt UX across all features; incorrect link bugs resolved

### Academic Plan Exception Handling
- **Problem**: Academic plan wasn't treated identically to Pro in certain API response cases. Existing code only branched on Enterprise vs. non-Enterprise, so Academic users sometimes received incorrect limits or wrong plan upgrade prompts.
- **Solve**: Added a plan type parameter to all usage-related API calls. Separated Academic conditions to reprocess direct upload rendering limits, embed limits, and API token availability according to Academic plan criteria.
- **Result**: Correct usage limits applied to all four plans: Free / Academic / Pro / Enterprise

### Copy Space Structure Usage Limit
- **Problem**: Space structure copying involves sequential multi-step API calls. When the workroom creation limit was exceeded mid-process, copying silently failed with no user guidance. There was also a bug where `newSpaceId` wasn't reflected in home store's `itemData` after copying, leaving the UI unupdated.
- **Solve**: Triggered `UsageLimitExceededModal` upon detecting a limit-exceeded response at each step in the copy flow. Added `newSpaceId` to home store's `itemData` for immediate UI refresh after copying.
- **Result**: Clear guidance provided when limit is exceeded mid-copy; UI consistency maintained after copy completion

### Bundle Splitting with next/dynamic
- **Problem**: The `PreLimitAlertBanner` component is only displayed to a small number of users approaching their usage limit, but was statically imported and included in every user's initial bundle.
- **Solve**: Switched to dynamic import via `next/dynamic` so the chunk only loads when the banner is actually needed.
- **Result**: Reduced initial bundle size; most users no longer load unnecessary code

### Pricing Page Redesign — Main Features Section
- **Problem**: The existing Pricing page only had a plan price comparison table, making it difficult for users to understand feature differences between plans. Important information like rendering capacity limits and additional billing policies was inaccurately expressed in multiple languages.
- **Solve**: Developed new "Main Features for All Plans" section. Defined per-plan features as card data structures with support article links (`href`). Accurately corrected rendering capacity limit and additional billing policy text across 6 language JSONs.
- **Result**: Feature comparison between plans now possible on the Pricing page; direct links to support documents enable self-service

### Event Log Proxy API (Conversion Funnel Analysis)
- **Problem**: ① Payload structures varied across events, causing parameter errors to only be discovered at runtime. ② Session ID generation used the `shortid` library with collision risk and deprecation issues. ③ Log API call failures propagated errors upward, redirecting users to an error page.
- **Solve**: Designed Next.js API Route as a proxy layer to handle CORS issues and prevent auth token exposure from direct client-side external API calls. Explicitly defined per-event `stepData` types in `types/proxy.ts` so client and API Route share the same types. Replaced `shortid` with `uuid` v4. Wrapped log calls in `try-catch` for fire-and-forget processing.
- **Result**: Funnel event type contracts typed; main UX unaffected even during log server outages
- **Insight**: Payment/plan domains have complex business rules and many edge cases. This work made it clear that plan policies should be managed as data (config) and plan types should never be hardcoded directly in UI code.

## Retrospective / Lessons Learned

When a plan like Academic doesn't fit the existing binary (Enterprise / non-Enterprise) framework, the cost of finding and updating all scattered conditionals throughout the code is high. Building the global limit-exceeded interceptor pattern and funnel analysis proxy log system together enabled closing the "implement feature → measure conversion → improve" cycle.
