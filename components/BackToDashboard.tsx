'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface BackToDashboardProps {
  className?: string
  variant?: 'header' | 'button' | 'minimal'
  isInterviewActive?: boolean
  onConfirmExit?: () => void
}

export function BackToDashboard({ 
  className = '', 
  variant = 'header',
  isInterviewActive = false,
  onConfirmExit
}: BackToDashboardProps) {
  const router = useRouter()
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const baseClasses = 'flex items-center gap-2 transition-all duration-300'

  const variants = {
    header: 'text-white hover:text-blue-200 text-lg font-semibold',
    button: 'px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium',
    minimal: 'text-gray-600 hover:text-gray-900 text-sm font-medium',
  }

  const handleNavigation = () => {
    console.log('🔄 Navigating to dashboard...')
    // Use window.location instead of router.push for more reliable navigation
    window.location.href = '/dashboard'
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // If interview is active, show confirmation dialog
    if (isInterviewActive) {
      setShowConfirmDialog(true)
      return
    }
    
    // Otherwise, navigate directly
    handleNavigation()
  }

  const handleConfirmExit = async () => {
    setShowConfirmDialog(false)
    
    // Call the optional callback for cleanup
    if (onConfirmExit) {
      await onConfirmExit()
    }
    
    // Navigate to dashboard
    handleNavigation()
  }

  const handleCancelExit = () => {
    setShowConfirmDialog(false)
  }

  return (
    <>
      <button 
        className={`${baseClasses} ${variants[variant]} ${className}`}
        onClick={handleClick}
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Dashboard</span>
      </button>

      {/* Custom Confirmation Modal */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancelExit}
          />
          
          {/* Modal */}
          <div className="relative z-10 w-full max-w-md mx-4">
            <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-700">
                <h2 className="text-xl font-semibold text-red-400">
                  Abort Interview?
                </h2>
                <button
                  onClick={handleCancelExit}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-slate-300 leading-relaxed">
                  You are currently in an active interview session. If you leave now, your progress will be lost and the interview will be terminated.
                </p>
                <p className="text-slate-300 leading-relaxed mt-4">
                  Are you sure you want to abort the interview and return to the dashboard?
                </p>
              </div>
              
              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
                <Button
                  variant="outline"
                  onClick={handleCancelExit}
                  className="bg-slate-700 text-white hover:bg-slate-600 border-slate-600"
                >
                  Continue Interview
                </Button>
                <Button
                  onClick={handleConfirmExit}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Yes, Abort Interview
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
