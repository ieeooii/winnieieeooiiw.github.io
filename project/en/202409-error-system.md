---
thumbnail: /images/projects/error-overview.webp
gradient: linear-gradient(135deg, #f8d7da, #f5c6cb)
---

# Frontend Error Handling System Architecture

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | ETC |
| Service | CLO-SET |
| Tech Stack | Next.js (App Router), TypeScript, React Query v5, Emotion.js, Storybook, Datadog, next/font, Rollup, Axios |
| Period | 2024.09 ~ 2025.03 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend in charge) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |
| Blog | [Next.js App Router Error Handling](https://ieeooii.notion.site/Next-js-40774c0161f04c4484a28a9c34d510c5?pvs=143) / [Next.js 14 App Router SSR Custom Error](https://ieeooii.notion.site/Next-js-14-app-router-SSR-Custom-error-22fd2142e651439ea74820342ee0a12d?pvs=143) |

## Overview

An error system architecture carried out in three phases. Phase 1 (2024.09 ~ 2024.10) addressed the problem of a single error page completely blocking user functionality and inefficient error monitoring. Persuaded opposing UX opinions through comprehensive error case analysis and presentation, and solely designed and implemented the shared error handling library. Phase 2 (2024.10 ~ 2024.12) systematized the content app's error experience and improved Next.js performance. Phase 3 (2024.12 ~ 2025.03) solely designed and built an error UI package and SSR-specific package to unify error handling UI that had been scattered across apps.

<div class="img-row-3">

![Route Group-based error boundary design](/images/projects/202409-error-system-route-group.webp)
![Error boundary architecture design](/images/projects/error-handling-case.webp)
![Error case type classification](/images/projects/error-edge-case.webp)

</div>

<div class="img-row-3">

![Screen with Toast, inline error, and viewer error coexisting](/images/projects/error-overview.webp)
![Modal-scoped Toast error](/images/projects/error-modal-toast.webp)
![Auth app Toast error (with Trace ID)](/images/projects/error-auth-toast.webp)

</div>

## Key Implementations (Phase 1) — Error Handling System Architecture

### Error Type Granulation and Boundary Separation

- **Problem**: A single error page completely blocked user functionality on any error. Error monitoring was inefficient at hour/day granularity.
- **Solve**:
  - Granulated errors into network, authentication, permission, server, etc., designing a type system corresponding to HTTP status codes (400/401/403/404/500)
  - **Boundary 3-layer separation**: Component inline errors use Partial Error Boundary (ErrorBox/Badge/InlineText forms), non-blocking notifications use Toast Portal (Global/Modal scope), page-level errors use Next.js `error.tsx` Route Segment isolation
  - Designed Partial Error Boundary with injectable per-error-code UI decision callbacks, separating error handling logic outside components
- **Result**: Implemented a structure enabling immediate error tracking on user reports. Monitoring efficiency improved from hour/day granularity to minute granularity.

### SSR Error Handling Module Construction
- **Problem**: Next.js removes server component error messages in production builds for security. By the time `error.tsx` is reached, debugging information like error codes and Trace IDs is lost.
- **Solve**:
  - **Serialization bypass strategy**: Converts API errors into a struct containing status code, error code, and Trace ID, serializes as JSON string, then throws. Wraps error data in string form before Next.js removes the message, deserializing in `error.tsx` to restore original information
  - **Closure over HOC**: Next.js page components have fixed props structures making HOC patterns inapplicable. Designed as a closure taking the server component function as argument to preemptively catch errors outside Next.js, directly rendering server error handling components on error
  - **Deserialization failure fallback**: On JSON deserialization failure (non-serialized runtime errors, etc.), classifies as a separate error type and sends full stack trace to Datadog to ensure no errors are missed
- **Insight**: Due to the nature of the bypass approach — passing SSR errors to CSR then throwing — a slight delay exists in error UI display timing as a trade-off.

### API Request Layer Construction
- **Problem**: Auth token refresh, error transformation, and request tracking logic were duplicated across apps, causing behavioral inconsistencies and high maintenance costs.
- **Solve**:
  - **3-stage Axios interceptor**: Request stage adds request timestamp custom header for server response delay tracking. Response stage extracts Datadog Trace ID from response headers for log inclusion. Error stage converts AxiosError to a struct with status code, error code, and Trace ID, serializes as JSON string, then throws
  - **Automatic token refresh and retry**: On 401 responses, calls refresh API with cookie refresh token; on success, automatically retries original request. Distinguishes refresh failure states (expired/invalid) by HTTP status code, branching to returnUrl-included logout / session expired page respectively
  - **Auth app independent fetch layer**: Auth app uses native fetch instead of Axios. Implements identical token refresh/retry logic while controlling server-side log output conditions via environment variables
- **Result**: All API errors are converted to consistent error structs, enabling error boundaries and error pages to directly use error codes and Trace IDs without additional processing.


## Key Implementations (Phase 2) — Error Handling

### Global Error Page Construction
- **Problem**: On API errors, blank screens or default Next.js error screens were displayed, creating poor user experience.
- **Solve**: Created custom error page components and HTTP status code-specific (403/404/500) SVG illustrations, connecting them to App Router's `error.tsx` / `not-found.tsx` error boundaries.
- **Result**: Brand-consistent feedback provided in error situations.

### react-query v5 Migration
- **Problem**: react-query v4 → v5 breaking changes (`cacheTime` → `gcTime`, etc.) required app-wide query code modification.
- **Solve**: Updated common settings in the shared React Query package to v5 first, then sequentially migrated app-specific usage.
- **Result**: Enabled v5's improved type inference and devtools.
- **Insight**: Changing shared packages first then apps afterward was the important order. Demonstrated how much shared package version abstraction reduces migration costs.

## Key Implementations (Phase 3) — Error UI Package & SSR Error Package Construction

### Error UI Package Design (Solo)

- **Problem**: Each app implemented error UI separately, lacking design consistency and duplicating code. A Partial Error Boundary pattern for isolating errors at the component level rather than page-level global error handling was needed.
- **Solve**:
  - **Error UI component hierarchization**: Layered into full-screen errors (with HTTP status-specific SVG illustrations) / inline error boxes (sm/lg sizes) / Boundary wrapper components — 3 tiers that can be composed per usage context
  - **Trace ID clipboard component**: Separated Trace ID copy component so Trace IDs can be copied from any error UI. Users can submit Trace IDs to CS channels for fast debugging support
  - **Toast Portal system**: Implemented Global/Modal two-scope Toast Portals separately. Non-UI-blocking errors like mutation errors are handled as non-blocking notifications via scope-specific Toast hooks
  - **Error translation provider**: Injected error message translations via Context so error UI in multilingual apps doesn't directly depend on translations. Documented per-component error scenarios with Storybook
- **Result**: Error UI managed from a single source, usable in each app with just an import. Trace ID-based error tracking flow completed at the UI level.

### SSR Error Package Design (Solo)
- **Problem**: SSR error handling logic implemented within apps in Phase 1 was duplicated independently per app with no consistency. Each new app required re-implementing the same serialization strategy and error interceptors.
- **Solve**:
  - Extracted SSR error interceptors, error struct types, serialization/deserialization utilities, and error transform/throw handlers into an independent package
  - Abstracted Next.js `error.tsx` / `global-error.tsx` integration patterns within the package so each app can unify their implementation approach
  - Separated the package as SSR-only to prevent inclusion in client bundles
- **Result**: New app error handling implementation cost reduced to package installation and integration level. Consistent error handling guaranteed across both CSR/SSR environments.

## Retrospective / Lessons Learned

I directly experienced the impact of partial error boundary patterns on user experience in this project. The effect of treating errors at the infrastructure level on product quality was greater than I expected.
