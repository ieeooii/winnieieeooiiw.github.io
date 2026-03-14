export type Implementation = {
  title: string
  problem?: string[]
  solve?: string[]
  result?: string[]
  insight?: string
}

export type Project = {
  id: string
  company: string
  title: string
  period: string
  stack: string[]
  team: string
  link?: string
  description: string[]
  implementations: Implementation[]
  retrospective?: string[]
}

export const PROJECTS: Project[] = [
  {
    id: 'monorepo',
    company: 'CLO Virtual Fashion',
    title: '모노레포 도입 및 웹 플랫폼 리뉴얼',
    period: '2023.06 ~ 2024.03',
    stack: ['Next.js (App Router)', 'React.js', 'TypeScript', 'TanStack Query', 'Jotai', 'Yarn Berry PnP'],
    team: '프론트엔드 1, 데브옵스 1 (프론트엔드 담당)',
    description: [
      '레거시 One-Repo 구조로 인한 빌드 타임 증가와 과도한 코드 의존성, Core Web Vitals 지표 악화 문제 해결',
      '모노레포 전환과 App Router 기반 아키텍처 재설계로 로딩 속도 40% 개선, 핵심 성능 지표 35% 향상',
    ],
    implementations: [
      {
        title: '모노레포 환경 구축',
        problem: ['레거시 구조로 빌드 타임이 길고 코드 간 의존성이 과도하게 얽혀 있었으며, 페이지 초기 로딩 성능 저하로 Core Web Vitals 지표 악화'],
        solve: [
          'Yarn Berry PnP 채택으로 빌드 의존성 최소화, PnP 미지원 라이브러리는 packageExtensions로 패치',
          '.gitattributes에 .pnp.*를 binary로 지정, compressionLevel: mixed 설정으로 Git 충돌 최소화',
          'config-plugin 구성으로 패키지 간 타입 공유 환경 구축, --topological-dev 옵션으로 의존성 기반 빌드 순서 자동화',
        ],
        result: ['레거시 대비 페이지 로딩 속도 약 40% 개선', 'Datadog RUM 기준 FCP/LCP/LT 종합 평균 35% 성능 향상'],
        insight: 'Yarn Berry PnP 채택 후 Git 충돌 빈도 증가와 대규모 확장 시 빌드 오케스트레이션 한계를 경험. pnpm + Turborepo 조합이 더 적합했을 것으로 판단',
      },
      {
        title: '번들 최적화 및 라우팅 구조 개선',
        solve: [
          'Next.js dynamic import로 페이지 단위 코드 스플리팅 적용, 초기 로딩 리소스 최소화',
          'App Router 구조 기반 라우팅 계층과 레이아웃 분리로 중첩 페이지 구조를 유연하게 설계',
        ],
      },
      {
        title: '상태 관리 이원화 및 API 캐싱 전략 재설계',
        solve: [
          '로컬 상태는 Jotai, 서버 상태는 TanStack Query로 이원화하여 렌더링 효율성과 유지보수성 동시 확보',
          'TanStack Query 기반 API 캐싱 전략 재설계로 불필요한 네트워크 요청 최소화',
        ],
      },
    ],
  },
  {
    id: 'error-system',
    company: 'CLO Virtual Fashion',
    title: '프론트엔드 에러 시스템',
    period: '2022.09 ~ 2023.02',
    stack: ['Next.js', 'React.js', 'TypeScript', 'Emotion.js', 'Storybook', 'Datadog'],
    team: '프론트엔드 1, 백엔드 1, 프로덕트 디자이너 1 (프론트엔드 담당)',
    description: [
      '단일 에러 페이지로 인한 사용자 기능 전면 차단 문제와 시간/일 단위의 비효율적인 에러 모니터링 개선',
      'UX 관점 반대 의견을 에러 케이스 전수 분석 및 발표로 설득, Next.js 기반 공통 에러 핸들링 라이브러리 전담 설계·구현',
    ],
    implementations: [
      {
        title: '에러 타입 세분화 및 Boundary 분리',
        problem: ['단일 에러 페이지로 에러 발생 시 사용자 기능 전면 차단', '시간/일 단위로 비효율적인 에러 모니터링'],
        solve: [
          '에러를 네트워크·인증·권한·서버 등으로 세분화',
          'Partial·Toast·Global(Route 단위) Error Boundary를 분리해 사용자 기능 전면 차단 최소화',
        ],
        result: ['사용자 리포트 시 즉시 에러 추적 가능한 구조 구현', '모니터링 효율을 시간/일 단위에서 분 단위로 단축'],
      },
      {
        title: 'SSR 에러 핸들링 모듈 구축',
        problem: ['Next.js 보안 정책으로 error.tsx에서 SSR 에러 추적 불가'],
        solve: [
          '페이지 컴포넌트의 prop 제약으로 HOC 대신 closure 형태의 ssrErrorInterceptor 설계',
          '상태코드·Tracking ID 등 에러 데이터를 클라이언트에서 수신할 수 있도록 우회 처리',
        ],
        insight: 'SSR 에러를 CSR로 전달 후 throw하는 우회 방식 특성상 에러 UI 노출 시점에 약간의 지연이 발생하는 트레이드오프 존재',
      },
      {
        title: 'API 요청 레이어 구축',
        solve: [
          'Axios Interceptor 기반 request·response·error 처리 통합',
          'axios.isAxiosError() 타입 가드로 500 에러·네트워크 에러 발생 시 TanStack Query retry 옵션으로 최대 3회 재시도',
        ],
      },
    ],
  },
  {
    id: 'design-system',
    company: 'CLO Virtual Fashion',
    title: '디자인 시스템 개발 및 최적화',
    period: '2021.06 ~ 2022.08',
    stack: ['React.js', 'TypeScript', 'Emotion.js', 'Storybook', 'Rollup'],
    team: '프론트엔드 4 (번들 최적화 단독 주도, 컴포넌트 개발 참여)',
    description: [
      '중복 컴포넌트 개발로 인한 UX 불일치와 개발 속도 저하, 디자인 시스템 번들 사이즈 증가로 초기 로딩 속도 저하 문제 해결',
      '번들 사이즈 82% 감소 (2.55MB → 72.66KB), Lighthouse 성능 점수 95점 달성',
    ],
    implementations: [
      {
        title: '번들 최적화',
        problem: ['디자인 시스템 번들 사이즈 증가로 초기 로딩 속도 저하'],
        solve: [
          'Rollup named exports 기반 코드 분할과 sideEffects: false 설정으로 tree-shaking 활성화',
          'ESM 포맷 변환·Rollup externals로 React·Emotion 등 중복 번들링 제거',
          'Emotion.js를 peerDependencies로 전환해 애플리케이션 레벨 단일 인스턴스로 관리',
        ],
        result: [
          '디자인 시스템 번들 사이즈 82% 감소 (Client: 2.55MB → 72.66KB / Node.js: 2.54MB → 126.01KB)',
          '초기 JS 로드 사이즈 398KB → 185KB 개선',
          'Lighthouse 성능 점수 95점 달성',
        ],
      },
      {
        title: '컴포넌트 설계 패턴',
        solve: [
          'Headless 컴포넌트 기반으로 서비스별 스타일 확장 가능한 구조 설계',
          'Compound Component 패턴으로 유연한 합성 구조 구현',
          '폼 컴포넌트 Controlled·Uncontrolled 모두 지원',
        ],
      },
      {
        title: '디자인 토큰 시스템 구축',
        solve: ['Design Token 기반 공통 스타일 시스템 설계로 디자이너와 개발자 간 색상·타이포그래피 불일치 최소화'],
      },
    ],
    retrospective: [
      '브랜치 전략을 stable·release·develop 3단계로 구성했으나, 컴포넌트 수가 40-50개로 많아지면서 단일 develop 브랜치 관리에 한계',
      '컴포넌트별 독립 브랜치로 구성했다면 로컬 테스트와 버전 관리가 더 용이했을 것으로 판단',
    ],
  },
  {
    id: 'growth',
    company: 'CLO Virtual Fashion',
    title: '유료 전환율 개선 프로젝트',
    period: '2022.03 ~ 2022.09',
    stack: ['Next.js', 'React.js', 'TypeScript'],
    team: '프론트엔드 1, 데이터 엔지니어 1, 데이터 분석가 1, 운영 1, UX 1 (프론트엔드 담당)',
    description: [
      '가격 정책 개편 시 무료 플랜 사용자의 결제 전환율이 낮았으나 원인 파악을 위한 데이터 부족',
      'DE·DA와 협업해 FE 로깅 스펙 논의부터 구현, 퍼널 분석 기반 UX 개선까지 전 과정 주도. 총 전환율 14%↑ 달성',
    ],
    implementations: [
      {
        title: 'FE 로깅 설계 및 구현',
        solve: [
          'DE·DA와 이벤트 스펙 협의',
          '클릭·뷰·CTA 등 전환 퍼널 핵심 지점에 trackEvent() 기반 로깅 구현',
        ],
      },
      {
        title: '퍼널 분석 기반 UX 개선',
        solve: ['퍼널 분석을 통해 전환 효과가 낮은 구간을 식별하고 개선된 UX·UI를 개발 및 적용'],
        result: [
          '가격 정책 개편 초기 유료 전환율 약 +10% 달성',
          '퍼널 분석 기반 UX 개선으로 추가 +4% 향상 (총 14%↑)',
        ],
        insight: '이벤트마다 trackEvent()를 직접 호출하는 방식으로 구현했으며, HOC나 Custom Hook 기반 로깅 모듈로 추상화하면 관심사 분리와 유지보수 측면에서 더 적합',
      },
    ],
  },
  {
    id: 'dx',
    company: 'CLO Virtual Fashion',
    title: 'AI 개발 환경 구축 및 CI/CD 설계',
    period: '2023.01 ~ 2023.06',
    stack: ['Claude.ai', 'Gemini', 'Husky', 'ESLint', 'GitHub Actions'],
    team: '프론트엔드 1, 데브옵스 1 (프론트엔드 담당)',
    description: [
      '수동 코드 리뷰로 인한 병목과 컨벤션 미준수, 비표준화된 브랜치 전략으로 인한 빌드 실패·배포 실수 문제 해결',
      '개발 속도 50~60% 향상, 빌드 실패율 감소 및 코드리뷰 응답 시간 단축',
    ],
    implementations: [
      {
        title: 'AI 보조 개발 환경 구축',
        solve: [
          'AGENTS.md로 코드 컨벤션·보안 규칙을 정의해 Claude.ai 기반 AI 보조 개발에서도 팀 기준 준수',
          'Gemini를 GitHub에 연동해 PR 단위 자동 코드 리뷰 환경 구성',
        ],
        result: ['PR 코드 리뷰 속도 단축 및 컨벤션 위반 감소', '타 업무 병행 기준 개발 속도 약 50~60% 향상 (5일 → 2~2.5일)'],
      },
      {
        title: '브랜치 전략 재설계 및 코드 품질 자동화',
        solve: [
          'enterprise·feature·fix·release 브랜치를 추가한 변형 Git Flow 전략 설계',
          'Husky + ESLint 기반 pre-commit 린트·빌드 체크로 커밋 전 코드 품질 자동 검증',
          'Branch Protection Rules로 리뷰어 승인 필수 및 특정 브랜치 머지 제한',
        ],
        result: ['빌드 실패율 감소 및 배포 실수 방지 체계 구축', 'P(n) 룰 도입으로 코드리뷰 응답 시간 단축'],
      },
    ],
  },
]
