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
    bio: 'A well-organized folder structure and architecture, and detailed, consistent components and UI/UX excite me more than anything flashy. When the same problem shows up twice, I suspect the structure, not the code.\nAt CLO Virtual Fashion, I have worked across a range of services, from legacy migrations to a 3D fashion SaaS.\nI build features too, but I have spent more time on the work that keeps the team from solving the same problem twice — establishing code conventions and growing our design system from v1.0 to v4.0.\nCuriosity about user experience led me to graduate school, where I researched recommender systems. I see technology as a tool for the business, and I believe sustainable structure and a good user experience are what actually grow a service.\nBefore asking how fast we can build something, I ask why we are building it. I believe decisions made that way serve both users and teammates longer.\nI love frontend work. I want to keep doing it for a long time, so I have exercised steadily for years — a healthy body and mind matter as much as good code. I also love reading — words on a screen get skimmed, but words on paper get chewed over, so I prefer paper.\nI want to be a developer who plays good catch. Good collaboration is, in the end, about throwing well and catching well — whether it is a code review or feedback, I try to throw so the other person can catch, and not to drop whatever comes my way.',
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
      date: 'August 2025',
    },
    edu2: {
      title: 'Visual Communication Design',
      sub: 'Associate\'s GPA 4.2 / 4.5 · Bachelor\'s GPA 3.89 / 4.5',
      date: 'August 2018',
    },
    sectionPub: 'Publication',
    pubAbstractLabel: 'Abstract ↓',
    sectionTraining: 'Training / Certification',
    training1: { date: 'August 2019' },
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
    prevProject: 'Prev',
    nextProject: 'Next',
    saasImageNotice: 'Garment images are self-created or default content provided by the platform.',
    notFound: 'Project not found.',
    backToList: 'Back to projects',
  },
}
