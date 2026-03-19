# 플랜별 가격 & 사용량 제한 시스템 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 서비스 | CLOSET |
| 기술 스택 | Next.js, TypeScript, React Query, MobX |
| 개발 기간 | 2024.11 ~ 2025.05 |
| 인원 | 프론트엔드 (담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

Free / Academic / Pro / Enterprise 4개 플랜 구조에서 embed 횟수·렌더링 용량·파일 업로드·Workroom 생성·API 토큰 등 5가지 이상의 독립적인 사용량 제한 시스템을 구현했다. 한도 초과 시 업그레이드 유도 플로우와 퍼널 분석 로깅까지 포함한다.

---

## 주요 구현

### | 글로벌 UsageLimitExceededModal 단일화

- **Problem**: 초기에는 embed·렌더링·workroom 등 기능마다 각각 별도의 제한 모달 컴포넌트를 가지고 있었다. UI/UX가 기능마다 달랐고, 업그레이드 버튼 링크가 일부 기능에서 잘못 연결된 버그도 발생했다. 동일한 안내 문구가 5곳 이상 중복 정의되어 있었다.
- **Solve**: 서버가 한도 초과 시 반환하는 공통 에러 응답을 활용해 업그레이드 유도 모달을 글로벌 컴포넌트로 추출. 한도 초과 컨텍스트를 props로 전달받아 적절한 안내 문구와 링크 표시. 업그레이드 버튼 링크는 공통 상수로 일원화.
- **Result**: 모달 컴포넌트 5개 → 1개로 통합, 모든 기능에서 일관된 업그레이드 유도 UX 제공, 잘못된 링크 버그 해소

---

### | Academic 플랜 예외 처리

- **Problem**: Academic 플랜은 Pro와 API 응답상 동일하게 처리되지 않는 케이스가 있었다. 기존 코드가 Enterprise 여부만 이분법으로 분기했기 때문에 Academic 사용자에게 잘못된 한도가 적용되거나 엉뚱한 플랜 업그레이드 안내가 표시됐다.
- **Solve**: 플랜 타입 파라미터를 모든 사용량 관련 API 호출에 추가. Academic 조건을 별도 분기해 directupload 렌더링 제한·embed 한도·API token 사용 가능 여부를 각각 Academic 기준으로 재처리.
- **Result**: Free / Academic / Pro / Enterprise 4개 플랜 모두 정확한 사용량 제한 적용

---

### | Copy Space Structure 사용량 제한

- **Problem**: Space 구조 복사는 여러 단계의 API 호출을 순차 처리하는 플로우인데, 중간 단계에서 workroom 생성 한도를 초과해도 사용자에게 아무런 안내 없이 복사가 실패했다. 복사 완료 후 home store의 `itemData`에 `newSpaceId`가 반영되지 않아 UI가 갱신되지 않는 버그도 있었다.
- **Solve**: 복사 플로우의 각 단계에서 한도 초과 응답 감지 시 `UsageLimitExceededModal` 트리거. `newSpaceId`를 home store의 `itemData`에 추가하여 복사 후 UI 즉시 반영.
- **Result**: 복사 중 한도 초과 시 명확한 안내 제공, 복사 완료 후 UI 정합성 확보

---

### | Pricing Page 개편 — Main Features 섹션

- **Problem**: 기존 Pricing 페이지에는 플랜 가격 비교표만 있어 사용자가 플랜 간 기능 차이를 파악하기 어려웠다. 렌더링 용량 한도·추가 요금 정책 등 중요한 정보가 여러 언어에서 부정확하게 표현되어 있었다.
- **Solve**: "Main Features for All Plans" 섹션 신규 개발. 플랜별 기능을 카드 데이터 구조로 정의하고 지원 아티클 링크(`href`) 연결. 렌더링 용량 한도·추가 요금 정책 문구를 6개 언어 JSON에서 정확하게 수정.
- **Result**: Pricing 페이지에서 플랜 간 기능 비교 가능, 지원 문서 직접 연결로 self-service 가능

---

### 이벤트 로그 프록시 API (전환 퍼널 분석)

- **Problem**: ① 여러 이벤트의 payload 구조가 제각각이어서 파라미터 오류가 런타임에서야 발견됐다. ② 세션 ID 생성에 `shortid` 라이브러리를 사용했는데 충돌 가능성과 deprecation 이슈가 있었다. ③ 로그 API 호출 실패 시 에러가 상위로 전파되어 사용자가 에러 페이지로 리다이렉트됐다.
- **Solve**: 클라이언트에서 외부 API를 직접 호출 시 CORS 이슈와 인증 토큰 노출 문제로 Next.js API Route를 프록시 레이어로 설계. `types/proxy.ts`에 이벤트별 `stepData` 타입을 명시적으로 정의해 클라이언트·API Route가 동일 타입 공유. `shortid` → `uuid` v4 교체. 로그 호출을 `try-catch`로 감싸 fire-and-forget 처리.
- **Result**: 퍼널 이벤트 타입 계약 타입화, 로그 서버 장애 시에도 메인 UX 영향 없음
- **Insight**: 결제/플랜 도메인은 비즈니스 규칙이 복잡하고 예외 케이스가 많다. 플랜 정책을 데이터(config)로 관리하고 UI 코드에서 플랜 타입을 직접 하드코딩하지 않는 설계가 필요하다는 것을 이번 작업에서 명확히 느꼈다.

---

## 회고

Academic 플랜처럼 기존 이분법(Enterprise / non-Enterprise)에 맞지 않는 플랜이 추가될 때, 코드 곳곳에 산재된 조건문을 모두 찾아 수정해야 하는 비용이 컸다. 한도 초과 상태를 공통으로 처리하는 글로벌 인터셉터 패턴과 퍼널 분석 프록시 로그 시스템을 함께 구축하면서 "기능 구현 → 전환 측정 → 개선"의 사이클을 닫을 수 있었다.
