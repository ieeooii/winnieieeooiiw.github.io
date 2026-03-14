# AI 개발 환경 구축 및 CI/CD 설계

| 항목 | 내용 |
|------|------|
| 회사 | CLO Virtual Fashion |
| 기술 스택 | Claude.ai, Gemini, Husky, ESLint, GitHub Actions |
| 인원 | 프론트엔드 1, 데브옵스 1 (프론트엔드 담당) |

## 소개

수동 코드 리뷰로 인한 병목과 컨벤션 미준수, 비표준화된 브랜치 전략으로 인한 빌드 실패·배포 실수 문제 해결. 개발 속도 50~60% 향상, 빌드 실패율 감소 및 코드리뷰 응답 시간 단축.

## 주요 구현

### AI 보조 개발 환경 구축
- **Solve**: AGENTS.md로 코드 컨벤션·보안 규칙을 정의해 Claude.ai 기반 AI 보조 개발에서도 팀 기준 준수. Gemini를 GitHub에 연동해 PR 단위 자동 코드 리뷰 환경 구성.
- **Result**: PR 코드 리뷰 속도 단축 및 컨벤션 위반 감소. 타 업무 병행 기준 개발 속도 약 50~60% 향상 (5일 → 2~2.5일).

### 브랜치 전략 재설계 및 코드 품질 자동화
- **Solve**: enterprise·feature·fix·release 브랜치를 추가한 변형 Git Flow 전략 설계. Husky + ESLint 기반 pre-commit 린트·빌드 체크로 커밋 전 코드 품질 자동 검증. Branch Protection Rules로 리뷰어 승인 필수 및 특정 브랜치 머지 제한.
- **Result**: 빌드 실패율 감소 및 배포 실수 방지 체계 구축. P(n) 룰 도입으로 코드리뷰 응답 시간 단축.
