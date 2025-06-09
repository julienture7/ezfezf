'use client'

import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import { Search, Sparkles, Zap } from 'lucide-react'

export default function Hero() {
  const { actualTheme } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <section className="@container">
      <div className="@[480px]:p-0">
        <motion.div
          className={`relative flex min-h-[480px] flex-col gap-6 @[480px]:gap-8 rounded-xl items-center justify-center p-6 sm:p-8 shadow-lg overflow-hidden ${
            actualTheme === 'dark'
              ? 'glass-card border-2 border-primary/20'
              : 'bg-cover bg-center bg-no-repeat'
          }`}
          style={actualTheme === 'light' ? {
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDcCrEGrv4ie4DmWc9yKpu-hIQVu-QcAF51wpsenyWodlX6y8H1ZnDgqL81WRlvAAOIJ4RyOrV9_pU39lCuuxl5sgEwOUVbya6Le6qKra1Fy4UdBKlJlrUgXb2qdXb9FXTpLF8CQXCYDEpip45sxjr1JqM9X64P3N73cB1UOG-Au8ZbS9WG3d2jcCr_xjTN2q5Xv8rRtVj5dlDWr38E3h7WpHlJp6xg4Wbyw-rysVqihQ_Fo0r7jW0W2zqMagUrDinSlofMYm1eFYI")'
          } : {}}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Futuristic background effects for dark mode */}
          {actualTheme === 'dark' && (
            <>
              {/* Animated gradient background */}
              <div className="absolute inset-0 holographic opacity-30" />

              {/* Network grid */}
              <div className="absolute inset-0 network-bg opacity-40" />

              {/* Floating particles */}
              <div className="absolute inset-0">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [-20, -40, -20],
                      opacity: [0.2, 1, 0.2],
                      scale: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Neon border glow */}
              <div className="absolute inset-0 rounded-xl border border-primary/30 neon-glow-cyan" />
            </>
          )}
          <div className="flex flex-col gap-3 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className={`text-4xl font-extrabold leading-tight tracking-tighter @[480px]:text-5xl @[480px]:font-extrabold @[480px]:leading-tight @[480px]:tracking-tighter ${
                actualTheme === 'dark' ? 'gradient-text' : 'text-white'
              }`}>
                Find what works for you
                {actualTheme === 'dark' && (
                  <motion.span
                    className="inline-block ml-2"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                  >
                    <Sparkles className="h-8 w-8 text-accent" />
                  </motion.span>
                )}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h2 className={`text-base font-normal leading-relaxed @[480px]:text-lg @[480px]:font-normal @[480px]:leading-relaxed ${
                actualTheme === 'dark' ? 'text-muted-foreground' : 'text-slate-200'
              }`}>
                Join a community of people with the same condition as you and discover what treatments work for them.
                {actualTheme === 'dark' && (
                  <span className="block mt-2 text-primary font-medium">
                    🚀 Powered by AI and real experiences
                  </span>
                )}
              </h2>
            </motion.div>
          </div>

          <motion.form
            onSubmit={handleSearch}
            className="flex flex-col min-w-40 h-14 w-full max-w-lg @[480px]:h-16 shadow-sm relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className={`flex w-full flex-1 items-stretch rounded-lg h-full group ${
              actualTheme === 'dark' ? 'glass-card' : ''
            }`}>
              <div className={`flex items-center justify-center pl-4 rounded-l-lg border-r-0 transition-all duration-300 ${
                actualTheme === 'dark'
                  ? 'text-muted-foreground border border-border bg-muted/50 group-focus-within:border-primary group-focus-within:text-primary'
                  : 'text-slate-500 border border-slate-300 bg-white'
              }`}>
                <motion.div
                  animate={actualTheme === 'dark' ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Search size={24} />
                </motion.div>
              </div>

              <Input
                type="text"
                placeholder={actualTheme === 'dark' ? "Discover your health journey..." : "Search for a condition"}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-none h-full px-4 text-base font-normal leading-normal @[480px]:text-lg @[480px]:font-normal @[480px]:leading-normal border-l-0 border-r-0 transition-all duration-300 ${
                  actualTheme === 'dark'
                    ? 'text-foreground bg-muted/50 border border-border focus:border-primary focus:ring-primary/20 placeholder:text-muted-foreground focus:bg-muted/80'
                    : 'text-slate-900 bg-white border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-500'
                }`}
              />

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  type="submit"
                  className={`text-sm font-bold leading-normal tracking-wide @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-wide transition-all duration-300 rounded-l-none h-full px-5 @[480px]:px-6 ${
                    actualTheme === 'dark'
                      ? 'futuristic-button text-primary-foreground'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {actualTheme === 'dark' && (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Start
                </Button>
              </motion.div>
            </div>

            {/* Futuristic search glow effect */}
            {actualTheme === 'dark' && (
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 blur-xl" />
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  )
}
