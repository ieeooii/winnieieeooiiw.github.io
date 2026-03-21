# 프론트엔드 에러 처리 시스템 구축

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, Next.js (App Router), TypeScript, React Query v5, Emotion.js, Storybook, Datadog, next/font |
| 개발 기간 | 2023.09 ~ 2023.10 |
| 인원 | 프론트엔드 1, 백엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당) |

## 소개

총 세 단계로 진행된 에러 시스템 구축 작업이다. 1단계(2022.09 ~ 2023.02)에서는 단일 에러 페이지로 인한 사용자 기능 전면 차단 문제와 비효율적인 에러 모니터링을 개선했다. UX 관점 반대 의견을 에러 케이스 전수 분석 및 발표로 설득하고 공통 에러 핸들링 라이브러리를 전담 설계·구현했다. 2단계(2023.09 ~ 2024.06)에서는 콘텐츠 앱의 에러 경험 체계화와 Next.js 성능 개선을 진행했고, 3단계(2024.10 ~ 2025.03)에서는 앱별로 분산되어 있던 에러 처리 UI를 통합하는 에러 UI 패키지와 SSR 전용 패키지를 단독으로 설계·구축했다.

## 주요 구현 (1단계) — 에러 핸들링 시스템 구축

### 에러 타입 세분화 및 Boundary 분리
- **Problem**: 단일 에러 페이지로 에러 발생 시 사용자 기능 전면 차단. 시간/일 단위로 비효율적인 에러 모니터링.
- **Solve**: 에러를 네트워크·인증·권한·서버 등으로 세분화. Partial·Toast·Global(Route 단위) Error Boundary를 분리해 사용자 기능 전면 차단 최소화.
- **Result**: 사용자 리포트 시 즉시 에러 추적 가능한 구조 구현. 모니터링 효율을 시간/일 단위에서 분 단위로 단축.

### SSR 에러 핸들링 모듈 구축
- **Problem**: Next.js 보안 정책으로 error.tsx에서 SSR 에러 추적 불가
- **Solve**: 페이지 컴포넌트의 prop 제약으로 HOC 대신 closure 형태의 ssrErrorInterceptor 설계. 상태코드·Tracking ID 등 에러 데이터를 클라이언트에서 수신할 수 있도록 우회 처리.
- **Insight**: SSR 에러를 CSR로 전달 후 throw하는 우회 방식 특성상 에러 UI 노출 시점에 약간의 지연이 발생하는 트레이드오프 존재

### API 요청 레이어 구축
- **Solve**: Axios Interceptor 기반 request·response·error 처리 통합. axios.isAxiosError() 타입 가드로 500 에러·네트워크 에러 발생 시 TanStack Query retry 옵션으로 최대 3회 재시도.


## 주요 구현 (2단계) — 에러 핸들링 & 성능 개선

### 글로벌 에러 페이지 구축
- **Problem**: API 에러 발생 시 빈 화면이나 기본 Next.js 에러 화면이 노출되어 사용자 경험이 나빴다.
- **Solve**: `CustomErrorPageView` 컴포넌트와 HTTP 상태 코드별(403/404/500) SVG 일러스트를 제작하고, App Router의 `error.tsx` / `not-found.tsx` error boundary에 연결.
- **Result**: 에러 상황에서 브랜드 일관성 있는 피드백 제공.

### react-query v5 마이그레이션
- **Problem**: react-query v4 → v5 breaking change(`cacheTime` → `gcTime` 등 API 변경)로 앱 전체 쿼리 코드 수정이 필요했다.
- **Solve**: 공통 React Query 패키지 내 공통 설정을 먼저 v5 기준으로 업데이트한 후, 앱별 사용처를 순차 마이그레이션.
- **Result**: v5의 개선된 타입 추론과 devtools 활용 가능해짐.
- **Insight**: shared 패키지를 먼저 변경하고 앱을 나중에 변경하는 순서가 중요했다. 공통 패키지의 버전 추상화가 마이그레이션 비용을 얼마나 줄여주는지 실감했다.

### 폰트 & Zendesk 성능 최적화
- **Problem**: 외부 폰트 및 Zendesk 위젯 스크립트가 초기 렌더링 블로킹을 유발했다.
- **Solve**: Next.js `next/font`로 폰트 최적화, Zendesk 스크립트를 동적 로딩으로 변경.
- **Result**: 초기 페이지 로드 체감 속도 향상.

## 주요 구현 (3단계) — 에러 UI 패키지 & SSR 에러 패키지 구축

### 에러 UI 패키지 설계 (단독)
- **Problem**: 각 앱마다 에러 UI를 별도로 구현해 디자인 일관성이 없고 코드가 중복됐다. 페이지 단위의 전역 에러 처리 대신 컴포넌트 단위로 에러를 격리하는 Partial Error Boundary 패턴이 필요했다.
- **Solve**: 독립 패키지로 에러 UI 컴포넌트를 추출하고, `ErrorBox`(인라인 에러)·`ErrorBoundaryWithBadge`(배지로 상태 표시) 등을 공통화. i18n 번역 지원을 포함해 다국어 앱에서도 그대로 사용 가능하도록 설계. 인증 앱 에러 핸들러 연동.
- **Result**: 에러 UI가 단일 소스로 관리되고, auth/content 앱에서 import만으로 사용 가능.

### SSR 에러 패키지 설계 (단독)
- **Problem**: Next.js SSR 환경에서는 클라이언트 Error Boundary가 동작하지 않아 서버 에러 처리가 별도로 필요했다.
- **Solve**: Next.js `error.tsx` / `global-error.tsx`에 맞는 SSR 에러 핸들링 유틸을 별도 패키지로 분리.
- **Result**: CSR/SSR 환경 모두에서 일관된 에러 처리 가능.

## 회고 / 아쉬웠던 점

에러 처리는 기능 개발보다 후순위로 밀리기 쉬운데, 패키지로 선제적으로 구축해두니 이후 신규 앱 추가 시 에러 처리 비용이 거의 0에 가까웠다. 부분 에러 경계 패턴이 사용자 경험에 미치는 임팩트를 이 작업에서 처음으로 직접 체감했다.
