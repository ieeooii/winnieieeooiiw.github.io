import { Link, useLocation } from 'wouter'
import { Button, button } from '../../../shared/ui'
import { MAILTO } from '../../../shared/config/contact'
import { useScrolled, useMobileMenu, useDarkMode, type ThemeMode } from '../../../shared/hooks'
import { isActiveRoute } from '../../../shared/utils'
import * as s from './navbar.css'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
]

// ── Sub-components ────────────────────────────────────────────────────────────

const ThemeToggle = ({ mode, onToggle }: { mode: ThemeMode; onToggle: () => void }) => (
  <button className={s.themeToggle} aria-label="Toggle theme" onClick={onToggle}>
    {mode === 'light' && (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    )}
    {mode === 'dark' && (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    )}
    {mode === 'system' && (
      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    )}
  </button>
)

const DesktopNav = ({ pathname, mode, onThemeToggle }: { pathname: string; mode: ThemeMode; onThemeToggle: () => void }) => (
  <div className={s.right}>
    <nav className={s.pillGroup} aria-label="Primary navigation">
      {NAV_ITEMS.map(({ label, href }) => (
        <Link key={label} href={href} className={isActiveRoute(href, pathname) ? button.navPillActive : button.navPill}>
          {label}
        </Link>
      ))}
    </nav>
    <span className={s.desktopOnly}><ThemeToggle mode={mode} onToggle={onThemeToggle} /></span>
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
        <Link key={label} href={href} className={isActiveRoute(href, pathname) ? s.mobileNavItemActive : s.mobileNavItem}>
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
  const { mode, toggle: toggleTheme } = useDarkMode()

  return (
    <>
      <header className={scrolled ? s.header : s.headerTransparent}>
        <div className={s.inner}>
          <Link href="/" className={s.logo}>ieeooii</Link>
          <DesktopNav pathname={pathname} mode={mode} onThemeToggle={toggleTheme} />
          <div className={s.mobileRight}>
            <ThemeToggle mode={mode} onToggle={toggleTheme} />
            <HamburgerButton open={open} onToggle={toggle} />
          </div>
        </div>
      </header>
      {open && <MobileMenu pathname={pathname} />}
    </>
  )
}
