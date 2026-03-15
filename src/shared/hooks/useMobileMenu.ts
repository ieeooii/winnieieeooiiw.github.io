import { useEffect, useState } from 'react'

export const useMobileMenu = (pathname: string) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpen(false)
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => { document.body.classList.remove('menu-open') }
  }, [open])

  return { open, toggle: () => setOpen(o => !o) }
}
