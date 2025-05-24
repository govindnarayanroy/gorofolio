interface SkillsSectionProps {
  skills: string[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  if (!skills || skills.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 print:text-xl">Skills</h2>
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 font-medium rounded-full border border-blue-200 hover:from-blue-200 hover:to-purple-200 transition-all duration-300 hover:scale-105 print:bg-gray-100 print:text-gray-800 print:border-gray-300"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
} 