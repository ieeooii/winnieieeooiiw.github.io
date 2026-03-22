---
thumbnail: /images/projects/error-overview.png
gradient: linear-gradient(135deg, #f8d7da, #f5c6cb)
---

# 프론트엔드 에러 처리 시스템 구축

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | ETC |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js (App Router), TypeScript, React Query v5, Emotion.js, Storybook, Datadog, next/font |
| 개발 기간 | 2024.09 ~ 2025.03 |
| 인원 | 프론트엔드 1, 백엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당) |
| 서비스 링크 | [style.clo-set.com](https://style.clo-set.com) |
| 블로그 | [Next.js App Router 에러 핸들링](https://ieeooii.notion.site/Next-js-40774c0161f04c4484a28a9c34d510c5?pvs=143) / [Next.js 14 App Router SSR Custom Error](https://ieeooii.notion.site/Next-js-14-app-router-SSR-Custom-error-22fd2142e651439ea74820342ee0a12d?pvs=143) |

## 소개

총 세 단계로 진행된 에러 시스템 구축 작업이다. 1단계(2024.09 ~ 2024.10)에서는 단일 에러 페이지로 인한 사용자 기능 전면 차단 문제와 비효율적인 에러 모니터링을 개선했다. UX 관점 반대 의견을 에러 케이스 전수 분석 및 발표로 설득하고 공통 에러 핸들링 라이브러리를 전담 설계·구현했다. 2단계(2024.10 ~ 2024.12)에서는 콘텐츠 앱의 에러 경험 체계화와 Next.js 성능 개선을 진행했고, 3단계(2024.12 ~ 2025.03)에서는 앱별로 분산되어 있던 에러 처리 UI를 통합하는 에러 UI 패키지와 SSR 전용 패키지를 단독으로 설계·구축했다.

<div class="img-row-3">

![Route Group 기반 에러 Boundary 설계안](/images/projects/202409-error-system-route-group.webp)
![에러 Boundary 아키텍처 설계안](/images/projects/error-handling-case.png)
![에러 케이스 유형 정리](/images/projects/error-edge-case.png)

</div>

<div class="img-row-3">

![Toast·인라인 에러·뷰어 에러가 공존하는 화면](/images/projects/error-overview.png)
![모달 내 Toast 에러 (Modal 스코프)](/images/projects/error-modal-toast.png)
![인증 앱 Toast 에러 (Trace ID 포함)](/images/projects/error-auth-toast.png)

</div>

## 주요 구현 (1단계) — 에러 핸들링 시스템 구축

### 에러 타입 세분화 및 Boundary 분리

- **Problem**: 단일 에러 페이지로 에러 발생 시 사용자 기능 전면 차단. 시간/일 단위로 비효율적인 에러 모니터링.
- **Solve**:
  - 에러를 네트워크·인증·권한·서버 등으로 세분화하고, HTTP 상태 코드(400/401/403/404/500)에 대응하는 타입 체계 설계
  - **Boundary 3계층 분리**: 컴포넌트 인라인 에러는 Partial Error Boundary(ErrorBox/Badge/InlineText 형태), 비차단 알림은 Toast Portal(Global/Modal 스코프), 페이지 단위 에러는 Next.js `error.tsx` Route Segment로 격리
  - Partial Error Boundary에 에러 코드별 UI 결정 콜백을 주입 가능하도록 설계해, 에러 처리 로직이 컴포넌트 외부로 분리됨
- **Result**: 사용자 리포트 시 즉시 에러 추적 가능한 구조 구현. 모니터링 효율을 시간/일 단위에서 분 단위로 단축.

### SSR 에러 핸들링 모듈 구축
- **Problem**: Next.js는 프로덕션 빌드에서 보안을 위해 서버 컴포넌트의 에러 메시지를 제거한다. 이로 인해 `error.tsx`에 도달하는 시점에는 에러 코드·Trace ID 등 디버깅에 필요한 정보가 소실된다.
- **Solve**:
  - **직렬화 우회 전략**: API 에러를 상태 코드·에러 코드·Trace ID를 담은 구조체로 변환한 뒤 JSON 문자열로 직렬화해서 throw. Next.js가 메시지를 제거하기 전에 에러 데이터를 문자열 형태로 감싸, `error.tsx`에서 역직렬화해 원래 정보를 복원하는 방식으로 우회
  - **HOC 대신 closure 선택**: Next.js 페이지 컴포넌트는 props 구조가 고정되어 HOC 패턴 적용이 불가능. 서버 컴포넌트 함수를 인자로 받는 closure로 설계해 에러를 Next.js 외부에서 선제 포착하고, 에러 시 서버 에러 처리 컴포넌트를 직접 렌더링
  - **역직렬화 실패 폴백**: JSON 역직렬화 실패 시(직렬화되지 않은 런타임 에러 등) 별도 에러 타입으로 분류하고 Datadog에 전체 스택 트레이스를 전송해 놓치는 에러가 없도록 처리
- **Insight**: SSR 에러를 CSR로 전달 후 throw하는 우회 방식 특성상 에러 UI 노출 시점에 약간의 지연이 발생하는 트레이드오프 존재

### API 요청 레이어 구축
- **Problem**: 앱별로 인증 토큰 갱신, 에러 변환, 요청 추적 로직이 중복 구현되어 있어 동작 불일치와 유지보수 비용이 높았다.
- **Solve**:
  - **Axios 인터셉터 3단계 구성**: request 단계에서 요청 시각 커스텀 헤더를 추가해 서버 응답 지연 추적. response 단계에서 Datadog Trace ID를 응답 헤더에서 추출해 로그에 포함. error 단계에서 AxiosError를 상태 코드·에러 코드·Trace ID를 담은 구조체로 변환 후 JSON 문자열로 직렬화해 throw
  - **토큰 자동 갱신 및 재시도**: 401 응답 시 쿠키의 refresh token으로 갱신 API를 호출하고, 성공 시 원래 요청을 자동 재시도. 갱신 실패 상태(만료·무효)를 HTTP 상태 코드로 구분해 각각 returnUrl 포함 로그아웃 / 세션 만료 페이지로 분기 처리
  - **인증 앱 독립 fetch 레이어**: 인증 앱은 Axios 대신 native fetch 기반 독자 레이어를 사용. 동일한 토큰 갱신·재시도 로직을 구현하되, 서버 사이드 로그 출력 조건을 환경 변수로 제어
- **Result**: 모든 API 에러가 일관된 에러 구조체로 변환되어 에러 경계와 에러 페이지에서 추가 처리 없이 에러 코드·Trace ID를 바로 활용 가능해짐


## 주요 구현 (2단계) — 에러 핸들링

### 글로벌 에러 페이지 구축
- **Problem**: API 에러 발생 시 빈 화면이나 기본 Next.js 에러 화면이 노출되어 사용자 경험이 나빴다.
- **Solve**: 커스텀 에러 페이지 컴포넌트와 HTTP 상태 코드별(403/404/500) SVG 일러스트를 제작하고, App Router의 `error.tsx` / `not-found.tsx` error boundary에 연결.
- **Result**: 에러 상황에서 브랜드 일관성 있는 피드백 제공.

### react-query v5 마이그레이션
- **Problem**: react-query v4 → v5 breaking change(`cacheTime` → `gcTime` 등 API 변경)로 앱 전체 쿼리 코드 수정이 필요했다.
- **Solve**: 공통 React Query 패키지 내 공통 설정을 먼저 v5 기준으로 업데이트한 후, 앱별 사용처를 순차 마이그레이션.
- **Result**: v5의 개선된 타입 추론과 devtools 활용 가능해짐.
- **Insight**: shared 패키지를 먼저 변경하고 앱을 나중에 변경하는 순서가 중요했다. 공통 패키지의 버전 추상화가 마이그레이션 비용을 얼마나 줄여주는지 실감했다.

## 주요 구현 (3단계) — 에러 UI 패키지 & SSR 에러 패키지 구축

### 에러 UI 패키지 설계 (단독)

- **Problem**: 각 앱마다 에러 UI를 별도로 구현해 디자인 일관성이 없고 코드가 중복됐다. 페이지 단위의 전역 에러 처리 대신 컴포넌트 단위로 에러를 격리하는 Partial Error Boundary 패턴이 필요했다.
- **Solve**:
  - **에러 UI 컴포넌트 계층화**: 전체 화면 에러(HTTP 상태별 SVG 일러스트 포함) / 인라인 에러 박스(sm·lg 사이즈) / Boundary 래퍼 컴포넌트 3종으로 계층을 분리해 사용 맥락에 따라 조합 가능하도록 설계
  - **Trace ID 클립보드 컴포넌트**: Trace ID 복사 컴포넌트를 별도로 분리해 에러 UI 어디서든 Trace ID를 복사할 수 있도록 구성. 사용자가 Trace ID를 CS 채널에 제출할 수 있어 빠른 디버깅 지원
  - **Toast Portal 시스템**: Global/Modal 두 스코프의 Toast Portal을 분리 구현. 뮤테이션 에러처럼 UI를 차단하지 않는 에러는 스코프별 Toast 훅으로 비차단 알림 처리
  - **에러 번역 프로바이더**: 에러 메시지 번역을 Context로 주입해 다국어 앱에서 에러 UI가 번역을 직접 의존하지 않도록 분리. Storybook으로 컴포넌트별 에러 시나리오 문서화
- **Result**: 에러 UI가 단일 소스로 관리되고, 각 앱에서 import만으로 사용 가능. Trace ID 기반 에러 추적 흐름이 UI 레벨에서 완결됨

### SSR 에러 패키지 설계 (단독)
- **Problem**: 1단계에서 앱 내부에 구현된 SSR 에러 처리 로직이 앱마다 별도로 중복 구현되어 일관성이 없었다. 신규 앱 추가 시마다 동일한 직렬화 전략과 에러 인터셉터를 반복 구현해야 했다.
- **Solve**:
  - SSR 에러 인터셉터, 에러 구조체 타입, 직렬화·역직렬화 유틸리티, 에러 변환·투척 핸들러를 독립 패키지로 추출
  - Next.js `error.tsx` / `global-error.tsx` 연동 패턴을 패키지 내부에 추상화해 각 앱이 구현 방식을 통일할 수 있도록 제공
  - 패키지를 SSR 전용으로 분리해 클라이언트 번들에 포함되지 않도록 관리
- **Result**: 신규 앱 추가 시 에러 처리 구현 비용이 패키지 설치·연동 수준으로 감소. CSR/SSR 환경 모두에서 일관된 에러 처리 보장

## 회고 / 아쉬웠던 점

부분 에러 경계 패턴이 사용자 경험에 미치는 임팩트를 이 작업에서 처음으로 직접 체감했다. 에러를 인프라 수준으로 다루는 것이 제품 품질에 미치는 영향이 생각보다 컸다.
