import Header from '@/components/Header'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import ExploreCommunities from '@/components/ExploreCommunities'
import Statistics from '@/components/Statistics'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden bg-slate-50" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <main className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8 sm:py-12">
          <div className="layout-content-container flex flex-col max-w-5xl flex-1">
            <Hero />
            <HowItWorks />
            <ExploreCommunities />
            <Statistics />
            <Testimonials />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
