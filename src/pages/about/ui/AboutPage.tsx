import * as s from './about.css'

export const AboutPage = () => (
  <main className={s.page}>
    <div className={s.container}>
      <header className={s.gridHeader}>
        <h1 className={s.gridTitle}>About</h1>
      </header>

      <p className={s.tagline}>WOOJIN LEE</p>
      <h2 className={s.name}>문제를 구조로 바꾸는 프론트엔드 엔지니어</h2>

      <p className={s.bio}>
        저는 화면을 구현하는 개발자를 넘어, 문제를 구조로 해결하는 프론트엔드 엔지니어입니다.
        CLO Virtual Fashion에서 근무하며 기능 개발에 머무르지 않고, 서비스 전반의 문제를 정의하고
        기술적 대안을 설계하는 역할을 수행해왔습니다. 레거시 One-Repo 구조로 인한 성능 저하와
        복잡한 의존성 문제를 해결하기 위해 모노레포 전환과 App Router 기반 아키텍처를 설계했고,
        그 결과 로딩 속도 40% 개선과 핵심 성능 지표 35% 향상을 이끌어냈습니다. 또한 Next.js 기반
        공통 에러 핸들링 라이브러리를 설계해 사용자 경험을 개선하는 동시에, 에러 모니터링 효율을
        분 단위로 단축했습니다. 디자인 시스템 번들 최적화, 코드 분할, 공통 툴링 구축을 통해 팀
        전체의 개발 생산성과 일관성을 높였으며, 퍼널 개선 프로젝트에서는 로그 설계부터 UX 개선까지
        주도해 유료 전환율을 단계적으로 14% 이상 향상시켰습니다. 저는 단기적인 기능 구현보다,
        장기적으로 유지 가능한 구조와 팀의 성장에 기여하는 엔지니어를 지향합니다.
      </p>

      <div className={s.section}>
        <h2 className={s.sectionTitle}>Experience</h2>
        <p className={s.companyName}>CLO Virtual Fashion Inc.</p>
        <p className={s.companyMeta}>정규직 · 6년 4개월</p>
        <div className={s.expList}>
          <div className={s.expItem}>
            <span className={s.expRole}>Frontend Engineer</span>
            <span className={s.expMeta}>2022. 02 – 현재 · 4년 2개월 · 서울, 하이브리드</span>
            <p className={s.expDesc}>
              CLO-SET | CLO's Next digital fashion Platform<br />
              Hugo Boss, GAP, Bestseller 등 글로벌 패션 회사에서 사용 중인 플랫폼으로, 디자인·개발·생산·리테일·소비로 이어지는 의류 Lifecycle 클라우드 기반 3D 의상 B2B 서비스
            </p>
          </div>

          <div className={s.expItem}>
            <span className={s.expRole}>Frontend Developer</span>
            <span className={s.expMeta}>2020. 11 – 2022. 01 · 1년 3개월 · 재택근무</span>
            <p className={s.expDesc}>
              CONNECT - The Best 3D Clothing Models<br />
              3D 의상 공유, 커뮤니케이션, 판매, 구매 글로벌 디지털 의상 커뮤니티 B2C 서비스
            </p>
          </div>

          <div className={s.expItem}>
            <span className={s.expRole}>Web Developer</span>
            <span className={s.expMeta}>2019. 11. 18 – 2020. 10 · 11개월 · 서울, 하이브리드</span>
            <p className={s.expDesc}>workflow, commit/code convention 정립 및 개선</p>
          </div>
        </div>
      </div>

      <div className={s.section}>
        <h2 className={s.sectionTitle}>Education</h2>
        <div className={s.itemList}>
          <div className={s.item}>
            <div className={s.itemBody}>
              <span className={s.itemTitle}>한양대학교 대학원 공학석사</span>
              <span className={s.itemSub}>컴퓨터공학 전공 · GPA 4.17 / 4.5</span>
              <span className={s.itemNote}>
                Thesis: "Session-based Enhanced Model Using BERT for Personalized Web Interface Recommendation"
              </span>
            </div>
            <span className={s.itemPeriod}>August 2025</span>
          </div>

          <div className={s.item}>
            <div className={s.itemBody}>
              <span className={s.itemTitle}>시각디자인학 전공</span>
              <span className={s.itemSub}>전문학사 GPA 4.2 / 4.5 · 학사 GPA 3.89 / 4.5</span>
            </div>
            <span className={s.itemPeriod}>August 2018</span>
          </div>
        </div>
      </div>

      <div className={s.section}>
        <h2 className={s.sectionTitle}>Training / Certification</h2>
        <div className={s.itemList}>
          <div className={s.item}>
            <div className={s.itemBody}>
              <span className={s.itemTitle}>CodeStates Software Engineering Program</span>
              <span className={s.itemSub}>Pre Course 32nd · Advanced Immersive Course 18th</span>
            </div>
            <span className={s.itemPeriod}>August 2019</span>
          </div>
        </div>
      </div>
    </div>
  </main>
)
