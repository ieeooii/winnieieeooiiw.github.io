---
thumbnail: /images/projects/202007-company-general-setting.webp
gradient: linear-gradient(135deg, #e0f2fe, #bae6fd)
---

# Storage General Setting 페이지 React 마이그레이션

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, Emotion (jQuery → React 마이그레이션) |
| 개발 기간 | 2020.07 ~ 2020.09 |
| 인원 | 프론트엔드 1 (담당) |
| 서비스 링크 | [style.clo-set.com](https://style.clo-set.com) |

## 소개

패션 브랜드 관리자가 회사 정보(이름, 로고, 컬러), 기능 활성화 옵션(워크룸·라인시트·접근 권한·뷰어), 측정 단위·통화 단위를 설정하는 Company General Setting 페이지다. 설정 항목이 다양하고 각각 API 호출과 연동되기 때문에, **토글 옵션들을 선언적 데이터 구조(config 배열)로 관리**하는 방식을 설계했다. 회사 삭제·양도처럼 복구 불가능한 파괴적 액션에 대한 확인 플로우도 포함된다.

페이지 스토어는 루트 스토어 → 페이지 전용 스토어를 Composition 패턴으로 분리했다. 모든 API 액션에 `@action.bound`를 적용해 `this` 바인딩을 보장하고, 비동기 완료 후 상태 변경은 항상 `runInAction`으로 감싸 MobX strict mode를 준수했다.

![Storage General Setting 페이지](/images/projects/202007-company-general-setting.webp)

## 주요 구현

### 토글 옵션 선언적 config 패턴 설계

- **Problem**: 5개 이상의 토글 옵션이 각각 다른 API를 호출하고, 토글별로 모달 제목·내용·on/off 라벨이 모두 달랐다. 토글마다 별도 컴포넌트나 조건 분기를 만들면 신규 토글 추가 시 코드 변경 범위가 넓어진다.
- **Solve**: 각 토글 옵션의 속성(활성 여부, 핸들러, 확인 모달 내용, on/off 라벨)을 타입으로 정의하고 config 배열로 선언적으로 관리. 토글 목록 컴포넌트는 이 배열을 순회하며 일관된 UI를 렌더링. 커스텀 UI가 필요한 항목(측정 단위 셀렉터, 통화 단위 셀렉터)은 `ReactNode`를 주입하는 `customNode` 프로퍼티로 처리.
- **Result**: 새로운 토글 옵션은 배열에 항목 하나 추가하는 것만으로 적용 가능한 확장 구조

```typescript
interface ToggleOption {
  isOn?: boolean;
  onToggle?: () => void;
  onLabel?: string;
  offLabel?: string;
  confirmTitle?: string;    // 생략하면 확인 모달 없이 즉시 실행
  confirmMessage?: string;
  customNode?: ReactNode;   // 토글 대신 커스텀 컴포넌트를 렌더링
}
```

토글 목록 컴포넌트는 `confirmMessage` 유무에 따라 즉시 실행 또는 확인 모달을 경유하는 방식으로 토글을 처리한다. 모달 닫기 시 애니메이션 완료 후 콘텐츠를 초기화해 닫히는 도중 내용이 바뀌는 깜빡임을 방지했다.

```typescript
const handleToggle = (option: ToggleOption): void => {
  if (!option.confirmMessage) {
    option.onToggle?.();   // 확인 불필요한 토글은 바로 실행
    return;
  }
  showConfirmModal(option);  // 확인이 필요한 토글은 모달 경유
};
```

---

### 회사 이름 변경 — 실시간 유효성 검사

- **Problem**: 회사 이름 입력 시 특수문자·금지 문자가 포함된 채 서버로 전송되면 백엔드에서 에러가 반환된다. 사용자 입장에서는 저장 버튼을 누른 뒤 실패 메시지를 받는 것보다, 입력 중에 실시간으로 피드백을 받는 것이 UX상 낫다.
- **Solve**: 유효성 검사 유틸 함수로 입력값을 실시간 검증. 유효하지 않을 경우 입력 컴포넌트에 `helpMessage`를 전달해 인라인 오류 문구 표시. `onBlur` 시점에 유효하지 않으면 API 호출 자체를 차단. 글자 수 제한은 공통 상수로 관리해 `maxLength`에 일괄 적용. 스토어 액션에서도 값이 없거나 기존 값과 동일하면 early return해 불필요한 API 호출을 차단.
- **Result**: 유효하지 않은 이름이 서버로 전송되는 케이스 원천 차단, 사용자가 입력 중 즉시 피드백 수신

---

### 회사 삭제 / 양도 파괴적 액션 처리

- **Problem**: 회사 삭제는 모든 콘텐츠와 설정이 영구적으로 삭제되는 복구 불가능한 액션이다. 회사 양도는 플랜 조건에 따라 노출 여부가 결정되고, 수락·거절 플로우가 별도로 존재한다. 두 액션 모두 단순 버튼으로 제공하면 실수로 실행될 위험이 있다.
- **Solve**: 회사 삭제는 "이름을 직접 입력해야 확인" 패턴 적용. 삭제 완료 후 대시보드로 자동 리다이렉트. 양도 컴포넌트는 플랜 조건에 따라 조건부 렌더링. 열린 모달 타입을 enum 단일 state로 관리해 여러 모달이 동시에 열리지 않도록 제어. 양도 플로우 상태는 로컬 스토어를 컴포넌트 수명에 맞게 생성해 페이지 스토어와 격리.
- **Result**: 파괴적 액션에 대한 이중 확인 플로우 구현, 모달 상태 충돌 방지

```typescript
// 열린 모달을 단일 enum 값으로 관리 — 동시에 두 모달이 열릴 수 없음
enum ActiveModal { CONFIRM, DELETE, ERROR }

const [activeModal, setActiveModal] = useState<ActiveModal>();
const isDeleteOpen = activeModal === ActiveModal.DELETE;
```

---

### 측정 단위 / 통화 단위 설정

- **Problem**: 측정 단위 변경은 메인 설정 저장과 동시에 연동된 외부 서비스에도 단위를 동기화해야 한다. 순차 호출 시 대기 시간이 길어지고, 업데이트 도중 재변경 시 중복 요청이 발생할 수 있다.
- **Solve**: `Promise.all`로 두 API를 병렬 호출해 대기 시간 단축. 로딩 플래그로 완료 전 재요청 차단. 통화 단위는 조회와 업데이트 액션을 props로 분리 주입해 컴포넌트가 API 구조에 의존하지 않도록 설계.
- **Result**: 업데이트 응답 시간 단축, 중복 요청 방지, 통화 단위 컴포넌트 재사용성 확보

```typescript
// 두 시스템을 병렬 업데이트 후 runInAction으로 상태 일괄 반영
await Promise.all([
  api.updatePrimary(params),
  api.syncExternal(params),
]);

runInAction(() => {
  this.value = newValue;
  this.isLoading = false;
});
```

## 회고 / 아쉬웠던 점

설정 페이지는 "단순한 폼"처럼 보이지만, 항목 하나하나가 서로 다른 API와 연동되고 각각의 실패 케이스·로딩 상태를 처리해야 한다. 토글 옵션을 config 배열로 선언적으로 관리하는 방식은 초기 설계 비용이 조금 높지만, 이후 새로운 옵션이 추가될 때마다 컴포넌트 코드를 건드리지 않아도 되는 장점이 있다. 반복되는 패턴을 추상화할 시점을 판단하는 것이 설계의 핵심임을 이 작업에서 다시 확인했다.
