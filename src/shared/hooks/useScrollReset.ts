import { useLayoutEffect } from 'react'
import { useLocation } from 'wouter'

export const useScrollReset = () => {
  const [pathname] = useLocation()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}
