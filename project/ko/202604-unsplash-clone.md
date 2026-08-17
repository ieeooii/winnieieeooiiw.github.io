---
thumbnail: /images/projects/202604-unsplash-clone-home.webp
gradient: linear-gradient(135deg, #ececec, #c4c4c4)
---

# Unsplash 클론 — 반응형 & 성능 최적화 학습 프로젝트

| 항목 | 내용 |
|------|------|
| 카테고리 | Side Project |
| 서비스 | Unsplash Clone |
| 기술 스택 | React 19, TypeScript, Vite 8 (rolldown), TanStack Query v5, React Router v6, Emotion, Vitest, Playwright |
| 개발 기간 | 2026.04 ~ 2026.04 |
| 인원 | 프론트엔드 1 (개인) |

## 프로젝트 목적

실서비스 수준의 UI를 기준 삼아 **반응형 레이아웃과 성능 최적화를 깊이 있게 연습**하기 위해 Unsplash를 클론 대상으로 선택했다.

- **반응형** — 비율이 제각각인 사진 그리드를 뷰포트별(1·2·3열)로 라이브러리 없이 직접 배치하고, 모바일/데스크톱에서 진입 방식(모달 vs 풀페이지)까지 달라지는 반응형 UX를 구현한다
- **성능 최적화** — Lighthouse로 원본 Unsplash와 동일 조건에서 측정·비교하며 이미지 로딩, 코드 스플리팅, 번들 캐싱을 개선하는 사이클을 경험한다
- **품질 기반** — FSD 아키텍처, Suspense/Error Boundary 설계, 단위·E2E 테스트까지 실무에서 쓰는 품질 장치를 개인 프로젝트에 그대로 적용해본다

## 소개

Unsplash의 핵심 탐색 경험 — 홈 피드, 사진 상세, 검색 — 을 Unsplash Open API 기반으로 클론 구현한 SPA. Feature-Sliced Design 아키텍처로 레이어 간 단방향 의존을 강제하고, Masonry Grid·Background Location 모달·무한 스크롤을 라이브러리 없이 직접 구현했다. Suspense 기반 로딩, 계층별 Error Boundary, Blurhash 이미지 플레이스홀더까지 갖춰 Lighthouse 성능 점수에서 Unsplash 원본 사이트를 상회하는 결과(Desktop 98 vs 93, Mobile 82 vs 74)를 얻었다. 단위 테스트 50개, E2E 테스트 43개로 주요 사용자 흐름을 검증했다.

![홈 — Masonry Grid 피드](/images/projects/202604-unsplash-clone-home.webp)

## 주요 기능

<div class="img-row-3">

![사진 상세 모달](/images/projects/202604-unsplash-clone-detail-modal.webp)
![검색 결과 페이지](/images/projects/202604-unsplash-clone-search.webp)
![전체화면 이미지 포탈](/images/projects/202604-unsplash-clone-detail-fullscreen.webp)

</div>

<div class="img-row-3">

![상세 풀페이지 진입](/images/projects/202604-unsplash-clone-detail-page.webp)
![반응형 — 태블릿 2열](/images/projects/202604-unsplash-clone-home-tablet.webp)
![반응형 — 모바일 1열](/images/projects/202604-unsplash-clone-home-mobile.webp)

</div>

- **홈 피드** — Topics 탭 동적 로드, Masonry Grid + 무한 스크롤, 호버 오버레이(작가 정보·다운로드)
- **사진 상세** — 갤러리에서 진입 시 모달, URL 직접 접근 시 풀페이지. 조회수·EXIF·태그 표시, 이미지 클릭 시 전체화면 포탈
- **검색** — `/s/photos/:query` URL 기반 검색, 결과 0건 Empty 상태, 태그 클릭 → 검색 연결
- **다운로드** — Unsplash 가이드라인에 따른 트래킹 API 선호출 후 파일 다운로드, 실패 시 Toast 안내

## 주요 구현

### Masonry Grid 직접 구현

- **Problem**: CSS `column-count`는 무한 스크롤로 새 배치가 로드될 때 전체 아이템을 세로로 재분배해 기존 아이템 위치가 튀는 현상이 발생한다. `display: masonry`는 브라우저 지원이 없고, TanStack Virtualizer는 아이템 높이를 사전 측정해 절대 좌표로 배치해야 해 스크롤 점프 위험과 구현 복잡도가 컸다.
- **Solve**: 컬럼을 flex column으로 렌더링하고, 아이템마다 가장 짧은 컬럼에 배치하는 `useMasonryColumns` 훅을 구현. 아이템 높이는 DOM 측정 없이 `(columnWidth × height) / width` 비율로 추정하고 `useMemo`로 재계산을 최소화했다. 컬럼 너비는 `ResizeObserver`, 컬럼 수는 `matchMedia` 브레이크포인트 전환 시에만 갱신해 `resize` 이벤트 대비 호출 빈도를 줄였다.
- **Result**: 새 배치가 기존 컬럼 하단에만 append되어 화면 튐 없이 무한 스크롤 동작. 배치 O(n), 최단 컬럼 탐색 O(1)

### Background Location 모달 패턴

- **Problem**: 갤러리에서 사진 클릭 시 URL은 `/photos/:id`로 바뀌되 배경에 갤러리를 유지한 모달을 띄워야 했다. React Router 공식 예제의 `location.state` 방식은 새로고침 시 state가 소멸해 배경 복원이 불가능하다.
- **Solve**: 배경 경로를 `useState` 기반 Context로 메모리에 보관. 갤러리에서 진입한 경우에만 배경 경로를 설정해 `<Routes location>`을 교체하고 모달용 `<Routes>`를 병렬 렌더링하며, URL 직접 접근·새로고침 시에는 state가 없으므로 풀페이지로 렌더링한다. 모바일(≤768px)은 배경이 가려져 모달의 이점이 없어 진입 시점 뷰포트 기준으로 풀페이지로 직행하도록 분기했다.
- **Result**: 클릭 → 모달, 직접 접근·새로고침 → 풀페이지가 URL 하나로 일관 동작. 동일한 상세 컴포넌트를 두 진입 경로에서 재사용

### Rate Limit 대응 캐시 전략

- **Problem**: Unsplash API는 시간당 50회 요청 제한이 있어, TanStack Query 기본 설정(`staleTime: 0` + 포커스·재연결 시 자동 refetch)대로면 탭 전환만으로도 제한을 소진할 수 있었다.
- **Solve**: 피드·검색·토픽 데이터는 세션 내 변경 가능성이 낮다고 판단해 전 쿼리에 `staleTime: Infinity`를 적용하고 `refetchOnWindowFocus` 등 자동 재요청을 전부 비활성화. 페이지 간 중복 photo id는 `select`에서 `Map`으로 dedup했다. 일시 오류는 `retry: 3`으로 자동 복구하고 초과 시 Error Boundary로 위임했다.
- **Result**: 캐시가 존재하는 한 재요청 0회 — 같은 검색어 재방문·뒤로 가기 시 즉시 렌더. Rate Limit 내에서 안정적으로 동작

### 계층별 에러 핸들링

- **Problem**: 이미지 한 장의 로드 실패나 무한 스크롤 추가 페이지 실패가 페이지 전체를 에러 화면으로 만들면 안 됐다. 에러의 영향 범위에 따라 복구 단위가 달라야 했다.
- **Solve**: 전역(`RoutesErrorBoundary`)과 부분(`PartialErrorBoundary`) 두 계층으로 경계를 나누고 `throwOnError: true`로 쿼리 에러를 경계에 위임. 이미지 에러는 `onError`에서 throw해 해당 카드만 대체 UI로 교체하고, Suspense 범위 밖인 `fetchNextPage` 실패는 목록 하단 인라인 "다시 시도" 버튼으로 처리했다. 다운로드 트래킹처럼 페이지 상태와 무관한 단발성 호출은 경량 훅 `useFetchQuery`로 분리해 실패 시 Toast만 노출했다.
- **Result**: 에러 범위별 복구 단위 확립 — 카드 1장, 목록 하단, 영역, 전체 페이지가 독립적으로 실패·복구

### 이미지 로딩 최적화 — CLS 0

- **Problem**: 비율이 제각각인 사진 피드에서 이미지 로드 전 공백과 레이아웃 시프트가 발생하기 쉬웠다.
- **Solve**: API가 제공하는 `blur_hash`를 디코딩해 플레이스홀더로 표시하고 로드 완료 시 페이드 아웃. 상세 페이지는 dominant color 배경 → Blurhash → 원본의 2단계 플레이스홀더를 적용했다. `width`/`height` 명시로 영역을 선점하고, `srcset`+`sizes` 다단계 해상도와 첫 사진 `fetchpriority="high"`로 LCP를 최적화했다.
- **Result**: CLS 0, Desktop LCP 1.0s (Unsplash 원본 1.8s)

### 번들 · 코드 스플리팅 최적화

- **Problem**: Vite 기본 설정은 전체 코드가 단일 번들로 묶여 앱 코드 변경 시 vendor 캐시까지 무효화되고, 방문하지 않은 페이지 코드까지 초기 로딩에 포함된다.
- **Solve**: `manualChunks`로 react·router·query·emotion vendor를 분리하고(rolldown 제약으로 함수 형식 사용), 페이지 단위 + 에러·Empty 섹션 등 컴포넌트 단위로 `React.lazy` 지연 로드를 적용했다.
- **Result**: 초기 번들 61.81 KiB → 4.92 KiB, Lighthouse Performance Desktop 98 · Mobile 82로 원본 사이트(93 · 74) 상회

<div class="img-row-2">

![Lighthouse Desktop 98점](/images/projects/202604-unsplash-clone-lighthouse-desktop.webp)
![Lighthouse Mobile 82점](/images/projects/202604-unsplash-clone-lighthouse-mobile.webp)

</div>

### 테스트 — 단위 50개 + E2E 43개

- **Problem**: 모달 진입/풀페이지 진입 분기, 무한 스크롤, 에러 복구처럼 상태 조합이 많은 흐름은 수동 확인만으로 회귀를 막기 어려웠다.
- **Solve**: 순수 로직(포맷터·blurhash·다운로드 유틸)과 커스텀 훅(`useDebounce`, `useFetchQuery` 등)은 Vitest 단위 테스트로, 홈·상세·검색 3개 흐름은 Playwright E2E로 검증. 모달 닫기(ESC·외부 클릭·닫기 버튼), 새로고침 → 풀페이지 전환, 한글 검색어 인코딩, 존재하지 않는 ID 에러 처리 같은 엣지 케이스를 시나리오에 포함했다.
- **Result**: 단위 7파일 50개 + E2E 3스펙 43개 전체 통과, 주요 사용자 흐름의 회귀를 자동으로 차단

<div class="img-row-2">

![단위 테스트 결과](/images/projects/202604-unsplash-clone-unit-test.webp)
![E2E 테스트 결과](/images/projects/202604-unsplash-clone-e2e-test.webp)

</div>

## 회고 / 아쉬웠던 점

반응형 브레이크포인트(`768px`, `990px`)가 Emotion 스타일과 `matchMedia` 로직 양쪽에 하드코딩되어 있다. 단일 상수로 추출했다면 CSS와 JS의 브레이크포인트가 항상 동기화됐을 텐데, 시간 제약으로 모듈화하지 못했다. 짧은 기간의 프로젝트였지만 "라이브러리를 쓰지 않는 결정"에도 근거를 남기는 연습이 됐다 — Virtualizer·`column-count`·`display: masonry`를 각각 검토하고 배제한 이유를 문서화하면서, 채택한 것보다 채택하지 않은 것의 논리가 설계 품질을 좌우한다는 것을 체감했다.
