import { FeatureCard } from "./FeatureCard";
import { 
  Globe, 
  FileText, 
  PenTool, 
  Bell, 
  Mic 
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Globe className="h-12 w-12" />,
      title: "AI Portfolio Builder",
      description: "Generate a fully hosted portfolio site from your resume or LinkedIn in seconds—custom subdomain and exportable HTML included."
    },
    {
      icon: <FileText className="h-12 w-12" />,
      title: "ATS‑Ready Résumé Generator",
      description: "Auto‑format your résumé for applicant tracking systems with keyword analysis and real‑time optimization."
    },
    {
      icon: <PenTool className="h-12 w-12" />,
      title: "Tailored Cover Letters", 
      description: "Write job‑specific cover letters with one click, using your profile data and the target job description."
    },
    {
      icon: <Bell className="h-12 w-12" />,
      title: "Personalized Job Alerts",
      description: "Stay ahead of the curve with AI‑filtered job recommendations delivered straight to your inbox."
    },
    {
      icon: <Mic className="h-12 w-12" />,
      title: "AI Mock Interviewer",
      description: "Practice real‑world interview questions with an AI interviewer that scores your answers and provides instant feedback."
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-100/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-100/30 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-100 mb-6">
            <span className="text-sm font-medium text-blue-700">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Land Your Dream Job
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform streamlines your job search with intelligent tools designed for modern professionals
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to transform your career?
            </h3>
            <p className="text-blue-100 mb-8 text-lg">
              Join thousands of professionals who've accelerated their job search with AI
            </p>
            <button className="bg-white text-gray-900 font-semibold px-8 py-4 rounded-2xl hover:bg-gray-50 transition-colors duration-300 shadow-lg">
              Start Building Your Portfolio
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 