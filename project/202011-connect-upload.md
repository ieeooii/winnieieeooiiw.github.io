# Open Market Store — 3D 의상 등록 기능 개발 및 런칭

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 서비스 | CONNECT |
| 기술 스택 | Next.js, TypeScript, Redux (Toolkit + Saga), Emotion.js, Jest, React Testing Library |
| 개발 기간 | 2020.11 ~ 2021.05 |
| 인원 | 프론트엔드 1, 백엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당) |
| 서비스 링크 | https://connect.clo-set.com/ko/upload |

## 소개

3D 의류 에셋 마켓플레이스 CLO-SET의 신규 업로드 페이지를 전체 설계·개발했다. 기본 정보 → 파일 첨부 → 카테고리 → 가격 설정 → 마켓 정보의 다단계 구조로 설계했으며, 이후 Edit 페이지에도 동일 컴포넌트가 재사용됐다.

---

## 주요 구현

### | 프로젝트 설계 고민
- View 와 비지니스 로직을 분리하기 위해 Presentational and Container Pattern 도입
- 일관된 구조를 유지하기 위한 Redux 및 Redux-toolkit 도입, Flux Pattern 적용
- CSS in JS  Emotion.js  도입
  -  SCSS  module css는 별도의 많은 css 파일을 관리하여 발생하는 유지보수 문제 측면에서 개선하기 위해 CSS in JS 도입 논의 및 사내 스터디(발표) 진행
  - Emotion.js - 도입 여부를 결정하기 위한 사내 기술 발표 [Link](https://ieeooii.notion.site/Emotion-js-361f27a6ae014131b770b8341b46cbde?source=copy_link)

### | Upload 폼 UI 및 기능 개발

- **Problem**: 드래그 앤 드롭 파일 첨부·Quill 기반 리치 텍스트 에디터·가격 설정 등 복잡한 상태 흐름을 안정적으로 처리해야 했다. 카테고리는 서버에서 flat 배열로 내려오지만 UI는 트리 구조로 표현해야 했는데, 중첩 루프 기반 변환 로직에서 데이터가 많아질수록 브라우저가 멈추는 성능 문제가 발생했다.
- **Solve**: Redux Slice + Saga 기반으로 스텝별 상태를 관리하고, `isAcceptFile`/`getFilterAcceptsFiles` 유틸 함수로 파일 타입 검증 로직을 공통화했다. Quill 에디터는 글자수 제한·onBlur 에러 상태 처리를 커스터마이징했다. 카테고리 변환 로직은 `reduce` → `map`/`filter` 조합으로 리팩토링하여 부분 개선했다.
- **Result**: 신규 업로드 플로우 전체 완성. 이후 Edit 페이지에도 동일 컴포넌트 재사용.
- **Insight**: 당시 역량으로는 근본적인 해결이 어려워 BE에 데이터 구조 변경을 요청했다. 지금 돌아보면 `new Map`으로 `id → node`를 O(1)로 참조하는 flat → tree 변환 로직을 구현했다면 O(n²) 중첩 탐색 없이 O(n)으로 처리할 수 있었을 것이다.

---

### | Upload 페이지 테스트 코드 작성 (약 80개 테스트)

- **Problem**: 업로드는 서비스 핵심 기능인 만큼 파일 첨부·드래그 앤 드롭·카테고리 변경·가격 옵션 등 전체 플로우가 정상 동작하는지 검증이 필요했으나, 테스트 코드가 전무해 회귀 버그 위험이 높았다.
- **Solve**: Jest + React Testing Library로 약 80개 테스트 파일을 작성해 컴포넌트 단위 및 플로우 시나리오를 단계적으로 커버. `title` 속성을 `data-testid`로 정비하고, `wrapper.rerender` → `rerender`, `wrapper` → `screen` API로 마이그레이션해 최신 RTL 패턴으로 통일.
- **Result**: react-testing-library  도입하여 행위 주도 테스트 코드 작성 및 테스트 코드 커버리지 70%
- **Insight**: 구현 세부사항에 의존하는 방식으로 작성해 리팩토링할 때마다 테스트가 깨지는 문제가 반복됐다. RTL의 핵심은 사용자 행위 기반 검증임을 이후에 깨달았고, 내부 구현이 아닌 사용자 관점의 인터랙션을 기준으로 테스트를 설계했어야 했다.

---

## 회고

컴포넌트 개발 전 재사용 범위를 먼저 파악하고 공용 컴포넌트로 설계한 것은 이후 유지보수 비용을 낮추는 데 효과적이었다. `BackgroundLayout`, `Tag`, `EditableTextArea`, `ToastsBox` 등 UI 원자 단위 컴포넌트를 공통화해 폼 전 영역에 일관된 스타일을 적용한 것도 이 작업의 핵심이었다.
