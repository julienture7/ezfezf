'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import type { UserRole } from '@prisma/client'

interface UserProfile {
  id: string
  email: string
  fullName?: string | null
  name?: string | null
  role: UserRole
  verified: boolean
  image?: string | null
}

interface AuthContextType {
  user: UserProfile | null
  session: any
  isLoading: boolean
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const isLoading = status === 'loading'

  const user: UserProfile | null = session?.user ? {
    id: session.user.id,
    email: session.user.email!,
    fullName: session.user.fullName,
    name: session.user.name,
    role: session.user.role,
    verified: session.user.verified,
    image: session.user.image,
  } : null

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        return { success: false, error: 'Invalid credentials' }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { success: false, error: 'No user logged in' }
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      return { success: true }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const resetPassword = async (email: string) => {
    // TODO: Implement password reset functionality
    return { success: false, error: 'Password reset not implemented yet' }
  }

  const isLoggedIn = !!session && !!user

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isLoggedIn,
      login,
      signup,
      logout,
      updateProfile,
      resetPassword,
    }}>
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
