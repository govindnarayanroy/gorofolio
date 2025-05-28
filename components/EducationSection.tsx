import { Education } from '@/lib/types'

interface EducationSectionProps {
  education: Education[]
}

export function EducationSection({ education }: EducationSectionProps) {
  if (!education || education.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 print:text-xl">Education</h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-6 transition-shadow duration-300 hover:shadow-lg print:border-0 print:bg-transparent print:p-0 print:shadow-none"
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 print:text-base">{edu.degree}</h3>
                <h4 className="mt-1 text-base font-semibold text-blue-600 print:text-sm">
                  {edu.school}
                </h4>
              </div>
              <div className="mt-2 font-medium text-gray-600 sm:mt-0 print:text-sm">{edu.year}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
