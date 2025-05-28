import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/15 via-transparent to-purple-600/15"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent"></div>
      <div className="absolute left-20 top-20 h-96 w-96 animate-pulse rounded-full bg-blue-500/25 blur-3xl"></div>
      <div className="absolute bottom-20 right-20 h-[600px] w-[600px] animate-pulse rounded-full bg-purple-500/15 blur-3xl delay-1000"></div>
      <div className="absolute left-1/3 top-1/3 h-80 w-80 animate-pulse rounded-full bg-indigo-400/10 blur-2xl delay-500"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex min-h-[85vh] flex-col items-center justify-between gap-16 lg:flex-row lg:gap-24">
          {/* Enhanced Logo Section */}
          <div className="flex-shrink-0 text-center lg:text-left">
            <div className="group relative mx-auto h-[320px] w-[320px] lg:mx-0 lg:h-[450px] lg:w-[450px]">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-xl transition-all duration-700 group-hover:scale-110 group-hover:blur-2xl"></div>
              <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-cyan-400/5 to-blue-400/5 blur-2xl transition-all duration-1000 group-hover:blur-3xl"></div>
              <Image
                src="/images/logo.png"
                alt="GoRoFolio"
                fill
                className="relative z-10 object-contain drop-shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]"
                priority
              />
            </div>
            <div className="mt-8 flex justify-center lg:justify-start">
              <div className="group inline-flex items-center rounded-full border border-white/20 bg-gradient-to-r from-white/10 to-white/5 px-8 py-4 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-blue-500/20">
                <div className="mr-4 h-3 w-3 animate-pulse rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 group-hover:shadow-emerald-400/80"></div>
                <span className="text-base font-bold tracking-wide text-white">
                  AI-Powered Career Platform
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Text Content Section */}
          <div className="max-w-4xl flex-1 text-center lg:text-left">
            {/* Enhanced Headline with Staggered Animation */}
            <div className="mb-10">
              <h1 className="text-4xl font-black leading-[0.9] tracking-tight text-white sm:text-5xl lg:text-7xl">
                <span className="animate-fade-in-up mb-2 block">Build Your</span>
                <span className="animate-fade-in-up animation-delay-200 mb-2 block">
                  Personal Brand
                </span>
                <span className="animate-fade-in-up animation-delay-400 block">
                  <span className="text-3xl font-light text-blue-200 sm:text-4xl lg:text-5xl">
                    &
                  </span>{' '}
                  <span className="animate-gradient-x bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text font-black text-transparent">
                    Land Your Dream Job
                  </span>
                </span>
              </h1>
              <div className="animate-fade-in-up animation-delay-600 mt-6 flex items-center justify-center lg:justify-start">
                <div className="rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  <span className="text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
                    in Minutes
                  </span>
                </div>
              </div>
            </div>

            {/* Enhanced Subheading */}
            <p className="animate-fade-in-up animation-delay-800 mb-12 max-w-4xl text-xl font-light leading-relaxed text-blue-100/95 sm:text-2xl lg:text-3xl">
              Transform your raw resume into a polished portfolio, ATS-ready résumé, tailored cover
              letters, and AI-driven mock interviews.
            </p>

            {/* Enhanced CTA Section with Better Hierarchy */}
            <div className="animate-fade-in-up animation-delay-1000 mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row lg:justify-start">
              {/* Primary CTA - Enhanced */}
              <Link
                href="/login"
                className="group relative transform-gpu rounded-2xl border-2 border-white/20 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-12 py-6 text-xl font-bold text-white transition-all duration-300 hover:scale-110 hover:border-white/40 hover:from-blue-500 hover:via-cyan-400 hover:to-blue-400 hover:shadow-2xl hover:shadow-blue-500/40 active:scale-105"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                <div className="absolute inset-0 animate-pulse rounded-2xl bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                <div className="relative z-10 flex items-center">
                  <span>Get Started Free</span>
                  <div className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 transition-all duration-300 group-hover:rotate-12 group-hover:bg-white/30">
                    <svg
                      className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                </div>
              </Link>

              {/* Secondary CTA - Enhanced */}
              <Link
                href="/demo"
                className="group relative rounded-2xl border border-white/30 bg-white/10 px-10 py-5 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 hover:shadow-xl"
              >
                <div className="relative z-10 flex items-center">
                  <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-colors duration-300 group-hover:bg-white/30">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span>Watch Demo</span>
                </div>
              </Link>
            </div>

            {/* Enhanced Trust Indicators */}
            <div className="animate-fade-in-up animation-delay-1200 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="group flex items-center justify-center lg:justify-start">
                <div className="flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 group-hover:scale-105">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400/20 transition-colors duration-300 group-hover:bg-emerald-400/30">
                    <svg
                      className="h-4 w-4 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">No Credit Card</div>
                    <div className="text-xs text-blue-200">Required</div>
                  </div>
                </div>
              </div>

              <div className="group flex items-center justify-center lg:justify-start">
                <div className="flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 group-hover:scale-105">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-400/20 transition-colors duration-300 group-hover:bg-blue-400/30">
                    <svg
                      className="h-4 w-4 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Under 5 Minutes</div>
                    <div className="text-xs text-blue-200">Portfolio Ready</div>
                  </div>
                </div>
              </div>

              <div className="group flex items-center justify-center lg:justify-start">
                <div className="flex items-center rounded-full border border-white/10 bg-white/5 px-6 py-3 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 group-hover:scale-105">
                  <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-purple-400/20 transition-colors duration-300 group-hover:bg-purple-400/30">
                    <svg
                      className="h-4 w-4 text-purple-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
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
  )
}
