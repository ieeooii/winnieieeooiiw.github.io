---
name: add-project
description: 포트폴리오 사이트에 새 프로젝트 항목을 추가하는 스킬. project/ko/와 project/en/ 디렉토리에 올바른 형식의 마크다운 파일을 한/영 동시에 생성한다. 사용자가 "프로젝트 추가", "새 프로젝트", "add project", "포트폴리오에 추가" 등을 언급하거나, 프로젝트 마크다운 파일을 작성해달라고 할 때 반드시 이 스킬을 사용할 것.
---

# Add Project

포트폴리오 사이트에 새 프로젝트 항목을 추가한다. 한국어와 영어 마크다운 파일을 동시에 생성하며, 기존 프로젝트들의 형식과 컨벤션을 정확히 따른다.

## 워크플로우

### 1. 정보 수집

사용자에게 다음 정보를 확인한다. 이미 대화에서 언급된 내용은 다시 묻지 않는다.

**필수 정보:**
- 프로젝트 제목 (한국어 / 영어)
- 회사명
- 카테고리 (SaaS, E-Commerce, Internal Tool 등)
- 서비스명
- 기술 스택
- 개발 기간 (YYYY.MM ~ YYYY.MM 형식)
- 팀 구성 (인원과 역할)
- 프로젝트 소개 (한국어 / 영어)

**선택 정보:**
- 서비스 링크
- 썸네일 이미지 경로
- gradient 색상
- 주요 기능 스크린샷
- 주요 구현 내용 (Problem → Solve → Result 형식)
- 회고 / 아쉬웠던 점

사용자가 한국어로만 내용을 제공하면, 영어 버전은 기존 영어 파일들의 톤과 스타일에 맞게 번역한다. 직역이 아닌 자연스러운 기술 문서 영어를 사용한다.

### 2. 파일 생성

**파일명 규칙:** `YYYYMM-slug.md`
- YYYYMM은 개발 시작 시점 (예: 202411)
- slug는 프로젝트를 나타내는 영어 kebab-case (예: design-system)

**두 파일을 동시에 생성:**
- `project/ko/YYYYMM-slug.md`
- `project/en/YYYYMM-slug.md`

### 3. 마크다운 구조

아래 템플릿을 따른다. 선택 정보가 없는 섹션은 생략한다.

#### 한국어 (ko)

```markdown
---
thumbnail: /images/projects/slug-thumb.svg
gradient: linear-gradient(135deg, #색상1, #색상2)
---

# 프로젝트 제목

| 항목 | 내용 |
|------|------|
| 회사 | 회사명 |
| 카테고리 | 카테고리 |
| 서비스 | 서비스명 |
| 기술 스택 | 기술1, 기술2, ... |
| 개발 기간 | YYYY.MM ~ YYYY.MM |
| 인원 | 역할 구성 (담당 역할) |
| 서비스 링크 | [도메인](URL) |

## 소개

프로젝트 소개 내용

## 주요 기능

(스크린샷이 있을 경우 img-row-3 div로 감싸기)

## 주요 구현

### 구현 항목 제목

- **Problem**: 문제 상황
- **Solve**: 해결 방법
- **Result**: 결과
- **Insight**: (선택) 배운 점

## 회고 / 아쉬웠던 점

회고 내용
```

#### 영어 (en)

```markdown
---
thumbnail: /images/projects/slug-thumb.svg
gradient: linear-gradient(135deg, #색상1, #색상2)
---

# Project Title

| Field | Details |
|-------|---------|
| Company | Company Name |
| Category | Category |
| Service | Service Name |
| Tech Stack | Tech1, Tech2, ... |
| Period | YYYY.MM ~ YYYY.MM |
| Team | Team composition (role in charge) |
| Service Link | [domain](URL) |

## Overview

Project overview

## Key Features

(screenshots wrapped in img-row-3 div if available)

## Key Implementations

### Implementation Title

- **Problem**: Problem description
- **Solve**: Solution approach
- **Result**: Outcome
- **Insight**: (optional) Lessons learned

## Retrospective / Lessons Learned

Retrospective content
```

### 4. 스크린샷 레이아웃

이미지가 있을 때 기존 프로젝트의 레이아웃 패턴을 따른다:

- 3개 이미지 한 줄: `<div class="img-row-3">` 안에 `![alt](path)` 3개
- 1개 이미지: `<div class="img-row-1">` 안에 `![alt](path)` 1개
- div 태그와 이미지 사이에 빈 줄을 반드시 넣는다 (react-markdown + rehype-raw가 올바르게 파싱하도록)

### 5. 생성 후 안내

파일 생성 후 사용자에게 알려줄 것:
- 생성된 두 파일의 경로
- 썸네일 이미지를 `/public/images/projects/`에 추가해야 한다는 점 (이미지가 아직 없는 경우)
- `pnpm dev`로 확인할 수 있다는 점

## 주의사항

- frontmatter의 thumbnail과 gradient는 반드시 포함한다. 사용자가 제공하지 않으면 gradient는 기존 프로젝트에서 비슷한 톤을 참고해 임의로 지정하고, thumbnail은 placeholder 경로를 넣는다.
- 메타데이터 테이블의 열 이름은 한국어 파일은 `항목 | 내용`, 영어 파일은 `Field | Details`를 사용한다.
- 기존 프로젝트 파일들을 참고해서 톤과 깊이를 맞춘다. 특히 "주요 구현" 섹션은 Problem → Solve → Result 패턴을 일관되게 유지한다.
- 번역 파일(`src/shared/i18n/ko.ts`, `en.ts`)은 프로젝트 마크다운과 무관하므로 수정하지 않는다. 프로젝트 목록은 마크다운 파일에서 동적으로 로드된다.
