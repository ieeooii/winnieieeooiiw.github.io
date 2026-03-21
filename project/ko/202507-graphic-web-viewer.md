# 3D 그래픽 웹 뷰어 전면 리뉴얼

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | React, TypeScript, Jotai, 3D Engine API |
| 개발 기간 | 2025.07 ~ 2026.03 |
| 인원 | 프론트엔드 1 , 그래픽 엔지니어 1, 프로덕트 디자이너 2 (프론트엔드 담당) |

## 소개

CLO-SET의 핵심 기능인 3D 뷰어를 전면 재구축했다. CLO3D 엔진을 React에서 사용할 수 있도록 추상화한 뷰어 엔진 패키지 패키지를 단독으로 설계·구현하고, 이미지 뷰어·3D 엔진 뷰어·렌더 뷰어·ETC 뷰어·비디오 뷰어 등 다양한 뷰어 타입과 렌더 실행기·버전 관리·환경 설정 등 뷰어 전반의 기능을 담당했다.

엔진팀이 제공한 CLO3D API는 함수 목록만 나열된 형태로 React 연동에 대한 정의가 없었다. 이를 그대로 앱에서 쓰면 엔진 사용법이 앱 코드에 흩어지는 문제가 생기므로, React 생명주기에 맞게 추상화한 hook 레이어를 독립 패키지로 설계했다.

**주요 구현 컴포넌트**: `CLO3DViewer`(panzoom 연동) / `CLO3DEngineViewer`(colorway/strain map/분해 뷰/원리도 렌더) / `CLO3DRenderViewer` / `TurntablePlayer` / `CLO3DRenderExecutor`(렌더 실행기) / `Environment`(ChromePicker/PhotoPicker) / `ETCImageViewer` / `ETCDocViewer` / 비디오 뷰어(socket 스트림) / `ViewerVersionSelect`


## 주요 구현

### React StrictMode에서 canvas 이중 생성 문제
- **Problem**: React 18 StrictMode는 개발 환경에서 mount → unmount → mount를 의도적으로 두 번 실행한다. 이로 인해 엔진 init이 두 번 호출되어 canvas가 두 개 생기는 문제가 발생했다. 하나는 빈 canvas, 하나는 정상 렌더된 canvas가 DOM에 공존했다.
- **Solve**: 엔진 init 함수(`initViewer`) 진입 시 `destroyCanvas()`를 먼저 호출해 기존 canvas를 제거하고 시작하도록 처리. `if (engineInstance) return`으로 인스턴스가 이미 존재하면 재초기화를 막음. 엔진 인스턴스는 hook 내부 state가 아닌 외부 핸들러(`engineInstanceHandler.set/reset`)로 관리해, unmount 시 cleanup → remount 시 재생성 흐름이 명확히 동작하도록 설계.
- **Result**: StrictMode 환경에서도 canvas가 단 하나만 렌더되고, 엔진 초기화/해제 사이클이 React 생명주기와 정확히 동기화됨.
- **Insight**: StrictMode를 끄는 것으로 해결하려는 유혹이 있었지만, 근본적인 설계로 해결한 것이 나중에 유지보수 면에서 큰 차이를 만들었다.

### 엔진 API → React hook 추상화
패키지 구조를 세 가지 관심사로 분리했다:
- **초기화** (`useInitReactEngine3DViewer`): 엔진 인스턴스 생성 및 canvas 마운트
- **콘텐츠 로딩** (`useReactEngine3DViewerLoadSRest`): 3D 파일 비동기 로드
- **리사이즈** (`useReactEngine3DViewerResize`): ResizeObserver + 30ms throttle로 canvas 크기 동기화
- **Problem**: 엔진팀이 제공한 API는 함수 나열 형태로 사용 순서(초기화 → 데이터 로드 → 뷰어 옵션 적용)나 비동기 타이밍, 에러 처리 방식이 정의되어 있지 않았다.
- **Solve**: 각 기능을 역할별로 hook으로 분리하고, 공통 인터페이스(`ReactEngine3DViewingOptionItem`)로 통일. 뷰어 옵션(Avatar/Garment 표시, Strain Map, Exploded View, 원리도 렌더, 확대경)을 각각 독립 hook으로 구현하고, 키보드 단축키도 `useReactEngine3DViewerShortcut` hook으로 묶음. 에러는 엔진이 던지는 8가지 에러 타입을 구분해 처리. 이를 하나의 조합 hook(`useReactEngine3DViewer`)으로 묶어 사용처에서는 단일 hook 호출만으로 엔진을 사용할 수 있도록 함.
- **Result**: 사용처에서는 엔진 API를 직접 몰라도 hook만으로 모든 뷰어 기능을 사용 가능. 신규 뷰어 옵션 추가 시 인터페이스만 맞추면 되는 확장 구조 확보.

### `CLO3DRenderExecutor` — 렌더 실행기
- **Problem**: 렌더 옵션(품질, 이미지 크기, 비디오/GIF), 프리셋 저장/불러오기, 렌더 서버 상태 표시, 렌더 취소 등 복잡한 워크플로우를 단일 UI에서 관리해야 했다.
- **Solve**: 렌더 관련 상태를 Jotai atom으로 중앙화하고, UI를 설정 → 실행 → 상태 모니터링 단계로 분리. 렌더 서버 상태는 socket으로 실시간 수신해 반영.
- **Result**: 복잡한 렌더 워크플로우를 단계별로 직관적으로 처리 가능.

### `TurntablePlayer` 구현
- **Problem**: 턴테이블(회전 애니메이션) 재생 시 이미지 시퀀스 로딩·재생 속도 제어·프레임 전환이 부드럽게 동작해야 했다.
- **Solve**: 이미지 시퀀스를 requestAnimationFrame 기반으로 제어하고, 사전 로딩(preload) 완료 후 재생 시작. 속도 슬라이더와 프레임 인디케이터 UI 연동.
- **Result**: 매끄러운 턴테이블 재생, 로딩 상태 피드백 제공.

### colorway 변경 후 뷰잉 옵션 복원
- **Problem**: 컬러웨이 변경 시 사용자가 설정한 뷰잉 옵션(strain map, pattern 등)이 초기화되는 버그.
- **Solve**: colorway 변경 시 현재 뷰잉 옵션 상태를 atom에 보존하고, 엔진 재초기화 완료 후 재적용.
- **Result**: 컬러웨이 변경 후에도 사용자 설정 유지.

## 회고 / 아쉬웠던 점
가장 오래, 가장 넓은 범위로 기여한 프로젝트다. 엔진팀의 API를 그대로 사용하지 않고 React 패러다임에 맞는 추상화 레이어를 직접 설계한 것이 이 프로젝트의 핵심이었다. Jotai를 처음 도입한 프로젝트이기도 한데, 뷰어처럼 상태가 여러 컴포넌트에 분산된 경우 atom 기반이 Context 대비 훨씬 유연하다는 것을 체감했다.
