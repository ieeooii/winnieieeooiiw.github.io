import { useParams, useLocation } from 'wouter'
import { PROJECTS, type Project } from '../data/projects'
import * as s from './portfolio.css'

const ProjectContent = ({ project }: { project: Project }) => (
  <article className={s.content}>
    <header className={s.projectHeader}>
      <p className={s.company}>{project.company}</p>
      <h1 className={s.projectTitle}>{project.title}</h1>

      <table className={s.metaTable}>
        <tbody>
          <tr className={s.metaRow}>
            <td className={s.metaLabel}>기간</td>
            <td className={s.metaValue}>{project.period}</td>
          </tr>
          <tr className={s.metaRow}>
            <td className={s.metaLabel}>팀</td>
            <td className={s.metaValue}>{project.team}</td>
          </tr>
          <tr className={s.metaRow}>
            <td className={s.metaLabel}>스택</td>
            <td className={s.metaValue}>
              <ul className={s.stackList}>
                {project.stack.map((tech) => (
                  <li key={tech} className={s.stackChip}>{tech}</li>
                ))}
              </ul>
            </td>
          </tr>
          {project.link && (
            <tr className={s.metaRow}>
              <td className={s.metaLabel}>링크</td>
              <td className={s.metaValue}>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {project.link}
                </a>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </header>

    <section className={s.descSection}>
      <ul className={s.descList}>
        {project.description.map((line, i) => (
          <li key={i} className={s.descItem}>{line}</li>
        ))}
      </ul>
    </section>

    <section className={s.implSection}>
      <h2 className={s.sectionHeading}>주요 구현</h2>
      {project.implementations.map((impl) => (
        <div key={impl.title} className={s.implCard}>
          <h3 className={s.implTitle}>| {impl.title}</h3>

          {impl.problem && (
            <div className={s.implRow}>
              <span className={`${s.implLabel} ${s.implLabelProblem}`}>Problem</span>
              <ul className={s.implBulletList}>
                {impl.problem.map((p, i) => (
                  <li key={i} className={s.implBullet}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {impl.solve && (
            <div className={s.implRow}>
              <span className={`${s.implLabel} ${s.implLabelSolve}`}>Solve</span>
              <ul className={s.implBulletList}>
                {impl.solve.map((p, i) => (
                  <li key={i} className={s.implBullet}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {impl.result && (
            <div className={s.implRow}>
              <span className={`${s.implLabel} ${s.implLabelResult}`}>Result</span>
              <ul className={s.implBulletList}>
                {impl.result.map((p, i) => (
                  <li key={i} className={s.implBullet}>{p}</li>
                ))}
              </ul>
            </div>
          )}

          {impl.insight && (
            <div className={s.implRow}>
              <span className={`${s.implLabel} ${s.implLabelInsight}`}>Insight</span>
              <p className={s.implText}>{impl.insight}</p>
            </div>
          )}
        </div>
      ))}
    </section>

    {project.retrospective && (
      <section className={s.retroSection}>
        <h2 className={s.sectionHeading}>회고</h2>
        <div className={s.retroCard}>
          <ul className={s.retroList}>
            {project.retrospective.map((line, i) => (
              <li key={i} className={s.retroItem}>{line}</li>
            ))}
          </ul>
        </div>
      </section>
    )}
  </article>
)

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
        <ProjectContent project={project} />
      </div>
    </main>
  )
}
