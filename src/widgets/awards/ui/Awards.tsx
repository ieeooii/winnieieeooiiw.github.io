import * as s from './awards.css'

type StackRow = {
  id: string
  category: string
  items: string[]
}

const STACK: StackRow[] = [
  {
    id: 'frontend',
    category: 'Frontend',
    items: ['React.js', 'Next.js', 'TypeScript'],
  },
  {
    id: 'state',
    category: 'State Management',
    items: ['TanStack Query', 'Jotai'],
  },
  {
    id: 'styling',
    category: 'Styling',
    items: ['Emotion.js'],
  },
  {
    id: 'tools',
    category: 'Tools',
    items: ['Jira', 'Slack', 'GitHub', 'WebStorm', 'Visual Studio Code', 'Figma', 'Claude.ai'],
  },
]

export const Awards = () => (
  <section className={s.section} id="skills">
    <div className={s.container}>
      <div className={s.titleBlock}>
        <h2 className={s.title}>Key Skills</h2>
        <p className={s.subtitle}>what I work with</p>
      </div>

      <ul className={s.list} role="list">
        {STACK.map(({ id, category, items }) => (
          <li key={id} className={s.row}>
            <span className={s.rowSlash} aria-hidden="true">//</span>
            <h3 className={s.rowName}>
              <span className={s.rowNamePrefix}>x </span>{category}
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
