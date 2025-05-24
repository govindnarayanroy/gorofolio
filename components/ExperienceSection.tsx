import { Experience } from "@/lib/types";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (!experiences || experiences.length === 0) return null;

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "Present";
    const [year, month] = dateStr.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 print:text-xl">Experience</h2>
      <div className="space-y-8">
        {experiences.map((exp, index) => (
          <div key={index} className="relative">
            {/* Experience Card */}
            <div className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300 print:bg-transparent print:border-0 print:shadow-none print:p-0">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 print:text-lg">
                    {exp.role}
                  </h3>
                  <h4 className="text-lg font-semibold text-blue-600 mt-1 print:text-base">
                    {exp.company}
                  </h4>
                </div>
                <div className="text-gray-600 font-medium mt-2 sm:mt-0 print:text-sm">
                  {formatDate(exp.start)} - {formatDate(exp.end)}
                </div>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-2">
                {exp.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0 print:w-1 print:h-1 print:mt-2.5"></div>
                    <span className="text-gray-700 leading-relaxed print:text-sm">
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Timeline Connector */}
            {index < experiences.length - 1 && (
              <div className="absolute left-4 -bottom-4 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-purple-300 print:hidden"></div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 