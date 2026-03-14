# Design System

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | React, TypeScript, Emotion.js, Storybook, Rollup, tippy.js |
| 개발 기간 | 2021.06 ~ 2024.11 |
| 인원 | 프론트엔드 4 (번들 최적화 단독 주도) / 프론트엔드 (단독 설계·구현) |

## 소개

총 네 단계에 걸쳐 디자인 시스템을 구축하고 발전시켰다. 1단계(2021.06 ~ 2022.08)에서는 중복 컴포넌트로 인한 UX 불일치와 번들 사이즈 문제를 해결하며 번들 사이즈 82% 감소, Lighthouse 95점을 달성했다. 이후 CLOSET 서비스 전용 컴포넌트 추가(2022.03 ~ 2022.12), 사내 디자인 시스템 v1 공통 컴포넌트 제안·설계(2022.07 ~2 024.11), 디자인 시스템 v2 구축(2023.07 ~ 2023.12)까지 전 과정에 기여했다.

## 주요 구현 — 번들 최적화 및 기반 설계 (1단계)

### 번들 최적화
- **Problem**: 디자인 시스템 번들 사이즈 증가로 초기 로딩 속도 저하
- **Solve**: Rollup named exports 기반 코드 분할과 sideEffects: false 설정으로 tree-shaking을 활성화해 실제 사용하는 컴포넌트만 번들에 포함되도록 구성했습니다. ESM 포맷 변
환·Rollup externals로 React·Emotion 등 중복 번들링을 제거하고, Emotion.js를 peerDependencies로 전환해 애플리케이션 레벨 단일 인스턴스로 관리되도록 구조를 개선했습니다. bundle analyzer로 최적화 전후를 측정해 번들 사이즈 82% 감소를 검증했습니다 
- **Result**: 디자인 시스템 번들 사이즈 82% 감소 (Client: 2.55MB → 72.66KB / Node.js: 2.54MB → 126.01KB). 초기 JS 로드 사이즈 398KB → 185KB 개선. Lighthouse 성능 점수 95점 달성.

### 컴포넌트 설계 패턴
- **Solve**: Headless 컴포넌트 기반으로 서비스별 스타일 확장 가능한 구조 설계. Compound Component 패턴으로 유연한 합성 구조 구현. 폼 컴포넌트 Controlled·Uncontrolled 모두 지원.

### 디자인 토큰 시스템 구축
- **Solve**: Design Token 기반 공통 스타일 시스템 설계로 디자이너와 개발자 간 색상·타이포그래피 불일치 최소화.

## 주요 구현 — 서비스 전용 컴포넌트 (2단계)

### Tooltip.tsx / TooltipMenu.tsx
- **Problem**: 서비스 전반에 Tooltip이 필요했는데, 기존에는 각 컴포넌트가 `tippy.js`를 직접 import하거나 제각각의 방식으로 tooltip을 구현하고 있었다. `@tippyjs/react`는 `visible` prop과 `trigger` prop을 동시에 사용할 수 없다는 제약이 있었다.
- **Solve**: `BaseTooltip.tsx`를 기반 레이어로 먼저 설계하고, 그 위에 `Tooltip`(일반 툴팁)과 `TooltipMenu`(메뉴 형태) 두 가지 변형을 구현. controlled/uncontrolled 모드는 `visible` prop 존재 여부에 따라 내부에서 자동 분기. `fixedPosition`·`showShadow`·`zIndex`·`TextButton` 등 서비스에서 실제로 필요한 옵션을 props로 노출. Storybook MDX 문서화 작성.
- **Result**: 서비스 전체에서 일관된 Tooltip UX 제공, 중복 tippy.js 직접 사용 제거

### PickerFrame.tsx / PickerDropdown.tsx
- **Problem**: `FilterCategory.tsx` 등 드롭다운 선택 UI가 필요한 컴포넌트마다 드롭다운 열림/닫힘 상태·위치 계산·외부 클릭 감지를 각자 구현하고 있어 코드 중복이 심했다. 드롭다운이 hidden 상태일 때 `display: none`이 아닌 다른 방식으로 숨겨야 했다(레이아웃 재계산 방지 목적).
- **Solve**: `PickerFrame.tsx`(드롭다운 컨테이너)와 `PickerDropdown.tsx`(드롭다운 패널)를 분리 설계. hidden 상태에서 `width: 0` 처리로 레이아웃 영향 없이 숨김 구현. `FilterCategory.tsx`를 이 컴포넌트 기반으로 마이그레이션하고 공통 스타일을 `shared/styles/select.ts`로 추출.
- **Result**: 드롭다운 관련 로직 중앙화, 이후 신규 Select 계열 컴포넌트 추가 시 PickerFrame 위에 쌓는 방식으로 개발 속도 향상

### Thumbnail.tsx (Lazy Load + ratio)
- **Problem**: 콘텐츠 목록·Line Sheet 썸네일 등 서비스 전반에서 썸네일 이미지를 사용하는데, 각 사용처마다 lazy load 로직과 비율(ratio) 처리를 따로 구현하고 있었다. 이미지가 로드되기 전 빈 공간이 레이아웃 시프트를 일으키는 문제도 있었다.
- **Solve**: `useBackgroundImageLazyLoad.ts` 커스텀 훅 개발 후 `Thumbnail.tsx`에 내장. `ratio` prop으로 `aspect-ratio` CSS를 동적 적용. 이미지 로드 전 `blankContent` 타입으로 스켈레톤 표시. Line Sheet의 `LineSheetThumbnailImage.tsx`에서 즉시 활용.
- **Result**: 이미지 lazy load와 레이아웃 시프트 방지를 한 컴포넌트에서 처리, 중복 구현 제거

### 아이콘 컴포넌트 추가
서비스 전용 아이콘(`ExcelLineSheetIcon`, `ColorwayIcon`, `InfoTextIcon`, `ChangeOrderIcon`, `HandleOrderIcon`, `SortUpListIcon`, `SortDownListIcon`, `CopyIcon`, `QRIcon`, `UmmIcon` 등)을 디자인 시스템에 추가. SVG 컴포넌트화하여 `size`·`color` props로 제어 가능하게 설계.

## 공통 컴포넌트 (3단계)

### Skeleton 컴포넌트 (2022.07 ~ 2022.09)
로딩 상태에서 빈 화면이나 단순 spinner를 보여주는 방식이 사용자 경험에 좋지 않다고 판단해 직접 제안한 작업이다.
- **Problem**: Skeleton 컴포넌트가 전무하여 로딩 상태를 빈 화면 또는 spinner로만 처리하고 있었다.
- **Solve**: `BaseSkeleton.tsx`를 기반으로 Headless UI 구조 설계. `shape(rectangle/circle)`, `variant`, `animation(wave/pulse/false)` props를 조합하는 방식으로 확장 가능한 구조 구현. `:empty` CSS selector로 `undefined`, `null`, `boolean`일 경우 스켈레톤 UI 자동 노출. Context Provider로 특정 영역 단위 animation 기본값 일괄 제어.
- **Result**: clo-set, connect 서비스에 실제 적용. 이후 다양한 Skeleton 요구사항에 구조 변경 없이 대응 가능.

### FileExtension 컴포넌트 (2022.08 ~ 2022.09)
- **Problem**: 파일 확장자 표시를 각 서비스에서 각자 구현하고 있어 표현이 제각각이었다. `clo3dExtensionList` 유틸이 컴포넌트별로 분산 관리되어 정책 불일치가 발생했다.
- **Solve**: `FileExtension.tsx` 컴포넌트 신규 개발. 확장자 타입 분류·아이콘 매핑·`isNotSupported` prop으로 미지원 포맷 fallback 처리. `utils.ts`와 `types.ts`를 정리하여 확장자 목록을 단일 소스로 통합. `.hpos`, `.zth` 등 신규 CLO3D 확장자 추가 시에도 한 곳만 수정하도록 구조화.
- **Result**: 서비스 전반에서 파일 확장자 표현 일관성 확보. 신규 확장자 추가 시 누락 방지.

### Thumbnail 컴포넌트 개선 (2022.08 ~ 2023.03)
- **Problem**: 이미지 렌더링과 아이콘 렌더링 로직이 `Thumbnail.tsx` 하나에 혼재되어 유지보수가 어려웠다. virtual window 구현 시 뷰포트 밖에 있는 Thumbnail 이미지까지 즉시 로드되어 불필요한 네트워크 요청이 발생했다.
- **Solve**: `ThumbnailInnerImage.tsx`(외부 이미지)·`ThumbnailInnerIcon.tsx`(SVG 아이콘)·`ThumbnailInner.tsx`로 역할 분리. `lazyLoad` prop 추가하여 virtual window와 함께 사용 시 뷰포트 진입 시점에 이미지 로드.
- **Result**: 각 내부 컴포넌트 독립적으로 수정 가능. 불필요한 이미지 로드 제거로 성능 개선.

### ConfigProvider — 디자인 시스템 다국어 지원 (2022.10 ~ 2022.12)
roblem**: 컴포넌트 내부 텍스트가 하드코딩되어 다국어 서비스 적용 불가. i18n 라이브러리 직접 내장 시 각 앱의 의존성과 충돌 우려.
- **Solve**: React Context 기반 `ConfigProvider` 설계. 각 앱이 원하는 i18n 솔루션으로 번역된 텍스트를 Provider에 주입하면 하위 컴포넌트에서 사용하는 구조. 이후 스페인어·일본어·포르투갈어 지원 확장 시 `locales.ts` 수정만으로 대응.
- **Result**: 앱이 자체 i18n 솔루션을 자유롭게 유지하면서 디자인 시스템 컴포넌트 텍스트 커스터마이징 가능. 초기 설계의 확장 구조 덕분에 언어 추가 비용 최소화.

### CLOSET Brand Logo SVG 컴포넌트 (2024.11)
- **Problem**: 이미지 파일 기반 로고는 CSS로 색상 변경이 불가해 다크모드 대응이 각 서비스마다 제각각이었다. 각 서비스가 로고 이미지 파일을 따로 관리하고 있었다.
- **Solve**: `CLOSETEmblem.tsx`·`CLOSETLogo.tsx` SVG 컴포넌트로 개발. `variant`·`opacity`·`id` 등 커스터마이징 props 지원. 레거시 `ClosetBIIcon.tsx` 제거.
- **Result**: 다크모드 포함 브랜드 표현의 일관성 확보. 서비스에서 이미지 파일 개별 관리 불필요.

## 주요 구현 — CLO-SET v3 디자인 시스템 v2 (4단계)
**구현 컴포넌트**: Badge 계열(BadgeDot/BadgeIcon/BadgeImage/BadgeCounter/BadgeLabel/BadgeMarker) / BasePopover / IconButton·IconToggle / Thumbnail·FileExtension / BreadCrumbs / ColorwaySelect / MenuListItem / BaseDropdown 등

### Badge 계열 컴포넌트
- **Problem**: 뱃지가 위치/콘텐츠 타입에 따라 서로 다른 컴포넌트로 분산되어 있어 일관성이 없었다.
- **Solve**: BadgeDot/Icon/Image/Counter/Label/Marker를 단일 네이밍 규칙 아래 통일된 props 구조로 구현.
- **Result**: 디자이너-개발자 커뮤니케이션 비용 감소, 신규 뱃지 타입 추가 시 패턴 재사용 가능.

### IconToggle `disabledIcon` 버그 수정
- **Problem**: `disabled` 상태에서 `disabledIcon`이 렌더되지 않고 기본 아이콘이 출력되는 버그 발생.
- **Solve**: 조건부 렌더 로직의 우선순위를 수정해 `disabled` prop이 `disabledIcon` 존재 여부를 먼저 확인하도록 변경.
- **Result**: 전체 DS 사용처에서 disabled 상태 아이콘이 올바르게 표시됨.

### `ColorwaySelect` 화살표 & `BaseDropdown` activeIndex 버그
- **Problem**: 드롭다운 열림 상태에서 화살표 아이콘 방향이 반전되지 않고, activeIndex가 외부 state와 동기화되지 않는 문제가 있었다.
- **Solve**: 아이콘 회전 CSS transform 조건을 isOpen 상태와 연결하고, activeIndex를 controlled/uncontrolled 양쪽에서 동작하도록 수정.
- **Result**: 드롭다운 UX 일관성 확보.

## 회고

- 브랜치 전략을 stable·release·develop 3단계로 구성했으나, 컴포넌트 수가 40-50개로 많아지면서 단일 develop 브랜치 관리에 한계. 컴포넌트별 독립 브랜치로 구성했다면 로컬 테스트와 버전 관리가 더 용이했을 것으로 판단.
- 디자인 시스템 컴포넌트 작업을 반복하면서 "컴포넌트 사용자를 위한 API 설계"가 구현 자체만큼 중요하다는 것을 배웠다. 특히 ConfigProvider처럼 의존성 충돌을 피하면서 확장성을 확보하는 설계는, 초기에 올바른 패턴을 잡아두면 이후 언어 추가 시 내부만 수정하면 되는 구조를 만들어준다.
- 컴포넌트 설계 초반에 Base 추상화 레벨을 어디까지 잡을지 팀 내 논의가 많았다. 실제 사용 패턴을 먼저 파악하고 컴포넌트를 역방향으로 설계하는 방식이 더 효과적이라는 것을 배웠다.
- Storybook 문서화를 함께 작성하는 과정이 컴포넌트의 엣지 케이스를 미리 발견하는 데도 도움이 됐다.
