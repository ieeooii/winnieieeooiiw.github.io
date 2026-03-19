# 모노레포 도입 및 웹 플랫폼 리뉴얼

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js (App Router), React.js, TypeScript, TanStack Query, Jotai, Yarn Berry PnP, ESLint, Husky, commitlint, esbuild, axios |
| 개발 기간 | 2023.05 ~ 2024.03 |
| 인원 | 프론트엔드 1, 데브옵스 1 (프론트엔드 단독 주도) |

## 소개

레거시 One-Repo 구조로 인한 빌드 타임 증가와 과도한 코드 의존성, Core Web Vitals 지표 악화 문제 해결. CLO-SET v3 프로젝트의 yarn workspaces 기반 모노레포를 초기 설계하고, 공통 API 클라이언트 패키지 구축 및 App Router 기반 아키텍처 재설계까지 전 과정을 주도했다. 모노레포 전환으로 로딩 속도 40% 개선, 핵심 성능 지표 35% 향상.

## 주요 구현

### 모노레포 환경 구축
- **Problem**: 레거시 구조로 빌드 타임이 길고 코드 간 의존성이 과도하게 얽혀 있었으며, 페이지 초기 로딩 성능 저하로 Core Web Vitals 지표 악화
- **Solve**:
  - Yarn Berry PnP 채택으로 빌드 의존성 최소화, PnP 미지원 라이브러리는 packageExtensions로 패치
  - .gitattributes에 .pnp.*를 binary로 지정, compressionLevel: mixed 설정으로 Git 충돌 최소화
  - config-plugin 구성으로 패키지 간 타입 공유 환경 구축, --topological-dev 옵션으로 의존성 기반 빌드 순서 자동화
- **Result**: 레거시 대비 페이지 로딩 속도 약 40% 개선 / Datadog RUM 기준 FCP/LCP/LT 종합 평균 35% 성능 향상
- **Insight**: Yarn Berry PnP 채택 후 Git 충돌 빈도 증가와 대규모 확장 시 빌드 오케스트레이션 한계를 경험. pnpm + Turborepo 조합이 더 적합했을 것으로 판단

### 공통 API 패키지 설계
- **Problem**: 여러 앱에서 API 호출 방식이 제각각으로 유지보수 비용이 높았다. 앱별 중복 구현을 방지하고, API 버전별(v1/v2) 일관된 요청 인터페이스가 필요했다.
- **Solve**: axios 인스턴스를 중앙화하고, v1/v2 API를 각각 factory 함수로 추상화. React Query와 연동하는 query/mutation hook 기반으로 설계. 공통 API 클라이언트를 독립 패키지로 분리해 앱별 중복 구현을 방지.
- **Result**: 앱에서 API 클라이언트를 import만으로 사용 가능해지고, 이후 v3 마이그레이션도 패키지 내부 변경으로 한정됨.

### 번들 최적화 및 라우팅 구조 개선
- **Solve**:
  - Next.js dynamic import로 페이지 단위 코드 스플리팅 적용, 초기 로딩 리소스 최소화
  - App Router 구조 기반 라우팅 계층과 레이아웃 분리로 중첩 페이지 구조를 유연하게 설계

### 상태 관리 이원화 및 API 캐싱 전략 재설계
- **Solve**:
  - 로컬 상태는 Jotai, 서버 상태는 TanStack Query로 이원화하여 렌더링 효율성과 유지보수성 동시 확보
  - TanStack Query 기반 API 캐싱 전략 재설계로 불필요한 네트워크 요청 최소화

### 개발 규칙 자동화 (commitlint + Husky + ESLint)
- **Problem**: 팀 규모 확대에 따라 커밋 메시지와 코드 스타일 일관성 확보가 필요했다.
- **Solve**: commitlint + Husky로 커밋 컨벤션 강제. ESLint 공유 config 패키지로 일관된 린트 규칙 적용. esbuild 기반 패키지 빌드 설정, Slack webhook 연동 빌드 알림 구성.
- **Result**: PR 리뷰에서 스타일 지적이 줄고, CI에서 자동 검증 가능해짐.

## 회고

- 모노레포 초기 구조 결정이 이후 수십 개 패키지의 방향을 결정하는 만큼 신중하게 접근했다. 공통 패키지의 버전 추상화가 마이그레이션 비용을 얼마나 줄여주는지 실감할 수 있었던 프로젝트였다.
- 초기에 공통 API 패키지 인터페이스를 잘 잡아둔 덕분에 이후 v2→v3 API 마이그레이션이 앱 코드 변경 없이 패키지 내부만 수정하면 됐던 점이 인상적이었다.
- Yarn Berry PnP 채택 후 Git 충돌 빈도 증가와 대규모 확장 시 빌드 오케스트레이션 한계를 경험. pnpm + Turborepo 조합이 더 적합했을 것으로 판단.
