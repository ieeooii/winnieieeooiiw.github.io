import { Navbar } from '../../widgets/navbar/ui/Navbar'
import { Footer } from '../../widgets/footer/ui/Footer'
import { useScrollReset } from '../../shared/hooks'

export const RootLayout = ({ children }: { children: React.ReactNode }) => {
  useScrollReset()
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
