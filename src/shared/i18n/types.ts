export type Lang = 'ko' | 'en'

export type Translations = {
  nav: {
    home: string
    projects: string
    about: string
    hireMe: string
  }
  hero: {
    sentence1: string
    sentence2prefix: string
    sentence2suffix: string
    words: string[]
    badges: {
      exp: { label: string; title: string; sub: string }
      proj: { label: string; sub: string }
      focus: { label: string; title: string; sub: string }
    }
  }
  footer: {
    tagline: string
    contact: string
    copyright: string
  }
  about: {
    pageTitle: string
    headline: string
    bio: string
    sectionExp: string
    companyName: string
    exp1: { role: string; period: string; projectName: string; desc: string }
    exp2: { role: string; period: string; projectName: string; desc: string }
    exp3: { role: string; period: string; desc: string }
    sectionEdu: string
    edu1: { title: string; sub: string; date: string }
    edu2: { title: string; sub: string; date: string }
    sectionPub: string
    pubAbstractLabel: string
    sectionTraining: string
    training1: { date: string }
  }
  portfolio: {
    title: string
    subtitle: string
    filterAll: string
    searchPlaceholder: string
    noResults: string
    prevProject: string
    nextProject: string
    saasImageNotice: string
  }
  projects: {
    viewAll: string
  }
}
