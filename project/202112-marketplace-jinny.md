# B2C - Jinny 3D 피팅 소프트웨어 소개 랜딩 페이지 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 서비스 | CONNECT |
| 기술 스택 | Next.js, TypeScript, Emotion.js, Swiper |
| 개발 기간 | 2021.12 |
| 인원 | 프론트엔드 1, 백엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당) |
| 서비스 링크 | https://connect.clo-set.com/ko/jinny |

## 소개

Jinny 소프트웨어 출시에 맞춰 소개(Introduction)·섹션 리스트·다운로드·채널 영역으로 구성된 서비스 소개 페이지를 개발했다. 메인 배너·상세 이미지 뷰어·연관 아이템 목록 등 여러 영역에서 Swiper가 반복 사용됨을 파악하고, `CarouselSwiper`, `BaseSwiperNavigation`, `SwiperNavigation`을 공용 컴포넌트로 추출해 재사용 가능하도록 설계했다.

## 주요 구현

### Jinny 페이지 UI 및 API 연동
- **Problem**: 자동 재생 루프 배너·다운로드 CTA·유튜브 채널 연동·반응형 UI 등 다양한 인터랙션 요소를 포함해야 했다. 페이지 첫 로드 시 모든 이미지·영상을 한번에 불러와 초기 로딩이 느렸고, 수동으로 슬라이드를 넘길 때 autoPlay 타이머가 reset되지 않아 재생 타이밍이 어긋나는 문제도 있었다. CSR 방식으로 구현되어 검색엔진 크롤러가 페이지 콘텐츠를 제대로 인식하지 못했고, SNS 공유 시 OG 메타데이터가 동적으로 적용되지 않는 SEO 문제가 있었다.
- **Solve**: `MainBannerContainer`를 분리해 CarouselSwiper 기반 autoPlay + loop 배너를 구현하고, 슬라이드 이벤트 발생 시 타이머를 초기화해 수동 넘김 후 재생 타이밍 문제를 해결했다. 이미지·영상은 `IntersectionObserver`를 직접 구현해 뷰포트 진입 시점에만 로드하도록 처리해 초기 로딩 성능을 개선. `JinnyDownload.tsx`에 jinnyApi 연동 및 비로그인 시 로그인 페이지 리다이렉트 처리를 추가. 768px 반응형 UI와 고화질 이미지·영상 교체도 대응.
- **Result**: Jinny 출시 일정에 맞춰 배포 완료. 공용화한 CarouselSwiper는 이후 다른 페이지에서도 재사용됨.

### SEO 최적화
- **Problem**: 제품 런칭 시 초기 유입 채널 확보
- **Solve**: Sitemap 구성, HTML 시맨틱 구조 정비하고 SSR을 적용하여 검색 엔진 인덱싱 및 초기 유입 채널 확보
- **Result**: 구글 검색 ‘Jinny’ [Link](https://www.google.com/search?q=Jinny&rlz=1C5MACD_enKR1139KR1139&oq=Jin&gs_lcrp=EgZjaHJvbWUqDggAEEUYJxg7GIAEGIoFMg4IABBFGCcYOxiABBiKBTIGCAEQRRg5Mg0IAhAAGIMBGLEDGIAEMgwIAxAuGEMYgAQYigUyEwgEEC4YgwEYxwEYsQMY0QMYgAQyBwgFEAAYgAQyDAgGEC4YQxiABBiKBTIGCAcQRRg80gEIMTg2MWowajGoAgCwAgA&sourceid=chrome&ie=UTF-8)

## 회고 / 아쉬웠던 점
- SEO 문제는 `next/head`로 메타태그를 넣는 방식으로 부분 대응했지만, CSR 구조의 근본적인 한계로 완전한 해결은 어려웠다. SSG(Static Site Generation)를 적용했다면 HTML을 미리 생성해 크롤러가 콘텐츠를 정상 인식할 수 있었고, 페이지별 OG 메타데이터도 안정적으로 제공할 수 있었을 것이다.
- 컴포넌트 개발 전 재사용 범위를 먼저 파악하고 공용 컴포넌트로 설계한 것은 이후 유지보수 비용을 낮추는 데 효과적이었다.
