import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  gradient?: string;
  index?: number;
}

export function FeatureCard({ icon, title, description, gradient = "from-blue-500 to-purple-500", index = 0 }: FeatureCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 border border-gray-100/50 overflow-hidden">
      {/* Enhanced Gradient Border Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
      <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      
      <div className="relative p-10">
        {/* Enhanced Icon Container */}
        <div className="flex justify-center mb-8">
          <div className={`relative p-6 bg-gradient-to-br ${gradient} rounded-3xl group-hover:scale-110 transition-all duration-500 shadow-lg group-hover:shadow-2xl`}>
            <div className="text-white transition-all duration-500 group-hover:scale-110">
              {icon}
            </div>
            {/* Floating Gradient Effects */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 blur-xl`}></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse"></div>
          </div>
        </div>
        
        {/* Enhanced Title */}
        <h3 className="text-2xl font-black text-gray-900 mb-6 text-center group-hover:text-gray-700 transition-colors leading-tight">
          {title}
        </h3>
        
        {/* Enhanced Description */}
        <p className="text-gray-600 text-center leading-relaxed text-lg group-hover:text-gray-700 transition-colors">
          {description}
        </p>
        
        {/* Enhanced Hover Accent Elements */}
        <div className={`absolute bottom-0 left-1/2 w-0 h-1 bg-gradient-to-r ${gradient} group-hover:w-20 group-hover:left-1/2 group-hover:-translate-x-1/2 transition-all duration-500 rounded-full`}></div>
        
        {/* Floating Number Indicator */}
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg border-4 border-gray-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
          <span className={`text-sm font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-700">
          <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-br from-gray-200 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-tr from-gray-100 to-transparent rounded-full blur-xl"></div>
        </div>
      </div>
    </div>
  );
} 