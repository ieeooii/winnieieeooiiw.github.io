---
thumbnail: /images/projects/201912-color-picker-pc.png
gradient: linear-gradient(135deg, #fce4f0, #f9b8d8)
---

# 3D Garment Viewer Background Color Customization

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, MobX, SCSS, react-color |
| Period | 2019.12 – 2020.01 |
| Team | Frontend 1, Backend 1, Designer 1, PM 1 (Frontend lead) |
| Service Link | style.clo-set.com |

## Overview

A feature for customizing the background color of the 3D garment viewer in two modes: Preset (predefined backgrounds) and Custom Color (user-defined). To handle the structural challenge of color state being simultaneously referenced and modified in three places — ViewerTools, RenderSettings, and ModalCreateSpace — a single MobX-based store was designed. This was the first MobX store I independently architected after joining the company.

## Key Features

![Color Palette](/images/projects/201912-color-picker-pc.png)

## Key Implementations

### Background Color Change for 3D Garment Viewer
- Collaborated with the backend engineer to design CRUD for the palette color list, and implemented personalization by saving selected color values to cookies
- Worked with the graphics engineer to design and integrate an API for changing the canvas background color
- Consolidated and applied scattered components that were previously built using the react-color package

### Custom Color CRUD + Edge Case Handling
- **Problem**: When adding a custom color, double-clicking the add button before the API responded would register the same color multiple times. There was also a 500 error case on deletion, and popup dismissal via ESC key or outside click (onClickOutside) was not handled.
- **Solve**: Disabled the add button when `colorIndex` already exists to prevent duplicate additions. Fixed the delete API parameter error to resolve the 500 error. Used the `keycode` library for ESC key binding, and finely controlled the outside-click detection area using the `outsideClickIgnoreClass` option.
- **Result**: Custom color add/delete works reliably, duplicate registration prevented, keyboard accessibility secured

### Component Architecture Separation (Refactoring)
- **Problem**: The ColorPicker component was tightly coupled to a specific page (ViewerTools), requiring code duplication to reuse it in ModalCreateSpace, RenderSettings, etc. i18n had to be handled separately at each usage site, risking omissions.
- **Solve**: Extracted ColorPicker as an independent component where each usage site passes only the required props. Unified i18n keys for a single application pass.
- **Result**: Eliminated code duplication, applied i18n universally, established a structure where new usage sites simply import the component

## Retrospective / Lessons Learned

This experience made me realize that when multiple components share a single state, the state should be lifted to a single source of truth rather than copying it into each component — a hands-on lesson in "where should state live?"
