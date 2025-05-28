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
      description: "Generate a fully hosted portfolio site from your resume or LinkedIn in seconds—custom subdomain and exportable HTML included.",
      gradient: "from-blue-500 to-cyan-500",
      delay: "animation-delay-200"
    },
    {
      icon: <FileText className="h-12 w-12" />,
      title: "ATS‑Ready Résumé Generator",
      description: "Auto‑format your résumé for applicant tracking systems with keyword analysis and real‑time optimization.",
      gradient: "from-emerald-500 to-teal-500",
      delay: "animation-delay-400"
    },
    {
      icon: <PenTool className="h-12 w-12" />,
      title: "Tailored Cover Letters", 
      description: "Write job‑specific cover letters with one click, using your profile data and the target job description.",
      gradient: "from-purple-500 to-pink-500",
      delay: "animation-delay-600"
    },
    {
      icon: <Bell className="h-12 w-12" />,
      title: "Personalized Job Alerts",
      description: "Stay ahead of the curve with AI‑filtered job recommendations delivered straight to your inbox.",
      gradient: "from-orange-500 to-red-500",
      delay: "animation-delay-800"
    },
    {
      icon: <Mic className="h-12 w-12" />,
      title: "AI Mock Interviewer",
      description: "Practice real‑world interview questions with an AI interviewer that scores your answers and provides instant feedback.",
      gradient: "from-indigo-500 to-purple-500",
      delay: "animation-delay-1000"
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-100/40 to-purple-100/40 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-gradient-to-r from-cyan-100/30 to-blue-100/30 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-50/20 to-pink-50/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Enhanced Section Header */}
        <div className="text-center mb-24 animate-fade-in-up">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100 mb-8 hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-bold text-blue-700 tracking-wide">POWERFUL FEATURES</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-[0.9]">
            Everything You Need to{" "}
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Land Your Dream Job
              </span>
            </span>
          </h2>
          
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Our AI-powered platform streamlines your job search with intelligent tools designed for modern professionals
          </p>
        </div>
        
        {/* Enhanced Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mb-24">
          {features.map((feature, index) => (
            <div key={index} className={`animate-fade-in-up ${feature.delay}`}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                gradient={feature.gradient}
                index={index}
              />
            </div>
          ))}
        </div>
        
        {/* Enhanced Bottom CTA Section */}
        <div className="text-center animate-fade-in-up animation-delay-1200">
          <div className="relative bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-16 shadow-2xl overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-bold text-white tracking-wide">GET STARTED TODAY</span>
              </div>
              
              <h3 className="text-4xl sm:text-5xl font-black text-white mb-6 leading-tight">
                Ready to transform your career?
              </h3>
              <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Join thousands of professionals who've accelerated their job search with AI-powered tools
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button className="group relative bg-gradient-to-r from-white to-gray-100 text-gray-900 font-bold text-xl px-12 py-6 rounded-2xl hover:from-gray-100 hover:to-white hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-white/20 border-2 border-white/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                  <div className="relative z-10 flex items-center">
                    <span>Start Building Your Portfolio</span>
                    <div className="ml-3 w-8 h-8 bg-gray-900/10 rounded-full flex items-center justify-center group-hover:bg-gray-900/20 transition-all duration-300 group-hover:rotate-12">
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </button>
                
                <button className="group bg-white/10 backdrop-blur-md text-white font-semibold text-lg px-10 py-5 rounded-2xl border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center">
                    <div className="mr-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span>Watch Demo</span>
                  </div>
                </button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 mt-12 pt-8 border-t border-white/10">
                <div className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">No Credit Card Required</span>
                </div>
                <div className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">Setup in Under 5 Minutes</span>
                </div>
                <div className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium">ATS-Optimized Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 