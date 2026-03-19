# SaaS 마켓플레이스 업로드 기능 개발 (deprecated)

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, SCSS |
| 개발 기간 | 2020.07 ~ 2021.03 (deprecated) |
| 서비스 링크 | style.clo-set.com |

## 소개

CLO-SET 사용자가 3D 의류 콘텐츠를 CLO 마켓플레이스(CLOSET) 또는 MD 전용 스토어(MD_STORE) 두 가지 채널에 업로드·판매 등록하는 기능이다. **2단계 스텝 모달 플로우**로 구성되어 있으며, 1단계에서 기본 정보(제목·코드·설명·태그·썸네일·추가 이미지)를, 2단계에서 카테고리·의류 스타일·가격 정보를 입력한다. 2021.03 컨텍스트 메뉴에서 제거되어 현재는 deprecated 상태다.

## 주요 구현

### 2단계 스텝 모달 업로드 플로우

- **Problem**: 마켓플레이스 업로드는 입력 항목이 많아 단일 화면에 모두 표시하면 인지 부하가 크다. 단계별로 나눠야 하지만, 단계 간 데이터 공유와 각 단계의 유효성 검사를 일관되게 처리해야 했다.
- **Solve**: `Step` enum(STEP1 / STEP2)으로 현재 단계를 `UploadMarketplaceStore`에서 관리. 1단계 완료 조건(`isNextButton` computed)과 2단계 완료 조건(`isConfirmButton` computed)을 MobX computed property로 선언하여 각 단계의 유효성 검사를 스토어에서 파생. 단계 전환 시 스토어의 `stepNumber`만 변경하면 모달 컴포넌트가 자동으로 해당 단계 UI로 전환.
- **Result**: 단계별 유효성 검사가 선언적으로 관리되며, 진행 버튼 활성화 여부가 computed 값에 의해 자동 결정

### 마켓 타입별 이중 API 대응

- **Problem**: CLOSET 마켓과 MD_STORE 두 채널이 각각 다른 카테고리 API와 업로드 엔드포인트를 사용했다. `MarketType` enum(CLOSET / MD_STORE)으로 분기해야 했으며, 카테고리 계층 구조도 채널마다 달랐다.
- **Solve**: `MarketType`을 기준으로 카테고리 조회 API를 분기 호출(`getMarketplaceCategory` / `getMdStoreCategory`). 업로드 폼 데이터 구성(`IReqUploadMarketplace`)과 API 호출을 `UploadMarketplaceStore` 단일 액션으로 캡슐화하여 컴포넌트에서 마켓 타입 분기 로직이 노출되지 않도록 설계.
- **Result**: 컴포넌트는 마켓 타입에 무관하게 단일 store action만 호출, 마켓 타입별 분기는 스토어 내부에서 처리

### 파일 첨부 스토어 분리 (UploadMarketplaceAttachStore)

- **Problem**: 썸네일 이미지와 추가 상품 이미지는 업로드 플로우와 생명주기가 다르다. 썸네일은 1단계에서 미리보기와 함께 즉시 업로드되고, 상품 이미지는 2단계에서 순서 변경이 가능하다. 이 파일 상태를 메인 스토어에 혼재시키면 복잡도가 높아진다.
- **Solve**: 파일 첨부 상태(`thumbnails`, `images`, 업로드 진행률, 순서 변경 로직)를 `UploadMarketplaceAttachStore`로 분리. 메인 스토어(`UploadMarketplaceStore`)는 폼 데이터·단계·업로드 상태를 담당하고, 첨부 스토어를 참조하여 최종 제출 시 파일 데이터를 통합.
- **Result**: 파일 첨부 로직의 단독 테스트 및 변경이 가능한 구조

### 가격 자동 계산 및 상태 관리

- **Problem**: 원가(original price), 판매가(sales price), 할인율(discount %) 세 값이 상호 의존 관계에 있다. 할인율 입력 시 판매가가 자동 계산되어야 하고, 판매가 직접 입력 시 할인율이 역산되어야 하는 UX가 필요했다.
- **Solve**: MobX observable로 세 값을 관리하고, 각 입력 핸들러에서 나머지 연관 값을 즉시 업데이트. 판매가 > 원가인 경우 등 비정상 입력에 대한 유효성 검사를 `isConfirmButton` computed에 포함하여 제출 자체를 차단.

### 업로드 상태(Status) 기반 UI 분기

- 마켓플레이스 업로드 상태를 `Status` enum(PENDING / CONFIRMED / REJECTED / WITHDRAW / UPDATED / WAITING_AGAIN)으로 관리. 각 상태에 따라 컨텍스트 메뉴 노출 여부(`isWithdraw` 등)와 안내 메시지가 달라지도록 `item-store`에서 파생 처리.
- 철회(`withdrawMarketPlace`) 완료 후 `marketPlaceInfo`를 즉시 초기화하여 UI 상태 동기화.

## 회고

이 기능은 2021.03에 컨텍스트 메뉴에서 제거되며 사실상 deprecated됐다. 개발 당시 2단계 스텝 플로우와 마켓 타입별 분기를 스토어 레벨로 캡슐화한 설계 자체는 잘 작동했지만, 결과적으로 서비스 방향이 바뀌며 기능 자체가 철수됐다. **기능이 deprecated될 때 UI 컴포넌트와 스토어를 완전히 제거하면서도 API 레이어는 남겨두는 정리 방식**을 경험했고, 기능 삭제 시 의존성 범위를 레이어별로 판단하는 것이 중요하다는 것을 배웠다.
