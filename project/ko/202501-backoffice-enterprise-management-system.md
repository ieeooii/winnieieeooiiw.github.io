---
thumbnail: /images/projects/202501-backoffice-enterprise.svg
gradient: linear-gradient(135deg, #e8eaf0, #c8ccd8)
---

# 백오피스 Enterprise Groups 도메인 설계 및 구축

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | Internal Admin Tool |
| 서비스 | CLO-SET Admin |
| 기술 스택 | React 17, TypeScript 4.5, Redux, Redux-Saga, Styled Components, Axios, react-export-excel |
| 개발 기간 | 2025.01 ~ 2025.07 |
| 인원 | 프론트엔드 1 (담당), 백엔드 1 이상, 기획자 1 |
| 서비스 링크 | 사내 내부 어드민 (비공개) |

## 소개

CLO-SET Enterprise 플랜 고객사(Group)의 계정 현황·결제 내역·사용량·운영 메모를 어드민에서 통합 관리할 수 있는 Groups 섹션을 제로베이스로 설계·구축했다. 그룹 목록 조회·검색 필터부터 그룹 상세 페이지(정보 테이블·멤버·사용량·플랜 이력·결제 내역·코멘트)까지, 총 7개 서브 기능·40개 이상의 신규 컴포넌트를 6개월에 걸쳐 단독으로 개발했다. API 설계 협의·컴포넌트 구조 결정·배포까지 프론트엔드 전 과정을 주도했다.

## 주요 구현 — Groups 목록 & 검색 필터

### SearchFilter + AutocompleteInput 컴포넌트 설계

- **Problem**: 내부 운영팀은 수백 개의 Enterprise 그룹을 플랜 타입·결제 수단·담당 CLO-SET 매니저·키워드 조합으로 좁혀 조회해야 했다. 기존 어드민에는 Groups 목록 페이지 자체가 없었고, 매니저 필드는 선택지가 동적으로 변하는 autocomplete 방식이 필요했다.
- **Solve**: `SearchFilter.tsx` 컴포넌트를 새로 설계하고, plan type·payment method는 `CheckboxFilterElement`, manager는 API에서 후보 목록을 받아 타이핑에 따라 필터링하는 `AutocompleteInput.tsx`로 구성했다. 필터 조건을 `searchParams`로 URL에 직렬화해 새로고침 후에도 상태가 유지되도록 했다. `constants/groups/filter.ts`에 필터 옵션 상수를 집중 관리해 UI 코드에서 선택지를 하드코딩하지 않도록 설계했다.
- **Result**: plan type, payment method, manager(autocomplete), keyword 4종 복합 필터 제공, URL 직렬화로 필터 상태 공유 가능

### GroupListTable 조건부 row 스타일링 + Excel 내보내기

- **Problem**: 구독 종료가 임박한 단기 구독 그룹을 목록에서 육안으로 식별하기 어려웠다. 운영팀은 현재 표시된 목록 전체를 스프레드시트로 추출해 공유하는 수요가 있었으나, 어디에도 Excel 내보내기 기능이 없었다.
- **Solve**: 구독 종료일이 일정 기간 이내인 row에 조건부 배경색을 적용하는 `rowStyle` 로직을 `GroupListTable.tsx`에 추가했다. 단, 구독 종료일이 `null`이거나 플랜 타입이 FREE인 경우 스타일을 적용하지 않도록 예외 처리했다. Excel 내보내기는 `react-export-excel-xlsx-fix`를 활용해 `GroupListColumns.tsx`에 export 전용 컬럼 정의를 분리하고, `GroupList.tsx`에서 현재 필터 결과 데이터 기준으로 `.xlsx` 파일을 생성하도록 구현했다. 내보내기 실패 시 에러 핸들링도 추가했다.
- **Result**: 단기 구독 위험 그룹 시각적 식별 가능, 현재 필터 적용 결과를 즉시 Excel로 다운로드

---

## 주요 구현 — Group 상세 페이지

### 그룹 상세 레이아웃 & 라우팅 설계

- **Problem**: 그룹 목록에서 특정 그룹을 클릭했을 때 이동할 상세 페이지가 없었다. 상세 페이지는 여러 탭(Overview, Billing History 등)으로 구성될 예정이었기 때문에, 탭 간 이동 시 URL이 변경되면서도 공통 레이아웃(그룹명, 상단 정보)은 유지돼야 했다.
- **Solve**: `GroupDetail.tsx` (페이지), `GroupDetailContainer.tsx` (레이아웃·데이터 패칭 담당), `GroupOverviewTabContainer.tsx` (Overview 탭 컨텐츠)를 계층적으로 분리했다. 라우터에 `/groups/:groupId` 하위 중첩 라우트를 추가해, 탭 전환이 URL 변경으로 추적 가능하게 구성했다.

### GroupInformationTable + CLOSETManagerModal CRUD

- **Problem**: 그룹 기본 정보(플랜 타입, 결제 수단, 멤버 수, 매니저 등)를 한 화면에서 조회하고 매니저를 변경할 수 있어야 했다. 매니저는 다중 추가·삭제가 가능한 구조가 필요했는데, 기존 어드민 컴포넌트 중 재사용 가능한 패턴이 없었다.
- **Solve**: `GroupInformationTable.tsx`를 공통 `InformationTable.tsx` 컴포넌트 기반으로 구성하고, 매니저 수정 셀에서 `CLOSETManagerModal.tsx`를 열어 POST/DELETE API를 통해 매니저를 추가·삭제할 수 있도록 했다. 모달을 닫을 때 내부 목록 상태가 리셋되지 않는 버그를 발견해 `onClose` 시 상태 초기화 로직을 명시적으로 추가했다. 매니저 목록은 `useMembersManagersQuery.tsx` 커스텀 훅으로 분리해 데이터 패칭 로직과 UI를 디커플링했다.
- **Result**: 그룹 정보 조회·매니저 CRUD를 단일 화면에서 처리 가능

### 결제 통화 변경 모달

- **Problem**: 특정 Enterprise 그룹의 결제 통화(KRW·USD 등)를 변경해야 하는 운영 케이스가 발생했으나, 어드민에서 직접 수정할 방법이 없어 매번 백엔드에 직접 요청해야 했다.
- **Solve**: `GroupPaymentCurrencyEditModal.tsx` (96줄)를 신규 개발해 `GroupInformationTable`에 통합했다. 통화 목록은 Currency API에서 동적으로 조회하도록 설계해 하드코딩을 배제하고, 변경 전 현재 통화 값을 모달 초기 상태로 미리 채워 UX를 개선했다.
- **Result**: 운영팀이 어드민에서 그룹 결제 통화를 직접 변경 가능, 백엔드 의존성 제거

---

## 주요 구현 — 결제 내역 & 인보이스

### GroupBillingHistoryTable + 인보이스 모달

- **Problem**: Enterprise 그룹의 전체 결제 내역을 조회하고, 개별 인보이스를 프린트 가능한 형태로 출력할 수 있어야 했다. 인보이스 레이아웃은 CLO-SET 브랜드 도장 이미지, 금액 계산, 상품 명세 테이블 등 복잡한 구성을 요구했다.
- **Solve**: `GroupBillingHistoryColumns.tsx` (145줄), `GroupBillingHistoryTable.tsx` (177줄), `GroupBillingHistoryContainer.tsx`를 개발했다. 인보이스 모달은 `GroupBillingHistoryInvoiceModal.tsx`, `GroupInvoiceFigure.tsx`, `GroupInvoiceInformation.tsx`, `GroupInvoiceTable.tsx`로 역할별 컴포넌트를 분리하고, 총 437줄 규모로 구현했다. 결제 완료 인보이스에 브랜드 도장 SVG 이미지를 표시했으며, 결제 금액 포맷팅을 위해 공통 number 유틸 함수도 추가했다.
- **Result**: 그룹별 결제 내역 목록 조회 및 인보이스 단건 상세 확인 기능 완성

### 청구 내역 caption 동적 날짜 표시 + 데이터 버그 수정

- **Problem**: 청구 내역 caption이 정적 문자열로 하드코딩되어 있어 조회 날짜 기준으로 갱신되지 않았다. 별도로 그룹 billing history 데이터가 잘못 조회되는 버그가 발생해 운영팀이 잘못된 내역을 보는 상황이 확인됐다.
- **Solve**: caption을 `new Date()`로 현재 날짜를 동적으로 표시하도록 수정. billing history 데이터 버그는 API 파라미터 바인딩 오류를 추적해 수정했다.

---

## 주요 구현 — 플랜 이력 & 사용량

### GroupPlanHistoryTable + 페이지네이션

- **Problem**: 그룹의 플랜 변경 이력을 시계열로 조회할 수 있어야 했다. 이력 건수가 많은 그룹에서는 페이지네이션 없이 전체 데이터를 한 번에 렌더링하면 성능 저하가 예상됐다.
- **Solve**: `GroupPlanHistoryTable.tsx`를 개발하고, `NewDataTableBody` 기반 테이블에 페이지 변경 핸들러와 loading 상태 전파를 추가했다. 플랜 이력의 operator 레이블을 "CLO-SET Manager"로 통일해 표현 일관성을 확보했다.
- **Result**: 플랜 변경 이력 페이지네이션 조회 지원, operator 필터 레이블 명확화

### GroupUsageAccordionBox 사용량 추적

- **Problem**: 그룹의 스토리지·렌더링 등 사용량을 한눈에 파악할 수 있는 뷰가 없었다. 사용량 데이터를 패칭한 뒤 다른 컴포넌트가 해당 완료 시점을 인식하지 못해 타이밍 이슈가 발생했다.
- **Solve**: `GroupUsageAccordionBox.tsx`를 Accordion UI로 구성하고, 사용량 데이터 패칭 로직을 `useCLOSETGroupsUsage.tsx` 커스텀 훅으로 분리했다. 패칭 완료 후 콜백을 호출하는 `onFetchComplete` 인터페이스를 추가해, 상위 컴포넌트가 사용량 로딩 완료를 인식할 수 있도록 했다. 사용량 수치 포맷팅을 위해 number 유틸에 단위 변환 함수도 추가했다.
- **Result**: 그룹 사용량 실시간 조회 제공, 사용량 로드 완료 이벤트 연동 가능

---

## 주요 구현 — 그룹 코멘트 CRUD

### 운영 메모(Comments) 기능 전체 구현

- **Problem**: 운영팀이 특정 그룹에 대한 내부 메모를 남길 수 있는 기능이 없었다. 기존 `CommentTable.tsx`는 멤버 상세 페이지 전용으로 강하게 결합되어 있어 그룹 도메인에 그대로 재사용할 수 없었다.
- **Solve**: `GroupComment.tsx`, `GroupCommentTable.tsx`, `GroupAddCommentModal.tsx`, `GroupCommentListColumns.tsx` (총 535줄 이상)를 신규 개발했다. 코멘트 CRUD API 연동은 `useCLOSETGroupsCommentsQuery.tsx` 커스텀 훅으로 캡슐화했다. `CommentList.tsx`의 `setIsEditing` prop을 optional로 만들어 멤버 상세·그룹 양쪽에서 재사용 가능하도록 인터페이스를 조정했다. 코멘트 등록 시각을 KST 기준으로 표시하지 않는 버그를 발견해 날짜 포맷 로직도 수정했다.
- **Result**: 그룹 단위 운영 메모 생성·수정·삭제 완성, KST 기준 날짜 표시 정확화

---

## 주요 구현 — 공통 설계

### searchParams 기반 필터 상태 관리 버그 수정

- **Problem**: 그룹 목록에서 매니저 필터를 적용한 뒤 초기화 버튼을 누르면 매니저 필터가 URL searchParams에서 완전히 제거되지 않는 버그가 있었다.
- **Solve**: 초기화 시 searchParams 전체를 일괄 reset하는 로직을 수정해, 매니저 필터 키를 명시적으로 제거하도록 처리했다.

### API 커스텀 훅 설계 패턴 정립

- Groups 도메인 전반에 걸쳐 그룹 목록·상세·코멘트·사용량·멤버·매니저 조회용 커스텀 훅 7개 이상을 `hooks/groups/` 디렉터리 하위에 일관된 구조로 설계했다. API 요청 함수는 별도 레이어로 분리해 훅이 데이터 패칭 세부사항에 의존하지 않도록 했다. 타입은 도메인별 단일 파일에 집중 정의해 API 스키마 변경 시 단일 지점에서 수정 가능하게 구성했다.

---

## 회고 / 아쉬웠던 점

6개월에 걸쳐 Groups 도메인 전체를 처음부터 설계하면서, "기능이 늘어나도 컴포넌트 구조가 흔들리지 않으려면 무엇이 중요한가"를 실감했다. 초기에 `GroupInformationTable`에 매니저 CRUD·통화 변경 등 책임이 점점 늘어나는 상황을 경험하며, 각 액션을 별도 모달 컴포넌트로 분리하고 컨테이너가 오케스트레이션만 담당하는 구조가 유지보수 측면에서 유리함을 확인했다. 또한 searchParams를 상태 저장소로 활용한 것은 URL 공유와 히스토리 관리 측면에서 좋은 선택이었지만, 초기화·파싱 로직이 여러 컴포넌트에 분산되면서 버그가 발생했다 — 다음에는 URL 상태 관리를 단일 훅으로 추상화하는 것이 적합하다고 생각한다.
