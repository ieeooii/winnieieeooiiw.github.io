# 휴지통(Trash) — 삭제 항목 복원 기능 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, Emotion |
| 개발 기간 | 2020.07 ~ 2020.09 |
| 서비스 링크 | style.clo-set.com |

## 소개

Company Setting의 Trash 탭으로, 관리자가 삭제된 콘텐츠 항목을 페이지네이션 목록으로 조회하고 다중 선택·일괄 복원하는 기능이다. 복원 완료 후 목록 갱신, 선택 상태 초기화, 모달 피드백까지 일관되게 처리하는 것이 핵심 설계 요소였다. 디자인 시스템의 `Table` 컴포넌트를 **명령형(imperative) ref 패턴**으로 제어하여 선택 해제를 외부에서 트리거하는 방식을 구현했다.

## 주요 구현

### TableHandle ref를 통한 명령형 선택 상태 제어

- **Problem**: 복원 완료 후 테이블의 체크박스 선택 상태를 초기화해야 했다. React의 단방향 데이터 흐름에서는 부모 컴포넌트가 자식 테이블의 내부 선택 상태를 직접 조작할 수 없다. prop으로 `selectedRows`를 전달하는 방식도 있지만, 이 경우 테이블 컴포넌트가 자체적으로 관리하는 체크박스 상태와 외부 상태가 이중화되어 동기화 부담이 생긴다.
- **Solve**: 디자인 시스템 `Table` 컴포넌트가 `useImperativeHandle`로 노출하는 `TableHandle<TrashItem>` ref를 `useRef`로 받아 보유. 복원 완료 이벤트(`restoreTrashItems()` 성공) 시 `handleTableRef.current.deselectAllRows()`를 명시적으로 호출하여 테이블 내부 선택 상태를 초기화. 페이지 전환(`onPaginate`) 시에도 동일하게 호출하여 이전 페이지 선택 잔재 방지.
- **Result**: 복원·페이지 전환 후 테이블 선택 상태 깔끔하게 초기화, 테이블 내부 상태와 외부 상태 이중화 없음

### 페이지네이션 + 다중 선택 + 일괄 복원 플로우

- **Problem**: 삭제된 아이템이 많을 경우 전체를 한 번에 불러오면 API 응답이 느리다. 페이지 단위로 로드하면서 여러 아이템을 선택해 일괄 복원하는 플로우에서, 페이지 이동 시 이전 선택 항목이 남아있으면 다른 페이지의 아이템과 함께 복원 요청이 전송되는 문제가 발생한다.
- **Solve**: `TrashStore`에서 `pagingInfo`(현재 페이지·전체 수)와 `selectedTrashItems`를 MobX observable로 관리. `fetchTrashItems(page)` 호출 시 항상 `deselectAllRows()`와 `setSelectedTrashItems([])` 함께 호출하여 페이지 이동 시 선택 상태 자동 초기화. 복원 버튼은 `selectedTrashItems.length === 0`일 때 `disabled` 처리하여 빈 선택으로 API 요청하는 케이스 원천 차단.
- **Result**: 페이지 간 선택 오염 없이 안전한 일괄 복원 동작

### 에러 케이스별 모달 분기

- 선택 없이 복원 버튼 클릭: `isBlank` 상태로 "선택된 항목 없음" 경고 모달(`PermissionDeleteNoSelectedModal`) 표시
- API 오류 발생: `isError` 상태로 `WarningModal` 표시
- 복원 완료: `isCompleteModalOpen` 상태로 완료 모달 표시 후 `clearStatus()`로 모든 피드백 상태 일괄 초기화
- `next/dynamic`으로 완료 모달·경고 모달을 지연 로딩하여 초기 번들에서 제외 — 대부분의 사용자는 오류나 완료 상태를 자주 접하지 않기 때문

## 회고

Trash 기능은 단순해 보이지만 "복원 완료 후 상태를 어떻게 깔끔하게 정리하느냐"가 UX 품질을 결정한다. `TableHandle` ref 패턴은 선언적 React 패러다임에 어긋나 보이지만, 테이블처럼 내부 상태를 자체 관리하는 컴포넌트의 선택 초기화를 외부에서 트리거해야 할 때 유용한 탈출구(escape hatch)다. 디자인 시스템 컴포넌트가 `useImperativeHandle`로 적절한 명령형 API를 노출해주어야 이런 제어가 가능하다는 것, 즉 **컴포넌트를 설계할 때 "외부에서 어떤 명령이 필요할지"도 미리 고려해야 한다**는 교훈을 얻었다.
