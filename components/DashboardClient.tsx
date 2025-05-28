'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'
import { DashboardOverview } from './DashboardOverview'

interface DashboardClientProps {
  user: User
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-purple-600/15"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
      <div className="absolute left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-blue-500/25 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 h-[600px] w-[600px] rounded-full bg-purple-500/15 blur-3xl"></div>

      <div className="relative">
        {/* Header */}
        <header className="border-b border-white/20 bg-white/10 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative h-10 w-10">
                  <Image 
                    src="/images/logo.png" 
                    alt="GoRoFolio" 
                    fill 
                    sizes="40px"
                    className="object-contain" 
                  />
                </div>
                <span className="text-2xl font-bold text-white">GoRoFolio</span>
              </Link>

              <div className="flex items-center space-x-4">
                <div className="text-white/80">
                  Welcome, <span className="font-semibold text-white">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="rounded-lg bg-white/10 px-4 py-2 text-white transition-colors duration-300 hover:bg-white/20 disabled:opacity-50"
                >
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-6 py-12">
          <DashboardOverview />
        </main>
      </div>
    </div>
  )
}
