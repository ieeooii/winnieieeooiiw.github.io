# Developer API / Webhook Settings UI Development

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion, i18next |
| Period | 2022.09 – 2022.10 |
| Service Link | style.clo-set.com |

## Overview

Developed the Developer settings page and Webhook trigger UI enabling CLOSET API calls from external systems. Owned the full flow: API Key issuance, re-issuance, and deletion; Webhook event type selection (content creation/deletion, etc.) and endpoint URL registration. As the first entry point of the Developer Experience (DX) allowing external developers to integrate CLOSET data with their own systems, the core design challenge was how to express the **API Key security lifecycle** and **Webhook event subscription model** at the UI level — well beyond simple CRUD.

## Key Implementations

### API Key Lifecycle Management UI Design

- **Problem**: API Keys have three state transitions: issuance, re-issuance, and deletion. In particular, **re-issuance immediately invalidates the existing key** — a destructive action. If an external system is actively integrating with an existing key and the user accidentally clicks re-issue, all integrations are severed instantly. If the UI fails to adequately communicate this risk, users can perform the action without understanding the consequences.
- **Solve**: Placed a two-stage `confirmation dialog` on the re-issue button — the first warns "your existing API Key will be immediately invalidated," the second requires explicit user confirmation (type-to-confirm pattern). Issued keys are masked (`****`) with a clipboard copy icon to minimize the time the key value is exposed on screen. API Key state (not issued / issued / issuing) managed as MobX observable for the UI to always stay synchronized with server state.
- **Result**: Reduced support inquiries related to API Key re-issuance; established UX where users fully understand the consequences before performing destructive actions.

### Webhook Event Subscription Model UI

- **Problem**: Webhooks configure "which event triggers" "which URL" for notifications. Multiple event types (content create / update / delete, etc.) were needed, with the ability to configure different endpoint URLs per event type. The backend API spec changed mid-development, altering the parameter structure, causing the existing implementation to send incorrect requests to the server.
- **Solve**: Separated Webhook configuration state into a dedicated store to manage per-event-type URL state independently. Refactored parameter structure per API spec change, and explicitly defined request/response types so that spec changes can be caught at compile time via type checking. Added URL validation function to block registration of invalid endpoints.
- **Result**: Webhook per-event URL registration, modification, and deletion working reliably; subsequent API spec changes detectable immediately via type errors.

### Multilingual Integration & Developer Documentation Links

- Applied full multilingual support (6 languages) to the Developer settings page via the design system's `ConfigProvider`.
- Connected external API documentation (tutorial page) links contextually so developers can access API references directly from the settings screen.

## Retrospective

Developing the Developer settings page taught me the importance of reflecting the perspective that "an API Key is not a simple text field — it's a security asset" in UI design. For irreversible actions like re-issuance, making them **harder to execute** is actually better UX. Working with Webhook-style features where a contract structure between external systems must be expressed in UI also made it clear that **the server and client must share the same type contract** to minimize side effects when specs change.
