# Sign In / Sign Up Authentication Flow Redesign

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion.js |
| Period | 2021.06 – 2021.10 |
| Team | Frontend (sole owner) |
| Service Link | style.clo-set.com |

## Overview

Fully redesigned the SCSS-based legacy authentication flow to Emotion.js. Solely owned the entire authentication scope: Sign In/Up, password find/reset/set/change, OAuth error handling, re-registration blocking, account lock, and Open Redirect security vulnerability fix.

**Scope**: Sign In / Sign Up / Find·Reset·Set·Change Password / OAuth (Google, external SW) / Email Verify / SSO / Re-registration flow / Paid account re-registration prevention

## Key Implementations

### Full Auth Flow SCSS → Emotion.js + TypeScript Migration
- **Problem**: Existing Sign In/Up components were built with SCSS + JavaScript, making design token application and dark mode support impossible. MobX store state and error handling logic were scattered inside components, making testing and reuse difficult.
- **Solve**: Migrated all account-related components to Emotion.js and converted to TypeScript. Separated MobX stores for `sign-in.ts`, `sign-up.ts`, and `password-setting.ts` with clearly redefined actions and observables. Created new shared layout components: `AccountContentStyled.tsx`, `SiteMiniFooterLayout.tsx`, etc.
- **Result**: Entire auth flow unified under the design system; clear separation of state management code from UI code

### Password Find / Reset / Set / Change Flow
- **Problem**: The existing password flow operated in modal form, but the new design required dedicated pages. The `returnUrl` parameter needed to propagate consistently across all entry points, and each error code scenario (invalid token, expired link, etc.) required individual handling.
- **Solve**: Unified `returnUrl` handling via `redirectReturnUrl` function in `redirect.js`. Consolidated set/reset/change into a single container with `PasswordSettingContainer.tsx`. Defined error code enums and branched UI per case.
- **Result**: All password scenarios handled in a single container, minimizing code duplication; `returnUrl` propagation bugs resolved

### OAuth Sign In Error Scenario Handling
- **Problem**: Logging in with an external SW account with invalid credentials or an unregistered account would cause the UI to freeze on a white screen or display incorrect messages.
- **Solve**: Developed new `OAuthSignInErrorModal.tsx` showing error messages per OAuth login failure code. `sign-in.ts` classifies error codes via the error response provider and triggers the appropriate modal.
- **Result**: Clear error guidance provided to users on OAuth login failure; white screen freeze resolved

### Paid Plan Account Re-registration Prevention (2022.11)
- **Problem**: An account that had previously held a paid plan and then withdrew could re-register with the same email, causing conflicts with existing payment/plan data. The condition for detecting paid accounts in the duplicate email check API response was incorrectly handled, allowing paid accounts to proceed through the re-registration flow.
- **Solve**: Fixed the `paid` condition in the duplicate email check API response; branched to a separate guidance flow when a paid plan account attempts re-registration. Added GA event tracking for this scenario.
- **Result**: Data conflicts from paid account re-registration prevented

### Account Locked Feature (2023.07)
- **Problem**: When an account was locked (e.g., excessive failed login attempts), users were blocked from logging in with no guidance. Multiple entry points — password change, OAuth login attempts, email re-verification banners — each needed appropriate guidance.
- **Solve**: Developed new `AccountLockedErrorModal.tsx`. Added `errorData` to `OAuthSignInErrorModal.tsx` for account lock error code handling. Added account lock state detection with appropriate guidance branching in `BannerResendEmail.tsx` and `password/setting.tsx`.
- **Result**: Consistent guidance provided across all entry points when account is locked

### Open Redirect Security Vulnerability Fix (2024.03)
- **Problem**: The `checkDomain` function in `authenticator.js` returned `true` when the `returnUrl` parameter was the string `"undefined"`. This enabled an Open Redirect vulnerability where malicious links with `returnUrl=undefined` could redirect to arbitrary domains.
- **Solve**: Explicitly blocked cases where `returnUrl` is the string `"undefined"` in `checkDomain`. Fixed the base URL removal logic so domain validation works correctly. Separately fixed the SW login redirect path.
- **Result**: Open Redirect vulnerability fully closed; redirect security in the authentication flow strengthened

## Retrospective

Sign In/Up is the first entry point to the service and the most security-sensitive area. How thoroughly error scenarios are handled determines the quality of the user experience. OAuth errors, account locks, and re-registration blocking are invisible in the happy path but actually encountered by a significant number of users. The Open Redirect vulnerability found in 2024 left the lesson: when validating URL parameters, always handle edge cases like string `"undefined"` and `"null"` — not just empty values.
