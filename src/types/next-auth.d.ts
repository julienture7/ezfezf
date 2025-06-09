import type { UserRole } from '@prisma/client'
import type { DefaultSession, DefaultUser } from 'next-auth'
import { JWT, type DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: UserRole
      verified: boolean
      fullName?: string | null
    } & DefaultSession['user']
  }

  interface User extends DefaultUser {
    role: UserRole
    verified: boolean
    fullName?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    role: UserRole
    verified: boolean
    fullName?: string | null
  }
}
