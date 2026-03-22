---
thumbnail: /images/projects/202106-design-system.svg
gradient: linear-gradient(135deg, #fce7f3, #ede9fe)
---

# Design System

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | React, TypeScript, Emotion.js, Storybook, Rollup, tippy.js |
| Period | 2021.06 – 2024.11 |
| Team | Frontend 4 (bundle optimization sole lead) / Frontend (sole design & implementation) |

## Overview

Built and evolved the design system across four phases. Phase 1 (2021.06–2022.08) resolved UX inconsistencies from duplicate components and bundle size issues, achieving an 82% bundle size reduction and Lighthouse score of 95. Followed by service-specific component additions (2022.03–2022.12), internal design system v1 common component proposals and designs (2022.07–2024.11), and design system v2 (2023.07–2023.12).

## Key Implementations — Bundle Optimization & Foundation (Phase 1)

### Bundle Optimization
- **Problem**: Increasing design system bundle size slowing initial load
- **Solve**: Enabled tree-shaking via Rollup named exports and `sideEffects: false`, so only actually used components are included in the bundle. Converted to ESM format and used Rollup externals to eliminate duplicate bundling of React and Emotion. Moved Emotion.js to peerDependencies so it's managed as a single instance at the application level. Measured pre/post optimization with bundle analyzer to verify 82% reduction.
- **Result**: Design system bundle size reduced by 82% (Client: 2.55MB → 72.66KB / Node.js: 2.54MB → 126.01KB). Initial JS load reduced from 398KB to 185KB. Lighthouse performance score reached 95.

### Component Design Patterns
- **Solve**: Designed Headless component-based architecture for per-service style extensibility. Implemented flexible composition using the Compound Component pattern. Form components support both Controlled and Uncontrolled modes.

### Design Token System
- **Solve**: Designed a common style system based on Design Tokens to minimize color and typography discrepancies between designers and developers.

## Key Implementations — Service-Specific Components (Phase 2)

### Tooltip.tsx / TooltipMenu.tsx
- **Problem**: Tooltips were needed across the service, but each component was directly importing `tippy.js` or implementing tooltips in its own way. `@tippyjs/react` had a constraint preventing simultaneous use of `visible` and `trigger` props.
- **Solve**: Designed `BaseTooltip.tsx` as the base layer, with `Tooltip` (standard) and `TooltipMenu` (menu-style) variants built on top. Controlled/uncontrolled mode is automatically determined by the presence of the `visible` prop. Exposed service-relevant props: `fixedPosition`, `showShadow`, `zIndex`, `TextButton`. Wrote Storybook MDX documentation.
- **Result**: Consistent Tooltip UX across the service; eliminated duplicate direct tippy.js usage

### PickerFrame.tsx / PickerDropdown.tsx
- **Problem**: Every dropdown selection UI component like `FilterCategory.tsx` was independently implementing open/close state, position calculation, and outside-click detection, leading to severe code duplication. Dropdowns needed to be hidden without `display: none` (to avoid layout recalculation).
- **Solve**: Designed `PickerFrame.tsx` (dropdown container) and `PickerDropdown.tsx` (dropdown panel) as separate components. Used `width: 0` in hidden state to conceal without layout impact. Migrated `FilterCategory.tsx` to this component and extracted common styles to `shared/styles/select.ts`.
- **Result**: Dropdown logic centralized; new Select-type components can be built on top of PickerFrame, improving development speed

### Thumbnail.tsx (Lazy Load + Ratio)
- **Problem**: Thumbnail images were used throughout the service (content lists, Line Sheet thumbnails, etc.), but each usage site independently implemented lazy loading and aspect ratio handling. Empty space before images loaded was causing layout shifts.
- **Solve**: Developed `useBackgroundImageLazyLoad.ts` custom hook and embedded it in `Thumbnail.tsx`. Applied `aspect-ratio` CSS dynamically via `ratio` prop. Used `blankContent` type to show skeleton before image load. Immediately utilized in `LineSheetThumbnailImage.tsx`.
- **Result**: Lazy loading and layout shift prevention handled in one component; duplicate implementations eliminated

### Icon Components
Added service-specific icons (`ExcelLineSheetIcon`, `ColorwayIcon`, `InfoTextIcon`, `ChangeOrderIcon`, `HandleOrderIcon`, `SortUpListIcon`, `SortDownListIcon`, `CopyIcon`, `QRIcon`, `UmmIcon`, etc.) to the design system. Implemented as SVG components controllable via `size` and `color` props.

## Common Components (Phase 3)

### Skeleton Component (2022.07–2022.09)
Proactively proposed this work, judging that showing a blank screen or spinner during loading states was bad for user experience.
- **Problem**: No Skeleton components existed; loading states were handled only with blank screens or spinners.
- **Solve**: Designed Headless UI structure based on `BaseSkeleton.tsx`. Implemented an extensible structure combining `shape (rectangle/circle)`, `variant`, and `animation (wave/pulse/false)` props. Used `:empty` CSS selector to automatically show skeleton UI for `undefined`, `null`, or `boolean`. Added Context Provider for batch-controlling animation defaults across specific areas.
- **Result**: Applied to both clo-set and connect services. Can accommodate diverse Skeleton requirements without structural changes.

### FileExtension Component (2022.08–2022.09)
- **Problem**: Each service displayed file extensions differently. The `clo3dExtensionList` utility was managed scattered across components, causing policy inconsistencies.
- **Solve**: Developed new `FileExtension.tsx` component. Classified extension types, mapped icons, and handled unsupported format fallback via `isNotSupported` prop. Reorganized `utils.ts` and `types.ts` to consolidate the extension list into a single source. Structured for single-location updates when adding new CLO3D extensions like `.hpos` and `.zth`.
- **Result**: Consistent file extension representation across the service; no omissions when adding new extensions.

### Thumbnail Component Improvements (2022.08–2023.03)
- **Problem**: Image and icon rendering logic were mixed in a single `Thumbnail.tsx`, making maintenance difficult. With virtual window implementation, Thumbnail images outside the viewport were loading immediately, causing unnecessary network requests.
- **Solve**: Separated into `ThumbnailInnerImage.tsx` (external images), `ThumbnailInnerIcon.tsx` (SVG icons), and `ThumbnailInner.tsx`. Added `lazyLoad` prop to load images only when entering the viewport when used with a virtual window.
- **Result**: Each inner component independently modifiable; unnecessary image loads eliminated for performance improvements.

### ConfigProvider — Design System i18n Support (2022.10–2022.12)
- **Problem**: Hardcoded component text prevented multilingual service support. Bundling an i18n library directly risked conflicts with each app's existing dependencies.
- **Solve**: Designed `ConfigProvider` using React Context. Apps inject translated text using their preferred i18n solution into the Provider, which downstream components consume. Adding Spanish, Japanese, and Portuguese later required only modifying `locales.ts`.
- **Result**: Apps maintain their own i18n solution freely while customizing design system component text. Initial design's extensible structure minimized cost of adding new languages.

### CLOSET Brand Logo SVG Component (2024.11)
- **Problem**: Image-based logos couldn't change color via CSS, causing each service to handle dark mode differently. Each service was managing logo image files independently.
- **Solve**: Developed `CLOSETEmblem.tsx` and `CLOSETLogo.tsx` as SVG components with customization props: `variant`, `opacity`, `id`, etc. Removed the legacy `ClosetBIIcon.tsx`.
- **Result**: Consistent brand presentation including dark mode. Services no longer need to manage image files individually.

## Key Implementations — CLO-SET v3 Design System v2 (Phase 4)
**Implemented Components**: Badge family (BadgeDot/BadgeIcon/BadgeImage/BadgeCounter/BadgeLabel/BadgeMarker) / BasePopover / IconButton·IconToggle / Thumbnail·FileExtension / BreadCrumbs / ColorwaySelect / MenuListItem / BaseDropdown, etc.

### Badge Family Components
- **Problem**: Badges were scattered across different components by position/content type with no consistency.
- **Solve**: Unified BadgeDot/Icon/Image/Counter/Label/Marker under a single naming convention with a consistent props structure.
- **Result**: Reduced designer-developer communication overhead; new badge types can reuse existing patterns.

### IconToggle `disabledIcon` Bug Fix
- **Problem**: In `disabled` state, `disabledIcon` was not rendered and the default icon was shown instead.
- **Solve**: Fixed the conditional render priority so that the `disabled` prop checks for `disabledIcon` existence first.
- **Result**: Disabled state icons display correctly across all DS usage sites.

### `ColorwaySelect` Arrow & `BaseDropdown` activeIndex Bug
- **Problem**: The arrow icon direction didn't reverse when the dropdown was open, and activeIndex was not syncing with external state.
- **Solve**: Connected arrow rotation CSS transform to the isOpen state; fixed activeIndex to work correctly in both controlled and uncontrolled modes.
- **Result**: Consistent dropdown UX.

## Retrospective / Lessons Learned

- The branch strategy used stable/release/develop three tiers, but with 40–50 components it hit limits managing everything on a single develop branch. Per-component independent branches would have made local testing and version management easier.
- Repeated design system component work taught me that "API design for component users" is as important as the implementation itself. Patterns like ConfigProvider — securing extensibility while avoiding dependency conflicts — show how getting the initial pattern right enables future language additions with only internal changes.
- Early debates within the team about how abstract the Base layer should be were valuable. I learned that identifying actual usage patterns first and designing components reverse-engineered from real needs is more effective.
- Writing Storybook documentation alongside implementation also helped catch component edge cases early.
