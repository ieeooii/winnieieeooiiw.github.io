import { useEffect, useState } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'theme'
const CYCLE: ThemeMode[] = ['light', 'dark', 'system']

function getInitialMode(): ThemeMode {
  if (typeof window === 'undefined') return 'system'
  return (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'system'
}

function resolveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode !== 'system') return mode
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useDarkMode() {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)

  useEffect(() => {
    const apply = () => {
      document.documentElement.dataset.theme = resolveTheme(mode) === 'dark' ? 'dark' : ''
    }

    apply()
    localStorage.setItem(STORAGE_KEY, mode)

    if (mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      mq.addEventListener('change', apply)
      return () => mq.removeEventListener('change', apply)
    }
  }, [mode])

  const toggle = () => setMode((m) => CYCLE[(CYCLE.indexOf(m) + 1) % CYCLE.length])

  return { mode, toggle }
}
