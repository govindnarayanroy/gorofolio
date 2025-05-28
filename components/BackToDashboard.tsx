'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackToDashboardProps {
  className?: string
  variant?: 'header' | 'button' | 'minimal'
}

export function BackToDashboard({ className = '', variant = 'header' }: BackToDashboardProps) {
  const router = useRouter()
  const baseClasses = 'flex items-center gap-2 transition-all duration-300'

  const variants = {
    header: 'text-white hover:text-blue-200 text-lg font-semibold',
    button: 'px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium',
    minimal: 'text-gray-600 hover:text-gray-900 text-sm font-medium',
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      router.push('/dashboard')
    } catch (error) {
      console.error('Navigation error:', error)
      // Fallback to window.location for production issues
      window.location.href = '/dashboard'
    }
  }

  return (
    <Link 
      href="/dashboard" 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={handleClick}
    >
      <ArrowLeft className="h-5 w-5" />
      <span>Back to Dashboard</span>
    </Link>
  )
}
