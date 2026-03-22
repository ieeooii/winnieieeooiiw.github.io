---
thumbnail: /images/projects/202011-connect-upload-step0.png
gradient: linear-gradient(135deg, #c8d8f8, #a0b8f0)
---

# 오픈 마켓 출시 — 상품 등록 기능 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | E-Commerce |
| 서비스 | CONNECT |
| 기술 스택 | Next.js, TypeScript, Redux (Toolkit + Saga), Emotion.js, Jest, React Testing Library |
| 개발 기간 | 2020.11 ~ 2021.05 |
| 인원 | 프론트엔드 1, 백엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당) |
| 서비스 링크 | https://connect.clo-set.com/ko/upload |

## 소개

3D 의상 공유, 커뮤니케이션, 판매, 구매가 가능한 글로벌 디지털 의상 커뮤니티 서비스 CONNECT의 신규 업로드 페이지를 전체 설계·개발했다. 기본 정보 → 파일 첨부 → 카테고리 → 가격 설정 → 마켓 정보의 다단계 구조로 설계했으며, 이후 Edit 페이지에도 동일 컴포넌트가 재사용됐다.

## 주요 기능

<div class="img-row-2">

![업로드 Step 0](/images/projects/202011-connect-upload-step0.png)
![업로드 Step 1](/images/projects/202011-connect-upload-step1.png)
![업로드 Step 2](/images/projects/202011-connect-upload-step2.png)
![업로드 Step 2 가격 설정](/images/projects/202011-connect-upload-step2-price.png)
![업로드 편집 모드](/images/projects/202011-connect-upload-edit-mode.png)

</div>

## 주요 구현

### 프로젝트 설계 고민
- View 와 비지니스 로직을 분리하기 위해 Presentational and Container Pattern 도입 — Container 36개 / Presentational Component 90+개로 구성
- 일관된 구조를 유지하기 위한 Redux 및 Redux-toolkit 도입, Flux Pattern 적용
  - 도메인별 14개 Slice로 분리 (Step·파일·제목·설명·썸네일·서브이미지·첨부·카테고리·컬렉션·가격·공개설정·편집사유·루트·콘테스트)
  - Next.js SSR 환경에서의 상태 동기화를 위해 `HYDRATE` action을 각 Slice의 `extraReducers`에 처리
- CSS in JS  Emotion.js  도입
  -  SCSS  module css는 별도의 많은 css 파일을 관리하여 발생하는 유지보수 문제 측면에서 개선하기 위해 CSS in JS 도입 논의 및 사내 스터디(발표) 진행
  - Emotion.js - 도입 여부를 결정하기 위한 사내 기술 발표 [Link](https://ieeooii.notion.site/Emotion-js-361f27a6ae014131b770b8341b46cbde?source=copy_link)

### 멀티스텝 폼 설계

- **Problem**: 드래그 앤 드롭 파일 첨부·Quill 기반 리치 텍스트 에디터·가격 설정 등 복잡한 입력 흐름을 다단계 구조 안에서 안정적으로 관리해야 했다.
- **Solve**: Redux Slice + Saga 기반으로 각 스텝의 상태를 독립적으로 관리했다. Quill 에디터는 글자수 제한·onBlur 에러 상태 처리를 커스터마이징하고, 파일 타입 검증 유틸 함수를 공통화해 여러 업로드 영역에서 재사용했다.
- **Result**: 신규 업로드 플로우 전체 완성. 이후 Edit 페이지에도 동일 컴포넌트 재사용.

### 3D 파일 처리 파이프라인

파일 선택 → 클라이언트 검증 → 서버 제출의 전 과정을 Saga로 조율했다.

- **Problem**: 3D 의상 파일은 CLO 전용 바이너리 포맷(ZFile)이다. 파일 선택 시점에 포맷 이상·버전 호환성·중복 등록 여부를 클라이언트에서 미리 검증하지 않으면, 잘못된 파일이 서버까지 전송되어 불필요한 API 비용과 유저 대기 시간이 발생한다.
- **Solve**: 사내 ZFile 파서 라이브러리로 파일 바이너리를 직접 파싱해 내부 메타데이터(머티리얼 구조, 아바타 호환성, 생성일 등)를 추출했다. 파싱 실패(구버전 파일·손상 파일) 시 Redux-Saga의 `cancel` effect로 즉시 중단해 이후 API 요청을 막았다.
  - **파일 타입별 차별화된 검증**: 중복 등록 검증 API를 호출하되, Garment(의상)는 동일 파일로 여러 상품 등록이 허용되므로 검증 대상에서 제외하고 Trim·Fabric·Avatar에만 적용했다.
  - **아바타 파일 카테고리 자동 preset**: 아바타 파일의 경우 ZHeader에서 파싱한 아바타 식별자를 기반으로 사전 정의된 호환성·성별 preset 맵을 조회해 카테고리 초기값을 자동으로 채워 유저 입력 단계를 줄였다.
  - **Edit 모드 파일 교체 가드**: 편집 페이지에서 파일 교체 시 서버 응답 코드를 기반으로 디자인 소스 변경 불가·확장자 불일치 케이스를 구분해 각각 다른 에러 메시지를 토스트로 안내했다.
  - **신규 등록 vs 편집 FormData 분기**: 신규 등록은 3D 파일·썸네일·메타데이터 JSON·첨부파일·서브 이미지를 `FormData`로 조립해 전송하고, 편집은 기존 파일·이미지를 서버 식별자로만 참조하고 새로 추가된 파일만 binary로 append해 불필요한 재전송을 방지했다.

### 카테고리 선택 상태 관리

카테고리는 Garment·Fabric·Trim·Avatar·Scene 5가지 타입으로 나뉘며, 타입마다 선택 규칙이 달라 별도 로직이 필요했다.

- **카테고리 타입별 최대 선택 수 제한**: 카테고리 타입을 키로 하는 상한 맵을 두어 타입별 선택 가능 수를 일괄 관리했다.
- **Garment Single/Outfits 상호 배타 로직**: Garment의 Style 카테고리는 Single(단일 아이템)과 Outfits(코디)가 상호 배타적이다. Single 선택 시 동일 부모 하위 항목만 유지하고 Outfits 전체를 제거하며, Outfits 선택 시 Single 카테고리를 전부 제거하도록 reducer에 분기 처리했다.
- **Avatar Motion/Pose 필터링**: Avatar 카테고리에서 Motion·Pose 중간 노드는 UI 체크 표시용으로만 사용되며 실제 제출값에는 포함되지 않는다. `createSelector`로 이 두 항목을 필터링한 파생 상태를 정의해 제출 로직과 UI 로직을 분리했다.
- **중복 카테고리 ID 방어**: 간헐적으로 동일 카테고리 ID가 중복 포함되는 버그가 있어 `lodash/uniqBy`로 FormData 조립 전 중복을 제거했다.

### 테스트 코드 작성 (약 80개)

- **Problem**: 업로드는 서비스 핵심 기능인 만큼 파일 첨부·드래그 앤 드롭·카테고리 변경·가격 옵션 등 전체 플로우가 정상 동작하는지 검증이 필요했으나, 테스트 코드가 전무해 회귀 버그 위험이 높았다.
- **Solve**: Jest + React Testing Library로 약 80개 테스트를 작성해 컴포넌트 단위 및 플로우 시나리오를 단계적으로 커버했다. `title` 속성을 `data-testid`로 정비하고, `wrapper.rerender` → `rerender`, `wrapper` → `screen` API로 마이그레이션해 최신 RTL 패턴으로 통일했다.
- **Result**: 행위 주도 테스트 코드 작성 및 테스트 코드 커버리지 70% 달성.

## 회고 / 아쉬웠던 점

컴포넌트 개발 전 재사용 범위를 먼저 파악하고 공용 컴포넌트로 설계한 것은 이후 유지보수 비용을 낮추는 데 효과적이었다. 레이아웃·태그·텍스트 입력·토스트 등 UI 원자 단위 컴포넌트를 공통화해 폼 전 영역에 일관된 스타일을 적용한 것도 이 작업의 핵심이었다.

카테고리 데이터 구조에 대해서도 아쉬움이 남는다. 당시 서버에서 트리 구조로 내려오는 데이터를 그대로 다루다 보니 중첩 탐색으로 인한 성능 문제가 발생했는데, 애초에 `depth` 값만 포함한 flat 배열로 설계했다면 더 나았을 것이다. 당시 역량으로는 근본적인 해결이 어려워 BE에 데이터 구조 변경을 요청했는데, 지금 돌아보면 `new Map`으로 `id → node`를 O(1)로 참조하는 flat → tree 변환 로직을 구현했다면 O(n²) 중첩 탐색 없이 O(n)으로 처리할 수 있었을 것이다.

테스트 코드는 구현 세부사항에 의존하는 방식으로 작성해 리팩토링할 때마다 테스트가 깨지는 문제가 반복됐다. RTL의 핵심은 사용자 행위 기반 검증임을 이후에 깨달았고, 내부 구현이 아닌 사용자 관점의 인터랙션을 기준으로 테스트를 설계했어야 했다.
