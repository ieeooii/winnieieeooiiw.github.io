---
thumbnail: /images/projects/202003-about-us-video-color-after.webp
gradient: linear-gradient(135deg, #b3f0ee, #60ddd8)
---

# 기업 소개 & 법적 문서 페이지 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, SCSS, MobX |
| 개발 기간 | 2020.03 ~ 2020.04 |
| 인원 | 프론트엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당) |
| 서비스 링크 | [style.clo-set.com/aboutus](https://style.clo-set.com/aboutus) |

## 소개

CLO Virtual Fashion의 기업의 B2B 서비스 소개(About Us)·지원(Support)·개인정보처리방침(Privacy Policy)·이용약관(Terms of Service) 등 마케팅·법적 목적의 정적 페이지들을 개발했다. 인증 없이 외부 방문자가 접근하는 페이지라 SEO·크로스 디바이스 레이아웃·퍼포먼스가 핵심 고려사항이었다.

<div class="img-row-3">

![반응형 — PC](/images/projects/202003-about-us-responsive-pc.webp)
![반응형 — 태블릿](/images/projects/202003-about-us-responsive-tablet.webp)
![반응형 — 모바일](/images/projects/202003-about-us-responsive-mobile.webp)

</div>

<div class="img-row-2">

![영상 단색 배경 색상 편차 수정 전](/images/projects/202003-about-us-video-color-before.webp)
![영상 단색 배경 색상 편차 수정 후](/images/projects/202003-about-us-video-color-after.webp)

</div>

<div class="img-row-2">

![Query string id 기반 스크롤 — 클릭 전](/images/projects/202003-about-us-querystring-before.webp)
![Query string id 기반 스크롤 — 클릭 후 (?id=application)](/images/projects/202003-about-us-querystring-after.webp)

</div>

![Privacy Policy 페이지](/images/projects/202003-tos-privacy.webp)

## 주요 구현

### 스크롤 감지 비디오 연동과 iOS Safari · Android Chrome 크로스 브라우저 대응
- **Problem**: About Us 페이지에서 사용자가 스크롤하면 뷰포트 안으로 들어오는 섹션의 비디오가 자동 재생되는 인터랙션이 요구됐다. 당시 IntersectionObserver API의 브라우저 지원이 불완전했다. 모바일(갤럭시 Android Chrome)·태블릿(아이패드 Safari)·데스크톱(Chrome/Firefox/Safari)에서 레이아웃이 다르게 깨지는 문제가 다수 발견됐다.
- **Solve**: `scrollMonitor` 라이브러리로 스크롤 구간을 감지하여 비디오 재생·정지를 제어하는 컴포넌트를 개발. CSS `transition`과 opacity를 조합하여 부드러운 페이드인 애니메이션 구현. 아이패드 Safari에서 `100vh`가 주소창 포함 높이로 계산되는 문제는 `window.innerHeight`를 직접 참조하는 CSS 커스텀 프로퍼티로 해결. 갤럭시 기기에서 Flexbox gap 미지원으로 레이아웃이 붕괴되는 문제는 margin 기반으로 대체 처리.
- **Result**: 전 해상도(모바일/태블릿/데스크톱)에서 일관된 레이아웃, 스크롤 연동 비디오 애니메이션 정상 동작

### Canvas로 영상 배경색을 추출해 디스플레이 색상 편차 보정
- **Problem**: 단색 배경 영상을 사용할 때 디스플레이마다 색상 편차가 발생해 배경과 영상 경계가 어색하게 보이는 문제가 있었다.
- **Solve**: Canvas API로 영상의 단색 배경색을 직접 추출하고, 추출한 색상을 영상 컨테이너 배경에 동적으로 적용해 경계 색상을 일치시켰다.
- **Result**: 디스플레이 종류와 무관하게 영상 배경색 편차 해소

### User Agent 기반 기기 판별로 해상도별 최적 영상 소스 분기
- **Problem**: About Us 페이지에서 사용하는 배경 영상의 용량이 너무 커 전 기기에 동일한 파일을 제공하기 어려웠다. 모바일 기기에서도 데스크톱용 고화질 영상을 내려받아 불필요한 네트워크 비용과 로딩 지연이 발생했다.
- **Solve**: 실제 사용 기기 분포를 모니터링한 뒤 해상도 구간별(모바일 / 태블릿 / 데스크톱)로 각기 다른 크기의 영상 파일을 준비하고, User Agent를 기반으로 접속 기기 유형(모바일 / 태블릿 / 데스크톱)을 판별하여 적합한 영상 소스를 선택해 제공하도록 구현.
- **Result**: 기기별 불필요한 영상 다운로드 제거, 모바일 환경에서 로딩 성능 개선

### dynamic import + 섹션 컴포넌트 분리로 법률 문서 번들 최적화
- **Problem**: GDPR 등 지역별 법규 요구사항에 맞게 Privacy Policy와 Terms of Service를 6개 언어로 제공해야 했다. 법률 문서는 내용이 길고 섹션이 많으며(이용약관 15개 섹션), 각 언어별로 문서 길이와 포맷이 달랐다. 하나의 파일에 전체 내용을 넣으면 번들 크기가 과도하게 커지고 유지보수가 어렵다는 문제가 있었다.
- **Solve**: 섹션별로 컴포넌트를 분리하고 `dynamic import`로 필요 시점에만 로드. i18next 기반으로 다국어 텍스트를 분리해 언어별 독립 관리.
- **Result**: 15개 섹션 × 6개 언어 문서 구조화 완료, 섹션 단위 독립 수정 가능

## 회고 / 아쉬웠던 점

정적 페이지라고 해서 기술적 난이도가 낮은 것은 아니다. 특히 크로스 디바이스 대응은 "내 환경에서 잘 보인다"는 것이 의미 없는 영역이다. iOS Safari의 `100vh` 문제나 Android Chrome의 Flexbox 호환성 차이처럼 환경별 브라우저 렌더링 차이를 사전에 파악하고 defensive하게 작성하는 습관을 이 작업에서 기르게 됐다.
