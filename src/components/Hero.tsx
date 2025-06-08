'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle search functionality here
    console.log('Searching for:', searchQuery)
  }

  return (
    <section className="@container">
      <div className="@[480px]:p-0">
        <div
          className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 rounded-xl items-center justify-center p-6 sm:p-8 shadow-lg"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDcCrEGrv4ie4DmWc9yKpu-hIQVu-QcAF51wpsenyWodlX6y8H1ZnDgqL81WRlvAAOIJ4RyOrV9_pU39lCuuxl5sgEwOUVbya6Le6qKra1Fy4UdBKlJlrUgXb2qdXb9FXTpLF8CQXCYDEpip45sxjr1JqM9X64P3N73cB1UOG-Au8ZbS9WG3d2jcCr_xjTN2q5Xv8rRtVj5dlDWr38E3h7WpHlJp6xg4Wbyw-rysVqihQ_Fo0r7jW0W2zqMagUrDinSlofMYm1eFYI")'
          }}
        >
          <div className="flex flex-col gap-3 text-center">
            <h1 className="text-white text-4xl font-extrabold leading-tight tracking-tighter @[480px]:text-5xl @[480px]:font-extrabold @[480px]:leading-tight @[480px]:tracking-tighter">
              Find what works for you
            </h1>
            <h2 className="text-slate-200 text-base font-normal leading-relaxed @[480px]:text-lg @[480px]:font-normal @[480px]:leading-relaxed">
              Join a community of people with the same condition as you and discover what treatments work for them.
            </h2>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col min-w-40 h-14 w-full max-w-lg @[480px]:h-16 shadow-sm">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
              <div className="text-slate-500 flex border border-slate-300 bg-white items-center justify-center pl-4 rounded-l-lg border-r-0">
                <Search size={24} />
              </div>
              <Input
                type="text"
                placeholder="Search for a condition"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-none text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 border border-slate-300 bg-white focus:border-slate-300 h-full placeholder:text-slate-500 px-4 text-base font-normal leading-normal @[480px]:text-lg @[480px]:font-normal @[480px]:leading-normal border-l-0 border-r-0"
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold leading-normal tracking-wide @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-wide transition-colors rounded-l-none h-full px-5 @[480px]:px-6"
              >
                Start
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
