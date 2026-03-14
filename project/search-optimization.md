# 콘텐츠 검색 & Room 목록 가상 스크롤 성능 최적화

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 서비스 | CLOSET |
| 기술 스택 | Next.js, TypeScript, React Query, Virtuoso |
| 개발 기간 | 2024.08 ~ 2024.09 |
| 인원 | 프론트엔드 (담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

CLOSET의 콘텐츠 검색 페이지와 Room(파일·작업물을 보관·공유하는 워크스페이스 단위) 목록 페이지에서 Virtuoso 가상 스크롤 라이브러리와 React Query Infinite Scroll 조합에서 발생한 두 가지 버그를 수정했다. Virtuoso는 IntersectionObserver 대신 실제 DOM 렌더링 영역(`visibleRange`)을 기반으로 현재 보이는 항목만 렌더링하여 대량 리스트 성능을 확보하는 라이브러리다.

---

## 주요 구현

### | 무한 리렌더링 버그 — Windows 11 고해상도(HiDPI) 디스플레이

- **Problem**: Windows 11 HiDPI 환경에서 Space/Room 목록 페이지를 열면 `getNextPageFn`이 멈추지 않고 반복 호출되며 무한 API 요청과 리렌더링이 발생했다. Mac + 일반 해상도 모니터에서는 전혀 재현되지 않았기 때문에 원인 파악이 어려웠다. HiDPI 환경을 가진 팀원의 Windows 머신에서만 재현 가능해 디버깅 환경 자체를 구축하는 것이 첫 번째 과제였다.
- **Solve**: Virtuoso의 `visibleRange`가 반환하는 픽셀 값을 추적한 결과, HiDPI 환경에서는 브라우저가 CSS 픽셀과 물리 픽셀을 변환하는 과정에서 소수점이 포함된 `endIndex` 값이 반환되는 것을 확인했다. 이 값이 정수 비교에서 의도대로 처리되지 않아 "다음 페이지가 필요하다"는 판단이 루프로 이어졌다. `getNextPageFn` 호출 조건에 `isFetching` 가드를 추가하고 `Math.floor()`로 `visibleRange` 기반 인덱스 비교를 정수화하여 해결.
- **Result**: Windows HiDPI 환경에서 무한 루프 완전 해소

---

### | 콘텐츠 복사 후 목록 중복 이슈

- **Problem**: Context Menu에서 콘텐츠 단일 복사를 실행했을 때, 복사 완료 후 목록에 원본과 복사본이 중복으로 표시되거나, 카운트가 실제 서버 데이터와 맞지 않는 버그가 있었다. 원인은 복사 API 호출 시 React Query의 낙관적 업데이트로 임시 아이템을 목록에 추가했는데, 복사 완료 후 캐시 무효화와 임시 아이템 제거가 순서 보장 없이 실행되어 상태 불일치가 발생한 것이었다.
- **Solve**: 복사 mutation의 `onSuccess` 콜백에서 낙관적 업데이트로 삽입된 임시 아이템을 먼저 rollback한 뒤, `queryClient.invalidateQueries`로 해당 목록 캐시를 무효화하여 서버에서 최신 상태를 재조회하도록 순서를 명시.
- **Result**: 복사 후 목록 중복 표시 완전 해소, 카운트 정합성 확보

---

## 회고

"Mac에서는 안 나오는 버그"는 항상 디버깅이 어렵다. Virtuoso 버그는 HiDPI 환경 없이는 재현조차 불가능했기 때문에, 먼저 재현 환경을 확보하는 것이 디버깅의 전제임을 다시 한 번 체감했다. 픽셀 단위 계산이 들어가는 UI 로직은 OS/해상도/브라우저 조합에 따라 미묘하게 달라질 수 있으며, 가정에 의존하는 정수 비교보다는 명시적인 `Math.floor/ceil`이나 fetch 상태 가드로 방어해야 한다는 것을 배웠다.
