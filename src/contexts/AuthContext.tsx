'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  avatar: string
  joinedDate: string
  conditions: string[]
  currentTreatments: Array<{
    name: string
    startDate: string
    effectiveness: number
    sideEffects: string[]
  }>
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data - in a real app, this would come from your backend
const mockUser: User = {
  id: '1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiJwKoNBhoA2XUYAVNCnAu2ujcJmVaKtFC40tgSOjLQYqSTsstQLCNptPv6kkgZ0QiMBP_yw9zIcMSKoQcB6br0q8SIJlR-g0DH7l8aygZG12jBqQWOcbqUvgrtqqA6eqWdQS2GE_f1ebkdh9hLiRU6Ok5nl-k2Bg49nlf7h452d0-4ZHU5S2nzk2iZuzzafraMluQdl3BdoyG39-kZBDl-4fJmlkEggxPdCkXEJMTzHrB_h2hfZOJuuQMNPvKHSmwAdHppqKAI4c',
  joinedDate: '2024-01-15',
  conditions: ['Headaches & Migraines', 'Anxiety & Depression'],
  currentTreatments: [
    {
      name: 'Sumatriptan',
      startDate: '2024-02-01',
      effectiveness: 85,
      sideEffects: ['Mild nausea', 'Drowsiness']
    },
    {
      name: 'Meditation',
      startDate: '2024-01-20',
      effectiveness: 70,
      sideEffects: []
    }
  ]
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is already logged in (e.g., from localStorage)
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsLoggedIn(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in a real app, you'd make an API call
    if (email === 'sarah@example.com' && password === 'password') {
      setUser(mockUser)
      setIsLoggedIn(true)
      localStorage.setItem('user', JSON.stringify(mockUser))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('user')
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
