import type { Translations } from './types'

export const en: Translations = {
  nav: {
    home: 'Home',
    projects: 'Projects',
    about: 'About',
    hireMe: 'Hire me',
  },
  hero: {
    sentence1: 'Frontend engineer.',
    sentence2prefix: 'I turn problems into ',
    sentence2suffix: '',
    words: ['systems', 'architectures', 'AI workflows', 'solutions', 'products', 'experiences'],
    badges: {
      exp: { label: 'Experience', title: '6+ YRS', sub: 'FRONTEND' },
      proj: { label: 'Projects', sub: 'COMPLETED' },
      focus: { label: 'Focus', title: 'REACT', sub: 'TYPESCRIPT' },
    },
  },
  footer: {
    tagline: 'Problems become structure.\n— AI is just how I work.',
    contact: 'Contact',
    copyright: '© 2026 Woojin Lee. All rights reserved.',
  },
  about: {
    pageTitle: 'About',
    headline: 'Frontend engineer who turns problems into structure',
    // TODO: translate bio
    bio: 'I am a frontend engineer who goes beyond implementing screens to solve problems through structure. At CLO Virtual Fashion, I have not been limited to feature development — I have defined problems across the entire service and designed technical alternatives. To address performance degradation and complex dependency issues caused by a legacy One-Repo structure, I designed a monorepo transition and App Router-based architecture, resulting in a 40% improvement in loading speed and a 35% improvement in core performance metrics. I also designed a common error handling library based on Next.js, improving user experience while reducing error monitoring time to minutes. Through design system bundle optimization, code splitting, and common tooling, I improved development productivity and consistency across the team. In a funnel improvement project, I led the process from log design to UX improvements, gradually increasing the paid conversion rate by over 14%. I aim to be an engineer who contributes to maintainable structures and team growth over short-term feature delivery.',
    sectionExp: 'Experience',
    companyName: 'CLO Virtual Fashion Inc.',
    exp1: {
      role: 'Frontend Engineer',
      period: '2022. 02 – Present',
      projectName: 'CLO-SET | CLO\'s Next digital fashion Platform',
      // TODO: translate desc
      desc: 'A platform used by global fashion companies including Hugo Boss, GAP, and Bestseller — a cloud-based 3D apparel SaaS covering the full clothing lifecycle from design, development, production, retail, to consumer.',
    },
    exp2: {
      role: 'Frontend Developer',
      period: '2020. 11 – 2022. 01',
      projectName: 'CONNECT - The Best 3D Clothing Models',
      // TODO: translate desc
      desc: 'A global digital fashion community for 3D garment sharing, communication, sales, and purchasing — Open Marketplace | E-Commerce service.',
    },
    exp3: {
      role: 'Web Developer',
      period: '2019. 11 – 2020. 10',
      desc: 'NXP (New Experience Platform) Team',
    },
    sectionEdu: 'Education',
    edu1: {
      title: 'Hanyang University, M.Eng. in Computer Science',
      sub: 'Computer Science · GPA 4.17 / 4.5',
    },
    edu2: {
      title: 'Visual Communication Design',
      sub: 'Associate\'s GPA 4.2 / 4.5 · Bachelor\'s GPA 3.89 / 4.5',
    },
    sectionPub: 'Publication',
    pubAbstractLabel: 'Abstract ↓',
    sectionTraining: 'Training / Certification',
  },
  projects: {
    viewAll: 'View all\nprojects',
  },
  portfolio: {
    title: 'Projects',
    subtitle: 'Frontend engineering work across product, infrastructure, and developer experience.',
    filterAll: 'All',
    searchPlaceholder: 'Search projects (title, tech stack, company)',
    noResults: 'No results found.',
  },
}
