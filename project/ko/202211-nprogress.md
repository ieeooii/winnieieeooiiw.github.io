---
thumbnail: /images/projects/202211-nprogress.png
gradient: linear-gradient(135deg, #f1f3f7, #e2e6ed)
---

# 페이지 전환 로딩 인디케이터 도입

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, nprogress |
| 개발 기간 | 2022.11 |
| 인원 | 프론트엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

![페이지 전환 로딩 인디케이터](/images/projects/202211-nprogress.png)

Next.js 클라이언트 사이드 라우팅 시 페이지 전환이 시작되면 화면 상단에 얇은 진행 바(progress bar)를 표시하는 nProgress를 도입했다. Next.js의 CSR(Client Side Routing)은 전통적인 full page reload 없이 페이지를 전환하기 때문에, 브라우저 기본 로딩 인디케이터가 표시되지 않는다. 이로 인해 사용자가 클릭 후 아무 반응이 없는 것처럼 느끼는 **"피드백 공백(Feedback Gap)"** 문제가 있었고, nProgress를 통해 페이지 전환 중임을 즉각적으로 전달하는 UX를 구현했다.

## 주요 구현

### Router 이벤트 바인딩 — Shallow routing 제외와 오류 시 좀비 상태 방지

- **Problem**: nProgress를 단순히 전역으로 시작/완료시키면 두 가지 문제가 발생한다. 첫째, Shallow routing(URL만 변경되고 페이지 전체를 재요청하지 않는 전환)에서도 진행 바가 표시되어 불필요한 시각적 노이즈가 생긴다. 둘째, 라우팅 오류(`routeChangeError`)가 발생했을 때 진행 바가 완료되지 않은 채 멈춰 있는 **좀비 상태**가 남는다.
- **Solve**: Next.js Router의 세 가지 이벤트에 nProgress를 바인딩:
  - `routeChangeStart` → `shallow` 파라미터 체크 후 shallow route 전환이면 건너뜀, 그 외엔 `NProgress.start()`
  - `routeChangeComplete` → `NProgress.done()` — 전환 완료 시 진행 바 종료
  - `routeChangeError` → `NProgress.done()` — 오류 발생 시에도 진행 바 반드시 종료

  `NProgress.configure({ showSpinner: false })`로 스피너를 비활성화하여 상단 진행 바만 표시.
- **Result**: 실제 페이지 전환에서만 진행 바 표시, 라우팅 오류 시에도 좀비 상태 없음

### 독립 컴포넌트 분리와 Emotion 테마 색상 동적 연동

- **Problem**: Router 이벤트 핸들러를 cleanup 없이 매 렌더마다 등록하면 핸들러가 중복 등록되어 nProgress가 여러 번 호출되거나 메모리 누수가 발생할 수 있다. 또한 진행 바 색상을 하드코딩하면 디자인 시스템 테마 변경 시 별도 수정이 필요하다.
- **Solve**: nProgress 전용 컴포넌트를 분리하여 글로벌 레이아웃 최상위에 배치, 모든 레이아웃 타입에 공통 적용. `useEffect`를 마운트 1회(`[]`)로 설정하여 핸들러를 최초 1회만 등록하고, cleanup에서 `router.events.off()`로 명시적 제거. Emotion의 `Global` 컴포넌트와 `useTheme()` 훅으로 `theme.colors.PRIMARY`를 CSS 변수로 주입하여 진행 바 색상을 디자인 시스템 테마와 동적으로 연동.
- **Result**: 핸들러 중복 등록 없이 안정적으로 동작, 디자인 시스템 Primary Color 변경 시 진행 바 색상 자동 반영

## 회고 / 아쉬웠던 점

nProgress 도입은 코드 분량은 작지만, "사용자가 시스템의 현재 상태를 알 수 있어야 한다"는 UI/UX 원칙(Nielsen의 휴리스틱 1번: **Visibility of System Status**)을 직접 구현한 작업이다. 특히 SPA(Single Page Application)에서 클라이언트 사이드 라우팅이 브라우저의 기본 피드백 메커니즘을 우회한다는 점을 인식하고, 이를 **애플리케이션 레벨에서 보완**해야 한다는 것을 배웠다. 작은 개선이지만 전체 서비스의 체감 성능을 향상시키는 효과가 있었다.
