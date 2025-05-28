import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { ProfileHeader } from '@/components/ProfileHeader'
import { ExperienceSection } from '@/components/ExperienceSection'
import { EducationSection } from '@/components/EducationSection'
import { SkillsSection } from '@/components/SkillsSection'
import { LinksList } from '@/components/LinksList'
import { PublishButton } from '@/components/PublishButton'
import { DownloadButton } from '@/components/DownloadButton'
import { BackToDashboard } from '@/components/BackToDashboard'
import { Profile } from '@/lib/types'
import { PortfolioPublish } from '@/components/PortfolioPublish'

interface ProfilePageProps {
  params: Promise<{ id: string }>
}

// Default profile for when no data is found
const defaultProfile: Profile = {
  name: 'Your Name',
  headline: 'Your Professional Title',
  summary:
    'Add your professional summary in the editor to see it here. This portfolio will showcase your skills and experience to potential employers.',
  experiences: [],
  education: [],
  skills: [],
  links: [],
}

async function getUserProfile(): Promise<Profile> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('No authenticated user found')
      return defaultProfile
    }

    const { data: resumeData, error: dbError } = await supabase
      .from('resumes')
      .select('data')
      .eq('user_id', user.id)
      .single()

    if (dbError || !resumeData?.data) {
      console.log('No resume data found for user')
      return defaultProfile
    }

    return resumeData.data as Profile
  } catch (error) {
    console.error('Error loading user profile:', error)
    return defaultProfile
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params

  // Load the actual user's profile data
  const profile = await getUserProfile()

  // If no profile data exists, show the default with helpful message
  const isDefaultProfile = profile.name === defaultProfile.name

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10"></div>
      <div className="absolute left-20 top-20 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl"></div>

      <div className="relative mx-auto max-w-4xl px-6 py-12">
        {/* Navigation and Action Buttons */}
        <div className="mb-8 flex items-center justify-between print:hidden">
          <BackToDashboard variant="button" />
          <div className="flex gap-4">
            <DownloadButton profileId={id} />
            <PublishButton profileId={id} />
          </div>
        </div>

        {/* Portfolio Publishing Component */}
        {!isDefaultProfile && (
          <div className="mb-8 print:hidden">
            <PortfolioPublish profileId={id} />
          </div>
        )}

        {/* Help Message for Empty Profile */}
        {isDefaultProfile && (
          <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 print:hidden">
            <div className="mb-2 flex items-center">
              <svg
                className="mr-2 h-5 w-5 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="font-semibold text-blue-900">Portfolio Not Ready Yet</h3>
            </div>
            <p className="mb-4 text-blue-700">
              Your portfolio will appear here once you upload a resume or add your information in
              the editor.
            </p>
            <div className="flex gap-3">
              <a
                href="/dashboard/ingest"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                Upload Resume
              </a>
              <a
                href="/dashboard/editor"
                className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700"
              >
                Use Editor
              </a>
            </div>
          </div>
        )}

        {/* Profile Content */}
        <div
          className="rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm lg:p-12 print:bg-white print:p-0 print:shadow-none"
          id="profile-content"
        >
          <ProfileHeader profile={profile} />

          {/* External Links */}
          {profile.links && profile.links.length > 0 && <LinksList links={profile.links} />}

          {/* Summary Section */}
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 print:text-xl">Summary</h2>
            <p className="text-justify leading-relaxed text-gray-700">{profile.summary}</p>
          </section>

          {/* Experience Section */}
          {profile.experiences && profile.experiences.length > 0 && (
            <ExperienceSection experiences={profile.experiences} />
          )}

          {/* Education Section */}
          {profile.education && profile.education.length > 0 && (
            <EducationSection education={profile.education} />
          )}

          {/* Skills Section */}
          {profile.skills && profile.skills.length > 0 && <SkillsSection skills={profile.skills} />}
        </div>
      </div>
    </div>
  )
}
