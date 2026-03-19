# CLO-SET 고객 지원 헬프센터 구축 — Zendesk Guide 커스텀 테마

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET Help Center |
| 기술 스택 | Zendesk Guide, Handlebars.js, HTML, CSS, JavaScript |
| 개발 기간 | 2020.03 ~ 2020.05 |
| 인원 | 프론트엔드 (담당) |
| 서비스 링크 | support.clo-set.com |

## 소개

CLO-SET의 글로벌 고객을 위한 셀프서비스 헬프센터를 Zendesk Guide 기반으로 구축하고, CLO-SET 브랜드 아이덴티티에 맞는 커스텀 테마를 설계·구현했다. Zendesk가 제공하는 기본 Copenhagen 테마를 전면 커스터마이징하여, Getting Started · Feature Manual · CLO-SET News · FAQ 카테고리 구조와 히어로 검색 UI를 갖춘 헬프센터를 제공했다. 전 세계 패션 브랜드 고객이 CLO-SET 사용법을 스스로 해결할 수 있는 1차 지원 채널로 운영됐다.

## 주요 구현

### 브랜드 전용 커스텀 테마 설계
- **Problem**: Zendesk 기본 테마는 제네릭한 디자인으로 CLO-SET의 브랜드 아이덴티티(다크 헤더, 티파니 그린 계열 포인트 컬러, 3D 패션 이미지 배경)를 표현하기 어려웠다. 또한 Zendesk Guide의 Handlebars 기반 템플릿 구조와 CSS 변수 커스터마이징 범위를 사전에 파악해야 했다.
- **Solve**: Zendesk Guide Theming API의 `manifest.json`을 통해 커스터마이징 가능한 변수(색상·폰트·레이아웃)를 정의하고, Handlebars 템플릿(`home_page.hbs`, `article_page.hbs` 등)을 직접 수정하여 히어로 영역에 배경 이미지와 검색바를 배치했다. CLO-SET 로고, 브랜드 컬러(시안 계열), 다크 네비게이션 바를 적용해 서비스 UI와 일관된 경험을 구현.
- **Result**: CLO-SET 브랜드와 통일된 헬프센터 완성. 고객이 별도 문의 없이 도움말을 탐색할 수 있는 self-service 채널 구축

### 카테고리 구조 및 콘텐츠 아키텍처 설계
- **Problem**: Getting Started · Feature Manual · CLO-SET News · FAQ 등 다양한 성격의 콘텐츠를 하나의 헬프센터에서 일관성 있게 탐색할 수 있도록 카테고리 계층 구조를 설계해야 했다. Zendesk의 카테고리 → 섹션 → 아티클 3단계 구조를 서비스 콘텐츠에 맞게 매핑하는 작업이 필요했다.
- **Solve**: 사용 목적별로 4개 최상위 카테고리를 구분하고, 각 카테고리 카드에 설명 문구와 SEE MORE 진입점을 배치하는 홈 레이아웃을 Handlebars 커스텀 헬퍼와 CSS Grid로 구현. Promoted Articles 영역을 별도로 구성해 주요 도움말을 홈에서 바로 노출.
- **Result**: 사용자 탐색 동선이 명확한 카테고리 구조 완성. CS팀이 직접 아티클을 관리할 수 있는 운영 구조 확립

### 다국어(i18n) 대응
- **Problem**: CLO-SET은 글로벌 패션 브랜드 고객을 대상으로 하는 서비스로, 헬프센터도 영어를 기본으로 다국어 지원이 필요했다. Zendesk Guide의 locale 기반 다국어 구조를 테마 레벨에서 올바르게 처리해야 했다.
- **Solve**: Zendesk Guide의 `{{t 'key'}}` 헬퍼를 활용해 UI 문자열을 locale 파일로 분리. URL 구조(`/hc/en-us`, `/hc/ko` 등)에 따라 언어가 자동 전환되도록 Zendesk 내장 i18n 구조를 활용.
- **Result**: 영어 기본, 추가 언어 확장 가능한 구조로 구축. 글로벌 고객 대상 서비스 운영 기반 마련

## 회고

Zendesk Guide는 자유도가 제한된 플랫폼이라 "어디까지 커스터마이징 가능한가"를 먼저 파악하는 것이 핵심이었다. Handlebars 템플릿과 manifest 변수 시스템을 이해하고 나면 구현 자체는 HTML/CSS 작업과 크게 다르지 않았지만, 플랫폼 제약 안에서 디자인 의도를 구현하는 것이 일반 웹 개발과는 다른 종류의 문제 해결이었다. 서비스 UI와 동일한 브랜드 경험을 헬프센터까지 일관되게 가져가는 것이 고객 신뢰도에 직접 영향을 준다는 점에서, 지원 채널의 UI/UX도 제품의 일부임을 배웠다.
