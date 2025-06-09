'use client'

import { useTheme } from '@/contexts/ThemeContext'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import ExploreCommunities from '@/components/ExploreCommunities'
import Statistics from '@/components/Statistics'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'

export default function Home() {
  const { actualTheme } = useTheme()

  return (
    <div
      className={`relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden transition-colors duration-300 ${
        actualTheme === 'dark' ? 'bg-background' : 'bg-slate-50'
      }`}
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      {/* Futuristic background effects for dark mode */}
      {actualTheme === 'dark' && (
        <>
          {/* Animated gradient overlay */}
          <div className="fixed inset-0 holographic opacity-10 pointer-events-none" />

          {/* Network grid background */}
          <div className="fixed inset-0 network-bg opacity-20 pointer-events-none" />

          {/* Floating orbs */}
          <div className="fixed inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-32 h-32 rounded-full opacity-10"
                style={{
                  background: `radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)`,
                  left: `${20 + i * 20}%`,
                  top: `${20 + i * 15}%`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.05, 0.15, 0.05],
                }}
                transition={{
                  duration: 4 + i,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </>
      )}

      <div className="layout-container flex h-full grow flex-col relative z-10">
        <Header />
        <motion.main
          className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8 sm:py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="layout-content-container flex flex-col max-w-5xl flex-1 space-y-16">
            <Hero />
            <HowItWorks />
            <ExploreCommunities />
            <Statistics />
            <Testimonials />
          </div>
        </motion.main>
        <Footer />
      </div>
    </div>
  )
}
