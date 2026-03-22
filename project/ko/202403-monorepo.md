---
thumbnail: /images/projects/202305-monorepo-3d-viewer-renewal.png
gradient: linear-gradient(135deg, #eaeaed, #d0d2d8)
---

# 모노레포 도입 및 플랫폼 리뉴얼 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js (App Router), Vite, React.js, TypeScript, TanStack Query, Jotai, Yarn Berry PnP, Rollup, esbuild, Emotion, i18next, Socket.io, ESLint, Husky, commitlint, axios |
| 개발 기간 | 2023.05 ~ 2024.03 |
| 인원 | 프론트엔드 1, 데브옵스 1, 프로덕트 디자이너 1, 백엔드 1 (프론트엔드 단독 주도) |
| 서비스 링크 | style.clo-set.com |
| 블로그 | [Monorepo — Yarn vs Lerna vs Turbo](https://ieeooii.notion.site/Monorepo-Yarn-vs-Lerna-vs-Turbo-5fc49b69b2c54a18ac1d1bc7677af536?pvs=143) |

## 소개

레거시 One-Repo 구조로 인한 빌드 타임 증가와 과도한 코드 의존성, Core Web Vitals 지표 악화 문제 해결. CLO-SET v3 프로젝트의 yarn workspaces 기반 모노레포를 초기 설계하고, 공통 API 클라이언트 패키지 구축 및 App Router 기반 아키텍처 재설계까지 전 과정을 주도했다. 모노레포 전환으로 로딩 속도 40% 개선, 핵심 성능 지표 35% 향상.

![모노레포 3D 뷰어 리뉴얼](/images/projects/202305-monorepo-3d-viewer-renewal.png)

## 주요 구현

### 모노레포 환경 구축

- **Problem**: 레거시 구조로 빌드 타임이 길고 코드 간 의존성이 과도하게 얽혀 있었으며, 페이지 초기 로딩 성능 저하로 Core Web Vitals 지표 악화
- **Solve**:
  - Yarn Berry PnP 채택으로 빌드 의존성 최소화, PnP 미지원 라이브러리는 packageExtensions로 패치
  - .gitattributes에 .pnp.*를 binary로 지정, compressionLevel: mixed 설정으로 Git 충돌 최소화
  - config-plugin 구성으로 패키지 간 타입 공유 환경 구축, --topological-dev 옵션으로 의존성 기반 빌드 순서 자동화
- **Result**: 레거시 대비 페이지 로딩 속도 약 40% 개선 / Datadog RUM 기준 FCP/LCP/LT 종합 평균 35% 성능 향상
- **Insight**: Yarn Berry PnP 채택 후 Git 충돌 빈도 증가와 대규모 확장 시 빌드 오케스트레이션 한계를 경험. pnpm + Turborepo 조합이 더 적합했을 것으로 판단

### 공유 패키지 레이어 설계

- **Problem**: 앱이 늘어날수록 동일한 유틸리티·훅·API 호출 코드가 각 앱에 복사되어 유지보수 비용이 선형적으로 증가. 앱 간 의존성 방향이 불명확해 어느 범위까지 공유해야 하는지 합의가 어려웠다.
- **Solve**:
  - **레이어 계층화**: `config` → `shared` → `ui` → `viewer` → `apps` 순서로 의존성 방향을 단방향으로 고정. 상위 레이어는 하위 레이어를 참조할 수 없도록 구조적으로 강제
  - **공유 패키지 목적별 분리**: API 클라이언트, 커스텀 훅 모음, 범용 유틸리티, 전역 상태 atom, React Query 공통 설정, i18n, 소켓 클라이언트, 쿠키 관리 등 도메인별로 패키지를 분리해 불필요한 번들 포함 방지
  - **API 클라이언트 패키지 설계**: axios 인스턴스를 중앙화하고 API 버전별(v1/v2/v3)로 factory 함수로 추상화. React Query와 연동하는 query/mutation hook 기반으로 설계해 앱별 중복 구현 방지
  - **workspace 프로토콜**: 내부 패키지는 workspace 참조로 로컬 소스를 직접 소비하되, 빌드 결과물은 `dist/`로 격리해 앱이 빌드된 패키지만 참조하도록 관리
- **Result**: 앱 추가 시 공유 패키지 import 한 줄로 기능 재사용 가능. API 버전 마이그레이션 시 API 클라이언트 패키지 내부 변경만으로 모든 앱에 일괄 적용됨
- **Insight**: 패키지 수가 많아질수록 소유자와 용도가 불명확해져 중복 패키지가 생긴다. 패키지 생성 시 목적·소유자·사용처를 README에 기록하는 것이 장기적으로 가장 중요한 관례였다.

### 패키지 유형별 빌드 도구 차별화

- **Problem**: 단일 빌드 도구로 모든 패키지 유형(앱, 컴포넌트 라이브러리, 유틸 라이브러리)을 처리하면 빌드 속도와 출력 형식 최적화 사이에서 타협이 불가피했다.
- **Solve**: 패키지 성격에 따라 빌드 도구를 차별 적용
  - **esbuild** (유틸 패키지): 순수 TypeScript 유틸 패키지는 esbuild로 빌드해 Node.js용과 브라우저용 두 타겟을 동시 출력. 트리쉐이킹·미니파이·소스맵 모두 적용
  - **Rollup** (훅·유틸·컴포넌트 라이브러리): Rollup으로 CJS + ESM 듀얼 포맷 출력. Babel·TypeScript·PostCSS 플러그인 조합으로 정확한 타입 선언 파일 생성
  - **Next.js** (SSR 메인 앱): SSR이 필요한 메인 앱은 Next.js App Router 빌드 파이프라인 사용. Incremental 빌드와 번들 분석기 내장
  - **Vite** (정적 SPA): 서버 렌더링이 불필요한 SPA는 Vite로 전환해 개발 서버 콜드 스타트 시간 단축 및 빌드 속도 개선
- **Result**: 유틸 패키지는 esbuild의 속도 이점을, 컴포넌트 라이브러리는 Rollup의 정밀한 출력 제어를, 앱은 각 프레임워크 최적 빌드 파이프라인을 각각 활용
- **Insight**: 빌드 도구 분산은 파이프라인 복잡도를 높인다. 온보딩 시 도구 선택 기준이 문서화되어 있지 않으면 혼란이 생겼다. 결정 근거를 기여 가이드에 남기는 것이 필요했다.

### 코드 품질 자동화 파이프라인

- **Problem**: 여러 앱·패키지가 공존하는 모노레포에서 일관된 코드 스타일과 커밋 메시지 형식을 강제하지 않으면, 리뷰 시 스타일 논의로 시간이 낭비되고 CHANGELOG 자동화도 불가능해진다.
- **Solve**:
  - **pre-commit 훅**: 스테이징된 파일의 패키지를 자동 감지해 해당 패키지의 린트만 실행. 전체 모노레포 린트를 돌리지 않아 커밋 속도 영향 최소화
  - **commitlint + Conventional Commits**: `commit-msg` 훅에서 `feat`, `fix`, `refactor` 등 타입 접두사 없는 커밋 차단. 이후 릴리즈 노트·CHANGELOG 자동화 기반 확보
  - **공유 ESLint 설정 패키지**: TypeScript strict 파서, `no-console` 경고, 함수 반환 타입 명시 강제 등 팀 공통 규칙을 단일 패키지로 관리해 각 앱이 상속만으로 적용
  - **공유 TypeScript 설정 패키지**: 베이스 config를 Next.js용 / 일반 React용으로 각각 상속해 `strict: true`, `noUnusedLocals`, `noUnusedParameters` 등 타입 안전성 규칙을 모든 패키지에 일관 적용
- **Result**: 스타일 리뷰 코멘트 대폭 감소, 린트 오류가 있는 커밋 원천 차단, 커밋 히스토리 표준화로 릴리즈 자동화 기반 구축
- **Insight**: 모노레포에서 품질 자동화의 핵심은 전체를 강제하되 속도를 잃지 않는 것이었다. 변경된 패키지만 선별 린트하는 전략이 개발자 경험을 유지하는 데 결정적이었다.

### App Router 기반 렌더링 아키텍처 설계

- **Problem**: Pages Router 기반 구조에서 뷰 타입별 페이지 전환 시 레이아웃 리마운트가 발생해, SSR 데이터 패칭과 클라이언트 상태가 분리되지 않아 워터폴 요청과 데이터 불일치가 반복 발생
- **Solve**:
  - **렌더링 구조 재설계**: Parallel Routes로 뷰 타입별 슬롯을 분리해 전환 시 레이아웃을 유지하고, 서버 컴포넌트에서 데이터를 미리 패칭해 HydrationBoundary로 클라이언트에 전달. Next.js dynamic import로 페이지 단위 코드 스플리팅 적용해 초기 로딩 리소스 최소화
  - **앱 레이어 설계**: Next.js middleware에서 인증·언어 라우팅을 처리해 페이지 컴포넌트가 인증 로직을 알지 못하도록 분리
- **Result**: 뷰 전환 시 레이아웃 리마운트 제거 및 초기 데이터 워터폴 해소
- **Insight**: App Router 전환은 단순한 기술 선택이 아니라 팀 전체가 새로운 렌더링 모델을 이해해야 하는 변화였다. Pages Router의 한계를 데이터로 정리해 발표하고 설득하는 과정이 기술 결정만큼 중요했고, 서버/클라이언트 컴포넌트 경계를 컨벤션으로 명문화하지 않으면 시간이 지나며 경계가 흐려진다는 것을 경험했다.

### URL 설계 — Path Variable / Query Parameter 역할 분리

- **Problem**: App Router 전환 과정에서 일부 URL이 Path Parameter로 뷰 상태·필터 조건을 전달하고 있었다. `/items/category-id/sort-type`처럼 선택 상태를 경로에 포함하면, 정렬·필터가 바뀔 때마다 별도의 라우트로 처리돼 레이아웃 리마운트가 발생하거나 히스토리가 불필요하게 쌓인다.
- **Solve**: RESTful API 설계 원칙을 URL 구조에 적용 — **어떤 자원의 위치를 특정하는 경우에만 Path Variable**을 사용하고, **정렬·필터처럼 같은 자원을 다른 방식으로 보여주는 경우는 Query Parameter**로 전환. 예: `/items/[id]` → 특정 아이템 식별, `/items?category=X&sort=recent` → 필터링된 목록.
- **Result**: 필터·정렬 변경이 라우트 전환이 아닌 쿼리 업데이트로 처리돼 레이아웃 리마운트 없이 상태 유지. URL만으로 현재 뷰 상태를 재현 가능하고 불필요한 히스토리 오염 제거.
- **Insight**: URL 구조는 라우팅 전략과 직결되기 때문에, 초기 설계 시 Path/Query 역할을 명확히 합의해두지 않으면 App Router 이관 시 반복적인 리팩토링이 필요해진다. 라우팅 설계를 늦게 잡을수록 수정 비용이 커진다는 것을 실감했다.

### 상태 관리 전략 이원화 (Jotai + TanStack Query)

- **Problem**: MobX는 자유도가 높은 만큼 상태 변이 지점이 여러 곳에 분산되기 쉬워, 사이드이펙트 추적이 어렵고 예측 불가능한 리렌더링이 반복 발생. 클라이언트 상태와 서버 상태도 혼재된 채 관리되고 있어 구조적인 정리가 필요
- **Solve**:
  - **Jotai 전환**: Recoil·Zustand 등 대안을 검토했으나, 빠른 개발 속도가 요구되는 팀 상황을 고려해 러닝커브가 낮고 기존 React 패턴과 이질감이 적은 Jotai를 선택. 전역 Observable 의존 구조를 도메인 단위 atom으로 전환해 필요한 슬라이스만 구독하고 파생 atom으로 불필요한 리렌더링 억제
  - **클라이언트·서버 상태 이원화**: UI 인터랙션 상태는 Jotai, API 응답 데이터는 TanStack Query로 계층을 명확히 분리해 규칙화. 쿼리 키를 도메인별로 중앙화해 캐시 무효화 범위를 명시적으로 제어
  - **Optimistic Update 표준화**: UX 민감한 뮤테이션에 낙관적 업데이트를 적용해 사용자가 인식하는 응답 지연을 제거
- **Result**: 상태 변이 추적이 어렵던 MobX 구조를 atom 단위로 전환해 사이드이펙트 범위 명확화 / 클라이언트·서버 상태 분리로 캐시 충돌 제거, UX 민감 구간 응답 지연 해소
- **Insight**: 팀 개발 속도를 우선해 Jotai를 선택했지만, 컴포넌트 외부에서 atom에 접근할 수 없어 외부 상태에 접근해야 할 때 불편함이 있었다. 개발 속도와 유연성 사이의 트레이드오프를 미리 충분히 검토했어야 했고, 외부 접근이 가능한 Zustand가 더 적합했을 것으로 판단된다.

### 컴포넌트 설계 VAC 패턴 전환

- **Problem**: Container/Presenter 패턴 사용 중 컨테이너에 로직·API·스타일이 혼재해 재사용성 저하, 동일 UI의 중복 구현 반복, 확장성 저하 발생
- **Solve**:
  - **VAC(View-Accessory-Container) 패턴 도입**: 모든 컴포넌트를 로직·상태 연결 / 순수 렌더링 / 스타일·타입으로 고정 분리하고 컨벤션 문서에 규칙으로 명문화
  - **데이터 패칭 전용 컴포넌트 레이어 추가**: 데이터 패칭이 필요한 컴포넌트를 별도 분리해 Suspense·ErrorBoundary 경계를 컨테이너 밖으로 래핑할 수 있도록 관심사 분리
  - **도메인 단위 훅 분리**: 각 훅이 단일 도메인 로직만 담도록 기능 단위로 분리해 응집도 향상
  - **framework-agnostic 모듈 계층 분리**: React에 의존하지 않는 순수 비즈니스 로직을 `modules/`에 격리
- **Result**: 동일 View를 여러 Container에서 재사용 / 에러·로딩 관심사 분리로 컴포넌트 복잡도 감소 / 비즈니스 로직의 React 의존성 제거로 독립 테스트 가능
- **Insight**: VAC 패턴은 컴포넌트 단위 분리에는 효과적이었지만, 앱 규모가 커질수록 기능 간 의존성과 레이어 경계가 불명확해지는 한계가 있었다. FSD(Feature-Sliced Design)를 함께 도입했다면 레이어 단위 의존성 방향을 강제할 수 있어 더 유리했을 것 같다.

### 렌더링 최적화 (react-virtuoso + React DevTools Profiler)

- **Problem**: 무거운 자원을 동시에 다루는 페이지에서 불필요한 리렌더링과 초기 로딩 지연으로 대용량 리스트 렌더링 시 스크롤 성능이 저하 발생
- **Solve**:
  - **성능 병목 파악 후 선별 적용**: React DevTools Profiler로 불필요한 리렌더링 지점을 파악하고, 실제로 비용이 큰 구간에만 React.memo·useMemo·useCallback을 선별 적용
  - **react-virtuoso 가상 스크롤**: 대용량 리스트에 VirtuosoGrid를 도입해 수백~수천 개의 아이템을 DOM에 모두 마운트하지 않도록 처리
  - **Image 최적화**: 공통 이미지 로더를 적용하고 LCP 이미지에 로딩 우선순위를 설정
  - **폰트 최적화**: `next/font`로 외부 폰트를 최적화해 폰트 로딩으로 인한 렌더링 블로킹 제거
  - **서드파티 스크립트 지연 로딩**: 외부 위젯 스크립트를 동적 로딩으로 전환해 초기 렌더링 블로킹 해소
- **Result**: 불필요한 리렌더링 및 재초기화 방지, 대용량 리스트 스크롤 버벅임 해소, DOM 노드 수 대폭 감소, 초기 페이지 로드 체감 속도 향상
- **Insight**: 성능 최적화는 측정 없이 적용하면 코드만 복잡해진다. Profiler로 병목을 먼저 특정하고 적용 범위를 좁히는 순서가 중요했고, 조기 최적화가 오히려 가독성을 해칠 수 있다는 것을 실감했다.


## 회고 / 아쉬웠던 점

- 모노레포 초기 구조 결정이 이후 수십 개 패키지의 방향을 결정하는 만큼 신중하게 접근했다. 공통 패키지의 버전 추상화가 마이그레이션 비용을 얼마나 줄여주는지 실감할 수 있었던 프로젝트였다.
- 기술 결정 과정에서 Yarn Berry PnP, Jotai 등 선택마다 트레이드오프가 있었고, 이후 돌아보면 다르게 선택했을 것들이 있다. 하지만 각 선택의 이유와 한계를 팀이 함께 인지하고 있었기 때문에, 이후 개선 방향을 합의하는 데 드는 비용이 낮았다. 기술 선택보다 선택의 근거를 공유하는 것이 더 중요하다고 느꼈다.
