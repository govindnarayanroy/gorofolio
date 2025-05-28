'use client'

import { useRef, useEffect, useState } from 'react'
import ResumePreview from '@/components/ResumePreview'
import { ResumeOptimizer } from '@/components/ResumeOptimizer'
import { Profile } from '@/lib/types'
import { getUserResume } from '@/lib/database'
import { BackToDashboard } from '@/components/BackToDashboard'
import { Button } from '@/components/ui/button'
import { Target, Eye, Download, Edit } from 'lucide-react'

const defaultProfile: Profile = {
  name: 'Your Name',
  headline: 'Your Professional Title',
  summary: 'Add your professional summary in the editor to see it here.',
  experiences: [],
  education: [],
  skills: [],
  links: [],
}

export default function PreviewPage() {
  const [profile, setProfile] = useState<Profile>(defaultProfile)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showOptimizer, setShowOptimizer] = useState(false)
  const resumeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true)
        setError(null)

        const resumeData = await getUserResume()

        if (resumeData?.data) {
          setProfile(resumeData.data)
        } else {
          // No resume data found, keep default
          setProfile(defaultProfile)
        }
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Failed to load resume data')
        setProfile(defaultProfile)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  // Enhanced print function for better A4 alignment
  const handlePrintResume = () => {
    // Add a small delay to ensure styles are applied
    setTimeout(() => {
      window.print()
    }, 100)
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600">Loading your resume...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
      <div className="mb-6 print:hidden">
        <div className="mb-4 flex items-center justify-between">
          <BackToDashboard variant="minimal" />
        </div>
        <h1 className="mb-2 text-2xl font-bold text-gray-900">Resume Preview & Optimization</h1>
        <p className="text-gray-600">
          {profile.name === defaultProfile.name
            ? 'Upload a resume or use the editor to add your information.'
            : 'Your resume is ready! You can download it as a PDF, make changes, or optimize it for specific jobs.'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 print:hidden">
        <Button onClick={handlePrintResume} className="bg-sky-600 hover:bg-sky-700">
          <Download className="mr-2 h-4 w-4" />
          Download PDF
        </Button>

        <Button onClick={() => (window.location.href = '/dashboard/editor')} variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Resume
        </Button>

        {profile.name !== defaultProfile.name && (
          <Button
            onClick={() => setShowOptimizer(!showOptimizer)}
            variant={showOptimizer ? 'default' : 'outline'}
            className={showOptimizer ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <Target className="mr-2 h-4 w-4" />
            {showOptimizer ? 'Hide Optimizer' : 'Optimize for Jobs'}
          </Button>
        )}
      </div>

      <div
        className={`${showOptimizer ? 'flex flex-col gap-6 xl:flex-row' : 'flex justify-center'}`}
      >
        {/* Resume Preview */}
        <div
          className={`${showOptimizer ? 'xl:max-w-4xl xl:flex-1' : 'mx-auto w-full max-w-4xl'} space-y-4`}
        >
          <div className="flex items-center gap-2 text-sm text-gray-600 print:hidden">
            <Eye className="h-4 w-4" />
            Resume Preview
          </div>
          <div className="overflow-x-auto">
            <ResumePreview ref={resumeRef} profile={profile} />
          </div>
        </div>

        {/* Resume Optimizer */}
        {showOptimizer && profile.name !== defaultProfile.name && (
          <div className="space-y-4 xl:w-96 xl:flex-shrink-0 print:hidden">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Target className="h-4 w-4" />
              Resume Optimization
            </div>
            <div className="sticky top-6">
              <ResumeOptimizer profile={profile} />
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
