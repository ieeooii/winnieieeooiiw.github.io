---
thumbnail: /images/projects/202007-company-general-setting.webp
gradient: linear-gradient(135deg, #e0f2fe, #bae6fd)
---

# Storage General Setting Page Development

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion (jQuery → React migration) |
| Period | 2020.07 ~ 2020.09 |
| Team | Frontend 1 (in charge) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

A Company General Setting page where fashion brand administrators configure company information (name, logo, color), feature activation options (Workroom, Line Sheet, access permissions, viewer), and measurement/currency units. Since settings are diverse and each is linked to different API calls, **toggle options were designed as a declarative data structure (config array)**. Confirmation flows for destructive actions like company deletion and transfer are also included.

The page store was separated into root store → page-specific store using the Composition pattern. All API actions use `@action.bound` to guarantee `this` binding, and state changes after async completion are always wrapped in `runInAction` to comply with MobX strict mode.

![Storage General Setting page](/images/projects/202007-company-general-setting.webp)

## Key Implementations

### Declarative Config Pattern Design for Toggle Options

- **Problem**: 5+ toggle options each call different APIs, and each toggle has different modal titles, content, and on/off labels. Creating separate components or conditional branches for each toggle would widen the code change scope when adding new toggles.
- **Solve**: Defined each toggle option's properties (active state, handler, confirmation modal content, on/off labels) as a type and managed them declaratively in a config array. The toggle list component iterates this array to render consistent UI. Items requiring custom UI (measurement unit selector, currency unit selector) are handled via a `customNode` property that injects `ReactNode`.
- **Result**: An extensible structure where new toggle options can be applied by simply adding one entry to the array.

```typescript
interface ToggleOption {
  isOn?: boolean;
  onToggle?: () => void;
  onLabel?: string;
  offLabel?: string;
  confirmTitle?: string;    // Omit to execute immediately without confirmation modal
  confirmMessage?: string;
  customNode?: ReactNode;   // Render custom component instead of toggle
}
```

The toggle list component processes toggles by either executing immediately or going through a confirmation modal based on the presence of `confirmMessage`. Modal content is reset after the closing animation completes to prevent flickering during close.

```typescript
const handleToggle = (option: ToggleOption): void => {
  if (!option.confirmMessage) {
    option.onToggle?.();   // Execute immediately for toggles that don't need confirmation
    return;
  }
  showConfirmModal(option);  // Route through modal for toggles that need confirmation
};
```

---

### Company Name Change — Real-Time Validation

- **Problem**: When special or prohibited characters are included in the company name input and sent to the server, the backend returns an error. From the user's perspective, receiving real-time feedback during input is better UX than getting a failure message after pressing the save button.
- **Solve**: Real-time validation of input values using a validation utility function. When invalid, a `helpMessage` is passed to the input component to display an inline error message. API calls are blocked if the value is invalid at `onBlur`. Character limits are managed as shared constants and applied uniformly via `maxLength`. Store actions also have early returns when the value is empty or identical to the existing value, blocking unnecessary API calls.
- **Result**: Invalid names are completely prevented from being sent to the server; users receive immediate feedback during input.

---

### Company Deletion / Transfer Destructive Action Handling

- **Problem**: Company deletion is an irreversible action that permanently deletes all content and settings. Company transfer visibility depends on plan conditions, with separate accept/reject flows. Both actions risk accidental execution if provided as simple buttons.
- **Solve**: Applied a "type the name to confirm" pattern for company deletion. Auto-redirect to dashboard after deletion. Transfer component is conditionally rendered based on plan conditions. Open modal type is managed as a single enum state to prevent multiple modals from opening simultaneously. Transfer flow state is created as a local store scoped to the component lifecycle, isolated from the page store.
- **Result**: Double confirmation flow for destructive actions; modal state conflict prevention.

```typescript
// Manage open modal as a single enum value — two modals cannot be open simultaneously
enum ActiveModal { CONFIRM, DELETE, ERROR }

const [activeModal, setActiveModal] = useState<ActiveModal>();
const isDeleteOpen = activeModal === ActiveModal.DELETE;
```

---

### Measurement Unit / Currency Unit Settings

- **Problem**: Measurement unit changes need to synchronize with an external service along with the main settings save. Sequential calls increase wait time, and re-changes during updates can cause duplicate requests.
- **Solve**: Parallel API calls with `Promise.all` to reduce wait time. Loading flag to block re-requests before completion. Currency unit component has query and update actions injected via props so the component doesn't depend on the API structure.
- **Result**: Reduced update response time, duplicate request prevention, currency unit component reusability secured.

```typescript
// Parallel update of two systems then batch state update via runInAction
await Promise.all([
  api.updatePrimary(params),
  api.syncExternal(params),
]);

runInAction(() => {
  this.value = newValue;
  this.isLoading = false;
});
```

## Retrospective / Lessons Learned

A settings page may look like a "simple form," but each item is connected to a different API and needs its own failure case and loading state handling. The approach of managing toggle options declaratively as a config array has a slightly higher initial design cost, but the advantage is that component code doesn't need to be touched each time a new option is added. This project reconfirmed that the core of design is judging the right time to abstract repeated patterns.
