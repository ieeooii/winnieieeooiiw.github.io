import { useEffect, useState } from 'react'

export const useMobileMenu = (pathname: string) => {
  const [openPathname, setOpenPathname] = useState<string | null>(null)
  const open = openPathname === pathname

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    return () => { document.body.classList.remove('menu-open') }
  }, [open])

  return { open, toggle: () => setOpenPathname(p => p === null ? pathname : null) }
}
