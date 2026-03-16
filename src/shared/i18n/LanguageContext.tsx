import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { ko } from './ko'
import { en } from './en'
import type { Lang, Translations } from './types'

type LanguageContextValue = {
  lang: Lang
  t: Translations
  toggle: () => void
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'ko',
  t: ko,
  toggle: () => {},
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem('lang') as Lang | null) ?? 'ko'
  })

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggle = useMemo(() => () => setLang((l) => (l === 'ko' ? 'en' : 'ko')), [])
  const t = lang === 'ko' ? ko : en
  const value = useMemo(() => ({ lang, t, toggle }), [lang, t, toggle])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  return useContext(LanguageContext)
}
