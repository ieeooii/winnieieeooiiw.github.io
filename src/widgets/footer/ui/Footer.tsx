import { EMAIL, MAILTO, LINKEDIN } from '../../../shared/config/contact'
import * as s from './footer.css'

export const Footer = () => (
  <footer className={s.footer} id="contact">
    <div className={s.container}>
      <div className={s.top}>
        <div className={s.brand}>
          <span className={s.logo}>Woojin Lee</span>
          <p className={s.tagline}>
            Problems become structure.<br />— AI is just how I work.
          </p>
        </div>

        <div className={s.navGroup}>
          <p className={s.navGroupLabel}>Contact</p>
          <a href={MAILTO} className={s.navLink}>{EMAIL}</a>
          <p className={s.navText}>Seoul, Korea</p>
        </div>
      </div>

      <div className={s.bottom}>
        <p>© 2026 Woojin Lee. All rights reserved.</p>
        <div className={s.socialLinks}>
          <a href="https://github.com/ieeooii" target="_blank" rel="noopener noreferrer" className={s.socialLink}>GitHub</a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={s.socialLink}>LinkedIn</a>
        </div>
      </div>
    </div>
  </footer>
)
