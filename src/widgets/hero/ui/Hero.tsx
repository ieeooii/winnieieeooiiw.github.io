import * as s from './hero.css'

const BADGES = [
  { label: 'Clutch', title: 'CHAMPION', sub: 'FALL 2023' },
  { label: 'Clutch', title: 'GLOBAL', sub: 'FALL 2024' },
  { label: 'Clutch', title: 'GLOBAL', sub: 'SPRING 2024' },
]

export const Hero = () => (
  <section className={s.section}>
    <div className={s.container}>
      <div className={s.content}>
        <h1
          className={s.heading}
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}
        >
          Your reliable{' '}
          <span className={s.headingHighlight}>
            website
          </span>
          {' '}design partner
        </h1>

        <div className={s.badgeRow}>
          {BADGES.map(({ label, title, sub }) => (
            <div key={`${label}-${sub}`} className={s.badgeCard}>
              <p className={s.badgeLabel}>{label}</p>
              <p className={s.badgeTitle}>{title}</p>
              <p className={s.badgeSub}>{sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={s.visual}>
        <div className={s.glow} aria-hidden="true" />
      </div>
    </div>
  </section>
)
