import { Tag, tag } from '../../../shared/ui'
import * as s from './projects.css'

type Project = {
  id: string
  title: string
  image: string
  imageAlt: string
  tags: Array<{ label: string; variant: 'outline' | 'brand' }>
}

const PROJECTS: Project[] = [
  {
    id: 'dashboard',
    title: 'Dashboard UI',
    image: '',
    imageAlt: 'Dashboard UI project',
    tags: [
      { label: 'App design', variant: 'outline' },
      { label: 'Web design', variant: 'outline' },
      { label: 'Fintech', variant: 'brand' },
      { label: 'SaaS', variant: 'brand' },
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Platform',
    image: '',
    imageAlt: 'E-Commerce Platform project',
    tags: [
      { label: 'Web design', variant: 'outline' },
      { label: 'Full-stack', variant: 'brand' },
    ],
  },
  {
    id: 'design-system',
    title: 'Design System',
    image: '',
    imageAlt: 'Design System project',
    tags: [
      { label: 'App design', variant: 'outline' },
      { label: 'SaaS', variant: 'brand' },
    ],
  },
]

export const Projects = () => (
  <section className={s.section} id="works">
    <div className={s.container}>
      <h2 className={s.sectionTitle}>
        Selected <span className={s.titleItalic}>projects</span>
      </h2>

      <div className={s.grid}>
        {PROJECTS.map((project) => (
          <article key={project.id} className={s.projectCard}>
            <div className={s.imageWrap}>
              {project.image && (
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  className={s.image}
                />
              )}
            </div>
            <div className={s.projectInfo}>
              <h3 className={s.projectTitle}>{project.title}</h3>
              <div className={s.tagRow}>
                {project.tags.map(({ label, variant }) => (
                  <Tag key={label} variant={variant} className={tag[variant]}>
                    {label}
                  </Tag>
                ))}
              </div>
            </div>
          </article>
        ))}

        {/* CTA slot */}
        <div className={s.ctaCard} aria-label="Project inquiry">
          <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
          <p className={s.ctaText}>/ Your project<br />could be here /</p>
        </div>
      </div>
    </div>
  </section>
)
