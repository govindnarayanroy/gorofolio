import { Github, Linkedin, Globe, Dribbble, ExternalLink, Briefcase } from "lucide-react";

export function Integrations() {
  const integrations = [
    { 
      name: "LinkedIn", 
      icon: <Linkedin className="h-8 w-8" />, 
      color: "from-blue-600 to-blue-700",
      description: "Professional networking",
      delay: "animation-delay-200"
    },
    { 
      name: "GitHub", 
      icon: <Github className="h-8 w-8" />, 
      color: "from-gray-700 to-gray-900",
      description: "Code repositories",
      delay: "animation-delay-400"
    },
    { 
      name: "Dribbble", 
      icon: <Dribbble className="h-8 w-8" />, 
      color: "from-pink-500 to-pink-600",
      description: "Design showcase",
      delay: "animation-delay-600"
    },
    { 
      name: "Behance", 
      icon: <Globe className="h-8 w-8" />, 
      color: "from-blue-500 to-indigo-600",
      description: "Creative portfolio",
      delay: "animation-delay-800"
    },
    { 
      name: "Portfolio", 
      icon: <Briefcase className="h-8 w-8" />, 
      color: "from-purple-500 to-purple-600",
      description: "Personal website",
      delay: "animation-delay-1000"
    },
    { 
      name: "Custom Domain", 
      icon: <ExternalLink className="h-8 w-8" />, 
      color: "from-green-500 to-green-600",
      description: "Your own URL",
      delay: "animation-delay-1200"
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white via-gray-50 to-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/30 to-purple-100/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-100/25 to-pink-100/25 rounded-full blur-3xl animate-float animation-delay-1000"></div>
      <div className="absolute top-1/3 right-10 w-80 h-80 bg-gradient-to-r from-indigo-100/20 to-purple-100/20 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Enhanced Section Header */}
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-full border border-gray-200 mb-8 hover:scale-105 transition-transform duration-300">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-bold text-gray-700 tracking-wide">PLATFORM INTEGRATIONS</span>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-[0.9]">
            Connect All Your{" "}
            <span className="block mt-2">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient-x">
                Professional Platforms
              </span>
            </span>
          </h2>
          
          <p className="text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-light">
            Seamlessly sync your profiles and showcase your work across multiple platforms with one unified portfolio
          </p>
        </div>
        
        {/* Enhanced Integrations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-20">
          {integrations.map((integration, index) => (
            <div 
              key={index}
              className={`group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-gray-100/50 overflow-hidden animate-fade-in-up ${integration.delay}`}
            >
              {/* Enhanced Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${integration.color} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              
              <div className="relative text-center">
                {/* Enhanced Icon Container */}
                <div className="flex justify-center mb-6">
                  <div className={`p-4 bg-gradient-to-br ${integration.color} rounded-2xl text-white group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-2xl relative`}>
                    <div className="relative z-10 transition-all duration-500 group-hover:scale-110">
                      {integration.icon}
                    </div>
                    {/* Floating Gradient Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${integration.color} rounded-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 blur-lg`}></div>
                  </div>
                </div>
                
                {/* Enhanced Name */}
                <h3 className="text-lg font-black text-gray-900 group-hover:text-gray-700 transition-colors mb-2">
                  {integration.name}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors font-medium">
                  {integration.description}
                </p>
              </div>
              
              {/* Enhanced Hover Border Effect */}
              <div className={`absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r ${integration.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
              
              {/* Floating Number Indicator */}
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                <span className={`text-xs font-black bg-gradient-to-r ${integration.color} bg-clip-text text-transparent`}>
                  {String(index + 1)}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Enhanced Feature Highlight */}
        <div className="text-center animate-fade-in-up animation-delay-1400">
          <div className="relative bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-12 shadow-2xl overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
            <div className="absolute top-8 left-8 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute bottom-8 right-8 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl animate-pulse animation-delay-1000"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-3 animate-pulse"></div>
                <span className="text-sm font-bold text-white tracking-wide">ONE-CLICK SYNC</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                Sync Once, Showcase Everywhere
              </h3>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Import your professional data from any platform and automatically generate a unified, beautiful portfolio that showcases all your work in one place.
              </p>
              
              <div className="flex flex-wrap justify-center items-center gap-6">
                <div className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-emerald-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium">Automatic Data Import</span>
                </div>
                <div className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-sm font-medium">Real-time Sync</span>
                </div>
                <div className="flex items-center text-white/80">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="text-sm font-medium">Secure & Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 