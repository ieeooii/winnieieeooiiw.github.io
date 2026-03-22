import type { Translations } from './types'

export const ko: Translations = {
  nav: {
    home: '홈',
    projects: '프로젝트',
    about: '소개',
    hireMe: '함께 일해요',
  },
  hero: {
    sentence1: '프론트엔드 엔지니어.',
    sentence2prefix: '문제를 ',
    sentence2suffix: ' 바꿉니다.',
    words: ['구조로', '시스템으로', 'AI 워크플로우로', '솔루션으로', '제품으로', '경험으로'],
    badges: {
      exp: { label: '경력', title: '6+ YRS', sub: 'FRONTEND' },
      proj: { label: '프로젝트', sub: 'COMPLETED' },
      focus: { label: '포커스', title: 'REACT', sub: 'TYPESCRIPT' },
    },
  },
  footer: {
    tagline: '문제를 구조로 바꾸다.\n— AI는 일하는 방법론이다.',
    contact: '연락처',
    copyright: '© 2026 Woojin Lee. All rights reserved.',
  },
  about: {
    pageTitle: 'About',
    headline: '문제를 구조로 바꾸는 프론트엔드 엔지니어',
    bio: '저는 화면을 구현하는 개발자를 넘어, 문제를 구조로 해결하는 프론트엔드 엔지니어입니다. CLO Virtual Fashion에서 근무하며 기능 개발에 머무르지 않고, 서비스 전반의 문제를 정의하고 기술적 대안을 설계하는 역할을 수행해왔습니다. 레거시 One-Repo 구조로 인한 성능 저하와 복잡한 의존성 문제를 해결하기 위해 모노레포 전환과 App Router 기반 아키텍처를 설계했고, 그 결과 로딩 속도 40% 개선과 핵심 성능 지표 35% 향상을 이끌어냈습니다. 또한 Next.js 기반 공통 에러 핸들링 라이브러리를 설계해 사용자 경험을 개선하는 동시에, 에러 모니터링 효율을 분 단위로 단축했습니다. 디자인 시스템 번들 최적화, 코드 분할, 공통 툴링 구축을 통해 팀 전체의 개발 생산성과 일관성을 높였으며, 퍼널 개선 프로젝트에서는 로그 설계부터 UX 개선까지 주도해 유료 전환율을 단계적으로 14% 이상 향상시켰습니다. 저는 단기적인 기능 구현보다, 장기적으로 유지 가능한 구조와 팀의 성장에 기여하는 엔지니어를 지향합니다.',
    sectionExp: 'Experience',
    companyName: 'CLO Virtual Fashion Inc.',
    exp1: {
      role: 'Frontend Engineer',
      period: '2022. 02 – 현재',
      projectName: 'CLO-SET | CLO\'s Next digital fashion Platform',
      desc: 'Hugo Boss, GAP, Bestseller 등 글로벌 패션 회사에서 사용 중인 플랫폼으로, 디자인·개발·생산·리테일·소비로 이어지는 의류 Lifecycle 클라우드 기반 3D 의상 SaaS',
    },
    exp2: {
      role: 'Frontend Developer',
      period: '2020. 11 – 2022. 01',
      projectName: 'CONNECT - The Best 3D Clothing Models',
      desc: '3D 의상 공유, 커뮤니케이션, 판매, 구매 글로벌 디지털 의상 커뮤니티 Open Marketplace | E-Commerce 서비스',
    },
    exp3: {
      role: 'Web Developer',
      period: '2019. 11 – 2020. 10',
      desc: 'NXP(New Experience Platform) Team',
    },
    sectionEdu: 'Education',
    edu1: {
      title: '한양대학교 대학원 공학석사',
      sub: '컴퓨터공학 전공 · GPA 4.17 / 4.5',
    },
    edu2: {
      title: '시각디자인학 전공',
      sub: '전문학사 GPA 4.2 / 4.5 · 학사 GPA 3.89 / 4.5',
    },
    sectionPub: 'Publication',
    pubAbstractLabel: 'Abstract ↓',
    sectionTraining: 'Training / Certification',
  },
  projects: {
    viewAll: '전체 프로젝트\n보러가기',
  },
  portfolio: {
    title: 'Projects',
    subtitle: 'Frontend engineering work across product, infrastructure, and developer experience.',
    filterAll: '전체',
    searchPlaceholder: '프로젝트 검색 (제목, 기술 스택, 회사)',
    noResults: '검색 결과가 없습니다.',
  },
}
