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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="text-center text-white">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        <p>Setting up your interview...</p>
      </div>
    </div>
  )
}
