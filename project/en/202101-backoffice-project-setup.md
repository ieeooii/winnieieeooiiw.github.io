---
thumbnail: /images/projects/202101-backoffice-admin.svg
gradient: linear-gradient(135deg, #e8eaf0, #c8ccd8)
---

# Internal Admin Backoffice Initial Architecture

| Field | Details |
|-------|---------|
| Company | CLO Virtual Fashion |
| Category | Internal Admin Tool |
| Service | CLO-SET Admin |
| Tech Stack | React 17, TypeScript 4.5, Redux Toolkit, Redux-Saga, RTK Query, Styled Components, Material UI v4, Axios, Webpack 4, Express, Jest, ESLint, Prettier, Husky, Commitlint |
| Period | 2021.01 (initial architecture involvement) |
| Team | Frontend 3 (initial architecture involvement) |
| Service Link | Internal admin (private) |

## Overview

Participated from the ground up in the internal admin backoffice project that operates the CLO-SET SaaS service, responsible for directory structure design, GitHub collaboration workflow setup, and tech stack standardization. The goal — even before feature development — was to create a structure where "multiple team members can develop in parallel across domains without conflicts and with extensibility." This became the foundation for developing numerous domains including Groups, Member, and Marketplace over the subsequent four years.

## Key Implementations

### Directory Structure Design Enabling Domain Extensibility via Business/Template Code Separation

- **Problem**: The project started from a third-party admin template, so business logic components and template-specific components (sample pages, charts, maps, etc.) were mixed in the same top-level directory. It was impossible to distinguish actual business code from template code, making it difficult for new team members to know which files to reference, and it was clear the cost of file navigation would grow as the project scaled.
- **Solve**: Isolated template-specific code under a separate namespace and separated shared admin UI under `common/`. Established a structure where each domain consistently follows `api/`, `components/`, `containers/`, `features/` directories. Batch-updated all file import paths and unified React import style to TypeScript strict standards.
- **Result**: Complete separation of business code and template code; established a foundation where subsequent domain additions consistently follow the same directory pattern.

### Minimizing State Management Boilerplate via Saga·RTK Query Mix by Complexity

- **Problem**: Admin systems have complex async flows (auth → token refresh → API retry) coexisting with simple CRUD API calls. Using Redux-Saga alone requires writing action, saga, and reducer boilerplate even for simple API calls.
- **Solve**: Adopted a hybrid structure — complex async sequences handled by Redux-Saga, domains requiring simple API caching handled by RTK Query. Redux DevTools activated in development environment only.
- **Result**: Flexible structure enabling Saga vs. RTK Query selection based on domain complexity.

### Centralizing JWT Auth·snake↔camel Conversion via Axios Interceptors

- **Problem**: If JWT token injection logic is scattered across each API call site, consistently applying token refresh and expiry handling is difficult. Additionally, the backend responds in snake_case while the frontend uses camelCase, requiring manual transformation of every response.
- **Solve**: Centralized request/response interceptors in a single module. The request interceptor reads the auth token and automatically injects the Authorization header. The response interceptor applies global snake_case → camelCase conversion. Two Axios instances used for different purposes are each initialized independently to separate domain APIs.
- **Result**: Auth and transformation logic fully removed from API call code; backend response format changes handled at a single location.

## Tech Stack Selection Rationale

| Area | Choice | Rationale |
|------|--------|-----------|
| UI | React 17 | Team proficiency, ecosystem |
| Types | TypeScript 4.5 (strict) | API type safety essential for admin characteristics |
| State Management | Redux Toolkit + Redux-Saga | Handles complex async flows (auth, sequential API) |
| Some APIs | RTK Query | Handles simple CRUD without boilerplate |
| Styling | Styled Components + MUI v4 | Admin UI components, custom theme support |
| HTTP | Axios + humps | Centralized auth/transform via interceptors, automatic snake↔camel conversion |
| Build | Webpack 4 + Express | SPA without SSR + proxy server |

## Retrospective / Lessons Learned

Investing in "a structure that won't break even as the team grows" rather than "code that works right now" provided tangible benefits in scaling the project over four years. In particular, establishing the domain-based directory convention early meant almost no discussion cost of "where to create the file" each time a new domain was added. On the other hand, maintaining the Webpack 4-based custom build scripts became a burden during version upgrades — had we designed with Next.js or Vite from the start, the build maintenance cost could have been reduced.
