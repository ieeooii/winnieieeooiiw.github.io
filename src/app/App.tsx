import { Router, Route, Switch } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import '../shared/styles/global.css'
import { RootLayout } from './layouts/RootLayout'
import { HomePage } from '../pages/home/ui/HomePage'
import { PortfolioPage } from '../pages/portfolio/ui/PortfolioPage'
import { BlogPage } from '../pages/blog/ui/BlogPage'

export const App = () => (
  <Router hook={useHashLocation}>
    <RootLayout>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/portfolio" component={PortfolioPage} />
        <Route path="/blog" component={BlogPage} />
      </Switch>
    </RootLayout>
  </Router>
)
