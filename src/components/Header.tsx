'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import ThemeToggle from '@/components/ThemeToggle'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Heart,
  Bell,
  Zap
} from 'lucide-react'

export default function Header() {
  const { user, isLoggedIn, logout, isLoading } = useAuth()
  const { actualTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery)
      // Implement search functionality
    }
  }

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <motion.header
      className={`sticky top-0 z-50 backdrop-blur-lg border-b transition-all duration-300 ${
        actualTheme === 'dark'
          ? 'bg-background/80 border-border glass-card'
          : 'bg-white/80 border-gray-200'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Futuristic grid background for dark mode */}
      {actualTheme === 'dark' && (
        <div className="absolute inset-0 network-bg opacity-20" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                actualTheme === 'dark'
                  ? 'bg-gradient-to-br from-primary to-accent pulse-glow'
                  : 'bg-blue-600'
              }`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {actualTheme === 'dark' ? (
                <Zap className="h-5 w-5 text-primary-foreground" />
              ) : (
                <Heart className="h-5 w-5 text-white" />
              )}
            </motion.div>
            <span className={`text-xl font-bold transition-all duration-300 ${
              actualTheme === 'dark'
                ? 'gradient-text'
                : 'text-gray-900'
            }`}>
              MedCommunity
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Explore', 'Communities', 'How It Works', 'About'].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className={`font-medium transition-all duration-300 relative group ${
                    actualTheme === 'dark'
                      ? 'text-muted-foreground hover:text-foreground'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item}
                  {/* Futuristic underline effect */}
                  {actualTheme === 'dark' && (
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
                  )}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full group">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${
                actualTheme === 'dark' ? 'text-muted-foreground group-focus-within:text-primary' : 'text-gray-400'
              }`} />
              <Input
                type="text"
                placeholder="Search conditions, treatments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 w-full transition-all duration-300 ${
                  actualTheme === 'dark'
                    ? 'bg-muted/50 border-border focus:border-primary focus:ring-primary/20 focus:bg-muted/80 focus-visible:ring-2 focus-visible:ring-primary/30'
                    : ''
                }`}
              />
              {/* Futuristic search glow effect */}
              {actualTheme === 'dark' && (
                <div className="absolute inset-0 rounded-md bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              )}
            </div>
          </form>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />

            {isLoading ? (
              <div className={`w-8 h-8 animate-pulse rounded-full ${
                actualTheme === 'dark' ? 'bg-muted' : 'bg-gray-200'
              }`} />
            ) : isLoggedIn && user ? (
              <div className="flex items-center space-x-3">
                {/* Notifications - only show for logged in users */}
                <Link href="/dashboard">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative transition-all duration-300 ${
                        actualTheme === 'dark' ? 'hover:bg-muted/80 neon-glow-cyan' : ''
                      }`}
                    >
                      <Bell className="h-5 w-5" />
                      <motion.span
                        className={`absolute -top-1 -right-1 h-3 w-3 rounded-full text-xs text-white flex items-center justify-center ${
                          actualTheme === 'dark' ? 'bg-accent pulse-glow' : 'bg-red-500'
                        }`}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
                      >
                        2
                      </motion.span>
                    </Button>
                  </motion.div>
                </Link>

                {/* User Avatar/Menu */}
                <div className="relative">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMenuOpen(!isMenuOpen)}
                      className={`flex items-center space-x-2 transition-all duration-300 ${
                        actualTheme === 'dark' ? 'hover:bg-muted/80' : ''
                      }`}
                    >
                      <motion.div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          actualTheme === 'dark'
                            ? 'bg-gradient-to-br from-primary to-accent neon-glow-purple'
                            : 'bg-blue-500'
                        }`}
                        whileHover={{ rotate: 10 }}
                      >
                        <span className={`text-sm font-medium ${
                          actualTheme === 'dark' ? 'text-primary-foreground' : 'text-white'
                        }`}>
                          {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </motion.div>
                      <span className={`hidden sm:block font-medium transition-colors duration-300 ${
                        actualTheme === 'dark' ? 'text-foreground' : ''
                      }`}>
                        {user.full_name || 'User'}
                      </span>
                    </Button>
                  </motion.div>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                          actualTheme === 'dark'
                            ? 'glass-card border-border'
                            : 'bg-white border border-gray-200'
                        }`}
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={`px-4 py-2 border-b ${
                          actualTheme === 'dark' ? 'border-border' : 'border-gray-100'
                        }`}>
                          <p className={`text-sm font-medium ${
                            actualTheme === 'dark' ? 'text-foreground' : 'text-gray-900'
                          }`}>{user.full_name}</p>
                          <p className={`text-xs ${
                            actualTheme === 'dark' ? 'text-muted-foreground' : 'text-gray-500'
                          }`}>{user.email}</p>
                          <p className={`text-xs capitalize ${
                            actualTheme === 'dark' ? 'text-primary' : 'text-blue-600'
                          }`}>{user.role}</p>
                        </div>

                        <Link
                          href="/dashboard"
                          className={`flex items-center px-4 py-2 text-sm transition-all duration-300 ${
                            actualTheme === 'dark'
                              ? 'text-foreground hover:bg-muted/80 hover:text-primary'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>

                        <Link
                          href="/dashboard/profile"
                          className={`flex items-center px-4 py-2 text-sm transition-all duration-300 ${
                            actualTheme === 'dark'
                              ? 'text-foreground hover:bg-muted/80 hover:text-primary'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Profile Settings
                        </Link>

                        <button
                          onClick={handleLogout}
                          className={`flex items-center w-full px-4 py-2 text-sm transition-all duration-300 ${
                            actualTheme === 'dark'
                              ? 'text-foreground hover:bg-destructive/20 hover:text-destructive'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`transition-all duration-300 ${
                        actualTheme === 'dark' ? 'hover:bg-muted/80 hover:text-primary' : ''
                      }`}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/login">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      size="sm"
                      className={`transition-all duration-300 ${
                        actualTheme === 'dark' ? 'futuristic-button' : ''
                      }`}
                    >
                      Join Now
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                size="sm"
                className={`md:hidden transition-all duration-300 ${
                  actualTheme === 'dark' ? 'hover:bg-muted/80 neon-glow-cyan' : ''
                }`}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className={`md:hidden border-t py-4 ${
                actualTheme === 'dark' ? 'border-border glass-card' : 'border-gray-200'
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative group">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300 ${
                    actualTheme === 'dark' ? 'text-muted-foreground group-focus-within:text-primary' : 'text-gray-400'
                  }`} />
                  <Input
                    type="text"
                    placeholder="Search conditions, treatments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 w-full transition-all duration-300 ${
                      actualTheme === 'dark'
                        ? 'bg-muted/50 border-border focus:border-primary focus:ring-primary/20'
                        : ''
                    }`}
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {['Explore', 'Communities', 'How It Works', 'About'].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={`/${item.toLowerCase().replace(' ', '-')}`}
                      className={`block px-3 py-2 font-medium transition-all duration-300 ${
                        actualTheme === 'dark'
                          ? 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}

                {!isLoggedIn && (
                  <motion.div
                    className={`pt-4 border-t space-y-2 ${
                      actualTheme === 'dark' ? 'border-border' : 'border-gray-200'
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      href="/login"
                      className={`block px-3 py-2 font-medium transition-all duration-300 ${
                        actualTheme === 'dark'
                          ? 'text-muted-foreground hover:text-primary hover:bg-muted/50'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <div className="px-3">
                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          className={`w-full transition-all duration-300 ${
                            actualTheme === 'dark' ? 'futuristic-button' : ''
                          }`}
                        >
                          Join Now
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Close menu on outside click */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.header>
  )
}
