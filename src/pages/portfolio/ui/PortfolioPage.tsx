import { useLocation } from 'wouter'
import { PROJECTS } from '../data/projects'
import * as s from './portfolio.css'

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #c8f5dc, #90e8b8)',
  'linear-gradient(135deg, #cce0fd, #99c4fb)',
  'linear-gradient(135deg, #fde0cc, #fbbf99)',
  'linear-gradient(135deg, #e0ccfd, #c199fb)',
  'linear-gradient(135deg, #fdfacc, #faf599)',
]

export const PortfolioPage = () => {
  const [, navigate] = useLocation()

  return (
    <main className={s.page}>
      <div className={s.gridContainer}>
        <header className={s.gridHeader}>
          <h1 className={s.gridTitle}>Projects</h1>
        </header>

        <section className={s.projectGrid}>
          {PROJECTS.map((project, i) => (
            <article
              key={project.id}
              className={s.projectCard}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div
                className={s.cardThumb}
                style={{ background: CARD_GRADIENTS[i % CARD_GRADIENTS.length] }}
              />
              <h3 className={s.cardTitle}>{project.title}</h3>
              <div className={s.cardTagRow}>
                {project.stack.slice(0, 3).map((tech) => (
                  <span key={tech} className={s.tagOutline}>{tech}</span>
                ))}
              </div>
              <div className={s.cardTagRow}>
                <span className={s.tagBrand}>{project.company}</span>
                <span className={s.tagBrand}>{project.period.split(' ')[0]}</span>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
