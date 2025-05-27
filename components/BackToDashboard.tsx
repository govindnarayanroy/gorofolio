"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface BackToDashboardProps {
  className?: string;
  variant?: "header" | "button" | "minimal";
}

export function BackToDashboard({ 
  className = "", 
  variant = "header" 
}: BackToDashboardProps) {
  const baseClasses = "flex items-center gap-2 transition-all duration-300";
  
  const variants = {
    header: "text-white hover:text-blue-200 text-lg font-semibold",
    button: "px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium",
    minimal: "text-gray-600 hover:text-gray-900 text-sm font-medium"
  };

  return (
    <Link 
      href="/dashboard" 
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back to Dashboard</span>
    </Link>
  );
} 