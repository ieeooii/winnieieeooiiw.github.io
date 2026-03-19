# CLO-SET Admin Backoffice 프로젝트 설계

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | Internal Admin Tool |
| 서비스 | CLO-SET Admin |
| 기술 스택 | React 17, TypeScript 4.5, Redux Toolkit, Redux-Saga, RTK Query, Styled Components, Material UI v4, Axios, Webpack 4, Express, Jest, ESLint, Prettier, Husky, Commitlint |
| 개발 기간 | 2021.01 (초기 설계 참여) |
| 인원 | 프론트엔드 3 (초기 설계 참여) |
| 서비스 링크 | 사내 내부 어드민 (비공개) |

## 소개

CLO-SET SaaS 서비스를 운영하는 내부 어드민 백오피스 프로젝트에 초기부터 참여해, 디렉터리 구조 설계·GitHub 협업 워크플로우 구축·기술 스택 체계화를 담당했다. 단순 기능 개발에 앞서 "팀원 여러 명이 도메인별로 병렬 개발해도 충돌 없이 확장 가능한 구조"를 만드는 것을 목표로 했다. 이후 4년간 이 프로젝트에서 Groups, Member, Marketplace 등 다수 도메인을 개발하는 기반이 됐다.

## 주요 구현 — 프로젝트 디렉터리 구조 설계

### 도메인 기반 디렉터리 분리 (109개 파일 이전)

- **Problem**: 초기 프로젝트는 서드파티 어드민 템플릿을 기반으로 시작했기 때문에, 비즈니스 로직 컴포넌트와 템플릿 전용 컴포넌트(샘플 페이지, 차트, 지도 등)가 동일한 `components/`, `pages/` 최상위 디렉터리에 혼재해 있었다. 실제 비즈니스 코드와 템플릿 코드를 구분하지 못해 신규 팀원이 어떤 파일을 참고해야 하는지 파악하기 어려웠고, 프로젝트가 커질수록 파일 탐색 비용이 커질 것이 명확했다.
- **Solve**: 템플릿 전용 코드를 `components/template/`, `pages/template/` 하위로 일괄 격리하고, 어드민 공통 UI는 `components/common/sidebar/` 등 `common/` 네임스페이스로 분리했다. 109개 파일의 import 경로를 일괄 수정하고, `src/routes/templateRoutes.tsx`·`basicLayoutRoutes.tsx`·`Routes.tsx`의 경로 참조를 모두 업데이트했다. 함께 React import 방식도 `import React from 'react'`에서 `import * as React from 'react'`로 전환해 TypeScript strict 환경에서의 일관성을 확보했다.
- **Result**: 비즈니스 코드와 템플릿 코드 완전 분리, 이후 Groups·Member·Marketplace 등 도메인 추가 시 `src/components/{domain}/`, `src/containers/{domain}/`, `src/api/{domain}/`의 일관된 패턴 적용 가능한 기반 마련

### 최종 정착한 디렉터리 컨벤션

```
src/
├── api/            # 도메인별 API 요청 함수 (groups, member, marketplace, ...)
├── components/     # UI 컴포넌트 (common/, groups/, member/, ...)
├── containers/     # 데이터 패칭·상태 연결 담당 컨테이너
├── features/       # Redux slice + Saga (rootReducer, rootSaga)
├── hooks/          # 커스텀 훅
├── pages/          # 라우트 단위 페이지 컴포넌트
├── routes/         # React Router 라우트 정의
├── services/       # Axios 인터셉터, 인증 등 횡단 관심사
├── store/          # Redux store 설정
├── types/          # TypeScript 타입 정의 (도메인별)
└── modules/        # 순수 유틸리티 함수
```

---

## 주요 구현 — 상태 관리 아키텍처

### Redux Toolkit + Redux-Saga + RTK Query 혼합 설계

- **Problem**: 어드민 특성상 복잡한 비동기 플로우(인증 → 토큰 갱신 → API 재시도)와 단순 CRUD API 호출이 공존한다. Redux-Saga만 사용하면 단순 API 호출에도 action·saga·reducer를 모두 작성해야 하는 보일러플레이트가 과도해진다.
- **Solve**: `@reduxjs/toolkit`의 `configureStore`를 중심으로, 복잡한 비동기 시퀀스는 **Redux-Saga** (`createSagaMiddleware`)로, 단순 API 캐싱이 필요한 도메인은 **RTK Query** 미들웨어로 처리하는 혼합 구조를 채택했다. 개발 환경에서만 Redux DevTools를 활성화했으며, `serializableCheck: false`로 Saga의 비직렬화 객체 경고를 억제했다.

```ts
// store/configureStore.ts 핵심 구조
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
axiosInterceptor.run(); // 인터셉터 초기화
```

- **Result**: 도메인 복잡도에 따라 Saga vs RTK Query를 선택해 적용하는 유연한 구조 확립

### Axios 인터셉터 설계 — JWT 인증 + 응답 자동 변환

- **Problem**: 모든 API 요청에 JWT 토큰을 주입하는 로직이 각 API 호출 코드에 분산될 경우, 토큰 갱신·만료 처리를 일관되게 적용하기 어렵다. 또한 백엔드가 snake_case로 응답하는데 프론트엔드는 camelCase를 사용해, 모든 응답을 수동으로 변환해야 하는 문제가 있었다.
- **Solve**: `services/axiosInterceptor.ts`에 request/response 인터셉터를 중앙 설계했다. Request 인터셉터에서 인증 토큰을 읽어 `Authorization` 헤더를 자동으로 주입하도록 했다. Response 인터셉터에서 `humps.camelizeKeys()`를 적용해 snake_case → camelCase 변환을 전역 처리했다. 용도가 다른 두 Axios 인스턴스를 각각 독립적으로 초기화해 도메인별 API를 분리했다.

```ts
// request: 인증 토큰 자동 주입
const requestInterceptor = async (config) => {
  const token = getToken();
  return { ...config, headers: { ...config.headers, Authorization: `Bearer ${token}` } };
};

// response: snake_case → camelCase 전역 변환
const responseInterceptor = (response) => {
  response.data = camelizeKeys(response.data);
  return response;
};
```

- **Result**: API 호출 코드에서 인증·변환 로직 완전 제거, 백엔드 응답 포맷 변경 시 단일 지점에서 대응 가능

---

## 주요 구현 — GitHub 협업 워크플로우 구축

### Issue Template 설계 (BUG_REPORT / FEATURE_TASK)

- **Problem**: 버그 리포트와 기능 요청이 자유 형식으로 올라오면 재현 조건·기대 동작 등 필수 정보가 누락되어 커뮤니케이션 비용이 증가했다.
- **Solve**: `.github/ISSUE_TEMPLATE/BUG_REPORT.md` (재현 단계, 기대 동작, 환경 정보 포함)와 `FEATURE_TASK.md` (기능 설명, 구현 체크리스트 포함)를 두 가지 템플릿으로 분리해 작성했다. 이슈 작성자가 템플릿에 따라 구조화된 정보를 제공하도록 유도했다.

### PR Template — 브랜치 타입별 6종 체크리스트

- **Problem**: PR 리뷰 시 "sanity test 했나요?", "QA 완료됐나요?" 같은 확인 사항을 리뷰어가 매번 물어야 했다. feature, fix, hotfix, deployment, documentation, code-review 등 목적이 다른 PR이 동일한 형식을 강요받으면 불필요한 항목이 노이즈가 됐다.
- **Solve**: `.github/PULL_REQUEST_TEMPLATE.md`를 브랜치 타입별로 HTML 주석(`<!-- FEATURE BRANCH -->`)으로 섹션을 구분하는 단일 파일로 설계했다. FEATURE PR에는 sanity test / UX·SMOKE test / QA test / 테스트 코드 작성 / 이슈 연결 여부 5종 체크리스트를 필수로 포함했다. HOTFIX PR은 QA test / preview branch 테스트 2종으로 간소화했다. Jira 이슈 자동 링크를 위해 `[TICKET-NUMBER]` 대괄호 포맷 가이드를 템플릿에 명시했다.
- **Result**: PR 작성자가 누락 없이 체크리스트를 확인하는 구조 확립, 리뷰어의 반복 질문 감소

---

## 주요 구현 — DX 파이프라인 (품질 자동화)

### Husky + Commitlint + lint-staged 3단계 자동화

- **Problem**: 팀원이 늘수록 커밋 메시지 형식이 제각각이 되고, lint 오류가 있는 코드나 타입 에러가 있는 코드가 그대로 push되는 사례가 발생했다.
- **Solve**: Husky로 3단계 Git 훅을 설정했다.
  - **pre-commit**: `lint-staged`로 스테이징된 파일에만 ESLint + Prettier 자동 수정 실행 (전체 파일 검사 대비 속도 대폭 개선)
  - **commit-msg**: `commitlint`로 Conventional Commits 형식(`feat:`, `fix:`, `chore:` 등) 강제 검증
  - **pre-push**: `tsc --noEmit` (타입 검사) → `jest --verbose` (전체 테스트) → `eslint` 순으로 실행해 타입 에러·테스트 실패 코드가 원격 브랜치에 push되는 것을 차단

```bash
# .husky/pre-commit
npx lint-staged

# .husky/commit-msg
npx --no -- commitlint --edit $1

# .husky/pre-push
yarn tsc --noEmit && yarn test:ci && yarn lint
```

- **Result**: 커밋 메시지 형식 통일로 git log 가독성 향상, 타입 에러·테스트 실패 코드의 원격 브랜치 유입 차단

### ESLint + Prettier 통합 설정

- TypeScript 파서(`@typescript-eslint/parser`)와 React Hooks 규칙(`eslint-plugin-react-hooks`)을 포함한 ESLint 설정으로 타입 안전성과 Hook 사용 규칙을 정적으로 검증했다.
- Prettier는 `singleQuote: true`, `trailingComma: 'all'`, `printWidth: 100` 등을 `.prettierrc`에 명시해 팀 전체 코드 스타일을 통일했다.

---

## 주요 구현 — 기술 스택 선정 근거

| 영역 | 선택 | 이유 |
|------|------|------|
| UI | React 17 | 팀 숙련도, 생태계 |
| 타입 | TypeScript 4.5 (strict) | 어드민 특성상 API 타입 안전성 필수 |
| 상태관리 | Redux Toolkit + Redux-Saga | 복잡한 비동기 플로우 (인증, 순차 API) 처리 |
| 일부 API | RTK Query | 단순 CRUD는 보일러플레이트 없이 처리 |
| 스타일링 | Styled Components + MUI v4 | 어드민 UI 컴포넌트 활용, 커스텀 테마 적용 |
| HTTP | Axios + humps | 인터셉터로 인증·변환 중앙화, snake↔camel 자동 변환 |
| 빌드 | Webpack 4 + Express | SSR 없이 SPA + 프록시 서버 |
| 디자인 시스템 | 사내 디자인 시스템 | CLO-SET 브랜드 일관성 |

---

## 회고 / 아쉬웠던 점

초기에 "지금 당장 동작하는 코드"보다 "나중에 사람이 늘어도 망가지지 않는 구조"에 투자한 것이 4년간 프로젝트를 확장하는 데 실질적인 이점이 됐다. 특히 도메인별 디렉터리 컨벤션을 초반에 잡아둔 덕분에, Groups·Marketplace·Member 등 신규 도메인 추가 시마다 "어디에 파일을 만들어야 하는가"에 대한 논의 비용이 거의 없었다. 한편 Webpack 4 기반 커스텀 빌드 스크립트를 유지하는 것은 버전 업그레이드 시 부담이 됐다 — Next.js나 Vite 기반으로 초기 설계했다면 빌드 유지보수 비용을 줄일 수 있었을 것이다.
