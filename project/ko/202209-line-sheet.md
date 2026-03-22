---
thumbnail: /images/projects/202209-line-sheet-list-view.png
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
| 인원 | 프론트엔드 (담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

패션 MD(머천다이저)가 시즌별 상품 기획·관리에 사용하는 스프레드시트형 문서를 CLOSET 안에서 3D 의류 에셋과 연동한 인터랙티브 Line Sheet(시즌별 상품 목록표)로 구현했다. Beta(썸네일 그리드 + 무한스크롤) → Phase 1(AG Grid 인라인 편집) → Phase 2(Excel Export) 단계별로 개발했다.

## 주요 기능

<div class="img-row-2">

![Line Sheet 리스트 뷰](/images/projects/202209-line-sheet-list-view.png)
![Line Sheet 썸네일 뷰](/images/projects/202209-line-sheet-thumbnail-view.png)
![Line Sheet 썸네일 상세](/images/projects/202209-line-sheet-thumbnail-detail.png)
![Line Sheet 로딩 상태](/images/projects/202209-line-sheet-loading.png)
![Company Library](/images/projects/202209-line-sheet-company-library.png)

</div>

## 주요 구현

### 셀 타입별 커스텀 Cell Editor / Renderer (Phase 1 핵심)

- **Problem**: 패션 MD가 편집하는 데이터는 단순 텍스트가 아니다. 워크플로우 상태·날짜·수량·판매채널(다중 체크박스)·태그·이월 여부 등 8가지 이상의 서로 다른 셀 타입이 존재하며, 각각 다른 UI와 검증 로직이 필요했다. 또한 편집 불가 셀과 편집 가능 셀을 시각적으로 구분해야 했다.
- **Solve**: AG Grid의 `cellEditor` / `cellRenderer` 인터페이스로 셀 타입별 독립 컴포넌트를 제작했다.
  - `LineSheetTextCellEditor` — 인라인 텍스트 편집, `checkDuplicate` prop으로 중복값 검증
  - `LineSheetDateCellEditor` — 날짜 피커 (Retail Date 등)
  - `LineSheetWorkflowCellEditor` / `LineSheetStatusCellEditor` — Select 드롭다운, `LineSheetSelectCellEditor`로 공통화
  - `LineSheetCheckboxCellEditor` — 판매채널·스토어 다중 선택, `getSelectControlCellWidth` 유틸로 너비 자동 계산
  - `TagCellEditor` — `useLineSheetTagMutation` 훅으로 API 연동
  - `LineSheetCarryoverCellEditor` — 이월 여부 토글
  - `LineSheetThumbnailCellRenderer` — turntable 미지원 케이스 tooltip 포함
- **Result**: 스프레드시트 수준의 인터랙티브 편집 UX 구현. 셀 타입별 독립 컴포넌트로 분리되어 신규 셀 타입 추가 시 기존 컴포넌트에 영향 없이 확장 가능한 구조.

### React Query + Intersection Observer 무한 스크롤 안정화
- **Problem**: `useInfiniteQuery`와 Intersection Observer 조합에서 중복 요청 버그 발생. observer가 mount 시점에 즉시 트리거되어 이미 로딩 중인 상태에서 `fetchNextPage`가 한 번 더 호출됐다. 썸네일/리스트 모드 전환 시 데이터 상태가 꼬이는 케이스도 있었다.
- **Solve**: `useThumbnailModeInfinityScroll` 커스텀 훅으로 분리하고, observer 콜백 내에서 `isFetching` 상태 체크로 중복 요청 차단. 모드 전환 시 React Query 캐시 초기화 로직 추가.
- **Result**: 중복 요청 없이 안정적인 무한 스크롤 동작, 모드 전환 시 데이터 일관성 유지

### 셀 행 병합(Row Spanning) — 스타일 1개 : 컬러웨이(색상 변형) N개 구조
- **Problem**: Line Sheet 데이터 구조는 스타일 아이템 1개 : 컬러웨이 N개의 1:N 관계다. 스타일 공통 속성(썸네일, 이름 등)은 컬러웨이 행 수만큼 병합해야 하는데, AG Grid에서 Row Spanning 적용 시 스타일이 의도대로 되지 않는 문제가 있었다.
- **Solve**: AG Grid의 `rowSpan` 콜백을 컬럼 정의에 추가하고, spanning 대상 셀에 `.show-cell` CSS 클래스를 동적으로 부여해 병합된 셀만 보이도록 처리. 배경색과 보더 스타일도 병합 셀 기준으로 별도 조정.
- **Result**: 1:N 컬러웨이 구조가 시각적으로 자연스럽게 병합 표시되어 스프레드시트 UX와 동일한 수준의 가독성 확보

## 회고 / 아쉬웠던 점

AG Grid는 낮은 추상화 수준 덕분에 세밀한 커스터마이징이 가능했지만, React 단방향 데이터 흐름과 AG Grid 자체 내부 상태가 충돌하는 케이스를 여러 번 마주쳤다. 특히 AG Grid 셀 안에서 React 컴포넌트(Select, Datepicker 등)를 렌더링할 때 `forwardRef` 처리와 `next/dynamic` 중복 import 문제가 예상보다 복잡했다. 서드파티 라이브러리를 프레임워크와 통합할 때는 각 라이브러리의 라이프사이클이 어떻게 충돌할 수 있는지를 먼저 파악해야 한다는 것을 배웠다.
