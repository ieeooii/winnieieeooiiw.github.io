import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button, button } from '../../../shared/ui'
import { MAILTO } from '../../../shared/config/contact'
import * as s from './navbar.css'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
]

const useScrolled = () => {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 0)
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])
  return scrolled
}

const useMobileMenu = (pathname: string) => {
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

// ── Sub-components ────────────────────────────────────────────────────────────

const isActive = (href: string, pathname: string) =>
  href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/')

const DesktopNav = ({ pathname }: { pathname: string }) => (
  <div className={s.right}>
    <nav className={s.pillGroup} aria-label="Primary navigation">
      {NAV_ITEMS.map(({ label, href }) => (
        <Link key={label} href={href} className={isActive(href, pathname) ? button.navPillActive : button.navPill}>
          {label}
        </Link>
      ))}
    </nav>
    <Button as="a" href={MAILTO} className={`${button.primary} ${s.desktopOnly}`}>
      Hire me
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Button>
  </div>
)

const HamburgerButton = ({ open, onToggle }: { open: boolean; onToggle: () => void }) => (
  <button className={s.hamburger} aria-label="Toggle menu" aria-expanded={open} onClick={onToggle}>
    {open ? (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    ) : (
      <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    )}
  </button>
)

const MobileMenu = ({ pathname }: { pathname: string }) => (
  <div className={s.mobileMenu} aria-label="Mobile navigation">
    <nav className={s.mobileNavList}>
      {NAV_ITEMS.map(({ label, href }) => (
        <Link key={label} href={href} className={isActive(href, pathname) ? s.mobileNavItemActive : s.mobileNavItem}>
          {label}
        </Link>
      ))}
    </nav>
  </div>
)

// ── Navbar ────────────────────────────────────────────────────────────────────

export const Navbar = () => {
  const [pathname] = useLocation()
  const scrolled = useScrolled()
  const { open, toggle } = useMobileMenu(pathname)

  return (
    <>
      <header className={scrolled ? s.header : s.headerTransparent}>
        <div className={s.inner}>
          <Link href="/" className={s.logo}>ieeooii</Link>
          <DesktopNav pathname={pathname} />
          <HamburgerButton open={open} onToggle={toggle} />
        </div>
      </header>
      {open && <MobileMenu pathname={pathname} />}
    </>
  )
}
