import { useEffect, useState } from 'react'
import { Link, useLocation } from 'wouter'
import { Button, button } from '../../../shared/ui'
import { MAILTO } from '../../../shared/config/contact'
import * as s from './navbar.css'

const NAV_ITEMS = [
  { label: 'Home',  href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog',  href: '/blog' },
]

export const Navbar = () => {
  const [pathname] = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={scrolled ? s.header : s.headerTransparent}>
      <div className={s.inner}>
        <Link href="/" className={s.logo}>
          ieeooii
        </Link>

        <div className={s.right}>
          <nav className={s.pillGroup} aria-label="Primary navigation">
            {NAV_ITEMS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className={pathname === href ? button.navPillActive : button.navPill}
              >
                {label}
              </Link>
            ))}
          </nav>

          <Button as="a" href={MAILTO} className={button.primary}>
            Hire me
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  )
}
