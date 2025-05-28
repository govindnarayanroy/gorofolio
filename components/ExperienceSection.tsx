import { Experience } from '@/lib/types'

interface ExperienceSectionProps {
  experiences: Experience[]
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (!experiences || experiences.length === 0) return null

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Present'
    const [year, month] = dateStr.split('-')
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
    return `${monthNames[parseInt(month) - 1]} ${year}`
  }

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 print:text-xl">Experience</h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="relative">
            {/* Experience Card */}
            <div className="rounded-xl border border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50 p-6 transition-shadow duration-300 hover:shadow-lg print:border-0 print:bg-transparent print:p-0 print:shadow-none">
              {/* Header */}
              <div className="mb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 print:text-lg">{exp.role}</h3>
                  <h4 className="mt-1 text-lg font-semibold text-blue-600 print:text-base">
                    {exp.company}
                  </h4>
                </div>
                <div className="mt-2 font-medium text-gray-600 sm:mt-0 print:text-sm">
                  {formatDate(exp.start)} - {formatDate(exp.end)}
                </div>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-2">
                {exp.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start gap-3">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500 print:mt-2.5 print:h-1 print:w-1"></div>
                    <span className="leading-relaxed text-gray-700 print:text-sm">{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline Connector */}
            {index < experiences.length - 1 && (
              <div className="absolute -bottom-4 left-4 h-8 w-0.5 bg-gradient-to-b from-blue-300 to-purple-300 print:hidden"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
