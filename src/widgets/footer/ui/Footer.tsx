import { EMAIL, MAILTO, LINKEDIN } from '../../../shared/config/contact'
import { useLanguage } from '../../../shared/i18n'
import * as s from './footer.css'

export const Footer = () => {
  const { t } = useLanguage()

  return (
    <footer className={s.footer} id="contact">
      <div className={s.container}>
        <div className={s.top}>
          <div className={s.brand}>
            <span className={s.logo}>Woojin Lee</span>
            <p className={s.tagline}>
              {t.footer.tagline.split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </p>
          </div>

          <div className={s.navGroup}>
            <p className={s.navGroupLabel}>{t.footer.contact}</p>
            <a href={MAILTO} className={s.navLink}>{EMAIL}</a>
            <p className={s.navText}>Seoul, Korea</p>
          </div>
        </div>

        <div className={s.bottom}>
          <p>{t.footer.copyright}</p>
          <div className={s.socialLinks}>
            <a href="https://github.com/ieeooii" target="_blank" rel="noopener noreferrer" className={s.socialLink}>GitHub</a>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={s.socialLink}>LinkedIn</a>
            <a href="https://ieeooii.notion.site/" target="_blank" rel="noopener noreferrer" className={s.socialLink}>Blog</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
