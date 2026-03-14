import { useState } from 'react'
import { useLocation } from 'wouter'
import { tag } from '../../../shared/ui'
import { PROJECTS } from '../data/projects'
import * as s from './portfolio.css'

const FILTERS = ['All', 'SaaS', 'E-Commerce', 'CLO Virtual Fashion']

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #c8f5dc, #90e8b8)',
  'linear-gradient(135deg, #cce0fd, #99c4fb)',
  'linear-gradient(135deg, #fde0cc, #fbbf99)',
  'linear-gradient(135deg, #e0ccfd, #c199fb)',
  'linear-gradient(135deg, #fdfacc, #faf599)',
]

export const PortfolioPage = () => {
  const [, navigate] = useLocation()
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All'
    ? PROJECTS
    : activeFilter === 'CLO Virtual Fashion'
      ? PROJECTS.filter(p => p.company === activeFilter)
      : PROJECTS.filter(p => p.category === activeFilter)

  return (
    <main className={s.page}>
      <div className={s.gridContainer}>
        <header className={s.gridHeader}>
          <h1 className={s.gridTitle}>Projects</h1>
          <p className={s.gridSubtitle}>
            Frontend engineering work across product, infrastructure, and developer experience.
          </p>
        </header>

        <div className={s.filterRow}>
          {FILTERS.map(f => (
            <button
              key={f}
              className={activeFilter === f ? s.filterTagActive : s.filterTag}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <section className={s.projectGrid}>
          {filtered.map((project, i) => (
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
                  <span key={tech} className={tag.outline}>{tech}</span>
                ))}
              </div>
              <div className={s.cardTagRow}>
                <span className={tag.brand}>{project.company}</span>
                {project.category && (
                  <span className={tag.brand}>{project.category}</span>
                )}
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
