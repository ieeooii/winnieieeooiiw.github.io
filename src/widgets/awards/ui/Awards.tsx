import * as s from './awards.css'

type AwardRow = {
  id: string
  count: string
  platform: string
  items: string[]
}

const AWARDS: AwardRow[] = [
  {
    id: 'awwwards',
    count: '29',
    platform: 'AWWWARDS',
    items: ['Site Of The Day', 'Honourable Mention', 'Mobile Excellence'],
  },
  {
    id: 'cssda',
    count: '29',
    platform: 'CSSDA',
    items: ['Website Of The Day', 'Special Kudos', 'Best UI Design', 'Best UX Design', 'Best Innovation'],
  },
  {
    id: 'behance',
    count: '60',
    platform: 'Behance',
    items: [
      'Best of Behance',
      'Featured in UI/UX',
      'Featured in Logo',
      'Featured in Illustrator',
      'Featured in XD',
      'Featured in Stock',
    ],
  },
  {
    id: 'others',
    count: '50',
    platform: 'Others',
    items: [
      'WebGuru', 'Top Design King', 'CssLight',
      'Orpetron', 'Design Nominees', 'CSSWinner',
      'CSSNectar', 'CSSReel', 'CSSBest',
      'WD Awards',
    ],
  },
]

export const Awards = () => (
  <section className={s.section} id="awards">
    <div className={s.container}>
      <div className={s.titleBlock}>
        <h2 className={s.title}>Awards</h2>
        <p className={s.subtitle}>we are proud of</p>
      </div>

      <ul className={s.list} role="list">
        {AWARDS.map(({ id, count, platform, items }) => (
          <li key={id} className={s.row}>
            <span className={s.rowSlash} aria-hidden="true">//</span>
            <h3 className={s.rowName}>
              <span className={s.rowNameAccent}>x</span> {count} {platform}
            </h3>
            <ul className={s.rowItems} role="list">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </section>
)
