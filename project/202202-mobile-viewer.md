# 3D 의상 모바일 뷰어 페이지 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, Emotion.js |
| 개발 기간 | 2022.02 ~ 2022.04 |
| 인원 | 프론트엔드 (담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

모바일 디바이스에서 3D 콘텐츠를 감상하고 컬러웨이를 탐색하는 전용 뷰어 페이지다. 데스크톱 뷰어와 별도의 `/mobile/content.tsx` 라우트로 분리하여 터치 기반 인터랙션·Bottom Sheet 네비게이션·세로 레이아웃을 제공하며, User-Agent 기반 리다이렉트로 모바일 사용자에게 최적화된 번들만 전달했다.

## 주요 구현

### 3D 뷰어 초기 로드 사이즈 버그 및 로딩 UX
- **Problem**: 모바일에서 3D 파일을 처음 로드할 때 뷰어 캔버스가 올바른 크기로 초기화되지 않는 버그가 있었다. 뷰어가 마운트된 직후 DOM 크기가 아직 확정되지 않은 시점에 resize 계산이 실행되어 3D 모델이 찌그러지거나 잘린 크기로 렌더링됐다. 또한 3D 파일 로딩 중 빈 화면만 표시되어 사용자가 로딩 중인지 오류인지 구분할 수 없었다.
- **Solve**: 뷰어 마운트 완료 이후 next tick에 resize 이벤트를 트리거하도록 타이밍 수정(`requestAnimationFrame` 활용). `CircleProgress.tsx` 원형 프로그레스 인디케이터를 신규 개발하여 3D 파일 로딩 진행률을 시각적으로 표시.
- **Result**: 초기 렌더링 사이즈 오류 해소, 로딩 상태 명확히 표시

### Bottom Sheet 기반 모바일 네비게이션
- **Problem**: 콘텐츠 목록과 컬러웨이 목록을 데스크톱에서는 사이드 패널로 표시하지만, 모바일에서는 화면 공간이 부족하여 3D 뷰어와 목록이 동시에 표시되면 뷰어가 너무 작아지는 문제가 있었다.
- **Solve**: `BottomSheetNavigation.tsx`(슬라이드 업 바텀 시트)와 `ContentNavigationContainer.tsx`를 신규 개발. `ContentColorwayContainer.tsx`에 터치 최적화 컬러웨이 선택 UI 추가. `BaseAppBar.tsx`를 디자인 시스템에 추가하여 모바일 앱바 공통화.
- **Result**: 3D 뷰어 전체 화면 확보 + 필요 시 목록 접근 가능한 Bottom Sheet 패턴 구현

### JavaScript Heap Memory Leak 해결
- **Problem**: 모바일 뷰어 페이지를 오래 사용하면 브라우저가 느려지거나 탭이 강제 종료됐다. Chrome DevTools Memory 탭에서 Heap 스냅샷을 찍어 비교한 결과, 이벤트 리스너가 컴포넌트 언마운트 후에도 제거되지 않고 누적되는 것이 원인이었다. 이벤트 핸들러가 `useEffect` 외부에 선언되어 있어 매 렌더마다 새로운 함수 인스턴스가 이벤트 리스너로 등록되고, cleanup에서는 기존 참조와 다른 함수를 제거하려 해서 실제로는 제거가 되지 않았다.
- **Solve**: 이벤트 핸들러를 `useEffect` 내부로 이동하여 동일 참조의 함수가 등록·제거되도록 수정. cleanup 함수에서 `removeEventListener`를 명시적으로 호출하여 언마운트 시 완전 정리.
- **Result**: 장시간 사용 시 메모리 누수 해소, 탭 강제 종료 현상 해결

## 회고

Memory Leak 디버깅은 이 프로젝트에서 처음으로 Chrome DevTools의 Memory 탭을 제대로 활용한 경험이었다. Heap 스냅샷을 시점별로 비교하면 어떤 객체가 GC되지 않고 누적되는지 파악할 수 있다는 것을 배웠다. `useEffect`의 클린업 함수는 "무조건 작성한다"는 규칙이 얼마나 중요한지를 직접 겪은 계기가 됐다.
