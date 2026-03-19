# nProgress 페이지 전환 인디케이터 도입

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, nprogress |
| 개발 기간 | 2022.11 |
| 서비스 링크 | style.clo-set.com |

## 소개

Next.js 클라이언트 사이드 라우팅 시 페이지 전환이 시작되면 화면 상단에 얇은 진행 바(progress bar)를 표시하는 nProgress를 도입했다. Next.js의 CSR(Client Side Routing)은 전통적인 full page reload 없이 페이지를 전환하기 때문에, 브라우저 기본 로딩 인디케이터가 표시되지 않는다. 이로 인해 사용자가 클릭 후 아무 반응이 없는 것처럼 느끼는 **"피드백 공백(Feedback Gap)"** 문제가 있었고, nProgress를 통해 페이지 전환 중임을 즉각적으로 전달하는 UX를 구현했다.

## 주요 구현

### Next.js Router 이벤트 라이프사이클 바인딩

- **Problem**: nProgress를 단순히 전역으로 시작/완료시키면 두 가지 문제가 발생한다. 첫째, 페이지 전환이 매우 빠를 때(캐시 히트 등) 진행 바가 순간적으로 깜빡이는 **Flash 현상**이 생긴다. 둘째, 라우팅 오류(`routeChangeError`)가 발생했을 때 진행 바가 완료되지 않은 채 멈춰 있는 **좀비 상태**가 남는다.
- **Solve**: Next.js Router의 세 가지 이벤트에 nProgress를 바인딩:
  - `routeChangeStart` → `NProgress.start()` — 전환 시작 즉시 진행 바 표시
  - `routeChangeComplete` → `NProgress.done()` — 전환 완료 시 진행 바 종료
  - `routeChangeError` → `NProgress.done()` — 오류 발생 시에도 진행 바 반드시 종료

  Flash 현상 방지를 위해 `NProgress.configure({ minimum: 0.08, speed: 400, trickleSpeed: 200 })`으로 최소 표시 시간과 애니메이션 속도를 조정. 100ms 이하의 즉각적인 전환에서는 진행 바가 눈에 띄지 않을 정도로 짧게 표시되도록 튜닝.
- **Result**: 모든 페이지 전환에서 즉각적인 시각적 피드백 제공, 라우팅 오류 시에도 진행 바 좀비 상태 없음

### `_app.tsx` 전역 라이프사이클 관리 및 메모리 누수 방지

- **Problem**: Router 이벤트 핸들러를 `_app.tsx`에 등록할 때 cleanup 없이 매 렌더마다 새로운 핸들러를 등록하면 이벤트 핸들러가 중복 등록되어 nProgress가 여러 번 호출되거나 메모리 누수가 발생할 수 있다.
- **Solve**: `useEffect`의 dependency array를 `[]`(마운트 1회)로 설정하여 핸들러를 최초 1회만 등록. cleanup 함수에서 `router.events.off()`로 핸들러를 명시적으로 제거하여 언마운트 시 완전 정리. nProgress 스타일 커스터마이징을 `globals.css`에 추가하여 서비스 브랜드 색상(Primary Color)과 일치시킴.
- **Result**: 이벤트 핸들러 중복 등록 없이 안정적으로 동작, 브랜드 색상 일치로 일관된 시각적 경험

## 회고

nProgress 도입은 코드 분량은 작지만, "사용자가 시스템의 현재 상태를 알 수 있어야 한다"는 UI/UX 원칙(Nielsen의 휴리스틱 1번: **Visibility of System Status**)을 직접 구현한 작업이다. 특히 SPA(Single Page Application)에서 클라이언트 사이드 라우팅이 브라우저의 기본 피드백 메커니즘을 우회한다는 점을 인식하고, 이를 **애플리케이션 레벨에서 보완**해야 한다는 것을 배웠다. 작은 개선이지만 전체 서비스의 체감 성능을 향상시키는 효과가 있었다.
