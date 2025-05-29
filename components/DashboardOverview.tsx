'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Upload,
  Edit3,
  Eye,
  Share2,
  Download,
  MessageSquare,
  Mic,
  CheckCircle,
  Clock,
  ArrowRight,
  User,
  Briefcase,
  FileText,
  Trophy,
  Target,
  Calendar,
} from 'lucide-react'
import Link from 'next/link'
import { Profile } from '@/lib/types'
import { ProfileImage } from './ProfileImage'

// Define the InterviewSession type locally to avoid importing from server-side module
interface InterviewSession {
  id: string
  domain: string
  job_description?: string
  custom_job_position?: string
  overall_score?: number
  completed: boolean
  created_at: string
  updated_at: string
}

interface DashboardOverviewProps {
  className?: string
}

export function DashboardOverview({ className = '' }: DashboardOverviewProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [interviewSessions, setInterviewSessions] = useState<InterviewSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const [resumeResponse, sessionsResponse] = await Promise.all([
          fetch('/api/resume').then(res => res.json()),
          fetch('/api/interview/sessions?limit=5').then(res => res.json()),
        ])

        if (resumeResponse?.data?.data) {
          // The API returns nested data: { data: { data: profileData } }
          setProfile(resumeResponse.data.data)
        }

        if (sessionsResponse.success) {
          setInterviewSessions(sessionsResponse.data)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Show loading animation while data is being fetched
  if (loading) {
    return (
      <div className={`space-y-8 ${className}`}>
        {/* Loading Welcome Section */}
        <div className="space-y-4 text-center">
          <div className="mb-4 flex justify-center">
            <div className="h-24 w-24 animate-pulse rounded-full bg-white/20"></div>
          </div>
          <div className="space-y-2">
            <div className="mx-auto h-8 w-64 animate-pulse rounded-lg bg-white/20"></div>
            <div className="mx-auto h-4 w-96 animate-pulse rounded-lg bg-white/10"></div>
          </div>
        </div>

        {/* Loading Profile Completion Card */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded bg-white/20"></div>
              <div className="h-6 w-32 animate-pulse rounded bg-white/20"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-white/20"></div>
                <div className="h-4 w-12 animate-pulse rounded bg-white/20"></div>
              </div>
              <div className="h-3 w-full animate-pulse rounded-full bg-white/20"></div>
              <div className="h-4 w-48 animate-pulse rounded bg-white/10"></div>
            </div>
          </CardContent>
        </Card>

        {/* Loading Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-white/20 bg-white/10 backdrop-blur-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 animate-pulse rounded bg-white/20"></div>
                  <div className="h-6 w-24 animate-pulse rounded bg-white/20"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-white/10"></div>
                    <div className="h-4 w-3/4 animate-pulse rounded bg-white/10"></div>
                  </div>
                  <div className="h-10 w-full animate-pulse rounded bg-white/20"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Recent Activity */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 animate-pulse rounded bg-white/20"></div>
              <div className="h-6 w-32 animate-pulse rounded bg-white/20"></div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-white/20"></div>
                    <div className="h-3 w-24 animate-pulse rounded bg-white/10"></div>
                  </div>
                  <div className="h-6 w-12 animate-pulse rounded bg-white/20"></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading indicator with text */}
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
            <p className="text-white/80">Loading your dashboard...</p>
            <p className="text-sm text-white/60">This may take a few moments</p>
          </div>
        </div>
      </div>
    )
  }

  const hasProfile = profile && profile.name && profile.name !== ''
  const completionPercentage = hasProfile ? calculateCompletionPercentage(profile) : 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Welcome Section */}
      <div className="space-y-4 text-center">
        <div className="mb-4 flex justify-center">
          {hasProfile ? (
            <ProfileImage imageUrl={profile.image_url} name={profile.name} size="xl" />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <User className="h-12 w-12 text-white" />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold text-white">
          {hasProfile ? `Welcome back, ${profile.name.split(' ')[0]}!` : 'Welcome to Gorofolio!'}
        </h1>
        <p className="mx-auto max-w-2xl text-blue-200">
          {hasProfile
            ? 'Your professional portfolio is ready. Continue building your career story.'
            : 'Create your professional portfolio in minutes. Upload your resume or start from scratch.'}
        </p>
      </div>

      {/* Profile Completion */}
      {hasProfile && (
        <Card className="border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <CheckCircle className="h-5 w-5" />
              Profile Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-white">
                <span>Profile Strength</span>
                <span>{completionPercentage}%</span>
              </div>
              <div className="h-3 w-full rounded-full bg-white/20">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-blue-200">
                {completionPercentage === 100
                  ? '🎉 Your profile is complete and ready to impress!'
                  : `Add ${getNextSuggestion(profile)} to strengthen your profile`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Upload Resume */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Upload className="h-5 w-5 text-yellow-400" />
              Upload Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-blue-200">
              Upload your PDF resume and let AI extract your information automatically.
            </p>
            <Link href="/dashboard/ingest">
              <Button className="w-full bg-yellow-500 font-medium text-black hover:bg-yellow-600">
                Upload PDF
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Edit Profile */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Edit3 className="h-5 w-5 text-blue-400" />
              {hasProfile ? 'Edit Profile' : 'Create Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-blue-200">
              {hasProfile
                ? 'Fine-tune your professional information, add experiences, and upload photos.'
                : 'Start building your professional profile. Add your information, experiences, and skills.'}
            </p>
            <Link href="/dashboard/editor">
              <Button className="w-full bg-blue-500 font-medium text-white hover:bg-blue-600">
                {hasProfile ? 'Edit Profile' : 'Create Profile'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Preview Resume */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Eye className="h-5 w-5 text-green-400" />
              {hasProfile ? 'Preview Resume' : 'Resume Preview'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-blue-200">
              {hasProfile
                ? 'See how your resume looks and download it in multiple professional formats.'
                : 'Create your profile first to preview and download your professional resume.'}
            </p>
            <Link href="/dashboard/preview">
              <Button
                className={`w-full font-medium ${
                  hasProfile
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-500 text-white opacity-75 hover:bg-gray-600'
                }`}
                {...(!hasProfile && { 'aria-disabled': true })}
              >
                {hasProfile ? 'View Preview' : 'Create Profile First'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Portfolio */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Share2 className="h-5 w-5 text-purple-400" />
              {hasProfile ? 'View Portfolio' : 'Create Portfolio'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-blue-200">
              {hasProfile
                ? 'View and manage your beautiful online portfolio. Share it with potential employers.'
                : 'Create a beautiful online portfolio to showcase your professional profile.'}
            </p>
            <Link href="/dashboard/profile/123">
              <Button
                className={`w-full font-medium ${
                  hasProfile
                    ? 'bg-purple-500 text-white hover:bg-purple-600'
                    : 'bg-gray-500 text-white opacity-75 hover:bg-gray-600'
                }`}
                {...(!hasProfile && { 'aria-disabled': true })}
              >
                {hasProfile ? 'View Portfolio' : 'Create Profile First'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Cover Letter */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <FileText className="h-5 w-5 text-pink-400" />
              {hasProfile ? 'Generate Cover Letter' : 'Cover Letter Generator'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-blue-200">
              {hasProfile
                ? 'Generate personalized cover letters for any job posting using your profile data.'
                : 'Create your profile first to generate personalized cover letters with AI.'}
            </p>
            <Link href="/dashboard/cover">
              <Button
                className={`w-full font-medium ${
                  hasProfile
                    ? 'bg-pink-500 text-white hover:bg-pink-600'
                    : 'bg-gray-500 text-white opacity-75 hover:bg-gray-600'
                }`}
                {...(!hasProfile && { 'aria-disabled': true })}
              >
                {hasProfile ? 'Write Letter' : 'Create Profile First'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Interview Practice */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mic className="h-5 w-5 text-red-400" />
              Interview Practice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-blue-200">
              Practice interviews with AI feedback to improve your performance.
            </p>
            <Link href="/dashboard/interview">
              <Button className="w-full bg-red-500 font-medium text-white hover:bg-red-600">
                Start Practice
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Quick Edit Actions for Existing Users */}
      {hasProfile && (
        <Card className="border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Edit3 className="h-5 w-5" />
              Quick Edit Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Link href="/dashboard/editor?section=experience">
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Edit Experience
                </Button>
              </Link>
              <Link href="/dashboard/editor?section=education">
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <User className="mr-2 h-4 w-4" />
                  Edit Education
                </Button>
              </Link>
              <Link href="/dashboard/editor?section=skills">
                <Button
                  variant="outline"
                  className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Edit Skills
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {hasProfile && (
        <Card className="border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-blue-200">
                <div className="h-2 w-2 rounded-full bg-green-400"></div>
                <span className="text-sm">Profile updated with latest information</span>
                <span className="ml-auto text-xs text-blue-300">Today</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200">
                <div className="h-2 w-2 rounded-full bg-blue-400"></div>
                <span className="text-sm">Resume downloaded in Modern style</span>
                <span className="ml-auto text-xs text-blue-300">Yesterday</span>
              </div>
              <div className="flex items-center gap-3 text-blue-200">
                <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                <span className="text-sm">Portfolio shared with 3 contacts</span>
                <span className="ml-auto text-xs text-blue-300">2 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interview History */}
      {hasProfile && (
        <Card className="border-white/20 bg-white/10 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Trophy className="h-5 w-5" />
              Interview History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {interviewSessions.length > 0 ? (
                interviewSessions.map(session => (
                  <Link
                    key={session.id}
                    href={`/dashboard/interview/results?session=${session.id}`}
                  >
                    <div className="flex cursor-pointer items-center justify-between rounded-lg bg-white/5 p-3 transition-colors hover:bg-white/10">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            session.overall_score
                              ? `bg-gradient-to-br ${session.overall_score >= 8 ? 'from-green-500 to-emerald-600' : session.overall_score >= 6 ? 'from-yellow-500 to-orange-600' : 'from-red-500 to-pink-600'}`
                              : 'bg-gray-500'
                          }`}
                        >
                          <Trophy className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium capitalize text-white">
                            {session.domain} Interview
                          </div>
                          <div className="text-xs text-blue-300">
                            {session.completed ? 'Completed' : 'In Progress'} •{' '}
                            {formatDate(session.created_at)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {session.overall_score ? (
                          <div
                            className={`text-lg font-bold ${getScoreColor(session.overall_score)}`}
                          >
                            {session.overall_score}/10
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400">—</div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-4 text-center">
                  <Target className="mx-auto mb-2 h-8 w-8 text-blue-400" />
                  <p className="mb-3 text-sm text-blue-200">No interview sessions yet</p>
                  <Link href="/dashboard/interview">
                    <Button size="sm" className="bg-blue-500 text-white hover:bg-blue-600">
                      Start First Interview
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function calculateCompletionPercentage(profile: Profile): number {
  let score = 0
  const maxScore = 8

  if (profile.name) score += 1
  if (profile.headline) score += 1
  if (profile.summary) score += 1
  if (profile.image_url) score += 1
  if (profile.experiences && profile.experiences.length > 0) score += 1
  if (profile.education && profile.education.length > 0) score += 1
  if (profile.skills && profile.skills.length >= 3) score += 1
  if (profile.links && profile.links.length > 0) score += 1

  return Math.round((score / maxScore) * 100)
}

function getNextSuggestion(profile: Profile): string {
  if (!profile.image_url) return 'a profile photo'
  if (!profile.summary) return 'a professional summary'
  if (!profile.experiences || profile.experiences.length === 0) return 'work experience'
  if (!profile.education || profile.education.length === 0) return 'education details'
  if (!profile.skills || profile.skills.length < 3) return 'more skills'
  if (!profile.links || profile.links.length === 0) return 'professional links'
  return 'more details'
}
