---
thumbnail: /images/projects/202411-design-system.svg
gradient: linear-gradient(135deg, #fce7f3, #ede9fe)
---

# Design System Architecture

| Field | Details |
|------|------|
| Company | CLO Virtual Fashion |
| Category | ETC |
| Service | CLO-SET |
| Tech Stack | React, TypeScript, Emotion.js, Storybook, Rollup, tippy.js |
| Period | 2021.06 ~ 2024.11 |
| Team | Frontend 4, Product Designer 2 (Bundle optimization sole lead, component development participation) |
| Service Link | Internal (Private) |

## Overview

Built and evolved the design system across four phases. Phase 1 (2021.06 ~ 2022.08) resolved UX inconsistency and bundle size issues from duplicate components, achieving 82% bundle size reduction. This was followed by CLOSET service-specific component additions (2022.03 ~ 2022.12), company-wide design system v1 common component proposal and design (2022.07 ~ 2024.11), and design system v2 construction (2023.07 ~ 2023.12) achieving a Lighthouse score of 95.

## Key Implementations — Bundle Optimization and Foundation Design

### Bundle Optimization

- **Problem**: The design system package was distributed as a single CJS bundle, causing the entire bundle to be included even when only a few components were used. Shared dependencies like React and Emotion were duplicated within the package, inflating the client bundle to 2.55 MB with initial JS load size of 398 KB.

- **Solve**: Optimization was carried out along three axes.

  1. **Tree-shaking enablement**: Switched Rollup to named exports and declared `"sideEffects": false` so only actually imported components are included in the final bundle. Converted from CJS to ESM format enabling bundlers to statically analyze usage.

  2. **Duplicate bundle removal**: Added React, ReactDOM, Emotion, and other dependencies that host applications necessarily possess to Rollup externals and moved them to `peerDependencies`. Improved the structure so installing applications share a single instance. Emotion specifically was critical for functional stability since having two or more instances causes CSS-in-JS style conflicts.

  3. **Measurement-based optimization**: Visualized pre/post bundle composition with bundle analyzer to identify unnecessarily included modules and verify reduction figures.

- **Result**:
  - Design system bundle size **82% reduction** (Client: 2.55 MB → 72.66 KB / Node.js: 2.54 MB → 126.01 KB)
  - Application initial JS load size 398 KB → 185 KB
  - Lighthouse performance score **95** achieved

### Component Design Patterns

- **Problem**: The initial design system had styles tightly coupled to components, requiring component duplication or endless props addition to accommodate subtly different design requirements per service. This increased maintenance complexity and made APIs unstable.

- **Solve**: Combined two patterns to achieve both extensibility and consistency.

  1. **Headless components**: Designed to handle only state logic and accessibility (ARIA), with styles injected externally. Each service can freely customize visual presentation via CSS-in-JS `css` prop or `styled`.

  2. **Compound Component pattern**: For example, `<Select>`, `<Select.Option>`, `<Select.Group>` — parent-child components share internal state through Context, allowing component consumers to directly control layout and composition while state synchronization happens automatically.

  3. **Controlled / Uncontrolled unified interface**: Form-related components automatically branch between controlled/uncontrolled mode internally based on `value` prop presence, maintaining a single API for simple uncontrolled usage and complex controlled form usage.

### Design Token System Construction

- **Problem**: Color, typography, and spacing values were hardcoded per component, causing inconsistencies between designers and developers. Renaming colors in Figma required searching for related strings in code, and tracking impact scope during brand renewals was difficult.

- **Solve**: Defined color, typography, spacing, and elevation as TypeScript objects in a token file as a single entry point. Connected to ThemeProvider to enforce components referencing styles only through token keys. Documented a 1:1 mapping convention between Figma token names and code constant names to reduce designer-developer communication costs.

- **Result**: Brand color updates can be batch-applied across the entire service by modifying only the token file. Dark mode support minimized by swapping only color values at the token layer.

### Component Documentation Environment Setup (Storybook)

- **Problem**: Component usage could only be understood by reading code directly, resulting in low team component reuse rates. Edge cases were frequently missed when adding new components.

- **Solve**: Used Storybook to spec components' props, states, and edge cases as Stories. Wrote design intent, usage guidelines, and prop descriptions together in MDX format. Configured Controls panel so designers could interactively explore prop combinations. Story writing itself served as a test for reviewing component API design.

- **Result**: Reduced component spec inconsistency between design and development. Story writing process discovered edge cases in advance.

## Key Implementations — Service-Specific Components

### Tooltip / TooltipMenu

- **Problem**: Tooltips were needed across the service, but each component was directly using tooltip libraries or implementing them differently. The library used (`@tippyjs/react`) had a limitation where `visible` prop and `trigger` prop couldn't be used simultaneously.

- **Solve**: Designed the base layer (`BaseTooltip`) first, then implemented two variants on top — standard tooltip and menu-style tooltip. Internally auto-branched between controlled/uncontrolled mode based on `visible` prop presence to work around the library limitation. Exposed service-relevant options (fixed position, shadow, z-index) as props and wrote Storybook documentation alongside.

- **Result**: Consistent Tooltip UX across the entire service; eliminated duplicate direct library usage.

### Dropdown-Based Component Design

- **Problem**: Every component needing dropdown selection UI was independently implementing open/close state management, position calculation, and outside click detection, causing heavy code duplication. Hiding with `display: none` caused DOM layout recalculation every time the dropdown closed, impacting performance.

- **Solve**: Designed dropdown container and dropdown panel as separate concerns. Used `width: 0; overflow: hidden` instead of `display: none` for hidden state, maintaining DOM presence without affecting layout. Migrated existing category filter components to this component base and extracted common styles into a separate module, establishing a structure where subsequent Select-family components are built on a common layer.

- **Result**: Centralized dropdown-related logic. Subsequent new Select-family component additions developed faster by building on the base component.

### Thumbnail (Lazy Load + ratio)

- **Problem**: Images were used across the service in content lists, line sheet thumbnails, etc., but each usage independently implemented lazy load logic and ratio handling. Empty space before image loading caused layout shifts (CLS).

- **Solve**: Developed a custom hook using `IntersectionObserver` that sets the image src only on viewport entry, built into the Thumbnail component. Dynamically applied `aspect-ratio` CSS via a `ratio` prop to eliminate layout shift before and after image loading. Added an option to display skeleton UI before image load.

- **Result**: Image lazy load and CLS prevention handled in a single component; duplicate implementations eliminated.

### Icon Component Additions

Added service domain-specific icons (line sheet, colorway, order change, sort, copy, QR, etc.) to the design system. Converted SVGs to React components controllable via `size` and `color` props, removing image file dependencies.

## Key Implementations — Common Components

### Skeleton Component

A self-proposed initiative based on the judgment that showing blank screens or simple spinners during loading states creates poor user experience.

- **Problem**: No Skeleton component existed; loading states were handled only with blank screens or spinners. Loading UI implementation varied per screen, lacking consistency.

- **Solve**: Designed the base Skeleton component as a Headless structure with three extension mechanisms.

  1. **Props composition**: Designed to express various forms from a single component by combining `shape(rectangle/circle)`, `variant`, `animation(wave/pulse/false)` props.

  2. **`:empty` CSS selector utilization**: Leveraged the principle that the `:empty` CSS pseudo-class matches when child elements are `undefined`, `null`, `boolean`, or other values that produce no render output, enabling automatic skeleton UI display when data is absent without separate conditional branching.

  3. **Context-based batch control**: Context Provider enables batch control of animation defaults for specific areas, allowing page-level toggling of all loading animations at once.

- **Result**: Actually applied across multiple services. Subsequent various Skeleton requirements handled without structural changes.

### FileExtension Component

- **Problem**: File extension display was implemented separately per service with inconsistent presentation. Supported extension list utilities were scattered per component causing policy inconsistencies, requiring multiple file modifications when adding new formats.

- **Solve**: Newly developed a FileExtension component unifying extension type classification, icon mapping, and unsupported format fallback handling in a single component. Organized extension lists as a Single Source of Truth so new format additions require modification at only one point to reflect across the entire service.

- **Result**: Consistent file extension presentation across the service. Prevented omissions when adding new extensions.

### Thumbnail Component Improvement

- **Problem**: Image rendering and icon rendering logic were mixed in a single Thumbnail component, making maintenance difficult. In virtual window implementations, images outside the viewport were immediately loaded, causing unnecessary network requests.

- **Solve**: Split the single component into three role-based components — external URL image handler, SVG icon handler, branching logic handler. Added a `lazyLoad` prop to enable loading images only on viewport entry in virtual window environments. Reused existing lazy load hooks for feature extension without duplicate implementation.

- **Result**: Each internal component can be modified independently. Unnecessary image loads eliminated for network performance improvement.

### ConfigProvider — Design System Internationalization Support

- **Problem**: Internal component text (button labels, empty state messages, etc.) was hardcoded, making multilingual service application impossible. Embedding an i18n library directly in the design system risked version conflicts with each app's dependencies.

- **Solve**: Designed a React Context-based `ConfigProvider` so the design system doesn't depend on a specific i18n solution. Each app injects text objects translated with its own i18n solution into `ConfigProvider`, and child components read translated text from Context. English text is provided as fallback default values so it works even without `ConfigProvider`. Established an extensible structure from the start where Spanish, Japanese, and Portuguese support expansion only requires modifying app-side locale configuration files.

- **Result**: Apps can freely maintain their own i18n solutions while customizing design system component text. The initial extensible design minimized internal design system modification costs when adding languages.

### Brand Logo SVG Component

- **Problem**: Image file-based logos couldn't have colors changed via CSS, with each service handling dark mode adaptation differently. Logo image files were scattered across services making brand renewal consistency difficult.

- **Solve**: Developed emblem and logotype as SVG inline components using `currentColor` to control color via CSS `color` property alone. Supported customization props including `variant` and `opacity`; removed legacy image-based components.

- **Result**: Brand expression consistency including dark mode secured. No need for per-service image file management.

## Key Implementations — Design System v2

Fully redesigned the design system for the v3 renewal project. Focused on improving API consistency and extensibility based on v1 component design experience.

**Key implemented components**: Badge family (Dot / Icon / Image / Counter / Label / Marker) / BasePopover / IconButton, IconToggle / Thumbnail, FileExtension / BreadCrumbs / ColorwaySelect / MenuListItem / BaseDropdown, etc.

### Badge Family Components

- **Problem**: Badges were scattered across different component names and props structures by position and content type, causing confusion about which component to modify when designers requested new badge types.

- **Solve**: Implemented six variants (Dot / Icon / Image / Counter / Label / Marker) under the `Badge` namespace with unified naming conventions and props interfaces. Each variant inherits a common base layer sharing position and size tokens.

- **Result**: Reduced designer-developer communication cost. Pattern reusable when adding new badge types.

### Disabled State Icon Render Priority Bug

- **Problem**: A bug where `disabledIcon` prop wasn't rendered in `disabled` state, outputting the default icon instead. A priority error in conditional render logic checked the default icon prop before checking `disabled` status.

- **Solve**: Fixed the conditional render logic evaluation order to first check `disabledIcon` existence when in `disabled` state.

- **Result**: Disabled state icons correctly displayed across all design system usage points.

### Dropdown Icon Rotation and Selection State Synchronization Bug

- **Problem**: Two simultaneous bugs — the arrow icon rotation direction wasn't inverted in dropdown open state, and changing the selection index state externally didn't synchronize with the dropdown's internal selection state.

- **Solve**: Directly linked the icon rotation CSS `transform` condition to the open state, and fixed the selection index to work correctly in both controlled mode (external state priority) and uncontrolled mode (internal state usage).

- **Result**: Dropdown UX consistency secured.

## Retrospective / Lessons Learned

- **Branch strategy limitations**: Configured with 3 stages (stable, release, develop), but as component count grew to 40-50, frequent conflicts occurred from multiple component work on a single develop branch. Per-component independent branches with feature flags would have been more conducive to parallel work and local testing.

- **API design is as important as implementation**: Through repeated component work, I learned that "API design for component consumers" is as important as internal implementation. Designs like `ConfigProvider` that secure extensibility while avoiding dependency conflicts minimize subsequent language or feature addition costs when the right abstraction level is established early. Conversely, I also experienced that over-abstraction from early optimization causes APIs to become complicated when they don't match actual usage patterns.

- **Base abstraction level determination**: There were many team discussions early in component design about how far to set the Base layer. I learned that collecting actual service usage patterns first and extracting commonalities in reverse is more practical than top-down abstraction.

- **Storybook's dual effect**: Introduced as a documentation tool, but the process of writing Stories itself served as a testing role that discovered component edge cases and props API design flaws in advance. Including Storybook writing as a required step in the component development workflow contributed to long-term quality improvement as documentation became a design verification tool.
