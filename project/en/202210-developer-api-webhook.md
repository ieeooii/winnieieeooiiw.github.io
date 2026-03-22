---
thumbnail: /images/projects/202005-webhook-trigger.webp
gradient: linear-gradient(135deg, #d0d4dc, #b0b5c0)
---

# External Integration API Key Management & Event Notification Settings UI Development

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion, i18next |
| Period | 2022.09 – 2022.10 |
| Team | Frontend 1, Backend 1, Product Designer 1 (Frontend owner) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

Developed the Developer settings page and Webhook trigger UI enabling CLOSET API calls from external systems. Owned the full scope: API Key issuance, re-issuance, and deletion; key masking and clipboard copy; Webhook event type selection (content upload, sharing, Colorway status change, etc.) and endpoint URL and auth header registration, modification, and deletion UI. Plan-based feature gating (Enterprise / Premium only for API Token activation) was also included. Beyond simple CRUD, the core design challenge was how to express the **API Key security lifecycle** and **Webhook event subscription model** at the UI level.

<div class="img-row-2">

![Webhook trigger settings](/images/projects/202005-webhook-trigger.webp)
![API token settings](/images/projects/202005-webhook-api-token.webp)

</div>

## Key Implementations

### API Key Lifecycle Management — Re-Issuance UX and MobX State Synchronization

- **Problem**: API Keys have three state transitions: issuance, re-issuance, and deletion. In particular, **re-issuance immediately invalidates the existing key** — a destructive action. If an external system is actively integrating with an existing key and the user accidentally clicks re-issue, all integrations are severed instantly. If the UI fails to adequately communicate this risk, users may perform the action without understanding the consequences.
- **Solve**: Placed a confirmation dialog on the re-issue button forcing explicit user acknowledgment that "the existing API Key will be immediately invalidated." Issued keys are shown only in a dedicated modal and masked (`****`) with a clipboard copy icon once the screen is exited, minimizing key exposure time. The key list is managed as a MobX observable array, and on re-issuance response the corresponding item is immediately replaced to synchronize UI and server state. Components manage modal open/close and currently displayed token as local state, with store action results driving updates in a clear separation of roles.
- **Result**: Reduced support inquiries related to API Key re-issuance; established UX where users fully understand the consequences before performing destructive actions.

### Webhook Subscription Model — TypeScript Type Contract and Input Validation

- **Problem**: Multiple event types (content upload / sharing / Colorway status change, etc.) existed with independently configurable endpoint URLs per event type. The backend API spec changed mid-development, altering the parameter structure, causing the existing implementation to send incorrect requests to the server. Additionally, saving invalid endpoint URLs or incomplete auth headers would cause Webhook delivery failures that users would only discover after the fact.
- **Solve**: Separated Webhook configuration state into a dedicated MobX store, and used `@computed` to filter already-registered event types for automatic exclusion from the new registration dropdown (preventing duplicates). Explicitly defined event types, trigger states, and action types as TypeScript enums, and request bodies as interfaces, establishing a type contract that catches spec changes at compile time. For input stability, derived HTTPS URL validation and auth header key/value completeness checks via `useMemo`, disabling the save button when conditions aren't met. Auth header values are masked on focus-out to minimize screen exposure. Each item stores an original snapshot field alongside current input values, and if there's no actual change, the API call is blocked entirely. Deletion uses optimistic update by removing local state before the API response for improved perceived responsiveness; modifications use a request-in-progress flag to prevent duplicate submissions.
- **Result**: Webhook per-event URL registration, modification, and deletion working reliably. Subsequent API spec changes detectable immediately via type errors.

### UI State Isolation via API Response Type Extension

- **Problem**: Per-Webhook item UI-only state such as request-in-progress status and auth header configuration needed tracking. Adding this state directly to the API response type would mix API layer and UI layer responsibilities.
- **Solve**: Defined a separate UI-specific interface extending the API response type to isolate request-in-progress status, auth header configuration, and similar UI states. On API response receipt, the store converts items to the extended type and initializes per-item UI state. Original snapshot fields (`originUrl`, `originAuthHeaderKey`, etc.) are also included in the extended interface, making change detection logic explicit at the type level.
- **Result**: Per-item UI state managed independently without polluting the API response type; impact scope on API spec changes confined to the extended type.

## Retrospective

Developing the Developer settings page taught me the importance of reflecting the perspective that "an API Key is not a simple text field — it's a security asset" in UI design. For irreversible actions like re-issuance, making them "harder to execute" is actually better UX. When expressing a contract structure with external systems in UI, as with Webhooks, I realized that **the server and client must share the same type contract** to minimize side effects when specs change. MobX's `@computed` for derived state management and `runInAction` pattern proved especially effective for maintaining state consistency in asynchronous flows.
