import { Education } from "@/lib/types";

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  if (!education || education.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 print:text-xl">Education</h2>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div 
            key={index} 
            className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300 print:bg-transparent print:border-0 print:shadow-none print:p-0"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 print:text-base">
                  {edu.degree}
                </h3>
                <h4 className="text-base font-semibold text-blue-600 mt-1 print:text-sm">
                  {edu.school}
                </h4>
              </div>
              <div className="text-gray-600 font-medium mt-2 sm:mt-0 print:text-sm">
                {edu.year}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 