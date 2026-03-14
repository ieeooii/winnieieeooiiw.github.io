# 로그인 · 회원가입 인증 플로우 전면 재설계

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 서비스 | CLOSET |
| 기술 스택 | Next.js, TypeScript, MobX, Emotion.js |
| 개발 기간 | 2021.06 ~ 2021.10 |
| 인원 | 프론트엔드 (담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

SCSS 기반 레거시 인증 플로우를 Emotion.js 기반으로 전면 리뉴얼했다. Sign In/Up, 비밀번호 find/reset/set/change, OAuth 에러 처리, 재가입 차단, 계정 잠금, Open Redirect 보안 취약점 수정까지 인증 전체 범위를 단독으로 담당했다.

**커버 범위**: Sign In / Sign Up / Find·Reset·Set·Change Password / OAuth(Google, 외부 SW) / Email Verify / SSO / 재가입 플로우 / 유료 계정 재가입 방지

---

## 주요 구현

### | 인증 플로우 전체 SCSS → Emotion.js + TypeScript 전환

- **Problem**: 기존 Sign In/Up 컴포넌트들이 SCSS + JavaScript로 구성되어 있어 디자인 토큰 적용과 다크모드 대응이 불가능했다. MobX store의 상태와 에러 핸들링 로직이 컴포넌트 내부에 분산되어 있어 테스트와 재사용이 어려웠다.
- **Solve**: 모든 account 관련 컴포넌트를 Emotion.js 기반으로 마이그레이션하고 TypeScript로 전환. `sign-in.ts`, `sign-up.ts`, `password-setting.ts` MobX store를 독립 분리하고 action/observable을 명확하게 재정의. `AccountContentStyled.tsx`, `SiteMiniFooterLayout.tsx` 등 공통 레이아웃 컴포넌트 신규 생성.
- **Result**: 인증 플로우 전체가 디자인 시스템 기반으로 통일, 상태 관리 코드와 UI 코드의 명확한 분리

---

### | 비밀번호 find / reset / set / change 플로우

- **Problem**: 기존 비밀번호 관련 플로우는 모달 기반으로 동작하고 있었는데, 새 디자인에서는 전용 페이지로 전환해야 했다. 페이지 전환 시 `returnUrl` 파라미터 전달이 모든 진입 경로에서 일관되게 동작해야 했고, 에러 코드별(잘못된 토큰, 만료된 링크 등) 시나리오도 각각 처리해야 했다.
- **Solve**: `redirect.js`의 `redirectReturnUrl` 함수를 통해 `returnUrl` 통일. `PasswordSettingContainer.tsx`로 set/reset/change를 단일 컨테이너로 통합. 에러 코드 enum 정의 후 케이스별 UI 분기.
- **Result**: 비밀번호 관련 모든 시나리오가 단일 컨테이너에서 처리되어 코드 중복 최소화, `returnUrl` 전달 버그 해소

---

### | OAuth Sign In 에러 시나리오 처리

- **Problem**: 외부 SW 계정으로 로그인 시 잘못된 자격증명이나 미등록 계정 등 다양한 에러 케이스에서 UI가 흰 화면으로 멈추거나 잘못된 메시지를 표시하는 문제가 있었다.
- **Solve**: `OAuthSignInErrorModal.tsx` 신규 개발하여 OAuth 로그인 실패 에러 코드별 메시지 표시. `sign-in.ts`에서 에러 응답 provider를 통해 에러 코드를 분류하고 적절한 모달을 트리거.
- **Result**: OAuth 로그인 실패 시 사용자에게 명확한 에러 안내 제공, 흰 화면 멈춤 현상 해소

---

### | 유료 플랜 계정 재가입 방지 (2022.11)

- **Problem**: 이미 유료 플랜을 사용하다 탈퇴한 계정이 동일 이메일로 재가입할 경우, 기존 결제/플랜 데이터와 충돌하는 문제가 있었다. 이메일 중복 확인 API 응답에서 유료 계정 여부를 판단하는 조건이 잘못 처리되어 유료 계정도 재가입 플로우를 진행할 수 있었다.
- **Solve**: 중복 이메일 확인 API 응답의 `paid` 조건을 수정하고, 유료 플랜 계정 재가입 시도 시 별도 안내 플로우로 분기. GA 이벤트 트래커도 해당 시나리오에 추가.
- **Result**: 유료 계정 재가입으로 인한 데이터 충돌 방지

---

### | Account Locked 기능 (2023.07)

- **Problem**: 로그인 실패 횟수 초과 등으로 계정이 잠길 경우 사용자에게 아무 안내 없이 로그인이 막히는 문제가 있었다. 비밀번호 변경·OAuth 로그인 시도·이메일 재인증 배너 등 여러 진입점에서 각각 올바른 안내가 필요했다.
- **Solve**: `AccountLockedErrorModal.tsx` 신규 개발. `OAuthSignInErrorModal.tsx`에 `errorData` 추가하여 계정 잠금 에러 코드 처리. `BannerResendEmail.tsx` 및 `password/setting.tsx`에서도 계정 잠금 상태를 감지해 적절한 안내로 분기.
- **Result**: 계정 잠금 상태에서 모든 진입점에 걸쳐 일관된 안내 제공

---

### | Open Redirect 보안 취약점 수정 (2024.03)

- **Problem**: `authenticator.js`의 `checkDomain` 함수가 `returnUrl` 파라미터 값이 문자열 `"undefined"`일 때 `true`를 반환하는 버그가 있었다. 이로 인해 `returnUrl=undefined`를 담은 악의적인 링크를 통해 임의 도메인으로 리다이렉트가 가능한 Open Redirect 취약점이 존재했다.
- **Solve**: `checkDomain`에서 `returnUrl`이 문자열 `"undefined"`인 경우를 명시적으로 차단. base URL 제거 로직을 수정해 도메인 검증이 올바르게 동작하도록 수정. SW 로그인 리다이렉트 경로도 별도 수정.
- **Result**: Open Redirect 취약점 완전 차단, 인증 흐름의 리다이렉트 보안 강화

---

## 회고

Sign In/Up은 서비스의 첫 진입점이자 보안상 가장 민감한 영역이다. 에러 시나리오를 얼마나 촘촘하게 처리하느냐가 사용자 경험 품질을 결정한다는 것을 배웠다. OAuth 에러·계정 잠금·재가입 차단 등은 정상 플로우에서는 보이지 않지만 실제로는 꽤 많은 사용자가 마주치는 케이스다. 2024년에 발견된 Open Redirect 취약점은 URL 파라미터를 검증할 때 빈 값뿐만 아니라 문자열 `"undefined"·"null"` 같은 예외도 반드시 처리해야 한다는 교훈을 남겼다.
