import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

interface PortfolioPageProps {
  params: Promise<{ id: string }>
}

function getContactIcon(label: string | undefined | null) {
  if (!label || typeof label !== 'string') {
    return <FaGlobe size={20} />
  }
  
  try {
    const lower = label.toLowerCase()
    
    if (lower.includes('github')) return <FaGithub size={20} />
    if (lower.includes('linkedin')) return <FaLinkedin size={20} />
    if (lower.includes('twitter')) return <FaTwitter size={20} />
    if (lower.includes('email') || lower.includes('mail')) return <FaEnvelope size={20} />
    if (lower.includes('phone') || lower.includes('mobile')) return <FaPhone size={20} />
    if (lower.includes('location') || lower.includes('address')) return <FaMapMarkerAlt size={20} />
    
    return <FaGlobe size={20} />
  } catch (error) {
    console.error('Error in getContactIcon:', error)
    return <FaGlobe size={20} />
  }
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // Fetch the resume data
  const { data: resume, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (error || !resume) {
    notFound()
  }

  const profile = resume.profile_data

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-6">
            {profile?.profileImage && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <Image
                  src={profile.profileImage}
                  alt={profile?.name || 'Profile'}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profile?.name}</h1>
              <h2 className="text-xl text-blue-600 font-medium mt-1">{profile?.headline}</h2>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Summary */}
          {profile?.summary && (
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>
              <p className="text-gray-700 leading-relaxed">{profile.summary}</p>
            </section>
          )}

          {/* Contact Information */}
          {profile?.links && profile.links.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.links.map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    {getContactIcon(link.label)}
                    <span className="text-gray-700">{link.label}</span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {profile?.experiences && profile.experiences.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Experience</h2>
              <div className="space-y-6">
                {profile.experiences.map((exp: any, index: number) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{exp.title}</h3>
                        <h4 className="text-lg text-blue-600 font-medium">{exp.company}</h4>
                      </div>
                      <span className="text-gray-500 text-sm md:text-base">{exp.duration}</span>
                    </div>
                    {exp.responsibilities && exp.responsibilities.length > 0 && (
                      <ul className="list-disc list-inside space-y-1 text-gray-700">
                        {exp.responsibilities.map((resp: string, respIndex: number) => (
                          <li key={respIndex}>{resp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {profile?.education && profile.education.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
              <div className="space-y-4">
                {profile.education.map((edu: any, index: number) => (
                  <div key={index} className="border-l-4 border-green-500 pl-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{edu.degree}</h3>
                        <h4 className="text-lg text-green-600 font-medium">{edu.institution}</h4>
                      </div>
                      <span className="text-gray-500 text-sm md:text-base">{edu.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {profile?.skills && profile.skills.length > 0 && (
            <section className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <p className="text-center text-gray-500 text-sm">
            Powered by GoRoFolio - AI-Powered Career Platform
          </p>
        </div>
      </footer>
    </div>
  )
} 