---
thumbnail: /images/projects/202101-backoffice-admin.svg
gradient: linear-gradient(135deg, #e8eaf0, #c8ccd8)
---

# 사내 어드민 백오피스 초기 설계

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

## 주요 구현

### 비즈니스 코드·템플릿 코드 분리로 도메인 확장 가능한 디렉터리 구조 설계

- **Problem**: 초기 프로젝트는 서드파티 어드민 템플릿을 기반으로 시작했기 때문에, 비즈니스 로직 컴포넌트와 템플릿 전용 컴포넌트(샘플 페이지, 차트, 지도 등)가 동일한 최상위 디렉터리에 혼재해 있었다. 실제 비즈니스 코드와 템플릿 코드를 구분하지 못해 신규 팀원이 어떤 파일을 참고해야 하는지 파악하기 어려웠고, 프로젝트가 커질수록 파일 탐색 비용이 커질 것이 명확했다.
- **Solve**: 템플릿 전용 코드를 별도 네임스페이스로 격리하고, 어드민 공통 UI는 `common/` 하위로 분리. 도메인별로 `api/`, `components/`, `containers/`, `features/` 디렉터리가 일관된 패턴으로 구성되는 구조를 수립. 전체 파일의 import 경로를 일괄 수정하고, React import 방식도 TypeScript strict 환경 기준으로 통일.
- **Result**: 비즈니스 코드와 템플릿 코드 완전 분리, 이후 신규 도메인 추가 시 일관된 디렉터리 패턴 적용 가능한 기반 마련

### 복잡도별 Saga·RTK Query 혼합으로 상태 관리 보일러플레이트 최소화

- **Problem**: 어드민 특성상 복잡한 비동기 플로우(인증 → 토큰 갱신 → API 재시도)와 단순 CRUD API 호출이 공존한다. Redux-Saga만 사용하면 단순 API 호출에도 action·saga·reducer를 모두 작성해야 하는 보일러플레이트가 과도해진다.
- **Solve**: 복잡한 비동기 시퀀스는 Redux-Saga로, 단순 API 캐싱이 필요한 도메인은 RTK Query로 처리하는 혼합 구조 채택. Redux DevTools는 개발 환경에서만 활성화.
- **Result**: 도메인 복잡도에 따라 Saga vs RTK Query를 선택해 적용하는 유연한 구조 확립

### Axios 인터셉터로 JWT 인증·snake↔camel 변환 중앙화

- **Problem**: 모든 API 요청에 JWT 토큰을 주입하는 로직이 각 API 호출 코드에 분산될 경우, 토큰 갱신·만료 처리를 일관되게 적용하기 어렵다. 또한 백엔드가 snake_case로 응답하는데 프론트엔드는 camelCase를 사용해, 모든 응답을 수동으로 변환해야 하는 문제가 있었다.
- **Solve**: request/response 인터셉터를 단일 모듈에 중앙 설계. request 인터셉터에서 인증 토큰을 읽어 Authorization 헤더를 자동 주입. response 인터셉터에서 snake_case → camelCase 변환을 전역 처리. 용도가 다른 두 Axios 인스턴스를 독립적으로 초기화해 도메인별 API 분리.
- **Result**: API 호출 코드에서 인증·변환 로직 완전 제거, 백엔드 응답 포맷 변경 시 단일 지점에서 대응 가능

## 기술 스택 선정 근거

| 영역 | 선택 | 이유 |
|------|------|------|
| UI | React 17 | 팀 숙련도, 생태계 |
| 타입 | TypeScript 4.5 (strict) | 어드민 특성상 API 타입 안전성 필수 |
| 상태관리 | Redux Toolkit + Redux-Saga | 복잡한 비동기 플로우 (인증, 순차 API) 처리 |
| 일부 API | RTK Query | 단순 CRUD는 보일러플레이트 없이 처리 |
| 스타일링 | Styled Components + MUI v4 | 어드민 UI 컴포넌트 활용, 커스텀 테마 적용 |
| HTTP | Axios + humps | 인터셉터로 인증·변환 중앙화, snake↔camel 자동 변환 |
| 빌드 | Webpack 4 + Express | SSR 없이 SPA + 프록시 서버 |

## 회고 / 아쉬웠던 점

초기에 "지금 당장 동작하는 코드"보다 "나중에 사람이 늘어도 망가지지 않는 구조"에 투자한 것이 4년간 프로젝트를 확장하는 데 실질적인 이점이 됐다. 특히 도메인별 디렉터리 컨벤션을 초반에 잡아둔 덕분에, 신규 도메인 추가 시마다 "어디에 파일을 만들어야 하는가"에 대한 논의 비용이 거의 없었다. 한편 Webpack 4 기반 커스텀 빌드 스크립트를 유지하는 것은 버전 업그레이드 시 부담이 됐다 — Next.js나 Vite 기반으로 초기 설계했다면 빌드 유지보수 비용을 줄일 수 있었을 것이다.
