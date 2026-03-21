# Company General Settings Page Development

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, Emotion |
| Period | 2020.07 – 2020.09 |
| Service Link | style.clo-set.com |

## Overview

The Company General Setting page where fashion brand administrators configure company information (name, logo, color), feature activation options (workroom, linesheet, access permissions, viewer), and measurement/currency units. Because the settings items are varied and each is connected to a separate API call, a design was created to **manage toggle options as a declarative data structure (config array)**. Includes confirmation flows for destructive actions like company deletion and transfer that cannot be undone.

## Key Implementations

### Declarative Config Pattern for Toggle Options

- **Problem**: Five or more toggle options — UseCompanyRoom / UseLine / UseAccessiblePeople / ActiveImageViewer / ActivePatternViewer — each called a different API, and each toggle had different modal titles, contents, and on/off labels. Creating separate components or conditional branches per toggle would widen the scope of changes when a new toggle is added.
- **Solve**: Declared each toggle option declaratively as a `CompanyOptionType[]` array — specifying required properties as data: `isOn`, `onToggle`, `modalTitle`, `modalContents`, `onValue/offValue`, etc. The `CompanyOptionList` component iterates over this array to render a consistent toggle UI. Options requiring custom components (measurement unit selector, currency unit selector) are injected via a `component` property.
- **Result**: Extensible structure where a new toggle option can be applied simply by adding one item to the array.

### Company Name Change — Real-Time Validation

- **Problem**: If a company name input containing special characters or prohibited characters is sent to the server, the backend returns an error. From the user's perspective, receiving real-time validation feedback during input is a better UX than receiving a failure message after pressing the save button.
- **Solve**: Validated input in real time using the `checkFilenameValidity()` utility function. When invalid, passed a `helpMessage` to the `SettingInput` component to display an inline error message. On the `onBlur` event, blocked the API call itself if the input is invalid at the time of server submission. Character limit managed via the `CHARACTER_LIMIT.SPACE_NAME` constant applied uniformly to the input field's `maxLength`.
- **Result**: Invalid names blocked from reaching the server entirely; users receive immediate feedback during input.

### Destructive Actions — Company Deletion / Transfer

- **Problem**: Company deletion is an irreversible action that permanently deletes all content and settings. Company transfer (Transfer) is conditionally displayed based on plan conditions and has a separate accept/reject flow. Providing these two actions as plain buttons creates a risk of accidental execution.
- **Solve**: Applied a "type the name to confirm" pattern by passing the company name to `ItemDeleteModal` for deletion. After deletion, automatically redirects to the dashboard. `CompanyTransferContainer` is conditionally rendered based on plan conditions. Used a `CompanyInfoSettingModal` enum to manage the currently open modal type as a single state, preventing multiple modals from opening simultaneously.
- **Result**: Double confirmation flow for destructive actions implemented; modal state conflicts prevented.

### Measurement Unit / Currency Unit Settings

- Developed `CompanyMeasurementUnitSetting` for changing 3D pattern measurement units (INCH/CM/MM) — prevents duplicate requests with `isMeasurementUnitUpdating` loading state during unit change API calls.
- Developed `CompanyCurrencyUnitSetting` for setting currency units — receives `getCurrencyUnit` / `updateCurrencyUnit` as injected props to separate fetch and update operations.
- On viewer option toggle (image viewer / pattern viewer activation) changes, calls `store.reloadItems()` to immediately refresh the content list.

## Retrospective / Lessons Learned

Settings pages look like "simple forms," but each item is connected to a different API and must handle individual failure cases and loading states. Managing toggle options as a declarative config array has a slightly higher upfront design cost, but the benefit is that new options can be added later without touching component code. This work reaffirmed that knowing when to abstract a repeating pattern is the essence of good design.
