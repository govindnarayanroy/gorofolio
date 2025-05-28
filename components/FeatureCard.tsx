import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  gradient?: string
  index?: number
}

export function FeatureCard({
  icon,
  title,
  description,
  gradient = 'from-blue-500 to-purple-500',
  index = 0,
}: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-gray-100/50 bg-white shadow-xl transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl">
      {/* Enhanced Gradient Border Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-10`}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50 opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>

      <div className="relative p-10">
        {/* Enhanced Icon Container */}
        <div className="mb-8 flex justify-center">
          <div
            className={`relative bg-gradient-to-br p-6 ${gradient} rounded-3xl shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl`}
          >
            <div className="text-white transition-all duration-500 group-hover:scale-110">
              {icon}
            </div>
            {/* Floating Gradient Effects */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl opacity-50 blur-xl transition-opacity duration-500 group-hover:opacity-80`}
            ></div>
            <div className="absolute -inset-2 animate-pulse rounded-3xl bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
          </div>
        </div>

        {/* Enhanced Title */}
        <h3 className="mb-6 text-center text-2xl font-black leading-tight text-gray-900 transition-colors group-hover:text-gray-700">
          {title}
        </h3>

        {/* Enhanced Description */}
        <p className="text-center text-lg leading-relaxed text-gray-600 transition-colors group-hover:text-gray-700">
          {description}
        </p>

        {/* Enhanced Hover Accent Elements */}
        <div
          className={`absolute bottom-0 left-1/2 h-1 w-0 bg-gradient-to-r ${gradient} rounded-full transition-all duration-500 group-hover:left-1/2 group-hover:w-20 group-hover:-translate-x-1/2`}
        ></div>

        {/* Floating Number Indicator */}
        <div className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full border-4 border-gray-50 bg-white opacity-0 shadow-lg transition-all duration-500 group-hover:scale-110 group-hover:opacity-100">
          <span
            className={`bg-gradient-to-r text-sm font-black ${gradient} bg-clip-text text-transparent`}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-5">
          <div className="absolute right-4 top-4 h-32 w-32 rounded-full bg-gradient-to-br from-gray-200 to-transparent blur-2xl"></div>
          <div className="absolute bottom-4 left-4 h-24 w-24 rounded-full bg-gradient-to-tr from-gray-100 to-transparent blur-xl"></div>
        </div>
      </div>
    </div>
  )
}
