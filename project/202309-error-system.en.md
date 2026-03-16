# Error System

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, Next.js (App Router), TypeScript, React Query v5, Emotion.js, Storybook, Datadog, next/font |
| Period | 2023.09 – 2023.10 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend lead) |

## Overview

A three-phase error system build. Phase 1 (2022.09–2023.02) addressed the problem of a single error page completely blocking user functionality and inefficient error monitoring. Overcame UX objections by analyzing and presenting all error cases, then solely designed and implemented a shared error handling library. Phase 2 (2023.09–2024.06) systematized the error experience for the content app and improved Next.js performance. Phase 3 (2024.10–2025.03) independently designed and built an error UI package and an SSR-specific package to consolidate error handling UI that had been scattered across apps.

## Key Implementations (Phase 1) — Error Handling System

### Error Type Classification & Boundary Separation
- **Problem**: A single error page blocked all user functionality on any error. Inefficient error monitoring at hour/day granularity.
- **Solve**: Classified errors into network, authentication, authorization, server, etc. Separated Partial, Toast, and Global (route-level) Error Boundaries to minimize complete user functionality blocking.
- **Result**: Error tracking possible immediately upon user report. Monitoring efficiency improved from hour/day granularity to minute-level.

### SSR Error Handling Module
- **Problem**: Next.js security policy prevents SSR error tracking in error.tsx
- **Solve**: Due to page component prop constraints, designed `ssrErrorInterceptor` as a closure instead of an HOC. Implemented a workaround to pass error data (status code, Tracking ID, etc.) to the client.
- **Insight**: The workaround of passing SSR errors to CSR before throwing introduces a slight delay in error UI display — an inherent trade-off.

### API Request Layer
- **Solve**: Unified request/response/error handling via Axios Interceptor. Used `axios.isAxiosError()` type guard with TanStack Query retry option for up to 3 retries on 500 errors or network errors.

## Key Implementations (Phase 2) — Error Handling & Performance

### Global Error Pages
- **Problem**: API errors showed blank screens or the default Next.js error screen, resulting in poor user experience.
- **Solve**: Developed `CustomErrorPageView` component with HTTP status code-specific (403/404/500) SVG illustrations, connected to App Router's `error.tsx` / `not-found.tsx` error boundaries.
- **Result**: Brand-consistent feedback in error situations.

### react-query v5 Migration
- **Problem**: v4 → v5 breaking changes (e.g., `cacheTime` → `gcTime` API changes) required updates to all query code across the app.
- **Solve**: Updated common settings in the shared React Query package to v5 first, then migrated per-app usage sites sequentially.
- **Result**: v5's improved type inference and devtools now available.
- **Insight**: The order of updating the shared package first, then apps, was critical. This experience made it tangible how much shared package version abstraction reduces migration costs.

### Font & Zendesk Performance Optimization
- **Problem**: External font and Zendesk widget scripts were blocking initial rendering.
- **Solve**: Optimized fonts with Next.js `next/font`; changed Zendesk script to dynamic loading.
- **Result**: Perceived initial page load speed improved.

## Key Implementations (Phase 3) — Error UI Package & SSR Error Package

### Error UI Package Design (Sole)
- **Problem**: Each app independently implementing error UI led to design inconsistency and code duplication. A Partial Error Boundary pattern was needed to isolate errors at the component level instead of the page level.
- **Solve**: Extracted error UI components into an independent package, sharing `ErrorBox` (inline error), `ErrorBoundaryWithBadge` (status displayed as badge), etc. Designed to work out-of-the-box in multilingual apps with i18n translation support. Integrated with auth app error handler.
- **Result**: Error UI managed from a single source; importable by auth/content apps with a simple import.

### SSR Error Package Design (Sole)
- **Problem**: Client Error Boundaries don't work in Next.js SSR environments, requiring separate server error handling.
- **Solve**: Separated SSR error handling utilities aligned with Next.js `error.tsx` / `global-error.tsx` into a dedicated package.
- **Result**: Consistent error handling in both CSR and SSR environments.

## Retrospective

Error handling easily gets deprioritized below feature development, but proactively building it as a package meant the cost of error handling for new apps added later was nearly zero. This project was the first time I personally felt the impact of partial error boundary patterns on user experience.
