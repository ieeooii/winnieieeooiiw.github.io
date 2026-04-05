# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # Start dev server (Vite)
pnpm build      # Type-check (tsc -b) then build
pnpm lint       # ESLint (flat config, TS/TSX only)
pnpm preview    # Preview production build
```

Always use **pnpm**, not npm or yarn. Pre-commit hook runs `pnpm lint-staged` (ESLint --fix on staged .ts/.tsx).

## Architecture

React 19 + TypeScript SPA using hash-based routing (wouter `useHashLocation`). Styling via Vanilla Extract (zero-runtime CSS-in-JS, `*.css.ts` files). No test framework is configured.

### Source layout (`src/`)

Follows a feature-sliced-inspired structure:

- **`app/`** — App entry, root layout, router setup
- **`pages/`** — Route-level pages: `home`, `portfolio`, `about`, `blog`
- **`widgets/`** — Composite UI sections: `navbar`, `hero`, `footer`, `projects`, `awards`
- **`shared/`** — Cross-cutting concerns:
  - `i18n/` — Language context + translation maps (`ko.ts`, `en.ts`). Custom `useLanguage` hook.
  - `hooks/` — Shared hooks (dark mode, scroll, typewriter, etc.)
  - `styles/` — Global CSS, theme tokens
  - `ui/` — Reusable components
  - `config/` — Contact info, etc.
  - `utils/` — Helpers

### Project content (`project/`)

Portfolio project write-ups stored as Markdown files in `project/ko/` and `project/en/`, one per project. Naming convention: `YYYYMM-slug.md`. These are rendered via react-markdown with remark-gfm and rehype-raw.

### i18n

Bilingual (Korean / English). Translations live in `src/shared/i18n/ko.ts` and `en.ts` as typed objects. When editing user-facing text, update both language files. Project markdown content is duplicated across `project/ko/` and `project/en/`.

### Routing

Hash-based SPA routes: `/`, `/projects`, `/projects/:id`, `/about`.

## Tool preferences

When the Serena MCP server is available, prefer Serena tools (semantic code analysis, symbol lookup, references, refactoring) over Grep/Glob for code navigation and understanding. Fall back to Grep/Glob only when Serena is unavailable or for simple file-pattern searches.
