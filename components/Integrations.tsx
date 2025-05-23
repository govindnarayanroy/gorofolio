import { Github, Linkedin, Globe, Dribbble, ExternalLink, Briefcase } from "lucide-react";

export function Integrations() {
  const integrations = [
    { name: "LinkedIn", icon: <Linkedin className="h-8 w-8" />, color: "from-blue-600 to-blue-700" },
    { name: "GitHub", icon: <Github className="h-8 w-8" />, color: "from-gray-700 to-gray-900" },
    { name: "Dribbble", icon: <Dribbble className="h-8 w-8" />, color: "from-pink-500 to-pink-600" },
    { name: "Behance", icon: <Globe className="h-8 w-8" />, color: "from-blue-500 to-indigo-600" },
    { name: "Portfolio", icon: <Briefcase className="h-8 w-8" />, color: "from-purple-500 to-purple-600" },
    { name: "Custom Domain", icon: <ExternalLink className="h-8 w-8" />, color: "from-green-500 to-green-600" }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-100/20 to-purple-100/20 rounded-full blur-3xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gray-50 rounded-full border border-gray-200 mb-6">
            <span className="text-sm font-medium text-gray-700">Platform Integrations</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Connect All Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Professional Platforms
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Seamlessly sync your profiles and showcase your work across multiple platforms with one unified portfolio
          </p>
        </div>
        
        {/* Integrations Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {integrations.map((integration, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100/50"
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${integration.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative text-center">
                {/* Icon Container */}
                <div className="flex justify-center mb-4">
                  <div className={`p-3 bg-gradient-to-br ${integration.color} rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {integration.icon}
                  </div>
                </div>
                
                {/* Name */}
                <h3 className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  {integration.name}
                </h3>
              </div>
              
              {/* Hover Border Effect */}
              <div className={`absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gradient-to-r ${integration.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>
        
        {/* Feature Highlight */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-100">
            <svg className="w-5 h-5 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              One-click sync across all platforms • Real-time updates • Custom domain support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
} 