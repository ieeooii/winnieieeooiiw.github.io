import { useEffect, useState } from 'react'

export const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 0)
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])
  return scrolled
}
