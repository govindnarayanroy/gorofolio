'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function InterviewRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect directly to the dynamic interview session with 'general' domain
    router.replace('/dashboard/interview/session?domain=general')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p>Setting up your interview...</p>
      </div>
    </div>
  )
} 