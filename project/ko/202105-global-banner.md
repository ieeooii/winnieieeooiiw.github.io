# 알림 글로벌 배너 시스템 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, React Query |
| 개발 기간 | 2021.05 |
| 인원 | 프론트엔드 1 (담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

이메일 미인증·마케팅 동의·공지 등 여러 배너가 동시에 조건을 만족할 수 있는 복잡한 상황을 처리하기 위해, 우선순위 기반 배너 큐 시스템을 설계·구현했다.

## 주요 구현

### liveSteps 비동기 큐 설계

- **Problem**: 각 배너의 표시 조건이 API 비동기 데이터에 의존해 마운트 시점에 동기적으로 계산 불가. 기존 구조에서 Enterprise 전용 스텝을 별도 배열로 관리해 새로운 배너 타입 추가 시 양쪽 모두 수정이 필요했다.
- **Solve**: `liveSteps`를 `async` 함수로 계산해 Promise를 반환하는 구조로 변경. `GlobalRootTopBanner`가 비동기 데이터를 기다렸다가 `currentStep`을 결정. Enterprise 전용 분기는 `liveSteps` 계산 로직 내부에서 처리해 배너 큐 자체는 단일화.
- **Result**: 배너 타입 추가 시 `liveSteps` 배열에 스텝 하나만 추가하면 되는 확장 가능한 구조, Enterprise / 일반 플랜 분기 일원화

### localStorage per-group 상태 관리
- **Problem**: 그룹 ID 없이 배너 타입만으로 localStorage 키를 만들면 A 그룹에서 닫은 배너가 B 그룹에서도 닫힌 상태로 표시됐다(CLOSET은 사용자가 여러 그룹에 속할 수 있다). localStorage 값에 `value` 키가 없는 경우를 처리하지 않아 배포 직후 핫픽스가 발생한 이력도 있었다.
- **Solve**: localStorage 키에 `groupId`를 포함해 `{배너타입}_{groupId}` 형식으로 설계. 만료 체크 시 `value` 존재 여부를 먼저 확인하는 방어 코드 추가. 만료 체크 로직은 별도 유틸로 추출.
- **Result**: 그룹별 독립적인 배너 닫힘 상태 유지, localStorage 파싱 관련 엣지 케이스 방어

## 회고 / 아쉬웠던 점
배포 직후 핫픽스는 이 시스템을 배포한 직후에 발생했다. 클라이언트 스토리지는 "데이터가 없을 수도 있고, 형식이 틀릴 수도 있다"는 전제 하에 항상 방어적으로 파싱해야 한다는 것을 몸소 배운 경험이었다. 이후로는 localStorage 접근 코드에 반드시 타입 체크와 존재 여부 확인을 먼저 추가하는 습관이 생겼다.
