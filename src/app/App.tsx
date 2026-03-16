import { Router, Route, Switch } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import '../shared/styles/global.css'
import { LanguageProvider } from '../shared/i18n'
import { RootLayout } from './layouts/RootLayout'
import { CursorTrail } from '../shared/ui/CursorTrail'
import { HomePage } from '../pages/home/ui/HomePage'
import { PortfolioPage } from '../pages/portfolio/ui/PortfolioPage'
import { ProjectDetailPage } from '../pages/portfolio/ui/ProjectDetailPage'
import { AboutPage } from '../pages/about/ui/AboutPage'

export const App = () => (
  <LanguageProvider>
    <CursorTrail />
    <Router hook={useHashLocation}>
      <RootLayout>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/projects" component={PortfolioPage} />
          <Route path="/projects/:id" component={ProjectDetailPage} />
          <Route path="/about" component={AboutPage} />
        </Switch>
      </RootLayout>
    </Router>
  </LanguageProvider>
)
