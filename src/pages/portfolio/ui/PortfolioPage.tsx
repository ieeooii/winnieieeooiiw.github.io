import { useState, useMemo } from 'react'
import { useLocation } from 'wouter'
import { tag, SearchInput } from '../../../shared/ui'
import { getProjects } from '../data/projects'
import { useLanguage } from '../../../shared/i18n'
import * as s from './portfolio.css'

type FilterKey = 'all' | 'SaaS' | 'E-Commerce' | 'Internal Admin Tool' | 'ETC'

const FILTER_KEYS: FilterKey[] = ['all', 'SaaS', 'E-Commerce', 'Internal Admin Tool', 'ETC']

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #c8f5dc, #90e8b8)',
  'linear-gradient(135deg, #cce0fd, #99c4fb)',
  'linear-gradient(135deg, #fde0cc, #fbbf99)',
  'linear-gradient(135deg, #e0ccfd, #c199fb)',
  'linear-gradient(135deg, #fdfacc, #faf599)',
]

export const PortfolioPage = () => {
  const [, navigate] = useLocation()
  const { t, lang } = useLanguage()
  const projects = getProjects(lang)

  const [activeFilter, setActiveFilter] = useState<FilterKey>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return projects
      .filter(p => activeFilter === 'all' || p.category === activeFilter)
      .filter(p => {
        if (!q) return true
        return (
          p.title.toLowerCase().includes(q) ||
          p.company.toLowerCase().includes(q) ||
          p.stack.some(tech => tech.toLowerCase().includes(q))
        )
      })
  }, [projects, activeFilter, searchQuery])

  return (
    <main className={s.page}>
      <div className={s.gridContainer}>
        <header className={s.gridHeader}>
          <h1 className={s.gridTitle}>{t.portfolio.title}</h1>
          <p className={s.gridSubtitle}>{t.portfolio.subtitle}</p>
        </header>

        <div className={s.filterRowLast}>
          {FILTER_KEYS.map(key => (
            <button
              key={key}
              className={activeFilter === key ? s.filterTagActive : s.filterTag}
              onClick={() => setActiveFilter(key)}
            >
              {key === 'all' ? t.portfolio.filterAll : key}
            </button>
          ))}
          <SearchInput
            style={{ marginLeft: 'auto' }}
            placeholder={t.portfolio.searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <section className={s.projectGrid}>
          {filtered.length === 0 && (
            <p className={s.noResults}>{t.portfolio.noResults}</p>
          )}
          {filtered.map((project, i) => (
            <article
              key={project.id}
              className={s.projectCard}
              onClick={() => navigate(`/projects/${project.id}`)}
            >
              <div className={s.cardThumb} style={{ background: project.gradient ?? CARD_GRADIENTS[i % CARD_GRADIENTS.length] }}>
                {project.thumbnail && (
                  <div className={s.cardThumbImg} style={{ backgroundImage: `url(${project.thumbnail})` }} />
                )}
              </div>
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
