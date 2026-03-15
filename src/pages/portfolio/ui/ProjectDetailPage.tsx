import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useParams } from 'wouter'
import { PROJECTS } from '../data/projects'
import * as s from './portfolio.css'

export const ProjectDetailPage = () => {
  const params = useParams<{ id: string }>()
  const project = PROJECTS.find((p) => p.id === params.id) ?? PROJECTS[0]

  return (
    <main className={s.page}>
      <div className={s.detailContainer}>
        <div className={s.markdownBody}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.rawContent}</ReactMarkdown>
        </div>
      </div>
    </main>
  )
}
