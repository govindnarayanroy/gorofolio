'use client'

import { useState, useEffect } from 'react'
import { Profile } from '@/lib/types'
import { getUserResume } from '@/lib/database'
import { extractDomainsFromProfile } from '@/lib/interview'
import Link from 'next/link'
import { BackToDashboard } from '@/components/BackToDashboard'
import { Badge } from '@/components/ui/badge'
import { User, Briefcase, FileText, Sparkles } from 'lucide-react'

export default function CoverLetterPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileDomains, setProfileDomains] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [jd, setJd] = useState('')
  const [tone, setTone] = useState<'professional' | 'friendly' | 'enthusiastic'>('professional')
  const [coverLetter, setCoverLetter] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadProfile() {
      try {
        const resumeData = await getUserResume()
        if (resumeData?.data) {
          setProfile(resumeData.data)
          const domains = extractDomainsFromProfile(resumeData.data)
          setProfileDomains(domains)
        }
      } catch (error) {
        console.error('Error loading profile:', error)
        setError('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleGenerate = async () => {
    if (!jd.trim()) {
      setError('Please enter a job description')
      return
    }

    if (!profile) {
      setError('Profile data not available. Please complete your profile first.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const res = await fetch('/api/generate/cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, jd, tone }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to generate cover letter')
      }

      const data = await res.json()
      setCoverLetter(data.markdown)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickFill = (domain: string) => {
    const templates = {
      'Software Engineering':
        'We are looking for a Software Engineer to join our team. You will be responsible for developing and maintaining software applications, collaborating with cross-functional teams, and ensuring high-quality code delivery.',
      'Frontend Development':
        'We are seeking a Frontend Developer to create engaging user interfaces. You will work with React, JavaScript, and modern web technologies to build responsive and interactive web applications.',
      'Backend Development':
        'We are hiring a Backend Developer to build robust server-side applications. You will work with APIs, databases, and cloud services to create scalable backend systems.',
      'Product Management':
        'We are looking for a Product Manager to drive product strategy and execution. You will work with engineering, design, and business teams to deliver products that meet customer needs.',
      'Data Science':
        'We are seeking a Data Scientist to analyze complex datasets and derive actionable insights. You will use machine learning, statistics, and data visualization to solve business problems.',
      'UX/UI Design':
        'We are hiring a UX/UI Designer to create intuitive and beautiful user experiences. You will conduct user research, create wireframes, and design interfaces that delight users.',
      Marketing:
        'We are looking for a Marketing professional to drive growth and brand awareness. You will develop marketing strategies, manage campaigns, and analyze performance metrics.',
      Sales:
        'We are seeking a Sales professional to drive revenue growth. You will build relationships with prospects, manage the sales pipeline, and close deals.',
    }

    setJd(templates[domain as keyof typeof templates] || templates['Software Engineering'])
  }

  // Function to extract domain from job description
  const extractDomainFromJD = (jobDescription: string): string => {
    const jdLower = jobDescription.toLowerCase()

    // Domain mapping based on keywords in job description
    const domainKeywords = {
      marketing: [
        'marketing',
        'brand',
        'campaign',
        'advertising',
        'promotion',
        'digital marketing',
      ],
      sales: ['sales', 'revenue', 'selling', 'business development', 'account management'],
      pm: ['product manager', 'product management', 'roadmap', 'feature', 'product strategy'],
      engineering: ['engineer', 'developer', 'programming', 'software', 'technical', 'coding'],
      design: ['designer', 'design', 'ui', 'ux', 'user experience', 'interface'],
      data: ['data scientist', 'data analyst', 'analytics', 'machine learning', 'statistics'],
    }

    // Find the best matching domain
    for (const [domain, keywords] of Object.entries(domainKeywords)) {
      if (keywords.some(keyword => jdLower.includes(keyword))) {
        return domain
      }
    }

    return 'general' // fallback
  }

  // Function to extract job title from job description
  const extractJobTitle = (jobDescription: string): string => {
    const lines = jobDescription.split('\n')
    const firstLine = lines[0] || ''

    // Look for common patterns like "We are looking for a [TITLE]" or "We are hiring a [TITLE]"
    const patterns = [
      /(?:looking for|seeking|hiring)\s+an?\s+([^.]+?)(?:\s+to|\s+who|\s+with|\.)/i,
      /position.*?:\s*([^.]+)/i,
      /role.*?:\s*([^.]+)/i,
    ]

    for (const pattern of patterns) {
      const match = firstLine.match(pattern)
      if (match && match[1]) {
        return match[1].trim()
      }
    }

    // Fallback: try to extract from domain
    const domain = extractDomainFromJD(jobDescription)
    const domainTitles = {
      marketing: 'Marketing Professional',
      sales: 'Sales Professional',
      pm: 'Product Manager',
      engineering: 'Software Engineer',
      design: 'Designer',
      data: 'Data Scientist',
    }

    return domainTitles[domain as keyof typeof domainTitles] || 'Professional'
  }

  // Enhanced Practice Interview URL with context
  const getPracticeInterviewUrl = () => {
    if (!jd.trim()) {
      return '/dashboard/interview'
    }

    const domain = extractDomainFromJD(jd)
    const jobTitle = extractJobTitle(jd)
    const encodedJD = encodeURIComponent(jd)
    const encodedTitle = encodeURIComponent(jobTitle)

    return `/dashboard/interview/session?domain=${domain}&role=${encodedTitle}&jd=${encodedJD}`
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500"></div>
          <p className="text-white">Loading your profile...</p>
        </div>
      </div>
    )
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
              <BackToDashboard variant="header" />

              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 animate-pulse rounded-full bg-purple-400"></div>
                <span className="font-medium text-white">Cover Letter Writer</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-6xl px-6 py-12">
          {/* Page Header */}
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-r from-purple-500 to-pink-400 shadow-2xl">
              <FileText className="h-10 w-10 text-white" />
            </div>
            <h1 className="mb-4 text-4xl font-black text-white">Personalized Cover Letters</h1>
            <p className="mx-auto max-w-3xl text-xl text-blue-200/90">
              {profile
                ? `Generate cover letters tailored to ${profile.name}'s experience and skills`
                : 'Complete your profile to generate personalized cover letters'}
            </p>
          </div>

          {!profile ? (
            <div className="py-12 text-center">
              <div className="mx-auto max-w-md rounded-xl border border-white/20 bg-white/10 p-8 backdrop-blur-md">
                <User className="mx-auto mb-4 h-16 w-16 text-blue-400" />
                <h3 className="mb-2 text-xl font-semibold text-white">Profile Required</h3>
                <p className="mb-6 text-blue-200">
                  Complete your profile to generate personalized cover letters with your experience
                  and skills.
                </p>
                <Link
                  href="/dashboard/editor"
                  className="inline-flex items-center rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
                >
                  Complete Profile
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Profile Summary */}
              <div className="mb-8 rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-md">
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{profile.name}</h3>
                    <p className="text-blue-200">{profile.headline}</p>
                  </div>
                </div>

                {profileDomains.length > 0 && (
                  <div>
                    <p className="mb-3 text-sm text-blue-200">Your expertise areas:</p>
                    <div className="flex flex-wrap gap-2">
                      {profileDomains.map(domain => (
                        <Badge
                          key={domain}
                          className="cursor-pointer border-green-500/30 bg-green-500/20 text-green-300 transition-colors hover:bg-green-500/30"
                          onClick={() => handleQuickFill(domain)}
                        >
                          <Sparkles className="mr-1 h-3 w-3" />
                          {domain}
                        </Badge>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-blue-300">
                      Click on any domain to auto-fill a sample job description
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Input Section */}
                <div className="rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Generate Your Cover Letter
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="tone"
                        className="mb-3 block text-sm font-semibold text-gray-700"
                      >
                        Tone & Style
                      </label>
                      <select
                        id="tone"
                        value={tone}
                        onChange={e => setTone(e.target.value as typeof tone)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="professional">Professional</option>
                        <option value="friendly">Friendly</option>
                        <option value="enthusiastic">Enthusiastic</option>
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="jd"
                        className="mb-3 block text-sm font-semibold text-gray-700"
                      >
                        Job Description
                      </label>
                      <textarea
                        id="jd"
                        value={jd}
                        onChange={e => setJd(e.target.value)}
                        rows={8}
                        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Paste the job description here..."
                      />
                    </div>

                    {error && (
                      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm text-red-600">{error}</p>
                      </div>
                    )}

                    <button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 px-6 py-4 font-bold text-white transition-all duration-300 hover:scale-105 hover:from-purple-500 hover:via-pink-400 hover:to-purple-400 hover:shadow-2xl hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                          Generating...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span>Generate Cover Letter</span>
                          <Sparkles className="ml-2 h-5 w-5" />
                        </div>
                      )}
                    </button>

                    {/* Quick Actions */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">Quick Actions</span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={getPracticeInterviewUrl()}
                          className="flex-1 rounded-lg bg-blue-50 px-3 py-2 text-center text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
                        >
                          <Briefcase className="mr-1 inline h-4 w-4" />
                          Practice Interview
                        </Link>
                        <Link
                          href="/dashboard/preview"
                          className="flex-1 rounded-lg bg-green-50 px-3 py-2 text-center text-sm font-medium text-green-700 transition-colors hover:bg-green-100"
                        >
                          <FileText className="mr-1 inline h-4 w-4" />
                          View Resume
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Output Section */}
                <div className="rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
                  {coverLetter ? (
                    <>
                      <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Generated Cover Letter</h2>
                        <button
                          onClick={() => navigator.clipboard.writeText(coverLetter)}
                          className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-300 hover:bg-gray-200"
                        >
                          Copy
                        </button>
                      </div>
                      <div className="prose prose-gray max-w-none">
                        {coverLetter.split('\n').map((line, i) => (
                          <p key={i} className="mb-4 leading-relaxed text-gray-700">
                            {line}
                          </p>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100">
                        <FileText className="h-8 w-8 text-purple-500" />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        Your cover letter will appear here
                      </h3>
                      <p className="text-gray-600">
                        Fill in the job description and click generate to create your personalized
                        cover letter.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
