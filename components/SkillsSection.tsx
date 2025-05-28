interface SkillsSectionProps {
  skills: string[]
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="mb-6 text-2xl font-bold text-gray-900 print:text-xl">Skills</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-3 print:gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="rounded-full border border-blue-200 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 text-center text-sm font-medium text-blue-800 transition-all duration-300 hover:scale-105 hover:from-blue-200 hover:to-purple-200 print:border-gray-300 print:bg-gray-100 print:px-2 print:py-1 print:text-xs print:text-gray-800"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  )
}
