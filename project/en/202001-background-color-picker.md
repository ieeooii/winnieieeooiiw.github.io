---
thumbnail: /images/projects/202001-background-color-picker.webp
gradient: linear-gradient(135deg, #fce4f0, #f9b8d8)
---

# Viewer Background Color Customization

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, SCSS, react-color |
| Period | 2019.12 – 2020.01 |
| Team | Frontend 1, Backend 1, Designer 1, PM 1 (Frontend lead) |
| Service Link | [style.clo-set.com](https://style.clo-set.com) |

## Overview

A feature for customizing the background color of the 3D garment viewer in two modes: Preset (predefined backgrounds) and Custom Color (user-defined). Real-time preview had to be reflected in the 3D viewer upon color selection, and there was a structural requirement for multiple UI entry points to reference the same color state. This was the first feature where I independently designed a MobX store after joining the company.

![Color palette](/images/projects/201912-color-picker-pc.webp)

## Key Implementations

### Real-Time Viewer Preview via onChange / onChangeComplete Event Separation

- **Problem**: Color state was being copied and managed separately in three places — Viewer Toolbar, Render Settings, and Space Creation Modal — so changing it in one place didn't reflect in the others, causing synchronization inconsistencies. Also, the 3D viewer background needed to update in real time during picker dragging, which required a structure where React state changes and Canvas API calls happened simultaneously.
- **Solve**: Centralized the color list, currently selected color, and picker cursor color as MobX `@observable` in a single store so all three places reference the same source. Separated `react-color`'s `onChange` (real-time during drag) and `onChangeComplete` (selection finalized) — during drag, only the Canvas background change API is called for immediate viewer update, and store state is committed only on selection complete. When a photo background was previously set, manipulating the color picker automatically resets the background before switching to the color. The most recent background setting is saved per item in localStorage and restored on page revisit.
- **Result**: All three components reference the same store, eliminating state synchronization issues; 3D viewer background updates in real time without delay during color picker drag.

### Duplicate Registration Prevention via Optimistic Update and @computed

- **Problem**: When adding a custom color, double-clicking the add button before the API responded would register the same color multiple times. There were cases where deletion triggered a 500 error, and interactions for dismissing the popup via ESC key or outside click were not handled. Additionally, keyboard input inside the color picker was propagating to viewer shortcuts.
- **Solve**: Used `@computed` to derive whether the current color already exists in the list, and based on this, calculated the add button disable condition to block at the UI level — also performed a duplicate check at the store level before API calls for double defense. The button is similarly disabled when the maximum registration count is exceeded. Deletion uses optimistic update by removing from the local array before the API response to improve perceived responsiveness. ESC key and outside click detection are handled through a dedicated hook. Applied `stopPropagation` on the picker container's `keydown` event to block viewer shortcut propagation.
- **Result**: Duplicate registration prevented, keyboard accessibility secured, viewer shortcut conflicts resolved, deletion responsiveness improved.

### Extracting Tightly Coupled Component into a Reusable Independent Structure

- **Problem**: The ColorPicker component was tightly coupled inside a specific page, so reusing it in Render Settings, Space Creation Modal, and other places required copying the code. Multilingual support also had to be handled separately at each usage site, risking omissions.
- **Solve**: Extracted ColorPicker as an independent component where each usage site passes only the required props. Unified i18n keys for batch application.
- **Result**: Eliminated code duplication, applied multilingual support universally, established a structure where new usage sites simply import the component.

## Retrospective

This was the moment I truly felt the answer to "where should state live?" — when multiple components need to share a single state, the state should be lifted to a single source of truth rather than copied into each component. The pattern of separating `onChange` (real-time) and `onChangeComplete` (finalized) also became a principle I repeatedly applied in subsequent real-time interaction implementations.
