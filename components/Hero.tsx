import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-purple-600/15"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 min-h-[85vh]">
          {/* Enhanced Logo Section */}
          <div className="flex-shrink-0 text-center lg:text-left">
            <div className="relative w-[320px] h-[320px] lg:w-[450px] lg:h-[450px] mx-auto lg:mx-0 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/5 to-blue-400/5 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-1000 animate-pulse"></div>
              <Image
                src="/images/logo.png"
                alt="GoRoFolio"
                fill
                className="object-contain drop-shadow-2xl relative z-10 transition-all duration-700 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                priority
              />
            </div>
            <div className="mt-8 flex justify-center lg:justify-start">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-full border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 group">
                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-4 animate-pulse shadow-lg shadow-emerald-400/50 group-hover:shadow-emerald-400/80"></div>
                <span className="text-base font-bold text-white tracking-wide">AI-Powered Career Platform</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Text Content Section */}
          <div className="flex-1 text-center lg:text-left max-w-4xl">
            {/* Enhanced Headline with Staggered Animation */}
            <div className="mb-10">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight">
                <span className="block mb-2 animate-fade-in-up">Build Your</span>
                <span className="block mb-2 animate-fade-in-up animation-delay-200">Personal Brand</span>
                <span className="block animate-fade-in-up animation-delay-400">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-blue-200">&</span>{" "}
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent font-black animate-gradient-x">
                    Land Your Dream Job
                  </span>
                </span>
              </h1>
              <div className="mt-6 flex items-center justify-center lg:justify-start animate-fade-in-up animation-delay-600">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                    in Minutes
                  </span>
                </div>
              </div>
            </div>
            
            {/* Enhanced Subheading */}
            <p className="text-xl sm:text-2xl lg:text-3xl text-blue-100/95 mb-12 leading-relaxed font-light max-w-4xl animate-fade-in-up animation-delay-800">
              Transform your raw resume into a polished portfolio, ATS-ready résumé, tailored cover letters, and AI-driven mock interviews.
            </p>
            
            {/* Enhanced CTA Section with Better Hierarchy */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center mb-12 animate-fade-in-up animation-delay-1000">
              {/* Primary CTA - Enhanced */}
              <Link 
                href="/login"
                className="group relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-300 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-400 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40 transform-gpu border-2 border-white/20 hover:border-white/40 active:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl animate-pulse"></div>
                <div className="relative z-10 flex items-center">
                  <span>Get Started Free</span>
                  <div className="ml-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
              
              {/* Secondary CTA - Enhanced */}
              <Link 
                href="/demo"
                className="group relative bg-white/10 backdrop-blur-md text-white font-semibold text-lg px-10 py-5 rounded-2xl border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative z-10 flex items-center">
                  <div className="mr-3 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span>Watch Demo</span>
                </div>
              </Link>
            </div>
            
            {/* Enhanced Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-fade-in-up animation-delay-1200">
              <div className="flex items-center justify-center lg:justify-start group">
                <div className="flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                  <div className="w-8 h-8 bg-emerald-400/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-emerald-400/30 transition-colors duration-300">
                    <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">No Credit Card</div>
                    <div className="text-xs text-blue-200">Required</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start group">
                <div className="flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                  <div className="w-8 h-8 bg-blue-400/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-400/30 transition-colors duration-300">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Under 5 Minutes</div>
                    <div className="text-xs text-blue-200">Portfolio Ready</div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center lg:justify-start group">
                <div className="flex items-center px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
                  <div className="w-8 h-8 bg-purple-400/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-purple-400/30 transition-colors duration-300">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">ATS-Optimized</div>
                    <div className="text-xs text-blue-200">Results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 