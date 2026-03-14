# 3D 의상 뷰어 배경색 커스터마이징 기능 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, SCSS, react-color |
| 개발 기간 | 2019.12 ~ 2020.01 |
| 인원 | 프론트엔드 1, 백엔드 1, 디자이너 1, 기획자 1 (프론트엔드 담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

3D 의류 뷰어에서 배경색을 Preset(미리 정의된 배경) / Custom Color(사용자 직접 등록) 두 모드로 커스터마이징하는 기능이다. 색상 상태가 뷰어(ViewerTools)·렌더 설정(RenderSettings)·스페이스 생성 모달(ModalCreateSpace) 세 곳에서 동시에 참조·변경되는 구조적 문제를 해결하기 위해 MobX 기반 단일 store를 설계했다. 입사 후 MobX store를 처음으로 직접 주도 설계한 기능이다.

## 주요 구현
### 3D 의상 배경 색상 변경 기능 개발
- 백엔드 엔지니어와 팔레트 색상 목록 CRUD 설계 진행 및 지정한 색상 값을 Cookie에 저장하여 개인화 기능 개발
- 그래픽스 엔지니어와 Canvas 배경 색상 변경 가능하도록 API 설계 진행 및 적용
- 기존  react-color  package를 사용해 만들어진 분산된 컴포넌트들을 통합 및 적용

### Custom Color CRUD + 인터랙션 엣지 케이스 처리
- **Problem**: 커스텀 색상 추가 시 API 응답 전에 add 버튼을 중복 클릭하면 동일 색상이 여러 번 등록되는 문제가 있었다. 삭제 시 500 에러가 발생하는 케이스가 존재했으며, ESC 키·외부 클릭(onClickOutside)으로 팝업을 닫는 인터랙션도 처리되지 않은 상태였다.
- **Solve**: `colorIndex` 값이 이미 존재할 경우 add 버튼을 `disabled` 처리하여 중복 추가 원천 차단. 삭제 API의 파라미터 오류를 수정하여 500 에러 해소. `keycode` 라이브러리로 ESC 키 바인딩, `outsideClickIgnoreClass` 옵션으로 외부 클릭 감지 영역 세밀하게 제어.
- **Result**: Custom Color 등록·삭제가 안정적으로 동작, 중복 등록 방지 및 키보드 접근성 확보

### 컴포넌트 아키텍처 분리 (리팩토링)
- **Problem**: ColorPicker 컴포넌트가 특정 페이지(ViewerTools) 내부에 강하게 결합되어 있어, ModalCreateSpace·RenderSettings 등 다른 사용처에서 재사용하려면 코드를 복사해야 했다. 다국어 적용도 각 사용처마다 따로 처리해야 해서 누락 위험이 있었다.
- **Solve**: ColorPicker를 독립 컴포넌트로 추출하고, 각 사용처는 필요한 props만 전달하는 구조로 분리. 다국어 키도 공통화하여 일괄 적용.
- **Result**: 코드 중복 제거, 다국어 일괄 적용 완료, 이후 새로운 사용처 추가 시 컴포넌트만 가져다 쓰는 구조 확립


## 회고 / 아쉬웠던 점

"상태를 어디에 두어야 하는가"라는 질문에 대해, 여러 컴포넌트가 하나의 상태를 공유해야 할 때 각 컴포넌트에 상태를 복사하는 것이 아니라 단일 출처(single source of truth)로 끌어올려야 한다는 것을 체감한 계기가 됐다.
