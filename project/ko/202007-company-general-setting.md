# 회사 일반 설정(General) 페이지 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, Emotion |
| 개발 기간 | 2020.07 ~ 2020.09 |
| 서비스 링크 | style.clo-set.com |

## 소개

패션 브랜드 관리자가 회사 정보(이름, 로고, 컬러), 기능 활성화 옵션(워크룸·라인시트·접근 권한·뷰어), 측정 단위·통화 단위를 설정하는 Company General Setting 페이지다. 설정 항목이 다양하고 각각 API 호출과 연동되기 때문에, **토글 옵션들을 선언적 데이터 구조(config 배열)로 관리**하는 방식을 설계했다. 회사 삭제·양도처럼 복구 불가능한 파괴적 액션에 대한 확인 플로우도 포함된다.

## 주요 구현

### 토글 옵션 선언적 config 패턴 설계

- **Problem**: UseCompanyRoom / UseLine / UseAccessiblePeople / ActiveImageViewer / ActivePatternViewer 등 5개 이상의 토글 옵션이 각각 다른 API를 호출하고, 토글별로 모달 제목·내용·on/off 라벨이 모두 달랐다. 토글마다 별도 컴포넌트나 조건 분기를 만들면 신규 토글 추가 시 코드 변경 범위가 넓어진다.
- **Solve**: 각 토글 옵션을 `CompanyOptionType[]` 배열로 선언적으로 정의 — `isOn`, `onToggle`, `modalTitle`, `modalContents`, `onValue/offValue` 등 필요한 속성을 데이터로 명세. `CompanyOptionList` 컴포넌트가 이 배열을 순회하며 일관된 토글 UI를 렌더링. 커스텀 컴포넌트(측정 단위 셀렉터, 통화 단위 셀렉터)가 필요한 옵션은 `component` 프로퍼티로 주입.
- **Result**: 새로운 토글 옵션은 배열에 항목 하나 추가하는 것만으로 적용 가능한 확장 구조

### 회사 이름 변경 — 실시간 유효성 검사

- **Problem**: 회사 이름 입력 시 특수문자·금지 문자가 포함된 채 서버로 전송되면 백엔드에서 에러가 반환된다. 사용자 입장에서는 저장 버튼을 누른 뒤 실패 메시지를 받는 것보다, 입력 중에 실시간으로 유효성 피드백을 받는 것이 UX상 낫다.
- **Solve**: `checkFilenameValidity()` 유틸 함수로 입력값을 실시간 검증. 유효하지 않을 경우 `SettingInput` 컴포넌트에 `helpMessage`를 전달하여 인라인 오류 문구 표시. `onBlur` 이벤트에서 서버 전송 시 유효하지 않으면 API 호출 자체를 차단. 글자 수 제한은 `CHARACTER_LIMIT.SPACE_NAME` 상수로 관리하여 입력 필드의 `maxLength`에 일괄 적용.
- **Result**: 유효하지 않은 이름이 서버로 전송되는 케이스 원천 차단, 사용자가 입력 중 즉시 피드백 수신

### 회사 삭제 / 양도 파괴적 액션 처리

- **Problem**: 회사 삭제는 모든 콘텐츠와 설정이 영구적으로 삭제되는 복구 불가능한 액션이다. 회사 양도(Transfer)는 플랜 조건에 따라 노출 여부가 결정되고, 양도 수락·거절 플로우가 별도로 존재한다. 이 두 액션을 단순 버튼으로 제공하면 실수로 실행되는 위험이 있다.
- **Solve**: 회사 삭제는 `ItemDeleteModal`에 회사 이름을 전달하여 "이름을 직접 입력해야 확인" 패턴 적용. 삭제 완료 후 대시보드로 자동 리다이렉트 처리. `CompanyTransferContainer`는 플랜 조건에 따라 조건부 렌더링. `CompanyInfoSettingModal` enum으로 현재 열린 모달 타입을 단일 state로 관리하여 여러 모달이 동시에 열리지 않도록 제어.
- **Result**: 파괴적 액션에 대한 이중 확인 플로우 구현, 모달 상태 충돌 방지

### 측정 단위 / 통화 단위 설정

- 3D 패턴 측정 단위(INCH/CM/MM)를 변경하는 `CompanyMeasurementUnitSetting` 개발 — 단위 변경 API 호출 중 `isMeasurementUnitUpdating` 로딩 상태로 중복 요청 방지
- 통화 단위를 설정하는 `CompanyCurrencyUnitSetting` 개발 — `getCurrencyUnit` / `updateCurrencyUnit` 두 액션을 props로 주입받아 조회와 업데이트를 분리 처리
- 뷰어 옵션 토글(이미지 뷰어 / 패턴 뷰어 활성화) 변경 시 `store.reloadItems()` 호출로 콘텐츠 목록 즉시 갱신

## 회고 / 아쉬웠던 점

설정 페이지는 "단순한 폼"처럼 보이지만, 항목 하나하나가 서로 다른 API와 연동되고 각각의 실패 케이스·로딩 상태를 처리해야 한다. 토글 옵션을 config 배열로 선언적으로 관리하는 방식은 초기 설계 비용이 조금 높지만, 이후 새로운 옵션이 추가될 때마다 컴포넌트 코드를 건드리지 않아도 되는 장점이 있다. 반복되는 패턴을 추상화할 시점을 판단하는 것이 설계의 핵심임을 이 작업에서 다시 확인했다.
