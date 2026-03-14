import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useParams, useLocation } from 'wouter'
import { PROJECTS } from '../data/projects'
import * as s from './portfolio.css'

export const ProjectDetailPage = () => {
  const params = useParams<{ id: string }>()
  const [, navigate] = useLocation()
  const project = PROJECTS.find((p) => p.id === params.id) ?? PROJECTS[0]

  return (
    <main className={s.page}>
      <div className={s.detailContainer}>
        <button className={s.backButton} onClick={() => navigate('/projects')}>
          ← Projects로 돌아가기
        </button>
        <div className={s.markdownBody}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{project.rawContent}</ReactMarkdown>
        </div>
      </div>
    </main>
  )
}
