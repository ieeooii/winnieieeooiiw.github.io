# 브랜드 관리자 설정 — 작업 상태(워크플로우) · 시즌 기획(Range Plan) 구성

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, React Query, Emotion.js |
| 개발 기간 | 2022.04 ~ 2022.05 |
| 인원 | 프론트엔드 (담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

패션 브랜드 관리자가 Line Sheet(시즌별 상품 목록표)의 작업 상태(워크플로우 — Draft / In Review / Approved 등), Range Plan(SS24 / FW24 등 시즌·라인 구분의 컬렉션 기획 단위), 고객 타입을 직접 등록·수정·삭제하고 순서를 정할 수 있는 Admin 설정 페이지다. Workflow 설정과 Range Plan 설정이 구조적으로 거의 동일하다는 점에서 드래그 앤 드롭 가능한 공통 Setting 컴포넌트 레이어를 먼저 설계하고, 각 도메인이 그 위에 올라타는 구조를 잡았다.

## 주요 구현

### 재사용 가능한 드래그 앤 드롭 Setting 컴포넌트
- **Problem**: 정렬 가능한 리스트 UI를 각 설정 도메인마다 따로 만들면 코드 중복이 발생하고, 이후 동일한 패턴의 설정 항목이 추가될 때마다 반복 구현이 필요했다. 당시 `react-beautiful-dnd`가 메인스트림이었지만 React Strict Mode와의 호환성 이슈가 있었고, 디자인 시스템의 `HandleOrderIcon`과 통합이 필요했다.
- **Solve**: `SettingDraggableLayout.tsx`(전체 리스트 컨테이너) / `SettingDraggableItem.tsx`(개별 항목)를 독립 컴포넌트로 설계. 각 도메인 컴포넌트(`WorkflowSettingList`, `RangePlanItemList`)는 이 레이어에 데이터만 주입하는 방식으로 구현. 드래그 핸들 아이콘(`HandleOrderIcon`)을 디자인 시스템에 추가하여 일관된 인터랙션 제공.
- **Result**: Workflow / Range Plan / Customer Type 설정 3곳에서 동일 컴포넌트 재사용. 새로운 설정 도메인 추가 시 레이아웃 컴포넌트 재사용 가능

### 입력 유효성 검사 엣지 케이스 처리
- **Problem**: ① `None` 타입 입력(빈 입력으로 추가 버튼 클릭)의 유효성 검사 누락으로 빈 항목이 서버에 저장됐다. ② 편집 후 취소를 눌렀을 때 `SettingInputNewItem.tsx`의 입력 상태가 초기화되지 않아 취소 후 다시 열면 이전 내용이 남아있었다. ③ Range Plan의 Retail Intro Date 입력에서 잘못된 날짜 포맷이 서버로 전달됐다.
- **Solve**: ① `None` 타입에 별도 valid check 함수 추가. ② 취소 버튼 클릭 이벤트에 `SettingInputNewItem` 상태 초기화 로직 추가. ③ 날짜 유효성 검사 함수 구현 및 입력 필드에 적용.
- **Result**: 잘못된 데이터 서버 전송 차단, 편집 취소 후 UI 상태 초기화 정상 동작

## 회고

관리자 설정 페이지는 간단하다는 선입견이 있었는데, 실제로는 입력 유효성 검사·상태 초기화·순서 변경 API 동기화 등 예외 케이스가 생각보다 많았다. 공통 컴포넌트 설계를 먼저 한 덕분에 Customer Type 설정이 추가됐을 때 레이아웃 코드를 거의 재사용할 수 있었다. 반복되는 패턴이 보이면 세 번째 사용처가 생기기 전에 공통화하는 것이 맞다는 것을 이 작업에서 배웠다.
