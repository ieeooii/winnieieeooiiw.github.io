import { useMemo } from 'react'
import { useHashLocation } from 'wouter/use-hash-location'
import { Tag, tag } from '../../../shared/ui'
import { getProjects } from '../../../pages/portfolio/data/projects'
import { useLanguage } from '../../../shared/i18n'
import * as s from './projects.css'

const FEATURED_IDS = ['monorepo', 'design-system', 'error-system']

export const Projects = () => {
  const [, navigate] = useHashLocation()
  const { t, lang } = useLanguage()
  const featured = useMemo(() => {
    const projects = getProjects(lang)
    return FEATURED_IDS
      .map(id => projects.find(p => p.id === id))
      .filter(Boolean) as ReturnType<typeof getProjects>
  }, [lang])

  return (
    <section className={s.section} id="works">
      <div className={s.container}>
        <h2 className={s.sectionTitle}>
          Selected <span className={s.titleItalic}>projects</span>
        </h2>

        <div className={s.grid}>
          {featured.map((project) => (
            <article
              key={project.id}
              className={s.projectCard}
              onClick={() => navigate(`/projects/${project.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className={s.imageWrap}
                style={{ background: project.gradient ?? '#f1f5f9' }}
              >
                {project.thumbnail && (
                  <img src={project.thumbnail} alt={project.title} className={s.image} />
                )}
              </div>
              <div className={s.projectInfo}>
                <h3 className={s.projectTitle}>{project.title}</h3>
                <div className={s.tagRow}>
                  {project.stack.slice(0, 4).map((label) => (
                    <Tag key={label} variant="outline" className={tag.outline}>
                      {label}
                    </Tag>
                  ))}
                  {project.company && (
                    <Tag variant="brand" className={tag.brand}>
                      {project.company}
                    </Tag>
                  )}
                </div>
              </div>
            </article>
          ))}

          {/* CTA slot */}
          <div
            className={s.ctaCard}
            aria-label={t.projects.viewAll}
            onClick={() => navigate('/projects')}
            style={{ cursor: 'pointer' }}
          >
            <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
            <p className={s.ctaText}>
              {t.projects.viewAll.split('\n').map((line, i, arr) => (
                <span key={i}>{i === 0 ? `/ ${line}` : line}{i < arr.length - 1 ? <br /> : ' /'}</span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
