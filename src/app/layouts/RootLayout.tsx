import { Navbar } from '../../widgets/navbar/ui/Navbar'
import { Footer } from '../../widgets/footer/ui/Footer'

export const RootLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Navbar />
    {children}
    <Footer />
  </>
)
