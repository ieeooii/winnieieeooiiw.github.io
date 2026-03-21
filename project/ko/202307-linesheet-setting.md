# 상품 기획 시트 설정 — 상태 · 고객사 유형 · 판매 채널 · 매장 유형

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, Emotion |
| 개발 기간 | 2023.07 ~ 2024.08 |
| 서비스 링크 | style.clo-set.com |

## 소개

패션 브랜드 관리자가 Line Sheet에서 사용하는 4가지 마스터 데이터(Status / Customer Type / Sales Channel / Store Type)를 직접 등록·수정·삭제·순서 변경하는 설정 페이지다. 4가지 타입이 구조적으로 동일하지만 각각 독립적인 API와 상태를 가지므로, **`SegmentControl` 기반 탭 전환 + `next/dynamic` 지연 로딩 + 공통 스토어 서브 모듈** 패턴으로 코드 중복 없이 4개 도메인을 통합 관리하는 구조를 설계했다.

## 주요 구현

### SegmentControl + next/dynamic 지연 로딩 구조

- **Problem**: 4가지 설정 타입(Status / Customer Type / Sales Channel / Store Type)은 UI와 동작이 거의 동일하지만, 각각 다른 API 엔드포인트와 스토어 서브 모듈을 사용한다. 4개를 한 번에 정적 임포트하면 초기 번들에 불필요한 코드가 포함되고, 사용자가 접근하지 않는 탭의 데이터도 초기화된다.
- **Solve**: 각 탭 컴포넌트(`StatusSetting`, `CustomerTypeSetting`, `SalesChannelSetting`, `StoreTypeSetting`)를 `next/dynamic`으로 동적 임포트. 탭 전환 시점에 해당 청크만 로드. 탭 설정을 `segments` 배열 데이터로 선언 — 각 항목에 `value`, `label`, `setInitData`(초기화 함수), `component`(동적 컴포넌트)를 포함. `SettingCircleSpinner`가 `setInitData`를 `deps`(탭 전환 시점)에 따라 호출하여 탭 전환 시 자동으로 해당 도메인 데이터 초기화.
- **Result**: 현재 선택된 탭의 코드·데이터만 로드, 초기 번들 사이즈 최적화

### 공통 드래그 앤 드롭 Setting 컴포넌트 재사용

- 기존 Workflow / Range Plan 설정에서 구축한 `SettingDraggableLayout` / `SettingDraggableItem` 공통 컴포넌트를 4개 타입 모두에 재사용
- 각 도메인 컴포넌트(StatusSetting 등)는 데이터와 CRUD 핸들러만 주입하면 되는 구조 — 드래그 앤 드롭 로직, 아이템 렌더링, 순서 변경 API 연동은 공통 컴포넌트가 처리
- 새로운 설정 타입이 추가될 때 공통 레이아웃 컴포넌트를 즉시 재사용 가능

### MobX 서브 스토어 모듈화 (rangePlan)

- **Problem**: 4개 타입의 상태(리스트, 선택 항목, 로딩 여부, CRUD 액션)가 하나의 스토어에 혼재하면 서로 다른 타입의 상태가 섞여 추적이 어렵고, 탭 전환 시 이전 탭의 상태가 다음 탭에 영향을 줄 수 있다.
- **Solve**: `rangePlan` 스토어 하위에 `status`, `customerType`, `salesChannel`, `storeType` 4개 서브 모듈을 독립적으로 설계. 각 서브 모듈은 자신의 `initList`, `addItem`, `updateItem`, `deleteItem`, `changeOrder` 액션만 소유. `LineSheetSetting` 컴포넌트는 `selectedSegment`에 따라 적절한 서브 모듈의 `setInitData`를 호출.
- **Result**: 탭 간 상태 격리, 각 도메인의 CRUD 로직 독립 관리

## 회고 / 아쉬웠던 점

4개 타입이 동일한 구조를 가진다는 점에서 "공통 컴포넌트를 먼저 만들고 각 도메인이 그 위에 올라타는 방식"이 자연스럽게 도출됐다. `segments` 배열 선언 하나로 SegmentControl UI, 동적 컴포넌트 로딩, 탭 전환 시 데이터 초기화가 모두 연결되는 구조가 완성됐을 때, **데이터 주도(data-driven) 설계의 장점**을 실감했다. 새 타입 추가 시 배열에 항목 하나를 추가하는 것만으로 동작한다.
