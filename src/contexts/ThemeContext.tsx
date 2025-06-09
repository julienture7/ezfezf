'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme: 'light' | 'dark'
  actualTheme: 'light' | 'dark' // The actual theme being applied (resolves system preference)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system')
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')

  // Get the actual theme being applied (resolves system preference)
  const actualTheme = theme === 'system' ? systemTheme : theme

  useEffect(() => {
    // Load theme from localStorage or user settings
    const loadTheme = async () => {
      // First check localStorage for immediate application
      const savedTheme = localStorage.getItem('theme') as Theme
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setTheme(savedTheme)
      }

      // Then try to load from user settings if authenticated
      try {
        const response = await fetch('/api/user/settings')
        if (response.ok) {
          const settings = await response.json()
          if (settings.theme && settings.theme !== savedTheme) {
            setTheme(settings.theme)
            localStorage.setItem('theme', settings.theme)
          }
        }
      } catch (error) {
        // User not authenticated or settings not available, use localStorage/default
        console.log('Could not load theme from user settings')
      }
    }

    loadTheme()
  }, [])

  useEffect(() => {
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    // Set initial system theme
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light')

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement

    // Remove existing theme classes
    root.classList.remove('light', 'dark')

    // Add current theme class
    root.classList.add(actualTheme)

    // Save to localStorage
    localStorage.setItem('theme', theme)
  }, [theme, actualTheme])

  const updateTheme = async (newTheme: Theme) => {
    setTheme(newTheme)

    // Update user settings if authenticated
    try {
      await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: newTheme })
      })
    } catch (error) {
      // User not authenticated or update failed, but theme still works locally
      console.log('Could not save theme to user settings')
    }
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      setTheme: updateTheme,
      systemTheme,
      actualTheme
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
