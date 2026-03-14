# 3D 의상 색상 변형(Colorway) 보기 기능 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, React Query, MobX, Emotion.js |
| 개발 기간 | 2022.05 ~ 2022.07 |
| 인원 | 프론트엔드 (담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

동일한 3D 의류 아이템의 색상 변형(Colorway — 동일 디자인의 색상별 버전)을 관리하는 기능이다. 스타일 아이템 1개에 컬러웨이 N개가 연결되는 1:N 관계를, 콘텐츠 목록 페이지의 View Mode 전환·Line Sheet(시즌별 상품 목록표) 행 병합(Row Spanning)·컬러웨이 단위 작업 상태 인라인 편집까지 일관되게 표현했다.

## 주요 구현

### Colorway View Mode 개발 (2022.05~2022.07)
- **Problem**: 콘텐츠 페이지가 스타일 아이템 단위 보기만 지원하고 있어 패션 MD가 각 색상 변형의 썸네일을 한눈에 비교하기 어려웠다. 모드 전환 시 페이지를 다시 로드하지 않고 즉시 전환해야 했고(콘텐츠 목록 API 중복 호출 방지), 모드 선택 상태를 새로고침 후에도 유지해야 했다.
- **Solve**: `ContentViewModeSettingBar.tsx`에 View Mode 토글 UI 구현. 이미 로드된 데이터를 컴포넌트 레벨에서 컬러웨이 단위로 재조합하여 표시(API 재호출 없음). 선택된 모드는 `cookie`에 저장하여 새로고침·페이지 이동 후에도 복원. 컬러웨이별 체크박스 선택 상태는 `StyleItem.tsx`에서 별도 관리.
- **Result**: API 추가 호출 없이 View Mode 전환, 새로고침 후 모드 상태 복원, 컬러웨이 단위 썸네일 비교 가능

### 컬러웨이 다중 선택 & 컨텍스트 메뉴 연동
- **Problem**: 컬러웨이 모드에서 여러 컬러웨이를 선택하여 일괄 다운로드·삭제 등 Context Menu 액션을 적용해야 했다. 기존 스타일 아이템 단위 다중 선택 로직은 컬러웨이 단위를 고려하지 않아 선택 범위 계산이 잘못됐다. tooltip 예외 처리 누락으로 일부 아이템에서 tooltip이 비정상 표시됐다.
- **Solve**: 컬러웨이 모드 여부를 Context Menu 로직에 전달하여 선택 범위를 컬러웨이 단위로 재계산. tooltip 표시 조건에 `isColorwayMode` 분기 추가.
- **Result**: 컬러웨이 모드에서도 다중 선택 + Context Menu 정상 동작, tooltip 오표시 해소

### 컬러웨이 워크플로우 인라인 편집 연동 (2023.08~2023.09)
- **Problem**: Line Sheet에서 컬러웨이별 워크플로우 상태를 편집하는 기능을 콘텐츠 상세 페이지에서도 제공해야 했다. `ColorwayInfoItem.tsx`에서 인라인으로 워크플로우 상태를 드롭다운 편집하고 즉시 서버에 반영하는 UX가 필요했다. 추가로 `getRangePlanSelection` API 파라미터 불일치로 인한 목록 조회 오류도 존재했다.
- **Solve**: `ColorwayItemTextField.tsx` 신규 개발(컬러웨이 이름 인라인 편집). `ColorwayInfoItem.tsx`에 Select 드롭다운 UI 추가. `useLineSheetColorwayStatusMutation.tsx` 훅을 통해 상태 변경 API와 연동. API 파라미터 오류 수정.
- **Result**: 콘텐츠 상세 페이지에서 컬러웨이 워크플로우 인라인 편집 가능, API 오류 해소

## 회고

가장 어려웠던 것은 "같은 데이터를 다른 방식으로 표현하기"였다. 스타일 아이템 뷰와 컬러웨이 뷰는 동일한 API 데이터를 사용하지만 표현 방식이 완전히 다르다. 데이터를 어디서 변환할 것인가 — API 레이어, store, 컴포넌트 — 를 고민하게 됐다. 컴포넌트 레벨 변환을 선택했는데, API 재호출 없이 전환 가능하다는 장점이 있었지만 컴포넌트 복잡도가 높아진다는 단점도 있었다. 이후 비슷한 상황에서는 React Query의 `select` 옵션으로 데이터 변환을 쿼리 레이어에서 처리하는 방법도 고려할 것이다.
