import { GlowBlob } from './GlowBlob'
import { BadgeCard } from '../../../shared/ui/badge/BadgeCard'
import { PROJECTS } from '../../../pages/portfolio/data/projects'
import { useTypeWriter } from '../../../shared/hooks'
import * as s from './hero.css'

const WORDS = ['systems', 'architectures', 'AI workflows', 'solutions', 'products', 'experiences']

const BADGES = [
  { label: 'Experience', title: '6+ YRS', sub: 'FRONTEND' },
  { label: 'Projects', title: `${PROJECTS.length}`, sub: 'COMPLETED' },
  { label: 'Focus', title: 'REACT', sub: 'TYPESCRIPT' },
]

export const Hero = () => {
  const displayed = useTypeWriter(WORDS)

  return (
    <section className={s.section} id="home">
      <GlowBlob />
      <div className={s.container}>
        <div className={s.content}>
          <h1 className={s.heading}>
            <span className={s.headingNoWrap}>Frontend engineer.</span>
            <br />
            I turn problems into{' '}
            <span className={s.headingHighlight}>
              <span
                className={s.headingHighlightText}
                aria-live="polite"
                aria-atomic="true"
              >{displayed}</span>
            </span>
          </h1>

          <div className={s.badgeRow}>
            {BADGES.map(({ label, title, sub }) => (
              <BadgeCard key={label} label={label} title={title} sub={sub} />
            ))}
          </div>
        </div>

        <div className={s.visual} />
        <p className={s.name} aria-hidden="true">WOOJIN LEE</p>
      </div>
    </section>
  )
}
