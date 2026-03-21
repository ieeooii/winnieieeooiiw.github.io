# Design System Logo Component Migration

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | SaaS |
| Service | CLO-SET |
| Tech Stack | Next.js, TypeScript, Emotion, @closet-design-system/core |
| Period | 2024.11 |
| Service Link | style.clo-set.com |

## Overview

Replaced all legacy `CLOSETLogo` components scattered across the service with the design system's new `Emblem/Logo` component. Rather than a simple find & replace, this involved verifying case-by-case that the **plan-based variant system** (`free` / `pro` / `enterprise`) applied correctly even in special rendering contexts such as the embed viewer and multiview. After completing the migration, the legacy component was fully removed to establish the design system as a single source of truth (SSoT).

## Key Implementations

### Plan-Based Variant System Integration

- **Problem**: The new `Emblem/Logo` component supports three variants — `free` / `pro` / `enterprise` — with different logo designs per plan. Since the legacy `CLOSETLogo` had a single design, simply renaming the component without passing plan information would display the same logo to all users. In environments without an auth context like the embed viewer, plan information needed to be injected separately.
- **Solve**: Analyzed how each usage site retrieves the current user's plan type (via plan query hook or per-context plan data) and correctly mapped the variant value. In environments without an auth session — like the embed viewer — determined the logo variant using separately injected context-level plan information. Handled special contexts like multiview with per-context plan retrieval approaches.
- **Result**: Correct logo variant displayed for the plan at all usage sites.

### Grep-Based Comprehensive Audit & Complete Removal

- **Problem**: Migrating without knowing all usage sites of the `CLOSETLogo` component would leave missed locations. In particular, indirect imports (usage via re-exports) or dynamic import syntax could be missed by simple text search.
- **Solve**: Scanned the entire codebase with `grep -r "CLOSETLogo"` and `grep -r "closet-logo"` to compile a list of usage sites. Confirmed all cases with different import paths (absolute / relative / barrel export) were included. After replacement, re-scanned to verify zero remaining usages before deleting the legacy component file.
- **Result**: Legacy component completely removed; subsequent logo design changes can be reflected globally with a single design system update.

### Special Context Case-by-Case Verification

- Embed viewer: operates inside an iframe without an auth session — variant determined using context-level plan data
- Multiview: a page showing multiple content items simultaneously — verified that the variant is applied consistently when the same user's logo renders across multiple instances
- Each case confirmed directly in the staging environment to complete migration without visual regression

## Retrospective / Lessons Learned

Migration work is easily underestimated as "not real feature development," but it actually requires **understanding all usage contexts of the existing component and mapping them accurately to the new interface**. Especially when a new attribute like the plan-based variant is added that didn't exist in the original component, it's not a simple swap — it requires understanding the business logic at each usage site to inject the correct value. This experience reinforced that **when migrating a component to a design system, you need to first specify interface differences, then list per-usage-site discrepancies and verify sequentially**.
