import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useParams, useLocation } from 'wouter'
import { getProjects } from '../data/projects'
import { useLanguage } from '../../../shared/i18n'
import * as s from './portfolio.css'

export const ProjectDetailPage = () => {
  const params = useParams<{ id: string }>()
  const [, navigate] = useLocation()
  const { lang, t } = useLanguage()
  const projects = getProjects(lang)
  const idx = projects.findIndex((p) => p.id === params.id)
  const project = idx >= 0 ? projects[idx] : projects[0]
  const prev = idx > 0 ? projects[idx - 1] : null
  const next = idx < projects.length - 1 ? projects[idx + 1] : null

  return (
    <main className={s.page}>
      <div className={s.detailContainer}>
        {project.category === 'SaaS' && (
          <p className={s.saasNotice}>ℹ️ {t.portfolio.saasImageNotice}</p>
        )}
        <div className={s.markdownBody}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              img: ({ src, alt }) => (
                <figure className={s.figure}>
                  <img src={src} alt={alt} className={s.figureImg} />
                  {alt && <figcaption className={s.figureCaption}>{alt}</figcaption>}
                </figure>
              ),
            }}
          >
            {project.rawContent}
          </ReactMarkdown>
        </div>

        <nav className={s.projectNav}>
          {prev ? (
            <button className={s.projectNavBtn} onClick={() => navigate(`/projects/${prev.id}`)}>
              <span className={s.projectNavLabel}>← {t.portfolio.prevProject}</span>
              <span className={s.projectNavTitle}>{prev.title}</span>
            </button>
          ) : <span />}
          {next ? (
            <button className={`${s.projectNavBtn} ${s.projectNavBtnNext}`} onClick={() => navigate(`/projects/${next.id}`)}>
              <span className={s.projectNavLabel}>{t.portfolio.nextProject} →</span>
              <span className={s.projectNavTitle}>{next.title}</span>
            </button>
          ) : <span />}
        </nav>
      </div>
    </main>
  )
}
