---
thumbnail: /images/projects/202603-portfolio-site-home.webp
gradient: linear-gradient(135deg, #ddf5e8, #a9e8c9)
---

# Portfolio Site — Markdown-Driven Content Pipeline

| Field | Details |
|-------|---------|
| Category | Side Project |
| Service | portfolio.ieeooii.com |
| Tech Stack | React 19, TypeScript, Vite 7, Vanilla Extract, wouter, react-markdown, GitHub Actions, GitHub Pages, AWS Route 53 |
| Period | 2026.03 ~ Ongoing |
| Team | Frontend 1 (solo) |
| Service Link | [portfolio.ieeooii.com](https://portfolio.ieeooii.com) |

## Purpose

This is the site you are looking at right now. Rather than just "a portfolio that got built," it is designed so that **maintenance cost stays flat as projects accumulate**: a content pipeline that publishes 30+ project write-ups by adding markdown files with zero code changes, bilingual Korean/English support, and zero-runtime styling — all built from scratch.

<div class="img-row-1 img-border">

![Home — typewriter hero](/images/projects/202603-portfolio-site-home.webp)

</div>

## Key Features

<div class="img-row-2 img-border">

![Project list — category filters and search](/images/projects/202603-portfolio-site-projects.webp)
![Mobile responsive](/images/projects/202603-portfolio-site-mobile.webp)

</div>

- **Project gallery** — category filters (SaaS, E-Commerce, Internal Tool, …), unified search across title/stack/company, gradient fallback for projects without thumbnails
- **Project detail** — raw markdown rendered via react-markdown (remark-gfm + rehype-raw) with image-row layouts
- **Language & dark mode toggles** — instant switching from the header, preference persisted
- **Interactions** — typewriter hero animation, scroll-aware navigation

## Key Implementations

### Markdown-driven content pipeline

- **Problem**: If every new project requires touching components or data files, maintenance outgrows content writing once write-ups pass 30. A CMS or SSG framework would be an oversized dependency for a single static SPA.
- **Solve**: Write-ups live in `project/ko/` and `project/en/` under a `YYYYMM-slug.md` naming rule and are collected at build time via Vite's `import.meta.glob(?raw)`. A lightweight parser extracts frontmatter (thumbnail, gradient) and the markdown metadata table (company, category, period, stack) to power list cards and filters; parse results are cached per language so revisits never re-parse. Sorting is automatic — the period string is parsed for its end date and projects render newest-first.
- **Result**: Adding a project = committing two markdown files plus images. Zero code changes, zero CMS or build-plugin dependencies

### Bilingual i18n — designed down to the fallback

- **Problem**: Both UI copy and project content needed Korean and English, but a not-yet-translated write-up must never break the page.
- **Solve**: UI copy lives in type-enforced dictionaries (`ko.ts`/`en.ts`) behind a context-based `useLanguage` hook, so missing keys fail at compile time. Project content is keyed off the Korean file list; the English path is derived from it and falls back to the Korean original when no translation exists, so list and detail pages always render.
- **Result**: Language switching is guaranteed gap-free, and translations can be added incrementally as files become ready

### Zero-runtime styling — Vanilla Extract

- **Problem**: The site needed dark mode and theme tokens, but paying runtime CSS-in-JS costs on a content-centric static site felt wrong.
- **Solve**: Styles are written type-safely in Vanilla Extract (`*.css.ts`) and extracted to static CSS at build time. Colors and spacing are defined as theme tokens, and dark mode switches via a class toggle — no runtime style computation.
- **Result**: Keeps the CSS-in-JS DX (type checking, colocation) with zero runtime overhead

### SPA routing on GitHub Pages

- **Problem**: GitHub Pages has no server rewrites, so history-based SPA routing 404s when a detail page is refreshed.
- **Solve**: Adopted hash-based routing (`/#/projects/:id`) via wouter's `useHashLocation`. Every route resolves to the single `index.html`, so direct access, refresh, and shared links all work without 404-fallback hacks.
- **Result**: All routes work reliably on static hosting with no server configuration

### GitHub Actions CI/CD — push equals deploy

- **Problem**: Building locally and deploying artifacts by hand lets commits drift from what's live, and risks shipping a build with type errors.
- **Solve**: A GitHub Actions pipeline triggers on pushes to the deploy branch: `pnpm install --frozen-lockfile` → type-checked build (`tsc -b && vite build`) → Pages artifact upload → the official `deploy-pages` action. Authentication uses OIDC (`id-token`) with no long-lived tokens, and `concurrency` cancels in-flight deploys on consecutive pushes so only the latest commit ships.
- **Result**: Commit markdown, push, and it's live within minutes. Only type-check-passing builds deploy, with per-commit deployment history

### Custom domain — Route 53 subdomain scheme

- **Problem**: The default `*.github.io` domain is weak for branding, and future side services should live under one domain instead of buying a new one each time.
- **Solve**: Domain registration (registrar) and DNS hosting (hosted zone) are separate services, but both were placed on AWS Route 53 to keep a single point of management. Purchased the root domain (`ieeooii.com`), created the hosted zone, and pointed the `portfolio.ieeooii.com` subdomain at GitHub Pages via a CNAME record — with custom-domain verification, automatic Let's Encrypt certificate provisioning, and enforced HTTPS. The per-service subdomain strategy means a new service joins the same domain scheme with just one more record.
- **Result**: Served over HTTPS at `portfolio.ieeooii.com`, with a naming scheme that scales to any number of services for the cost of a single domain
- **Insight**: When a visitor connects, **Route 53 only resolves the name** (CNAME → GitHub Pages); actual traffic, content serving, and certificate renewal are handled by GitHub Pages. Keeping the DNS/hosting responsibility boundary clean means any subdomain can later move to different hosting (Vercel, S3+CloudFront, …) by changing a single record.

### Automating content authoring with an AI workflow

- **Problem**: Adding a write-up involves many repetitive rules — creating ko/en files, the metadata table, converting and placing images — which invited manual mistakes.
- **Solve**: Codified the filename rules, markdown template, and image layout conventions into a Claude Code skill (`add-project`), so a single "add this project" request handles everything from bilingual file creation to screenshot webp conversion and optimization consistently.
- **Result**: Content authoring became a reproducible, rule-driven process with formatting drift eliminated

## Retrospective / Lessons Learned

Separating content from code paid off the most — polishing write-ups and improving the site never block each other. On the flip side, hand-writing the frontmatter and table parsers made the markdown format an implicit schema, and there is no build-time validation yet for malformed files. As content grows, the plan is to add a schema-validation script to CI.
