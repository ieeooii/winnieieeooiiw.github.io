# CLO-SET Admin Backoffice Project Architecture

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

## Key Implementations — Project Directory Structure Design

### Domain-Based Directory Separation (109 File Migration)

- **Problem**: The project started from a third-party admin template, so business logic components and template-specific components (sample pages, charts, maps, etc.) were mixed in the same top-level `components/` and `pages/` directories. It was hard to distinguish actual business code from template code, making it difficult for new team members to know which files to reference, and it was clear the cost of file navigation would grow as the project scaled.
- **Solve**: Isolated all template-specific code under `components/template/` and `pages/template/`, and separated shared admin UI into a `common/` namespace (e.g., `components/common/sidebar/`). Batch-updated import paths for 109 files, and updated all path references in `src/routes/templateRoutes.tsx`, `basicLayoutRoutes.tsx`, and `Routes.tsx`. Also converted React imports from `import React from 'react'` to `import * as React from 'react'` for consistency in the TypeScript strict environment.
- **Result**: Complete separation of business code and template code; established a foundation where subsequent domain additions (Groups, Member, Marketplace, etc.) consistently follow the `src/components/{domain}/`, `src/containers/{domain}/`, `src/api/{domain}/` pattern.

### Final Directory Convention

```
src/
├── api/            # Domain-specific API request functions (groups, member, marketplace, ...)
├── components/     # UI components (common/, groups/, member/, ...)
├── containers/     # Containers handling data fetching and state connection
├── features/       # Redux slice + Saga (rootReducer, rootSaga)
├── hooks/          # Custom hooks
├── pages/          # Route-level page components
├── routes/         # React Router route definitions
├── services/       # Axios interceptors, auth, and other cross-cutting concerns
├── store/          # Redux store configuration
├── types/          # TypeScript type definitions (by domain)
└── modules/        # Pure utility functions
```

---

## Key Implementations — State Management Architecture

### Redux Toolkit + Redux-Saga + RTK Query Hybrid Design

- **Problem**: Admin systems have complex async flows (auth → token refresh → API retry) coexisting with simple CRUD API calls. Using Redux-Saga alone requires writing action, saga, and reducer boilerplate even for simple API calls.
- **Solve**: Adopted a hybrid structure centered on `@reduxjs/toolkit`'s `configureStore` — complex async sequences handled by **Redux-Saga** (`createSagaMiddleware`), and domains requiring simple API caching handled by **RTK Query** middleware. Redux DevTools activated in development environment only; `serializableCheck: false` suppresses Saga non-serializable object warnings.

```ts
// store/configureStore.ts core structure
const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      sagaMiddleware,
      featureAApi.middleware,  // RTK Query
      featureBApi.middleware,
      ...
    ),
});
store.sagaTask = sagaMiddleware.run(rootSaga);
axiosInterceptor.run(); // interceptor initialization
```

- **Result**: Flexible structure enabling Saga vs. RTK Query selection based on domain complexity.

### Axios Interceptor Design — JWT Auth + Automatic Response Transformation

- **Problem**: If JWT token injection logic is scattered across each API call site, consistently applying token refresh and expiry handling is difficult. Additionally, the backend responds in snake_case while the frontend uses camelCase, requiring manual transformation of every response.
- **Solve**: Centralized request/response interceptors in `services/axiosInterceptor.ts`. The request interceptor reads the auth token and automatically injects the `Authorization` header. The response interceptor applies `humps.camelizeKeys()` for global snake_case → camelCase conversion. Two Axios instances used for different purposes are each initialized independently to separate domain APIs.

```ts
// request: automatic auth token injection
const requestInterceptor = async (config) => {
  const token = getToken();
  return { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } };
};

// response: global snake_case → camelCase conversion
const responseInterceptor = (response) => {
  response.data = camelizeKeys(response.data);
  return response;
};
```

- **Result**: Auth and transformation logic fully removed from API call code; backend response format changes handled at a single location.

---

## Key Implementations — GitHub Collaboration Workflow Setup

### Issue Template Design (BUG_REPORT / FEATURE_TASK)

- **Problem**: When bug reports and feature requests are submitted in free-form, essential information like reproduction conditions and expected behavior is often missing, increasing communication overhead.
- **Solve**: Created two templates: `.github/ISSUE_TEMPLATE/BUG_REPORT.md` (reproduction steps, expected behavior, environment info) and `FEATURE_TASK.md` (feature description, implementation checklist). Guides issue authors to provide structured information according to the template.

### PR Template — 6 Checklist Types by Branch Type

- **Problem**: During code reviews, reviewers had to repeatedly ask questions like "did you do a sanity test?" and "is QA complete?" PRs with different purposes — feature, fix, hotfix, deployment, documentation, code-review — were forced into the same format, creating noise from irrelevant items.
- **Solve**: Designed `.github/PULL_REQUEST_TEMPLATE.md` as a single file with sections separated by HTML comments (`<!-- FEATURE BRANCH -->`). FEATURE PRs include 5 mandatory checklist items: sanity test / UX & SMOKE test / QA test / test code written / issue linked. HOTFIX PRs are simplified to 2 items: QA test / preview branch tested. A `[TICKET-NUMBER]` bracket format guide for automatic Jira issue linking is specified in the template.
- **Result**: Structure ensuring PR authors check through the list without omissions; reduced repetitive reviewer questions.

---

## Key Implementations — DX Pipeline (Quality Automation)

### Husky + Commitlint + lint-staged 3-Stage Automation

- **Problem**: As team size grew, commit message formats varied widely, and cases of code with lint errors or type errors being pushed directly appeared.
- **Solve**: Configured 3-stage Git hooks with Husky:
  - **pre-commit**: `lint-staged` runs ESLint + Prettier auto-fix only on staged files (significant speed improvement over checking all files)
  - **commit-msg**: `commitlint` enforces Conventional Commits format (`feat:`, `fix:`, `chore:`, etc.)
  - **pre-push**: Sequentially runs `tsc --noEmit` (type check) → `jest --verbose` (full tests) → `eslint` to block code with type errors or test failures from being pushed to remote branches

```bash
# .husky/pre-commit
npx lint-staged

# .husky/commit-msg
npx --no -- commitlint --edit $1

# .husky/pre-push
yarn tsc --noEmit && yarn test:ci && yarn lint
```

- **Result**: Unified commit message format improves git log readability; code with type errors or test failures blocked from entering remote branches.

### ESLint + Prettier Integrated Configuration

- ESLint configuration with TypeScript parser (`@typescript-eslint/parser`) and React Hooks rules (`eslint-plugin-react-hooks`) for static validation of type safety and Hook usage rules.
- Prettier settings like `singleQuote: true`, `trailingComma: 'all'`, `printWidth: 100` specified in `.prettierrc` to unify code style across the entire team.

---

## Key Implementations — Tech Stack Selection Rationale

| Area | Choice | Rationale |
|------|--------|-----------|
| UI | React 17 | Team proficiency, ecosystem |
| Types | TypeScript 4.5 (strict) | API type safety essential for admin characteristics |
| State Management | Redux Toolkit + Redux-Saga | Handles complex async flows (auth, sequential API) |
| Some APIs | RTK Query | Handles simple CRUD without boilerplate |
| Styling | Styled Components + MUI v4 | Admin UI components, custom theme support |
| HTTP | Axios + humps | Centralized auth/transform via interceptors, automatic snake↔camel conversion |
| Build | Webpack 4 + Express | SPA without SSR + proxy server |
| Design System | In-house design system | CLO-SET brand consistency |

---

## Retrospective

Investing in "a structure that won't break even as the team grows" rather than "code that works right now" provided tangible benefits in scaling the project over four years. In particular, establishing the domain-based directory convention early meant almost no discussion cost of "where to create the file" each time a new domain like Groups, Marketplace, or Member was added. On the other hand, maintaining the Webpack 4-based custom build scripts became a burden during version upgrades — had we designed with Next.js or Vite from the start, the build maintenance cost could have been reduced.
