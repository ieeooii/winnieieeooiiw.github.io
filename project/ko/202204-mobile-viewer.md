---
thumbnail: /images/projects/202202-mobile-viewer-3d.webp
gradient: linear-gradient(135deg, #dde8f0, #b8ccd8)
---

# 모바일 뷰어 페이지 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, Emotion.js |
| 개발 기간 | 2022.02 ~ 2022.04 |
| 인원 | 프론트엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당) |
| 서비스 링크 | [style.clo-set.com](https://style.clo-set.com) |

## 소개

3D 의상 메인 페이지의 모바일 전용 뷰어 페이지로 개발. 기본적인 3D 의상 정보, 색상 전환 및 아바타·의상 보기 on/off 기능을 제공한다. 데스크톱 뷰어와 별도 라우트로 분리하여 터치 기반 인터랙션·Bottom Sheet 네비게이션·세로 레이아웃을 제공하며, User-Agent 기반 리다이렉트로 모바일 사용자에게 최적화된 번들만 전달했다.

<div class="img-row-3">

![3D 뷰어 전체 화면](/images/projects/202202-mobile-viewer-3d.webp)
![콘텐츠 정보 패널](/images/projects/202202-mobile-viewer-info.webp)
![컬러웨이 선택 UI](/images/projects/202202-mobile-viewer-colorway.webp)

</div>

## 주요 구현

### 초기 Canvas 사이즈 버그 해결과 로딩 진행률 시각화
- **Problem**: 모바일에서 3D 파일을 처음 로드할 때 뷰어 캔버스가 올바른 크기로 초기화되지 않는 버그가 있었다. 뷰어가 마운트된 직후 DOM 크기가 아직 확정되지 않은 시점에 resize 계산이 실행되어 3D 모델이 찌그러지거나 잘린 크기로 렌더링됐다. 또한 3D 파일 로딩 중 빈 화면만 표시되어 사용자가 로딩 중인지 오류인지 구분할 수 없었다.
- **Solve**: 뷰어 마운트 완료 이후 next tick에 resize 이벤트를 트리거하도록 `requestAnimationFrame`으로 타이밍 수정. 원형 프로그레스 인디케이터를 신규 개발하여 3D 파일 로딩 진행률을 시각적으로 표시.
- **Result**: 초기 렌더링 사이즈 오류 해소, 로딩 상태 명확히 표시

### 가로세로 전환 시 Canvas 리사이즈 대응
- **Problem**: 모바일 기기에서 가로·세로 모드를 전환할 때 3D 캔버스가 올바르게 리사이즈되지 않았다. 캔버스 크기가 브라우저 클라이언트 치수를 기반으로 설정되어 방향 전환 시 재계산이 필요했으나, `Screen.orientation` API는 Safari 크로스 브라우징 미지원이었고, 3D 캔버스가 inline style로 제어되어 CSS `orientation` media query 적용도 불가능했다.
- **Solve**: `window.resize` 이벤트를 활용하여 화면 방향 전환을 감지하고 캔버스 크기를 재계산하도록 구현.
- **Result**: 가로·세로 전환 시 3D 캔버스 정상 리사이즈

### Bottom Sheet 네비게이션으로 모바일 전체 화면 뷰어 확보
- **Problem**: 콘텐츠 목록과 컬러웨이 목록을 데스크톱에서는 사이드 패널로 표시하지만, 모바일에서는 화면 공간이 부족하여 3D 뷰어와 목록이 동시에 표시되면 뷰어가 너무 작아지는 문제가 있었다.
- **Solve**: 슬라이드 업 Bottom Sheet 컴포넌트를 신규 개발하여 목록을 오버레이로 표시. 터치 최적화 컬러웨이 선택 UI 추가. 모바일 앱바 컴포넌트를 디자인 시스템에 추가하여 공통화.
- **Result**: 3D 뷰어 전체 화면 확보, 필요 시 Bottom Sheet로 목록 접근 가능한 구조

### Memory Leak 제거와 Reflow 최소화로 장시간 사용 성능 개선
- **Problem**: 모바일 뷰어 페이지를 오래 사용하면 브라우저가 느려지거나 탭이 강제 종료됐다. `debugger` 및 Chrome DevTools Memory Sampling Profile로 역추적한 결과 두 가지 원인이 있었다. 첫째, 이벤트 리스너가 컴포넌트 언마운트 후에도 누적되는 Heap Memory Leak — 이벤트 핸들러가 `useEffect` 외부에 선언되어 매 렌더마다 새 함수 인스턴스가 등록되지만 cleanup에서는 제거되지 않았다. 둘째, 하단 탭 전환 시 Reflow가 반복 발생하여 렌더링 성능이 저하됐다.
- **Solve**: 이벤트 핸들러를 `useEffect` 내부로 이동하여 동일 참조로 등록·제거. cleanup에서 `removeEventListener` 명시적 호출. 탭 전환 시 컴포넌트를 언마운트하는 대신 상위 컴포넌트에서 데이터를 관리하고 `display: none` 처리로 Reflow 방지.
- **Result**: 장시간 사용 시 메모리 누수 해소, 탭 전환 속도 개선, 강제 종료 현상 해결

## 회고 / 아쉬웠던 점

Memory Leak 디버깅은 이 프로젝트에서 처음으로 Chrome DevTools의 Memory 탭을 제대로 활용한 경험이었다. Heap 스냅샷을 시점별로 비교하면 어떤 객체가 GC되지 않고 누적되는지 파악할 수 있다는 것을 배웠다. `useEffect`의 클린업 함수는 "무조건 작성한다"는 규칙이 얼마나 중요한지를 직접 겪은 계기가 됐다.
