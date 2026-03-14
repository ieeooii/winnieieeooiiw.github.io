# B2B 서비스 소개 & 법적 문서 페이지 개발 (About Us / Privacy Policy)

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, SCSS, MobX |
| 개발 기간 | 2020.03 ~ 2020.04 |
| 인원 | 프론트엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당) |
| 서비스 링크 | style.clo-set.com/aboutus |

## 소개

CLO Virtual Fashion의 기업의 B2B 서비스 소개(About Us)·지원(Support)·개인정보처리방침(Privacy Policy)·이용약관(Terms of Service) 등 마케팅·법적 목적의 정적 페이지들을 개발했다. 인증 없이 외부 방문자가 접근하는 페이지라 SEO·크로스 디바이스 레이아웃·퍼포먼스가 핵심 고려사항이었다.

---

## 주요 구현

### | About Us 스크롤 애니메이션 및 크로스 디바이스 대응

- **Problem**: About Us 페이지에서 사용자가 스크롤하면 뷰포트 안으로 들어오는 섹션의 비디오가 자동 재생되는 인터랙션이 요구됐다. 당시 IntersectionObserver API의 브라우저 지원이 불완전했다. 모바일(갤럭시 Android Chrome)·태블릿(아이패드 Safari)·데스크톱(Chrome/Firefox/Safari)에서 레이아웃이 다르게 깨지는 문제가 다수 발견됐다.
- **Solve**: `scrollMonitor` 라이브러리로 스크롤 구간을 감지하여 비디오 재생·정지를 제어하는 `ScrollVideoContainer.tsx`를 개발. CSS `transition`과 opacity를 조합하여 부드러운 페이드인 애니메이션 구현. 아이패드 Safari에서 `100vh`가 주소창 포함 높이로 계산되는 문제는 `window.innerHeight`를 직접 참조하는 CSS 커스텀 프로퍼티로 해결. 갤럭시 기기에서 Flexbox gap 미지원으로 레이아웃이 붕괴되는 문제는 margin 기반으로 대체 처리.
- **Result**: 전 해상도(모바일/태블릿/데스크톱)에서 일관된 레이아웃, 스크롤 연동 비디오 애니메이션 정상 동작

---

### | 단색 배경 영상 기기별 색상 편차 문제 대응
- **Problems**: 단색 배경의 영상을 사용할 시 각 디스플레이마다 발생하는 색상 편차 문제
- **Solve**: `canvas`를 활용해 단색 영상의 배경색을 추출해 색상 편차 문제를 해결 [참고자료 Link](https://sansho.studio/blog/html-videos-correct-background-color)
- **Result**: 전 해상도(모바일/태블릿/데스크톱)에서 일관된 레이아웃, 스크롤 연동 비디오 애니메이션 정상 동작

---

### | Privacy Policy / Terms of Service 다국어 법률 문서 구조화

- **Problem**: GDPR 등 지역별 법규 요구사항에 맞게 Privacy Policy와 Terms of Service를 6개 언어로 제공해야 했다. 법률 문서는 내용이 길고 섹션이 많으며(이용약관 15개 섹션), 각 언어별로 문서 길이와 포맷이 달랐다. 하나의 파일에 전체 내용을 넣으면 번들 크기가 과도하게 커지고 유지보수가 어렵다는 문제가 있었다.
- **Solve**: `TermsOfServicePartOne.tsx` ~ `TermsOfServicePartFifteen.tsx`로 섹션별 컴포넌트 분리. i18next 기반 다국어 텍스트 분리로 언어별 독립 관리 가능하게 구성. 각 섹션 컴포넌트는 `dynamic import`로 필요 시점에만 로드.
- **Result**: 15개 섹션 × 6개 언어 문서 구조화 완료, 섹션 단위 독립 수정 가능

---

## 회고 / 아쉬웠던 점
정적 페이지라고 해서 기술적 난이도가 낮은 것은 아니다. 특히 크로스 디바이스 대응은 "내 환경에서 잘 보인다"는 것이 의미 없는 영역이다. iOS Safari의 `100vh` 문제나 Android Chrome의 Flexbox 호환성 차이처럼 환경별 브라우저 렌더링 차이를 사전에 파악하고 defensive하게 작성하는 습관을 이 작업에서 기르게 됐다.
