---
thumbnail: /images/projects/202603-portfolio-site-home.webp
gradient: linear-gradient(135deg, #ddf5e8, #a9e8c9)
---

# 포트폴리오 사이트 — 마크다운 기반 콘텐츠 파이프라인

| 항목 | 내용 |
|------|------|
| 카테고리 | Side Project |
| 서비스 | portfolio.ieeooii.com |
| 기술 스택 | React 19, TypeScript, Vite 7, Vanilla Extract, wouter, react-markdown, GitHub Actions, GitHub Pages, AWS Route 53 |
| 개발 기간 | 2026.03 ~ 진행 중 |
| 인원 | 프론트엔드 1 (개인) |
| 서비스 링크 | [portfolio.ieeooii.com](https://portfolio.ieeooii.com) |

## 프로젝트 목적

지금 보고 계신 이 사이트다. 단순히 "만들어진 포트폴리오"가 아니라, **프로젝트가 쌓일수록 관리 비용이 늘지 않는 구조**를 목표로 설계했다. 30개가 넘는 프로젝트 write-up을 코드 수정 없이 마크다운 파일 추가만으로 게시할 수 있는 콘텐츠 파이프라인, 한/영 이중 언어, 제로 런타임 스타일링을 직접 구축했다.

<div class="img-row-1 img-border">

![홈 — 타이핑 애니메이션 히어로](/images/projects/202603-portfolio-site-home.webp)

</div>

## 주요 기능

<div class="img-row-2 img-border">

![프로젝트 목록 — 카테고리 필터와 검색](/images/projects/202603-portfolio-site-projects.webp)
![모바일 반응형](/images/projects/202603-portfolio-site-mobile.webp)

</div>

- **프로젝트 갤러리** — 카테고리 필터(SaaS·E-Commerce·Internal Tool 등), 제목·기술 스택·회사 통합 검색, 썸네일 없는 프로젝트는 gradient 폴백
- **프로젝트 상세** — 마크다운 원문을 react-markdown(remark-gfm + rehype-raw)으로 렌더링, 이미지 행 레이아웃 지원
- **한/영 전환 · 다크 모드** — 헤더 토글로 즉시 전환, 선호 설정 유지
- **인터랙션** — 타이핑 애니메이션 히어로, 스크롤 연동 내비게이션

## 주요 구현

### 마크다운 기반 콘텐츠 파이프라인

- **Problem**: 프로젝트를 추가할 때마다 컴포넌트나 데이터 파일을 수정해야 하면, write-up이 30개를 넘는 순간 유지보수가 콘텐츠 작성보다 비싸진다. CMS나 SSG 프레임워크를 도입하기엔 정적 SPA 하나에 과한 의존성이었다.
- **Solve**: `project/ko/`, `project/en/`에 `YYYYMM-slug.md` 규칙으로 파일을 두고, Vite의 `import.meta.glob(?raw)`로 빌드 타임에 전량 수집. frontmatter(썸네일·gradient)와 마크다운 메타데이터 테이블(회사·카테고리·기간·스택)을 경량 파서로 직접 추출해 목록 카드와 필터에 쓰고, 파싱 결과는 언어별로 캐시해 재방문 시 재파싱을 없앴다. 정렬은 기간 문자열에서 종료 시점을 파싱해 최신순으로 자동 처리한다.
- **Result**: 프로젝트 추가 = 마크다운 2개 + 이미지 커밋으로 끝. 코드 변경 0줄, 별도 CMS·빌드 플러그인 의존성 0개

### 이중 언어 i18n — 폴백까지 설계

- **Problem**: UI 문구와 프로젝트 본문을 모두 한/영으로 제공하되, 번역이 아직 없는 콘텐츠 때문에 화면이 깨지면 안 됐다.
- **Solve**: UI 문구는 타입이 강제되는 번역 객체(`ko.ts`/`en.ts`)와 Context 기반 `useLanguage` 훅으로 관리해 키 누락을 컴파일 타임에 차단. 프로젝트 본문은 ko 파일 목록을 기준으로 en 경로를 유도하고, 영어 파일이 없으면 한국어 원문으로 폴백해 목록·상세가 항상 렌더링되도록 했다.
- **Result**: 언어 전환 시 누락 없는 화면 보장, 번역은 파일이 준비되는 대로 점진적으로 추가 가능

### 제로 런타임 스타일링 — Vanilla Extract

- **Problem**: 다크 모드와 테마 토큰이 필요했지만, 콘텐츠 중심 정적 사이트에서 런타임 CSS-in-JS의 JS 비용을 지불하고 싶지 않았다.
- **Solve**: Vanilla Extract(`*.css.ts`)로 스타일을 타입 안전하게 작성하되 빌드 타임에 정적 CSS로 추출. 색상·간격을 테마 토큰으로 정의하고 다크 모드는 클래스 스위칭으로 전환해 런타임 스타일 계산이 없다.
- **Result**: CSS-in-JS의 DX(타입 검사·코로케이션)는 유지하면서 런타임 오버헤드 0

### GitHub Pages SPA 라우팅

- **Problem**: GitHub Pages는 서버 리라이트를 지원하지 않아, history 기반 SPA 라우팅은 상세 페이지에서 새로고침하면 404가 된다.
- **Solve**: wouter의 `useHashLocation`으로 해시 기반 라우팅(`/#/projects/:id`)을 채택. 모든 경로가 단일 `index.html`로 해석되므로 404 fallback 트릭 없이 직접 접근·새로고침·공유 링크가 전부 동작한다.
- **Result**: 별도 서버 설정 없이 정적 호스팅에서 전체 라우트 안정 동작

### GitHub Actions CI/CD — 푸시가 곧 배포

- **Problem**: 로컬에서 빌드해 산출물을 수동 배포하는 방식은 커밋과 배포 상태가 어긋날 수 있고, 타입 오류가 섞인 빌드가 그대로 올라갈 위험이 있다.
- **Solve**: 배포 브랜치 푸시를 트리거로 GitHub Actions 파이프라인을 구성. `pnpm install --frozen-lockfile` → 타입 체크 포함 빌드(`tsc -b && vite build`) → Pages 아티팩트 업로드 → 공식 `deploy-pages` 액션으로 배포한다. 토큰 발급 없이 OIDC(`id-token`) 권한으로 인증하고, `concurrency`로 연속 푸시 시 이전 배포를 취소해 항상 최신 커밋만 반영한다.
- **Result**: 마크다운 커밋 → 푸시만으로 몇 분 내 자동 게시. 타입 체크를 통과한 빌드만 배포되고, 배포 이력이 커밋 단위로 추적 가능

### 커스텀 도메인 — Route 53 서브도메인 체계

- **Problem**: 기본 제공되는 `*.github.io` 도메인은 브랜딩이 약하고, 앞으로 만들 사이드 서비스들을 각각 도메인을 새로 사지 않고 하나의 도메인 아래에서 운영하고 싶었다.
- **Solve**: 도메인 등록(레지스트라)과 DNS 호스팅(호스팅 존)은 별개 서비스지만, 관리 지점을 하나로 모으기 위해 둘 다 AWS Route 53으로 구성했다. 루트 도메인(`ieeooii.com`)을 구매하고 호스팅 존을 생성한 뒤, `portfolio.ieeooii.com` 서브도메인에 CNAME 레코드로 GitHub Pages를 연결. 커스텀 도메인 검증 후 Let's Encrypt 인증서 자동 프로비저닝과 HTTPS 강제를 적용했다. 서비스별 서브도메인 전략이라 새 서비스가 생기면 레코드 추가만으로 같은 도메인 체계에 편입된다.
- **Result**: `portfolio.ieeooii.com`으로 HTTPS 서빙. 도메인 1개 비용으로 서비스 수만큼 확장 가능한 네이밍 체계 확보
- **Insight**: 방문자가 접속하면 **이름 해석까지만 Route 53**이 담당하고(CNAME → GitHub Pages), 실제 트래픽·콘텐츠 서빙·인증서 갱신은 GitHub Pages가 처리한다. DNS와 호스팅의 책임 경계를 나눠두면, 이후 특정 서브도메인만 다른 호스팅(예: Vercel, S3+CloudFront)으로 옮겨도 레코드 하나만 바꾸면 된다.

### AI 워크플로우로 콘텐츠 추가 자동화

- **Problem**: 프로젝트 write-up 추가는 한/영 파일 생성, 메타데이터 테이블, 이미지 변환·배치 등 반복 규칙이 많아 수작업 실수가 잦았다.
- **Solve**: 파일명 규칙·마크다운 템플릿·이미지 레이아웃 규칙을 Claude Code 스킬(`add-project`)로 문서화해, "프로젝트 추가해줘" 한 마디로 한/영 파일 생성부터 스크린샷 webp 변환·최적화까지 일관되게 수행되도록 했다.
- **Result**: 콘텐츠 추가 작업이 규칙 기반으로 재현 가능해지고, 형식 편차 제거

## 회고 / 아쉬웠던 점

콘텐츠와 코드를 분리한 선택이 가장 효과가 컸다 — write-up을 다듬는 일과 사이트를 개선하는 일이 서로를 막지 않는다. 반면 frontmatter·테이블 파서를 직접 작성한 만큼 마크다운 형식이 암묵적 스키마가 되었는데, 형식이 어긋난 파일을 빌드 타임에 검증하는 장치는 아직 없다. 콘텐츠가 더 늘어나면 스키마 검증 스크립트를 CI에 추가할 계획이다.
