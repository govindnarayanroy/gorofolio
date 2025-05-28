'use client'
import React, { forwardRef } from 'react'
import { Profile } from '@/lib/types'
import { ProfileImage } from './ProfileImage'
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react'

/**
 * Modern A4-print-safe résumé preview with contemporary styling.
 * Wrapped with forwardRef so react-to-print can grab the DOM node.
 */
const ResumePreview = forwardRef<HTMLElement, { profile: Profile }>(({ profile }, ref) => {
  const getContactIcon = (label: string | undefined | null) => {
    // Handle undefined, null, or empty labels
    if (!label || typeof label !== 'string' || label.trim() === '') {
      return <Globe className="h-4 w-4" />
    }

    try {
      const lower = label.toLowerCase()
      if (lower.includes('email') || lower.includes('mail')) return <Mail className="h-4 w-4" />
      if (lower.includes('phone') || lower.includes('mobile')) return <Phone className="h-4 w-4" />
      if (lower.includes('linkedin')) return <Linkedin className="h-4 w-4" />
      if (lower.includes('github')) return <Github className="h-4 w-4" />
      if (lower.includes('website') || lower.includes('portfolio'))
        return <Globe className="h-4 w-4" />
      return <Globe className="h-4 w-4" />
    } catch (error) {
      console.warn('Error processing label in getContactIcon:', error)
      return <Globe className="h-4 w-4" />
    }
  }

  // Function to format date from YYYY-MM to Month Year
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString || dateString === 'Present') return dateString

    try {
      // Handle YYYY-MM format
      if (dateString.includes('-')) {
        const [year, month] = dateString.split('-')
        const monthNames = [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ]
        const monthIndex = parseInt(month) - 1
        if (monthIndex >= 0 && monthIndex < 12) {
          return `${monthNames[monthIndex]} ${year}`
        }
      }

      // If it's already in a different format, return as is
      return dateString
    } catch (error) {
      console.warn('Error formatting date:', error)
      return dateString
    }
  }

  return (
    <article
      ref={ref}
      className="mx-auto w-full max-w-[210mm] border border-gray-200 bg-white shadow-lg print:m-0 print:mt-0 print:block print:w-full print:max-w-none print:border-none print:p-0 print:shadow-none"
      style={{ minHeight: '297mm' }}
    >
      {/* Modern Header with Accent Color */}
      <header className="relative bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-8 text-white print:mt-0 print:bg-slate-800 print:px-4 print:py-3">
        <div className="flex items-start gap-6 print:gap-3">
          <ProfileImage
            imageUrl={profile.image_url}
            name={profile.name}
            size="xl"
            className="border-4 border-white/20 shadow-xl print:h-12 print:w-12 print:border-2"
          />
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold tracking-tight print:mb-1 print:text-2xl">
              {profile.name}
            </h1>
            <p className="mb-4 text-xl font-light text-slate-200 print:mb-2 print:text-base">
              {profile.headline}
            </p>

            {/* Contact Information */}
            {profile.links && profile.links.length > 0 && (
              <div className="flex flex-wrap gap-4 text-sm text-slate-300 print:gap-2 print:text-xs">
                {profile.links
                  .slice(0, 3)
                  .filter(link => link && link.url)
                  .map((link, index) => (
                    <div key={index} className="flex items-center gap-2 print:gap-1">
                      {getContactIcon(link.label)}
                      <span>{link.url.replace(/^https?:\/\//, '')}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Decorative accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 print:hidden"></div>
      </header>

      <div className="px-8 py-6 print:px-4 print:py-3">
        {/* Professional Summary */}
        <section className="mb-8 print:mb-4">
          <h2 className="mb-3 border-b-2 border-slate-200 pb-2 text-lg font-bold text-slate-800 print:mb-2 print:pb-1 print:text-base">
            Professional Summary
          </h2>
          <p className="text-justify leading-relaxed text-slate-700 print:text-sm">
            {profile.summary}
          </p>
        </section>

        {/* Experience Section */}
        {(profile.experiences ?? []).length > 0 && (
          <section className="mb-8 print:mb-4">
            <h2 className="mb-4 border-b-2 border-slate-200 pb-2 text-lg font-bold text-slate-800 print:mb-2 print:pb-1 print:text-base">
              Professional Experience
            </h2>
            <div className="space-y-6 print:space-y-3">
              {profile.experiences.map((exp, index) => (
                <div key={exp.company + exp.role} className="relative">
                  {/* Timeline dot */}
                  <div className="absolute -left-2 top-2 h-3 w-3 rounded-full bg-blue-500 print:hidden"></div>

                  <div className="pl-6 print:pl-0">
                    <div className="mb-2 flex items-start justify-between print:mb-1">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 print:text-sm print:font-bold">
                          {exp.role}
                        </h3>
                        <p className="font-medium text-blue-600 print:text-sm print:text-slate-700">
                          {exp.company}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-500 print:bg-transparent print:px-0 print:py-0 print:text-xs">
                        {formatDate(exp.start)} – {formatDate(exp.end) ?? 'Present'}
                      </span>
                    </div>

                    <ul className="space-y-2 print:space-y-1">
                      {exp.bullets.map((bullet, i) => (
                        <li
                          key={i}
                          className="flex items-start leading-relaxed text-slate-700 print:text-sm"
                        >
                          <span className="mr-3 mt-1.5 text-blue-500 print:mr-2 print:mt-1 print:text-slate-600">
                            •
                          </span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Two-column layout for Education and Skills */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 print:grid-cols-2 print:gap-4">
          {/* Education */}
          {(profile.education ?? []).length > 0 && (
            <section>
              <h2 className="mb-4 border-b-2 border-slate-200 pb-2 text-lg font-bold text-slate-800 print:mb-2 print:pb-1 print:text-base">
                Education
              </h2>
              <div className="space-y-3 print:space-y-2">
                {profile.education.map((ed, index) => (
                  <div
                    key={ed.school}
                    className="rounded-lg bg-slate-50 p-4 print:bg-transparent print:p-0"
                  >
                    <h3 className="font-semibold text-slate-800 print:text-sm print:font-bold">
                      {ed.degree}
                    </h3>
                    <p className="font-medium text-blue-600 print:text-sm print:text-slate-700">
                      {ed.school}
                    </p>
                    <p className="text-sm text-slate-500 print:text-xs">{ed.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {(profile.skills ?? []).length > 0 && (
            <section>
              <h2 className="mb-4 border-b-2 border-slate-200 pb-2 text-lg font-bold text-slate-800 print:mb-2 print:pb-1 print:text-base">
                Core Competencies
              </h2>
              <div className="grid grid-cols-2 gap-2 print:grid-cols-1 print:gap-1">
                {profile.skills.map((skill, index) => (
                  <div
                    key={skill}
                    className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-2 text-sm font-medium text-slate-700 print:border print:border-slate-300 print:bg-transparent print:px-1 print:py-0 print:text-xs"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Additional Links */}
        {profile.links && profile.links.length > 3 && (
          <section className="mt-8 print:mt-4">
            <h2 className="mb-4 border-b-2 border-slate-200 pb-2 text-lg font-bold text-slate-800 print:mb-2 print:pb-1 print:text-base">
              Additional Links
            </h2>
            <div className="grid grid-cols-2 gap-3 print:grid-cols-1 print:gap-1">
              {profile.links
                .slice(3)
                .filter(link => link && link.url)
                .map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-slate-600 print:text-xs"
                  >
                    {getContactIcon(link.label)}
                    <span className="font-medium">{link.label || 'Link'}:</span>
                    <span className="text-blue-600 print:text-slate-700">
                      {link.url.replace(/^https?:\/\//, '')}
                    </span>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer with subtle branding */}
      <footer className="mt-auto border-t border-slate-200 px-8 py-4 print:hidden">
        <div className="text-center text-xs text-slate-400">
          Generated with Gorofolio • Professional Resume Builder
        </div>
      </footer>
    </article>
  )
})

ResumePreview.displayName = 'ResumePreview'
export default ResumePreview
