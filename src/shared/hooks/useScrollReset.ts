import { useLayoutEffect } from 'react'
import { useHashLocation } from 'wouter/use-hash-location'

export const useScrollReset = () => {
  const [pathname] = useHashLocation()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
}
