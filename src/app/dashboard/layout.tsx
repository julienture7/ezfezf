'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  User,
  Calendar,
  MessageSquare,
  Heart,
  Pill,
  FileText,
  Settings,
  Bell,
  Menu,
  X,
  LogOut,
  Stethoscope,
  Users,
  BarChart3,
  Zap,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import ThemeToggle from '@/components/ThemeToggle'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoggedIn, isLoading, logout } = useAuth()
  const { theme, setTheme, actualTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login')
    }
  }, [isLoggedIn, isLoading, router])

  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        actualTheme === 'dark' ? 'bg-background' : 'bg-gray-50'
      }`}>
        <motion.div
          className={`rounded-full h-32 w-32 border-4 border-t-transparent transition-colors duration-300 ${
            actualTheme === 'dark' ? 'border-primary neon-glow-cyan' : 'border-blue-600'
          }`}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  if (!isLoggedIn) {
    return null
  }

  const patientNavigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Health Profile', href: '/dashboard/profile', icon: User },
    { name: 'Symptoms Tracker', href: '/dashboard/symptoms', icon: Heart },
    { name: 'Treatments', href: '/dashboard/treatments', icon: Pill },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Medical Records', href: '/dashboard/records', icon: FileText },
    { name: 'Community', href: '/communities', icon: Users },
  ]

  const doctorNavigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Profile', href: '/dashboard/profile', icon: Stethoscope },
  ]

  const adminNavigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Users Management', href: '/dashboard/admin/users', icon: Users },
    { name: 'Content Management', href: '/dashboard/admin/content', icon: FileText },
    { name: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
  ]

  const getNavigation = () => {
    switch (user?.role) {
      case 'doctor':
        return doctorNavigation
      case 'admin':
        return adminNavigation
      default:
        return patientNavigation
    }
  }

  const navigation = getNavigation()

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      actualTheme === 'dark' ? 'bg-background' : 'bg-gray-50'
    }`}>
      {/* Futuristic background effects for dark mode */}
      {actualTheme === 'dark' && (
        <>
          <div className="fixed inset-0 holographic opacity-5 pointer-events-none" />
          <div className="fixed inset-0 network-bg opacity-10 pointer-events-none" />
        </>
      )}
      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className={`fixed inset-y-0 left-0 flex w-64 flex-col ${
                actualTheme === 'dark' ? 'glass-card border-r border-border' : 'bg-white'
              }`}
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex h-16 items-center justify-between px-4">
                <span className={`text-xl font-semibold flex items-center ${
                  actualTheme === 'dark' ? 'gradient-text' : 'text-gray-900'
                }`}>
                  {actualTheme === 'dark' && <Zap className="h-6 w-6 mr-2 text-primary" />}
                  MedCommunity
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className={actualTheme === 'dark' ? 'hover:bg-muted/80' : ''}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="flex-1 space-y-1 px-2 py-4">
                {navigation.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-300 ${
                          isActive
                            ? actualTheme === 'dark'
                              ? 'bg-primary/20 text-primary neon-glow-cyan'
                              : 'bg-blue-100 text-blue-900'
                            : actualTheme === 'dark'
                            ? 'text-muted-foreground hover:bg-muted/50 hover:text-primary'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="mr-3"
                        >
                          <item.icon className="h-5 w-5" />
                        </motion.div>
                        {item.name}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>
              <div className={`border-t p-4 ${
                actualTheme === 'dark' ? 'border-border' : 'border-gray-200'
              }`}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start transition-all duration-300 ${
                    actualTheme === 'dark' ? 'hover:bg-destructive/20 hover:text-destructive' : ''
                  }`}
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Sign Out
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col z-40">
        <motion.div
          className={`flex flex-col flex-grow border-r transition-colors duration-300 ${
            actualTheme === 'dark'
              ? 'glass-card border-border'
              : 'bg-white border-gray-200'
          }`}
          initial={{ x: -264 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex h-16 items-center px-4">
            <motion.span
              className={`text-xl font-semibold flex items-center ${
                actualTheme === 'dark' ? 'gradient-text' : 'text-gray-900'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {actualTheme === 'dark' && (
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="mr-2"
                >
                  <Zap className="h-6 w-6 text-primary" />
                </motion.div>
              )}
              MedCommunity
              {actualTheme === 'dark' && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="ml-2"
                >
                  <Sparkles className="h-4 w-4 text-accent" />
                </motion.div>
              )}
            </motion.span>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-300 relative ${
                      isActive
                        ? actualTheme === 'dark'
                          ? 'bg-primary/20 text-primary neon-glow-cyan'
                          : 'bg-blue-100 text-blue-900'
                        : actualTheme === 'dark'
                        ? 'text-muted-foreground hover:bg-muted/50 hover:text-primary'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="mr-3"
                    >
                      <item.icon className="h-5 w-5" />
                    </motion.div>
                    {item.name}
                    {/* Futuristic active indicator */}
                    {isActive && actualTheme === 'dark' && (
                      <motion.div
                        className="absolute right-2 w-2 h-2 bg-primary rounded-full pulse-glow"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </nav>
          <div className={`border-t p-4 ${
            actualTheme === 'dark' ? 'border-border' : 'border-gray-200'
          }`}>
            <motion.div
              className="flex items-center mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex-shrink-0">
                <motion.div
                  className={`h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    actualTheme === 'dark'
                      ? 'bg-gradient-to-br from-primary to-accent neon-glow-purple'
                      : 'bg-blue-500'
                  }`}
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <span className={`text-sm font-medium ${
                    actualTheme === 'dark' ? 'text-primary-foreground' : 'text-white'
                  }`}>
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </motion.div>
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  actualTheme === 'dark' ? 'text-foreground' : 'text-gray-700'
                }`}>
                  {user?.full_name || 'User'}
                </p>
                <p className={`text-xs capitalize ${
                  actualTheme === 'dark' ? 'text-primary' : 'text-gray-500'
                }`}>{user?.role}</p>
              </div>
            </motion.div>

            {/* Theme Toggle */}
            <div className="mb-2">
              <ThemeToggle />
            </div>

            <Button
              variant="ghost"
              className={`w-full justify-start transition-all duration-300 ${
                actualTheme === 'dark' ? 'hover:bg-destructive/20 hover:text-destructive' : ''
              }`}
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 relative z-10">
        {/* Top bar */}
        <motion.div
          className={`flex h-16 items-center justify-between border-b px-4 lg:px-6 backdrop-blur-lg transition-colors duration-300 ${
            actualTheme === 'dark'
              ? 'bg-background/80 border-border glass-card'
              : 'bg-white border-gray-200'
          }`}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden transition-all duration-300 ${
                actualTheme === 'dark' ? 'hover:bg-muted/80 neon-glow-cyan' : ''
              }`}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>

          <div className="flex items-center space-x-4">
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
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  2
                </motion.span>
              </Button>
            </motion.div>

            <ThemeToggle />

            <Link href="/dashboard/settings">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`transition-all duration-300 ${
                    actualTheme === 'dark' ? 'hover:bg-muted/80 hover:text-primary' : ''
                  }`}
                >
                  <Settings className="h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Page content */}
        <main className="flex-1">
          <motion.div
            className="py-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
