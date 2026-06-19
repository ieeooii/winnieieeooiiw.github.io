---
thumbnail: /images/projects/202602-aistudio-signin.webp
gradient: linear-gradient(135deg, #e9e4ff, #c4b8f0)
---

# AI Studio Sign-In — Adding a New Product to Shared Auth

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | ETC |
| Service | CLO-SET / AI Studio |
| Tech Stack | Next.js (App Router), React, TypeScript, Emotion |
| Period | 2026.02 ~ 2026.03 |
| Team | Frontend 1 (in charge) |
| Service Link | [style.clo-set.com/account/signin](https://style.clo-set.com/account/signin) |

## Overview

Added a new product, **AI Studio**, to the single sign-in surface shared across several sibling products. When a user arrives from AI Studio, the page detects it and renders the AI Studio-branded sign-in screen, plus a separate sign-in flow for enterprise license users. Core logic — authentication, validation, redirect — is reused from the existing shared flow, so the new product is layered on through a single thin branch at the presentation layer.

![AI Studio-branded sign-in screen](/images/projects/202602-aistudio-signin.webp)

<div class="img-row-2">

![Responsive — desktop](/images/projects/202602-aistudio-signin-responsive-tablet.webp)
![Responsive — mobile](/images/projects/202602-aistudio-signin-responsive-mobile.webp)

</div>

## Key Implementation

### Adding a new product branch without duplicating logic

- **Problem**: The new product needed its own branding and an enterprise entry point, but duplicating the sign-in / validation / redirect flow per product would be unmaintainable. The shared sign-in surface already served several sibling products, so every added branch raised the cost of duplication.
- **Solve**: Confined the branch to a **single point in the presentation layer**. Only the view component is swapped when the incoming product is AI Studio; all logic — sign-in, error handling, terms/marketing-consent modals, redirect — stays in the shared container and hook. The new view is composed by recombining the existing form primitives.
- **Result**: Per-product screens come down to a thin view layer while core logic is inherited unchanged. Adding a product now converges to "a detection branch plus an identifier."

### Entry-path-based product detection with open-redirect protection

- **Problem**: Referrer and cookies alone couldn't reliably tell which product a user was signing into. At the same time, the auth surface serves many domains, so trusting an attacker-controllable redirect URL risks open redirects and token leakage.
- **Solve**: On entry, normalize the origin of the redirect-target URL and match it against each product's domain to determine the product. Reject insecure (`http`) origins at the detection stage, and perform the actual redirect only when it passes an **allowed-domain allow-list**, falling back to a default path otherwise. Navigation to a sibling product hands off a short-lived auth code rather than exposing the access token in the URL. (Built on the redirect-URL validation policy hardened in earlier work.)
- **Result**: A single detection path consistently drives branding, background, and side panel, and any unvalidated redirect is safely blocked.

### A separate flow for enterprise license sign-in

- **Problem**: Enterprise users sign in with a **license account** rather than email/social, and the server contract and error taxonomy differ entirely from the general flow. Entering with the wrong product or an unauthorized account also had to be handled safely.
- **Solve**: Split enterprise sign-in into a dedicated screen that **validates the target product identifier server-side against an allow-list** before rendering the form (invalid → redirected back to sign-in). Map responses to a structured error taxonomy, and branch non-trivial cases — such as "account requires admin setup" — into a distinct guidance step that tells the user what to do next. The product entry buttons on the personal sign-in screen link into this flow with the right product while preserving the current context.
- **Result**: General and enterprise sign-in are cleanly separated, with permission/product checks blocked server-side up front. Sign-in is expressed as steps (form input → signing in → admin setup required) for precise feedback.

<div class="img-row-2">

![CLO enterprise license sign-in](/images/projects/202602-aistudio-signin-clo-enterprise.webp)
![MD enterprise license sign-in](/images/projects/202602-aistudio-signin-md-enterprise.webp)

</div>

### Type-safe localization for new copy

- **Problem**: New product and enterprise sign-in copy (enterprise account login, license guidance, terms, admin-setup notices, unsupported-license errors, etc.) had to be added to five-plus languages without omission, and a missing key must not cause a runtime break.
- **Solve**: Declared every new key in the dictionary type and reflected it across all locale dictionaries simultaneously. Components pull copy through a dictionary hook, so a key missing in any locale is **caught at compile time**.
- **Result**: Missing translations for the new product's copy are blocked by the type system, guaranteeing equal coverage across all languages.

### Per-product branding and background branching

- **Problem**: The same auth screen had to express AI Studio's own identity (dedicated logo, background, side panel) without breaking the existing layout skeleton.
- **Solve**: Conditionally switch the background animation, side panel, and branding assets by the incoming product value, applying a dedicated logo reflecting its beta stage. Repeated elements such as entry-button icons were extracted into reusable components.
- **Result**: Product-specific visual identity branches while the shared layout is preserved, so other products can extend their branding through the same pattern.

## Retrospective

The core question was "how low can the cost of adding a new product go?" By narrowing the branch to a single point in the presentation layer and sharing the entire auth logic, adding a new product converged close to changes in screen, copy, and entry point. Conversely, for areas where a mistake becomes an incident — security and localization — I deliberately chose to "enforce defense through types and server-side validation": redirects via an allowed-domain list, product entry via a server-side allow-list, localization via the dictionary type. In a system where many products share one surface, how firmly the common logic is shared and how thin the branches are kept is itself the measure of extensibility.
