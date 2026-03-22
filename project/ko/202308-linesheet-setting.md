---
thumbnail: /images/projects/202408-linesheet-setting-status.png
gradient: linear-gradient(135deg, #e8eaf0, #c8ccd8)
---

# Line Sheet 설정 — 마스터 데이터 관리

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, Emotion |
| 개발 기간 | 2023.07 ~ 2023.08 |
| 인원 | 프론트엔드 1 (담당), 백엔드 1, 기획자 1, 디자이너 1 |
| 서비스 링크 | [style.clo-set.com](https://style.clo-set.com) |

## 소개

패션 브랜드 관리자가 Line Sheet에서 사용하는 4가지 마스터 데이터(Status / Customer Type / Sales Channel / Store Type)를 직접 등록·수정·삭제·순서 변경하는 설정 페이지다. 4가지 타입이 구조적으로 동일하지만 각각 독립적인 API와 상태를 가지므로, **탭 전환 + `next/dynamic` 지연 로딩 + MobX 서브 스토어 모듈화** 패턴으로 코드 중복 없이 4개 도메인을 통합 관리하는 구조를 설계했다.

<div class="img-row-2">

![Line Sheet 설정 — Status](/images/projects/202408-linesheet-setting-status.png)
![Line Sheet 설정 — Customer Type](/images/projects/202408-linesheet-setting-customer-type.png)
![Line Sheet 설정 — Sales Channel](/images/projects/202408-linesheet-setting-sales-channel.png)
![Line Sheet 설정 — Store Type](/images/projects/202408-linesheet-setting-store-type.png)
![Line Sheet 설정 — Colorway](/images/projects/202408-linesheet-setting-colorway.png)

</div>

## 주요 구현

### 탭 기반 next/dynamic 지연 로딩 구조

- **Problem**: 4가지 설정 타입은 UI와 동작이 거의 동일하지만, 각각 다른 API 엔드포인트와 스토어 서브 모듈을 사용한다. 4개를 한 번에 정적 임포트하면 초기 번들에 불필요한 코드가 포함되고, 사용자가 접근하지 않는 탭의 데이터도 초기화된다.
- **Solve**: 각 탭 컴포넌트를 `next/dynamic`으로 동적 임포트하여 탭 전환 시점에 해당 청크만 로드. 탭 설정을 배열 데이터로 선언하고 각 항목에 초기화 함수와 동적 컴포넌트를 포함. 탭 전환 시 해당 항목의 초기화 함수를 자동 호출하여 도메인 데이터를 초기화.
- **Result**: 현재 선택된 탭의 코드·데이터만 로드, 초기 번들 사이즈 최적화

### 드래그 앤 드롭 공통 컴포넌트 재사용

- **Problem**: 드래그 앤 드롭이 가능한 설정 레이아웃을 4개 도메인마다 따로 구현하면 코드 중복과 유지보수 비용이 발생한다.
- **Solve**: 기존 설정 페이지에서 구축한 드래그 앤 드롭 공통 컴포넌트를 4개 타입 모두에 재사용. 각 도메인 컴포넌트는 데이터와 CRUD 핸들러만 주입하면 되는 구조 — 드래그 앤 드롭 로직, 아이템 렌더링, 순서 변경 API 연동은 공통 컴포넌트가 처리.
- **Result**: 새로운 설정 타입이 추가될 때 공통 레이아웃 컴포넌트를 즉시 재사용 가능한 구조

### MobX 서브 스토어 모듈화

- **Problem**: 4개 타입의 상태(리스트, 선택 항목, 로딩 여부, CRUD 액션)가 하나의 스토어에 혼재하면 서로 다른 타입의 상태가 섞여 추적이 어렵고, 탭 전환 시 이전 탭의 상태가 다음 탭에 영향을 줄 수 있다.
- **Solve**: 도메인별 서브 모듈을 독립적으로 설계하여 각 서브 모듈이 자신의 CRUD 액션만 소유하도록 분리. 탭 전환 시 선택된 탭에 해당하는 서브 모듈의 초기화 함수를 호출하여 도메인 데이터를 독립적으로 관리.
- **Result**: 탭 간 상태 격리, 각 도메인의 CRUD 로직 독립 관리

## 회고 / 아쉬웠던 점

4개 타입이 동일한 구조를 가진다는 점에서 "공통 컴포넌트를 먼저 만들고 각 도메인이 그 위에 올라타는 방식"이 자연스럽게 도출됐다. 배열 선언 하나로 탭 UI, 동적 컴포넌트 로딩, 탭 전환 시 데이터 초기화가 모두 연결되는 구조가 완성됐을 때, **데이터 주도(data-driven) 설계의 장점**을 실감했다. 새 타입 추가 시 배열에 항목 하나를 추가하는 것만으로 동작한다.
