'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme()

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
    }
  }

  const getGlowClass = () => {
    if (actualTheme === 'dark') {
      switch (theme) {
        case 'dark':
          return 'neon-glow-purple'
        case 'system':
          return 'neon-glow-cyan'
        default:
          return ''
      }
    }
    return ''
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={cycleTheme}
      className={`relative overflow-hidden transition-all duration-300 ${getGlowClass()}`}
      title={`Current theme: ${theme} (${actualTheme})`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 90, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          {getIcon()}
        </motion.div>
      </AnimatePresence>

      {/* Futuristic background effect for dark mode */}
      {actualTheme === 'dark' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'loop',
            ease: 'linear'
          }}
        />
      )}
    </Button>
  )
}
