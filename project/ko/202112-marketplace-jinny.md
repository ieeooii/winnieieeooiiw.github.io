---
thumbnail: /images/projects/202112-connect-jinny-landing-hero.webp
gradient: linear-gradient(135deg, #fce0ea, #f8b8cc)
---

# 피팅 소프트웨어 신규 서비스 소개 랜딩 페이지 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | E-Commerce |
| 서비스 | CONNECT |
| 기술 스택 | Next.js, TypeScript, Emotion.js, Swiper |
| 개발 기간 | 2021.12 |
| 인원 | 프론트엔드 1, 백엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당) |
| 서비스 링크 | [connect.clo-set.com/ko/jinny](https://connect.clo-set.com/ko/jinny) |

## 소개

Jinny 소프트웨어 출시에 맞춰 소개(Introduction)·섹션 리스트·다운로드·채널 영역으로 구성된 서비스 소개 페이지를 개발했다. 메인 배너·상세 이미지 뷰어·연관 아이템 목록 등 여러 영역에서 Swiper가 반복 사용됨을 파악하고, Swiper 기반 공용 컴포넌트를 추출해 재사용 가능하도록 설계했다.

<div class="img-row-3">

![Jinny 랜딩 히어로](/images/projects/202112-connect-jinny-landing-hero.webp)
![Jinny 슬라이더](/images/projects/202112-connect-jinny-slider.webp)
![Jinny 랜딩 푸터](/images/projects/202112-connect-jinny-landing-footer.webp)

</div>

## 주요 구현

### Swiper 공용 컴포넌트 추출과 뷰포트 기반 지연 로딩으로 초기 로딩 최적화
- **Problem**: 자동 재생 루프 배너·다운로드 CTA·유튜브 채널 연동·반응형 UI 등 다양한 인터랙션 요소를 포함해야 했다. 페이지 첫 로드 시 모든 이미지·영상을 한번에 불러와 초기 로딩이 느렸고, 수동으로 슬라이드를 넘길 때 autoPlay 타이머가 reset되지 않아 재생 타이밍이 어긋나는 문제도 있었다.
- **Solve**: 메인 배너 컨테이너를 분리해 Swiper 기반 공용 컴포넌트로 autoPlay + loop 배너를 구현하고, 슬라이드 이벤트 발생 시 타이머를 초기화해 수동 넘김 후 재생 타이밍 문제를 해결했다. 이미지·영상은 `IntersectionObserver`로 뷰포트 진입 시점에만 지연 로드해 초기 로딩 성능을 개선했다. 반응형 분기점을 기준으로 고화질 이미지·영상 교체도 대응했다.
- **Result**: Jinny 출시 일정에 맞춰 배포 완료. 공용화한 Swiper 컴포넌트는 이후 다른 페이지에서도 재사용됨.

### forwardRef와 scrollIntoView로 컨테이너 간 스크롤 내비게이션 구현

- **Problem**: 다운로드 CTA·모드 전환 버튼 등 여러 버튼이 페이지 내 특정 섹션으로 이동해야 했는데, 각 Container 컴포넌트가 독립적으로 분리되어 있어 외부에서 스크롤 대상을 제어하기 어려웠다.
- **Solve**: 페이지 루트에서 각 섹션에 대한 ref를 일괄 관리하고, `scrollIntoView({ behavior: ‘smooth’ })` 핸들러를 각 버튼에 props로 전달. 하위 컨테이너 컴포넌트들은 `forwardRef`로 외부 ref를 수용해 페이지 루트가 스크롤 동작을 단일 지점에서 제어하도록 설계. Emotion `Global` 컴포넌트로 페이지 전용 배경색을 body 레벨에 주입해, 공통 레이아웃을 수정하지 않고 페이지 고유 스타일을 격리 적용.
- **Result**: 스크롤 제어 로직이 페이지 루트에 집중되어 각 컨테이너는 ref 수용만 담당, 레이아웃 컴포넌트 변경 없이 페이지별 스타일 격리 가능

### IntersectionObserver 커스텀 훅으로 가로 스크롤 앵커 양방향 동기화

- **Problem**: 가로 스크롤 영역에서 어떤 항목이 화면 중앙에 위치하는지를 scroll 이벤트 없이 추적하고, 상단 앵커 버튼의 활성 상태와 동기화해야 했다.
- **Solve**: IntersectionObserver를 추상화한 커스텀 훅으로 각 요소에 ref를 부착. 감지 콜백에서 스크롤 컨테이너 중심 좌표와 각 요소 중심 좌표 간 절댓값 차이를 계산해 가장 가까운 항목을 활성 탭으로 업데이트. 반응형 커스텀 훅으로 threshold를 모바일·데스크탑별로 구분 적용. 앵커 버튼 클릭 시 `scrollIntoView({ inline: ‘center’ })`로 버튼 → 스크롤, 스크롤 → 버튼 양방향 연동 완성. 스크롤바는 크로스브라우저 CSS로 숨김 처리.
- **Result**: scroll 이벤트 없이 가로 스크롤 위치를 추적, 버튼과 스크롤 위치 양방향 동기화

### 쿼리 파라미터 보존으로 로그인 후 다운로드 자동 재개

- **Problem**: 소프트웨어 다운로드는 로그인이 필요한데, 비로그인 사용자가 로그인 후 다시 다운로드 버튼을 재클릭해야 하는 UX 단절이 있었다.
- **Solve**: 미로그인 상태의 다운로드 클릭 시, 선택한 OS를 URL 쿼리 파라미터로 보존한 채 로그인 페이지로 리다이렉트. 로그인 완료 후 복귀 시 쿼리 파라미터를 감지하고, 타입 가드로 OS 값을 검증한 뒤 유효한 경우 자동으로 다운로드 재개. 모바일 환경에서는 반응형 커스텀 훅으로 버튼을 비활성화해 데스크탑 전용 소프트웨어임을 UI로 명시.
- **Result**: 로그인 후 다운로드 버튼 재클릭 없이 플로우 자동 복원, 모바일 환경 오작동 방지

### CSS Grid와 next/dynamic으로 반응형 갤러리 구현

- **Problem**: 유저 작품 갤러리는 브레이크포인트별 열 수 조정, 상세 모달 지연 로딩, 로딩 중 레이아웃 안정성을 모두 충족해야 했다.
- **Solve**: 반응형 커스텀 훅으로 브레이크포인트별 노출 아이템 수를 동적으로 결정. CSS Grid로 화면 너비에 따라 열 수가 자동 조정되는 레이아웃 구성. 상세 모달은 `next/dynamic`으로 지연 로드해 초기 번들에서 제외. React Query 로딩 중 스켈레톤 로더를 노출해 레이아웃 흔들림 방지.
- **Result**: 화면 크기별 최적 열 수 자동 적용, 상세 모달 번들 분리, 로딩 중 레이아웃 안정성 확보

### getServerSideProps SSR과 다국어 OG 메타태그로 SEO 대응
- **Problem**: 제품 런칭 시 초기 유입 채널 확보가 필요했다. CSR 구조에서는 크롤러가 JS를 실행하지 않으면 콘텐츠를 인식하지 못하고, SNS 공유 시 OG 메타데이터도 동적으로 적용되지 않는 문제가 있었다.
- **Solve**: `getServerSideProps`로 SSR을 적용해 HTML이 서버에서 완성된 상태로 전달되도록 전환했다. `getServerSideProps` 내에서 Redux Saga를 완전히 소진한 뒤 props를 반환하는 패턴으로 서버에서의 비동기 작업 완료를 보장했다. i18n으로 번역된 title·description을 레이아웃 컴포넌트에 주입해 언어별 OG 메타태그를 대응하고, Sitemap 구성과 HTML 시맨틱 마크업도 정비했다.
- **Result**: 구글 검색 ‘Jinny’ [Link](https://www.google.com/search?q=Jinny&rlz=1C5MACD_enKR1139KR1139&oq=Jin&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIGCAEQRRg5Mg0IAhAAGIMBGLEDGIAEMgwIAxAuGEMYgAQYigUyEwgEEC4YgwEYxwEYsQMY0QMYgAQyBwgFEAAYgAQyDAgGEC4YQxiABBiKBTIGCAcQRRg80gEIMTg2MWowajGoAgCwAgA&sourceid=chrome&ie=UTF-8)

## 회고 / 아쉬웠던 점
- SEO 대응으로 `getServerSideProps`를 통한 SSR을 적용했지만, 요청마다 서버에서 HTML을 생성하는 방식이라 정적 콘텐츠가 대부분인 랜딩 페이지에는 SSG(Static Site Generation)가 더 적합했을 것이다. SSG를 적용했다면 빌드 시점에 HTML을 미리 생성해 크롤링 안정성과 응답 속도 모두 개선할 수 있었을 것이다.
- 컴포넌트 개발 전 재사용 범위를 먼저 파악하고 공용 컴포넌트로 설계한 것은 이후 유지보수 비용을 낮추는 데 효과적이었다.
