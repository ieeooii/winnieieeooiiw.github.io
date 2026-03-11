import * as s from './footer.css'

export const Footer = () => (
  <footer className={s.footer}>
    <div className={s.container}>
      <div className={s.top}>
        <div className={s.brand}>
          <span className={s.logo}>ieeooii</span>
          <p className={s.tagline}>
            Crafting exceptional digital experiences for ambitious brands globally.
          </p>
        </div>

        <nav className={s.nav} aria-label="Footer navigation">
          <div className={s.navGroup}>
            <p className={s.navGroupLabel}>Navigation</p>
            <a href="#" className={s.navLink}>Home</a>
            <a href="#works" className={s.navLink}>Works</a>
            <a href="#skills" className={s.navLink}>Skills</a>
            <a href="#contact" className={s.navLink}>Contact</a>
          </div>
          <div className={s.navGroup}>
            <p className={s.navGroupLabel}>Contact</p>
            <a href="mailto:hello@ieeooii.dev" className={s.navLink}>
              hello@ieeooii.dev
            </a>
            <p className={s.navText}>Seoul, Korea</p>
          </div>
        </nav>
      </div>

      <div className={s.bottom}>
        <p>© 2026 ieeooii. All rights reserved.</p>
        <div className={s.socialLinks}>
          <a href="https://github.com/ieeooii" target="_blank" rel="noopener noreferrer" className={s.socialLink}>
            GitHub
          </a>
          <a href="#" className={s.socialLink}>Twitter</a>
          <a href="#" className={s.socialLink}>LinkedIn</a>
        </div>
      </div>
    </div>
  </footer>
)
