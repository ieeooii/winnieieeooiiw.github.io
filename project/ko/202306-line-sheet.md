---
thumbnail: /images/projects/202209-line-sheet-list-view.webp
gradient: linear-gradient(135deg, #e8f0fc, #c8d8f8)
---

# AG Grid 기반 인터랙티브 Line Sheet 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, AG Grid, React Query, Emotion.js |
| 개발 기간 | 2022.09 ~ 2023.06 (Beta → Phase 1 → Phase 2) |
| 인원 | 프론트엔드 1, 백엔드 1, 프로덕트 디자이너 1, 기획자 1 (프론트엔드 담당) |
| 서비스 링크 | [style.clo-set.com](https://style.clo-set.com) |

## 소개

패션 MD(머천다이저)가 시즌별 상품 기획·관리에 사용하는 스프레드시트형 문서를 CLOSET 안에서 3D 의류 에셋과 연동한 인터랙티브 Line Sheet(시즌별 상품 목록표)로 구현했다. Beta(썸네일 그리드 + 무한스크롤) → Phase 1(AG Grid 인라인 편집) → Phase 2(Excel Export) 단계별로 개발했다.

<div class="img-row-2">

![Line Sheet 리스트 뷰](/images/projects/202209-line-sheet-list-view.webp)
![Line Sheet 썸네일 뷰](/images/projects/202209-line-sheet-thumbnail-detail.webp)
![Line Sheet 로딩 상태](/images/projects/202209-line-sheet-loading.webp)
![Company Library](/images/projects/202209-line-sheet-company-library.webp)

</div>

## 주요 구현

### 셀 타입별 커스텀 Cell Editor / Renderer

- **Problem**: 패션 MD가 편집하는 데이터는 단순 텍스트가 아니다. 워크플로우 상태·날짜·수량·판매채널(다중 체크박스)·태그·이월 여부 등 8가지 이상의 서로 다른 셀 타입이 존재하며, 각각 다른 UI와 검증 로직이 필요했다. 또한 편집 불가 셀과 편집 가능 셀을 시각적으로 구분해야 했다. 컬러웨이 번호처럼 중복 불가 필드는 비동기 검증도 필요했다.
- **Solve**: AG Grid의 `cellEditor` / `cellRenderer` 인터페이스로 셀 타입(텍스트, 단일 선택, 다중 체크박스, 태그, 날짜, 가격 등)별 독립 컴포넌트를 제작. 컬러웨이 번호 중복 검증은 AbortController를 활용하여 이전 요청을 취소하고 마지막 입력 기준으로만 서버 검증. 삭제된 워크플로우는 셀에 삭제 표시를 붙여 목록에 유지하되 재선택을 방지.
- **Result**: 스프레드시트 수준의 인터랙티브 편집 UX 구현. 셀 타입별 독립 컴포넌트로 분리되어 신규 셀 타입 추가 시 기존 코드에 영향 없이 확장 가능한 구조.

### 무한 스크롤 — 수동 캐시 업데이트로 스크롤 위치 보존

- **Problem**: `useInfiniteQuery`와 Intersection Observer 조합에서 중복 요청 버그 발생. Observer가 마운트 시점에 즉시 트리거되어 이미 로딩 중인 상태에서 다음 페이지 요청이 한 번 더 호출됐다. 또한 셀 편집 후 쿼리 전체를 무효화(invalidate)하면 수백 건의 데이터를 처음부터 재요청하면서 스크롤 위치가 초기화되는 문제도 있었다.
- **Solve**: 커스텀 훅으로 분리하고 Observer 콜백 내에서 `isFetching` 상태 체크로 중복 요청 차단. 셀 편집 성공 시 쿼리 전체를 무효화하는 대신, 변경된 행 데이터를 원본 페이지 구조에 맞게 재슬라이싱하여 `queryClient.setQueryData()`로 캐시를 직접 교체. 썸네일/리스트 모드 전환 시에는 캐시 초기화로 데이터 일관성 유지.
- **Result**: 중복 요청 없이 안정적인 무한 스크롤 동작, 편집 후에도 스크롤 위치와 페이지 상태 그대로 유지

### Row Spanning과 가상 스크롤 행 인덱스 불일치 처리

- **Problem**: Line Sheet 데이터 구조는 스타일 아이템 1개 : 컬러웨이 N개의 1:N 관계다. 스타일 공통 속성(썸네일, 이름 등)은 컬러웨이 행 수만큼 병합해야 하는데, AG Grid의 가상 스크롤 환경에서 두 가지 문제가 발생했다. 첫째, Row Spanning 적용 시 병합 셀의 CSS 높이가 자동 계산되지 않아 레이아웃이 깨졌다. 둘째, 셀 편집 시 `rowIndex`가 전체 데이터 배열의 절대 인덱스가 아닌 뷰포트 기준 상대 인덱스로 제공되어, 동일 스타일의 모든 컬러웨이 행을 일괄 업데이트하는 로직이 잘못된 행을 수정했다.
- **Solve**: `rowSpan` 콜백으로 컬러웨이 수에 따라 병합 범위를 계산하고, 병합 셀 높이를 컬러웨이 수와 행 높이 기준으로 직접 계산하여 CSS에 적용. 행 인덱스 불일치는 컬러웨이 오프셋으로 절대 인덱스를 보정한 후 동일 스타일 아이템에 속한 행을 전방 탐색하며 일괄 업데이트.
- **Result**: 1:N 컬러웨이 구조가 시각적으로 자연스럽게 병합 표시, 가상 스크롤 환경에서도 컬러웨이 전체 행 일괄 업데이트 정확히 동작

### 뮤테이션 디스패처 — 필드 타입별 API 라우팅

- **Problem**: 35개 컬럼 중 편집 가능한 필드마다 요청 파라미터 구조와 API 엔드포인트가 다르다. 워크플로우·카테고리·태그·컬러웨이명 등 특수 필드는 전용 API를, 나머지 필드는 범용 수정 API를 사용해야 했다. 이를 단일 함수에서 분기 처리하면 코드가 비대해지고 신규 필드 추가 시 수정 범위가 넓어지는 문제가 있었다.
- **Solve**: 특수 처리가 필요한 필드 타입을 TypeScript discriminated union으로 정의하고, 각 타입을 키로 하는 뮤테이션 핸들러 맵을 구성. 편집 이벤트 발생 시 필드 타입에 따라 핸들러 맵에서 해당 뮤테이션을 조회하여 실행. 범용 필드는 단일 API 호출로 처리하되, 선택형은 ID 추출, 다중 선택은 ID 배열로 변환하는 데이터 변환 레이어를 디스패처 내부에 포함.
- **Result**: 필드 타입이 추가될 때 핸들러 맵에 항목 하나를 추가하는 것만으로 확장 가능한 구조. 컴파일 타임에 누락된 필드 타입 핸들러 즉시 감지

## 회고 / 아쉬웠던 점

AG Grid는 낮은 추상화 수준 덕분에 세밀한 커스터마이징이 가능했지만, React 단방향 데이터 흐름과 AG Grid 자체 내부 상태가 충돌하는 케이스를 여러 번 마주쳤다. 특히 AG Grid 셀 안에서 React 컴포넌트(Select, Datepicker 등)를 렌더링할 때 `forwardRef` 처리와 `next/dynamic` 중복 import 문제가 예상보다 복잡했다. 서드파티 라이브러리를 프레임워크와 통합할 때는 각 라이브러리의 라이프사이클이 어떻게 충돌할 수 있는지를 먼저 파악해야 한다는 것을 배웠다.
