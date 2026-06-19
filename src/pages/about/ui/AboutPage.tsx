import { useLanguage } from '../../../shared/i18n'
import * as s from './about.css'

export const AboutPage = () => {
  const { t } = useLanguage()
  const a = t.about

  return (
    <main className={s.page}>
      <div className={`${s.container} ${s.containerPadding}`}>
        <header className={s.gridHeader}>
          <h1 className={s.gridTitle}>{a.pageTitle}</h1>
        </header>

        <p className={s.tagline}>WOOJIN LEE</p>
        <h2 className={s.name}>{a.headline}</h2>
        <p className={s.bio}>{a.bio}</p>

        <div className={s.section}>
          <h2 className={s.sectionTitle}>{a.sectionExp}</h2>
          <a href="https://www.clovirtualfashion.com/" target="_blank" rel="noopener noreferrer" className={s.companyName}>{a.companyName}</a>
          <div className={s.expList}>
            <div className={s.expItem}>
              <span className={s.expRole}>{a.exp1.role}</span>
              <span className={s.expMeta}>{a.exp1.period}</span>
              <p className={s.expDesc}>
                <a href="https://clo-set.com" target="_blank" rel="noopener noreferrer" className={s.expLink}>{a.exp1.projectName}</a><br />
                {a.exp1.desc}
              </p>
            </div>

            <div className={s.expItem}>
              <span className={s.expRole}>{a.exp2.role}</span>
              <span className={s.expMeta}>{a.exp2.period}</span>
              <p className={s.expDesc}>
                <a href="https://connect.clo-set.com" target="_blank" rel="noopener noreferrer" className={s.expLink}>{a.exp2.projectName}</a><br />
                {a.exp2.desc}
              </p>
            </div>

            <div className={s.expItem}>
              <span className={s.expRole}>{a.exp3.role}</span>
              <span className={s.expMeta}>{a.exp3.period}</span>
              <p className={s.expDesc}>{a.exp3.desc}</p>
            </div>
          </div>
        </div>

        <div className={s.section}>
          <h2 className={s.sectionTitle}>{a.sectionEdu}</h2>
          <div className={s.itemList}>
            <div className={s.item}>
              <div className={s.itemBody}>
                <span className={s.itemTitle}>{a.edu1.title}</span>
                <span className={s.itemSub}>{a.edu1.sub}</span>
              </div>
              <span className={s.itemPeriod}>{a.edu1.date}</span>
            </div>

            <div className={s.item}>
              <div className={s.itemBody}>
                <span className={s.itemTitle}>{a.edu2.title}</span>
                <span className={s.itemSub}>{a.edu2.sub}</span>
              </div>
              <span className={s.itemPeriod}>{a.edu2.date}</span>
            </div>
          </div>
        </div>

        <div className={s.section}>
          <h2 className={s.sectionTitle}>{a.sectionPub}</h2>
          <a
            href="https://hanyang.dcollection.net/srch/srchDetail/200000889057"
            target="_blank"
            rel="noopener noreferrer"
            className={s.pubTitle}
          >
            Session-based Enhanced Model Using BERT for Personalized Web Interface Recommendation
          </a>
          <p className={s.pubMeta}>Hanyang University, Graduate School of Engineering · August 21, 2025</p>
          <p className={s.pubKeywords}>Session-based · Recommendation · BERT · Transformer · Machine Learning · Deep Learning</p>
          <details className={s.pubDetails}>
            <summary className={s.pubSummary}>{a.pubAbstractLabel}</summary>
            <p className={s.pubAbstract}>
              In recent years, transformer-based models and session-based personalization studies have been actively
              conducted. This study aims to solve the problem of increasing churn and low residual rate caused by
              providing a uniform web interface that does not take into account the characteristics of users in a B2B
              service environment. To address this issue, we propose an approach to learn the user-feature interaction
              in a session by entering the user event sequence and privilege information, and to recommend a
              personalized web interface. The proposed model, SpriBERT (Session-based Personalized Recommender
              Interface using BERT), combines BERT (Bidirectional Encoder Representations from Transformers) and MLP
              (Multi-Layer Perceptron) to predict the association between users and functions based on the interaction
              between users and functions in a session. Considering that information on user preference is limited in
              session-based scenarios, the model calculates a personalization score based on the user's permissions
              and event data in each session. One of the most comprehensive datasets, the RetailRocket dataset, was
              reorganized and utilized for the B2B environment, and the recommendation performance was evaluated
              through three representative HR, MRR, and nDCG indicators. As a result, the SpriBERT model recorded
              0.468 at HR@10, 0.317 at MRR@10, and 0.672 at nDCG@10, which shows superior performance in terms of
              precision and ranking-based evaluation compared to Baseline.
            </p>
          </details>
        </div>

        <div className={s.section}>
          <h2 className={s.sectionTitle}>{a.sectionTraining}</h2>
          <div className={s.itemList}>
            <div className={s.item}>
              <div className={s.itemBody}>
                <span className={s.itemTitle}>CodeStates Software Engineering Program</span>
                <span className={s.itemSub}>Pre Course 32nd · Advanced Immersive Course 18th</span>
              </div>
              <span className={s.itemPeriod}>{a.training1.date}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
