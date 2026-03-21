import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useParams } from 'wouter'
import { getProjects } from '../data/projects'
import { useLanguage } from '../../../shared/i18n'
import * as s from './portfolio.css'

export const ProjectDetailPage = () => {
  const params = useParams<{ id: string }>()
  const { lang } = useLanguage()
  const projects = getProjects(lang)
  const project = projects.find((p) => p.id === params.id) ?? projects[0]

  return (
    <main className={s.page}>
      <div className={s.detailContainer}>
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
      </div>
    </main>
  )
}
