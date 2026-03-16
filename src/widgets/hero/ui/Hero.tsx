import { useMemo } from 'react'
import { GlowBlob } from './GlowBlob'
import { BadgeCard } from '../../../shared/ui/badge/BadgeCard'
import { getProjects } from '../../../pages/portfolio/data/projects'
import { useTypeWriter } from '../../../shared/hooks'
import { useLanguage } from '../../../shared/i18n'
import * as s from './hero.css'

export const Hero = () => {
  const { t, lang } = useLanguage()
  const displayed = useTypeWriter(t.hero.words)
  const projectCount = useMemo(() => getProjects(lang).length, [lang])

  return (
    <section className={s.section} id="home">
      <GlowBlob />
      <div className={s.container}>
        <div className={s.content}>
          <h1 className={s.heading}>
            <span className={s.headingNoWrap}>{t.hero.sentence1}</span>
            <br />
            {t.hero.sentence2prefix}
            <span className={s.headingHighlight}>
              <span
                className={s.headingHighlightText}
                aria-live="polite"
                aria-atomic="true"
              >{displayed}</span>
            </span>
            {t.hero.sentence2suffix && <><br />{t.hero.sentence2suffix}</>}
          </h1>

          <div className={s.badgeRow}>
            <BadgeCard label={t.hero.badges.exp.label} title={t.hero.badges.exp.title} sub={t.hero.badges.exp.sub} />
            <BadgeCard label={t.hero.badges.proj.label} title={`${projectCount}`} sub={t.hero.badges.proj.sub} />
            <BadgeCard label={t.hero.badges.focus.label} title={t.hero.badges.focus.title} sub={t.hero.badges.focus.sub} />
          </div>
        </div>

        <div className={s.visual} />
        <p className={s.name} aria-hidden="true">WOOJIN LEE</p>
      </div>
    </section>
  )
}
