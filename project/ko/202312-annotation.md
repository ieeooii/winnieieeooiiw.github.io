---
thumbnail: /images/projects/202312-annotation-thumbnail.png
gradient: linear-gradient(135deg, #d4e8ec, #a8cdd2)
---

# 3D 뷰어 위치 기반 코멘트 & 스레드 협업 기능 개발

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 카테고리 | SaaS |
| 서비스 | CLO-SET |
| 기술 스택 | Next.js, TypeScript, MobX, Emotion.js, Jest, Enzyme |
| 개발 기간 | 2023.12 ~ 2024.02 |
| 인원 | 프론트엔드 (담당) |
| 서비스 링크 | style.clo-set.com |

## 소개

협업 기능으로 두 종류의 코멘트 시스템을 동시에 개발했다. Annotation은 3D 뷰어 캔버스 위에 핀을 꽂아 특정 위치에 코멘트를 다는 시스템이고, Comment는 콘텐츠 페이지에 일반 스레드 형태로 달리는 시스템이다. 두 시스템 모두 텍스트 + 이미지 첨부·멘션(@mention)·대댓글(reply)을 지원하며, 에디터(`CommentEditor.tsx`)와 멘션 컴포넌트는 공통화하고 각 시스템이 조합하는 방식으로 설계했다.

## 주요 기능

<div class="img-row-2">

![어노테이션 버튼](/images/projects/202005-comment-annotation-button.png)
![어노테이션 복사 모달](/images/projects/202005-comment-annotation-modal.png)
![어노테이션 복사 중](/images/projects/202005-comment-annotation-copying.png)
![어노테이션 복사 완료](/images/projects/202005-comment-annotation-copied.png)

</div>

## 주요 구현

### 이전 버전에 달린 3D 의상 주석을 특정 버전의 3D 의상에 복사하는 기능 개발
- 그래픽스 엔지니어 및 백엔드 엔지니어와 기능 CRUD 설계 진행
- Enzyme  으로 행위 주도 테스트 코드 작성
- **Problem**: depth가 깊은 상태의 경우 참조값이 관찰되지 않는 문제와 조건에 의해 분리된 중복 상태 통합 문제
- **Solve**: MobX  Observer 패턴 적용하여 @observable 상태 내의 참조 값을 observable 상태로 재할당하고, @computed decorator를 사용하여 필요한 상태 정보만 가져오기 / 수정(업데이트)가능하도록 설계해 @computed에서 참조하고 있는 @observable 상태가 업데이트 되도록 개발

### CommentEditor 이미지 Drag & Drop 및 키보드 단축키
- **Problem**: 이미지를 에디터 영역에 드래그해서 바로 첨부하는 UX가 요구됐다. `Cmd+Enter`(Mac) / `Ctrl+Enter`(Windows) 단축키로 댓글을 제출하는 기능도 필요했다. 에디터 내부에서 Enter가 줄바꿈과 제출 두 가지 역할을 해야 했기 때문에 modifier key 조합을 정확히 구분해야 했다.
- **Solve**: `CommentEditorDragAndDrop.tsx`를 별도 컴포넌트로 분리하여 `dragover` / `drop` 이벤트를 처리하고, 드롭된 파일의 MIME type을 확인하여 `image/*` 외 파일은 드롭을 차단. OS 판별(`navigator.platform`) 후 Mac은 `metaKey`, Windows/Linux는 `ctrlKey`를 감지하는 `onKeydownToEditor` 핸들러를 구현하여 Enter와 제출을 정확히 분리.
- **Result**: 이미지 드래그 앤 드롭 첨부 가능, 플랫폼별 키보드 단축키 제출 지원

### 멘션(@mention) 드롭다운 위치 계산 버그 수정
- **Problem**: 멘션 목록이 화면 하단에 위치한 에디터에서 활성화될 때, 드롭다운이 viewport 아래쪽으로 벗어나 잘리는 align 버그가 발생했다. 라이브러리가 드롭다운의 표시 방향을 에디터 위치에 관계없이 항상 아래쪽으로 고정했기 때문이었다.
- **Solve**: 에디터 컴포넌트의 `getBoundingClientRect()`로 현재 위치를 계산하고, viewport 하단까지 남은 공간과 드롭다운 높이를 비교하여 공간이 부족하면 드롭다운을 위쪽으로 표시하도록 동적 전환 로직을 추가.
- **Result**: 화면 어느 위치에서도 멘션 드롭다운이 잘리지 않고 정상 표시

### Annotation Comment 2단계 계층 이벤트 처리
- **Problem**: Annotation Comment는 Thread와 Reply의 2단계 계층 구조를 가지며, 각 레벨에서 ESC(취소) / Enter(제출) 키보드 이벤트가 독립적으로 동작해야 했다. 대댓글 입력 중 ESC를 눌렀을 때 대댓글 입력창만 닫히고 상위 Thread에는 영향을 주지 않아야 했는데, 이벤트가 부모 컴포넌트까지 버블링되어 상위 Thread도 함께 닫히는 문제가 있었다.
- **Solve**: `AnnotationCommentReplyItem.tsx`(Thread 레벨)와 `AnnotationCommentChildItem.tsx`(Reply 레벨)로 계층 분리. Reply 레벨의 키보드 핸들러에서 `event.stopPropagation()`을 호출하여 Thread 레벨까지 버블링 차단. 각 레벨의 open/close 상태를 독립적인 로컬 state로 관리.
- **Result**: 2단계 댓글 계층에서 독립적인 키보드 인터랙션 동작, ESC 이벤트가 계층 간 의도치 않게 전파되지 않음

## 회고 / 아쉬웠던 점

에디터 컴포넌트는 UX 요구사항이 많고 엣지 케이스가 풍부한 영역이다. 특히 이 작업에서 "이벤트 위임과 `stopPropagation`은 서로 반대 방향으로 작용한다"는 것을 명확히 이해하게 됐다. 이벤트 위임은 버블링을 이용하는 것이고 `stopPropagation`은 그것을 끊는 것이기 때문에, 두 패턴을 함께 쓸 때는 어느 레벨에서 끊어야 하는지를 컴포넌트 계층 설계 단계에서 미리 정해야 한다.
