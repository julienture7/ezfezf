'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { User, LogOut } from 'lucide-react'

export default function Header() {
  const { user, isLoggedIn, logout } = useAuth()
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 px-6 sm:px-10 py-4">
      <div className="flex items-center gap-3 text-slate-900">
        <div className="size-6 text-blue-600">
          <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor" />
          </svg>
        </div>
        <Link href="/">
          <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">
            Stuff That Works
          </h2>
        </Link>
      </div>
      <div className="flex flex-1 justify-end gap-4 sm:gap-8">
        <nav className="hidden sm:flex items-center gap-6">
          <Link
            href="/explore"
            className="text-slate-700 hover:text-blue-600 text-sm font-medium leading-normal transition-colors"
          >
            Explore
          </Link>
          <Link
            href="/how-it-works"
            className="text-slate-700 hover:text-blue-600 text-sm font-medium leading-normal transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/about"
            className="text-slate-700 hover:text-blue-600 text-sm font-medium leading-normal transition-colors"
          >
            About us
          </Link>
        </nav>
        <Link href="/login">
          <Button
            variant="secondary"
            className="bg-slate-200 hover:bg-slate-300 text-slate-900 text-sm font-semibold"
          >
            Log in
          </Button>
        </Link>
      </div>
    </header>
  )
}
