import Link from "next/link";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Enhanced Gradient Overlays for More Depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-purple-600/15"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/25 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-[600px] h-[600px] bg-purple-500/15 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-400/10 rounded-full blur-2xl"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24 min-h-[75vh]">
          {/* Logo Section - Enhanced */}
          <div className="flex-shrink-0 text-center lg:text-left">
            <div className="relative w-[320px] h-[320px] lg:w-[450px] lg:h-[450px] mx-auto lg:mx-0 group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/6 to-purple-400/6 rounded-full blur-xl group-hover:blur-2xl transition-all duration-700"></div>
              <Image
                src="/images/logo.png"
                alt="GoRoFolio"
                fill
                className="object-contain drop-shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
            <div className="mt-8 flex justify-center lg:justify-start">
              <div className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md rounded-full border border-white/20 shadow-2xl hover:shadow-blue-500/20 transition-all duration-300">
                <div className="w-3 h-3 bg-emerald-400 rounded-full mr-4 animate-pulse shadow-lg shadow-emerald-400/50"></div>
                <span className="text-base font-bold text-white tracking-wide">AI-Powered Career Platform</span>
              </div>
            </div>
          </div>
          
          {/* Text Content Section - Redesigned */}
          <div className="flex-1 text-center lg:text-left max-w-4xl">
            {/* Headline - Completely Redesigned */}
            <div className="mb-10">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight">
                <span className="block mb-2">Build Your</span>
                <span className="block mb-2">Personal Brand</span>
                <span className="block">
                  <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-blue-200">&</span>{" "}
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent font-black">
                    Land Your Dream Job
                  </span>
                </span>
              </h1>
              <div className="mt-6 flex items-center justify-center lg:justify-start">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-full shadow-lg">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                    in Minutes
                  </span>
                </div>
              </div>
            </div>
            
            {/* Subheading - Enhanced */}
            <p className="text-xl sm:text-2xl lg:text-3xl text-blue-100/95 mb-12 leading-relaxed font-light max-w-4xl">
              Transform your raw resume into a polished portfolio, ATS-ready résumé, tailored cover letters, and AI-driven mock interviews.
            </p>
            
            {/* Enhanced CTA Section - Redesigned */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center mb-12">
              {/* Primary CTA - Updated to link to /login */}
              <Link 
                href="/login"
                className="group relative bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-300 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-400 hover:scale-110 hover:shadow-2xl hover:shadow-blue-500/40 transform-gpu border-2 border-white/20 hover:border-white/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                <div className="relative z-10 flex items-center">
                  <span>Get Started Free</span>
                  <div className="ml-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
              
              {/* Secondary CTA - Enhanced */}
              <Link 
                href="/demo"
                className="group bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border-2 border-white/30 text-white font-bold text-xl px-12 py-6 rounded-2xl transition-all duration-300 hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 hover:border-white/50 hover:scale-105 hover:shadow-xl"
              >
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3 group-hover:bg-white/30 transition-colors duration-300">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1" />
                    </svg>
                  </div>
                  <span>Watch Demo</span>
                </div>
              </Link>
            </div>
            
            {/* Enhanced Trust Indicators - Redesigned */}
            <div className="bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center group">
                  <div className="w-12 h-12 mb-3 md:mb-0 md:mr-4 bg-gradient-to-r from-emerald-500 to-green-400 rounded-2xl flex items-center justify-center border-2 border-emerald-400/30 shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">No Credit Card</div>
                    <div className="text-blue-200/80 text-sm">Required</div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center group">
                  <div className="w-12 h-12 mb-3 md:mb-0 md:mr-4 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center border-2 border-blue-400/30 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">Under 5 Minutes</div>
                    <div className="text-blue-200/80 text-sm">Portfolio Ready</div>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center group">
                  <div className="w-12 h-12 mb-3 md:mb-0 md:mr-4 bg-gradient-to-r from-purple-500 to-pink-400 rounded-2xl flex items-center justify-center border-2 border-purple-400/30 shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-bold text-white text-lg">ATS-Optimized</div>
                    <div className="text-blue-200/80 text-sm">Results</div>
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