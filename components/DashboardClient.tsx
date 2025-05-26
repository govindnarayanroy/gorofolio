'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { User } from '@supabase/supabase-js'

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

  const modules = [
    {
      title: 'Portfolio Builder',
      description: 'Build Your Online Presence Instantly',
      subtitle: 'Showcase your skills in a professional, fully-hosted site—no code needed! Your portfolio is your personal billboard. Go live in seconds.',
      href: '/dashboard/profile/123', // Using existing profile
      icon: '🌐',
      gradient: 'from-blue-500 to-cyan-400',
      bgGradient: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Resume Generator',
      description: 'Create a Resume That Stands Out',
      subtitle: 'Impress recruiters and pass every filter! Our AI auto-formats your résumé for success and keeps you ready for any opportunity.',
      href: '/dashboard/preview',
      icon: '📄',
      gradient: 'from-emerald-500 to-green-400',
      bgGradient: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Cover Letter Writer',
      description: 'Never Stress Over Cover Letters Again',
      subtitle: 'Write a job-specific, personalized letter with just one click. Let your motivation shine through, every time.',
      href: '/dashboard/cover',
      icon: '✍️',
      gradient: 'from-purple-500 to-pink-400',
      bgGradient: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Mock Interview',
      description: 'Boost Your Confidence Before the Real Interview',
      subtitle: 'Practice with our AI interviewer and get instant, actionable feedback. Ace your next interview with tailored practice sessions.',
      href: '/dashboard/interview',
      icon: '🧠',
      gradient: 'from-orange-500 to-red-400',
      bgGradient: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-purple-600/15"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-3xl"></div>

      <div className="relative">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative w-10 h-10">
                  <Image
                    src="/images/logo.png"
                    alt="GoRoFolio"
                    fill
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
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors duration-300 disabled:opacity-50"
                >
                  {isLoading ? 'Signing out...' : 'Sign Out'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          {/* Welcome Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-black text-white mb-6">
              Welcome back, <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">{user.email?.split('@')[0]}</span>! 🚀
            </h1>
            <p className="text-xl text-blue-200/90 max-w-3xl mx-auto leading-relaxed">
              You're one step closer to your dream job. Pick a tool below to get started, or follow your personalized checklist.
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {modules.map((module, index) => (
              <Link
                key={module.title}
                href={module.href}
                className="group relative bg-white/95 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${module.gradient} rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {module.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                    {module.title}
                  </h3>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">
                    {module.description}
                  </h4>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {module.subtitle}
                  </p>

                  {/* CTA */}
                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                    <span>Get Started</span>
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Encouragement Section */}
          <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
            <h3 className="text-2xl font-bold text-white mb-4">💡 Not sure where to begin?</h3>
            <p className="text-blue-200/90 text-lg mb-6">
              Try the AI Portfolio Builder, or chat with our onboarding bot for help!
            </p>
            <Link
              href="/dashboard/ingest"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 font-bold rounded-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span>Upload Your Resume</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
} 