import { FeatureCard } from './FeatureCard'
import { Globe, FileText, PenTool, Bell, Mic } from 'lucide-react'

export function Features() {
  const features = [
    {
      icon: <Globe className="h-12 w-12" />,
      title: 'AI Portfolio Builder',
      description:
        'Generate a fully hosted portfolio site from your resume or LinkedIn in seconds—custom subdomain and exportable HTML included.',
      gradient: 'from-blue-500 to-cyan-500',
      delay: 'animation-delay-200',
    },
    {
      icon: <FileText className="h-12 w-12" />,
      title: 'ATS‑Ready Résumé Generator',
      description:
        'Auto‑format your résumé for applicant tracking systems with keyword analysis and real‑time optimization.',
      gradient: 'from-emerald-500 to-teal-500',
      delay: 'animation-delay-400',
    },
    {
      icon: <PenTool className="h-12 w-12" />,
      title: 'Tailored Cover Letters',
      description:
        'Write job‑specific cover letters with one click, using your profile data and the target job description.',
      gradient: 'from-purple-500 to-pink-500',
      delay: 'animation-delay-600',
    },
    {
      icon: <Bell className="h-12 w-12" />,
      title: 'Personalized Job Alerts',
      description:
        'Stay ahead of the curve with AI‑filtered job recommendations delivered straight to your inbox.',
      gradient: 'from-orange-500 to-red-500',
      delay: 'animation-delay-800',
    },
    {
      icon: <Mic className="h-12 w-12" />,
      title: 'AI Mock Interviewer',
      description:
        'Practice real‑world interview questions with an AI interviewer that scores your answers and provides instant feedback.',
      gradient: 'from-indigo-500 to-purple-500',
      delay: 'animation-delay-1000',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-gray-50 py-32">
      {/* Enhanced Background Elements */}
      <div className="animate-float absolute right-20 top-20 h-96 w-96 rounded-full bg-gradient-to-r from-blue-100/40 to-purple-100/40 blur-3xl"></div>
      <div className="animate-float animation-delay-1000 absolute bottom-20 left-20 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-cyan-100/30 to-blue-100/30 blur-3xl"></div>
      <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-gradient-to-r from-purple-50/20 to-pink-50/20 blur-3xl"></div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Enhanced Section Header */}
        <div className="animate-fade-in-up mb-24 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-blue-100 bg-gradient-to-r from-blue-50 to-purple-50 px-6 py-3 transition-transform duration-300 hover:scale-105">
            <div className="mr-3 h-2 w-2 animate-pulse rounded-full bg-blue-500"></div>
            <span className="text-sm font-bold tracking-wide text-blue-700">POWERFUL FEATURES</span>
          </div>

          <h2 className="mb-8 text-5xl font-black leading-[0.9] text-gray-900 sm:text-6xl lg:text-7xl">
            Everything You Need to{' '}
            <span className="mt-2 block">
              <span className="animate-gradient-x bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Land Your Dream Job
              </span>
            </span>
          </h2>

          <p className="mx-auto max-w-4xl text-2xl font-light leading-relaxed text-gray-600">
            Our AI-powered platform streamlines your job search with intelligent tools designed for
            modern professionals
          </p>
        </div>

        {/* Enhanced Features Grid */}
        <div className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
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
        <div className="animate-fade-in-up animation-delay-1200 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 p-16 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
            <div className="absolute left-10 top-10 h-32 w-32 animate-pulse rounded-full bg-blue-400/20 blur-2xl"></div>
            <div className="animation-delay-1000 absolute bottom-10 right-10 h-40 w-40 animate-pulse rounded-full bg-purple-400/20 blur-2xl"></div>

            <div className="relative z-10">
              <div className="mb-8 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-md">
                <div className="mr-3 h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                <span className="text-sm font-bold tracking-wide text-white">
                  GET STARTED TODAY
                </span>
              </div>

              <h3 className="mb-6 text-4xl font-black leading-tight text-white sm:text-5xl">
                Ready to transform your career?
              </h3>
              <p className="mx-auto mb-10 max-w-3xl text-xl leading-relaxed text-blue-100">
                Join thousands of professionals who've accelerated their job search with AI-powered
                tools
              </p>

              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <button className="group relative rounded-2xl border-2 border-white/20 bg-gradient-to-r from-white to-gray-100 px-12 py-6 text-xl font-bold text-gray-900 shadow-2xl transition-all duration-300 hover:scale-110 hover:from-gray-100 hover:to-white hover:shadow-white/20">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  <div className="relative z-10 flex items-center">
                    <span>Start Building Your Portfolio</span>
                    <div className="ml-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-900/10 transition-all duration-300 group-hover:rotate-12 group-hover:bg-gray-900/20">
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
                </button>

                <button className="group rounded-2xl border border-white/30 bg-white/10 px-10 py-5 text-lg font-semibold text-white backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20">
                  <div className="flex items-center">
                    <div className="mr-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-colors duration-300 group-hover:bg-white/30">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
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
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8 border-t border-white/10 pt-8">
                <div className="flex items-center text-white/80">
                  <svg
                    className="mr-2 h-5 w-5 text-emerald-400"
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
                  <span className="text-sm font-medium">No Credit Card Required</span>
                </div>
                <div className="flex items-center text-white/80">
                  <svg
                    className="mr-2 h-5 w-5 text-blue-400"
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
                  <span className="text-sm font-medium">Setup in Under 5 Minutes</span>
                </div>
                <div className="flex items-center text-white/80">
                  <svg
                    className="mr-2 h-5 w-5 text-purple-400"
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
                  <span className="text-sm font-medium">ATS-Optimized Results</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
