import { Github, Linkedin, Globe, Dribbble, ExternalLink, Briefcase } from 'lucide-react'

export function Integrations() {
  const integrations = [
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-8 w-8" />,
      color: 'from-blue-600 to-blue-700',
      description: 'Professional networking',
      delay: 'animation-delay-200',
    },
    {
      name: 'GitHub',
      icon: <Github className="h-8 w-8" />,
      color: 'from-gray-700 to-gray-900',
      description: 'Code repositories',
      delay: 'animation-delay-400',
    },
    {
      name: 'Dribbble',
      icon: <Dribbble className="h-8 w-8" />,
      color: 'from-pink-500 to-pink-600',
      description: 'Design showcase',
      delay: 'animation-delay-600',
    },
    {
      name: 'Behance',
      icon: <Globe className="h-8 w-8" />,
      color: 'from-blue-500 to-indigo-600',
      description: 'Creative portfolio',
      delay: 'animation-delay-800',
    },
    {
      name: 'Portfolio',
      icon: <Briefcase className="h-8 w-8" />,
      color: 'from-purple-500 to-purple-600',
      description: 'Personal website',
      delay: 'animation-delay-1000',
    },
    {
      name: 'Custom Domain',
      icon: <ExternalLink className="h-8 w-8" />,
      color: 'from-green-500 to-green-600',
      description: 'Your own URL',
      delay: 'animation-delay-1200',
    },
  ]

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white py-32">
      {/* Enhanced Background Elements */}
      <div className="animate-float absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-blue-100/30 to-purple-100/30 blur-3xl"></div>
      <div className="animate-float animation-delay-1000 absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-gradient-to-r from-cyan-100/25 to-pink-100/25 blur-3xl"></div>
      <div className="absolute right-10 top-1/3 h-80 w-80 rounded-full bg-gradient-to-r from-indigo-100/20 to-purple-100/20 blur-2xl"></div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        {/* Enhanced Section Header */}
        <div className="animate-fade-in-up mb-20 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-3 transition-transform duration-300 hover:scale-105">
            <div className="mr-3 h-2 w-2 animate-pulse rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
            <span className="text-sm font-bold tracking-wide text-gray-700">
              PLATFORM INTEGRATIONS
            </span>
          </div>

          <h2 className="mb-8 text-5xl font-black leading-[0.9] text-gray-900 sm:text-6xl lg:text-7xl">
            Connect All Your{' '}
            <span className="mt-2 block">
              <span className="animate-gradient-x bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Professional Platforms
              </span>
            </span>
          </h2>

          <p className="mx-auto max-w-4xl text-2xl font-light leading-relaxed text-gray-600">
            Seamlessly sync your profiles and showcase your work across multiple platforms with one
            unified portfolio
          </p>
        </div>

        {/* Enhanced Integrations Grid */}
        <div className="mb-20 grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className={`animate-fade-in-up group relative overflow-hidden rounded-3xl border border-gray-100/50 bg-white p-8 shadow-xl transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl ${integration.delay}`}
            >
              {/* Enhanced Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${integration.color} rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50 opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>

              <div className="relative text-center">
                {/* Enhanced Icon Container */}
                <div className="mb-6 flex justify-center">
                  <div
                    className={`bg-gradient-to-br p-4 ${integration.color} relative rounded-2xl text-white shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl`}
                  >
                    <div className="relative z-10 transition-all duration-500 group-hover:scale-110">
                      {integration.icon}
                    </div>
                    {/* Floating Gradient Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${integration.color} rounded-2xl opacity-50 blur-lg transition-opacity duration-500 group-hover:opacity-80`}
                    ></div>
                  </div>
                </div>

                {/* Enhanced Name */}
                <h3 className="mb-2 text-lg font-black text-gray-900 transition-colors group-hover:text-gray-700">
                  {integration.name}
                </h3>

                {/* Description */}
                <p className="text-sm font-medium text-gray-500 transition-colors group-hover:text-gray-600">
                  {integration.description}
                </p>
              </div>

              {/* Enhanced Hover Border Effect */}
              <div
                className={`group-hover:border-gradient-to-r absolute inset-0 rounded-3xl border-2 border-transparent ${integration.color} opacity-0 transition-opacity duration-500 group-hover:opacity-30`}
              ></div>

              {/* Floating Number Indicator */}
              <div className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-100 bg-white opacity-0 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:opacity-100">
                <span
                  className={`bg-gradient-to-r text-xs font-black ${integration.color} bg-clip-text text-transparent`}
                >
                  {String(index + 1)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Feature Highlight */}
        <div className="animate-fade-in-up animation-delay-1400 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 p-12 shadow-2xl">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
            <div className="absolute left-8 top-8 h-24 w-24 animate-pulse rounded-full bg-blue-400/20 blur-2xl"></div>
            <div className="animation-delay-1000 absolute bottom-8 right-8 h-32 w-32 animate-pulse rounded-full bg-purple-400/20 blur-2xl"></div>

            <div className="relative z-10">
              <div className="mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-6 py-3 backdrop-blur-md">
                <div className="mr-3 h-2 w-2 animate-pulse rounded-full bg-emerald-400"></div>
                <span className="text-sm font-bold tracking-wide text-white">ONE-CLICK SYNC</span>
              </div>

              <h3 className="mb-4 text-3xl font-black leading-tight text-white sm:text-4xl">
                Sync Once, Showcase Everywhere
              </h3>
              <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-blue-100">
                Import your professional data from any platform and automatically generate a
                unified, beautiful portfolio that showcases all your work in one place.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6">
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
                  <span className="text-sm font-medium">Automatic Data Import</span>
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Real-time Sync</span>
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
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span className="text-sm font-medium">Secure & Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
