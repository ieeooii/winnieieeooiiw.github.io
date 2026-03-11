import { Button, button } from '../../../shared/ui'
import * as s from './navbar.css'

const NAV_ITEMS = [
  { label: 'Home', href: '#', active: true },
  { label: 'Works', href: '#works' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export const Navbar = () => (
  <header className={s.header}>
    <div className={s.inner}>
      <a href="#" className={s.logo}>
        ieeooii
      </a>

      <nav className={s.pillGroup} aria-label="Primary navigation">
        {NAV_ITEMS.map(({ label, href, active }) => (
          <Button
            key={label}
            as="a"
            href={href}
            className={active ? button.navPillActive : button.navPill}
          >
            {label}
          </Button>
        ))}
      </nav>

      <Button as="a" href="#contact" className={button.primary}>
        Book a call
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Button>
    </div>
  </header>
)
