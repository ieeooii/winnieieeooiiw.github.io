---
thumbnail: /images/projects/202106-sign-in.png
gradient: linear-gradient(135deg, #ede8e0, #d8d0c4)
---

# 로그인 · 회원가입 인증 플로우 전면 재설계

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, Emotion.js |
| 개발 기간 | 2021.06 ~ 2021.10 |
| 인원 | 프론트엔드 (담당) |
| 서비스 링크 | style.clo-set.com/account/signin |

## 소개

SCSS 기반 레거시 인증 플로우를 Emotion.js 기반으로 전면 리뉴얼했다. Sign In/Up, 비밀번호 find/reset/set/change, OAuth 에러 처리, 재가입 차단, 계정 잠금, Open Redirect 보안 취약점 수정까지 인증 전체 범위를 단독으로 담당했다.

**커버 범위**: Sign In / Sign Up / Find·Reset·Set·Change Password / OAuth(Google, 외부 SW 연동) / Email Verify / SSO / 재가입 플로우 / 유료 계정 재가입 방지

## 주요 기능

- **Sign In / Sign Up**: 이메일·비밀번호 인증, CAPTCHA, 이메일 인증 메일 발송
- **비밀번호 관리**: Find · Reset · Set · Change 전용 페이지 통합
- **OAuth / SSO**: Google OAuth, 외부 SW 자격증명, Enterprise SSO
- **보안**: 계정 잠금, 유료 계정 재가입 방지, Open Redirect 차단

<div class="img-row-2">

![로그인](/images/projects/202106-sign-in.png)
![회원가입](/images/projects/202106-sign-up.png)
![비밀번호 찾기](/images/projects/202106-find-password.png)
![비밀번호 설정](/images/projects/202106-set-password.png)
![비밀번호 변경](/images/projects/202106-change-password.png)

</div>

## 주요 구현

### 인증 플로우 전체 SCSS → Emotion.js + TypeScript 전환

- **Problem**: 기존 Sign In/Up 컴포넌트들이 SCSS + JavaScript로 구성되어 있어 디자인 토큰 적용과 다크모드 대응이 불가능했다. MobX store의 상태와 에러 핸들링 로직이 컴포넌트 내부에 분산되어 있어 테스트와 재사용이 어려웠다.
- **Solve**: 모든 account 관련 컴포넌트를 Emotion.js 기반으로 마이그레이션하고 TypeScript로 전환. Sign In / Sign Up / Password 각각 MobX 스토어를 독립 분리하여 `@observable` / `@action` / `@computed`를 명확하게 재정의. 공통 레이아웃 컴포넌트를 신규 생성하여 인증 페이지 전반에 재사용.
- **Result**: 인증 플로우 전체가 디자인 시스템 기반으로 통일, 상태 관리 코드와 UI 코드의 명확한 분리

### Sign-up 단계 상태 머신 & 폼 유효성 검사

- **Problem**: 회원가입은 단순한 폼 제출이 아니라 "폼 입력 → CAPTCHA 검증 → 완료(또는 중복 이메일 안내)"라는 다단계 흐름이다. 각 단계를 별도 페이지로 나누면 URL 이동에 따른 상태 초기화 문제가 생기고, 컴포넌트 내부에서 `boolean` 플래그 여러 개로 단계를 관리하면 조합 폭발 문제가 발생한다.
- **Solve**: 회원가입 단계(폼 입력 중 / 완료 / 중복 이메일)를 enum 단일 상태값으로 표현하고, 단계별 컴포넌트를 객체 맵으로 연결하는 상태 머신 패턴 적용. 폼 유효성 검사는 이메일·비밀번호·비밀번호 확인 각각 조건 함수 + 메시지 키 쌍으로 선언적으로 정의하고, `@computed get canSubmit()`으로 전체 조건을 파생하여 제출 버튼 활성화 조건을 단일 진실 공급원으로 관리.
- **Result**: 단계 전환 로직이 enum 하나로 집약되어 조건 분기 최소화, 폼 유효성 상태가 항상 스토어에서 파생되어 UI와 일관성 유지

### Enterprise SSO / OAuth 인증 분기

- **Problem**: 인증 수단이 일반 ID/PW, Google OAuth, 외부 SW 자격증명, Enterprise SSO 등 여러 종류다. 특히 Enterprise SSO는 팝업 창에서 IdP 인증이 완료된 후 `postMessage`로 토큰을 받는 구조이고, 미가입 계정 에러에 대한 처리 방식도 OAuth와 달리 "재가입 유도" 대신 "에러 안내 후 재시도"여야 했다.
- **Solve**: Enterprise SSO는 팝업 창을 열고 `postMessage` 이벤트로 토큰을 수신. 수신 시 `event.origin`이 허용된 도메인인지 검증한 후에만 토큰을 처리하여 스푸핑 방지. 미가입 계정 에러 발생 시 SSO 여부를 판단하여 — SSO면 에러 모달로 안내(재가입 불가), 일반 OAuth면 약관 동의 페이지로 리다이렉트 — 인증 수단별로 분기. OAuth 에러 코드별 처리는 에러 코드를 키로 하는 디스패치 테이블 패턴으로 구현하여 조건문 없이 확장 가능한 구조.
- **Result**: 여러 인증 수단이 단일 외부 인증 스토어에서 일관되게 처리, postMessage Origin 검증으로 스푸핑 방어

### 로그인 에러 & 계정 잠금 처리

- **Problem**: OAuth 로그인 실패(잘못된 자격증명·이메일 미인증·시도 횟수 초과 등)와 계정 잠금은 에러 코드별로 사용자에게 전달해야 하는 내용과 액션이 다르다. 이를 `if/else`로 분기하면 에러 케이스 추가 시 분기 로직이 비선형적으로 커진다. 또한 계정 잠금은 로그인·비밀번호 변경·이메일 재인증 배너 등 여러 진입점에서 동일하게 처리되어야 했다.
- **Solve**: 에러 코드를 키로 하는 디스패치 테이블로 각 케이스별 모달 내용(제목·본문·버튼 액션)을 매핑. "시도 횟수 초과" 에러는 서버 응답의 남은 잠금 시간 값을 계산해 모달에 동적으로 표시. 계정 잠금 상태는 Sign In 스토어의 `status` observable에서 감지하여 모달 트리거 — 비밀번호 변경·이메일 재인증 배너 진입점에서도 동일한 모달 컴포넌트 재사용.
- **Result**: 에러 코드별 명확한 안내 제공, 계정 잠금 상태에서 모든 진입점에 걸쳐 일관된 처리

### 비밀번호 find / reset / set / change 플로우 — 단일 컨테이너 통합

- **Problem**: 기존 비밀번호 관련 플로우는 모달 기반으로 동작하고 있었는데, 새 디자인에서는 전용 페이지로 전환해야 했다. reset / set / change / 초기 비밀번호 변경이라는 4가지 유형이 각각 다른 API와 파라미터를 가지지만 UI 구조는 거의 동일하여 중복 컴포넌트 양산 우려가 있었다. 또한 모든 진입 경로에서 `returnUrl` 파라미터가 일관되게 전달되어야 했다.
- **Solve**: 비밀번호 유형(reset / set / change / 초기 변경)을 enum으로 구분하고, 저장 시 유형에 따라 다른 핸들러를 호출하는 디스패치 테이블 패턴으로 단일 컨테이너에 통합. `step` observable로 "입력 단계 → 완료 안내 단계" 전환을 관리. `returnUrl` 전달은 공통 유틸 함수로 통일.
- **Result**: 비밀번호 관련 모든 시나리오가 단일 컨테이너에서 처리되어 코드 중복 최소화, `returnUrl` 전달 버그 해소

### 유료 플랜 계정 재가입 방지 (2022.11)

- **Problem**: 이미 유료 플랜을 사용하다 탈퇴한 계정이 동일 이메일로 재가입할 경우, 기존 결제/플랜 데이터와 충돌하는 문제가 있었다. 중복 이메일 처리 로직의 조건 버그로 인해 유료 계정도 재가입 플로우를 진행할 수 있었다.
- **Solve**: 중복 이메일 확인 API 응답에서 유료 계정 여부 판단 조건을 수정하고, 유료 플랜 계정 재가입 시도 시 별도 안내 플로우로 분기.
- **Result**: 유료 계정 재가입으로 인한 데이터 충돌 방지

### Open Redirect 보안 취약점 수정 (2024.03)

- **Problem**: `returnUrl` 파라미터 검증 로직에 버그가 있어 특정 비정상 입력값이 유효한 URL로 통과되는 문제가 있었다. 이로 인해 조작된 링크를 통해 임의 외부 도메인으로 리다이렉트가 가능한 Open Redirect 취약점이 존재했다.
- **Solve**: `returnUrl` 검증 함수에서 비정상 문자열 입력값을 명시적으로 차단. URL 파싱 후 hostname 비교 방식으로 로직을 교체하여 허용 도메인 화이트리스트 외 모든 값을 차단. 검증 실패 시 안전한 기본 경로로 폴백.
- **Result**: Open Redirect 취약점 완전 차단, 인증 흐름의 리다이렉트 보안 강화

## 회고

Sign In/Up은 서비스의 첫 진입점이자 보안상 가장 민감한 영역이다. 에러 시나리오를 얼마나 촘촘하게 처리하느냐가 사용자 경험 품질을 결정한다는 것을 배웠다. OAuth 에러·계정 잠금·재가입 차단 등은 정상 플로우에서는 보이지 않지만 실제로는 꽤 많은 사용자가 마주치는 케이스다. 에러 코드별 디스패치 테이블 패턴은 케이스가 늘어날수록 `if/else` 대비 확장성이 뚜렷하게 좋다는 것도 이 작업에서 확인했다. 2024년에 발견된 Open Redirect 취약점은 URL 파라미터를 검증할 때 빈 값뿐만 아니라 다양한 비정상 입력값에 대한 처리를 빠짐없이 고려해야 한다는 교훈을 남겼다.
