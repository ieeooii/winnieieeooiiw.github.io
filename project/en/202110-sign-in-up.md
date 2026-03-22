---
thumbnail: /images/projects/202106-sign-in.webp
gradient: linear-gradient(135deg, #ede8e0, #d8d0c4)
---

# Sign In / Sign Up Authentication Flow Complete Redesign

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | ETC |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX (jQuery, Less CSS → React, SCSS migration) |
| Period | 2021.06 ~ 2021.10 |
| Team | Frontend 2, Backend 1, PM 2, Product Designer 1 (Frontend in charge) |
| Service Link | [style.clo-set.com/account/signin](https://style.clo-set.com/account/signin) |

## Overview

Fully migrated and renewed the legacy jQuery + Less CSS authentication flow to React + Emotion.js. Solely responsible for the entire authentication scope: Sign In/Up, password find/reset/set/change, OAuth error handling, re-registration blocking, account locking, and Open Redirect security vulnerability fix.

**Coverage**: Sign In / Sign Up / Find, Reset, Set, Change Password / OAuth (Google, External SW Integration) / Email Verify / SSO / Re-registration Flow / Paid Account Re-registration Prevention

## Key Features

- **Sign In / Sign Up**: Email/password authentication, CAPTCHA, email verification mail delivery
- **Password Management**: Find, Reset, Set, Change dedicated page integration
- **OAuth / SSO**: Google OAuth, external SW credentials, Enterprise SSO
- **Security**: Account locking, paid account re-registration prevention, Open Redirect blocking

<div class="img-row-2">

![Sign in](/images/projects/202106-sign-in.webp)
![Sign up](/images/projects/202106-sign-up.webp)
![Find password](/images/projects/202106-find-password.webp)
![Set password](/images/projects/202106-set-password.webp)
![Change password](/images/projects/202106-change-password.webp)

</div>

## Key Implementations

### Authentication Flow Emotion.js + TypeScript Migration

- **Problem**: Existing Sign In/Up components were built with SCSS + JavaScript, making design token application and dark mode support impossible. MobX store state and error handling logic were scattered within components, making testing and reuse difficult.
- **Solve**: Migrated all account-related components to Emotion.js and converted to TypeScript. Independently separated MobX stores for Sign In / Sign Up / Password, clearly redefining `@observable` / `@action` / `@computed`. Created new common layout components for reuse across all authentication pages.
- **Result**: Entire authentication flow unified on design system basis; clear separation of state management code and UI code.

### Enum State Machine + @computed for Sign Up Step and Form Validity Management

- **Problem**: Sign up is not a simple form submission but a multi-step flow: "form input → CAPTCHA verification → completion (or duplicate email notification)." Splitting each step into separate pages causes state reset issues on URL navigation, while managing steps with multiple `boolean` flags within components causes combinatorial explosion.
- **Solve**: Applied a state machine pattern expressing sign-up steps (form input / completed / duplicate email) as a single enum state value, connecting step-specific components via an object map. Form validation is declaratively defined as condition function + message key pairs for each of email, password, and password confirmation. `@computed get canSubmit()` derives the overall condition, managing the submit button activation as a single source of truth.
- **Result**: Step transition logic consolidated to a single enum minimizing conditional branching; form validity state always derived from the store maintaining UI consistency.

### Multi-Authentication Method Error Handling and postMessage Origin Verification for SSO Spoofing Defense

- **Problem**: Authentication methods include standard ID/PW, Google OAuth, external SW credentials, and Enterprise SSO. Enterprise SSO in particular receives tokens via `postMessage` after IdP authentication completes in a popup, and unregistered account errors require "error notification and retry" instead of "re-registration guidance" unlike OAuth.
- **Solve**: Enterprise SSO opens a popup and receives tokens via `postMessage` events. Only processes tokens after verifying that `event.origin` is an allowed domain to prevent spoofing. On unregistered account errors, branches based on SSO status — SSO shows an error modal (re-registration not possible), while standard OAuth redirects to the terms agreement page. OAuth error code handling uses a dispatch table pattern keyed by error codes for condition-free extensible structure.
- **Result**: Multiple authentication methods handled consistently in a single external authentication store; postMessage origin verification for spoofing defense.

### Login Error and Account Lock Handling via Error Code Dispatch Table

- **Problem**: OAuth login failures (wrong credentials, unverified email, attempt limit exceeded, etc.) and account locking require different content and actions per error code. Branching with `if/else` causes non-linear growth of branching logic with each error case. Account locking also needed consistent handling across multiple entry points including login, password change, and email re-verification banner.
- **Solve**: Mapped each case's modal content (title, body, button action) via a dispatch table keyed by error codes. "Attempt limit exceeded" errors calculate remaining lock time from server response and dynamically display it in the modal. Account lock state is detected from the login store's state observable to trigger the modal — the same modal component is reused from password change and email re-verification banner entry points.
- **Result**: Clear guidance per error code; consistent handling across all entry points in account lock state.

### Password Find / Reset / Set / Change Flow — Single Container Integration

- **Problem**: Existing password-related flows operated on modals, but the new design required dedicated pages. Four types — reset / set / change / initial password change — each have different APIs and parameters but nearly identical UI structure, risking duplicate component proliferation. The `returnUrl` parameter also needed consistent propagation across all entry paths.
- **Solve**: Distinguished password types (reset / set / change / initial change) via enum, using a dispatch table pattern that calls different handlers per type within a single container. `step` observable manages "input stage → completion notification stage" transitions. `returnUrl` propagation unified via a common utility function.
- **Result**: All password scenarios handled in a single container minimizing code duplication; `returnUrl` propagation bugs resolved.

### Form Field Independent Observer Component Separation to Minimize Re-renders

- **Problem**: When multiple fields (email, password, password confirmation) exist in a single form component, any field's state change triggers a re-render of the entire form. Repeated unnecessary re-renders during input can degrade typing responsiveness.
- **Solve**: Separated each form field (email, password, password confirmation) into independent components wrapped with MobX `observer`. Minimized subscription scope so each component only re-renders when its subscribed observable state changes. Ref chains for auto-focus movement to the next field on Enter key press are also managed per component.
- **Result**: Independent re-rendering per field maintains input responsiveness; ref-based keyboard navigation improves form accessibility.

### Paid Plan Account Re-registration Prevention (2022.11)
- **Problem**: When an account that previously used a paid plan re-registers with the same email after withdrawal, it conflicts with existing payment/plan data. A condition bug in the duplicate email handling logic allowed paid accounts to proceed with the re-registration flow.
- **Solve**: Fixed the paid account detection condition in the duplicate email check API response and branched paid plan account re-registration attempts to a separate guidance flow.
- **Result**: Prevented data conflicts from paid account re-registration.

### Open Redirect Security Vulnerability Fix (2024.03)

- **Problem**: A bug in the `returnUrl` parameter validation logic allowed certain malformed input values to pass as valid URLs. This created an Open Redirect vulnerability enabling redirects to arbitrary external domains via crafted links.
- **Solve**: Explicitly blocked malformed string inputs in the `returnUrl` validation function. Replaced the logic with hostname comparison after URL parsing to block all values outside the allowed domain whitelist. Falls back to a safe default path on validation failure.
- **Result**: Open Redirect vulnerability completely blocked; strengthened redirect security in the authentication flow.

## Retrospective

The pre-migration jQuery-based authentication pages were contained within the BE repository, with templates directly bound to BE data keys. Separating into the FE repo broke BE dependencies, enabling FE-driven decisions on component design, state management, and error handling — resulting in a much more independent and extensible architecture.

Sign In/Up is both the service's first entry point and the most security-sensitive area. I learned that the quality of user experience is determined by how meticulously error scenarios are handled. OAuth errors, account locking, and re-registration blocking are invisible in normal flows but are actually encountered by quite a few users. I confirmed in this project that the error code dispatch table pattern has clearly better scalability than `if/else` as cases grow. The Open Redirect vulnerability discovered in 2024 left the lesson that when validating URL parameters, not just empty values but various malformed inputs must be comprehensively considered.
