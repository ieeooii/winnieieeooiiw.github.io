import { Navbar } from '../../../widgets/navbar/ui/Navbar'
import { Hero } from '../../../widgets/hero/ui/Hero'
import { Projects } from '../../../widgets/projects/ui/Projects'
import { Awards } from '../../../widgets/awards/ui/Awards'
import { Footer } from '../../../widgets/footer/ui/Footer'

export const HomePage = () => (
  <>
    <Navbar />
    <main style={{ paddingTop: '8rem' }}>
      <Hero />
      <Projects />
      <Awards />
    </main>
    <Footer />
  </>
)
