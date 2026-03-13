import { EMAIL, MAILTO } from '../../../shared/config/contact'
import * as s from './footer.css'

export const Footer = () => (
  <footer className={s.footer} id="contact">
    <div className={s.container}>
      <div className={s.top}>
        <div className={s.brand}>
          <span className={s.logo}>ieeooii</span>
          <p className={s.tagline}>
            Building clean, performant interfaces — one component at a time.
          </p>
        </div>

        <div className={s.navGroup}>
          <p className={s.navGroupLabel}>Contact</p>
          <a href={MAILTO} className={s.navLink}>{EMAIL}</a>
          <p className={s.navText}>Seoul, Korea</p>
        </div>
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
